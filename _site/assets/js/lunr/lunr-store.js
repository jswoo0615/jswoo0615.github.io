var store = [{
        "title": "Carla Simulator 설치",
        "excerpt":"목차 1. Installing Graphic Driver 종속성 패키지 설치 그래픽 드라이버 설치 2. Installing Carla Simulator Packages 의존성 패키지 설치 (Carla Simulator) Carla Simulator 설치 Carla Leaderboard 설치 Carla Scenario Runner 설치 1. Installing Graphic Driver 1.1 종속성 패키지 설치 Carla Simulator를 사용하기 전에 그래픽 카드의 드라이버를 설치해주어야 합니다. 그래픽 드라이버...","categories": ["Carla_Simulator"],
        "tags": ["Carla","설치"],
        "url": "/carla_simulator/Carla-simulator/",
        "teaser": null
      },{
        "title": "[C++] Alignment",
        "excerpt":"Intro C++의 모든 타입은 정렬(Alignment)을 가집니다. 이는 해당 타입의 객체가 생성될 수 있는 메모리 주소에 대한 제한입니다. 만약 그 주소를 객체의 정렬 값으로 나누었을 때 나머지가 없다면, 그 주소는 객체의 생성에 유효한 메모리 주소입니다. 타입의 정렬 값은 항상 2의 거듭제곱(power of two)이어야 합니다. Remark 타입의 정렬 요구사항은 해당 타입 (int,...","categories": ["C++_Study"],
        "tags": ["C++"],
        "url": "/c++_study/Alignment/",
        "teaser": null
      },{
        "title": "[C++] Argument Depenent Name Lookup",
        "excerpt":"Argument Dependent Name Lookup Argument Dependent Name Lookup은 C++의 메커니즘 중 하나로, 함수나 연산자 이름이 인자의 타입에 따라 해석될 수 있도록 합니다. 컴파일러는 함수 호출 시, 선언되어 있는 함수나 연산자를 먼저 현재 스코프에서 찾습니다. 하지만 해당 스코프에서 찾을 수 없는 경우, 컴파일러는 ADL (Argument Dependent Name Lookup)을 수행하여 함수나 연산자를...","categories": ["C++_Study"],
        "tags": ["C++"],
        "url": "/c++_study/Argument-Dependent-Name-Lookup/",
        "teaser": null
      },{
        "title": "[C++] Arithmitic Metaprogramming",
        "excerpt":"Arithmitic Metaprogramming  Intro  컴파일 시간에 산술 연산을 처리하기 위해 C++ 템플릿 메타프로그래밍을 사용합니다.   Calculating power in O(log n)  이 예제는 템플릿 메타프로그래밍을 사용하여 거듭제곱을 효율적으로 계산합니다.    C++14  아래 예제는 음수 지수도 처리하는 예제입니다.   ","categories": ["C++_Study"],
        "tags": ["C++"],
        "url": "/c++_study/Arithmitic-Metaprogramming/",
        "teaser": null
      },{
        "title": "[C++] Array",
        "excerpt":"Array  Intro  배열은 인접한 메모리 위치에 배치된 동일한 유형의 요소입니다.  요소는 추가 인덱스를 사용하여 고유 식별자로 개별적으로 참조할 수 있습니다.  이를 통해 특정 유형의 여러 변수 값을 선언하고 각각의 값을 위해 변수를 선언하지 않고도 개별적으로 액세스할 수 있습니다.   Array Size    ","categories": ["C++_Study"],
        "tags": ["C++"],
        "url": "/c++_study/Array/",
        "teaser": null
      },{
        "title": "[깃허브 블로그] 기본 설정",
        "excerpt":"Intro  최근에 깃허브 블로그를 알게되어… (너무 늦게 알았셔…)    발자취를 남겨보고자 하는 의미로 시작을 하게 되었습니다.   ","categories": ["Github_Blog"],
        "tags": ["Github_Blog"],
        "url": "/github_blog/github-blog-getting-started/",
        "teaser": null
      },{
        "title": "[깃허브 블로그] 밑줄 제거",
        "excerpt":"Intro 이번 포스트에서는 깃허브 블로그 작성 중 밑줄을 없애는 방법에 대한 주제를 다뤄보겠습니다. 포스트를 작성하다 보면서 아래 그림처럼 글 제목에 하이퍼링크 밑줄로 쳐져 있는 것이 너무 신경 쓰였었습니다. 그래서 밑줄 없애는 방법에 대해 찾아보고 기록을 남기고자 합니다. 밑줄 제거 _base 수정 파일 : user.github.io 폴더 -&gt; _sass -&gt; _minimal-mistakes -&gt;...","categories": ["Github_Blog"],
        "tags": ["Github_Blog"],
        "url": "/github_blog/github-blog-unerline/",
        "teaser": null
      },{
        "title": "[깃허브 블로그] 본문 너비, 글자 크기 설정",
        "excerpt":"Intro 포스트를 남기다보니 본문 영역이 좁아, 영역 및 글자 크기 조절에 대해 남겨보고자 합니다. 사용한 테마는 minimal_mistakes 입니다. 본문 영역 너비 조절 _variables.scss 수정 파일 : user.github.io 폴더 -&gt; _sass -&gt; _minimal-mistakes -&gt; _variables.scss 해당 파일의 158 ~ 160번째 줄에서 너비 설정이 가능합니다. 본문의 너비를 조절하는 것이 아닌, 사이드 바의...","categories": ["Github_Blog"],
        "tags": ["Github_Blog"],
        "url": "/github_blog/github-blog-width-font-size/",
        "teaser": null
      },{
        "title": "multipass를 이용한 우분투 가상환경 생성",
        "excerpt":"multipass를 이용한 가상환경 생성을 위해 아래와 같이 명령어를 입력합니다. multipass launch --cpus &lt;cpu 사용 갯수&gt; --disk &lt;용량&gt;G --mem 4GB --name ubuntu1804 &lt;우분투 버전&gt; Visual Studio Code에서 가상환경 사용하기 (ssh) 가상환경으로 생성한 우분투의 터미널에서 ssh 접속을 위한 비밀번호 설정을 해줍니다. sudo passwd root, sudo passwd &lt;user_name&gt;를 이용하여 비밀번호를 설정해줍니다. 그 후...","categories": ["etc"],
        "tags": ["가상환경"],
        "url": "/etc/multipass-how-to-use/",
        "teaser": null
      },{
        "title": "[C++] std::functional",
        "excerpt":"https://chipmaker.tistory.com/entry/stdfunction-%EC%A0%95%EB%A6%AC (내용 참고하여 정리!)  ","categories": ["C++_Study"],
        "tags": ["C++"],
        "url": "/c++_study/std-functional/",
        "teaser": null
      },{
        "title": "[C++] std::memory",
        "excerpt":"https://learn.microsoft.com/ko-kr/cpp/standard-library/shared-ptr-class?view=msvc-170  ","categories": ["C++_Study"],
        "tags": ["C++"],
        "url": "/c++_study/std-memory/",
        "teaser": null
      },{
        "title": "Carla Simulator 기본",
        "excerpt":"이번 포스트에서는 Carla Simulator의 기본 사용 방법에 대해 알아보도록 하겠습니다. Carla Simulator 기본 1. 사용 모듈 추가 import os import glob import sys import time try: sys.path.append(glob.glob('carla_simulation_root/PythonAPI/carla/dist/carla-*%d.%d-%s.egg' % ( sys.version_info.major, sys.version_info.minor, 'win-amd64' if os.name == 'nt' else 'linux-x86_64'))[0]) except IndexError: pass import carla import argparse import logging from numpy import...","categories": ["Carla_Simulator"],
        "tags": ["Carla"],
        "url": "/carla_simulator/Carla-Tutorial/",
        "teaser": null
      },{
        "title": "Carla Simulator Vehicle Physics",
        "excerpt":"이번 포스팅에서는 Carla Simulator에서 차량의 동역학적 요소 (타이어 마찰력, 엔진 관성 모멘트 등)을 변경하는 방법에 대해 알아보도록 하겠습니다. 변경한 차량의 동역학적 요소들은 해당 파이썬 스크립트를 실행하는 Runtime에만 적용되며, 종료 후에는 Carla Simulator 내의 차량 기본 값으로 전환됩니다. 휠의 마찰력, damping, steering을 변경하고, 엔진, 질량, 항력계수 등을 변경했습니다. Carla Simulator에서 차량의...","categories": ["Carla_Simulator"],
        "tags": ["Carla"],
        "url": "/carla_simulator/Carla-vehicle-physics/",
        "teaser": null
      },{
        "title": "Carla Simulator Bounding Box 기본",
        "excerpt":"지난 포스트에서는 Carla Simulator에서 맵 선택, 차량, 센서 설정 등에 대해 알아봤었습니다. 이번 시간에는 2D / 3D Bounding Box와 Pascal VOC 데이터 셋 수집에 대해 포스팅을 진행하도록 하겠습니다. 1. 기존 코드 지난 포스트 Carla_Simulator_기본의 모듈추가와 동일합니다. import os import glob import sys import time try: sys.path.append(glob.glob('carla_simulation_root/PythonAPI/carla/dist/carla-*%d.%d-%s.egg' % ( sys.version_info.major, sys.version_info.minor,...","categories": ["Carla_Simulator"],
        "tags": ["Carla"],
        "url": "/carla_simulator/Carla-Bounding-Box/",
        "teaser": null
      },{
        "title": "Carla Simulator 2D Bounding Box",
        "excerpt":"지난 포스트에서는 Carla Simulator 3D Bounding Box 생성에 대한 기본을 알아봤습니다. 이번 시간에는 2D Bounding Box 및 Pascal VOC 데이터 셋 수집에 대해 포스팅을 진행하도록 하겠습니다. 먼저 지난 Bounding Box 기본 포스트의 내용 중 일부를 가져오겠습니다. 1. 2D Bounding Box 1.1. 기존 코드 기존 코드와 동일하게 사용합니다. import os import...","categories": ["Carla_Simulator"],
        "tags": ["Carla"],
        "url": "/carla_simulator/Carla-2D-Bounding-Box/",
        "teaser": null
      },{
        "title": "Carla Simulator 3D Bounding Box",
        "excerpt":"지난 포스트에서는 Carla Simulator Bounding Box 생성에 대한 기본을 알아봤습니다. 이번 시간에는 3D Bounding Box에 대해 포스팅을 진행하도록 하겠습니다. 먼저 지난 Bounding Box 기본 포스트의 내용 중 일부를 가져오겠습니다. 1. 기존 코드 기존 코드와 동일하게 사용합니다. import os import glob import sys import time try: sys.path.append(glob.glob('carla_simulation_root/PythonAPI/carla/dist/carla-*%d.%d-%s.egg' % ( sys.version_info.major, sys.version_info.minor,...","categories": ["Carla_Simulator"],
        "tags": ["Carla"],
        "url": "/carla_simulator/Carla-3D-Bounding-Box/",
        "teaser": null
      },{
        "title": "Carla Simulator ROS Bridge 설치",
        "excerpt":"지난 포스트까지 Carla Simulator에서 Bounding Box, 차량 동역학적 물성 적용 등에 대해 알아봤습니다. 이번 포스트부터는 추후 Autoware (Autoware Universe가 목표입니다. 화이팅..!) 연동을 위한 준비 과정을 진행하려 합니다. Carla Simulator에서 AD Stack 플랫폼 (Autoware, Apollo 등)과의 연동을 할 수 있는 ROS Bridge를 제공합니다. Carla ROS Bridge는 Carla Simulator를 이용한 주행 성능...","categories": ["Carla_Simulator"],
        "tags": ["Carla_Simulator","ROS_Bridge","Galactic"],
        "url": "/carla_simulator/Carla-ROS-Bridge/",
        "teaser": null
      },{
        "title": "Slam Toolbox를 이용한 맵 생성",
        "excerpt":"안녕하세요~ 이번 포스팅에서는 Nav2와 Slam Toolbox를 이용한 맵 생성에 대해 스터디 기록을 남기고자 합니다. Turtlebot3 패키지를 이용하여 시뮬레이션을 진행할 예정입니다. 1. 패키지 설치 Slam Toolbox와 Nav2 스택을 사용하기 위해서 패키지를 설치합니다. 저는 ROS2 Galactic 버전을 사용했습니다. sudo apt install ros-galactic-navigation2 ros-galactic-nav2-bringup ros-galactic-turtlebot3* ros-galactic-slam-toolbox 2. 환경설정 Turtlebot3를 사용하기 위해 ~/.bashrc에 사용하고자...","categories": ["ROS"],
        "tags": ["ROS","Localization","Slam"],
        "url": "/ros/Localization-Using-Nav2-Slam-toolbox/",
        "teaser": null
      }]
