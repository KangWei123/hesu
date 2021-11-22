<template>
  <div class="picture-detail">
    <div class="title">详情</div>

    <div class="folder-material" v-if="data && data.type === materialEnum.materialType.FOLDER">
      <div class="folder-header"></div>
      <div class="folder-content">
        <div class="img-box">
          <div class="img-item" v-for="(item, index) in 4" :key="index">
            <img
              v-if="data.coverUrlList && data.coverUrlList[index]"
              :src="data.coverUrlList[index]"
              :draggable="false"
            />
            <div v-else class="none"></div>
          </div>
        </div>
        <div class="material-name">{{ data.name }}</div>
      </div>
    </div>

    <div class="image-box" v-else>
      <img :src="getCover(data)" alt class="image" v-if="data && data.id" />
      <div class="image-empty" v-else>
        <img src="../../../../images/category/empty.png" alt class="empty" />
      </div>
      <div class="picture-name">{{ data && data.name }}</div>
    </div>

    <div class="container" v-if="data && data.id">
      <div class="picture-time">
        <span class="label">文件大小:</span>
        <span class="time">{{ data.size | size }}M</span>
      </div>
      <div class="picture-time">
        <span class="label">类型:</span>
        <span class="time">{{ data.type === materialEnum.materialType.FOLDER ? '文件夹' : data.format }}</span>
      </div>
      <div class="picture-time" v-if="data.type === materialEnum.materialType.FOLDER">
        <span class="label">包含内容:</span>
        <span class="time">{{ data.folderCount }}个文件夹，{{ data.fileCount }}个文件</span>
      </div>
      <div class="picture-time">
        <span class="label">创建时间:</span>
        <span class="time">{{ data.createTime }}</span>
      </div>
      <div class="picture-time">
        <span class="label">全路径:</span>
        <span class="time">{{ data.path }}</span>
      </div>
      <div class="picture-info" v-if="data.tagDTOs && data.tagDTOs.length">标签:</div>
      <div class="tag-box">
        <div class="tag-item" v-for="item in data.tagDTOs" :key="item.id">{{ item.tagValue }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import materialEnum from '../material-type';
  import { getCover } from '@/mod-kangyang/src/utils';

  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        materialEnum,
      };
    },
    filters: {
      size(val) {
        const size = (val / 1024 / 1024).toFixed(2);
        return size;
      },
    },
    methods: {
      getCover,
    },
  };
</script>

<style lang="less" scoped>
  .picture-detail {
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    border-left: 1px solid #ebeef5;
    box-sizing: border-box;
    padding: 0 16px 0 16px;
    font-size: 14px;
    color: #a1a4ab;
    line-height: 20px;

    .title {
      margin-top: 24px;
      font-size: 16px;
      font-weight: 400;
      color: #303133;
      line-height: 22px;
    }

    .image-box {
      margin-top: 16px;
      width: 152px;

      .image {
        width: 136px;
        height: 136px;
        border-radius: 2px;
        display: block;
        margin: 0 auto;
        text-align: center;
        object-fit: scale-down;
      }

      .image-empty {
        width: 136px;
        height: 136px;
        border-radius: 2px;
        display: block;
        margin: 0 auto;
        text-align: center;
        object-fit: scale-down;
        background: #f2f6fc;

        .empty {
          width: 80px;
          height: 80px;
          margin-top: 28px;
        }
      }
    }

    .folder-material {
      margin-top: 16px;
      position: relative;

      .check {
        position: absolute;
        top: 15px;
        left: 6px;
      }

      .folder-header {
        width: 65px;
        height: 10px;
        background: #e6e9f0;
        border-radius: 4px 6px 0 0;
        position: relative;
      }

      .folder-header::after {
        position: absolute;
        position: absolute;
        right: 0;
        content: '';
        width: 2px;
        height: 0;
        border-left: 10px solid transparent;
        border-top: 10px solid #fff;
      }

      .folder-content {
        width: 152px;
        height: 130px;
        background: #fff;
        border: 1px solid #e6e9f0;
        border-radius: 0 4px 4px 4px;
        cursor: pointer;

        .img-box {
          display: flex;
          flex-wrap: wrap;
          margin-top: 2px;

          .img-item {
            overflow: hidden;
          }

          img {
            margin-left: 5px;
            margin-top: 5px;
            width: 68px;
            height: 44px;
            background: #ebeef5;
            display: block;
          }

          .none {
            margin-left: 5px;
            margin-top: 5px;
            width: 68px;
            height: 44px;
            background: #ebeef5;
          }
        }

        .material-name {
          margin-top: 5px;
          height: 22px;
          padding: 0 5px;
          text-align: center;
          color: #303133;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }

    .picture-name {
      width: 152px;
      height: 20px;
      margin-top: 8px;
      font-size: 14px;
      text-align: center;
      color: #303133;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .picture-info {
      margin-top: 8px;

      span {
        margin-left: 5px;
        display: inline-block;
        line-height: 20px;
      }
    }

    .picture-time {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;

      .label {
        width: 70px;
        display: inline-block;
        text-align: left;
        margin-right: 5px;
      }

      .time {
        overflow: hidden;
        margin-left: 5px;
        line-height: 20px;
        text-align: right;
        width: 95px;
        word-break: break-word;
      }
    }

    .tag-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .tag-item {
        max-width: 175px;
        padding: 0 23px;
        height: 36px;
        line-height: 36px;
        background: #ebeef5;
        border-radius: 20px;
        font-size: 14px;
        color: #a1a4ab;
        margin-top: 15px;
        margin-right: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
