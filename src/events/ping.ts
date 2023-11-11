import { PingEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '..';
import { withUserAuthor } from '../utils/embed';

export default function generateEmbed(event: PingEvent, env: Env): APIEmbed | undefined {
	let embed: APIEmbed = {
		title: `Pong!`,
	};

	if (event.sender) embed = withUserAuthor(embed, event.sender);
	return embed;
}
