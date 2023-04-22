---
layout: single
title: "Carla Simulator 설치"
categories: Carla_Simulator
tag: [Carla, 자율주행 시뮬레이터, 설치]
toc: true
author_profile: true
sidebar: 
  nav: "docs"
search: true
---
# 1. 패키지 설치
## - 의존성 패키지 설치    
 [Linux build - CARLA Simulator](https://carla.readthedocs.io/en/latest/build_linux/){: .btn .btn--inverse} 의 Part One : Prerequisite의 내용 설치 진행했다.
```shell
sudo apt-get update &&
sudo apt-get install wget software-properties-common &&
sudo add-apt-repository ppa:ubuntu-toolchain-r/test &&
wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key|sudo apt-key add - &&
sudo apt-add-repository "deb http://apt.llvm.org/xenial/ llvm-toolchain-xenial-8 main" &&
sudo apt-get update
```
```shell
sudo apt-get install build-essential clang-8 lld-8 g++-7 cmake ninja-build libvulkan1 python python-pip python-dev python3-dev python3-pip libpng-dev libtiff5-dev libjpeg-dev tzdata sed curl unzip autoconf libtool rsync libxml2-dev git
```
Carla Simulator는 Unreal 엔진 기반으로 실행되는 프로그램으로 C++로 구성되어 있다.    
Carla Simulator에서는 clang-8과 LLVM's libc++을 사용하여 개발이 진행되었다.       
clang-9을 컴파일러로 사용하는 우분투 20.04에서는 MESA 관련 에러가 발생하여 우분투 18.04 환경에서 진행을 했다.    
기존 gcc 컴파일러 대신, clang으로 컴파일러를 변경해야 한다.
```shell
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/lib/llvm-8/bin/clang++ 180 &&
sudo update-alternatives --install /usr/bin/clang clang /usr/lib/llvm-8/bin/clang 180
```

## - 파이썬 의존성 패키지 설치    
  - pip 확인 후 pip 업그레이드 진행
  ```shell
  # Python3
  pip3 -V
  pip3 install --upgrade pip
  # Python2
  pip -V
  pip install --upgrade pip
  ```
  - pip 업그레이드 후 pip를 이용한 의존성 패키지 설치
  ```shell
  pip install --user setuptools &&
  pip3 install -Iv setuptools==47.3.1 &&
  pip install --user distro &&
  pip3 install --user distro &&
  pip install --user wheel &&
  pip3 install --user wheel auditwheel
  ```



# 2. Carla 설치
## - Build Linux (Unreal Engine build)
[Linux build - CARLA Simulator](https://carla.readthedocs.io/en/latest/build_linux/){: .btn .btn--inverse} 의 Part One : Prerequisite의 Software Requirements - Unreal Engine부터 설치 진행

## - Debian 패키지
[Quick start package install](https://carla.readthedocs.io/en/latest/start_quickstart/){: .btn .btn--inverse}의 Debian CARLA Installation으로 진행

## - Git repository 패키지
[Quick start package install](https://carla.readthedocs.io/en/latest/start_quickstart/){: .btn .btn--inverse}의 Package installation으로 진행


추후 진행은 NATSA의 시나리오 기반으로 Agent의 주행 성능 평가를 점수화 할 수 있는 Carla Leaderboard를 사용하기 위해 **Git repository**에서 다운 받아 압축 해제하는 방식 대신, [Carla Leaderboard](https://leaderboard.carla.org/get_started/){: .btn .btn--inverse} 의 패키지를 다운받아 진행 
<div class="notice">
<h4>추후 작성 예정 항목</h4>
<ul>
  <li> Carla Leaderboard </li>
  <li> Carla Scenario Runner </li>
  <li> Carla ROS Bridge </li>
</ul>
</div>