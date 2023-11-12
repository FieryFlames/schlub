import { IssuesClosedEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '../..';
import { withUserAuthor } from '../../lib/embed';
import { Colors } from '../../constants';

export default function generateEmbed(event: IssuesClosedEvent, env: Env): APIEmbed | undefined {
	const embed = withUserAuthor({
		title: `Closed issue ${event.repository.full_name}#${event.issue.number}: ${event.issue.title}`,
		url: event.issue.html_url,
		color: Colors.CLOSED,
	}, event.sender)

	return embed;
}
