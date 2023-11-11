import type { WebhookEvent } from '@octokit/webhooks-types';
import { EventHandler, Events } from './events';
import * as events from './events';
import { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';

const DISCORD_URL = 'https://discord.com';
const DISCORD_API_URL = `${DISCORD_URL}/api`;
const DISCORD_WEBHOOKS_URL = `${DISCORD_API_URL}/webhooks`;
const DISCORD_WEBHOOK_URL = (id: string, token: string, threadId?: string, wait?: boolean) => {
	const url = new URL(`${DISCORD_WEBHOOKS_URL}/${id}/${token}`);
	if (threadId) url.searchParams.set('thread_id', threadId);
	if (wait) url.searchParams.set('wait', 'true');

	return url.toString();
};

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const requestUrl = new URL(request.url);

		let webhook: { id: string; token: string; threadId?: string } | undefined;

		// Get the webhook ID and token from the URL
		const path = requestUrl.pathname.split('/');

		path.shift();

		if (path.length !== 2) return new Response('Invalid path: path should be webhookId/webhookToken', { status: 400 });

		webhook = {
			id: path[0],
			token: path[1],
		};

		if (requestUrl.searchParams.has('thread_id')) webhook.threadId = requestUrl.searchParams.get('thread_id')!;

		// Get the event name and payload
		const eventName = request.headers.get('X-GitHub-Event');
		let eventPayload: WebhookEvent;
		try {
			eventPayload = await request.json();
		} catch (e) {
			return new Response('Invalid Payload', { status: 400 });
		}
		if (!eventName) return new Response('Missing event name', { status: 400 });

		// Get the event handler
		const eventMod: EventHandler | undefined = (events as Events)[eventName];
		if (!eventMod) return new Response('Event not implemented', { status: 200 });

		const { default: generateEmbed } = eventMod;

		// Generate the embed
		const embed = await generateEmbed(eventPayload, env);

		if (!embed) return new Response('No embed generated', { status: 200 });

		const body: RESTPostAPIWebhookWithTokenJSONBody = {
			embeds: [embed],
		};

		const webhookUrl = DISCORD_WEBHOOK_URL(webhook.id, webhook.token, webhook.threadId, true);

		const res = await fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		// For now, reply with the embed
		return new Response(res.body, { status: res.status });
	},
};
