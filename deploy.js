// @ts-check
/**
 * 快速部署脚本
 */
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');
const ch = require('child_process');
const os = require('os');

const ConfigPath = path.join(__dirname, 'deploy.env');
const TempPath = path.join(__dirname, '.temp');
const DistPath = path.join(__dirname, 'dist');

if (!fs.existsSync(ConfigPath)) {
  console.warn(`deploy.env 不存在，请拷贝 deploy.env.tpl, 并配置部署环境`);
} else {
  // 加载环境变量配置
  dotenv.config({ path: ConfigPath });
}

if (!fs.existsSync(DistPath)) {
  console.error(`dist 为空，请先执行 build`);
  process.exit(-1);
}

if (fs.existsSync(TempPath)) {
  fs.emptyDirSync(TempPath);
} else {
  fs.mkdirSync(TempPath);
}

const USER = process.env.DEPLOY_USER || process.env.USER || 'root';
const SERVER = process.env.DEPLOY_SERVER || process.env.SERVER;
const TARGET = process.env.DEPLOY_TARGET || process.env.TARGET || '/data/node';

if (SERVER == null) {
  console.error(`请指定 SERVER 环境变量`);
  process.exit(-1);
}

// 资源规范化
fs.copySync(path.join(DistPath, 'resources'), path.join(TempPath, 'resources'));
const fileList = fs.readdirSync(DistPath);
fileList.forEach(item => {
  if (item.startsWith('.') || item.startsWith('resources')) {
    return;
  }
  fs.copySync(path.join(DistPath, item), path.join(TempPath, `node-server/${item}`));
});

// sftp 部署
// Window sftp 和 *Unix 有点差异
const CMD = `sftp -p ${USER}@${SERVER} <<!
mkdir ${TARGET}
cd ${TARGET}
put -p -R ${process.platform === 'win32' ? '.temp' : '.temp/*'}
bye
!`;

console.log(CMD);
if (process.platform === 'win32') {
  // 需要通过 sh 进行执行
  // Window 不支持 HereDOC
  const scriptDir = path.join(__dirname, 'node_modules', '_sh_');
  if (!fs.existsSync(scriptDir)) {
    fs.mkdirSync(scriptDir);
  }
  const scriptPath = path.join(scriptDir, 'batch');
  fs.writeFileSync(scriptPath, CMD);
  ch.execSync(`sh ${scriptPath}`, { stdio: 'inherit' });
} else {
  ch.execSync(CMD, { stdio: 'inherit' });
}
