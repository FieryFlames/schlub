export const DISCORD_URL = 'https://discord.com';

export const DISCORD_API_URL = `${DISCORD_URL}/api`;

export const DISCORD_WEBHOOKS_URL = `${DISCORD_API_URL}/webhooks`;
export const DISCORD_WEBHOOK_URL = (id: string, token: string, threadId?: string, wait?: boolean) => {
	const url = new URL(`${DISCORD_WEBHOOKS_URL}/${id}/${token}`);
	if (threadId) url.searchParams.set('thread_id', threadId);
	if (wait) url.searchParams.set('wait', 'true');

	return url.toString();
};
