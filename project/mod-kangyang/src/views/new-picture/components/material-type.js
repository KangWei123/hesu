export default {
  showType: {
    tile: 0, // 平铺
    list: 1, // 列表
    screen: 2, // 筛选
  },

  materialType: {
    FOLDER: 1, // 文件夹
    IMAGE: 2, // 图片
    VIDEO: 3, // 视频
    VOICE: 4, // 音频
    THUMB: 5, // 缩略图
    PDF: 6, // PDF
  },

  queryType: {
    folder: 1, // 文件夹,
    material: 2, // 素材
    all: 3, // 文件夹 + 素材
  },
};

export const UploadFileType = {
  IMAGE: 1,
  VOICE: 2,
  VIDEO: 3,
  COVER: 4,
  PDF: 5,
};

// PHOTO(1, "图片"),
// VOICE(2,"语音"),
// VIDEO(3, "视频"),
// COVER(4,"封面"),
// PDF(5,"PDF"),
