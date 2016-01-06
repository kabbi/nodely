# nodely
Distributed node-red like node evaluation system (backend only).

## Description

[Nomad](http://nomadproject.io/) + [node-red](http://nodered.org/) inspired thing.

Runs in clouds! (thanks to [consul](http://consul.io/))

Uses streams!

Hot-reload!

## Try it at home

```bash
git clone https://github.com/kabbi/nodely.git
cd nodely
npm install

# We need some consul running
# Skip and configure your own in .nodelyrc if you want
npm run consul:start

# Deploy some test flow (again, fix the url for your own consul)
curl -X PUT -T scripts/demo-flow.json http://localhost:8501/v1/kv/nodely/agents/dev0/flow

# Run some agents
npm run agent

# See debug logs with
tail -f debug.log | ./node_modules/.bin/bunyan -o short
```

## TODO
- write proper readme
