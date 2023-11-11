import { StarEvent } from "@octokit/webhooks-types";
import { APIEmbed } from "discord-api-types/v10";
import { Env } from "..";
import { withUserAuthor } from "../utils/embed";

export default function generateEmbed(event: StarEvent, env: Env): APIEmbed | undefined {
	return withUserAuthor({}, event.sender)
}
