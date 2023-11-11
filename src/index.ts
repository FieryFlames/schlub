import type { WebhookEvent } from '@octokit/webhooks-types';
import { EventHandler, Events } from './events';
import * as events from './events';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Get the event name and payload
		const eventName = request.headers.get('X-GitHub-Event');
		let eventPayload: WebhookEvent
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

		// For now, reply with the embed. In the future the embed would be sent to Discord.
		return new Response(JSON.stringify(embed), { status: 200 })
	},
};
