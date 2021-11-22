<template>
  <WkbPageNav page-name="经销商商户号">
    <div class="sorting-area-list" v-loading="isLoading" :element-loading-text="msg.update">
      <div class="switch-container">
        <span class="title">经销商出入账模式</span>
        <el-switch
          class="wkt-switch"
          v-model="switchStatus"
          @click.native="handleSwitch(switchStatus)"
          disabled
          :width="53"
          :active-value="1"
          :inactive-value="0"
          active-color="#3879FB"
          inactive-color="#DCDDE0"
          active-text="启用"
          inactive-text="关闭"
        ></el-switch>
        <span class="title-tip">开启后，经销商门店订单金额将入账经销商商户号，直营门店订单金额入账总部商户号；且支持经销商订单分账给品牌总部，设置品牌分账比例</span>
      </div>

      <div class="sort-filter">
        <el-input
          style="width:250px"
          placeholder="请输入门店名称"
          size="mini"
          maxlength="80"
          v-model.trim="storeName"
          @input="handleSearchAll"
          clearable
        ></el-input>

        <!-- <el-button @click="handleSearch"
                  class="search-btn"
                  size="mini"
        type="primary">搜索</el-button>-->

        <el-button @click="handleSearchAll" class="search-btn" size="mini" type="primary">搜索</el-button>
      </div>

      <div class="container">
        <!-- 供应商列表 -->
        <div class="dealer-list" v-if="dealerList&&dealerList.length">
          <el-scrollbar style="height:100%" class="scrollbar">
            <div
              v-for="item in dealerList"
              :key="item.id"
              class="dealer-item"
              :class="dealerObj.dealerId === item.dealerId?'checked':''"
              @click="dealerClick(item)"
            >
              <span class="dealerName">{{item.dealerName}}</span>
              ({{item.storeCount||0}})
            </div>
          </el-scrollbar>
        </div>

        <div class="sort-list" :class="dealerList&&dealerList.length?'sort-left':''">
          <div class="dealer-title" v-if="dealerObj&&dealerObj.dealerName">
            <span>{{dealerObj.dealerName}}（{{dealerObj.storeCount||0}}）</span>
            <el-button type="primary" v-if="dealerObj.dealerId > 0" @click="handleMchId">经销商设置</el-button>
