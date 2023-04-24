---
layout: single
title: "multipass를 이용한 우분투 가상환경 생성"
categories: multipass
tag: [가상환경]
toc: true
author_profile: true
sidebar: 
  nav: "main"
search: true
---
## multipass를 이용한 가상환경 생성
multipass를 이용한 가상환경 생성을 위해 아래와 같이 명령어를 입력합니다.  
`multipass launch --cpus <cpu 사용 갯수> --disk <용량>G --mem 4GB --name ubuntu1804 <우분투 버전>`


## Visual Studio Code에서 가상환경 사용하기 (ssh)
가상환경으로 생성한 우분투의 터미널에서 ssh 접속을 위한 비밀번호 설정을 해줍니다.
`sudo passwd root`, `sudo passwd <user_name>`를 이용하여 비밀번호를 설정해줍니다.

그 후 ifconfig를 이용하기 위해 `sudo apt install net-tools` 명령어를 이용해서 설치해줍니다.

설치 후 `ifconfig` 명령어를 이용하여 가상환경의 ip 주소를 확인할 수 있습니다.

다음 과정으로 `sudo apt install openssh-server`를 설치해줍니다.

설치 후 `sudo vi /etc/ssh/sshd_config` 파일을 열고 일부를 수정해줍니다.
```shell
# Authentication:
PermitRootLogin yes

PubkeyAuthenication yes

PasswordAuthentication yes

kbdInteractiveAuthentication no

# GSSAPI options
GSSAPIAuthentication yes
GSSAPICleanupCredentials no

UsePAM yes

X11Forwarding yes
```

수정 후 반드시 sshd 서비스를 재실행 해줍니다.
`sudo systemctl restart sshd`
