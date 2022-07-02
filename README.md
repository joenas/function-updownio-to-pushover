## DigitalOcean Function for UpDown.io webhooks to Pushover
This repo/code will convert [UpDown.io] webhooks to a [Pushover.net] notification with the help of a simple function.

**Note: Following these steps may result in charges for the use of DigitalOcean services**

## Requirements
* You need an [DigitalOcean] account.
* You need an [Pushover.net] account.
* You need an [UpDown.io] account.

## Getting Started
1. Goto your [Pushover.net] account and grap the User Key on the homepage (we need this later).
2. At the bottom click [Create an Application/API Token](https://pushover.net/apps/build).
3. Fill in the fields to your liking.
4. When created, grap the API Token/Key (we need this later).
5. Visit https://cloud.digitalocean.com/apps (if you're not logged in, you may see an error message. Visit https://cloud.digitalocean.com/login directly and authenticate, then try again).
6. [![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/MarcHagen/function-updownio-to-pushover/tree/main&refcode=4258a2bdda88)
7. Review your plan, and hit Next to `Environment Variables`.
8. On `Environment Variables` expand the `updownio-to-pushover`, there will be 2 keys setup for you. 
9. Fill in the [Pushover] User Key in `PUSHOVER_USER` and [Pushover] API Token in `PUSHOVER_TOKEN`.
10. Tick the `Encrypt` button, so the keys will be removed from all logs.
11. From now hit next, change settings if desire and review the billing plan at the end.
12. When all is fine, hit `Create Resources` and the app will be deployed.
13. Wait for the deployment to be complete.
14. Hit the `Overview` tab and click on the `function-upd...` link.
15. Next to `Functions` you will see a link, copy this (we need this for [UpDown.io]).

### Over to [UpDown.io]
1. Go to the settings page.
2. Scroll down and find `WEBHOOKS` on the rightside.
3. Fill in the URL we copied from the `Fuctions` tab earlier.
4. Hit `Save` at the bottom. 

 
[Deploy this to DigitalOcean Apps]: https://cloud.digitalocean.com/apps/new?repo=https://github.com/MarcHagen/function-updownio-to-pushover/tree/main&refcode=4258a2bdda88
[Pushover.net]: https://pushover.net
[Pushover]: https://pushover.net
[UpDown.io]: https://updown.io/r/F7EYe
[DigitalOcean]: https://m.do.co/c/4258a2bdda88
