<template>
  <el-dialog
    :visible.sync="visible"
    width="960px"
    title="回复"
    append-to-body
    center
    destory-on-close
    :close-on-click-modal="false"
  >
    <div class="content-User">
      <div class="content-Left">
        <img :src="replyData.memberAvatarImg || defaultAvatar" alt="" />
      </div>
      <div class="content-middle">
        <div>用户名：{{ replyData.memberNickName || '未知' }}</div>
        <div>手机号：{{ replyData.phone || '未知' }}</div>
      </div>
      <div class="content-Right">
        <div>{{ replyData.feedBackContent || '未知' }}</div>
        <span>{{ replyData.feedBackTime || '未知' }}</span>
      </div>
    </div>
    <div class="reply-main">
      <div class="reply-main-left">
        <h4 class="h-title">回复内容：</h4>
        <div class="upload">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model.trim="form.replyContent"> </el-input>
          <div class="img-box">
            <image-selector
              size="small"
              :value="form.replyImage"
              @input="onImageAdd"
              @delete="onDeleteImg"
              multiple
              :limit="limit"
            />
          </div>
        </div>
      </div>
      <div class="reply-main-right">
        <h4 class="h-title">快捷回复：</h4>
        <div class="list-main">
          <div class="list">
            <div class="list-item" v-for="(item, index) in replyList" :key="index" @click="handleReply(item)">
              <span>{{ item.replyType }}</span>
              <p>{{ item.replyContant }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      v-if="totalCount"
      layout="prev, pager, next, jumper, sizes, total"
      :page-size="pageParams.pageSize"
      :current-page="pageParams.pageNo"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :total="totalCount"
    />
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import ImageSelector from '@/dss-wechat3rd/src/components/choose-image/index.vue';
  import feedBackApi from '@/dss-wechat3rd/src/api/feedback';
  import cdnResConfig from '@/business-common/utils/cdnResConfig';

  export default {
    components: {
      ImageSelector,
    },
    data() {
      return {
        visible: false,
        limit: 3,
        replyList: [],
        form: this.initData(),
        pageParams: {
          typeStatus: 1,
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        totalCount: 0,
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
        replyData: {},
      };
    },
    mounted() {
      this.getQuickReplyList();
    },
    watch: {
      visible: {
        deep: true,
        handler(val) {
          if (!val) {
            this.form = this.initData();
          }
        },
      },
    },
    methods: {
      initData() {
        return {
          replyContent: '', // 回复内容
          replyImage: [],
        };
      },
      show(row) {
        if (row) {
          this.replyData = row;
        }
        this.visible = true;
      },
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageNo = 1;
        this.pageParams.pageSize = size;
        this.getQuickReplyList();
      },
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getQuickReplyList();
      },
      // 删除图片
      onDeleteImg(index) {
        this.form.replyImage.splice(index, 1);
      },
      onImageAdd(imgs) {
        let hasSelect = false;
        imgs.forEach(ele => {
          if (!~this.form.replyImage.findIndex(i => i.imgUrl === ele.imgUrl)) {
            this.form.replyImage.push(ele);
          } else {
            hasSelect = true;
          }
        });
        if (hasSelect) {
          this.$message.info('选择列表中包含已选图片，已自动进行过滤');
        }
      },
      async getQuickReplyList() {
        // 请求参数
        const payload = this.pageParams;
        const { data, totalCount } = await feedBackApi.getQuickReplyList(payload);

        this.replyList = data;
        this.totalCount = totalCount;
      },
      handleReply(item) {
        this.form.replyContent = item.replyContant;
      },
      async handleConfirm() {
        const params = { ...this.form, id: this.replyData.id, uniqueAccountId: this.replyData.uniqueAccountId };
        if (!params.replyContent) {
          this.$message.error('请输入回复内容');
          return;
        }

        params.replyImage = params.replyImage.map(i => i.imgUrl);

        await feedBackApi.addFeedBack(params);

        this.visible = false;
        this.$emit('update', params);
      },
    },
  };
</script>

<style lang="less" scope>
  .visble {
    display: none;
  }

  .score-edit-members {
    .el-dialog {
      .el-dialog__header {
        padding: 10px 20px;
        border-bottom: 1px solid #ccc;
      }

      .el-dialog__body {
        padding: 15px 0 4px 0;
      }

      .el-dialog__footer {
        text-align: center;
      }
    }

    .score-edit-members-form {
      margin: 10px 0;

      .el-input__inner {
        width: 550px;
        height: 30px;
        line-height: 30px;
      }

      .el-textarea__inner {
        height: 78px;
        width: 550px;
      }

      .el-form-item__error {
        padding-top: 3px;
      }

      .el-form-item {
        margin-bottom: 20px;
      }
    }
  }

  .note-label1 {
    width: 550px;
  }

  .content-User {
    height: 100px;
    margin: 20px;
    padding: 0 24px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #f3fbfe;
    border-radius: 4px;

    .content-Left {
      margin: 5px;
      float: left;

      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
    }

    .content-middle {
      margin: 5px;
      width: 210px;
      float: left;
    }

    .content-Right {
      margin: 5px;
      flex-grow: 2;
      float: left;
      width: 60%;
    }
  }

  /deep/.indexZ {
    z-index: 1000 !important;
  }

  .reply-main {
    display: flex;
    justify-content: space-around;
    padding: 20px;

    .reply-main-left {
      width: 60%;

      .upload {
        position: relative;
        width: 482px;
        height: 285px;
        border: 1px solid #dce1e6;
        border-radius: 4px;

        .img-box {
          position: absolute;
          left: 8px;
          bottom: 8px;
          display: flex;
          flex-direction: row;
        }

        &__img {
          margin-right: 8px;
        }
      }

      .el-textarea__inner {
        border: none;
        resize: none;
      }
    }

    .reply-main-right {
      margin-left: 12px;
      width: calc(50% - 12px);

      .list-main {
        height: 336px;
        overflow-y: auto;
      }

      .list {
        border: 1px solid #dce1e6;
        border-radius: 4px;

        &-item {
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #dce1e6;
          cursor: pointer;

          &:last-child {
            border-bottom: 0;
          }
        }

        span {
          float: left;
          width: 20%;
          text-align: center;
          color: rgb(29, 125, 214);
          overflow: hidden;
          display: -webkit-box;
          border-right: 1px solid #dce1e6;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        p {
          float: right;
          width: 76%;
          margin-left: 10px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }

    .h-title {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      color: #303133;
      line-height: 20px;
      margin-bottom: 8px;
    }
  }
</style>
