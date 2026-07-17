# FanPhysics 阿里云 ECS 部署

FanPhysics 与识花定位共用阿里云 ECS，但使用独立目录、用户、端口和 Nginx 配置。

## 资源约定

- 域名：`physics.qinyibin.com`
- 应用目录：`/opt/fanphysics`
- 环境变量：`/etc/fanphysics.env`
- 本机服务：`127.0.0.1:8010`
- systemd：`fanphysics.service`
- Nginx：`/etc/nginx/conf.d/fanphysics.conf`

## 首次部署

先安装受保护的 DeepSeek 环境变量，再发布应用：

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

部署脚本使用版本目录和符号链接原子切换，并只保留最近三个版本。`.env` 不会打包上传；`install_env.sh` 仅提取 DeepSeek 运行所需变量，通过 SSH 安装为权限 `600` 的服务器环境文件。

仓库包含手动触发的 GitHub Actions 工作流。配置 `ALIYUN_HOST`、`ALIYUN_USER`、`ALIYUN_SSH_KEY` 三个仓库 Secret 后，可以从 Actions 页面执行部署；确认流程稳定后再按需增加 `main` 分支自动触发。

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