<!--            <el-button type="primary" v-if="dealerObj.dealerId > 0" @click="handleDelete">移除经销商设置</el-button>-->
          </div>
          <el-table
            :data="tableData"
            :stripe="true"
            ref="multipleTable"
            :header-cell-style="{background:'#fafafa'}"
            style="width: 100%;margin-top:0"
            class="wkt-table"
            v-loading="listLoading"
          >
            <!-- <el-table-column type="selection"
                          v-if="tableData && tableData.length"
            width="70"></el-table-column>-->
            <el-table-column prop="name" label="门店名称" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.storeName}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="商户号">
              <template slot-scope="scope">
                <span>{{scope.row.mchId?scope.row.mchId:'同企业商户号'}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.mchId">{{scope.row.commissionPercent}}%</span>
                <span v-else>不需分账</span>
              </template>
              <div slot="header">
                品牌分账比例
                <el-popover
                  placement="bottom-start"
                  trigger="hover"
                  content="经销商订单收入按比例给总部商户号"
                  v-model="visiable"
                >
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </div>
            </el-table-column>

            <el-table-column align="center" label="地址">
              <template slot-scope="scope">
                <span>{{scope.row.address }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="levelName" label="店长">
              <template slot-scope="scope">
                <div>{{scope.row.ownerName}} {{scope.row.ownerPhone}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="methods" label="操作">
              <template slot-scope="scope">
                <a class="table-href" @click="handleSettingGift([scope.row])">设置</a> 
              </template>
            </el-table-column>
          </el-table>
          <!-- 底部操作按钮 -->
          <!-- <div style="margin-top: 15px"
            >
          <el-button type="primary"
                    :disabled="disableBatchButton"
                    @click="handleBatch(multipleSelection)">批量设置</el-button>
          </div>-->
          <el-pagination
            layout="prev, pager, next, jumper, sizes, total"
            :total="totalCount"
            :page-size="page.pageSize"
            :current-page="page.pageNo"
            :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            @size-change="onSizeChange"
            @current-change="onPageChange"
          ></el-pagination>
        </div>
      </div>

      <!-- 选择门店弹框 -->
      <!-- <store-select-dialog :selected-stores="selectedStoresList"
                         enable-multiple
                         api-url="/wp/store/query_list"
                         :is-all="true"
                         v-model="showStoreDialog"
      @choosed="onStoreChoosed"></store-select-dialog>-->

      <set-dealer-dialog
        :dealerObj="dealerObj"
        @done="getList(true)"
        v-model="setDealerDialogShow"
      />

      <set-sorting-dialog
        :storeIdList="settingList"
        @done="getList(true)"
        v-model="settingDialogShow"
      />
    </div>
  </WkbPageNav>
</template>
<script>
import sortingApi from '@/dss-setting/src/api/sorting';
import utils from '@/dss-common/utils/index';
import SetSortingDialog from './set-sorting-dialog.vue';
import SetDealerDialog from './set-dealer-dialog.vue';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import giftEnum from '@/dss-wechat3rd/src/constants/giftEnum.js';
// import storeSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import store from '@/business-common/store.js';
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import { mapState } from 'vuex';

const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据
export default {
  mixins: [tableCheckedHelperMixin],
  components: {
    SetSortingDialog,
    SetDealerDialog,
    WkbPageNav
  },
  data() {
    return {
      giftEnum,
      storeName: null,
      msg: {
        update: ''
      },
      switchStatus: 0,
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
      // showStoreDialog: false,
      selectedStoresList: [],
      settingDialogShow: false,
      setDealerDialogShow: false,
      settingList: null,
      dealerList: [],
      dealerObj: {},
      visiable: false
    };
  },

  computed: {
    // 判断是否禁止底部批量操作按钮
    disableBatchButton() {
      return !(this.multipleSelection.length > 0 || this.mTotalCheckedList.length > 0); // 当前页选中操作的数据数组长度大于0
    },
    ...mapState({
      curApp: 'curApp',
      roleList: 'roleList'
    }),
    //是否企业管理员
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.split(',').indexOf('common_role_enterprise') !== -1;
    }
  },

  filters: {
    fitTime(value) {
      return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
    }
  },
  mounted() {
    if (!!this.curApp.useClearing || this.curApp.useClearing === 0) {
      this.switchStatus = this.curApp.useClearing;
    }
    this.getDealerList();
  },

  methods: {
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
     * 移除经销商设置
     */
    handleDelete(id) {
      this.$confirm(
        '确认移除设置？移除后，所有使用了经销商商户号的门店将会同步移除商户号及分账比例。',
        '移除经销商设置',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning'
        }
      )
        .then(() => {
          const params = {
            dealerId: this.dealerObj.dealerId
          };
          this.loading = true;
          sortingApi
            .dis_delete(params)
            .done(res => {
              this.getList();
              this.$message.success('删除成功');
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
    handleMchId() {
      this.setDealerDialogShow = true; // 显示赠品专区设置对话弹框
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
    handleBatch(itemList) {
      // 每次批量操作时，主动触发一次计算全部选择的列表
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);

      // 批量操作时，将所有被选中的列表list数据：mTotalCheckedList作为全部选择的参数
      itemList = this.mTotalCheckedList;
      this.handleSettingGift(itemList); //设置商品佣金
    },

    getList() {
      this.listLoading = true;
      // 获取数据之前，需要重新计算一次选中的item
      // this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        storeName: this.storeName,
        dealerId: this.dealerObj.dealerId ? this.dealerObj.dealerId : null
      };

      sortingApi
        .dealer_store_setting(params)
        .then(res => {
          this.tableData = res.data || [];
          // 成功获取数据之后，重新构建pageList的选中状态
          // this.mBuildMultipleTableSelection(this.tableData, 'multipleTable', unionKeys);
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.error('活动列表err', err);
        })
        .always(() => {
          this.listLoading = false;
        });
    },

    /**
     * 完成门店选择
     */
    onStoreChoosed(storeList) {
      if (!storeList || storeList.length < 1) {
        this.$message.error('请选择上下架的门店');
        return;
      }

      this.selectedStoresList = storeList;
      this.batchToggleAdd(); // 门店选择
    },

    /**
     * 完成门店选择
     */
    batchToggleAdd() {
      let list = [];
      list = this.selectedStoresList.map(item => {
        return {
          storeId: item.id,
          storeName: item.name,
          ownerName: item.ownerName,
          ownerPhone: item.ownerTel,
          address: item.address
        };
      });

      sortingApi
        .batchAdd(list)
        .then(res => {
          this.selectedStoresList = [];
          this.getList();
        })
        .catch(err => {});
    },

    handleSearch() {
      this.page.pageNo = 1;
      this.getList(true);
    },

    handleSearchAll() {
      this.dealerObj = {};
      this.page.pageNo = 1;
      this.getList(true);
    },

    handleStatus(e) {
      this.page.pageNo = 1;
      this.getList();
    },

    onAdd() {
      this.showStoreDialog = true;
    },

    onDetail(row) {
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

    handleSwitch(switchStatus) {
      let msgTitle = null;
      let msgContent = null;
      let status = 0;

      if (switchStatus === 0) {
        msgContent = '确定开启清分功能吗?';
        msgTitle = '请确定开启清分功能';
        status = 1; // 开启状态
      } else {
        msgContent = '确定关闭清分功能吗?';
        msgTitle = '请确定关闭清分功能';
        status = 0; // 关闭状态
      }

      this.$confirm(msgTitle, msgContent, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleSwitchUpdate(status);
        })
        .catch(() => {});
    },

    handleSwitchUpdate(status) {
      const params = {
        useClearing: status
      };
      sortingApi
        .clearing(params)
        .then(res => {
          if (!res.data) {
            return;
          }
          this.$message.success('操作成功');
          this.switchStatus = status;
          this.curApp.useClearing = status;
          store.commit('update_curApi', this.curApp);
        })
        .catch(err => {
          console.error('积分商城设置err', err);
        });
    },

    //获取供应商列表
    getDealerList() {
      sortingApi
        .queryDealerStoreTree({})
        .then(res => {
          this.dealerList = res.data;
          if (res.data) {
            this.dealerObj = res.data[0];
          }
          this.getList();
        })
        .always(() => {});
    },

    dealerClick(item) {
      this.storeName = null;
      this.dealerObj = item;
      this.page.pageNo = 1;
      this.getList();
    }
  }
};
</script>
<style lang="less">
.scrollbar /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.sorting-area-list {
  background: white;
  .switch-container {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #ffffff;
    .title {
      margin-right: 20px;
      color: #000000;
      font-size: 16px;
    }
    .title-tip {
      margin-left: 15px;
      color: #999;
      font-size: 14px;
    }
  }
  .title-box {
    padding: 0 20px;
    background-color: #fff;
    padding-bottom: 10px;
  }
  .tip {
    margin-bottom: 10px;
  }

  .container {
    padding: 0;
    padding: 20px 20px 20px 20px;
  }

  .dealer-list {
    vertical-align: top;
    float: left;
    width: 200px;
    border: 1px solid #dcdee0;
    box-sizing: border-box;
    height: 680px;
    overflow-y: auto;
    .dealer-item {
      padding: 0 20px;
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #dcdee0;
      display: flex;
      .dealerName {
        display: inline-block;
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    // .dealer-item:last-child{
    //   border-bottom: none;
    // }
    .checked {
      background: #f2f4f7;
    }
  }

  .sort-left {
    margin-left: 220px;
  }

  .sort-list {
    vertical-align: top;
    background: white;
    border-radius: 4px;
    .dealer-title {
      font-size: 16px;
      line-height: 31px;
      margin-bottom: 20px;
      span {
        margin-right: 10px;
      }
    }
  }

  .sort-filter {
    position: relative;
    padding: 0px 20px 0 20px;
    display: inline-flex;
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
