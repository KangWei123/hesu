/**
 * Created by love on 18/8/23.
 * @author trumpli<李志伟>
 */
const Replays = {
  //关键字回复
  Key: 'KeyReplay',
  //收到消息回复
  Receive: 'ReceiveReplay',
  //被关注回复
  Attention: 'AttentionReplay'
};
const materialsType = {
  Graphic: 'Graphic',
  Image: 'Image',
  Video: 'Video',
  Audio: 'Audio'
};

//菜单消息类型
const MenuMsgType = {
  SendMsg: 'SendMsg',
  JumpH5: 'JumpH5',
  JumpMinProgram: 'JumpMinProgram'
};

const ButtonTypes = {
  TEXT: 'text', //文本
  IMAGE: 'media_id', //图片
  AUDIO: 'voice', //声音
  VIDEO: 'video', //视频
  Article: 'view_limited', //图文消息
  MiniProgram: 'miniprogram', //跳转小程序
  Page: 'view' //跳转页面
};

const previewTypes = {
  text: 'text',
  media_id: 'image',
  view_limited: 'mpnews',
  voice: 'voice',
  video: 'mpvideo'
};

//发送消息
const MsgTypes = {
  [ButtonTypes.TEXT]: 1,
  [ButtonTypes.IMAGE]: 1,
  [ButtonTypes.AUDIO]: 1,
  [ButtonTypes.VIDEO]: 1,
  [ButtonTypes.Article]: 1
};

//跳转页面
const PageTypes = {
  [ButtonTypes.Page]: 1
};

//跳转小程序
const MiniProgramTypes = {
  [ButtonTypes.MiniProgram]: 1
};
const ButtonTypesArray = ['view_limited', 'text', 'media_id', 'voice', 'video'];

module.exports = {
  Replays,
  MenuMsgType,
  ButtonTypes,
  MsgTypes,
  PageTypes,
  materialsType,
  previewTypes,
  ButtonTypesArray,
  MiniProgramTypes
};
