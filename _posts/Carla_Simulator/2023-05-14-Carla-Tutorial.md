---
layout: single
title: "Carla Simulator 기본"
categories: Carla_Simulator
tag: [Carla]
toc: true
author_profile: true
sidebar: 
  nav: "main"
search: true
---
이번 포스트에서는 Carla Simulator의 기본 사용 방법에 대해 알아보도록 하겠습니다.

# Carla Simulator 기본
## 1. 사용 모듈 추가
```python
import os
import glob
import sys
import time


try:
    sys.path.append(glob.glob('carla_simulation_root/PythonAPI/carla/dist/carla-*%d.%d-%s.egg' % (
        sys.version_info.major,
        sys.version_info.minor,
        'win-amd64' if os.name == 'nt' else 'linux-x86_64'))[0])

except IndexError:
    pass

import carla
import argparse
import logging

from numpy import random

import cv2

import numpy as np

import math
```
## 2. Client 설정
Carla Simulator는 프로그램 실행 시 나타나는 Server와 차량 시뮬레이션을 진행하는 Client로 구성되어 있습니다.  
Client를 사용하기 위해 Carla Server의 IP, 포트를 맞춰줍니다.  
여기서는 IP는 `localhost`로 진행하며, 포트번호는 Carla Simulator에서 기본적으로 사용하는 `2000`번을 사용하도록 하겠습니다.  
```python
client = carla.Client('localhost', 2000)
client.set_timeout(20.0)
```
Carla Simulator Server와 Client 간의 연결 시간은 20초로 설정하도록 하겠습니다.  
`client.set_timeout(20.0)`

## 3. 지도 설정
Carla Simulator에서 지도를 변경하는 방법은 두 가지가 있습니다.
1. `python config.py --map Town01`
2. `world = client.load_world('Town01)`  

여기서는 2번의 방법을 사용하도록 하겠습니다.  

```python
world = client.load_world('Town01')
settings = world.get_settings()
settings.fixed_delta_seconds = 0.05
settings.synchronous_mode = True
world.apply_settings(settings)

spawn_points = world.get_map().get_spawn_points()
```
`world = client.load_world('Town01') `여기서는 가상 환경 설정으로 Carla Simulator의 기본 맵인 `Town01`으로 설정했습니다.
`settings = world.get_settings()`  
`get_settings()` 메소드는 `carla.Client.load_world()`의 메소드입니다.  
- `settings.synchronous_mode = True` 메소드를 이용하여 Carla Simulator Server의 시간과 Carla Simulator Client 시간을 동기화 해줍니다.  
- `settings.fixed_delta_seconds = 0.05` 메소드를 이용하여 timestep을 0.05초로 설정합니다. 

### 3.1 Synchronous mode
모든 센서의 데이터를 동일한 시간에 받을 수 있도록 동기화하는 모드입니다.  
카메라 센서, 라이다 센서 등의 다양한 센서 데이터를 받는 상태에서는 Client가 너무 느려지는 문제가 있습니다.  
이러한 경우, Server와 Client간의 데이터 전송 시간의 차로 오버플로우가 발생하여, 다양한 데이터를 제대로 받지 못할 수 있습니다.  
- 비동기 (asynchronous mode) 모드로 진행하는 경우, 센서들의 데이터를 센서의 순서로 받습니다.  
예를 들어 RGB 카메라, Semantic Segmentation 카메라 데이터를 받는다 가정한다면,  
데이터가 저장되는 순서는 
1. RGB 카메라 데이터
2. Semantic Segmentation 카메라 데이터   

순으로 받습니다.  
- 동기 (synchronous mode) 모드로 진행하는 경우, 모든 센서 데이터를 동일한 시간의 데이터를 받습니다.

`spawn_points = world.get_map().get_spawn_points()`  
`world = client.load_world('Town01')`을 이용하여 Carla Simulator에서 가상 주행 시뮬레이션을 할 때 맵을 `Town01`로 설정했습니다.  
현재 설정된 `Town01`에서 차량을 배치할 수 있는 포인트를 가져오는 역할을 합니다.

