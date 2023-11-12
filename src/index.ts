import type { WebhookEventMap, WebhookEventName } from '@octokit/webhooks-types';
import events, { EmbedGenerator } from './events';
import { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';
import { DISCORD_WEBHOOK_URL } from './lib/discord';

export interface Env {
	STARS: KVNamespace;
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

		const hookId = request.headers.get('X-GitHub-Hook-ID');
		if (!hookId) return new Response('Missing X-GitHub-Hook-ID', { status: 400 });

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
		const generate = events[eventName] as EmbedGenerator<WebhookEventMap[WebhookEventName]> | undefined;
		if (!generate) return new Response('Event not implemented', { status: 200 });

		// Generate the embed
		const result = await generate(eventPayload, env, hookId);

		if (!result) return new Response('No result generated', { status: 200 });

		const body: RESTPostAPIWebhookWithTokenJSONBody = {
			content: result?.content,
			embeds: result?.embeds,
			components: result?.components,
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
