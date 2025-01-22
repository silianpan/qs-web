# 注意这里是在node容器中的编译
FROM node as build-stage
# 指定容器的一个目录，容器启动时的命令会在该目录下执行，即为工作目录
WORKDIR /app

# # 拷贝本地packege到容器当前目录即/app目录
# # COPY package*.json ./
# # 设置环境
# RUN npm config set registry https://registry.npmmirror.com
# # 已经具备了yarn工具
# # RUN npm install -g yarn
# RUN yarn config set registry https://registry.npmmirror.com
# # 拷贝源码到/app目录
# COPY ./ /app
# # 构建
# # RUN yarn install
# # RUN yarn run build
# RUN npm install
# RUN npm run build

# 先拷贝package.json，安装插件包
COPY ./package*.json ./

# npm
# RUN npm install --registry https://registry.npmmirror.com

# cnpm
# RUN npm install -g cnpm --registry=https://registry.npmmirror.com
# RUN cnpm install -g npm --registry=https://registry.npmmirror.com
# RUN cnpm install

# yarn
# RUN npm update -g yarn --registry=https://registry.npmmirror.com
# RUN yarn config set ignore-engines true
# RUN yarn --registry https://registry.npmmirror.com

# pnpm
RUN npm install -g pnpm@7.32.0 --registry=https://registry.npmmirror.com
RUN pnpm install --registry https://registry.npmmirror.com

# 拷贝代码目录
COPY . ./
RUN ls -al ./
# RUN npm run build
# RUN yarn build
RUN pnpm run build

# nginx
FROM nginx:latest as production-stage
# COPY命令是将nginxconfig下面的目录和文件拷贝到/etc/nginx目录下
COPY ./cicd/web/nginxconfig /etc/nginx/
# 删除、拷贝
# 可以不要删除，COPY命令会覆盖
# RUN rm -rf /opt/client/dist
RUN mkdir -p /opt/client/dist
COPY --from=build-stage /app/dist /opt/client/dist/
