const TYPES = {
  IMAGE: 1,
  VOICE: 2,
  VIDEO: 3,
  THUMB: 4,
};
const TYPE_NAMES = {};
TYPE_NAMES[TYPES.IMAGE] = '图片';
TYPE_NAMES[TYPES.THUMB] = '缩略图';
TYPE_NAMES[TYPES.VOICE] = '音频';
TYPE_NAMES[TYPES.VIDEO] = '视频';

const ACCEPT = {};
ACCEPT[TYPES.THUMB] = ACCEPT[TYPES.IMAGE] = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'].join(
  ','
);

ACCEPT[TYPES.VOICE] = ['audio/mp3', 'audio/x-ms-wma', 'audio/wav', 'audio/amr'].join(',');

ACCEPT[TYPES.VIDEO] = ['video/mp4'].join(',');

const VIDEO_TAILS = [
  'mp4',
  'flv',
  'f4v',
  'webm',
  'm4v',
  'mov',
  '3gp',
  '3g2',
  'rm',
  'rmvb',
  'wmv',
  'avi',
  'asf',
  'mpg',
  'mpeg',
  'mpe',
  'ts',
  'div',
  'dv',
  'divx',
  'vob',
  'dat',
  'mkv',
  'mkv',
].join(';');

const SIZE_LIMIT = {};
SIZE_LIMIT[TYPES.THUMB] = SIZE_LIMIT[TYPES.IMAGE] = 2097152; // 2MB
SIZE_LIMIT[TYPES.VOICE] = 2097152; // 2MB
SIZE_LIMIT[TYPES.VIDEO] = 10485760; // 10MB

const SIZE_ERROR = {};
SIZE_ERROR[TYPES.THUMB] = SIZE_ERROR[TYPES.IMAGE] = '超过上传最大限制2MB'; // 2MB
SIZE_ERROR[TYPES.VOICE] = '超过上传最大限制2MB'; // 2MB
SIZE_ERROR[TYPES.VIDEO] = '超过上传最大限制10MB'; // 10MB

const FILE_TIPS = {};
FILE_TIPS[TYPES.THUMB] = FILE_TIPS[TYPES.IMAGE] = '只能上传jpg/png文件,且不超过2MB'; // 2MB
FILE_TIPS[TYPES.VOICE] = '格式支持mp3、wma、wav、amr，文件大小不超过2M，语音时长不超过60s'; // 2MB
FILE_TIPS[TYPES.VIDEO] = '视频不能超过10M'; // 10MB

export default {
  VIDEO_TAILS: VIDEO_TAILS,
  FILE_ACCEPT: ACCEPT,
  FILE_TYPES: TYPES,
  TYPE_NAMES: TYPE_NAMES,
  SIZE_LIMIT: SIZE_LIMIT,
  SIZE_ERROR: SIZE_ERROR,
  FILE_TIPS: FILE_TIPS,
};
