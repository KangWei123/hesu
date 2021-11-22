<template>
  <list-page-layout class="app-list-container">
    <template #main-actions>
      <el-button type="primary" @click="handleAdd">+新建车牌号码</el-button>
    </template>

    <template #filters>
      <el-form ref="query" class="nav-form" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="手机号码" prop="memberPhone">
          <el-input
            class="w250"
            maxlength="20"
            v-model.trim="form.memberPhone"
            clearable
            placeholder="搜索手机号码"
          ></el-input>
        </el-form-item>

        <el-form-item label="车牌号码" prop="carNo">
          <el-input
            class="w250"
            maxlength="20"
            v-model.trim="form.carNo"
            clearable
            placeholder="搜索车牌号码"
          ></el-input>
        </el-form-item>

        <el-form-item label="车辆品牌" prop="carCategoryId">
          <el-select v-model="form.carCategoryIdList" class="w250" filterable multiple clearable>
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.carCategoryChnName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="绑定渠道" prop="bindingChannel">
          <el-select v-model="form.bindingChannel" class="w250" placeholder="请选择绑定渠道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item, index) in bindList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="bindingStatus" label="状态搜索">
          <el-select v-model="form.bindingStatus" class="w250" placeholder="请选择绑定状态">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item, index) in payStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-button @click="handleExport" class="export-btn">导出车牌</el-button>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="车牌号" prop="carNo">
        <template slot-scope="scope">
          <span class="default" v-if="scope.row.defaultStatus === 1">默认</span>
          <span>{{ scope.row.carNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="carCategoryName">
        <template slot-scope="scope">
          <div>{{ scope.row.carCategoryName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="绑定会员" prop="memberPhone" width="300px">
        <template slot-scope="scope">
          <user-info-field
            :avatar="scope.row.memberUserDTO && scope.row.memberUserDTO.avatarImgUrl"
            :name="scope.row.memberUserDTO && scope.row.memberUserDTO.nickname"
            :phone="scope.row.memberUserDTO && scope.row.memberUserDTO.phone"
          />
        </template>
      </el-table-column>
      <el-table-column label="绑定渠道">
        <template slot-scope="scope">
          <div>{{ scope.row.bindingChannel ? '用户绑定' : '后台添加' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="绑定时间" prop="bindingTime"></el-table-column>
      <el-table-column label="绑定状态" prop="bindingStatus">
        <template slot-scope="scope">
          <div>{{ scope.row.bindingStatus ? '已解绑' : '正常' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="解绑时间" prop="unboundTime">
        <template slot-scope="scope">
          <div>{{ scope.row.unboundTime || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="left" v-slot="scope">
        <table-actions :options="showButton(scope.row)" />
      </el-table-column>
    </fat-table>

    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">信息正在导出，请等候...</span>
    </el-dialog>
    <plate-dialog
      v-model="showDialog"
      v-if="showDialog"
      @saveSuccess="$refs.table.search()"
      :is-edit="isEdit"
      :edit-obj="editObj"
    />
  </list-page-layout>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park.js';
  import indexApi from '@/dss-wechat3rd/src/api/index.js';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import PlateDialog from './plate-dialog.vue';
  import { mapState } from 'vuex';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';

  export default {
    name: 'LicensePlate',
    components: { FatTable, ListPageLayout, TableActions, PlateDialog, UserInfoField },
    data() {
      return {
        showTipDialog: false,
        form: {
          carNo: null,
          memberPhone: null,
          carCategoryIdList: null,
          bindingChannel: null,
          bindingStatus: null,
        },
        payStatusList: [
          {
            label: '正常',
            value: 0,
          },
          {
            label: '已解绑',
            value: 1,
          },
        ],
        bindList: [
          {
            label: '后台添加',
            value: 0,
          },
          {
            label: '用户绑定',
            value: 1,
          },
        ],
        showDialog: false,
        isEdit: false,
        editObj: {},
        categoryList: [],
      };
    },

    computed: {
      ...mapState({
        curStore: 'curStore',
      }),

      showButton() {
        return row => {
          return !row.bindingStatus && !row.bindingChannel
            ? [
                { name: '编辑', onClick: () => this.handleEdit(row) },
                { name: '解绑', onClick: () => this.handleUnBind(row) },
              ]
            : [];
        };
      },
    },

    mounted() {
      this.getCarCategory();
    },

    methods: {
      handleAdd() {
        this.showDialog = true;
        this.isEdit = false;
      },

      reset() {
        this.form.carCategoryIdList = null;
        this.$refs.query.resetFields();
      },

      async getCarCategory() {
        const res = await parkApi.car_category_list();
        this.categoryList = res.data || [];
      },

      handleExport() {
        this.$confirm('确定导出车牌报表吗？', '导出车牌', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        })
          .then(() => {
            const params = {
              ...this.form,
            };
            this.showTipDialog = true;
            exportExcel
              .download(parkApi.exportCar, params, '车牌报表')
              .then(res => {
                this.$message({
                  message: '导出车牌报表成功，正在下载',
                  type: 'success',
                });
                this.showTipDialog = false;
              })
              .catch(err => {
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            this.$message.info('取消导出');
            this.showTipDialog = false;
          });
      },

      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...this.form,
        };
        const { data: list, totalCount: total } = await parkApi.car_queryList(params);
        return { list: list || [], total };
      },

      handleEdit(row) {
        this.showDialog = true;
        this.isEdit = true;
        this.editObj = row;
      },

      handleUnBind(row) {
        this.$confirm('请确认是否解绑？', '解绑', {
          cancelButtonText: '取消',
          confirmButtonText: '解绑',
          type: 'warning',
          customClass: 'wkt-warning',
          cancelButtonClass: 'wkt-custom-cancel',
          closeOnClickModal: false,
        })
          .then(() => {
            const params = {
              id: row.id,
            };
            parkApi
              .unbindingCar(params)
              .then(() => {
                this.$refs.table.search();
              })
              .catch(() => {});
          })
          .catch(() => {
            this.$message.info('取消解绑');
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .export-btn {
    margin: 20px 20px 0 20px;
  }

  .w250 {
    width: 250px;
  }

  .default {
    display: inline-block;
    border: 1px solid #fa7516;
    color: #fa7516;
    width: 40px;
    text-align: center;
    line-height: 22px;
    border-radius: 4px;
    margin-right: 5px;
  }
</style>
