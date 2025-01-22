#!/usr/bin/env bash

image_name="seal/qs-web-saas"
container_names="seal-qs-web-saas"

# 清理容器和镜像
docker stop $container_names || true
docker rm $container_names || true
docker rmi $image_name || true


# 1. 构建镜像
docker-compose build
# 2. 运行服务
docker-compose up -d
# 清理none镜像
docker images|grep none|awk '{print $3 }'|xargs docker rmi
docker images
docker ps
