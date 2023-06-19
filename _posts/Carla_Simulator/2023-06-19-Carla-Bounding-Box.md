---
layout: single
title: "Carla Simulator Bounding Box 기본"
categories: Carla_Simulator
tag: [Carla]
toc: true
author_profile: true
sidebar: 
  nav: "main"
search: true
---

지난 포스트에서는 Carla Simulator에서 맵 선택, 차량, 센서 설정 등에 대해 알아봤었습니다.  
이번 시간에는 2D / 3D Bounding Box와 Pascal VOC 데이터 셋 수집에 대해 포스팅을 진행하도록 하겠습니다.  

## 1. 기존 코드
지난 포스트 [Carla_Simulator_기본](./2023-05-14-Carla-Tutorial.md)의 [모듈추가](./2023-05-14-Carla-Tutorial.md/#1-사용-모듈-추가)와 동일합니다.  
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
import queue
```

이전 포스트와 동일하게 `Client`, 맵, 차량 및 센서들을 배치하도록 하겠습니다.  
```python
# Client 설정
client = carla.Client('localhost', 2000)
client.set_timeout(20.0)

# 맵 설정
world = client.load_world('Town01')
settings = world.get_settings()
settings.fixed_delta_seconds = 0.05
settings.synchronous_mode = True
world.apply_settings(settings)

spawn_points = world.get_map().get_spawn_points()

# 날씨 설정
weather = carla.WeatherParameters(
  cloudiness = 0.0,
  precipitation = 0.0,
  sun_altitude_angle = 110.0
)
world.set_weather(weather)

# 에고 차량 설정
ego_vehicle = None
vehicle_bp = random.choice(world.get_blueprint_library().filter('vehicle'))

vehicle_transform = random.choice(spawn_points)

ego_vehicle = world.spawn_actor(vehicle_bp, vehicle_transform)

ego_vehicle.set_autopilot(True)
actor_list.append(ego_vehicle)

# 카메라 설정
ego_camera = None
camera_bp = world.get_blueprint_library().find('sensor.camera.rgb')
camera_init_trans = carla.Transform(carla.Location(z=2.0))
ego_camera = world.spawn_actor(camera_bp, camera_init_trans, attach_to=ego_vehicle)
actor_list.append(ego_camera)
```

## 2. Image Queue
지난 포스팅의 내용을 바탕으로 맵, 차량, 센서 등을 설정했습니다.  
이어서 시뮬레이션을 진행하며 얻는 카메라 데이터를 <b>queue</b> 형식으로 데이터를 받습니다.  
```python
# 카메라 데이터를 저장 및 검색하기 위한 queue 생성
image_q = queue.Queue()
ego_camera.listen(image_q.put)
```
카메라 데이터 취득 시 image의 사이즈, 시야각을 설정해줍니다.  
```python
image_w = camera_bp.get_attribute("image_size_x").as_int()
image_h = camera_bp.get_attribute("image_size_y").as_int()
fov = camera_bp.get_attribute("fov").as_float()
```
또한 아래와 같이 image 사이즈, 시야각을 설정해줄 수 있습니다.  
```python
image_w = camera_bp.get_attribute("image_size_x", str(640))
image_h = camera_bp.get_attribute("image_size_y", str(480))
fov = camera_bp.get_attribute("fov", float(110.0))
```

## 3. Image Projection
시뮬레이션을 진행하며 3D 포인트로 이루어진 객체를 2D 평면으로 투영하는 과정을 거쳐야 합니다.  
이러한 과정을 <b>image projection</b>이라 합니다.   

```python
def build_projection_matrix(w, h, fov):
  focal = w / (2.0 * np.tan(fov * np.pi / 360.0))
  K = np.identity(3)
  K[0, 0] = K[1, 1] = focal           # focal length
  K[0, 2] = w / 2.0                   # principal point
  K[1, 2] = h / 2.0                   # principal point
  return K
```
`Focal Length`는 normalized scale에서 pixel scale로 변환 할 수 있도록 해줍니다.  
`Principal point`는 중앙 픽셀의 값입니다. 각각 `K[0, 2]`는 x축, `K[1, 2]`는 y축을 의미합니다.  
`K[2, 2]`의 1은 3차원에서 2차원으로 축소하기 위해서 1로 사용합니다.  

설정한 image 사이즈 및 시야각과 위에서 정의된 함수 `build_projection_matrix(w, h, fov)`를 이용하여 Camera projection matrix를 구하겠습니다.  
```python
K = build_projection_matrix(image_w, image_h, fov)
```

## 4. 좌표 변환
위 [Image_Projection](#13-image-projection)에서 구해진 3D 좌표에서 2D 좌표로 변환해야 합니다.  
먼저, `actor.get_transform().get_inverse_matrix()` 메소드를 이용하여 3D 좌표를 카메라 좌표로 변환합니다.    
```python
world_2_camera = np.array(ego_camera.get_transform().get_inverse_matrix())
```

```python
def get_image_point(loc, K, w2c):
  point = np.array([loc.x, loc.y, loc.z, 1])
  point_2d = np.dot(w2c, point)
  point_2d = [point_2d[1], -point_2d[2], point_2d[0]]
  point_img = np.dot(K, point_2d)
  point_img[0] /= point_img[2]
  point_img[1] /= point_img[2]

  return point_img[0:2]
```
- `loc`는 3차원 좌표로 `carla.Position`으로 얻을 수 있습니다.  
- `point`는 `loc`로 얻어진 3차원 좌표를 배열로 나타냈습니다.  
- `point_2d`는 3차원 좌표 배열인 `point`를 카메라 좌표인 2차원 좌표로 변환했습니다.  
또한 (x, y, z) 좌표를 Unreal 엔진의 좌표 (y, -z, x)로 변환해줍니다.  
- `point_img`는 image projection matrix 값과 카메라 좌표로 변환된 행렬간의 곱입니다.  

## 5. Bounging Box Set
Carla Simulator에서는 Bounding Box를 사용할 객체 카테고리를 정해줄 수 있습니다.  
`get_level_bbs` attribute를 사용하여 Bounding Box 카테고리를 정해줄 수 있습니다.  
Bounding Box를 추출하고자 하는 카테고리는 `carla.CityObjectLabel` attribute를 사용하여 정해줍니다.  
카테고리를 추가할 경우 `extend` attribute를 사용하여 추가할 수 있습니다.  
여기서는 신호등, 가로등, 차량 카테고리를 사용하도록 하겠습니다.  
```python
bounding_box_set = world.get_level_bbs(carla.CityObjectLabel.TrafficLight)
bounding_box_set.extend(world.get_level_bbs(carla.CityObjectLabel.Poles))
bounding_box_set.extend(world.get_level_bbs(carla.CityObjectLabel.Vehicles))
```

카메라 이미지에 Bounding Box를 가시화하기 위해 아래 순서로 각 포인트대로 나타내줍니다.
```python
edges = [[0,1], [1,3], [3,2], [2,0], [0,4], [4,5], [5,1], [5,7], [7,6], [6,4], [6,2], [7,3]]
```

## 6. Bounding Box 렌더링
OpenCV 창으로 Bounding Box를 렌더링 된 Camera 데이터를 확인할 수 있습니다.  
```python
for bb in bounding_box_set:
      if bb.location.distance(vehicle.get_transform().location) < 50:
        forward_vec = vehicle.get_transform().get_forward_vector()
        ray = bb.location - vehicle.get_transform().location

        if forward_vec.dot(ray) > 1:
            # Cycle through the vertices
            verts = [v for v in bb.get_world_vertices(carla.Transform())]
            for edge in edges:
                # Join the vertices into edges
                p1 = get_image_point(verts[edge[0]], K, world_2_camera)
                p2 = get_image_point(verts[edge[1]],  K, world_2_camera)
                # Draw the edges into the camera output
                cv2.line(img, (int(p1[0]),int(p1[1])), (int(p2[0]),int(p2[1])), (0,0,255, 255), 1)
```
Bounding Box 카테고리로 인식된 객체와 에고 차량간의 거리가 50m 이내인 경우 적색으로 Bounding Box가 렌더링 됨을 확인할 수 있습니다.  
<img src="../../assets/images/Carla_Simulator/bounding_box_2d.png" width="640" height="480">  
위 그림은 가로등, 차량, 신호등 Bounding Box 렌더링 된 것을 확인할 수 있습니다.  

```python
while True:
    world.tick()
    image = image_queue.get()

    img = np.reshape(np.copy(image.raw_data), (image.height, image.width, 4))

    world_2_camera = np.array(camera.get_transform().get_inverse_matrix())
    
    for bb in bounding_box_set:
      if bb.location.distance(vehicle.get_transform().location) < 50:
        forward_vec = vehicle.get_transform().get_forward_vector()
        ray = bb.location - vehicle.get_transform().location

        if forward_vec.dot(ray) > 1:
            # Cycle through the vertices
            verts = [v for v in bb.get_world_vertices(carla.Transform())]
            for edge in edges:
                # Join the vertices into edges
                p1 = get_image_point(verts[edge[0]], K, world_2_camera)
                p2 = get_image_point(verts[edge[1]],  K, world_2_camera)
                # Draw the edges into the camera output
                cv2.line(img, (int(p1[0]),int(p1[1])), (int(p2[0]),int(p2[1])), (0,0,255, 255), 1)

    # Now draw the image into the OpenCV display window
    cv2.imshow('bounding_box',img)
    # Break the loop if the user presses the Q key
    if cv2.waitKey(1) == ord('q'):
        break

# Close the OpenCV display window when the game loop stops
cv2.destroyAllWindows()
for actor in actor_list:
    actor.destroy()
print('done')
```

다음 포스트는 차량 3D Bounding Box에 대해 포스팅 하도록 하겠습니다.

감사합니다.