# 最后一夜

一个中文丧尸危机主题的剧情测评网站。12 次选择发生在危机爆发的第一夜，最后生成一份个人生存档案。

## 本地运行

需要 Node.js 18 或更新版本，无须安装依赖。

```sh
npm start
```

打开 http://127.0.0.1:4174 。结束预览时在终端按 Ctrl+C。

```sh
npm test
```

## 测评内容

- 4 个章节、12 道情境题，每题 4 个选项；支持返回修改和刷新后继续。
- 6 种幸存者类型，以及第 2–59 天的结局或第 60 天以上的开放结局。
- 结果包含结局、个人选择解读、第一夜的 4 条记录，以及更换一次选择后的真实重算结果。
- 可以下载一张 PNG 生存档案，或者重新测评。

时长来自原创故事规则，不代表现实生存能力，也不构成心理诊断。结果是确定性的，相同答案生成相同结果。未展示科学测量式的能力分数。

## 文件说明

- `index.html`：页面入口与首页。
- `data.js`：剧情、选项、人物类型、结局与计算规则。修改测评内容主要编辑这里。
- `app.js`：答题、进度保存、结果渲染、图片导出。
- `tokens.css`、`base.css`、`style.css`：视觉样式及响应式布局。
- `assets/city.webp`：为本站生成的原创氛围图；生成说明见 `IMAGE-PROMPT.md`。
- `tests/survival.test.cjs`：结果范围、确定性和反事实建议验证。
- `server.mjs`：仅供本地预览的静态服务器。

所有图片、脚本和样式均随源码提供，无外部字体请求、登录或统计服务。答案只保存在当前浏览器的 localStorage 中，不发送到服务器。

## 代码与部署

- 私有源码仓库：https://github.com/FunnMon/last-night
- 公开站点地址：https://last-night-funnmon.yolonwood5.chatgpt.site
- 网站访问权限为 Public，访客无须登录。GitHub 仓库保持 Private。

网站为纯静态页面，使用 Sites 托管。当前 GitHub 套餐不支持从私有仓库发布 GitHub Pages。

```sh
npm run build
```

`dist/` 只包含网页及其静态资源，README、测试和本地服务器不会作为公开资源部署。Sites 配置在 `.openai/hosting.json` 中；GitHub 提交用于保存源码，线上更新通过 Sites 发布流程完成。相对资源路径与 hash 路由也支持其他静态主机。
