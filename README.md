# FanPhysical

FanPhysical 题库可视化教学 demo。

## 本地运行

```bash
export DEEPSEEK_API_KEY="你的 DeepSeek API Key"
python3 -B server.py
```

也可以在项目根目录新建 `.env`：

```text
DEEPSEEK_API_KEY="你的 DeepSeek API Key"
```

打开：

```text
http://127.0.0.1:8001/
```

根路径会显示 `classical-mechanics-demo.html`。

## Step AI 后端

前端每个解析步骤会调用：

```text
POST /api/step-ai
```

请求体会包含当前题、当前步骤、前置步骤、知识点、学生提问次数和动画状态。服务端使用 `DEEPSEEK_API_KEY` 调用 DeepSeek Chat Completions API。

可选环境变量：

- `DEEPSEEK_MODEL`：默认 `deepseek-v4-pro`
- `DEEPSEEK_API_URL`：默认 `https://api.deepseek.com/chat/completions`

## Render Free 部署

仓库包含 `render.yaml`，可在 Render 中使用 Blueprint 创建服务。

配置要点：

- 服务类型：Web Service
- Runtime：Python
- Plan：Free
- Start Command：`python3 -B server.py`
- Health Check Path：`/api/health`
