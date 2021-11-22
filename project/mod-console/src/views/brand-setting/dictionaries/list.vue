<template>
  <div class="dictionaries-area-list" v-loading="isLoading" :element-loading-text="msg.update">
    <div class="dictionaries-filter"></div>

    <div class="flex-box">
      <div class="dictionaries-list">
        <div class="title-box">字典列表</div>
        <el-table
          :data="dictionariesData"
          ref="multipleTable"
          :header-cell-style="{ background: '#fafafa' }"
          style="width: 100%"
          class="wkt-table"
          v-loading="listLoading"
          @row-click="rowClick"
          :row-style="rowStyle"
        >
          <el-table-column prop="name" label="名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="dictionaries-detail">
        <div class="title-box">
          字典详情
          <el-button style="float: right" v-if="dictionaryId" @click="onAdd" round type="primary" size="mini"
            >新增</el-button
          >
        </div>
        <div class="empty" v-if="!dictionaryId"><span>!</span>请点击字典查看详情</div>
        <el-table
          v-else
          :data="tableData"
          :stripe="true"
          ref="multipleTable"
          :header-cell-style="{ background: '#fafafa' }"
          style="width: 100%"
          class="wkt-table"
          v-loading="listLoading"
        >
          <el-table-column prop="name" label="所属字典" :show-overflow-tooltip="true">
            <template>
              <span>{{ dictionaryName }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="字典标签">
            <template slot-scope="scope">
              <span>{{ scope.row.dictionaryLabel }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="order" label="排序">
            <template slot-scope="scope">
              <div>{{ scope.row.order }}</div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="methods" label="操作">
            <template slot-scope="scope">
              <i class="el-icon-edit font-icon" @click="handleSettingGift(scope.row)"></i>
              <i class="el-icon-delete font-icon" @click="handleDelete(scope.row.id)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next, jumper, sizes, total"
          v-if="dictionaryId"
          :total="totalCount"
          :page-size="page.pageSize"
          :current-page="page.pageNo"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        ></el-pagination>
      </div>
    </div>

    <dictionaries-dialog :data="currentObj" @done="getList(true)" v-model="settingDialogShow" />
  </div>
</template>
<script>
  import dictionariesApi from '@/mod-console/src/api/brand-setting/dictionaries';
  import utils from '@/dss-common/utils/index';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import dictionariesEnum from '@/mod-console/src/constants/dictionariesEnum.js';
  import store from '@/business-common/store.js';
  import { mapState } from 'vuex';
  import dictionariesDialog from './dictionaries-dialog.vue';
  import { StoreSelectDialog } from '@/register/wechat3rd';

  const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据
  export default {
    mixins: [tableCheckedHelperMixin],
    components: {
      StoreSelectDialog,
      dictionariesDialog,
    },
    data() {
      return {
        dictionariesEnum,
        filterParams: {
          keyword: null,
        },
        msg: {
          update: '',
        },
        tableData: [],
        dictionariesData: [],
        page: {
          pageSize: 10,
          pageNo: 1,
        },
        dictionaryId: null,
        dictionaryName: null,
        totalCount: 0,
        isLoading: false,
        listLoading: false,
        delItem: {},
        settingDialogShow: false,
        currentObj: {},
      };
    },

    computed: {
      // 判断是否禁止底部批量操作按钮
      disableBatchButton() {
        return !(this.multipleSelection.length > 0 || this.mTotalCheckedList.length > 0); // 当前页选中操作的数据数组长度大于0
      },
      ...mapState({
        curApp: 'curApp',
      }),
    },

    filters: {
      fitTime(value) {
        return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.queryList(); // 获取列表
      });
    },

    mounted() {},

    methods: {
      /**
       * 删除
       */
      handleDelete(id) {
        this.$confirm('确认删除字典?', '删除字典', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const params = {
              id: id,
            };
            this.loading = true;
            dictionariesApi
              .delete(params)
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
       * 字典标签弹窗
       */
      handleSettingGift(row) {
        this.currentObj = row;
        this.currentObj.dictionaryName = this.dictionaryName;
        this.settingDialogShow = true;
      },

      getList() {
        this.listLoading = true;
        const params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          dictionaryId: this.dictionaryId,
        };
        dictionariesApi
          .label_list(params)
          .then(res => {
            this.tableData = res.data || [];
            this.totalCount = res.totalCount;
          })
          .catch(err => {
            console.error('活动列表err', err);
          })
          .always(() => {
            this.listLoading = false;
          });
      },

      queryList() {
        this.listLoading = true;
        const params = {
          pageNo: 1,
          pageSize: 10,
        };
        dictionariesApi
          .queryList(params)
          .then(res => {
            this.dictionariesData = res.data || [];
          })
          .catch(err => {
            console.error('活动列表err', err);
          })
          .always(() => {
            this.listLoading = false;
          });
      },

      rowClick(row) {
        this.dictionaryId = row.id;
        this.dictionaryName = row.name;
        this.getList();
      },

      rowStyle({ row, rowIndex }) {
        if (row.id === this.dictionaryId) {
          return 'background:rgb(245,247,250)';
        } else {
          return '';
        }
      },

      onAdd() {
        this.currentObj = {
          dictionaryId: this.dictionaryId,
          dictionaryName: this.dictionaryName,
        };
        this.settingDialogShow = true; // 显示对话弹框
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
    },
  };
</script>
<style lang="less">
  .dictionaries-area-list {
    background: #ffffff;
    margin: 0 10px;
    .switch-container {
      display: flex;
      align-items: center;
      padding: 20px;
      background: #ffffff;
    }
    .title-box {
      background-color: #fff;
    }
    .flex-box {
      overflow: hidden;
    }

    .font-icon {
      font-size: 18px;
      margin-right: 10px;
      cursor: pointer;
    }

    .dictionaries-list {
      vertical-align: top;
      display: inline-block;
      box-sizing: border-box;
      width: 33%;
      padding: 20px 20px;
      background: white;
      border-radius: 4px;
    }

    .dictionaries-detail {
      display: inline-block;
      width: 65%;
      box-sizing: border-box;
      padding: 20px 20px;
      background: white;
      vertical-align: top;
    }

    .dictionaries-filter {
      position: relative;

      .el-input__inner {
        border-radius: 4px 0 0 4px;
      }

      .dictionaries-box {
        position: absolute;
        top: 30px;
        right: 20px;
      }
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

  .empty {
    margin-top: 120px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #a8a8a8;
    span {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      background: #fa6b46;
      color: #ffffff;
      text-align: center;
      border-radius: 100%;
      margin-right: 11px;
    }
  }
</style>
