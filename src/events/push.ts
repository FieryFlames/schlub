import { Commit, Committer, PushEvent, Repository } from "@octokit/webhooks-types";
import { APIEmbed } from "discord-api-types/v10";
import { Env } from "..";
import { withUserAuthor } from "../utils/embed";

const GITHUB_URL = 'https://github.com'
const GITHUB_USER_URL = (username: string) => `${GITHUB_URL}/${username}`

function generateCommiterString(commiter: Committer): string {
	if (commiter.username) return `[${commiter.username}](${GITHUB_USER_URL(commiter.username)})`
	else return `${commiter.name}`
}

function generateCommitString(commit: Commit, repository: Repository): string {
	return `\`${commit.id.slice(0, 7)}\` "${commit.message}" by ${generateCommiterString(commit.committer)}`
}

function generateCommitsString(commits: Commit[], repository: Repository): string {
	return commits.map(commit => generateCommitString(commit, repository)).join('\n')
}

export default function generateEmbed(event: PushEvent, env: Env): APIEmbed | undefined {
	const embed = withUserAuthor({
		title: `Pushed ${event.commits.length} commits to ${event.repository.full_name}`,
		url: event.compare,
		description: generateCommitsString(event.commits, event.repository),
		footer: {
			text: event.ref
		}
	}, event.sender)

	return embed
}
