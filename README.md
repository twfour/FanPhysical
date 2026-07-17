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

## NotebookLM 独立课例地址

服务器会为题库中的每个课例生成服务端独立讲义页面，便于直接作为 NotebookLM 的网站来源。题目正文和原始 LaTeX 公式都直接包含在 HTML 中，浏览器再通过 MathJax 增强公式排版；即使 MathJax 未加载，NotebookLM 仍可抓取完整公式文本。总目录左侧提供一级章节目录，单课页面左侧提供当前章节的题目目录。

课例总目录：

```text
http://127.0.0.1:8001/notebooklm/
```

单课地址格式：

```text
http://127.0.0.1:8001/notebooklm/<problem-id>
```

章节主页地址格式：

```text
http://127.0.0.1:8001/notebooklm/chapter/<章节名>
```

章节主页汇总本章题目、核心定理与公式，并显示已关联的 NotebookLM 笔记；未关联时会给出可直接添加到 NotebookLM 的本章来源地址。每个章节页都可以在线添加或修改笔记网址，覆盖值保存在当前浏览器，不受网站重新部署影响。

例如：

```text
http://127.0.0.1:8001/notebooklm/lesson9_course_01_satellite_comparison
```

部署后把域名替换为 `https://physics.qinyibin.com`。每个页面直接包含题干、选项、知识点、参考答案、整体解析、分步解析和变式练习，适合 NotebookLM 抓取。

## Step AI 后端

前端每个解析步骤会调用：

```text
POST /api/step-ai
```

请求体会包含当前题、当前步骤、前置步骤、知识点、学生提问次数和动画状态。服务端使用 `DEEPSEEK_API_KEY` 调用 DeepSeek Chat Completions API。

可选环境变量：

- `DEEPSEEK_MODEL`：默认 `deepseek-v4-flash`
- `DEEPSEEK_API_URL`：默认 `https://api.deepseek.com/chat/completions`
- `DEEPSEEK_THINKING`：默认 `disabled`，步骤问答不启用耗时较长的思考模式
- `DEEPSEEK_TIMEOUT_SECONDS`：默认 `90`
- `DEEPSEEK_MAX_RETRIES`：默认 `2`，仅对网络错误和 `429/5xx` 临时错误重试

## 阿里云 ECS 部署

生产环境使用 `physics.qinyibin.com`，与识花定位共用 ECS，但采用独立服务、端口和发布目录。首次部署与 HTTPS 配置见：

```text
deploy/aliyun/README.md
```

常规发布默认从本机通过 SSH 直接部署：

```bash
deploy/aliyun/deploy.sh
```

不触发 GitHub Actions 中的阿里云部署工作流；仓库的 `ALIYUN_HOST`、`ALIYUN_USER`、`ALIYUN_SSH_KEY` 三个 Secret 当前不作为部署依赖。

## 题目录入架构

新增题目不再推荐直接改 HTML。推荐流程：

```text
图片 / PDF
  → 本地 macOS Vision OCR
  → 生成 work/ocr/*.txt
  → DeepSeek 拆题并整理为标准 JSON
  → 多个题目 JSON
  → 人工校对
  → 网页自动读取 /data/problems/index.json
```

第一版不依赖 Mathpix，所以不需要 `MATHPIX_APP_ID` 或 `MATHPIX_APP_KEY`。你的输入就是图片；脚本默认调用 macOS 自带 Vision OCR 生成文本，再让 DeepSeek 拆题生成 JSON。图片选项题、看图选择题等无法由 OCR 还原完整题意的内容会自动跳过，后续人工录入。

题目文件放在：

```text
data/problems/
```

索引文件：

```text
data/problems/index.json
```

每道题一个 JSON，例如：

```text
data/problems/projectile_basic.json
```

校验 JSON：

```bash
python3 scripts/validate_problems.py
```

一键处理图片：Vision OCR → DeepSeek 自动拆题并生成 JSON → 自动更新 `index.json`。

运行：

```bash
python3 scripts/process_problem_images.py work/images/projectile_001.jpg \
  --chapter 平抛运动
```

脚本会把 OCR 文本保存到：

```text
work/ocr/projectile_001.txt
```

脚本会根据 `--chapter` 的中文名自动生成英文标题前缀和默认文件名前缀。例如 `--chapter 平抛运动` 会让题目标题带上 `Projectile Motion - ...`，默认 id 前缀为 `projectile_motion_`。

如果要强制使用自定义 id 前缀：

```bash
python3 scripts/process_problem_images.py work/images/projectile_001.jpg \
  --chapter 平抛运动 \
  --id-prefix projectile_
```

如果想改用 PaddleOCR：

```bash
python3 scripts/process_problem_images.py work/images/projectile_001.jpg \
  --chapter 平抛运动 \
  --ocr-engine paddle \
  --ocr-lang ch
```

如果图片里有较多手写笔迹、图表或公式，普通 OCR 容易漏题，可以改用视觉模型直接读图：

```bash
python3 scripts/process_problem_images.py work/images/projectile_001.jpg \
  --chapter 平抛运动 \
  --ocr-engine vision-llm \
  --force
```

如果一张整页照片包含多道题，推荐纵向分段读取，避免模型只输出上半页、漏掉底部题目：

