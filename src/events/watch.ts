import { StarEvent, WatchEvent } from '@octokit/webhooks-types';
import { Env } from '..';
import { withUserAuthor } from '../lib/embed';
import { Colors } from '../constants';
import pluralize from '../lib/utils/pluralize';
import { GeneratorResult } from '.';

const WATCH_COOLDOWN = 60 * 15; // 15 minutes

const WATCHED_AT_KEY = (hookId: string, repoId: number, userId: number) => `${hookId}_${repoId}_${userId}`;

export default async function generate(event: WatchEvent, env: Env, hookId: string): Promise<GeneratorResult | undefined> {
	if (event.action !== 'started') return undefined;

	const hasCooldown = await env.WATCHES.get(WATCHED_AT_KEY(hookId, event.repository.id, event.sender.id));

	if (hasCooldown) return undefined;

	await env.WATCHES.put(WATCHED_AT_KEY(hookId, event.repository.id, event.sender.id), "", { expirationTtl: WATCH_COOLDOWN });

	const embed = withUserAuthor(
		{
			title: `Started watching ${event.repository.full_name}`,
			url: `${event.repository.html_url}/watchers`,
			footer: {
				text: pluralize(event.repository.watchers_count, 'user watching', 'users watching'),
			},
			color: Colors.DRAFT,
		},
		event.sender
	);

	return { embeds: [embed] };
}
