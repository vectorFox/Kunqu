# Dockerfile for 游园惊梦 Web版

FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建数据库（如果不存在）
RUN python -c "from database import init_db; init_db()"

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["python", "main.py"]
