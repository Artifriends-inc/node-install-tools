# Build Requirements:

```
sudo apt install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
```

# Required Dependencies:

```
sudo apt install libssl-dev libevent-dev libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-test-dev libboost-thread-dev
sudo apt install libboost-all-dev
sudo apt install cmake ninja-build
```

# Optional

```
sudo apt install libdb-dev libdb++-dev libminiupnpc-dev  libzmq3-dev  libjemalloc-dev
```

# RPC API Reference

- https://developer.bitcoin.org/reference/rpc/index.html

# bitcoin.conf

- ~/.bitcoin/bitcoin.conf  
  server = 1 --> litecoin JSON-RPC (default 0)  
  rpcuser = 'rpc user'  
  rpcpassword = 'rpc password'  
  rpcport = 'rpc port' (deafault 18332)  
  rpcthreads = 4 (default 4)  
  txindex = 1 (default 0)

# install command (ubuntu version 20.04 필요)
```
yes | bash bitcoiinabc-core.sh
```