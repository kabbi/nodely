# Flow owner id here after a colon
job "flow:demo-flow" {

	# Specify region and datacenter
	region = "dev"
	datacenters = ["nodely"]

	# Restrict our job to only linux. We can specify multiple
	# constraints as needed.
	constraint {
		attribute = "$attr.kernel.name"
		value = "linux"
	}

	# Configure the job to do rolling updates
	update {
		# Stagger updates every 10 seconds
		stagger = "10s"

		# Update a single task at a time
		max_parallel = 1
	}

	# Create a 'cache' group. Each task in the group will be
	# scheduled onto the same machine.
	group "flows" {
		# Run exactly one instance of this group
		count = 1

		# Restart Policy - This block defines the restart policy for TaskGroups,
		# the attempts value defines the number of restarts Nomad will do if Tasks
		# in this TaskGroup fails in a rolling window of interval duration
		# The delay value makes Nomad wait for that duration to restart after a Task
		# fails or crashes.
		restart {
			interval = "5m"
			attempts = 10
			delay = "25s"
		}

		# Define a task to run
		task "flow-executor" {
			# Use priveledged executor to run a task
			driver = "raw_exec"

			# Configure executor
			config {
				command = "/usr/bin/node"
				args = ["/vagrant/index.js", "agent"]
			}

			# Main job configuration
			env {
				nodely_flowId = "56b3921cb04aeee410d60aad"
				nodely_consul__token = "KePCPQEnPLQw5GvAfc2LsvtlP4"
			}

			# Consul service definition
			service {
				name = "flow:demo-flow"
				tags = ["agent", "flow"]
				# We can inject port config here
				# port = "db"
				# Optionally include check data
				# check {
				# 	name = "alive"
				# 	type = "tcp"
				# 	interval = "10s"
				# 	timeout = "2s"
				# }
			}

			# We must specify the resources required for
			# this task to ensure it runs on a machine with
			# enough capacity.
			resources {
				cpu = 100 # 100 Mhz
				memory = 64 # 64MB
				network {
					mbits = 1
					# We can inject port config here
					# port "db" {}
				}
			}
		}
	}
}
