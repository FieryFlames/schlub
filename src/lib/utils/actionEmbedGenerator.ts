import { RepositoryDispatchEvent, WebhookEvent, WebhookEventMap, WebhookEventName } from '@octokit/webhooks-types';
import { EmbedGenerator } from '../../events';
import { Env } from '../..';

type WebhookEventsWithAction = Exclude<Extract<WebhookEvent, { action: string }>, RepositoryDispatchEvent>;

type WebhookActionToGenerator<T extends WebhookEventsWithAction> = {
	[K in T['action']]: EmbedGenerator<Extract<T, { action: K }>>;
};

export default function actionEmbedGenerator<T extends WebhookEventsWithAction>(
	actionEmbedGenerators: Partial<WebhookActionToGenerator<T>>
) {
	return async function (event: T, env: Env, hookId: string) {
		const generator = (actionEmbedGenerators as any)[event.action];
		if (!generator) return undefined;
		return generator(event, env, hookId) as ReturnType<EmbedGenerator<T>>;
	};
}
