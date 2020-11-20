# apekletsbot
Just a discord bot that does some stuff

## Setup

Real quick, some setup info. You will need a MySQL / MariaDB server. Then, all that really needs to be done is installing dependencies and setting environment variables. So:

`npm install`

Create a file called `.env` with the following values:
```
TOKEN={discord bot login token}
HOST={database server host}
USER={database server user}
PW={database server password}
DB={database name}
```

Now the discord bot can run with `node index.js`.
Alternatively, run the discord bot with a process managing package like [https://pm2.keymetrics.io/](pm2).
Or if on linux create a system service. For example:

```
# discordbot.service
[Unit]
Description=Discord Bot

[Service]
ExecStart=/home/apeklets/discordbot/index.js
Restart=always
#User=nobody
# Note Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
#Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/home/apeklets/discordbot

[Install]
WantedBy=multi-user.target
```
And then start the service with something like `systemctl --user enable discordbot`, view live log output with `journalctl --user-unit discordbot -f`
