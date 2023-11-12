# Schlub

A better GitHub webhook for Discord.

Discord's built-in GitHub webhook support (accessible by appending `/github` to a webhook URL) covers [the basics](https://github.com/discord/discord-api-docs/issues/6203#issuecomment-1608151265), but the embeds look basic, [they have no plans to add new events](https://github.com/discord/discord-api-docs/issues/6203#issuecomment-1650544855), and lack anti-spam measures for events such as `star` and `watch`.

Schlub aims to support more events, provide more information, and prevent spam.

## Usage

1. Create a webhook in your Discord server.
2. Copy the webhook URL.
3. Change the URL's domain from `discord.com` to `schlub.fieryflames.workers.dev`.
4. Use the new URL in your GitHub repository's webhook settings.
5. Set the webhook's content type to `application/json`.
6. Done! if this is a new webhook, you should see a "Pong!" message from the webhook.
