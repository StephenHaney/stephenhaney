---
title: Self-hosting plausible web analytics
publish_date: 2023-12-12
author: Stephen Haney
tags: photoshop, avif
---

I've been looking for a solid web analytics solution for side projects. Google Analytics new dashboard is confusing and honestly overkill for side projects.

I've been using Plausible lately. It's pretty simple analytics but supports custom events, which is a requirement for me.

## Analytics for side projects

Some of my game side projects like <a href="https://zoodrop.io" target="_blank">ZooDrop.io</a> generate a lot of traffic without much revenue. And the new wave of analytics vendors all charge per page view. ZooDrop (~600 unique per day) alone already would cost $19 / month with Plausible and it doesn't generate any revenue yet.

So I needed a solution that can give me analtyics for side projects that has flat, low pricing. Luckily Plausible is open source and offers a self-hosted version. This post is about using the self-hosted Plausible on Digital Ocean (and can be applied to any VM you can SSH into).

## Getting your Plausible VM up and running

First, I should caution that self-hosting Plausible requires you to be comfortable setting up a VM, SSHing in, and running some basic terminal commands. It's not too hard so if you think you can do it, go for it!

I'd recommend following this Digital Ocean <a href="https://www.digitalocean.com/community/tutorials/how-to-install-plausible-analytics-on-ubuntu-20-04" target="_blank">tutorial on setting up Plausible on Digital Ocean</a>.

Even if you're not using Digital Ocean, you can use the second half of the steps, starting where you SSH into your VM.

I usually use <a href="https://fly.io/" target="_blank">Fly.io</a> but in this case I valued DO's persistent 25GB of storage on the VM since we'll be using `docker compose` and a SQL container. It felt like it might take extra work to attach a volume on Fly, but to be honest I didn't try it so it might be easy.

The total time it took me to set things up was about 2 hours. And now I'm locked into $6 / month analytics for all of my side projects without having to worry about the price increasing if a free project gets some attention.

## Other considerations

1. I chose a 1GB memory instance, which is honestly probably pushing it. We'll see how this works out long term. Right now it's sitting at about 50% memory usage at 600 uniques per day.

2. When I tried to use the MaxMind option for city level geolocation, my server would go out of memory. I scaled it to 2GB to test and things worked fine. I decided to go back to 1GB of memory and live without city level analytics.

3. I named my subdomain "plsbl.zoodrop.io" to avoid ad blockers (a subdomain like "analytics" might get blocked)

## Resources

1. <a href="https://plausible.io/docs/self-hosting" target="_blank">Plausible docs for self-hosting</a>

2. <a href="https://www.digitalocean.com/community/tutorials/how-to-install-plausible-analytics-on-ubuntu-20-04" target="_blank">Digital Ocean's docs for setting up Plausible on DO (great walkthrough)</a>

## Questions or ideas:

<a href="https://github.com/StephenHaney/stephenhaney/issues/8">Discuss this post on GitHub</a>
