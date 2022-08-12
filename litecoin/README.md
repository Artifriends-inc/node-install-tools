# Build requirements:

```
sudo apt install bsdmainutils build-essential libssl-dev libevent-dev lld ninja-build python3
```

# required dependencies:

```
 sudo apt install libboost-system-dev libboost-filesystem-dev libboost-test-dev libboost-thread-dev
```

# Optional

```
sudo apt install libminiupnpc-dev libzmq3-dev
sudo apt install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler libqrencode-dev

```

# RPC API Reference

- https://www.kompulsa.com/litecoin-cli-commands/

# litecoin.conf

- ~/.litecoin/litecoin.conf  
  server = 1 --> litecoin JSON-RPC (default 0)  
  rpcuser = 'rpc user'  
  rpcpassword = 'rpc password'  
  rpcport = 'rpc port' (deafault 18332)  
  rpcthreads = 4 (default 4)  
  txindex = 1 (default 0)
  fallbackfee = 0.001

 # install command

 ```
 yes | bash litecoin-core.sh
 ```