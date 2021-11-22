<template>
  <div class="gift-area-list"
       v-loading="isLoading"
       :element-loading-text="msg.update">
    <div class="Add-Manage-Button"
           v-if="!isDelList">
        <el-button @click="onAdd"
                   type="primary">同步赠品</el-button>
    </div>

    <div class="gift-filter">
      <el-form @submit.native.prevent
               inline
               :model="filterParams" ref="filterParams"
               class="wkt-opt-label-container">
        <el-form-item label="活动名称：" prop="keyword">
          <el-input placeholder="搜索活动名称"
                    maxlength="80"
                    v-model.trim="filterParams.keyword"
                    @input="handleSearch"
                    clearable></el-input>
        </el-form-item>

        <el-form-item v-if="!isDelList" label="状态：" prop="status">
          <el-select clearable
                     v-model="filterParams.status"
                     placeholder="选择活动状态"
                     @change="handleStatus">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch"
                     class="search-btn"
                     type="primary">搜索</el-button>
          <el-button class="search-btn"
                     @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <span v-if="!isDelList" class="desc-tip">温馨提示：赠品信息需填写完毕后才会展示在小程序端哦～</span>
    </div>

    <div class="gift-list">
      <!-- 底部操作按钮 -->
      <div style="padding: 24px 0px 24px 20px;"
           v-if="!isDelList">
        <el-button :disabled="disableBatchButton"
                   @click="handleBatch(multipleSelection, 'setting')">批量设置</el-button>
      </div>
      <el-table :data="tableData"
                ref="multipleTable"
                style="width: 100%"
                class="wkt-table"
                @selection-change="handleSelectionChange"
                v-loading="listLoading">
        <el-table-column type="selection"
                         v-if="tableData && tableData.length && !isDelList"
                         :selectable="checkSelectable"
                         width="70"></el-table-column>
        <el-table-column width="200"
                         prop="name"
                         label="赠品名称"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.name}}{{scope.row.attrValCombineName ? '（' + scope.row.attrValCombineName + '）' : ''}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         width="110"
                         label="赠品图片">
          <template slot-scope="scope">
            <img class="mgr-img"
                 :src="scope.row.thumbnail" />
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="180"
                         label="活动时间">
          <template slot-scope="scope">
            <p>{{scope.row.startTime | fitTime}}</p>
            <p>{{scope.row.startTime ? '至': '-'}}</p>
            <p>{{scope.row.endTime | fitTime}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="levelName"
                         label="限领人群">
          <template slot-scope="scope">
            <span>{{scope.row.levelName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="everyoneLimitCount"
                         label="每人限领数量">
          <template slot-scope="scope">
            <span>{{scope.row.everyoneLimitCount===0?'无限制':scope.row.everyoneLimitCount}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="limitTotal"
                         label="限领总数">
          <template slot-scope="scope">
            <span>{{scope.row.limitTotal===0?'无限制':scope.row.limitTotal}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="receivedCount"
                         label="已领取数量" />

        <!-- <el-table-column align="center"
                         prop="deliveryCount"
                         label="已收货数量" /> -->

        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===giftEnum.status.pending">未开始</span>
            <span v-if="scope.row.status===giftEnum.status.going">进行中</span>
            <span v-if="scope.row.status===giftEnum.status.end">已结束</span>
            <span v-if="scope.row.status===giftEnum.status.del">已删除</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="methods"
                         label="操作"
                         v-if="!isDelList"
                         width="120px"
                         min-width="120">
          <template slot-scope="scope">
            <a @click="handleSettingGift([scope.row])">设置</a>
            <a @click="handleUpdateStatus([scope.row], giftEnum.status.del, false)"
               v-if="scope.row.status===giftEnum.status.pending || scope.row.status===giftEnum.status.end">删除</a>
            <a @click="handleUpdateStatus([scope.row], giftEnum.status.end, false)"
               v-if="scope.row.status===giftEnum.status.going">结束</a>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="methods"
                         label="操作"
                         v-else
                         min-width="80">
          <template slot-scope="scope">
            <a @click="handleShowDetail(scope.row)">详情</a>
          </template>
        </el-table-column>

      </el-table>
      
      <el-pagination
          v-if="totalCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="page.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalCount">
        </el-pagination>
    </div>

    <gift-select-dialog v-model="showDialog"
                        choose-sku
                        :selectedCoupons='[]'
                        :extParams='{}'
                        enable-multiple
                        @selected="onSelectGift" />

    <set-gift-dialog :gift-activity-id-list="settingList"
                     :all-member-list="allMemberList"
                     @done="getList(true)"
                     v-model="settingDialogShow" />
  </div>
</template>
<script>
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
import utils from '@/dss-common/utils/index';
import GiftSelectDialog from '@/dss-wechat3rd/src/bz_components/gift-select-dialog/index.vue';
import SetGiftDialog from './set-gift-dialog.vue';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import giftEnum from '@/dss-wechat3rd/src/constants/giftEnum.js';

const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据
export default {
  mixins: [tableCheckedHelperMixin],
  components: {
    GiftSelectDialog,
    SetGiftDialog
  },
  props: {
    isDelList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      giftEnum,
      filterParams: {
        keyword: null,
        status: this.isDelList ? giftEnum.status.del : null
      },
      msg: {
        update: ''
      },
      options: [
        {
          value: null,
          label: '所有状态'
        },
        {
          value: 0,
          label: '未开始'
        },
        {
          value: 1,
          label: '进行中'
        },
        {
          value: 2,
          label: '已结束'
        }
      ],
      allMemberList: null,
      multipleSelection: [], // 当前页面选中维护的分销选项
      tableData: [],
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      isLoading: false,
      listLoading: false,
      delItem: {},
      showDialog: false,
      settingDialogShow: false,
      settingList: null
    };
  },

  computed: {
    // 判断是否禁止底部批量操作按钮
    disableBatchButton() {
      return !(this.multipleSelection.length > 0 || this.mTotalCheckedList.length > 0); // 当前页选中操作的数据数组长度大于0
    },
    limitLevel() {
      return levelId => {
        if (levelId) {
          if (this.allMemberList) {
            const specLevel = this.allMemberList.find(level => {
              return level.id === levelId;
            });
            if (specLevel) {
              return specLevel.name;
            } else {
              return '';
            }
          } else {
            return '';
          }
        } else {
          return '';
        }
      };
    }
  },

  filters: {
    fitTime(value) {
      return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
    }
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchMemberLevelList();
      vm.getList(); // 获取列表
    });
  },

  methods: {
    //判断列表是否可选
    checkSelectable(row, index) {
      return row.status === giftEnum.status.pending;
    },
    /**
     * 改变商品列表选项
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 批量操作成功之后，清空之前选中的操作数据列表
     */
    emptyMultipleSelection() {
      // 清除之前已选中的状态，重新计算选中的item。
      this.multipleSelection = [];
      this.mResetCheckedData();
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
    },

    handleShowDetail(row) {
      this.$router.push({
        path: '/marketing/gift-special-area/delete/detail',
        query: {
          id: row.id
        }
      });
    },
    /**
     * 删除商品
     */
    handleUpdateStatus(itemList = [], updateStatus, isPatch = false) {
      let confirmText = '';
      let confirmBtnText = '';
      switch (updateStatus) {
        case giftEnum.status.del:
          confirmText = '确认删除赠品?';
          confirmBtnText = '删除赠品';
          break;
        case giftEnum.status.end:
          confirmText = '确认结束活动?';
          confirmBtnText = '结束活动';
          break;
      }
      this.$confirm(confirmText, confirmBtnText, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let disItemIdList = itemList.map(item => {
            return item.id;
          });

          const params = {
            idList: disItemIdList,
            status: updateStatus
          };

          this.loading = true;
          giftApi
            .updateStatus(params)
            .done(res => {
              if (res.data) {
                if (isPatch) {
                  this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
                }

                this.page.pageNo = 1;
                this.getList(); // 查询分销商品列表
              }
            })
            .always(res => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },

    /**
     * 设置商品佣金：显示佣金设置对话弹框
     */
    handleSettingGift(itemList) {
      this.settingDialogShow = true; // 显示赠品专区设置对话弹框
      this.settingList = itemList; // 设置赠品专区列表
    },

    /**
     * 批量操作
     */
    handleBatch(itemList, type) {
      // 每次批量操作时，主动触发一次计算全部选择的列表
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);

      // 批量操作时，将所有被选中的列表list数据：mTotalCheckedList作为全部选择的参数
      itemList = this.mTotalCheckedList;
      if (type === 'setting') {
        this.handleSettingGift(itemList); //设置商品佣金
      } else {
        this.handleUpdateStatus(itemList, giftEnum.status.del, true); // 删除商品
      }
    },
    getList(clearSelectedItems = false) {
      if (clearSelectedItems) {
        this.emptyMultipleSelection();
      }
      this.listLoading = true;
      // 获取数据之前，需要重新计算一次选中的item
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
      giftApi
        .listActivity({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          keyword: this.filterParams.keyword,
          inStatusList:
            this.filterParams.status !== null
              ? [this.filterParams.status]
              : [giftEnum.status.pending, giftEnum.status.going, giftEnum.status.end]
        })
        .then(res => {
          this.tableData = res.data || [];
          // 成功获取数据之后，重新构建pageList的选中状态
          this.mBuildMultipleTableSelection(this.tableData, 'multipleTable', unionKeys);
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.error('活动列表err', err);
        })
        .always(() => {
          this.listLoading = false;
        });
    },

    onSelectGift(row) {
      let simpGiftDTOList = [];
      row.forEach((item, index) => {
        simpGiftDTOList.push({
          giftNo: item.giftNo,
          name: item.name,
          thumbnail: item.thumbnail,
          barcode: item.barcode,
          attrValCombineName: item.attrValCombineName
        });
      });
      let params = { simpGiftJson: JSON.stringify(simpGiftDTOList) };
      giftApi
        .batchSyncGift(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getList();
        })
        .catch(err => {});
    },

    handleSearch() {
      this.page.pageNo = 1;
      this.getList();
    },
    handleStatus(e) {
      this.page.pageNo = 1;
      this.getList();
    },
    onAdd() {
      this.showDialog = true;
    },

    onDetail(row) {
      console.log(row);
      this.$router.push({
        path: '/marketing/gift-special-area/list/add',
        query: {
          id: row.id,
          status: row.status,
          itemNo: row.itemNo
        }
      });
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
    fetchMemberLevelList() {
      giftApi.getLevelSimplyList().then(res => {
        if (res.data && res.data.length) {
          this.allMemberList = res.data.map(item => {
            return { id: item.id, name: item.levelName };
          });
        } else {
          this.allMemberList = [];
        }
      });
    },
    handleReset() {
      this.$refs.filterParams.resetFields();
      this.getList();
    }
  }
};
</script>
<style lang="less">
.gift-area-list {
  // padding: 0 20px;
  .el-dialog__body {
    text-align: left;
    .store-item-box {
      .el-tag {
        margin-right: 10px;
      }
    }
  }
  .switch-container {
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  .title {
    height: 50px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 50px;
  }

  .gift-list {
    .bg-mixin;
    padding-bottom: 20px;
    border-radius: 4px;
    margin-top: 16px;

    .el-table {
      padding-top: 0px;
      // th.is-leaf {
      //   border-top: none;
      // }
    }
  }

  .gift-filter {
    .bg-mixin;
    padding-left: 20px;
    border-radius: 0px 0px 4px 4px;

    .el-form-item__label {
      color: @ui-font-color-darkGrey;
    }
    .wkt-opt-label-container {
      box-shadow: none;
      .el-form-item {
        margin-bottom: 10px;
      }
    }
    .desc-tip {
      margin-bottom: 16px;
      display: inline-block;
    }

    // .gift-box {
    //   position: absolute;
    //   top: 30px;
    //   right: 20px;
    // }
  }

  .el-table .cell {
    text-align: left;
  }

  .el-table .disabled-qrcode {
    color: #ccc;
    cursor: no-drop;
  }

  .el-table .disabled-qrcode:hover {
    color: #ccc;
    cursor: no-drop;
  }

  .el-switch.is-disabled .el-switch__core,
  .el-switch.is-disabled .el-switch__label {
    cursor: pointer;
  }

  .mgr-img {
    width: 65px;
    height: 65px;
  }
}

.switch-container {
  .el-switch.is-disabled {
    opacity: 1;
  }
}
</style>
