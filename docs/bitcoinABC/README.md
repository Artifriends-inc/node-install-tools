# BitcoinABC-Cli

- 잔고

  - 입력 : bitcoin-cli -rpcwallet=<지갑이름> getbalance
  - 출력 : <잔고>

- 출금

  - 입력 : bitcoin-cli -rpcwallet=<지갑이름> sendtoaddress <전송주소> <전송값>
  - 출력 : <트랜잭션ID>

- 블록정보

  - 입력 : bitcoin-cli getblock <블록해시>
  - 출력 : <지정해시가 있는 블록에 대한 정보>

- 지갑 생성

  - 입력 : bitcoin-cli createwallet <지갑이름>
  - 출력 : <지갑이름>

- 지갑입금주소 생성 및 주소 개인키 생성

  - 입력 : bitcoin-cli -rpcwallet=<지갑이름> getnewaddress
  - 출력 : <지갑주소>

- 지갑 주소에 따른 개인키 가져오기

  - 입력 : bitcoin-cli -rpcwallet=<지갑이름> dumpprivkey <지갑주소>
  - 출력 : <개인키>

- 주소 생성

  - 입력 : bitcoin-cli getnewaddress (지갑이 1개 있을때만 가능(bitcoin-cli listwallets로 확인가능))
  - 출력 : <주소>

- 트랜잭션 생성

  - 입력 : bitcoin-cli createrawtransaction "[{\"txid\" : \"mytxid\",\"vout\":0}]" "[{\"보낼주소\": 보낼양}]"
  - 출력 : "myhex"

- 트랜잭션 사인

  - 입력 : bitcoin-cli signrawtransactionwithwallet "myhex"
  - 출력 : <서명된 해쉬>

- 트랜잭션 전송

  - 입력 : bitcoin-cli sendrawtransaction "signedhex" "maxfeerate"
  - 출력 : <트랜잭션ID>

- 지갑복구 명령

  - 입력 : bitcoin-cli loadwallet "지갑이름"
  - 출력 : <지갑이름>

- 트랜잭션 조회

  - 입력 : bitcoin-cli -rpcwallet=<지갑이름> listtransactions
  - 출력 : <트랜잭션리스트>

- 최신블록조회
  - 입력 : bitcoin-cli getblockcount
  - 출력 : <블록넘버>

# Bitcoin-Cli Manual

https://chainquery.com/bitcoin-cli
