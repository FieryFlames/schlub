import { StarEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '..';
import { withUserAuthor } from '../lib/embed';
import { Colors } from '../constants';
import pluralize from '../lib/utils/pluralize';

const STAR_COOLDOWN = 60 * 15; // 15 minutes

const STARRED_AT_KEY = (hookId: string, repoId: number, userId: number) => `${hookId}_${repoId}_${userId}`;

export default async function generateEmbed(event: StarEvent, env: Env, hookId: string): Promise<APIEmbed | undefined> {
	if (event.action !== 'created') return undefined;

	const starredAt = await env.STARS.get(`${hookId}_${event.repository.id}_${event.sender.id}`);

	if (starredAt) return undefined;

	await env.STARS.put(STARRED_AT_KEY(hookId, event.repository.id, event.sender.id), event.starred_at, { expirationTtl: STAR_COOLDOWN });

	const embed = withUserAuthor(
		{
			title: `Starred ${event.repository.full_name}`,
			url: `${event.repository.html_url}/stargazers`,
			footer: {
				text: pluralize(event.repository.stargazers_count, 'star', 'stars'),
			},
			color: Colors.STAR,
		},
		event.sender
	);

	return embed;
}
