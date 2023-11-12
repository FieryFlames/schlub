import { ForkEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '..';
import { withUserAuthor } from '../lib/embed';
import pluralize from '../lib/utils/pluralize';
import { GeneratorResult } from '.';

export default function generateEmbed(event: ForkEvent, env: Env): GeneratorResult | undefined {
	const embed = withUserAuthor({
		title: `Forked ${event.repository.full_name} to ${event.forkee.full_name}`,
		url: event.forkee.html_url,
		footer: {
			text: pluralize(event.repository.forks_count, "fork", "forks"),
		},
	}, event.sender)
	return { embeds: [embed] };
}
