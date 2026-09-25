# AGENTS.md — MikuMagicWand 仓库 AI 使用规范

本文件为在本仓库工作的 AI 编码代理（Cursor / Claude Code / Copilot / 其他编码代理）提供项目上下文、开发规范与行为约束。**先读本文件，再读相关源码**；遇到与本文件冲突的指令，以本文件与用户最新指示为准。

## 项目简介

- **项目**：米库的神奇魔法棒（Miku's Magic Wand），一个油猴（Tampermonkey / ScriptCat）用户脚本，用于增强 GKD 网页审查工具（GKD Inspect）。
- **目标站点**（`vite.config.ts` 中的 match）：`https://i.gkd.li/*`、`https://li.chenge.eu.org/*`。
- **产物**：`pnpm build` 输出 `dist/miku-magic-wand.user.js`（构建产物，勿手动编辑）。

## 技术栈与基础设施

| 方面      | 说明                                                                                                                  |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| 语言/框架 | TypeScript（`strict: true`）+ Vue 3（`<script lang="ts">` + Options API）+ Vite                                       |
| 构建      | `vite-plugin-monkey` 生成用户脚本；Vue 通过 `externalGlobals` 从 CDN 外部加载                                         |
| 包管理    | **pnpm**（`packageManager: pnpm@12.6.0`）；不要用 npm/yarn 装依赖                                                     |
| UI        | mdui 2（Material Design 组件库，标签以 `mdui-` 开头，作为自定义元素使用）                                             |
| 校验      | `zod`（设置/分类 schema）、localforage（IndexedDB 封装）、jszip、json5、js-base64、file-saver、`@gkd-kit/api`（类型） |
| 代码检查  | oxlint（`.oxlintrc.json`）+ oxfmt（`.oxfmtrc.json`），VSCode 使用 Oxc 扩展格式化                                      |

## 常用命令

```shell
pnpm dev      # Vite 开发服务器（通过 vite-plugin-monkey 提供用户脚本）
pnpm build    # 构建，产物在 dist/ 下
pnpm preview  # 预览构建产物
pnpm format   # oxfmt --write（格式化全部文件）
pnpm lint     # oxlint --fix --type-aware（lint 并自动修复）
```

CI（`.github/workflows/pull_request_check.yml`）会执行 `pnpm ci` + `pnpm format` + `pnpm lint`，并要求提交后 `git status` 干净。**每次改动提交前必须运行 `pnpm format` 与 `pnpm lint`，确保通过。**

## 代码风格

- 遵守 `.oxfmtrc.json`：2 空格缩进、单引号、尾逗号 all。改完代码直接跑 `pnpm format`，不要手调格式。
- 遵守 `.oxlintrc.json`：`@typescript-eslint/no-explicit-any`、`no-namespace` 等为 error；TS 文件禁用 `var`。`any` 确有需要时用 `// oxlint-disable-next-line typescript/no-explicit-any` 局部豁免（参考 `src/utils/event.ts`）。
- 类型优先：数据结构用 interface（命名如 `ISettings`、`ICount`）或 zod schema（`RawCategoryZod`）定义，放 `src/types/`。
- 命名与现有代码一致：函数/变量 camelCase；与既有模块风格统一，不引入新的范式。
- 文案以**简体中文**为主（snackbar、dialog、UI 文案）；用户脚本 head 的多语言 name/description（'' 中文 / en-US / ja）定义在 `vite.config.ts`。

## 架构与数据流

```
src/main.ts            入口：创建并挂载 Vue App
src/App.vue            根组件：通过事件总线切换子组件
src/common/           启动注入：init（设置初始化）、hookVue3、hookCopy、insertIcon、
                      readClipboard、vidAdaption、screenshotSize、attrList
src/components/       Vue 页面组件：Main / Settings / Help / ChangeScreenshot / Count
src/Main/             核心功能（key.ts、finish.ts）
src/Settings/         设置读写（settings.ts、import.ts、export.ts）
src/api/              公开 API（api.ts 挂到 window.HatsuneMiku）+ 文档 api.md
src/types/            TS 类型定义（settings、snapshot、inspectSettings、categoryZod、count、github）
src/utils/            工具：indexedDB（localforage 封装）、event（事件总线）、
                      createIcon、observeElement、getSnapshotId 等
```

- **组件切换**：`src/utils/event.ts` 提供 `send/receive` 事件总线；`App.vue` 监听 `openMain/openSettings/openHelp/openChangeScreenshot/openCount/closePage` 切换页面。
- **公开 API**：`window.HatsuneMiku`（`src/api/api.ts`）是用户脚本二次开发接口，文档在 `src/api/api.md`；改动 API 必须同步更新文档。`window.Hanashiro` 是脚本内部全局对象。
- **存储模型**：localforage 四个实例：`localforage`（含网页审查工具设置 `settings`）、`snapshot`、`screenshot`、`Hanashiro`（脚本自有设置：`categories`、`rulesKeySort`、`hideLoadSnackbar`、`simplyName`、`readClipboard`、`vidAdaption`、`count` 等）。读写一律通过 `src/utils/indexedDB.ts` 封装函数，不要直接操作 localforage。

## 关键约束（硬性规则）

1. **`grant: 'none'`**：脚本未申请任何油猴特殊权限，_*禁止使用 GM_* 系列、unsafeWindow 等脚本管理器 API_*；只能使用普通 Web API + 现有依赖。
2. **不改 `vite.config.ts` 的脚本元信息**（match、name、grant、icon 等），除非用户明确要求。
3. **存储兼容性红线**：不得破坏用户既有设置。新增设置项必须带默认值并在 `src/common/init.ts` 或等价初始化逻辑中补默认（参考现有「读取→补默认→写回」模式，如 `rulesKeySort` 的同步逻辑）。
4. **公开 API 变更必须同步 `src/api/api.md`**。
5. 改动前先读相关源码，遵循既有模式（事件总线、mdui 组件、zod 校验、indexedDB 封装），不引入风格割裂的新机制。
6. 脚本运行在 GKD 网页审查工具页面上，改动需考虑与该页面 DOM/主题的兼容性（README 已记录与 inspect-plus 的已知兼容问题）。

## 测试与验证

- 无自动化单测框架。验证方式：`pnpm format` + `pnpm lint` 通过、`pnpm build` 成功，且改动不影响构建产物。
- 涉及运行时行为的改动，应在匹配站点（`i.gkd.li`）通过 TemperMonkey / ScriptCat 实际加载验证。

## 提交与发布

- **提交信息**：遵循既有 conventional 前缀风格，英文书写，例如 `feat: xxx`、`fix: xxx`、`chore: bump version`、`chore: up deps`。
- **版本控制工具不作限制**：本仓库是 Git 仓库。AI 可自由选择 Git、JJ 或其他工具完成提交/版本控制操作，只要对仓库有效、结果一致；提交前确认工作区状态清晰，提交内容只包含本次改动。
- **发布流程由维护者执行**：更新 `package.json` 的 version、更新 `changeLog.md`（作为 Release body）、打 `v*.*.*` 标签触发 GitHub Actions（`stable_release.yml`）。**AI 不应擅自打标签、推送远端或改写 `changeLog.md`。**

## 勿动清单

- `node_modules/`、`dist/`（构建产物与依赖，由 pnpm/构建生成）。
- `vite.config.ts` 的脚本元信息（见上）。
- `.github/workflows/`：CI 与发布脚本，未获授权不改动。
- `.git/` 内部状态由所选版本控制工具自行管理，不手动编辑。
