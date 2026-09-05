# 游园惊梦 - Web演示版

昆曲文化传承互动游戏 Web演示版本

## 快速启动

### 本地运行

```bash
# 安装依赖
pip install -r requirements.txt

# 启动服务
python main.py
# 访问 http://localhost:8080
```

### Docker部署

```bash
# 构建镜像
docker build -t kunqu-web .

# 运行容器
docker run -d -p 8080:8080 --name kunqu-web kunqu-web
# 访问 http://localhost:8080
```

### 极空间部署

1. 构建镜像后导出为tar文件
2. 在极空间Docker中导入镜像
3. 配置端口映射 (如 8080:8080)
4. 通过极空间IP地址访问

## 功能说明

- 完整复刻小程序所有功能
- 本地SQLite数据库存储进度
- 无需微信登录，游客模式即可体验
- 支持进度保存和读取

## 技术栈

- 后端: FastAPI + SQLite
- 前端: HTML5 + CSS3 + Vanilla JS
- 部署: Docker
