const { resolve, extname } = require('path');
const { readdirSync, statSync, writeFile } = require('fs');
const config = require('../config');

const filterRuler = {
  size: 1024 * 20,
  fileType: ['.js', '.css'],
};
const root = config.constants.CDN_URL;
const replaceRoot = resolve('dist');
const filterFiles = [];

function recursionFile(folder) {
  // folder目录下的文件
  const files = readdirSync(folder);
  (files || []).forEach(file => {
    const path = resolve(folder, file);
    const isDir = statSync(path).isDirectory();
    if (isDir) {
      recursionFile(path);
    } else {
      // 获取文件的后缀
      const extName = extname(path);
      if (filterRuler.fileType.find(item => item === extName)) {
        const stats = statSync(path);
        if (stats && stats.size > filterRuler.size) {
          // 替换文件前缀的名字
          const regPath = path.replace(replaceRoot, root);
          filterFiles.push(regPath);
          filterFiles.push('\n');

          // 腾讯云一次性只能输入20个预热资源  这个做个换行分组
          if (filterFiles.filter(item => item !== '\n').length % 20 === 0) {
            filterFiles.push('\n');
          }
        }
      }
    }
  });
}

function write(dest, code) {
  writeFile(dest, code, err => {
    if (!err) {
      console.log('预约资源名单已生成，请在preload-list文件夹中查看');
    } else {
      console.log('预约资源名单生成失败');
    }
  });
}

const targetPath = resolve('dist/resources');
recursionFile(targetPath);

// 数组过大，一次性输出不出来，用文件承载
const distPath = resolve('preload-list/index.text');
write(distPath, filterFiles.join(''));
console.log('====== preload-list start ======');
console.log(filterFiles.join(''));
console.log('====== preload-list end ======');

console.log('resolve()', resolve('dist'));