## 4. 날씨 변경
```python
weather = carla.WeatherParameters(
  cloudiness = 0.0,
  precipitation = 0.0,
  sun_altitude_angle = 110.0
)
world.set_weather(weather)
```
Carla Simulator에서는 다양한 환경 조건을 모사할 수 있습니다.  
비, 눈, 강풍과 같은 날씨 설정을 해줄 수 있습니다.  
Carla Simulator에서 제공하는 날씨 관련 변수는 아래와 같습니다.
### 4.1 Carla Simulator에서 날씨 Parameters
- cloudiness : 구름 양 (단위 : %)    
0 ~ 100까지 구름 양을 조절할 수 있습니다. 
- precipitation : 강우량 (단위 : %)    
0 ~ 100까지 강우량을 조절할 수 있습니다. 
- precipitation_deposits : 도로 침수 정도 (단위 : %)  
0 ~ 100까지 도로 침수 정도를 설정합니다. 
- wind_intensity : 풍속 (단위 : %)  
0 ~ 100까지 풍속을 조절할 수 있습니다. 
- sun_azimuth_angle : 태양 방위각 (단위 : deg)  
0 ~ 180deg이며, 0deg는 북쪽, 180deg는 남쪽입니다.  
- sun_altitude_angle : 태양 고도 (단위 : deg)  
-90 ~ 90deg 범위 내에서 설정 가능합니다. 
  - -90deg : 자정  
  - 90deg : 정오  
- fog_density : 안개량 (단위 : %)  
0 ~ 100까지의 안개량을 조절할 수 있습니다.
- fog_distance : 가시거리 (단위 : m)  

### 4.2 Carla Simulator에서 날씨 Preset
Carla Simulator에서는 날씨 Preset을 제공합니다. 사용 가능한 Preset은 아래와 같습니다.  
- ClearNoon  
- CloudyNoon  
- WetNoon  
- WetCloudyNoon  
- SoftRainNoon  
- MidRainyNoon  
- HardRainNoon  
- ClearSunset  
- CloudySeunset  
- WetSunset  
- WetCloudySunset   
- SoftRainSunset  
- MidRainSunset  
- HardRainSunset

위의 날씨 Preset을 사용하는 방법은 아래와 같습니다.
```python
weather = carla.set_WeatherParameters.ClearNoon
world.set_weather(weather)
```

## 5. Actor 배치
### 5.0 actor list
Carla Simulator는 차량, 보행자, 센서 등의 객체들을 Actor로 구분합니다.  
Carla Simulator는 Unreal 게임 엔진 기반으로 개발되었습니다. 그러므로 Unreal 엔진의 각 요소들의 카테고리를 Actor로 구분합니다.  
시뮬레이션 종료 후 배치 된 모든 객체들을 해제해주기 편하게 하기 위해, 리스트 타입으로 되어있는`actor_list`를 빈 리스트로 만들어줍니다.  
`actor_list = []`  

### 5.1 차량 배치
#### 5.1.1 에고 차량 배치
Actor 배치를 위해, 아래와 같이 두 가지 설정을 해줍니다. 
- Blueprint : Unreal 엔진에서 모델을 구분하는 단위입니다.
- Transform : 해당 모델을 배치할 위치를 입력합니다.

모델을 선택하기 위해서는 아래와 같이 입력을 해주어야 합니다.  
`world.get_blueprint_library().find('사용하고자 하는 모델')`

`world.spawn_actor(차량의 blueprint, 차량의 transform)` 메소드를 이용하여 차량 객체를 생성합니다.  


이를 바탕으로 에고 차량 배치를 해보도록 하겠습니다.  
```python
ego_vehicle = None
vehicle_bp = random.choice(world.get_blueprint_library().filter('vehicle'))

vehicle_transform = random.choice(spawn_points)

ego_vehicle = world.spawn_actor(vehicle_bp, vehicle_transform)

ego_vehicle.set_autopilot(True)
actor_list.append(ego_vehicle)
```
<img width="987" alt="Screenshot 2023-06-17 at 5 18 48 PM" src="https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/68c6562c-e82d-46ea-818c-af0035d4c5c2">

위 그림과 같이 `ego_vehicle`에 해당하는 ActorBlueprint, 차량의 위치가 임의로 설정되었으며, `ego_vehicle`이 생성되었습니다.  

생성된 `ego_vehicle`은 `autopilot` 기능을 사용할 수 있습니다.  
`ego_vehicle.set_autopilot(True)` 메소드를 이용하여 Carla Simulator 내부에서 자동운전 기능을 사용합니다.

![spawn_point](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/79317b4b-e8b0-459d-bb38-032624663306)


