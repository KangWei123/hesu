<template>
  <div class="comment-list">

    <div class="Add-Manage-Button">
       <el-button class="add-comment"
                 icon="el-icon-plus"
                 @click="handleAddCoupon"
                 type="primary">添加虚拟评论
      </el-button>
    </div>

    <div class="condition wkt-opt-label-container">

      <comment-filter @filter="onFilter"
                      style="padding-right: 120px">
      </comment-filter>
    </div>

    <div class="comment-list-card" v-loading="isLoading">
      <el-row>
        <el-table :data="commentList"
                  class="wkt-table"
                  v-if="commentList&&commentList.length"
                  @expand-change="openRows">
          <!-- 折叠用户评论 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="reply-list"
                   v-if="scope.row.childrenNode && scope.row.childrenNode.length">
                <div class="reply-comment"
                     v-for="replyItem in scope.row.childrenNode"
                     :key="replyItem.id">
                  <img v-if="replyItem.userAvatar"
                       :src="replyItem.userAvatar"
                       class="user-avatar" />
                  <span class="content">{{replyItem.userName}} ：{{ replyItem.detail }}</span>
                  <span class="create-time">{{ replyItem.createTime | format }}</span>
                  <span class="delete-reply"
                        @click="onDeleteReply(replyItem.id)">删除</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="productType"
                           min-width="110">
            <template slot-scope="scope">
              {{ scope.row.itemName}}
              <span v-if="scope.row.skuInfo">({{scope.row.skuInfo}})</span>
            </template>
          </el-table-column>

          <el-table-column label="会员"
                           width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.userName}}</div>
              <div>{{scope.row.phone}}</div>
            </template>
          </el-table-column>

          <el-table-column label="评价等级"
                           prop="gradeDesc"
                           min-width="110">
            <template slot-scope="scope">
              <div :style="{color: gradeColor(scope.row.gradeDesc)}">{{ scope.row.gradeDesc}}</div>
            </template>
          </el-table-column>

          <el-table-column label="详情"
                           prop="content"
                           width="370">
            <template slot-scope="scope">

              <el-popover placement="left"
                          width="600"
                          trigger="click">
                <div class="content-box">
                  <div class="comment-content">{{ scope.row.content}}</div>
                  <div class="comment-imgs">
                    <img :src="item"
                         class="img"
                         v-for="(item,index) in scope.row.images "
                         :key="index">
                  </div>
                </div>
                <div class="content"
                     slot="reference">
                  {{ scope.row.content}}
                  <div class="comment-imgs">
                    <img :src="item"
                         class="img"
                         v-for="(item,index) in scope.row.images "
                         :key="index">
                    <span class="more-pic"
                          v-if="scope.row.images&&scope.row.images.length>3">...</span>
                  </div>
                </div>

              </el-popover>

            </template>
          </el-table-column>

          <el-table-column label="商家回复"
                           width="300">
            <template slot-scope="scope">
              <div>{{ scope.row.sellerReplyContent}}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作"
                           width="210"
                           fixed="right"
                           align="left">
            <template slot-scope="scope">
              <div class="multi-row">
                <a href="javascript:;"
                   v-if="scope.row.isRecommend==commentEnum.pickStatus.PICK"
                   @click="handlePick(scope.row)">取消精选</a>
                <a href="javascript:;"
                   v-if="scope.row.isRecommend==commentEnum.pickStatus.CANCEL&&scope.row.images!=null"
                   @click="handlePick(scope.row)"
                   :style="{'opacity': scope.row.showStatus===commentEnum.showStatus.HIDE?0.2:1}">精选</a>
                <a href="javascript:;"
                   v-if="scope.row.isRecommend==commentEnum.pickStatus.CANCEL&&!scope.row.images"
                   @click="onTips(scope.row)"
                   :style="{'opacity': scope.row.showStatus===commentEnum.showStatus.HIDE?0.2:1}">精选</a>

                <a href="javascript:;"
                   v-if="scope.row.sellerReplyStatus===commentEnum.sellerReplyStatus.NOREPLY"
                   :style="{'opacity': scope.row.showStatus===commentEnum.showStatus.HIDE?0.2:1}"
                   @click="replyDialog(scope.row)">回复</a>
                <a href="javascript:;"
                   v-if="scope.row.showStatus===commentEnum.showStatus.HIDE"
                   @click="handleShow(scope.row.id)">显示</a>
                <a href="javascript:;"
                   v-if="scope.row.showStatus===commentEnum.showStatus.SHOW"
                   @click="handleHide(scope.row.id)">隐藏</a>
                <a href="javascript:;"
                   class="table-delete"
                   v-if="scope.row.type===commentEnum.type.VIRTUAL"
                   @click="handleRemove(scope.row.id)">删除</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <place-holder :height="340"
                      v-else />
      </el-row>
      <div style="text-align: center">
        <!-- <el-pagination v-if="totalGoodsCount"
                       layout="prev, pager, next, jumper, sizes, total"
                       :total="totalGoodsCount"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       @size-change="onSizeChange"
                       @current-change="onPageChange"
                       class="wkt-pagination">
        </el-pagination> -->

        <el-pagination
          v-if="totalGoodsCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalGoodsCount">
        </el-pagination>
      </div>

      <!--回复-->
      <el-dialog title="回复评价"
                 v-loading="replyLoading"
                 :visible.sync="replyDialogVisible">
        <el-form :model="replyForm"
                 :rules="replyRules"
                 label-position="center"
                 label-width="20px"
                 ref="replyForm">
          <el-form-item prop="message">
            <el-input type="textarea"
                      v-model="replyForm.content"
                      maxlength="128"
                      :autosize="{ minRows: 6, maxRows: 6}"
                      auto-complete="off">

            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="replyDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="handleReply('replyForm')">确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import './comment-list-table.less';
