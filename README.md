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

# We need lots of tools running, and all of them are here:
vagrant up

# Now you can deploy some flow config to consul, run nomad job
# and see the output. Sorry, no instructions right now
```

## TODO
- write proper readme
