---
layout: single
title: "[ROS2] Publisher 생성"
categories: ROS2
tag: [ROS2]
toc: true
author_profile: true
sidebar: 
  nav: "main"
search: true
published: false
---

# 1. 패키지 생성 
패키지를 생성 및 빌드하기 위해 작업공간의 `~/ros2_ws/src` 폴더로 이동하여 패키지를 생성해줍니다.  
패키지 생성 명령어는 아래와 같습니다.  
```shell
ros2 pkg create --build-type ament_cmake <your_package_name>
```

지금은 `py_pubsub` 이라는 이름의 패키지를 만들도록 하겠습니다.  
```shell
ros2 pkg create --build-type ament_cmake py_pubsub
```

아래 그림과 같이 `py_pubsub` 이름의 패키지가 생성되었습니다.  
<img width="250" alt="Screenshot 2023-06-24 at 1 21 28 PM" src="https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/eca441ec-709b-48e8-92d3-3f3655bfba95">


# 2. Publisher 노드 
`Publisher` 노드를 생성하기 위해 패키지 내의 `py_pubsub/py_pubsub` 폴더로 이동합니다.  
폴더 내에는 `__init__.py` 파일만 존재하는 상태입니다.  
  
## 2.1. 전체 코드
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
  ## Init function
  def __init__(self):
    super().__init__('minimal_publisher')
    self.publisher_ = self.create_publisher(String, 'topic', 10)
    timer_period = 0.5
    self.timer = self.create_timer(timer_period, self.timer_callback)
    self.i = 0

  ## timer_callback function
  def timer_callback(self):
    msg = String()
    msg.data = 'Hello World : %d' % self.i
    self.get_logger().info('Publishing : "%s"' % msg.data)
    self.i += 1

  # main function
  def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)

    # Destroy the node explicitly
    minimal_publisher.destroy_node()
    rclpy.shutdown()
```

## 2.2. 코드 분석
### 2.2.1. 모듈
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
```
`Node` 클래스를 사용하기 위해 `rclpy` 패키지을 불러옵니다.  
`rclpy` 패키지 내의 `Node` 모듈을 불러옵니다.
```python
import rclpy
from rclpy.node import Node
```
  
`ros2 share` 라이브러리에서 제공하는 `String` 메시지를 사용하기 위해 `/opt/ros/$(ROS_DISTRO)/share/std_msgs/msg`의 `String.msg`를 불러옵니다.  
```python
from std_msgs.msg import String
```
### 2.2.2. Publisher 클래스
`Publisher` Node 클래스를 선언해줍니다.  
`MinimalPublisher():` 이름의 클래스를 생성합니다.
`MinimalPublisher`는 `Node`의 하위 클래스가 됩니다.    
```python
class MinimalPublisher(Node):
```

### 2.2.3. init 함수
```python
  def __init__(self):
    super().__init__('minimal_publisher')
    self.publisher_ = self.create_publisher(String, 'topic', 10)
    timer_period = 0.05
    self.timer = self.create_timer(timer_period, self.timer_callback)
    self.i = 0
```
1. super().__init__()  
`Node` 클래스 생성자입니다.  
여기서 `super().__init__('minimal_publisher')`는 'minimal_publisher' 이름의 `Node`를 생성합니다.  
  
2. `create_publisher`
Publisher 노드를 생성하도록 합니다.  
여기서는 `Node`가 `ste_msgs.msg` 모듈에서 가져온 `String` 타입의 메시지를 사용할 수 있도록 합니다.   
큐 사이즈는 `10`으로 선언합니다.  
`subscriber` 노드가 충분한 속도로 메시지를 전달받지 못하는 경우에 메시지 크기를 제한하는 QoS (Quality of Service) 설정입니다.  

### 2.2.4. callback 함수
```python
  def timer_callback(self):
    msg = String()
    msg.data = 'Hello World! : %d' % self.i
    self.get_logger().info('Publishing : "%s"' % msg.data)
    self.i += 1
```
### 2.2.5. main 함수
```python
  def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)

    minimal_publisher.destroy_node()
    rclpy.shutdown()
```
`rclpy`의 `init` 메소드를 이용하여 `Node`를 초기화해줍니다.  
`callback`이 호출되며 메시지 출력을 반복합니다.  

## 2.3. 종속성 패키지
`ros2_ws/src/py_pubsub` 디렉토리로 이동합니다.  
해당 디렉토리 내부에는 `setup.py`, `setup.cfg`, `package.xml` 파일이 있습니다.

