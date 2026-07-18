# FanPhysics 阿里云 ECS 部署

FanPhysics 与识花定位共用阿里云 ECS，但使用独立目录、用户、端口和 Nginx 配置。

## 资源约定

- 域名：`physics.qinyibin.com`
- 应用目录：`/opt/fanphysics`
- NotebookLM 持久数据：`/opt/fanphysics/shared/notebooklm-links.json`
- 环境变量：`/etc/fanphysics.env`
- 本机服务：`127.0.0.1:8010`
- systemd：`fanphysics.service`
- Nginx：`/etc/nginx/conf.d/fanphysics.conf`

## 当前部署约定

日常发布从本机使用现有 SSH 密钥直接执行：

```bash
deploy/aliyun/deploy.sh
```

GitHub 推送仍用于 Render 自动部署，但阿里云不走 GitHub Actions。不要在常规发布时触发 `deploy-aliyun.yml`；`ALIYUN_HOST`、`ALIYUN_USER`、`ALIYUN_SSH_KEY` 三个仓库 Secret 当前为空，不是现行部署通道。只有用户明确要求恢复 Actions 部署时，才重新配置并使用该工作流。

## 首次部署

先在本地 `.env` 中配置 `DEEPSEEK_API_KEY` 和至少 12 个字符的 `NOTEBOOKLM_EDIT_PASSWORD`，再安装受保护的环境变量并发布应用：

```bash
deploy/aliyun/install_env.sh
deploy/aliyun/deploy.sh
```

在阿里云 DNS 添加记录：

```text
主机记录：physics
记录类型：A
记录值：101.37.82.5
```

DNS 生效后启用 HTTPS：

```bash
deploy/aliyun/enable_https.sh
```

部署脚本使用版本目录和符号链接原子切换，并只保留最近三个版本。NotebookLM 覆盖值保存在 `shared` 目录，不会被新版本覆盖。`.env` 不会打包上传；`install_env.sh` 仅提取运行所需的受保护变量，通过 SSH 安装为权限 `600` 的服务器环境文件。

仓库仍保留手动触发的 GitHub Actions 工作流作为历史备用，但当前不使用。

## 验证与排错

```bash
ssh -i ~/.ssh/flower_position_aliyun_ed25519 root@101.37.82.5 \
  'systemctl status fanphysics.service --no-pager'

curl https://physics.qinyibin.com/api/health
```

服务日志：

```bash
journalctl -u fanphysics.service -n 100 --no-pager
```
