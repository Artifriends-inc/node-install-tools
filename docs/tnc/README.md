# TNC-CLI

- 블록정보

  - 입력 : curl -d '{"blockNum":"40"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/getBlock
  - 출력 : <지정해시가 있는 블록에 대한 정보>

- 계정생성

  - 입력 : curl -d '{"username":"유저이름","password":"비밀번호"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/createAccount
  - 출력 : <계정정보>

- 유저정보 가져오기 (잔고 확인 가능 등...)

  - 입력 : curl -d '{"username":"유저이름"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/getAccount
  - 출력 : <유저정보>

- 지갑생성

  - 입력 : curl -d '{"email":"유저이름","password":"비밀번호"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/tnc_rr_create_wallet
  - 출력 : <지갑정보>

- 입금주소생성

  - 입력 : curl -d '{"email":"유저이름"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/tnc_rr_get_wallet_address
  - 출력 : <지갑주소>

- 지갑정보

  - 입력 : curl -d '{"email":"유저이름"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/tnc_rr_get_wallet_info
  - 출력 : <지갑정보>

- 출금

  - 입력 : curl -d '{"from":"arti07","from_pwd":"test1234","amount":"1.0","to":"arti08"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/transfer
  - 출력 : <트랜잭션ID>

- 트랜잭션 정보

  - 입력 : curl -d '{"transaction_id":"7570cd2ef17ee6e555657d166c41c4deafdd453f"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/getTransaction
  - 출력 : <트랜잭션 정보>

- 트랜잭션 리스트 조회

  - 입력 : curl -d '{"account":"RR5zMtmVVEBzA5mEYCQFgN9wvKyW8b6675TpzbnieRLKQz3CAgoZ","from":-1,"limit":100}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3030/api/getAccountHistory
  - 출력 : <트랜잭션 리스트>

- 최신블록 정보 조회

  - 입력 : curl -X POST http://127.0.0.1:3030/api/getDynamicGlobal
  - 출력 : 결과값 중 head_block_number 값
