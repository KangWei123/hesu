<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    custom-class="diy-dialog"
    width="35%"
    :before-close="handleClose"
  >
    <div class="selector">
      <span>选择{{ storeLabel }}：</span>
      <el-select style="width: 122px" v-model="filter.isOpen" @change="filterChange" clearable placeholder="全部状态">
        <el-option label="营业" :value="1"></el-option>
        <el-option label="打烊" :value="0"></el-option>
      </el-select>
      <el-input
        placeholder="关键字搜索"
        style="width: 30%"
        @keyup.enter.native="search"
        v-model="filter.storeName"
      ></el-input>
      <br />
      <p class="store-area" v-if="showAreaFilter">
        <el-button round style="margin-top: 10px" @click="openCitySelect">选择门店区域</el-button>
        <span v-if="selectedCityStr" style="width: 70%">门店区域：{{ selectedCityStr }}</span>
      </p>
    </div>
    <el-table
      :data="copyStoreList"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @select="selectChange"
      @select-all="selectAll"
      ref="multipleTable"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="name" :label="storeLabel"> </el-table-column>
    </el-table>
    <el-button round style="margin-top: 10px" @click="allChoose">{{ !isClickAll ? '取消全选' : '一键全选' }}</el-button>
    <el-pagination
      class="wkt-pagination"
      @size-change="onPageSizeChange"
      @current-change="onPageNumChange"
      :current-page="pageNo"
      :page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      layout="prev, pager, next, jumper, sizes, total"
      v-if="totalCount"
      :total="totalCount"
    >
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
    <CitySelect ref="citySelect" :selected-areas="selectedCity" @choosed="onAreasChoosed"></CitySelect>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import CitySelect from './city-select-dialog';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import * as storeApi from '@/mod-console/src/api/storeApi';

  const unionKeys = ['id'];
  export default {
    name: 'ChooseStore',
    mixins: [tableCheckedHelperMixin],
    components: {
      CitySelect,
    },
    data() {
      return {
        dialogVisible: false,
        copyStoreList: [],
        totalCount: 0,
        pageNo: 1,
        pageSize: 5,
        filter: {
          isOpen: null,
          storeName: null,
          storeIdList: [],
        },
        selectedCity: [],
        selectedCityStr: '',
        selectedItems: [],
        isClickAll: true,
        flag: false,
        unionKeys,
        loading: false,
        allStoreList: [],
      };
    },
    mounted() {
      /* this.copyStoreList = this.storeList
       this.totalCount = this.copyStoreList.length */
    },
    methods: {
      search() {
        this.getStoreList();
      },
      filterChange() {
        this.getStoreList();
      },
      open(val) {
        this.dialogVisible = true;
        this.mTotalCheckedList = [...val];
        this.allStoreList = [...val];
        this.mBuildMultipleTableSelection(this.copyStoreList, 'multipleTable', this.unionKeys);
        this.getStoreList();
      },
      getStoreList() {
        this.mUpdateTotalListBySelection(this.copyStoreList, this.allStoreList, this.unionKeys);
        this.loading = true;
        storeApi
          .getStoreList({
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            ...this.filter,
          })
          .then(res => {
            this.copyStoreList = res.data;
            this.totalCount = res.totalCount;
            this.mBuildMultipleTableSelection(this.copyStoreList, 'multipleTable', this.unionKeys);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      close() {
        this.dialogVisible = false;
      },
      cancel() {
        this.$emit('get-dom-element', { refMultipleTable: this.$refs.multipleTable });
        this.close();
      },
      confirm() {
        this.mUpdateTotalListBySelection(this.copyStoreList, this.allStoreList, this.unionKeys);
        this.$emit('get-store', { allStoreList: this.allStoreList, refMultipleTable: this.$refs.multipleTable });
        this.close();
      },
      handleClose() {
        this.close();
      },
      // 大小变化
      onPageSizeChange(val) {
        this.pageSize = val;
        this.pageNo = 1;
        this.savaChoose();
        this.getStoreList();
      },
      // 页码
      onPageNumChange(val) {
        this.pageNo = val;
        this.savaChoose();
        this.getStoreList();
      },
      // 非全选状态的缓存
      savaChoose() {
        this.mUpdateTotalListBySelection(this.copyStoreList, this.allStoreList, this.unionKeys);
        this.mBuildMultipleTableSelection(this.copyStoreList, 'multipleTable', this.unionKeys);
      },
      // 打开门店区域选择框
      openCitySelect() {
        console.log(this.isClickAll);
        if (!this.isClickAll) {
          this.allChoose();
        }
        this.pageNo = 1;
        this.$refs.citySelect.open();
      },
      onAreasChoosed(val) {
        if (val && val.length) {
          this.selectedCity = val;
          let storeIdList = [];
          let cityStr = '';
          const fliterArr = [];
          this.selectedCity.forEach((item, index) => {
            storeIdList = storeIdList.concat(item.storeIdList);
            if (index < val.length - 1) {
              cityStr += item.regionName + '，';
            } else {
              cityStr += item.regionName;
            }
          });
          this.filter.storeIdList = storeIdList;
          this.selectedCityStr = cityStr;
          this.storeList.forEach(item => {
            storeIdList.forEach(i => {
              if (item.id === i) {
                console.log(item);
                fliterArr.push(item);
              }
            });
          });
          if (this.filter.storeIdList && this.filter.storeIdList.length) {
            this.filter.storeIdList.forEach((item, index) => {
              this.filter['storeIds[' + index + ']'] = item;
            });
          }
          delete this.filter.storeIdList;
          this.getStoreList();
        } else {
          console.log(this.filter);
          for (const i in this.filter) {
            if (i.match('storeIds')) {
              delete this.filter[`${i}`];
            }
          }
          console.log(this.filter);
          this.selectedCity = null;
          this.filter.storeIdList = null;
          this.selectedCityStr = '';
          this.getStoreList();
        }
      },
      // 一键全选
      allChoose() {
        this.isClickAll = !this.isClickAll;
        this.getAllDataList();
      },

      getAllDataList() {
        this.allStoreList = [];
        this.mUpdateTotalListBySelection(this.copyStoreList, this.allStoreList, this.unionKeys);
        if (!this.isClickAll) {
          this.loading = true;
          storeApi
            .getStoreList({
              pageNo: 1,
              pageSize: 3000,
              ...this.filter,
            })
            .then(res => {
              this.selectedItems = res.data;
              this.allStoreList = res.data;
              this.totalCount = res.totalCount;
              this.mBuildMultipleTableSelection(this.copyStoreList, 'multipleTable', this.unionKeys);
              this.mUpdateTotalListBySelection(this.copyStoreList, this.allStoreList, this.unionKeys);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          // 清空之前所有的选中状态
          this.mResetCheckedData();
          this.selectedItems = [];
          this.allStoreList = [];
          this.mBuildMultipleTableSelection(this.copyStoreList, 'multipleTable', this.unionKeys);
          this.mUpdateTotalListBySelection(this.copyStoreList, this.allStoreList, this.unionKeys);
        }
      },
      handleSelectionChange(val) {
        this.selectedItems = val;
      },
      selectChange(val, row) {
        const index = this.allStoreList.findIndex(e => e.id === row.id);
        const oldArr = this.allStoreList.filter(e => e.id === row.id);
        if (this.allStoreList.find(e => e.id === row.id)) {
          this.allStoreList.splice(index, 1);
        } else {
          this.allStoreList.push(row);
        }
        if (!val) {
          this.allStoreList.push(...oldArr);
        }
      },
      selectAll(selection) {
        if (selection.length) {
          selection.forEach(item => {
            this.selectChange(null, item);
          });
        } else {
          for (let len = this.allStoreList.length, i = len - 1; i >= 0; i--) {
            if (this.copyStoreList.find(e => e.id === this.allStoreList[i].id)) {
              this.allStoreList.splice(i, 1);
            }
          }
        }
      },
    },
    computed: {
      ...mapState({
        curStore: 'curStore',
        curApp: 'curApp',
        storeList: 'storeList',
        env: 'env',
      }),
      storeLabel() {
        return this.env.ESTATE ? '区域' : '门店';
      },
      showAreaFilter() {
        return !this.env.ESTATE;
      },
      isEdit() {
        return false;
      },
    },
  };
</script>

<style scoped lang="less">
  .store-area {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }

  .el-dialog__wrapper {
    /deep/ .diy-dialog {
      min-width: 670px;
    }
  }
</style>
