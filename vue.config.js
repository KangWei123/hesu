// @ts-check
/**
 * 可以通过 PROJECT 指定要编译的页面，支持多个页面，使用 逗号 分隔，例如 dss-login,dss-member
 */
const webpack = require('webpack');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config');

const PROJECT_DIR = 'project';
// 页面入口声明文件
const ENTRY_DECL_FILE = 'entry.js';
// 默认入口模板
const DEFAULT_TEMPLATE = path.join(__dirname, 'index.html');
// 开发环境的固定入口, 主要方便调试，比如登录页面
const DEV_FIXED_ENTRIES = ['dss-login'];
// 是否为生产环境
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// 是否是全量编译，如果是全量编译，会执行额外的静态资源拷贝任务
let IS_FULL_BUILD = true;
const FORCE_COPY = process.env.FORCE_COPY === 'true';

/**
 * @typedef {{
 * name: string
 * entry: string;
 * template?: string;
 * title?: string;
 * filename?: string
 * }} PageEntry
 */

/**
 * 需要编译的项目
 */
let projects = [];

{
  /* 扫描所有项目 */
  const list = fs.readdirSync(PROJECT_DIR);
  // dss-* 前缀为页面
  // 而且必须定义 entry.js 入口声明
  projects = list.filter(i => {
    return i.startsWith('dss-') && fs.existsSync(path.join(PROJECT_DIR, i, ENTRY_DECL_FILE));
  });
}

{
  /**
   * 手动指定的项目,
   */
  const SPECIFY_PROJECT = process.env.PROJECT;

  if (SPECIFY_PROJECT) {
    const specifyProjects = SPECIFY_PROJECT.split(',');
    // 验证
    for (const project of specifyProjects) {
      if (!projects.includes(project)) {
        throw new Error(`${project} 不存在或者没有声明 entry.js 入口文件`);
      }
    }

    // 非全量编译
    if (projects.length !== specifyProjects.length) {
      IS_FULL_BUILD = false;
    }

    projects = specifyProjects;

    // 添加 开发环境固定入口
    if (!IS_PRODUCTION && DEV_FIXED_ENTRIES) {
      for (const project of DEV_FIXED_ENTRIES) {
        if (!projects.includes(project)) {
          projects.push(project);
        }
      }
    }
  }
}

console.log(IS_FULL_BUILD ? '当前是全量编译模式，可能花的时间会比较久' : IS_PRODUCTION ? '生产环境' : '开发环境');
console.log('待编译页面: ' + projects.join(', '));

const PAGE_CONFIG = getPageConfig();
const ENV = getEnv();

console.log('已配置环境变量：\n' + ENV.variables.map(i => '\t' + i).join('\n') + '\n');

/**
 * Vue CLI 配置
 */
module.exports = {
  pages: PAGE_CONFIG,
  lintOnSave: false,
  publicPath: IS_PRODUCTION ? config.publicPath : '/',
  assetsDir: config.assetsDir,
  productionSourceMap: false,
  // transpileDependencies: [/wkb-common-ui/],
  css: {
    loaderOptions: {
      sass: {
        additionalData: ENV.sass,
      },
      less: {
        additionalData: ENV.less,
        lessOptions: {
          strictMath: true,
          noIeCompat: true,
        },
      },
    },
  },
  /**
   * 开发服务器配置
   */
  devServer: {
    clientLogLevel: 'warning',
    compress: true,
    host: '0.0.0.0',
    port: process.env.PORT || 80,
    overlay: {
      warning: false,
      errors: true,
    },
    stats: 'errors-only',
    disableHostCheck: true,
    // TODO: 指定登录页面
    // contentBase: config.globalConfig.compile.contentBase,
    proxy: config.proxy,
  },

  configureWebpack: {
    //  移植旧的 插件配置
    plugins: [
      ...(IS_PRODUCTION
        ? [
            // 只有全量编译的时候才拷贝静态文件
            (IS_FULL_BUILD || FORCE_COPY) && new CopyWebpackPlugin(config.resourceCopy),
            /* 其他插件生产环境插件 */
          ]
        : [
            /** 开发环境插件 */
          ]),
      /* 通用插件 */
      new webpack.ProvidePlugin(ENV.provider),
    ].filter(Boolean),
    resolve: {
      symlinks: false,
      alias: {
        '@': path.join(__dirname, PROJECT_DIR),
      },
    },
  },
  chainWebpack: webpackConfig => {
    /**
     * 扩展 svg loader
     */
    let fileLoaderOption;
    webpackConfig.module
      .rule('svg')
      .use('file-loader')
      .tap(i => (fileLoaderOption = i));
    // 移除旧 svg
    webpackConfig.module.rules.delete('svg');
    webpackConfig.module

      .rule('svg')
      .oneOf('svg-as-component')
      .test(/icon-(.*)\.svg$/)

      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()

      .end()

      .oneOf('svg-as-picture')
      .test(/(.*)\.svg$/)
      .use('file-loader')
      .loader('file-loader')
      .options(fileLoaderOption);

    /**
     * LESS 全局变量
     */
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(webpackConfig.module.rule('less').oneOf(type)));
  },
};

