import WxEmoji from './WxEmoji';
import HashLink from './HashLink';

const BlankImg = 'https://mp.weixin.qq.com/mpres/zh_CN/htmledition/comm_htmledition/images/pic/common/pic_blank.gif';
const RecoveryReg = new RegExp('(\\[[^\\[\\]]*\\])', 'g');
const EMOJI_HEIGHT = 20;
const Icons = [];
const IconNameMap = {};

function getBp(y) {
  return `0 -${y}px`;
}

function initialize() {
  const list = [];
  WxEmoji.forEach((item, index) => {
    if (item.disabled) {
      return;
    }
    Icons.push(
      (IconNameMap[item.cn] = {
        name: item.cn,
        bp: getBp(index * EMOJI_HEIGHT)
      })
    );

    if (!!item.code) {
      list.push({
        code: item.code,
        node: {
          cn: item.cn,
          image: getEmojiImgBpByIconName(item.cn)
        }
      });
    }
  });
  HashLink.source(list, 'code', 'node');
}

initialize();

function getEmojiImgBpByIconName(name) {
  const item = IconNameMap[name];
  return `<img src="${BlankImg}" title="${item.name}" class="wx-emoji-sharp" style="background-position: ${item.bp}"/>`;
}

function getEmojiImgByIconName(name) {
  const item = IconNameMap[name];
  return {
    src: BlankImg,
    backgroundPosition: item.bp
  };
}

//还原文本，到页面
function recoveryEmojiTextToHtml(text) {
  text = text || '';
  text = text.replace(/ /g, '&nbsp;');
  const matched = text.match(RecoveryReg);
  if (!!matched && !!matched.length) {
    const tasks = {};
    const RmvBorderReg = new RegExp('\\[|\\]', 'g');
    matched.forEach(match => {
      if (IconNameMap.hasOwnProperty(match)) {
        if (!tasks.hasOwnProperty(match)) {
          const item = IconNameMap[match];
          tasks[match] = `<img src="${BlankImg}"
            title="${item.name}" class="wx-emoji-sharp"  style="background-position: ${item.bp}"/>`;
        }
      }
    });
    for (let match in tasks) {
      text = text.replace(new RegExp('\\[' + match.replace(RmvBorderReg, '') + '\\]', 'g'), tasks[match]);
    }
  }
  text = HashLink.search(text, 'image');
  return text;
}

export default {
  Icons,
  IconNameMap,
  getEmojiImgByIconName,
  getEmojiImgBpByIconName,
  recoveryEmojiTextToHtml
};