### 2.3.1. `package.xml`
`package.xml` 파일을 열어 위의 [모듈](#221-모듈)에서 사용한 패키지들을 빌드 항목으로 등록해줍니다.  
`py_pubsub` 패키지를 생성하며 생성된 `package.xml`의 기본 형태는 아래와 같습니다.  
```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>py_pubsub</name>
  <version>0.0.0</version>
  <description>TODO: Package description</description>
  <maintainer email="">ubuntu</maintainer>
  <license>TODO: License declaration</license>
  
  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>python3-pytest</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>
```
여기서는 `rclpy`, `std_msgs`가 되겠군요!
```xml
<exec_depend>rclpy</exec_depend>
<exec_depend>std_msgs</exec_depend>
```
`rclpy`, `std_msgs` 종속성 패키지를 입력하면 아래와 같이 됨을 확인할 수 있습니다.  
종속성 패키지를 추가한 후 전체 코드는 아래와 같이 됩니다.  

```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>py_pubsub</name>
  <version>0.0.0</version>
  <description>TODO: Package description</description>
  <maintainer email="">ubuntu</maintainer>
  <license>TODO: License declaration</license>

  <exec_depend>rclpy</exec_depend>
  <exec_depend>std_msgs</exec_depend>

  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>python3-pytest</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>
```
### 2.3.2. Entry point 추가하기
#### 2.3.2.1. `setup.py`
처음 `setup.py` 파일을 열면 아래와 같이 구성되어 있습니다.  
```python
from setuptools import setup

package_name = 'py_pubsub'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='ubuntu',
    maintainer_email='',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [

        ],
    },
)
```
`entry_points` 내부의 `console_scripts`에 `py_pubsub.publisher_member_function:main`를 입력하여 [init함수](#223-init-함수)에서 설정한 `minimal_publisher`의 명칭을 정해주고, `py_pubsub` 패키지에서 `publisher_member_function.py`를 실행하도록 합니다.  

`setup.py`의 전체 코드는 아래와 같습니다.  
```python
from setuptools import setup

package_name = 'py_pubsub'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='ubuntu',
    maintainer_email='',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'talker = py_pubsub.publisher_member_function:main'
        ],
    },
)
```
#### 2.3.2.2. `setup.cfg`
`setup.cfg` 파일을 열면 아래와 같습니다.  
```shell
```cfg
[develop]
script_dir=$base/lib/py_pubsub
[install]
install_scripts=$base/lib/py_pubsub
```

## 2.4. 빌드 및 실행
### 2.4.1. 빌드
빌드를 위해 워크스페이스 루트 디렉토리로 이동합니다.  
저의 경우는 `cd ~/ros2_ws`입니다.  

`package.xml` 파일에 추가한 종속성 패키지가 없다면 설치를 해줍니다.  
`rosdep install -i --from-path src --rosdistro humble -y`  
  
빌드를 실행하는 명령어는 아래와 같습니다.  
`colcon build --packages-select py_pubsub`

### 2.4.2. 실행
빌드가 끝난 후 실행을 하며 원하는 결과를 출력하는지 확인합니다.  
실행 전에 환경변수 등록을 먼저 해줍니다.  
저의 경우는 `source ~/ros2_ws/install/setup.bash`가 되겠군요.  
생성한 패키지의 `py_pubsub`에서 [`setup.py`](#2321-setuppy)에서 설정한 `Node`의 이름인 `talker`를 실행합니다.  
실행을 위해 `ros2 run py_pubsub talker`를 터미널에 입력하여 실행합니다.  
  
실행 결과는 아래와 같습니다.  
```shell
[INFO] [1687591859.334984411] [minimal_publisher]: Publishing : "Hello World: 0"
[INFO] [1687591859.838891671] [minimal_publisher]: Publishing : "Hello World: 1"
[INFO] [1687591860.333232065] [minimal_publisher]: Publishing : "Hello World: 2"
[INFO] [1687591860.860489326] [minimal_publisher]: Publishing : "Hello World: 3"
[INFO] [1687591861.303425825] [minimal_publisher]: Publishing : "Hello World: 4"
[INFO] [1687591861.812006184] [minimal_publisher]: Publishing : "Hello World: 5"
[INFO] [1687591862.307561843] [minimal_publisher]: Publishing : "Hello World: 6"
[INFO] [1687591862.859252533] [minimal_publisher]: Publishing : "Hello World: 7"
[INFO] [1687591863.345281204] [minimal_publisher]: Publishing : "Hello World: 8"

```
  
## 2.5 Publisher 노드 전체 코드
```python
import rclpy
from rclpy.node import Node

from std_msgs.msg import String


class MinimalSubscriber(Node):

    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)


def main(args=None):
    rclpy.init(args=args)

    minimal_subscriber = MinimalSubscriber()

    rclpy.spin(minimal_subscriber)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

# 3. C++로 구성한다면?
ROS2 공부를 하면서 C++로 공부를 했었습니다.  
하지만 Carla Simulator ROS Bridge를 분석하다보니 파이썬으로 구성되어 있었습니다.  
그러므로 파이썬으로 구현하는 방법을 알아보기 위해 이번 포스트를 쓰게 되었습니다.  
  
C++로 구성한다면 `publisher_member_function.cpp`는 아래와 같이 구성할 수 있습니다.  
```c++
#include <chrono>
#include <functional>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;

/* This example creates a subclass of Node and uses std::bind() to register a
* member function as a callback from the timer. */

class MinimalPublisher : public rclcpp::Node
{
  public:
    MinimalPublisher()
    : Node("minimal_publisher"), count_(0)
    {
      publisher_ = this->create_publisher<std_msgs::msg::String>("topic", 10);
      timer_ = this->create_wall_timer(
      500ms, std::bind(&MinimalPublisher::timer_callback, this));
    }

  private:
    void timer_callback()
    {
      auto message = std_msgs::msg::String();
      message.data = "Hello, world! " + std::to_string(count_++);
      RCLCPP_INFO(this->get_logger(), "Publishing: '%s'", message.data.c_str());
      publisher_->publish(message);
    }
    rclcpp::TimerBase::SharedPtr timer_;
    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
    size_t count_;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<MinimalPublisher>());
  rclcpp::shutdown();
  return 0;
}
```
`Publisher`와 `Subscriber`를 같은 포스트에 작성하려 하는데 내용이 길어져 분할하여 포스팅을 하고자 합니다.  
다음번엔 `Subscriber`에 대해 작성하도록 하겠습니다.  
감사합니다!