import { WebhookEvent } from "@octokit/webhooks-types";
import { APIEmbed } from "discord-api-types/v10";
import { Env } from "..";
export * as star from './star';

type SyncEmbedGenerator = (event: WebhookEvent, env: Env) => APIEmbed | undefined
type AsyncEmbedGenerator = (event: WebhookEvent, env: Env) => Promise<APIEmbed | undefined>

export type EmbedGenerator = SyncEmbedGenerator | AsyncEmbedGenerator;
export type Events = Record<string, EventHandler | undefined>

export interface EventHandler {
	default: EmbedGenerator;
}
