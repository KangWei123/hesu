export const MODULE_TYPE_ELDERSPACE = 2;

export const FOLDER_TYPE = {
  /**
   * 素材中心，不允许编辑、删除
   */
  MATERIAL_FOLDER: 0,
  /**
   * 机构
   */
  ORG: 1,
  /**
   * 长者
   */
  ELDER: 2,
  /**
   * 长者图片, 只允许上传照片
   */
  ELDER_PIC: 3,
  /**
   * 长者视频, 只允许上传视频
   */
  ELDER_VIDEO: 4,
  /**
   * 人脸识别失败, 不允许上传图片
   */
  FACE_VERIFY_FAIL: 5,
};

// PROJECT(1, "项目文件夹"),
// UNRECOGNIZED(3,"未识别文件夹"),
// ELDER(2, "长者文件夹"),
// PHOTO(4,"图片文件夹"),
// VIDEO(5,"视频文件夹"),
// CUSTOM(6,"自定义文件夹"),

// @ts-check
const MB = 1024 * 1024;
export const MAX_VOICE_SIZE = 10 * 1024 * 1024;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
export const MAX_PDF_SIZE = 50 * 1024 * 1024;
export const MAX_THUMB_SIZE = 50 * 1024 * 1024;

export const MAX_SIZE_NAME = {
  VOICE: MAX_VOICE_SIZE / MB + 'MB',
  IMAGE: MAX_IMAGE_SIZE / MB + 'MB',
  VIDEO: MAX_VIDEO_SIZE / MB + 'MB',
  PDF: MAX_PDF_SIZE / MB + 'MB',
  THUMB: MAX_THUMB_SIZE / MB + 'MB',
};

export const TYPES = {
  IMAGE: 1,
  VOICE: 2,
  VIDEO: 3,
  THUMB: 4,
  PDF: 5,
};

export const TYPE_NAMES = {};
TYPE_NAMES[TYPES.IMAGE] = '图片';
TYPE_NAMES[TYPES.VOICE] = '音频';
TYPE_NAMES[TYPES.VIDEO] = '视频';
TYPE_NAMES[TYPES.THUMB] = '缩略图';
TYPE_NAMES[TYPES.PDF] = 'PDF';

export const ACCEPT = {};
ACCEPT[TYPES.THUMB] = ACCEPT[TYPES.IMAGE] = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'].join(
  ','
);
ACCEPT[TYPES.IMAGE] = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'].join(',');

ACCEPT[TYPES.VOICE] = ['audio/mp3', 'audio/x-ms-wma', 'audio/wav', 'audio/amr'].join(',');

ACCEPT[TYPES.VIDEO] = ['video/mp4'].join(',');

ACCEPT[TYPES.PDF] = ['application/pdf'].join(',');

export const VIDEO_TAILS = [
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

export const SIZE_LIMIT = {};
SIZE_LIMIT[TYPES.VOICE] = MAX_VIDEO_SIZE;
SIZE_LIMIT[TYPES.IMAGE] = MAX_IMAGE_SIZE;
SIZE_LIMIT[TYPES.VIDEO] = MAX_VIDEO_SIZE;
SIZE_LIMIT[TYPES.THUMB] = SIZE_LIMIT[TYPES.IMAGE] = MAX_THUMB_SIZE; // 2MB
SIZE_LIMIT[TYPES.PDF] = MAX_PDF_SIZE; // 50MB

export const SIZE_ERROR = {};
SIZE_ERROR[TYPES.VOICE] = `超过上传最大限制${MAX_SIZE_NAME.VOICE}`; // 2MB
SIZE_ERROR[TYPES.IMAGE] = `超过上传最大限制${MAX_SIZE_NAME.IMAGE}`; // 2MB
SIZE_ERROR[TYPES.VIDEO] = `超过上传最大限制${MAX_SIZE_NAME.VIDEO}`; // 50MB
SIZE_ERROR[TYPES.THUMB] = SIZE_ERROR[TYPES.IMAGE] = `超过上传最大限制${MAX_SIZE_NAME.THUMB}`; // 2MB
SIZE_ERROR[TYPES.PDF] = `超过上传最大限制${MAX_SIZE_NAME.PDF}`; // 50MB

export const FILE_TIPS = {};
FILE_TIPS[TYPES.VOICE] = `${MAX_SIZE_NAME.VOICE}, 格式支持mp3、wma、wav、amr，语音时长不超过60s`; // 2MB
FILE_TIPS[TYPES.VIDEO] = `视频不能超过${MAX_SIZE_NAME.VIDEO}, 支持 MP4`; // 50MB
FILE_TIPS[TYPES.THUMB] = FILE_TIPS[TYPES.IMAGE] = `只能上传jpg/png文件,且不超过${MAX_SIZE_NAME.THUMB}`; // 2MB
FILE_TIPS[TYPES.PDF] = `只能上传pdf文件, 且不超过${MAX_SIZE_NAME.PDF}`; // 2MB

export { ACCEPT as FILE_ACCEPT, TYPES as FILE_TYPES };

export default {
  FILE_ACCEPT: ACCEPT,
  FILE_TYPES: TYPES,
  FILE_TIPS,
  SIZE_ERROR,
  SIZE_LIMIT,
  ACCEPT,
  TYPES,
  TYPE_NAMES,
  VIDEO_TAILS,
};
