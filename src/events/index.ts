import { WebhookEvent, WebhookEventMap, WebhookEventName } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '..';

export type EmbedGenerator<K extends WebhookEvent> = (
	event: K,
	env: Env,
	hookId: string
) => APIEmbed | undefined | Promise<APIEmbed | undefined>;

export type Events = {
	[K in keyof WebhookEventMap]?: EmbedGenerator<WebhookEventMap[K]>;
};

import ping from './ping';
import push from './push';
import star from './star';
import issues from './issues';
import fork from './fork';
import pkg from './package';

export default {
	ping,
	push,
	star,
	issues,
	fork,
	package: pkg,
} as Events;
