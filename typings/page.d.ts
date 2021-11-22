/**
 * Vue cli Page
 */
interface PageEntryObject {
  // name: 'dmp';
  // 在 dist/dmp.html 的输出
  name: string;
  // page 的入口
  // 路径可以是相对的
  // entry: 'src/index/main.js';
  entry: string;
  // 模板来源
  // 路径可以是相对的
  // 默认是 /index.html
  // template: 'public/index.html';
  template?: string;
  // 入口 html 名称，默认根据 name 推断,
  // 如果需要将 html 放在某些子目录下，可能就需要用到这个字段
  filename?: string;
  // 当使用 title 选项时，
  // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  // title: 'Index Page';
  title?: string;
}

type PageEntry = PageEntryObject | PageEntryObject[];
