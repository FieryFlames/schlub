import type { WebhookEventMap, WebhookEventName } from '@octokit/webhooks-types';
import events, { EmbedGenerator } from './events';
import { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';
import { DISCORD_WEBHOOK_URL } from './lib/discord';

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
		const eventName = request.headers.get('X-GitHub-Event') as WebhookEventName;
		if (!eventName) return new Response('Missing event name', { status: 400 });
		let eventPayload: WebhookEventMap[WebhookEventName];
		try {
			eventPayload = await request.json();
		} catch (e) {
			return new Response('Invalid Payload', { status: 400 });
		}

		// FIXME: TypeScript needs the type assertion here, but it should be able to infer the type
		// Get the event embed generator
		const generateEmbed = events[eventName] as EmbedGenerator<WebhookEventMap[WebhookEventName]> | undefined;
		if (!generateEmbed) return new Response('Event not implemented', { status: 200 });

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
