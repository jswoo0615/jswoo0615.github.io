# Carla Simulator 패키지 설치
## 목차
[1. Installing Graphic Driver](#1-installing-graphic-driver)
- [종속성 패키지 설치](#11-종속성-패키지-설치)
- [그래픽 드라이버 설치](#12-그래픽-드라이버-설치)

[2. Installing Carla Simulator Packages](#2-installing-carla-simulator-packages)
- [의존성 패키지 설치 (Carla Simulator)](#21-의존성-패키지-설치-carla-simulator)
- [Carla Simulator 설치](#22-carla-simulator-설치)
- [Carla Leaderboard 설치](#23-carla-leaderboard-설치)
- [Carla Scenario Runner 설치](#24-carla-scenario-runner-설치)

## 1. Installing Graphic Driver
### 1.1 종속성 패키지 설치
Carla Simulator를 사용하기 전에 그래픽 카드의 드라이버를 설치해주어야 합니다.  
그래픽 드라이버 설치에 앞서 종속성 패키지를 설치해야 합니다.  
먼저 패키지 리스트를 업데이트, 업그레이드를 진행합니다.
```shell
sudo apt-get update
sudo apt-get upgrade -y
```

그 후 build-essential 패키지를 설치합니다.
```shell
sudo apt-get install build-essential -y
```

### 1.2 그래픽 드라이버 설치
그래픽 드라이버를 설치하는 방법은 여러가지 있지만, autoinstall로 진행하도록 하겠습니다.
먼저 그래픽 드라이버 리포지토리를 패키지 리스트에 추가를 하고,
```shell
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update
```

autoinstall 명령어로 설치를 진행합니다
```shell
sudo ubuntu-drivers autoinstall
```

설치 후 재부팅을 한 후 `nvidia-smi` 명령어를 입력하면 아래 그림과 같이 그래픽 카드 드라이버가 설치됨을 확인하실 수 있습니다.  
![Screenshot from 2023-04-24 12-23-20](https://user-images.githubusercontent.com/128343128/233893981-0b632404-be71-492d-a079-574fd3b47d9f.png)


위의 명령어들은 `installing_graphic_driver.sh`에 있습니다
터미널에서 `./installing_graphinc_driver.sh`를 실행하면 사용중이신 그래픽 카드에 적합한 그래픽 드라이버를 자동으로 인식하여 설치합니다.

## 2. Installing Carla Simulator packages
여기서는 아래와 같이 세 가지를 통합 구성을 진행합니다. 
- Carla Server / Client 
- Carla Scenario Runner
- Carla Leaderboard

전반적인 패키지 구성은 아래 그림과 같이 총 네 가지로 구분되며, 현재 브랜치에서는 Carla-Leaderboard, Carla Scenario_Runner, Carla-Simulator 세 가지를 다운로드 및 설치까지 하는 패키지로 합니다.  
<img width="218" alt="Screenshot 2023-04-23 at 12 14 08 PM" src="https://user-images.githubusercontent.com/128343128/233817757-631d04de-7696-4e37-9980-7bd3a1f707af.png">

### 2.1 의존성 패키지 설치 (Carla Simulator)
```shell
# 의존성 패키지 설치
sudo apt-get update &&
sudo apt-get install wget software-properties-common &&
sudo add-apt-repository ppa:ubuntu-toolchain-r/test &&
wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key|sudo apt-key add - &&
sudo apt-add-repository "deb http://apt.llvm.org/xenial/ llvm-toolchain-xenial-8 main" &&
sudo apt-get update

sudo apt-get install build-essential clang-8 lld-8 g++-7 cmake ninja-build libvulkan1 python python-pip python-dev python3-dev python3-pip libpng-dev libtiff5-dev libjpeg-dev tzdata sed curl unzip autoconf libtool rsync libxml2-dev git -y
```
Carla Simulator를 실행하기 위해 여러가지 종속성 패키지들을 설치해야 합니다.  
Carla Simulator는 언리얼 엔진 4를 기반으로 동작하는 오픈소스 소프트웨어 입니다.  
그러므로 Carla Simulator를 구동하는 Carla Server를 실행하기 위해서는 언리얼 엔진에서 사용하는 C++ 컴파일러 설치를 해주어야 합니다.  
clang을 사용하므로 같이 설치를 해줍니다.  

그 후 우분투에서 사용하는 기본 컴파일러인 gcc, g++에서 clang으로 변경을 해주어야 합니다.  
```shell
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/lib/llvm-8/bin/clang++ 180 &&
sudo update-alternatives --install /usr/bin/clang clang /usr/lib/llvm-8/bin/clang 180
```

기본적인 컴파일러 설치 세팅 완료 후 Carla Simulator에서 차량 움직임을 확인할 수 있는 시뮬레이션을 하기 위한 Python 종속성 패키지를 설치합니다.  
차량 움직임을 구동하는 방식은 Python 패키지인 pygame을 기반으로 동작합니다.

pip 업그레이드를 해준 후, Carla Simulator에서 필요한 Python 패키지를 설치해줍니다.
```shell
# pip 설치
# Python3
pip3 install --upgrade pip

# Python2
pip install --upgrade pip

# 파이썬 의존성 패키지 설치
pip install --user setuptools &&
pip3 install --user -Iv setuptools==47.3.1 &&
pip install --user distro &&
pip3 install --user distro &&
pip install --user wheel &&
pip3 install --user wheel auditwheel

```
해당 종속성 패키지는 `carla-sim_packages.sh`를 실행하면 자동으로 설치하게 되어있습니다.

또한, 추후 Carla Simulator에서 `requirements.txt`에 있는 Python 패키지중 `launchpadlib` 패키지를 설치할 때 `testresources` 패키지가 없다며 해당 패키지는 건너 뛰며 설치가 되는 경우가 있습니다.  
미리 `testresources`를 같이 설치해줍니다.

### 2.2 Carla Simulator 설치
위의 종속성 패키지 설치를 마친 후에 자동으로 Carla-Simulator 폴더로 이동하여, 주행 성능 평가 기능을 제공하는 Carla Simulator tar 압축파일을 받고 압축 해제를 합니다.  
압축 해제 후, 시스템 설정의 환경변수를 모아둔 `~/.bashrc` 파일에 아래와 같이 환경변수를 추가해줍니다.  

```shell
# 환경변수 설정
sh -c "echo \"export CARLA_ROOT=/home/${USER}/Desktop/AGC/Carla-Simulator\" >> ~/.bashrc"

sh -c "echo \"export PYTHONPATH=/home/${USER}/Desktop/AGC/Carla-Simulator/PythonAPI\" >> ~/.bashrc"
sh -c "echo \"export PYTHONPATH=/home/${USER}/Desktop/AGC/Carla-Simulator/PythonAPI/carla\" >> ~/.bashrc"
sh -c "echo \"export PYTHONPATH=/home/${USER}/Desktop/AGC/Carla-Simulator/PythonAPI/carla/agents\" >> ~/.bashrc"
sh -c "echo \"export PYTHONPATH=/home/${USER}/Desktop/AGC/Carla-Simulator/PythonAPI/carla/dist/carla-0.9.13-py2.7-linux-x86_64.egg\" >> ~/.bashrc"    # ROS Melodic은 Python2.x를 사용, Python3.x로 추후 변경 예정
```
환경변수 설정 후, Carla Simulator 폴더 내의 PythonAPI/examples 폴더로 이동하여 위의 Python 종속성 패키지에 잠깐 언급되었던 부분에 대해 추가 Python 패키지를 설치해줍니다.
`pip install -r requirements.txt`

Python 패키지가 설치 완료 되었다면 테스트 구동을 해봐야겠지요?  

**(1) 1st terminal**   
첫 번째 터미널에서는 Carla Simulator 루트 디렉토리로 이동하여 Carla Simulator의 Server를 실행해줍니다.  
```shell
./CarlaUE4.sh 
```  
![Screenshot from 2023-04-24 12-24-24](https://user-images.githubusercontent.com/128343128/233894167-c3475e30-6203-4a9d-b5b8-138066fb8cbc.png)


**(2) 2nd terminal**  
두 번째 터미널에서는 여러 차량들을 배치하여 교통상황을 꾸미는 Carla Simulator의 Client를 실행해줍니다.  
```shell
python generate_traffic.py      # 랜덤으로 차량 배치를 합니다
```
위의 `generate_traffic.py`를 실행하면 아래 그림과 같이 차량이 없던 Carla Simulator Server에 차량이 무작위로 배치되며 주행하는 것을 확인하실 수 있습니다.  
![Screenshot from 2023-04-24 12-24-56](https://user-images.githubusercontent.com/128343128/233894222-cf97c3f4-641a-4d5f-851d-8691fac500e8.png)
위 첫 번째 터미널에서의 Carla 실행 화면에 차량이 배치되어 도로를 주행하는 것을 보실 수 있습니다.

**(3) 3rd terminal**  
세 번째 터미널에서는 차량 조종 및 차량 움직임 등을 볼 수 있는 Carla Simulator의 Client를 실행해줍니다.
```shell
python manual_control.py      
```
pygame 기반으로 동작하는 Carla Simulator의 Client로서, 직접 차량을 조작할 수 있습니다.  
Carla Simulator의 Auto-pilot 기능을 실행하려면 'P'키를 눌러주면 자동으로 주행하는 것을 확인하실 수 있습니다.
![Screenshot from 2023-04-24 12-25-17](https://user-images.githubusercontent.com/128343128/233894361-bccdc137-947f-4ee9-b1fa-9b998656f2f9.png)


### 2.3 Carla Leaderboard 설치
Carla Simulator 설치를 마치고 Carla-Leaderboard 폴더로 이동하여, 주행 성능 평가 기능을 제공하는 leaderboard를 깃허브 리포지토리에서 복제합니다.  
자동으로 경로를 변경하여 해당 깃허브 리포지토리에서 복제 후, 필요한 Python 패키지를 설치하게 되어있습니다.  

### 2.4 Carla Scenario Runner 설치
Carla Leaderboard와 마찬가지로 Calra-Scenario_Runner 폴더로 이동하여, 시나리오를 구동할 수 있는 프로그램을 깃허브 리포지토리에서 복제 후, 필요한 Python 패키지를 자동으로 설치하게 되어있습니다.

그 후, Carla Leaderboard, Carla Scenario Runner의 경로를 환경변수에 등록, Python 경로를 추가해주도록 해두었습니다.  

```shell
sh -c "echo \"export LEADERBOARD_ROOT=/home/${USER}/Desktop/AGC/Carla-Leaderboard\" >> ~/.bashrc"
sh -c "echo \"export SCENARIO_RUNNER_ROOT=/home/${USER}/Desktop/AGC/Carla-Scenario_Runner\" >> ~/.bashrc"
sh -c "echo \"export PYTHONPATH="${PYTHONPATH}":"/home/${USER}/Desktop/AGC/Carla-Scenario_Runner":"/home/${USER}/Desktop/AGC/Carla-Leaderboard":"/home/${USER}/Desktop/AGC/Carla-Simulator/PythonAPI/carla/dist/carla-0.9.13-py2.7-linux-x86_64.egg"\" >> ~/.bashrc"     # 추후 Python3.x로 진행 예정
```