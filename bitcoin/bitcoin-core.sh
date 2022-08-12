#!/bin/bash

sudo apt update
sudo apt install git

#Required
sudo apt install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
sudo apt install libevent-dev libboost-system-dev libboost-filesystem-dev libboost-test-dev

#Optional
sudo apt install libsqlite3-dev libminiupnpc-dev libnatpmp-dev libzmq3-dev
sudo apt install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libqrencode-dev

git clone https://github.com/bitcoin/bitcoin.git

#Install Berkeley DB
cd bitcoin/contrib
./install_db4.sh `pwd`

cd db4
BDB_PREFIX=`pwd`

cd ../..
./autogen.sh
./configure BDB_LIBS="-L${BDB_PREFIX}/lib -ldb_cxx-4.8" BDB_CFLAGS="-I${BDB_PREFIX}/include"

make

sudo make install

cd ~/
mkdir .bitcoin
cd ~/.bitcoin
touch bitcoin.conf

echo "server=1" >> bitcoin.conf
echo "txindex=1" >> bitcoin.conf

echo "Done"
