#!/bin/bash

sudo apt update
sudo apt install git

#Required
sudo apt install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
sudo apt install libssl-dev libevent-dev libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-test-dev libboost-thread-dev

#Optional
sudo apt install libminiupnpc-dev libzmq3-dev
sudo apt install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler libqrencode-dev

git clone https://github.com/litecoin-project/litecoin.git

#Install Berkeley DB
sudo apt install libdb++-dev
cd litecoin/contrib
./install_db4.sh `pwd`
./install_db4.sh

cd db4
BDB_PREFIX=`pwd`

cd ../..
./autogen.sh
./configure BDB_LIBS="-L${BDB_PREFIX}/lib -ldb_cxx-4.8" BDB_CFLAGS="-I${BDB_PREFIX}/include"

make

sudo make install

cd ~/
mkdir .litecoin
cd ~/.litecoin
touch litecoin.conf

echo "server=1" >> litecoin.conf
echo "txindex=1" >> litecoin.conf
echo "fallbackfee=0.001" >> litecoin.conf

echo "Done"