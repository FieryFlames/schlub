import { User } from '@octokit/webhooks-types';
import type { APIEmbed } from 'discord-api-types/v10';

const BASE_EMBED: APIEmbed = {};

export function withBaseEmbed(embed: APIEmbed): APIEmbed {
	return {
		...BASE_EMBED,
		...embed,
	};
}
export function withUserAuthor(embed: APIEmbed, user: User): APIEmbed {
	return {
		...embed,
		author: {
			name: user.login,
			icon_url: user.avatar_url,
			url: user.html_url,
		},
	};
}