#### 5.1.2 다른 차량 배치
```python
for _ in range(0, 5):
  transform = random.choice(spawn_points)
  vehicle_bp = random.choice(world.get_blueprint_library().filter('vehicle'))

  other_vehicle = world.spawn_actor(vehicle_bp, transform)

  if other_vehicle in not None:
    other_vehicle.set_autopilot(True)
    actor_list.append(other_vehicle)
```
다른 차량 또한 `spawn_points` 중 랜덤한 위치로 배치할 수 있습니다.  
에고 차량과 마찬가지로 다른 차량들 마찬가지로 `set_autopilot()` 메소드를 이용하여 자동 운전을 할 수 있습니다.
### 5.2 센서 배치
#### 5.2.1 카메라
##### 5.2.1.0 opencv를 이용한 카메라 데이터 출력
opencv를 이용하여 RGB 카메라 데이터를 출력하여 차량이 움직이는 상황을 확인할 수 있도록 하는 함수를 만들어줍니다.  
```python
IM_WIDTH = 640
IM_HEIGHT = 480
FOV = 110
def process_img(image):
  i1 = np.array(image.raw_data)
  i2 = i1.reshape(IM_HEIGHT, IM_WIDTH, 4)
```
##### 5.2.1.1 RGB 카메라
Carla Simulator에서 센서 카테고리를 선택하는 방법은 `carla.Client.get_world().get_blueprint_library().find('sensor.camera.rgb')`와 같습니다.  
여기서는 데이터 저장용 카메라, opencv를 이용하여 에고 차량의 주행 상태를 보여주는 카메라를 나누어 보도록 하겠습니다.

###### opencv를 이용한 카메라 데이터 출력

```python
ego_rgb_cam = None

rgb_cam_bp = world.get_blueprint_library().find('sensor.camera.rgb')
rgb_cam_bp.set_attribute('image_size_x', f'{IM_WIDTH}')
rgb_cam_bp.set_attribute('image_size_y', f'{IM_HEIGHT}')
rgb_cam_bp.set_attribute('fov', f'{FOV}')
rgb_cam_transform = carla.Transform(carla.Location(x=2.5, z=1.75), carla.Rotation(yaw=180))

ego_rgb_cam = world.spawn_actor(rgb_cam_bp, rgb_cam_transform, attach_to=ego_vehicle)
ego_rgb_cam.listen(lambda image: process_img(image))

actor_list.append(ego_rgb_cam)
```
센서를 설정할 때 `spawn_actor(sensor_blueprint, sensor_transform, attach_to=센서 배치 차량)`을 입력해줍니다.  
`attach_to=센서 배치 차량`을 입력하여 해당 센서가 어느 차량에 부착할지를 설정합니다.  
  
모든 객체의 위치는 아래와 같은 메소드로 설정해줍니다.  
`carla.Transform(carla.Location(x=, y=, z= ), carla.Rotation(roll=, yaw=, pitch= ))`  
`carla.Location()` 메소드는 객체의 x, y, z값을 설정해줍니다.  
`carla.Rotation()` 메소드는 객체의 roll, yaw, pitch를 설정합니다.

`carla.Rotation(yaw=180)`으로 설정했을 때의 rgb 카메라 데이터입니다.
![5](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/c1dd8d28-0078-4b11-b5ec-e730e09cb50c)   
   
`carla.Rotation(yaw=0)`으로 설정했을 때의 rgb 카메라 데이터입니다.  
![7](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/04159a19-6124-4c33-89a3-625b188e2a7e)

###### RGB 카메라 데이터 저장

```python
frt_ego_cam = None
frt_ego_cam = world.spawn_actor(rgb_cam_bp, rgb_cam_transform, attach_to=ego_vehicle)
frt_ego_cam.listen(lambda image: image.save_to_disk('tutorial/camera/rgb/%.6d.png' % image.frame))
actor_list.append(frt_ego_cam)
```
`frt_ego_cam.listen()` attribute를 이용하여 카메라 센서로부터 얻는 데이터를 `*.png` 파일로 저장합니다.  
`save_to_disk()` 메소드를 이용하여 카메라 데이터를 저장할 수 있습니다.  
  
![cam_data](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/521bcaac-77a8-45b0-9ae8-1ca0bab7bb0d)

