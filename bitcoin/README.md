# Build requirements:

```
sudo apt install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
```

# required dependencies:

```
sudo apt install libevent-dev libboost-system-dev libboost-filesystem-dev libboost-test-dev
```

# Optional

```
sudo apt install libsqlite3-dev libminiupnpc-dev libnatpmp-dev libzmq3-dev
sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libqrencode-dev

```

# centos 8

```
sudo dnf install -y gcc-c++ autoconf make patch
sudo dnf install libtool automake python3
sudo dnf install libevent-devel boost-devel
sudo dnf install sqlite-devel
sudo dnf install libdb4-devel libdb4-cxx-devel

```


# RPC API Reference

- https://developer.bitcoin.org/reference/rpc/index.html

# bitcoin.conf

- ~/.bitcoin/bitcoin.conf  
  server = 1 --> bitcoind JSON-RPC (default 0)  
  rpcuser = 'rpc user'  
  rpcpassword = 'rpc password'  
  rpcport = 'rpc port' (deafault 18332)  
  rpcthreads = 4 (default 4)  
  txindex = 1 (default 0)
  fallbackfee=0.001

# install command
 ```
 yes | bash bitcoin-core.sh
 ```
