# -*- mode: ruby -*-
# vi: set ft=ruby :

$nomadScript = <<SCRIPT
# Update apt and get dependencies
sudo apt-get update
sudo apt-get install -y unzip curl wget vim

# Download Nomad
echo Fetching Nomad...
cd /tmp/
curl -sSL https://releases.hashicorp.com/nomad/0.2.3/nomad_0.2.3_linux_amd64.zip -o nomad.zip

echo Installing Nomad...
unzip nomad.zip
sudo chmod +x nomad
sudo mv nomad /usr/bin/nomad

sudo mkdir -p /etc/nomad.d
sudo chmod a+w /etc/nomad.d

sudo cp /vagrant/scripts/nomad/upstart.conf /etc/init/nomad.conf

SCRIPT

$consulScript = <<SCRIPT
echo Fetching Consul...
cd /tmp/
curl -sSL https://releases.hashicorp.com/consul/0.6.0/consul_0.6.0_linux_amd64.zip -o consul.zip

echo Installing Consul...
unzip consul.zip
sudo chmod +x consul
sudo mv consul /usr/bin/consul

sudo mkdir -p /etc/consul.d
sudo chmod a+w /etc/consul.d

sudo cp /vagrant/scripts/consul/upstart.conf /etc/init/consul.conf

SCRIPT

$nodeScript = <<SCRIPT
echo Setting up NodeJS...
curl --silent --location https://deb.nodesource.com/setup_5.x | sudo bash -
sudo apt-get install -y nodejs
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "puphpet/ubuntu1404-x64"
  config.vm.hostname = "nomad"
  config.vm.provision "shell", inline: $nomadScript, privileged: false
  config.vm.provision "shell", inline: $consulScript, privileged: false
  config.vm.provision "shell", inline: $nodeScript, privileged: false
  config.vm.provision "docker" # Just install it

  # Setup a known ip to connect to
  config.vm.network "private_network", ip: "192.168.140.42"

  # Increase memory for Parallels Desktop
  config.vm.provider "parallels" do |p, o|
    p.memory = "1024"
  end

  # Increase memory for Virtualbox
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end

  # Increase memory for VMware
  ["vmware_fusion", "vmware_workstation"].each do |p|
    config.vm.provider p do |v|
      v.vmx["memsize"] = "1024"
    end
  end
end
