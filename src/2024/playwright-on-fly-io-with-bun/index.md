---
title: Running playwright on fly.io with bun
publish_date: 2024-12-11
author: Stephen Haney
tags: playwright, bun, fly.io
---

Here's a quick setup guide to running playwright on Fly.io with bun. It actually works really well once you know the right configuration.

I needed to spin up playwright screenshot service for <a href="https://paper.design">paper.design</a>. Every time a designer closes a file, we take a screenshot using the server to serve as a thumbnail in the file list.

I wasn't finding much Playwright + Fly.io information. I wanted to share what worked for me.

Here are the 3 relevant files for a minimal setup: `Dockerfile`, `package.json`, and `main.ts`.

```
Other notes:
- The fly.toml doesn't have any specific requirements for this setup
- I'm using bun, but you could use node if you want
- I'm using playwright-chromium, but you could use other browsers if you want
```

## 1. Dockerfile

```dockerfile
# Use the official playwright docker image
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Install unzip and curl (required by bun)
RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH=$PATH:/root/.bun/bin

# Set up your app
WORKDIR /app
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install

# Copy the rest of your application
COPY . .

# Build the app
RUN bun run build

# Start the app
CMD ["bun", "run", "start"]
```

## 2. package.json

This assumes you have a `src/main.ts` file and want to build it with bun to `dist/main.js`. Change the scripts to suit your needs.

Note that we need to `--external electron` because otherwise bun build + playwright tries to bundle electron even though we're not using it in our headless setup.

```json
{
  "name": "your-app-name",
  "version": "0.0.1",
  "scripts": {
    "dev": "bun run --watch src/main.ts",
    "build": "bun run typecheck && bun build --outdir dist --target bun --sourcemap src/main.ts --external electron",
    "start": "bun run dist/main.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "playwright-chromium": "1.41.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "5.7.2"
  }
}
```

## 3. main.ts

Import chromium and use the browser!

```ts
import { chromium } from 'playwright-chromium';

async function main() {
  // Launch the browser
  const browser = await chromium.launch();

  // Create a new page and navigate to a URL
  const page = await browser.newPage();
  await page.goto('https://example.com');

  // Log the page title to prove it's working
  console.log('Page title:', await page.title());

  // Clean up
  await browser.close();
}

main();
```

## Testing and deploying

You can test it locally with `bun run dev` (you will probably also need to run `npx playwright install` to install the browsers locally).

Then run `fly launch` to create the app or `fly deploy` if it's already created to get it running on fly.

I hope this helps you quickstart playwright on fly.io with bun.

## Feedback or ideas?

<a href="https://github.com/StephenHaney/stephenhaney/issues/9">Discuss this post on GitHub</a><br /><br />
Say hi on <a href="https://x.com/sdothaney">X/Twitter</a> or <a href="https://bsky.app/profile/stephenhaney.com">Bluesky</a>
