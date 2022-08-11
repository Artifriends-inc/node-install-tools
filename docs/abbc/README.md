# ABBC-CLI

- 블록 정보

  - 입력 : cleos get block <블럭번호>
  - 출력 : <블록에 대한 정보>

- 지갑 생성

  - 입력 : cleos wallet create -n <유저네임> -f <비밀번호> --to-console
  - 출력 : <생성>

- 새 키페어생성

  - 입력 : cleos create key --to-console
  - 출력 : <키페어>

- 지갑 퍼블릭키 생성

  - 입력 : cleos wallet create_key -n <유저네임> K1
  - 출력 : <퍼블릭키>

- eosio 계정 정보조회 (잔고, 퍼블릭키)

  - 입력 : cleos get account eosio
  - 출력 : <정보>

- 출금

  - 입력 : cleos transfer <보낼사람> <받는사람> <보낼양>
  - 출력 : <트랜잭션ID>

- 트랜잭션 정보

  - 입력 : cleos get transaction <트랜잭션ID> -b <블럭번호>
  - 출력 : <트랜잭션 정보>

- 트랜잭션 리스트 조회

  - 입력 : cleos get actions <계정이름>
  - 출력 : <트랜잭션 리스트>

- 최신블럭조회

  - 입력 : cleos get info
  - 출력 : head_block_num 값