##### 5.2.1.2 Depth 카메라
```python
ego_depth_cam = None
depth_bp = world.get_blueprint_library().find('sensor.camera.depth')
depth_transform = rgb_cam_transform
depth_bp.set_attribute('image_size_x', str(IM_WIDTH))
depth_bp.set_attribute('image_size_y', str(IM_HEIGHT))
depth_bp.set_attribute('fov', str(FOV))

ego_depth_cam = world.spawn_actor(depth_bp, depth_transform, attach_to=ego_vehicle)
ego_depth_cam.listen(lambda image: image.save_to_disk('tutorial/camera/depth/%.6d.png' % image.frame))
# ego_depth_cam.listen(lambda image: image.save_to_disk('tutorial/camera/depth/%.6d.png' % image.frame, carla.ColorConverter.CityScapesPalette))
actor_list.append(ego_depth_cam)
```
Depth 카메라 또한 [RGB 카메라](#5211-rgb-카메라)와 동일하게 camera blueprint, transform, 카메라 부착 위치를 설정해줍니다.  
`ego_depth_cam.listen(lambda image: image.save_to_disk('tutorial/camera/depth/%.6d.png' % image.frame, carla.ColorConverter.CityScapesPalette))`의 `carla.ColorConverter.CityScapesPalette`와 같이 카메라 데이터에 필터를 적용할 수 있습니다.  
아래는 depth 카메라 데이터입니다.  
![depth](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/0fabeda1-7ff3-4a66-b3b3-47555ee0710e)  

##### 5.2.1.3 Semantic Segmentation 카메라
```python
ego_semantic_cam = None
segmen_bp = world.get_blueprint_library().find('sensor.camera.semantic_segmentation')
segmen_transform = rgb_cam_transform
segmen_bp.set_attribute('image_size_x', str(IM_WIDTH))
segmen_bp.set_attribute('image_size_y', str(IM_HEIGHT))
segmen_bp.set_attribute('fov', str(FOV))

ego_semantic_cam = world.spawn_actor(segmen_bp, segmen_transform, attach_to=ego_vehicle)
ego_semantic_cam.listen(lambda image: image.save_to_disk('tutorial/camera/semantic/%.6d.png' % image.frame, carla.ColorConverter.CityScapesPalette))
actor_list.append(ego_semantic_cam)
```  
Semantic Segmentation 카메라는 아래 그림과 같이 데이터를 저장됩니다.  
![semantic_segmentation](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/f3bd745f-aee4-4cb8-9260-ed81a1b06072)  
Semantic Segmentation 카메라 데이터는 RGB 값을 이용하여 객체 태그를 분류합니다.  
객체 태그 분류를 하기 위해 `ColorConverter.CityScapesPalette`로 이미지 컨버팅을 해주어야 합니다.  
객체 태그 표는 아래와 같습니다.  

|Value|Tag|Converted Color|  
|-----|---|---------------|
|`0`|Unlabeling|`(0,0,0)`|
|`1`|Building|`(70,70,70)`|
|`2`|Fence|`(100,40,40)`|
|`3`|Other|`(55,90,80)`|
|`4`|Pedestrian|`(220,20,60)`|
|`5`|Pole|`(153,153,153)`|
|`6`|RoadLine|`(157,234,50)`|
|`7`|Road|`(128,64,128)`|
|`8`|SideWalk|`(244,35,232)`|
|`9`|Vegetation|`(107,142,35)`|
|`10`|Vehicle|`(0,0,142)`|
|`11`|Wall|`(102,102,156)`|
|`12`|TrafficSign|`(220,220,0)`|
|`13`|Sky|`(70,130,180)`|
|`14`|Ground|`(81,0,81)`|
|`15`|Bridge|`(150,100,100)`|
|`16`|RailTrack|`(230,150,140)`|
|`17`|GuardRail|`(180,165,180)`|
|`18`|TrafficLight|`(250,170,30)`|
|`19`|Static|`(110,190,160)`|
|`20`|Dynamic|`(170,120,50)`|
|`21`|Water|`(45,60,150)`|
|`22`|Terrain|`(145,170,180)`|

##### 5.2.1.4 Instance Segmentation 카메라
```python
ego_instance = None
instance_bp = world.get_blueprint_library().find('sensor.camera.instance_segmentation')
instance_transform = rgb_cam_transform
instance_bp.set_attribute('image_size_x', str(IM_WIDTH))
instance_bp.set_attribute('image_size_y', str(IM_HEIGHT))
instance_bp.set_attribute('fov', str(FOV))

ego_instance = world.spawn_actor(instance_bp, instance_transform, attach_to=ego_vehicle)
ego_instance.listen(lambda image: image.save_to_disk('tutorial/camera/instance_segmentation/%.6d.png' % image.frame))
actor_list.append(ego_instance)
```
Semantic segmentation 카메라 데이터로는 겹쳐진 instance를 구분할 수 없습니다.  
이를 위해 Instance segmentation 카메라 데이터를 사용합니다.  
이러한 Instance segmentation 카메라 데이터를 출력할 수 있습니다.  
#### 5.2.2 Lidar
```python
ego_lidar = None

lidar_bp = world.get_blueprint_library().find('sensor.lidar.ray_cast')
lidar_transform = carla.Transform(carla.Location(x=0.0, z=2.0))
lidar_bp.set_attribute('channels', str(32))
lidar_bp.set_attribute('range', str(20))
lidar_bp.set_attribute('rotation_frequency', str(40))
lidar_bp.set_attribute('points_per_second', str(90000))

ego_lidar = world.spawn_actor(lidar_bp, lidar_transform, attach_to=ego_vehicle)
ego_lidar.listen(lambda point_cloud: point_cloud.save_to_disk('tutorial/lidar/%.6d.ply' % point_cloud.frame))
actor_list.append(ego_lidar)
```
Carla Simulator에서 라이다 센서를 이용할 수 있습니다.  
`*.ply` 포맷으로 저장됩니다.  
그러므로 라이다 데이터를 가시화하기 위해, <b>meshlab</b> 프로그램을 설치해야 합니다.  
![lidar](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/6bfb3980-fc53-4dee-a580-f78a74f924f7)  
  
meshlab 설치하는 커맨드라인입니다.
```shell
sudo apt-get update -y
sudo apt-get install -y meshlab
```
#### 5.2.3 Radar
```python
ego_radar = None
radar_bp = world.get_blueprint_library().find('sensor.other.radar')
radar_bp.set_attribute('horizontal_fov', str(35))
radar_bp.set_attribute('vertical_fov', str(20))
radar_bp.set_attribute('range', str(20))
radar_transform = carla.Transform(carla.Location(x=2.0, z=1.0), carla.Rotation(roll=0.0, yaw=0.0, pitch=5.0))
ego_radar = world.spawn_actor(radar_bp, radar_transform, attach_to=ego_vehicle)

def radar_callback(radar_data):
    velocity_range = 7.5            # m/s
    current_rot = radar_data.transform.rotation
    for detect in radar_data:
        azi = math.degrees(detect.azimuth)
        alt = math.degrees(detect.altitude)
        # The 0.25 adjusts a bit the distance so the dots can be properly seen
        fw_vec = carla.Vector3D(x=detect.depth - 0.25)
        carla.Transform(
            carla.Location(), 
            carla.Rotation(
            pitch=current_rot.pitch + alt,
            yaw=current_rot.yaw + azi,
            roll=current_rot.roll)).transform(fw_vec)
        
        def clamp(min_v, max_v, value):
            return max(min_v, min(value, max_v))
        
        norm_velocity = detect.velocity / velocity_range            # range [-1, 1]
        r = int(clamp(0.0, 1.0, 1.0 - norm_velocity) * 255.0)
        g = int(clamp(0.0, 1.0, 1.0 - abs(norm_velocity)) * 255.0)
        b = int(abs(clamp(-1.0, 0.0, -1.0 - norm_velocity)) * 255.0)

        world.debug.draw_point(
            radar_data.transform.location + fw_vec,
            size=0.075,
            life_time=0.06,
            persistent_lines=False,
            color=carla.Color(r,g,b))

ego_radar.listen(lambda radar_data: radar_callback(radar_data))
actor_list.append(ego_radar)
```
Radar 데이터는 에고 차량과 객체와의 상대 속도를 2D 포인트 맵으로 변환합니다.  
측정된 지점은 극좌표, 거리 및 속도를 지정하는 `carla.RadarDetection`의 배열로 나타냅니다.  
Carla Simulator의 Radar 센서는 흰색, 적색, 청색 점으로 debug를 합니다.  
흰색 점으로 표시되는 경우 가로등, 신호등과 같은 정적인 물체를 나타냅니다.  
적색 점으로 표시되는 경우 상대 객체와 점점 가까워지는 것을 의미합니다.  
청색 점으로 표시되는 경우 상대 객체와 점점 멀어지는 것을 의미합니다.  
![radar](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/48118ac4-ad5a-4595-a7cc-bae6926b7587)

#### 5.2.4 GNSS / IMU 센서
##### 5.2.4.1 GNSS 센서
```python
ego_gnss = None
gnss_bp = world.get_blueprint_library().find('sensor.other.gnss')
gnss_bp.set_attribute('sensor_tick', str(1))
gnss_transform = rgb_cam_transform
ego_gnss = world.spawn_actor(gnss_bp, gnss_transform, attach_to=ego_vehicle)

def gnss_callback(gnss):
    print(str(gnss))

ego_gnss.listen(lambda gnss: gnss_callback(gnss))
actor_list.append(ego_gnss)
```
gnss, imu, collision detector, lane invasion detector, obstacle detector는 정보를 표출하기 위해 함수를 생성해주어야 합니다.

함수의 기본 템플릿은 아래와 같습니다.  
```python
def sensor_callback(data):
  print(str(data))
```
각 센서의 `listen` 메소드를 이용하여 취득된 데이터를 사용합니다.  
![gnss](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/1119998b-1ceb-42a9-ac28-655bb277ce1c)

##### 5.2.4.2 IMU 센서
```python
ego_imu = None
imu_bp = world.get_blueprint_library().find('sensor.other.imu')
imu_bp.set_attribute('sensor_tick', str(1))
imu_transform = rgb_cam_transform
ego_imu = world.spawn_actor(imu_bp, imu_transform, attach_to=ego_vehicle)

def imu_callback(imu):
    print(str(imu))

ego_imu.listen(lambda imu: imu_callback(imu))
actor_list.append(ego_imu)
```
![imu](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/edbb3d54-f570-4fe1-aa6a-f4fd7d0a4c33)  
#### 5.2.5 기타 센서
##### 5.2.5.1 Collision Detector
```python
ego_colli = None
colli_bp = world.get_blueprint_library().find('sensor.other.collision')
colli_transform = rgb_cam_transform
ego_colli = world.spawn_actor(colli_bp, colli_transform, attach_to=ego_vehicle)

def collision_callback(colli):
    print("Collision with " + str(colli))

ego_colli.listen(lambda colli: collision_callback(colli))
actor_list.append(ego_colli)
```
![collision](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/b3303ac3-0801-4259-aaa2-6145c107dc95)

##### 5.2.5.2 Lane Invasion Detector
```python
ego_lane_invasion = None
lane_bp = world.get_blueprint_library().find('sensor.other.lane_invasion')
lane_transform = rgb_cam_transform
ego_lane_invasion = world.spawn_actor(lane_bp, lane_transform, attach_to=ego_lane_invasion)

def lane_callback(lane):
    print(str(lane))

ego_lane_invasion.listen(lambda lane: lane_callback(lane))
actor_list.append(ego_lane_invasion)
```
![lane_invasion](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/dc0fe02d-99e1-4df3-853d-496868e2c99c)

##### 5.2.5.3 Obstacle Detector
```python
ego_obstacle = None
obstacle_bp = world.get_blueprint_library().find('sensor.other.obstacle')
obstacle_bp.set_attribute('distance', str(10))
obstacle_bp.set_attribute('debug_linetrace', str(True))
obstacle_transform = rgb_cam_transform
ego_obstacle = world.spawn_actor(obstacle_bp, obstacle_transform, attach_to=ego_vehicle)

def obstacle_callback(obstacle):
    print(str(obstacle))

ego_obstacle.listen(lambda obstacle: obstacle_callback(obstacle))
actor_list.append(ego_obstacle)

time.sleep(500)
```
![obstacle](https://github.com/jswoo0615/jswoo0615.github.io/assets/128343128/1a48976e-c884-461b-9c36-d207545ce220)
### 5.3 Actor 해제
위 과정들을 통해 생성된 `actor_list` 내의 차량, 센서 등의 객체들을 해제해야 합니다.  
객체들을 해제를 하지 않으면 Carla Simulator Server에 그대로 객체들이 남아있기 때문에 다음 시뮬레이션 진행 시 제대로 된 시뮬레이션을 진행할 수 없습니다.  
```python
for actor in actor_list:
  actor.destroy()
```
## 6. 전체 코드
<script src="https://gist.github.com/jswoo0615/577349a1681352dd08f12584a5768e56.js"></script>
다음 포스트는 Bounding Box 및 Pascal VOC 데이터셋 취득 방법에 대해 알아보도록 하겠습니다.  
  