/**
 * 转换为绝对路径
 * @param {string} filePath
 * @param {string} context
 */
function toAbsPathIfNeed(filePath, context) {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.join(context, filePath);
}

/**
 * 获取页面配置
 */
function getPageConfig() {
  const pages = {};

  projects.forEach(project => {
    const context = path.join(__dirname, PROJECT_DIR, project);
    const entryFile = path.join(context, ENTRY_DECL_FILE);

    // eslint-disable-next-line import/no-dynamic-require
    let entryDeclarations = require(entryFile);
    entryDeclarations = Array.isArray(entryDeclarations) ? entryDeclarations : [entryDeclarations];

    entryDeclarations.forEach((/** @type {PageEntry} */ i) => {
      // 验证
      if (i.entry == null || i.name == null) {
        throw new Error(`${entryFile}: 必须指定 name, entry`);
      }

      if (i.name in pages) {
        throw new Error(`${entryFile}: ${i.name} 已经被 ${pages[i.name].module} 占用`);
      }

      pages[i.name] = {
        entry: toAbsPathIfNeed(i.entry, context),
        template: i.template ? toAbsPathIfNeed(i.template, context) : DEFAULT_TEMPLATE,
        filename: i.filename ? i.filename : `${i.name}.html`,
        title: i.title,
        module: context,
      };
    });
  });

  return pages;
}

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        // 引入wkb-common-ui中的自定义变量
        // 向下兼容
        path.resolve(__dirname, './node_modules/wkb-common-ui/packages/theme-chalk/src/common/variable/index.less'),
      ],
    });
}

/**
 * 初始化环境变量
 */
function getEnv() {
  const constants = config.constants;

  // 扩展内置变量
  for (const key in constants) {
    process.env[`VUE_APP_${key}`] = constants[key];
  }

  // 生成less、sass 变量，以便在样式中可以用到
  const variableNames = ['NODE_ENV', 'BASE_URL'];
  const variables = [];

  for (const key in process.env) {
    if (key.startsWith('VUE_APP_')) {
      variableNames.push(key);
    }
  }

  variableNames.forEach(name => {
    variables.push(`${name}: "${process.env[name]}"`);
  });

  // 导出模块
  const moduleSource = variables.map(i => `export const ${i.replace(':', '=')};`).join('\n');
  const tempDir = path.join(os.tmpdir(), 'dss-web');
  const modulePath = path.join(tempDir, 'env.js');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  fs.writeFileSync(modulePath, moduleSource);

  return {
    less: variables.map(d => `@` + d + ';\n').join(''),
    sass: variables.map(d => `$` + d + ';\n').join(''),
    provider: variableNames.reduce((prev, cur) => {
      prev[cur] = [modulePath, cur];
      return prev;
    }, {}),
    variableNames,
    variables,
  };
}
