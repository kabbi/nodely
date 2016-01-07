region = "dev"
datacenter = "nodely"

name = "dev-nodely-node"

bind_addr = "0.0.0.0"
data_dir = "/var/lib/nomad"

advertise {
  # We need to specify our host's IP because we can't
  # advertise 0.0.0.0 to other nodes in our cluster.
  rpc = "192.168.140.42:4647"
}

server {
  enabled = true
  bootstrap_expect = 1
}

client {
  enabled = true
  network_speed = 100

  options {
    # Don't do like that in production: make custom token for nomad
    "consul.token" = "KePCPQEnPLQw5GvAfc2LsvtlP4"
  }
}
