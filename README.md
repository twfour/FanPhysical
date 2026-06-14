# FanPhysical

FanPhysical 题库可视化教学 demo。

## 本地运行

```bash
python3 -B server.py
```

打开：

```text
http://127.0.0.1:8001/
```

根路径会显示 `classical-mechanics-demo.html`。

## Render Free 部署

仓库包含 `render.yaml`，可在 Render 中使用 Blueprint 创建服务。

配置要点：

- 服务类型：Web Service
- Runtime：Python
- Plan：Free
- Start Command：`python3 -B server.py`
- Health Check Path：`/api/health`

