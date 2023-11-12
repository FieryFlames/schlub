import { PackageEvent } from '@octokit/webhooks-types';
import { Env } from '..';
import { withUserAuthor } from '../lib/embed';
import { Colors } from '../constants';
import { GeneratorResult } from '.';

export default function generate(event: PackageEvent, env: Env): GeneratorResult | undefined {
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

	return { embeds: [embed] };
}
