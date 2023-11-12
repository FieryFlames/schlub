import { PackageEvent } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '..';
import { withUserAuthor } from '../lib/embed';
import { Colors } from '../constants';

export default function generateEmbed(event: PackageEvent, env: Env): APIEmbed | undefined {
	const { package: pkg } = event;

	const embed = withUserAuthor({
		url: pkg.html_url,
		color: Colors.OPEN,
	}, event.sender);

	switch (event.action) {
		case "published":
			embed.title = `Published ${pkg.name}`
			break
		case "updated":
			embed.title = `Updated ${pkg.name}`
			break
	}

	return embed;
}
