---
layout: single
title: "[ROS2] Publisher와 Subscriber 생성"
categories: ROS2
tag: [ROS2]
toc: true
author_profile: true
sidebar: 
  nav: "main"
search: true
published: false
---

## 1. 패키지 생성 
패키지를 생성 및 빌드하기 위해 작업공간의 `~/ros2_ws/src` 폴더로 이동하여 패키지를 생성해줍니다.  
패키지 생성 명령어는 아래와 같습니다.  
```shell
ros2 pkg create --build-type ament_cmake <your_package_name>
```

지금은 `cpp_pubsub` 이라는 이름의 패키지를 만들도록 하겠습니다.  
```shell
ros2 pkg create --build-type ament_cmake cpp_pubsub
```

아래 그림과 같이 `cpp_pubsub` 이름의 패키지가 생성되었습니다.  
<img width="328" alt="Publisher_Subscriber_1" src="https://user-images.githubusercontent.com/128343128/235099090-3703d77b-da1e-498d-a81e-981916efda5a.png">  


## 2. Publisher 노드 
`Publisher` 노드를 생성하기 위해 패키지 내의 `cpp_pubsub/src`로 이동합니다.  
### 2.1. 전체 코드
<script src="https://gist.github.com/jswoo0615/e752bd6a4349d486a56aace156222e9a.js"></script>

### 2.2. 코드 분석
#### 2.2.1. 헤더부분
<script src="https://gist.github.com/jswoo0615/3713851505f213a0d424f2a44967dc43.js"></script>

(1) `#include <chrono>`  
- C++11에 추가된 시간 관련 헤더파일입니다.
- `<chrono>` 라이브러리를 이용하여 나노초 (ns) 단위의 정확한 시간 측정을 할 수 있습니다.

(2) `#include <functional>`  
- class 설계할 때 기존 함수포인터를 대신 C++11 이후에 `<functional>`을 이용하여 class 구현을 합니다.

(3) `#include <memory>`  
- `shared_ptr`을 사용할 수 있는 라이브러리입니다.
- `shared_ptr<message_type>`과 `<message_type>::SharedPtr`은 같습니다.

(4) `#include <string>`  
- C++에서 `String`과 관련된 함수들의 라이브러리 입니다.

(5) `#include "rclcpp/rclcpp.hpp"`   
- ROS2에서 C++로 빌드하기 위해 ROS의 `rclcpp`의 `rclcpp.hpp` 헤더 파일을 포함해 주어야 합니다.  
- 노드 생성, `create_publisher`, `create_subscriber` 등의 다양한 함수를 사용할 수 있는 헤더 파일입니다.

(6) `#inclde "std_msgs/msg/string.hpp"`   
- ROS2의 메시지 중 string과 관련된 메시지 라이브러리입니다.

#### 2.2.2. Publisher 클래스
##### 2.2.2.1. public 생성자 부분
<script src="https://gist.github.com/jswoo0615/3f9e70d6eb84e3d1ea01fabd1ce31002.js"></script>

- `rclcpp::Node`를 상속하여 `MinimalPublisher` 클래스를 생성합니다.  
`this`는 모두 `Node`를 참조합니다.  
- `public` 생성자는 노드 이름을 `Minimal_Publisher`이라 정의하고, `count_`를 0으로 초기화했습니다.  
- 생성자 내부에서 `publisher`는 `String` 메시지 타입, `topic`의 이름과 `queue` 사이즈를 정하여 백업 이벤트에서의 메시지 갯수를 제한합니다.  
- `timer_`를 초기화하여 1초에 2회씩 `private` 생성자의 `timer_callback`함수가 실행되도록 합니다.

##### 2.2.2.2. private 생성자 부분
<script src="https://gist.github.com/jswoo0615/136405defccadbe969fdffaaafe7f039.js"></script>

- `timer_callback` 함수는 메시지 데이터가 설정되고, 실제 메시지가 출력되는 부분입니다.  
메시지 데이터는 `"Hello world! "`와 숫자 카운트가 진행됩니다.  
- `RCLCPP_INFO` 매크로는 게시된 모든 메시지가 콘솔에 출력되도록 합니다.  

#### 2.2.3. main 부분
<script src="https://gist.github.com/jswoo0615/b9481efe5587195920d0df46eed0aefe.js"></script>

main 문에서는 `Minimal_Publisher`라는 이름의 노드를 실제로 구동시키는 부분입니다.  
- `rclcpp::init(argc, argv)`  
`Minimal_Publisher` 노드를 초기화시킵니다.  
- `rclcpp::spin(std::make_shared<MinimalPublisher>())`  
`Minimal_Publisher` 노드의 데이터를 사용합니다.  
- `rclcpp::shutdown()`  
`Minimal_Publisher` 노드를 종료합니다.

### 2.3. CMakeLists.txt와 package.xml
[`Minimal_Publisher`](#2-publisher-노드) 코드 작성한 뒤인 현재는 `cpp_pubsub` 패키지의 `src` 폴더입니다.  
즉, `~/ros2_ws/src/cpp_pubsub/src`의 경로에서 작업을 했습니다.  
상위 디렉토리로 이동하면 `CMakeLists.txt`, `package.xml` 파일이 있습니다.  
이 두 파일은 위에서 작성한 `Minimal_Publisher` 노드의 빌드를 위해 종속성 패키지를 추가해줍니다.  

#### 2.3.1. CMakeLists.txt
`CMakeLists.txt` 파일을 열기 위해 `~/ros2_ws/src/cpp_pubsub` 폴더로 이동합니다.  
파일을 열면 `CMakeLists.txt`는 아래와 같이 구성되어 있습니다.  
<script src="https://gist.github.com/jswoo0615/bf95145a79e043508ef2566e21224c1c.js"></script>

위 `CMakeLists.txt`는 패키지 빌드 후 처음 열었을 때입니다.  
우리는 위 코드의 9번째 줄 아래에 `rclcpp`, `std_msgs` 종속성 패키지를 추가할 예정입니다.  
```CMake
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)
```
`MinimalPublisher`노드는 `rclcpp`, `std_msgs` 두 종속성 패키지를 사용했으므로 패키지를 추가해줍니다.  

그 후 실행을 할 수 있도록 추가해줍니다.  
```CMake
add_executable(talker src/publisher_memeber_function.cpp)
ament_target_dependencies(talker rclcpp std_msgs)
```
`ros2 run <패키지 이름> <실행 할 프로그램 이름>` 명령어를 사용하여 프로그램을 실행할 예정입니다.  
`MinimalPublisher`노드를 실행하기 위한 이름을 `talker`로 명명해줍니다.  

마지막으로 `ros2 run` 명령어가 패키지를 찾을 수 있도록 해주기 위한 과정입니다.  
```CMake
install(TARGETS
  talker
  DESTINATION lib/${PROJECT_NAME}
)
```
불필요한 부분을 제외하고 최종적으로는 아래와 같이 `CMakeLists.txt`를 구성합니다.  
<script src="https://gist.github.com/jswoo0615/f4eb8dbf18724fc7cb8b3d552136d97b.js"></script>

#### 2.3.2. packages.xml 
```xml

```

## 3. Subscriber 노드


## 4. 빌드