# 惟客宝后台管理系统

这是一个 MONORepo，目录结构如下:

```shell
project/           # 源代码目录
  dss-common/      # 业务无关的跨页面共享库
  business-common/ # 全局业务，或者说基座业务
  dss-member       # 大会员管理页面
  dss-console      # 企业管理页面
  dss-*            # 其他页面。dss-* 前缀为页面
  mod-member       # 大会员业务模块
  mod-material     # 素材中心业务模块
  mod-*            # 其他业务模块。mod-* 前缀的为业务模块
  register         # 业务模块注册器。外部不能直接引用 mod-* 业务模块，只能通过 register 注册点统一访问
```

新的架构细分了页面和业务模块。更多资料参考 doc 目录

<br>
<br>

## 构建

构建主要基于 Vue-CLI，从而简化繁琐的构建配置和升级。另外使用标准的构建工具，让我们的代码更容易被移植。

- 全量构建: 即构建所有的页面
  - `yarn start` 开发
  - `yarn build` 构建
- 指定入口页面： 即指定具体页面进行构建，通常用于开发环境，一般情况下我们只专注于一个页面的开发，全量开发会比较浪费资源，构建也会非常缓慢。指定页面构建只需要定义 `PROJECT` 环境变量:
  - `yarn cross-env PROJECT=dss-member yarn start`
  - 指定多个页面入口: `yarn cross-env PROJECT=dss-member,dss-console yarn start`
  - 你可以将固化的命令添加到 `package.json` 中，具体参考当前项目的 package.json 文件

<br>
<br>

### 项目配置

见 ./config.js 文件，目前支持以下参数:

- publicPath: 静态资源部署位置，通常是一个 CDN 路径. 只在生产环境构建起作用
- assetsDir：静态资源在 dist 的子目录. 只在生产环境构建起作用
- proxy: 开发环境代理. 只在开发环境有用
- resourceCopy: 静态资源拷贝，参数 [copy-webpack-plugin](https://www.webpackjs.com/plugins/copy-webpack-plugin/). **默认在全量构建的时候才会执行拷贝，你可以设置 FORCE_COPY=true 强制拷贝**

**vue.config.js 可以进行更高级的配置，不过通常不建议这么做**

<br>
<br>

### 定义页面入口文件

必须符合以下两个条件才能被识别为页面模块:

- 页面模块必须以 dss-\* 为前缀
- 页面模块必须包含 entry.js 文件

配置 entry.js 文件，一个简单的示例：

```js
// @ts-check
/**
 * 页面入口
 * @type {PageEntry}
 */
module.exports = {
  name: 'dmp',
  entry: 'src/index.js',
  template: 'src/index.html',
};
```

- name(required): 定义入口名称，如上，我们默认会创建一个 dist/dmp.html 页面
- entry(required): 定义入口文件
- template(optional): 可选，定义入口模板，默认会使用 /index.html 作为模板

<br>
<br>

如果一个页面模块存在多个入口，可以返回一个数组:

```js
// @ts-check
/**
 * 页面入口
 * @type {PageEntry[]}
 */
module.exports = [
  // 惟客宝 微信授权成功
  {
    name: 'wechat_authorization_success',
    entry: 'src/html/authorization-success/index.js',
    template: 'src/html/authorization-success/index.html',
  },
  // 惟客宝 微信授权失败
  {
    name: 'wechat_authorization_fail',
    entry: 'src/html/authorization-fail/index.js',
    template: 'src/html/authorization-fail/index.html',
  },
  // 惟客宝
  {
    name: 'wkb',
    entry: 'src/html/wkb/index.js',
    template: 'src/html/wkb/index.html',
  },
];
```

<br>
<br>

某些情况下，页面可能放置在子目录中，这时候就需要指定 `filename` 字段了：

```js
module.exports = [
  {
    name: 'ai',
    entry: 'src/views/ai/index.js',
    template: 'src/views/ai/index.html',
    // 将创建为 dist/store/ai.html
    filename: 'store/ai.html',
  },
];
```

<br>
<br>

## 快速部署

通过调用 `yarn deploy` 进行快速部署，注意，**目前只应该用于测试环境, 建议在 Unix 环境执行该命令**。

> Windows 环境下可能出现文件权限问题，你可以在 WSL 中执行该命令

```shell
$ cp deploy.env.tpl deploy.env # 配置部署服务器
$ yarn build # 全量编译，如果你只更改了一个页面，可以指定页面编译: yarn build:dss-member
$ yarn deploy
```

yarn deploy 会将 dist 目录下的静态资源部署到指定服务器。确保你有服务器访问权限

<br>
<br>

`yarn deploy` 命令依赖于以下环境变量:

```shell
# 部署用户, 默认为 root
USER=root
# 部署服务器
SERVER=172.26.59.178
# 部署目录, 默认为 /data/node
TARGET=/data/node/ump
```

你可以通过 cross-env 等来设置这些变量. 你也可以拷贝 deploy.env.tpl 为 deploy.env, 在 deploy.env 来配置这些变量, 避免繁琐的命令行。

<br>
<br>

# 环境变量

在源码码中硬编码配置参数不是一个好的实践。

## 定义环境变量

我们支持使用 dotenv 来定义环境变量，详细文件件 Vue cli 的 [《模式和环境》](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

### 注意事项

- 只有 `VUE_APP_` 前缀的变量才能在源代码中被访问
- 不要改动 .env、.env.development、.env.production, 如果是临时改动应该创建 .env.local、.env.development.local、.env.production.local 来临时覆盖。不要影响他人

<br>

### 内置变量

| 变量名                 | 描述                                           | 值示例                                                   |
| ---------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| NODE_ENV               | 当前环境                                       | "development" 或 "production"                            |
| VUE_APP_DOMAIN         | 主域名, 在 config.js 中配置                    | "wakedata.com"                                           |
| VUE_APP_CDN_DOMAIN     | CDN 域名， 在 config.js 中配置                 | "cdn-ump.wakedata.com"                                   |
| VUE_APP_CDN_URL        | CDN URL， 在 config.js 中配置                  | "https://cdn-ump.wakedata.com"                           |
| VUE_APP_BACKEND_DOMAIN | 后端 API 域名, 在 config.js 中配置             | "ump.wakedata.com"                                       |
| VUE_APP_BACKEND_URL    | 后端 API URL, 在 config.js 中配置              | "https://ump.wakedata.com"                               |
| VUE_APP_ASSETS_DIR     | 静态资源路径, 在 config.js 中配置              | "resources/dss-web-portal/"                              |
| VUE_APP_ASSETS_URL     | 静态资源路径, 根据 CDN_DOMAIN、ASSETS_DIR 组合 | "https://cdn-ump.wakedata.com/resources/dss-web-portal/" |
| VUE_APP_VERSION        | 当前版本号, 在 package.json 中配置             | "1.0.0"                                                  |
| VUE_APP_PROTOCOL       | 协议                                           | "https"                                                  |

<br>

## 使用环境变量

### Javascript

使用 `process.env.*` 访问

```js
if (process.env.NODE_ENV === 'development') {
  console.log('开发环境');
}

const url = `${process.env.VUE_APP_PROTOCOL}://${process.env.VUE_APP_BACKEND_DOMAIN}/wp`;
```

<br>

### Less

```less
.hello {
  background: url('@{VUE_APP_ASSETS_URL}foo.img');
}
```

<br>

### Sass

```scss
.hello {
  background: url('#{$VUE_APP_ASSETS_URL}foo.img');
}
```

### HTML 模板中

HTML 也支持引入变量例如:

```html
<script>
  const CDN_URL = '<%= VUE_APP_CDN_URL %>';
</script>
```

> 注意：html-loader 不再支持，建议改用 ejs-loader
