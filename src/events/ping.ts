import { PingEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '..';
import { withUserAuthor } from '../lib/embed';
import { GeneratorResult } from '.';

export default function generate(event: PingEvent, env: Env): GeneratorResult | undefined {
	let embed: APIEmbed = {
		title: `Pong!`,
	};

	if (event.sender) embed = withUserAuthor(embed, event.sender);
	return { embeds: [embed] };
}
