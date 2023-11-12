import { IssuesOpenedEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '../..';
import { withUserAuthor } from '../../lib/embed';
import { Colors } from '../../constants';

export default function generateEmbed(event: IssuesOpenedEvent, env: Env): APIEmbed | undefined {
	const embed = withUserAuthor({
		title: `Opened issue ${event.repository.full_name}#${event.issue.number}: ${event.issue.title}`,
		url: event.issue.html_url,
		color: Colors.OPEN,
	}, event.sender)
	if (event.issue.body) embed.description = event.issue.body;

	return embed;
}