import commentFilter from './comment-filter.vue';
import datetime from '@/dss-common/utils/date.js';
import commentAPI from '@/dss-wechat3rd/src/api/commentAPI.js';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import commentEnum from '@/dss-wechat3rd/src/constants/commentEnum.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

export default {
  components: {
    commentFilter,
    PlaceHolder
  },
  data() {
    return {
      commentEnum,
      commentList: [],
      replyForm: {},
      isLoading: false,
      replyLoading: false,
      replyDialogVisible: false,
      totalGoodsCount: 0,
      pageParams: {
        pageSize: 10, // 每页条数
        pageNo: 1 // 页数
      },
      queryParams: {},
      replyRules: {
        content: [{ required: true, message: '请输入回复', trigger: 'blur' }]
      },
      productType: '商品名称'
    };
  },
  props: {
    itemType: {
      type: Object,
      default() {
        return goodsTypeEnum.product;
      }
    }
  },
  mounted() {
    // this.productType = this.itemType.label + '名称';
    // this.doSearch();
  },

  computed: {
    gradeColor() {
      return item => {
        if (item === '好评') {
          return '#52C41A';
        } else if (item === '差评') {
          return '#F5222D';
        } else {
          return '#FA7516';
        }
      };
    }
  },

  methods: {
    // 折叠面板下拉加载更多
    openRows(row, expandedRows) {
      const params = {
        commentId: row.id
      };
      commentAPI
        .queryComment(params)
        .then(res => {
          const replyList = res.data || [];
          row.childrenNode = replyList;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.doSearch();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.doSearch();
    },
    doSearch(key) {
      const itemType = this.itemType.value;
      if (itemType === 18) {
        this.productType = '房型名称';
      } else if (itemType === 19) {
        this.productType = '门票名称';
      }
      this.isLoading = true;
      commentAPI
        .query({ itemType, ...this.pageParams })
        .then(rs => {
          this.totalGoodsCount = rs.totalCount;
          this.commentList = rs.data || [];
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    handleAddCoupon() {
      const url = window.location.hash.slice(1);
      this.$router.push(url + '/edit');
    },

    onFilter(filter) {
      this.pageParams.pageNo = 1;
      this.pageParams = { ...this.pageParams, ...filter };
      this.doSearch();
    },

    handleShow(commentId) {
      this.isLoading = true;
      commentAPI
        .showComment({
          commentId: commentId
        })
        .then(rs => {
          this.doSearch();
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    handleHide(commentId) {
      this.isLoading = true;
      commentAPI
        .hideComment({
          commentId: commentId
        })
        .then(rs => {
          this.doSearch();
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },
    // 精选/取消精选
    handlePick(row) {
      if (row.showStatus == commentEnum.showStatus.HIDE && row.isRecommend != commentEnum.pickStatus.PICK) {
        this.$alert('抱歉, 隐藏的晒单评论无法精选', '提示', {
          dangerouslyUseHTMLString: true
        });
        return;
      }
      this.isLoading = true;
      // 0-CANCEL-非精选状态   1-PICK-精选状态
      const isRecommend =
        row.isRecommend == commentEnum.pickStatus.CANCEL ? commentEnum.pickStatus.PICK : commentEnum.pickStatus.CANCEL;
      commentAPI
        .handlePick({
          isRecommend,
          commentId: row.id
        })
        .then(res => {
          const tip = row.isRecommend === 1 ? '取消精选成功' : '精选成功';
          this.$message.success(tip);
          this.doSearch();
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    replyDialog(row) {
      if (row.showStatus == commentEnum.showStatus.HIDE) {
        this.$alert('抱歉, 隐藏的晒单评论无法回复', '提示', {
          dangerouslyUseHTMLString: true
        });
        return;
      }
      this.replyDialogVisible = true;
      this.replyForm.commentId = row.id;
    },

    handleReply(refName) {
      this.$refs[refName]
        .validate()
        .then(valid => {
          if (!valid) {
            return;
          }
          const params = {
            ...this.replyForm
          };
          this.replyLoading = true;
          commentAPI
            .replyComment(params)
            .done(res => {
              this.replyDialogVisible = false;
              this.doSearch();
              this.replyForm.content = '';
            })
            .always(() => {
              this.replyLoading = false;
            });
        })
        .catch(res => {
          return false;
        });
    },
    onTips(row) {
      if (row.showStatus == commentEnum.showStatus.HIDE) {
        this.$alert('抱歉, 隐藏的晒单评论无法精选', '提示', {
          dangerouslyUseHTMLString: true
        });
      } else {
        this.$alert('抱歉, 没有带图的晒单不能设置为精选', '提示', {
          dangerouslyUseHTMLString: true
        });
      }
    },

    // 删除用户评论回复
    onDeleteReply(id) {
      this.$confirm('确定删除该评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.isLoading = true;
          return commentAPI.deleteComments({ subId: id });
        })
        .then(() => {
          this.$message.success('删除成功');
          this.doSearch();
        })
        .catch(() => {
          this.isLoading = false;
        });
    },

    handleRemove(commentId) {
      this.$confirm('确定删除虚拟评论吗？', '删除评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.isLoading = true;
          commentAPI
            .deleteComment({
              commentId: commentId
            })
            .then(rs => {
              this.doSearch();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
            .catch(err => {
              console.error(err);
            })
            .always(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          console.log('取消删除虚拟评论');
        });
    }
  },
  filters: {
    format(time) {
      const date = new Date(time);
      return datetime.format(date, 'YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>
