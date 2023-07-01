---
layout: single
title: "[ROS2] Workspace 및 Package 생성"
categories: ROS2
tag: [ROS2]
toc: true
author_profile: true
sidebar: 
  nav: "main"
search: true
published: false
---
ROS2의 작업환경 (Workspace) 생성 방법에 관한 내용입니다.  
## 1. 작업공간 (Workspace) 생성
### 1.1. ROS2 환경변수 적용  
ros2를 설치한 후 실행하기 위해 아래와 같이 환경변수 설정을 해야합니다.  
ros2가 설치되어 있는 경로의 `setup.bash` 파일을 이용하여 환경변수 설정해줍니다.
```shell
source /opt/ros/humble/setup.bash
```
위의 방법은 반영구적으로 터미널을 실행할 때마다 실행해주어야 하는 번거로움이 있습니다.  
그러므로 터미널을 새로 열 때마다 바로 ros2를 실행할 수 있도록 하기 위해 아래와 같이 `~/.bashrc` 파일에 위 명령어를 입력 후 저장해줍니다.  
```shell
sh -c "echo \"source /opt/ros/humble/setup.bash\" >> ~/.bashrc"
```

### 1.2. 작업공간 생성
[과정 1.1.](#11-source-ros2-environment)을 거쳐 환경변수 등록을 마친 후 새로운 작업공간을 생성해줍니다.  
작업공간을 생성할 때는 아래와 같은 명령어를 입력해줍니다.
```shell
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src
```  
사용자의 `home` 디렉토리에 `ros2_ws`라는 이름의 작업공간을 생성했습니다.  
하위 폴더로 `src` 폴더에는 앞으로 쭈우욱 [ROS2 Humble 문서 페이지](https://docs.ros.org/en/humble/Tutorials.html)의 패키지들을 참고하여 진행할 예정입니다.

### 1.3. 종속성 패키지 설치
작업공간을 생성하기 전에 누락된 종속성 패키지가 있는지 확인해야합니다.  
종속성 패키지 업데이트를 하기 위해 작업공간의 루트 디렉토리인 `ros2_ws`에서 종속성 패키지를 설치해줍니다.  
```shell
rosdep install -i --from-path src --rosdistro humble -y
```

위 명령어를 통해 종속성 패키지를 완료하면 아래와 같은 로그가 출력되는 것을 보실 수 있습니다.  
```shell
#All required rosdeps installed successfully
```
### 1.4. colcon을 이용하여 작업공간 빌드
[과정 1.3.](#13-resolve-dependencies)을 통해 종속성 패키지를 설치한 후 작업공간을 빌드해줍니다.  
빌드를 할 때는 작업공간의 루트 디렉토리에서 빌드를 해주어야 합니다.
```shell
colcon build
```
위 명령어를 통해 작업공간을 빌드 후에는 아래와 같이 폴더들이 생겨있는 것을 확인하실 수 있습니다.  
```shell
build     install     log     src
```

### 1.5. 작업공간 환경변수 등록
[과정 1.4.](#14-build-the-workspace-with-colcon)를 통해 작업공간 빌드 후 해당 작업공간의 패키지들을 빌드 및 실행하기 위해 작업공간을 `~/.bashrc`에 환경변수 등록을 해줍니다.  
```shell
source ~/ros2_ws/install/setup.bash
```
위의 [과정 1.1.](#11-source-ros2-environment)과 같은 과정입니다.  
다만, 작업공간의 디렉토리를 환경변수 등록을 해줍니다.

마찬가지로 영구적으로 환경변수 등록을 할 수 있습니다.  
```shell
sh -c "echo \"source ~/ros2_ws/install/setup.bash\" >> ~/.bashrc" 
```

기본적인 작업환경을 생성했습니다!  

## 2. 기본적인 패키지 빌드
### 2.1. 패키지 생성
앞 과정들을 거친 후, 작업공간 안에서 실제적인 구성을 하는 패키지를 빌드하겠습니다.  
생성한 작업공간의 `src` 폴더로 접근합니다. 
```shell 
cd ~/ros2_ws/src
```

`src` 폴더에서 패키지를 생성해줍니다.
```shell
ros2 pkg create --build-type ament_cmake <패키지 이름>
```

### 2.2. 패키지 빌드
위 [과정 1.4.](#14-build-the-workspace-with-colcon)의 빌드 명령어와 같습니다.  

```shell
colcon build
```
위 명령어를 사용하면 `src` 폴더 내의 모든 패키지를 빌드합니다.  
패키지 일부를 선택적으로 빌드를 할 수 있습니다.  
```shell
colcon build --packages-select <패키지 이름>
```

빌드를 한 후, `source ~/.bashrc`를 실행해 환경변수 재적용 해줍니다.  



다음 과정으로는 C++를 위주로 ROS2 패키지를 빌드해보도록 하겠습니다.