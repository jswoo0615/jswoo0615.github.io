---
layout: single
title: "Carla Simulator"
categories: Simulator
tag: [Carla, 자율주행 시뮬레이터]
toc: true
author_profile: false
sidebar: 
  nav: "docs"
search: true
---
# Carla Simulator
## Prerequisition
### 1. OS
- Ubuntu 18.04
### 2. Graphic Driver
- 종속성 패키지 설치
```shell
sudo apt-get update
sudo apt-get install build-essential
```

- 그래픽카드 확인하는 방법
```shell
lspci                       # 현재 사용중인 모든 하드웨어 정보를 나타냄 
lspci | grep -i VGA         # 그래픽 카드의 종류를 확인, 아래 update-pciids 전에 터미널에 출력되는 결과 캡처해서 넣기
update-pciids

sudo apt-get upgrade
```
- 그래픽카드 드라이버 설치
- 
### 3. 기타 종속성 패키지

## Install
install하기 위한 과정
```shell
sudo apt-get update
sudo apt-get upgrade
```


## Running Carla Simulator


##