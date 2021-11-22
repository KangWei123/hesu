<template>
  <div class="comment">
    <div class="Add-Manage-Button">
      <el-button plain @click="puppetManage">管理马甲</el-button>
      <el-button type="primary" @click="showPuppetComment">发表马甲评论</el-button>
    </div>
    <div class="comment-filter">
      <el-form inline class="wkt-opt-label-container" :model="search" ref="search">
        <el-form-item label="用户名：" prop="keyword">
          <el-input
            placeholder="搜索用户名称或手机号"
            prefix-icon="el-icon-search"
            v-model.trim="search.keyword"
            @input="onSearch"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="文章：" prop="articleId">
          <el-select
            v-model="search.articleId"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="选择文章"
            :remote-method="searchTitle"
            :loading="searchLoading"
            @change="onSearch"
          >
            <el-option v-for="item in articleList" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论状态：" prop="status">
          <el-select v-model="search.status" placeholder="选择评论状态" @change="onSearch">
            <el-option label="全部评论" :value="0"></el-option>
            <el-option label="已删除" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button plain @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="comment-list">
      <el-table :data="tableData" v-loading="loadingList" default-expand-all>
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column type="expand">
          <template slot-scope="scope" v-if="scope.row.childComment && scope.row.childComment.length">
            <div class="reply-list">
              <div class="reply-comment" v-for="replyItem in scope.row.childComment" :key="replyItem.id">
                <span style="display: flex">
                  <span class="content reply-title">商家回复：</span>
                  <span class="create-time">{{ replyItem.createTime }}</span>
                </span>
                <span style="display: flex">
                  <span class="content">{{ replyItem.content }}</span>
                  <span class="delete-reply" @click="onDelete(replyItem.id)">删除</span>
                </span>
                <!-- <span class="content">商家回复：{{ replyItem.content }}</span>
                <span class="create-time">{{ replyItem.createTime }}</span>
                <span class="delete-reply" @click="onDelete(replyItem.id)">删除</span> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文章" width="400px">
          <template slot-scope="scope">
            <div class="article-info">
              <img class="cover-url" :src="scope.row.articleImageUrl" alt />
              <span class="cover-name">{{ scope.row.articleName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论用户">
          <template slot-scope="scope">
            <div class="article-info">
              <img :src="scope.row.authorAvatar" class="leader-avatar" />
              {{ scope.row.authorName || '******' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论时间" prop="createTime"></el-table-column>
        <el-table-column label="评论内容">
          <template slot-scope="scope">
            <div>{{ scope.row.content }}</div>
            <img
              :src="scope.row.contentImageUrl"
              class="content-url"
              @click="showImage(scope.row.contentImageUrl)"
              v-if="scope.row.contentImageUrl"
            />
          </template>
        </el-table-column>
        <el-table-column label="点赞数">
          <template slot-scope="scope">
            <div :span="8">{{ scope.row.likeCount || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="!search.status" label="操作" width="210px" min-width="100px" fixed="right">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              class="table-href"
              @click="onReply(scope.row.id, scope.row.articleId, scope.row.articleName)"
              >回复</a
            >
            <a href="javascript:;" class="table-delete" @click="onDelete(scope.row.id)">删除</a>
            <a href="javascript:;" class="table-href" @click="onSticky(scope.row.id, scope.row.topValue)">
              {{ scope.row.topValue ? '取消置顶' : '置顶该评论' }}
            </a>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination> -->

      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <div class="popover" v-show="showCommentImg" @click="hideImage">
      <img :src="curCommentImg" class="popover-img" @click.stop="emptyEvent" />
    </div>

    <!-- 商家回复评论弹窗 -->
    <reply-comment-dialog
      :article-name="activeArticleName"
      :article-id="activeArticleId"
      :comment-id="activeCommentId"
      v-model="replyCommentVisible"
      @refreshList="getList"
    />
    <!-- 管理马甲弹窗 -->
    <el-dialog title="管理马甲" :visible.sync="dialogPupManage" width="480px" custom-class="pup-manage-dialog" center>
      <div v-if="puppetList && puppetList.length >= 3" class="manage-add-button">
        <el-button type="primary" icon="el-icon-plus" class="pup-manage-text">创建新马甲</el-button>
        <span style="font-size: 12px; color: #a1a4ab; display: block">*最多只能创建三个马甲</span>
      </div>
      <div class="manage-add-button" v-else>
        <el-button type="primary" icon="el-icon-plus" @click="puppetAdd" class="pup-manage-text">创建新马甲</el-button>
      </div>

      <div class="pup-add-list" v-if="puppetList && puppetList.length" v-loading="loading.puplist">
        <div class="puplabel">
          <div v-for="item in puppetList.length" :key="item.id" class="label-list">马甲{{ item }}：</div>
        </div>
        <div style="margin-left: 55px">
          <div class="pupInput" v-for="item in puppetList" :key="item.id">
            <div class="message-box">
              <img class="img" :src="item.avatar" alt="" />
              <span>{{ item.name }}</span>
            </div>
            <i
              style="cursor: pointer; color: #4884fb; margin-left: 40px; line-height: none"
              @click="puppetDel(item.id, $event)"
              class="el-icon-delete"
            ></i>
          </div>
        </div>
      </div>
      <div v-else class="empty">暂无数据</div>

      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogPupManage = false" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建马甲弹窗 -->
    <PuppetDialogAdd
      v-if="dialogPupAdd"
      :visible.sync="dialogPupAdd"
      class="puppet-dialog-add"
      :edit-title="PupTitle"
      :on-save-puppet="onSavePuppet"
    >
    </PuppetDialogAdd>
    <!-- 发表马甲评论弹窗 -->
    <el-dialog
      @closed="handleClose"
      title="发表马甲评论"
      :visible.sync="dialogPupComment"
      width="480px"
      custom-class="pup-comment-dialog"
      center
    >
      <el-form :model="replyForm" :rules="rules" ref="replyForm" v-if="puppetList && puppetList.length">
        <el-form-item class="text" label="请选择马甲：">
          <div
            @click="pickPuppet(item, index)"
            v-for="(item, index) in puppetList"
            :key="item.id"
            :class="{ 'message-box-checked': index == changeStyle, 'message-box': true }"
          >
            <img class="img" :src="item.avatar" alt="" />
            <span>{{ item.name }}</span>
          </div>
        </el-form-item>
        <el-form-item prop="commentsReply" label=" 发表评论：">
          <el-input
            type="textarea"
            maxlength="100"
            v-model.trim="replyForm.commentsReply"
            placeholder="请输入评论内容"
            style="width: 308px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div v-else class="empty">暂无数据</div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogPupComment = false">{{ btnText }}</el-button>
        <el-button
          v-if="puppetList && puppetList.length"
          @click="puppetCommentAdd"
          type="primary"
          :loading="loading.reply"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import PuppetDialogAdd from '@/dss-wechat3rd/src/bz_components/puppet-add-dialog';
  import ReplyCommentDialog from './reply-comment-dialog.vue';
  import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';
  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
  import { mapState } from 'vuex';

  export default {
    components: {
      ReplyCommentDialog,
      PuppetDialogAdd,
    },
    mixins: [AdapterIfr.AdapterMixins],
    data() {
      return {
        search: {
          keyword: '',
          articleId: '',
          status: 0,
        },
        articleList: [],
        tableData: [],
        page: {
          pageSize: 10,
          pageNo: 1,
        },
        totalCount: 0,
        loadingList: false,
        searchLoading: false, // 选择文章时的搜索加载状态
        timer: null,
        showCommentImg: false, // 评论图片的预览
        curCommentImg: '', // 当前选中评论图片
        replyCommentVisible: false, // 商家评论弹窗显隐
        activeArticleId: null, // 当前回复评论的图文
        activeArticleName: null, // 当前回复评论的图文名称
        activeCommentId: null, // 当前回复评论的id

        loading: {
          puplist: false,
          reply: false,
        },
        changeStyle: 0,
        puppetList: [],
        dialogPupManage: false, // 管理马甲弹窗显隐
        dialogPupAdd: false, // 创建马甲弹窗显隐
        dialogPupComment: false, // 发表马甲评论弹窗显隐
        PupTitle: '创建新马甲',
        replyForm: {
          commentsReply: '', // 马甲评论内容
          puppetMessage: {}, // 马甲账号信息
        },
        rules: {
          commentsReply: [{ required: true, message: '评论内容不能为空！', trigger: 'change' }],
        },
      };
    },
    computed: {
      btnText() {
        return this.puppetList && this.puppetList.length ? '取消' : '确定';
      },
    },
    watch: {
      showCommentImg(newVal, oldVal) {
        this.showCommentImg = newVal;
        this.adapterIfmMask(newVal);
      },
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (vm.$route.params.id) {
          vm.articleList = [vm.$route.params];
          vm.search.articleId = vm.$route.params.id;
        }
        vm.getList(); // 获取列表
      });
    },

    methods: {
      getList() {
        const params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          keyword: this.search.keyword,
          status: this.search.status,
        };
        params.articleId = this.search.articleId;
        this.loadingList = true;
        marketArticleApi
          .commentList(params)
          .then(res => {
            if (res.data && res.data.length) {
              this.tableData = res.data || [];
              if (this.tableData && this.tableData.length) {
                this.totalCount = res.totalCount;
              }
            } else {
              this.tableData = [];
              this.totalCount = 0;
            }
          })
          .catch(err => {
            this.tableData = [];
          })
          .finally(() => {
            this.loadingList = false;
          });
      },
      searchTitle(key) {
        if (key) {
          if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
          }
          this.timer = window.setTimeout(() => {
            this.searchLoading = true;
            marketArticleApi
              .list({
                pageNo: 1,
                pageSize: 1000,
                title: key,
                deleteFlag: 'N',
              })
              .then(res => {
                if (res.data && res.data.length) {
                  this.articleList = res.data || [];
                } else {
                  this.articleList = [];
                }
              })
              .finally(() => {
                this.searchLoading = false;
              });
          }, 300);
        } else {
          this.search.articleId = '';
          this.articleList = [];
        }
      },
      // 获取马甲账号信息
      getPuppetList() {
        this.loading.puplist = true;
        marketArticleApi
          .getPuppetList()
          .then(res => {
            this.puppetList = res.data || [];
            this.replyForm.puppetMessage = this.puppetList[0];
          })
          .finally(_ => {
            this.loading.puplist = false;
          });
      },
      // 发表马甲评论
      puppetCommentAdd() {
        this.$refs.replyForm.validate(valid => {
          if (valid) {
            this.loading.reply = true;
            marketArticleApi
              .addPupReplyComment({
                content: this.replyForm.commentsReply,
                articleId: this.search.articleId,
                puppetUserId: this.replyForm.puppetMessage.id,
              })
              .then(res => {
                this.$message.success('添加评论成功');
              })
              .finally(_ => {
                this.loading.reply = false;
                this.dialogPupComment = false;
                this.getList();
              });
          }
        });
      },
      // 删除马甲
      puppetDel(data, e) {
        this.loading.puplist = true;
        marketArticleApi
          .PuppetDelete({ id: data })
          .then(res => {
            this.$message.success('删除马甲账号成功');
          })
          .finally(_ => {
            this.getPuppetList();
          });
      },
      // 管理马甲
      puppetManage() {
        this.getPuppetList();
        this.dialogPupManage = true;
      },
      // 创建新马甲
      puppetAdd() {
        this.dialogPupManage = false;
        this.dialogPupAdd = true;
      },
      // 发表马甲评论后关闭弹窗后执行的函数
      onSavePuppet(res) {
        this.dialogPupAdd = false;
        this.$message({
          type: 'success',
          message: '新建马甲成功',
        });
      },
      showPuppetComment() {
        if (!this.search.articleId) {
          this.$confirm('请选择文章后，创建该文章的马甲评论', '未选中图文', {
            confirmButtonText: '确定',
            customClass: 'tips-warning',
            center: true,
          }).catch(() => {});
        } else {
          this.dialogPupComment = true;
          this.getPuppetList();
        }
      },
      pickPuppet(item, index) {
        this.changeStyle = index;
        this.replyForm.puppetMessage = item;
      },
      // 删除用户评论
      onDelete(id) {
        this.$confirm('确定删除该评论吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.loadingList = true;
            return marketArticleApi.deleteComment({ commentId: id });
          })
          .then(() => {
            this.$message.success('删除成功');
            this.getList();
          })
          .catch(() => {
            this.loadingList = false;
          });
      },
      // 商家回复评论
      onReply(id, articleId, articleName) {
        this.activeArticleName = articleName || null;
        this.activeCommentId = id || null;
        this.activeArticleId = articleId || null;
        this.replyCommentVisible = true;
      },
      // 置顶/取消置顶评论
      onSticky(id, topValue) {
        this.loadingList = true;
        marketArticleApi
          .updateReplyTop({
            commentId: id,
            topValue: topValue ? 0 : 100,
          })
          .then(res => {
            const msg = topValue ? '取消置顶成功' : '置顶评论成功';
            this.$message.success(msg);
            this.getList();
          })
          .catch(_ => {
            this.loadingList = false;
          });
      },
      onSearch() {
        this.articleList = [];
        this.page.pageNo = 1;
        this.getList();
      },
      onSizeChange(size) {
        this.page.pageSize = size;
        this.page.pageNo = 1;
        this.getList();
      },
      onPageChange(page) {
        this.page.pageNo = page;
        this.getList();
      },
      showImage(url) {
        this.curCommentImg = url || '';
        this.showCommentImg = true;
      },
      hideImage() {
        this.showCommentImg = false;
      },
      handleClose() {
        this.$refs.replyForm && this.$refs.replyForm.resetFields();
      },
      emptyEvent() {
        return false;
      },
      handleReset() {
        this.$refs.search.resetFields();
        this.onSearch();
      },
    },
    mounted() {},
  };
</script>

<style lang="less" scoped>
  .comment {
    // padding: 0 20px;

    .wkt-opt-label-container {
      padding: 10px 20px;
    }

    .el-form-item {
      margin-bottom: 10px;
    }

    .el-table {
      padding-top: 0;
    }
  }

  .comment-list {
    // padding: 20px 0;
    margin-top: 16px;
    background: #fff;
  }

  .article-info {
    position: relative;
    // width: 145px;
    // margin: 0 auto;
    display: flex;
    align-items: center;

    .leader-avatar {
      // width: 22px;
      // height: 22px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      vertical-align: middle;
      display: inline-block;
      padding-right: 7px;
      margin-top: -3px;
    }
  }

  .cover-url {
    width: 145px;
    height: 84px;
  }

  .content-url {
    width: 84px;
    height: 84px;
  }

  .cover-name {
    // position: absolute;
    // top: 65px;
    // left: 0;
    padding: 5px;
    // line-height: 10px;
    color: #303133;
    // background: rgba(0, 0, 0, 0.5);
    width: 135px;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // overflow: hidden;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .popover {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 88;
    width: calc(100vw);
    height: calc(100vh);
    background: rgba(0, 0, 0, 0.5);

    .popover-img {
      height: calc(80vh);
      margin: calc(10vh) auto;
      display: block;
    }
  }

  .no-data {
    line-height: 200px;
    text-align: center;
  }

  .reply-list {
    background: #f5f7fa;
    // padding: 10px 22px 10px 48px;

    .reply-comment {
      // display: flex;
      width: 100%;
      padding: 10px;
      border-bottom: 1px solid #eee;
      padding: 20px 24px 20px 48px;

      .content {
        flex: 2;
      }

      .reply-title {
        color: @light-black-color;
      }

      .create-time {
        flex: 1;
        color: #c0c4cc;
        text-align: right;
      }

      .delete-reply {
        flex: 0.5;
        color: #2e8dff;
        text-align: right;
        cursor: pointer;
      }
    }

    .reply-comment:last-child {
      border-bottom: 0;
    }
  }
</style>
<style lang="less">
  .comment {
    // thead {
    //   th:last-child > .cell {
    //     text-align: right;
    //   }
    // }

    .comment-list {
      .el-table td {
        padding: 0;
      }
    }

    .el-dialog--center .el-dialog__body {
      padding-left: 40px;
    }

    .el-dialog__header {
      text-align: left;
    }
  }

  .tips-warning {
    padding: 30px;

    /deep/.el-message-box__header {
      font-weight: 600;
      padding-top: 0;
    }

    /deep/ .el-button {
      border-radius: 0;
    }
  }

  .pup-manage-dialog {
    .pup-add-list {
      left: 0;
      right: 0;
      text-align: center;
      position: relative;

      .puplabel {
        width: 70px;
        position: absolute;
        left: -15px;
        line-height: 46px;

        .label-list:first-child {
          margin-top: -5px;
        }

        .label-list:not(:first-child) {
          margin-top: 5px;
        }
      }
    }

    /deep/.el-dialog__title {
      font-size: 17px !important;
      font-weight: 600;
    }

    .manage-add-button {
      text-align: center;
    }

    .pupInput {
      margin-top: 15px;
      line-height: 34px;
      border: 1px solid #f2f4f7;
      width: 256px;
      border-radius: 3px;
      padding: 0 20px;
      justify-content: space-between;
      display: flex;
      align-items: center;
    }

    /deep/ .el-dialog__body {
      padding: 40px 70px !important;
    }

    .message-box {
      display: inline-block;

      img {
        max-width: 24px;
        max-height: 24px;
        border-radius: 15px;
        vertical-align: middle;
      }
    }

    .empty {
      text-align: center;
      height: 100px;
      line-height: 62px;
      font-size: 16px;
    }
    // .pup-manage-text{
    //   font-size: 12px;
    //   margin-top: 10px;
    // }
  }

  .pup-comment-dialog {
    /deep/.el-dialog__title {
      font-size: 17px !important;
      font-weight: 600;
    }

    /deep/ .el-textarea__inner {
      min-height: 140px !important;
    }

    /deep/ .el-form-item__error {
      margin-left: 100px !important;
    }

    .empty {
      text-align: center;
      height: 100px;
      line-height: 62px;
      font-size: 16px;
    }

    .message-box-checked {
      background: #fff7e6;

      span {
        color: @ui-theme-color-orange;
      }
    }

    .message-box:not(:first-child) {
      margin-left: 15px;
    }

    .message-box {
      border: 1px solid #f2f4f7;
      // margin-left: 15px;
      width: 90px;
      padding: 0;
      display: inline-block;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;

      img {
        max-width: 22px;
        max-height: 22px;
        border-radius: 50%;
        vertical-align: middle;
      }

      .text {
        color: #606266;
      }
    }
  }
</style>
