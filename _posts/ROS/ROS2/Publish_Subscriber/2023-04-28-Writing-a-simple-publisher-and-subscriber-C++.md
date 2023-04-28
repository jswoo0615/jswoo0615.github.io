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
---

## 1. 패키지 생성 
패키지를 생성 및 빌드하기 위해 작업공간의 `~/ros2_ws/src` 폴더로 이동하여 패키지를 생성해줍니다.  

지금은 `cpp_pubsub` 이라는 이름의 패키지를 만들도록 하겠습니다.  
```shell
cd ~/ros2_ws/src

ros2 pkg create --build-type ament_cmake cpp_pubsub
```

아래 그림과 같이 `cpp_pubsub` 이름의 패키지가 생성되었습니다.  
<img width="328" alt="Publisher_Subscriber_1" src="https://user-images.githubusercontent.com/128343128/235099090-3703d77b-da1e-498d-a81e-981916efda5a.png">  


## 2. Publisher 노드 
`Publisher` 노드를 생성하기 위해 패키지 내의 `cpp_pubsub/src`로 이동합니다.  
### 2.1. 전체 코드
```c++
#include <chrono>
#include <functional>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;

class MinimalPublisher : public rclcpp::Node
{
  public:
    MinimalPublisher() : Node("Minimal_Publisher", count_(0))
    {
      publisher_ = this->create_publisher<std_msgs::msg::String>("topic", 10);
      timer_ = this->create_wall_timer(100ms, std::bind(&MinimalPublisher::timer_callback, this));
    }

  private:
    void timer_callback()
    {
      auto message = std_msgs::msg::String();
      message.data = "Hello, World! " + std::to_string(count_++);
      RCLCPP_INFO(this->get_logger(), "Publishing : '%s'", message.data.c_str());
      publisher_->publish(message);
    }
    rclcpp::TimerBase::SharedPtr timer_;
    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
    size_t count_;
};

int main(int argc, char *argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<MinimalPublisher>());
  rclcpp::shutdown();

  return 0;
}
```

### 2.2. 코드 분석
#### 2.2.1. 헤더부분
```c++
#include <chrono>
#include <functional>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"
```

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
```c++
class MinimalPublisher : public rclcpp::Node
{
  public:
    MinimalPublisher() : Node("Minial_Publisher")
    {
      publisher_ = this->create_publisher<std_msgs::msg::String>("topic", count_(0));
      timer = this->create_wall_timer(100ms, std::bind(&MinimalPublisher::timer_callback, this));
    }
};
```
`rclcpp::Node`를 상속하여 `MinimalPublisher` 클래스를 생성합니다.  
`this`는 모두 `Node`를 참조합니다.  
`public` 생성자는 노드 이름을 `Minimal_Publisher`이라 정의하고, `count_`를 0으로 초기화했습니다.  
생성자 내부에서 `publisher`는 `String` 메시지 타입, `topic`의 이름과 `queue` 사이즈를 정하여 백업 이벤트에서의 메시지 갯수를 제한합니다.  
`timer_`를 초기화하여 1초에 2회씩 `private` 생성자의 `timer_callback`함수가 실행되도록 합니다.

##### 2.2.2.2. private 생성자 부분
```c++
class MinimalPublisher : public rclcpp::Node 
{
  private:
    void timer_callback()
    {
      auto message = std_msgs::msg::String();
      message.data = "Hello world! " + std::to_string(count_++);
      RCLCPP_INFO(this->get_logger(), "Publishing : '%s'", message.data.c_str());
      publisher_->publish(message);
    }
};
```
`timer_callback` 함수는 메시지 데이터가 설정되고, 실제 메시지가 출력되는 부분입니다.  
메시지 데이터는 `"Hello world! "`와 숫자 카운트가 진행됩니다.  
`RCLCPP_INFO` 매크로는 게시된 모든 메시지가 콘솔에 출력되도록 합니다.  

## 3. Subscriber 노드


## 4. 빌드