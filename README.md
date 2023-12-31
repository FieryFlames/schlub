# Schlub

A better GitHub webhook for Discord.

Discord's built-in GitHub webhook support (accessible by appending `/github` to a webhook URL) covers [the basics](https://github.com/discord/discord-api-docs/issues/6203#issuecomment-1608151265), but the embeds look basic, [they have no plans to add new events](https://github.com/discord/discord-api-docs/issues/6203#issuecomment-1650544855), and lack anti-spam measures for events such as `star` and `watch`.

Schlub aims to support more events, provide more information, and prevent spam.

## Usage

1. Create a webhook in your Discord server.
2. Copy the webhook URL.
3. Change the URL's domain from `discord.com` to `schlub.fieryflames.dev`.
4. Remove `api/webhooks/` from the URL path.
5. At this point your URL should look like `https://schlub.fieryflames.dev/:webhookId/:webhookToken` (webhookId will be a load of numbers, webhookToken will be a load of letters and numbers).
6. Use the new URL in your GitHub repository's webhook settings.
7. Set the webhook's content type to `application/json`.
8. If not already enabled, enable SSL verification.
9. Done! if this is a new webhook, you should see a "Pong!" message from the webhook.

## Feature Parity

- [ ] `create`
- [ ] `delete`
- [x] `fork`
- [x] `issues`*
- [ ] `issue_comment`
- [x] `pull_request`*
- [ ] `pull_request_review`
- [ ] `pull_request_review_comment`
- [ ] `member`
- [ ] `public`
- [x] `push`*
- [ ] `commit_comment`
- [ ] `release`
- [x] `watch`
- [x] `star`
- [ ] `check_run`
- [ ] `check_suite`
- [ ] `discussion`
- [ ] `discussion_comment`

\* Not all actions may be implemented.
