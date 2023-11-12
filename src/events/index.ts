import { WebhookEvent, WebhookEventMap } from '@octokit/webhooks-types';
import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent, APIMessageComponent } from 'discord-api-types/v10';
import { Env } from '..';

export interface GeneratorResult {
	content?: string,
	embeds?: APIEmbed[],
	components?: APIActionRowComponent<APIMessageActionRowComponent>[]
}

export type EmbedGenerator<K extends WebhookEvent> = (
	event: K,
	env: Env,
	hookId: string
) => GeneratorResult | undefined | Promise<GeneratorResult | undefined>;

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
