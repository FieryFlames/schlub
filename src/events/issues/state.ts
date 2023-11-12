import { Issue, IssuesClosedEvent, IssuesEvent, IssuesOpenedEvent, IssuesReopenedEvent, Repository } from '@octokit/webhooks-types';
import { APIEmbed } from 'discord-api-types/v10';
import { Env } from '../..';
import { withUserAuthor } from '../../lib/embed';
import { Colors } from '../../constants';

type IssueState = "completed" | "not_planned" | "reopened" | null;

type ParsedIssueState = Exclude<IssueState | "opened", null>;

const STATE_COLOR_MAP: Record<ParsedIssueState, number> = {
	opened: Colors.OPEN,
	reopened: Colors.OPEN,
	completed: Colors.MERGED,
	not_planned: Colors.DRAFT,
}
function getStateActionText(state: ParsedIssueState): string {
	switch (state) {
		case "opened":
			return "Opened";
		case "reopened":
			return "Reopened";
		case "completed":
			return "Closed as completed";
		case "not_planned":
			return "Closed as not planned";
	}
}

function getIssueText(issue: Issue, repository: Repository): string {
	return `${repository.full_name}#${issue.number}`
}

function getActionOnIssueText(repository: Repository, issue: Issue, state: ParsedIssueState): string {
	const issueText = getIssueText(issue, repository);
	switch (state) {
		case "opened":
			return `Opened issue ${issueText} (${issue.title})`;
		case "reopened":
			return `Reopened issue ${issueText} (${issue.title})`;
		case "completed":
			return `Closed issue ${issueText} (${issue.title}) as completed`;
		case "not_planned":
			return `Closed issue ${issueText} (${issue.title}) as not planned`;
	}
}

function generateTitle(event: IssuesEvent, state: ParsedIssueState): string {
	const issueWithAction = getActionOnIssueText(event.repository, event.issue, state);
	return issueWithAction;
}

function getStateColor(state: ParsedIssueState): number {
	return STATE_COLOR_MAP[state];
}

export default function generateEmbed(event: IssuesOpenedEvent | IssuesReopenedEvent | IssuesClosedEvent, env: Env): APIEmbed | undefined {
	const state: ParsedIssueState = (event.issue.state_reason as IssueState) ?? (event.action === "opened" ? "opened" : "completed");

	const embed = withUserAuthor({
		title: generateTitle(event, state),
		url: event.issue.html_url,
		color: getStateColor(state),
	}, event.sender)

	if (state === "opened" && event.issue.body) embed.description = event.issue.body;

	return embed;
}
