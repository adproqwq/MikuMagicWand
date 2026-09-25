# 米库的神奇魔法棒

![logo](./logo.webp)

**脚本于即日起进入维护更新，网页审查工具没有出现影响脚本功能实现或表现的变动，不会进行大规模的功能性变动。新功能Issue将视实用情况处理，欢迎PR！**

当前版本：2.19.2

Powered By Vite + Vue + TypeScript

使用`vite-plugin-monkey`插件编译

## 安装

你可以通过以下方式安装：

### GreasyFork

访问 https://greasyfork.org/zh-CN/scripts/488829 即可安装

### ScriptCat

访问 https://scriptcat.org/zh-CN/script-show-page/2322/ 即可安装

### Github

1. 打开[`Latest Release`](https://github.com/adproqwq/MikuMagicWand/releases/latest)
2. 点击下方`Assets`中的`miku-magic-wand.user.js`，等待跳转后即可。

> [!IMPORTANT]
> 有且仅有以上3种分发渠道由仓库维护者直接管理。使用其他渠道的分发将面临一定的风险，请谨慎使用！

> [!NOTE]
> 请确保你已安装`TemperMonkey`或`ScriptCat`或其他类似的脚本管理器，但本脚本仅对`TemperMonkey`和`ScriptCat`进行长期支持，使用其他脚本管理器出现的任何Bug或失效，开发者保留无视的权力。

## 兼容性

本脚本目的是增强原版网页审查工具，很多设计并没有考虑其他的增强项目。

这里列出一些已知的兼容性问题。

1. 使用 [cjy0812/inspect-plus](https://github.com/cjy0812/inspect-plus/) 时，主题模式会与脚本存在轻微的兼容性问题。保持主题模式为“自动”可解决该问题。

## 构建

本项目使用`pnpm`作为包管理器

1. Clone仓库

```shell
git clone https://github.com/adproqwq/MikuMagicWand.git
```

2. 安装依赖

```shell
pnpm install
```

3. 构建

```shell
pnpm build
```

构建产物将会出现在`dist`文件夹中

## 贡献

本项目IDE要求使用`VSCode`或`WebStorm`，包管理器要求使用`pnpm`，使用`TypeScript`编写

`VSCode`已配置`Oxlint`、`Oxfmt`和`MCP服务器`，因此更推荐使用`VSCode`进行开发

你需要fork本仓库，完成修改后，向本仓库发起`Pull Request`，等待`Review`后即可合并

如果是为了解决某个`Issue`而提出的`Pull Request`，需要在`Pull Request`描述中附上对应`Issue`的编号

本仓库允许 AI 辅助代码编写，但请确保你提交的代码经过你或人类协作者的人工审计。

> [!IMPORTANT]
> 仓库维护者有有理由地直接关闭`Pull Request`的权力

## 用户脚本

本脚本已开放部分函数，用户可依靠该脚本二次增强。

注意：用户脚本仍然需要通过脚本管理器加载！

所有API可在网页控制台内使用。

见[API文档](./src/api/api.md)

## 捐赠

如果你想要给我捐赠的话，点击项目旁的`Sponsor`，或者到我的[爱发电主页](https://afdian.com/a/Adpro)给我捐赠即可

## 致谢

感谢 [@AIsouler](https://github.com/AIsouler) 对本项目提出的宝贵建议和问题反馈

感谢以下贡献者：

![img](https://contrib.rocks/image?repo=adproqwq/MakeGKDInspectBetter&max=200)

## 许可证

本仓库已签署MIT开源许可证，请遵循相关许可证条款规定。