```bash
python3 scripts/process_problem_images.py work/images/projectile_001.jpg \
  --chapter 平抛运动 \
  --ocr-engine vision-llm \
  --split-vertical 3 \
  --force
```

脚本会把图片临时切到 `work/image_segments/`，每段之间默认保留 12% 重叠，最后按题号合并去重。

`vision-llm` 使用 OpenAI-compatible 的图片消息格式，需要在 `.env` 中配置一个支持图片输入的接口：

```text
VISION_API_KEY="你的视觉模型 API Key"
VISION_API_URL="https://api.openai.com/v1/chat/completions"
VISION_MODEL="gpt-4o"
```

如果使用 OpenAI，也可以只配置 `OPENAI_API_KEY`。当前 DeepSeek 文本接口用于整理 OCR 文本，不会直接看到图片；`vision-llm` 适合 `IMG_7022` 这类手写覆盖题干、表格和公式的页面。

如果你想跳过 OCR，改用已有 OCR 文本，也可以这样：

```bash
python3 scripts/process_problem_images.py work/images/projectile_001.jpg \
  --ocr-engine sidecar \
  --ocr-file path/to/ocr.txt \
  --chapter 平抛运动 \
  --id-prefix projectile_
```

一个 OCR 文本里有多道题时，DeepSeek 会自动拆成多个题目 JSON，并自动生成标题、模型名称、题干、解析步骤和知识点。`--chapter` 是默认章节；`--id-prefix` 可选。

如果多个图片和同名 OCR 文本都属于同一章节，也可以批量处理图片目录：

```bash
python3 scripts/process_problem_images.py work/images --chapter 平抛运动 --id-prefix projectile_
```

这个脚本会记录图片和 OCR 文本的 SHA-256 到 `work/problem_pipeline_state.json`。下次再跑时，图片和 OCR 文本都没变，并且对应 JSON 已存在，就会自动跳过；新增或修改过的图片/文本才会重新生成。

先预览这张图片会不会被处理，不调用 API：

```bash
python3 scripts/process_problem_images.py work/images/projectile_001.jpg \
  --chapter 平抛运动 \
  --id-prefix projectile_ \
  --dry-run
```

强制全部重新处理：

```bash
python3 scripts/process_problem_images.py work/images --chapter 平抛运动 --id-prefix projectile_ --force
```

以后如果要接 Mathpix，可以用下面的可选脚本先把公式/表格图片识别成文本和 LaTeX：

```bash
python3 scripts/mathpix_image_to_text.py path/to/image.jpg --out-dir work/ocr
```

批量识别一个图片文件夹：

```bash
python3 scripts/mathpix_image_to_text.py path/to/images --out-dir work/ocr --raw-dir work/ocr_raw
```

需要在 `.env` 里配置：

```text
MATHPIX_APP_ID="你的 Mathpix app id"
MATHPIX_APP_KEY="你的 Mathpix app key"
```

把 OCR 文本先包成待校对草稿：

```bash
python3 scripts/make_problem_from_ocr.py ocr.txt --id motion_001 --chapter 运动 --title 匀速直线运动
```

用 DeepSeek 把 OCR 文本整理成标准 JSON：

```bash
python3 scripts/deepseek_ocr_to_problem.py ocr.txt --id motion_001 --chapter 运动 --title 匀速直线运动
```

前端启动时会读取 `data/problems/index.json`，再加载每道题 JSON。JSON 中的 `steps` 会成为 Step AI 的上下文来源；以后 Codex 主要负责模板、脚本和校验，不再参与每道题手工改页面。

## JSON 动画

旧题目 JSON 不需要全部重新生成。网页会兼容没有 `animation` 字段的题目：能根据标题、模型、知识点推断出 `projectile`、`spring_balance`、`force_diagram` 时，会使用通用动画；无法判断时就不硬画。

新生成的 JSON 推荐包含 `animation` 字段。前端会根据 `animation.type` 自动绘图，并根据 `params` 自动生成变量滑块、播放按钮、重置按钮和时间轴。

示例：

```json
{
  "animation": {
    "level": "animated",
    "type": "projectile",
    "playable": true,
    "interactive": true,
    "params": {
      "vx": { "label": "水平速度", "value": 8, "min": 1, "max": 30, "step": 0.5, "unit": "m/s" },
      "height": { "label": "高度", "value": 20, "min": 1, "max": 80, "step": 1, "unit": "m" },
      "g": { "label": "重力加速度", "value": 9.8, "min": 1, "max": 15, "step": 0.1, "unit": "m/s^2" }
    },
    "timeline": { "duration": 3, "loop": false }
  }
}
```

当前通用动画类型：

- `projectile`：平抛/抛体，支持播放、时间轴和参数滑块。
- `spring_balance`：弹簧平衡/胡克定律，支持播放、时间轴和参数滑块。
- `force_diagram`：受力图，支持参数滑块，不依赖原图。

## Render Free 部署

仓库包含 `render.yaml`，可在 Render 中使用 Blueprint 创建服务。

配置要点：

- 服务类型：Web Service
- Runtime：Python
- Plan：Free
- Start Command：`python3 -B server.py`
- Health Check Path：`/api/health`
