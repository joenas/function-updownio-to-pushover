## DigitalOcean Function for UpDown.io webhooks to Pushover
This repo/code will convert [UpDown.io] webhooks to a [Pushover.net] notification with the help of a simple function.

**Note: Following these steps may result in charges for the use of DigitalOcean services**

## Requirements
* You need an [DigitalOcean] account.
* You need an [Pushover.net] account.

## Getting Started
1. Goto your [Pushover.net] account and grap the User Key on the homepage (we need this later)
2. At the bottom click [Create an Application/API Token](https://pushover.net/apps/build)
3. Fill in the fields to your liking
4. When created, grap the API Token/Key (we need this later)
5. Visit https://cloud.digitalocean.com/apps (if you're not logged in, you may see an error message. Visit https://cloud.digitalocean.com/login directly and authenticate, then try again)
6. [Deploy this to DigitalOcean Apps]

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/MarcHagen/function-updownio-to-pushover/tree/main&refcode=4258a2bdda88)

 ---

[Deploy this to DigitalOcean Apps]: https://cloud.digitalocean.com/apps/new?repo=https://github.com/MarcHagen/function-updownio-to-pushover/tree/main&refcode=4258a2bdda88
[Pushover.net]: https://pushover.net
[UpDown.io]: https://updown.io
[DigitalOcean]: https://m.do.co/c/4258a2bdda88
