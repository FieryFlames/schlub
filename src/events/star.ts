import { StarEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '..';
import { withUserAuthor } from '../lib/embed';
import { Colors } from '../constants';

export default function generateEmbed(event: StarEvent, env: Env): APIEmbed | undefined {
	if (event.action !== 'created') return undefined;

	// TODO: Implement anti star spam

	const embed = withUserAuthor(
		{
			title: `Starred ${event.repository.full_name}`,
			url: `${event.repository.html_url}/stargazers`,
			footer: {
				text: `${event.repository.stargazers_count} ${event.repository.stargazers_count === 1 ? 'star' : 'stars'}`,
			},
			color: Colors.STAR,
		},
		event.sender
	);

	return embed;
}
