#!/bin/bash

sudo apt update
sudo apt install git

#Required
sudo apt install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
sudo apt install libssl-dev libevent-dev libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-test-dev libboost-thread-dev
sudo apt install libboost-all-dev
sudo apt install cmake ninja-build

#Optional
sudo apt install libdb-dev libdb++-dev libminiupnpc-dev libzmq3-dev libjemalloc-dev
sudo apt install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler libqrencode-dev

git clone https://github.com/bitcoin-cash-node/bitcoin-cash-node.git

cd bitcoin-abc
mkdir build
cd build
cmake -GNinja ..
ninja
sudo ninja install

cd ~/
mkdir .bitcoin
cd ~/.bitcoin
touch bitcoin.conf

echo "server=1" >> bitcoin.conf
echo "txindex=1" >> bitcoin.conf

echo "Done"