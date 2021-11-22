<template>
  <!-- :api-url="apiUrl" -->
  <table-select-dialog
    v-model="mShowDialog"
    class="app-select-dialog"
    title="选择项目"
    :enable-multiple="enableMultiple"
    :columns="columns"
    :columns-handler="enableMultiple ? null : columnsHandler"
    :api-url="handleRequest"
    :selected-list="selectedLists"
    :union-keys="['id']"
    :query-params="allQueryParams"
    :data-list="storeList"
    :limit="limit"
    @choose="onChoosed"
  >
    <div slot="filter" class="app-filter">
      <div class="app-box">
        {{ queryParams.appName }}
      </div>
      <span class="filter-title" style="margin-right: 10px">项目名称：</span>
      <el-input
        class="filter-input"
        v-model.trim="filter.name"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        maxlength="30"
        @input="onFilter"
        style="width: 200px"
      />
      <template>
        <span class="filter-title" style="margin: 0 10px">项目区域：</span>
        <el-cascader
          expand-trigger="hover"
          @active-item-change="onAreaChange"
          :options="areas"
          placeholder="请选择省/市/区"
          :props="{ label: 'name', value: 'id', children: 'childNode' }"
          v-model="filter.area"
          separator="-"
          clearable
        />
      </template>
      <el-button type="primary" style="margin-left: 60px" @click="onFilter">搜索</el-button>
    </div>
  </table-select-dialog>
</template>

<script>
  import TableSelectDialog from '@/business-common/components/table-select-dialog/index.vue';
  import ChooseColumn from '@/business-common/components/table-select-dialog/common-component/chooseBtn.vue';
  import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
  import columnsConfig from './columns';
  import { sharedStoreApi, sharedAppApi } from '@/business-common/api';
  import { getAppList } from '@/business-common/api/regionApi';
  import api from '@/dss-wechat3rd/src/api/supplier';
  const areaApi = api.area;

  export default {
    name: 'AppSelectDialog',
    mixins: [dialogMixin],
    components: {
      TableSelectDialog,
    },
    props: {
      limit: {
        type: Number,
        default: 0,
      },
      selectedLists: {
        type: Array,
        default: function () {
          return [];
        },
      },
      enableMultiple: {
        type: Boolean,
        default: true,
      },
      extParams: {
        type: Object,
        default: function () {
          return {};
        },
      },
      checkFunction: {
        type: Function,
        default() {
          return true;
        },
      },
    },
    data() {
      const columns = columnsConfig.default;

      // TODO:添加请求地址
      const url = '';

      return {
        columns,
        columnsHandler: cols => {
          const that = this;
          return cols.concat({
            align: 'left',
            sortable: false,
            component: ChooseColumn,
            listeners: {
              'choose-item'(item) {
                if (!that.checkFunction(item)) return false;
                that.$emit('single-choosed', item);
                that.mShowDialog = false;
              },
            },
          });
        },
        curAppId: this.extParams.appId,
        apiUrl: url,
        areas: [],
        filter: {
          name: null,
          app: null,
          area: [],
        },
        queryParams: {},
        selectStores: [],
        appList: [],
        storeList: [],
      };
    },
    computed: {
      allQueryParams() {
        return { ...this.queryParams, ...(this.extParams || {}) };
      },
    },
    watch: {
      extParams: {
        deep: true,
        handler(newVal, oldVal) {
          this.queryParams.appId = newVal.appId;
          this.onFilter();
          getAppList().then(res => {
            res.data.forEach(item => {
              if (item.id === newVal.appId) {
                this.queryParams.appName = item.appName;
              }
            });
          });
        },
      },
    },
    mounted() {
      sharedAppApi.listAllApp().then(res => {
        this.appList = res.data;
      });
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.filter.area);
      });
    },
    methods: {
      checkAppName(appId) {
        let appName = '';
        for (let i = 0; i < this.appList.length; i++) {
          const item = this.appList[i];
          if (item.id === appId) {
            appName = item.appName;
            break;
          }
        }
        return appName;
      },
      async handleRequest(params) {
        // console.log('params====:', params);
        // this.queryParams.appId = this.extParams.appId;
        const result = await sharedStoreApi.stroeQuery(params);
        const list = result.data;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          item.area = item.province + item.city + item.district;
          item.storeId = this.checkAppName(item.appId);
          item.appName = this.checkAppName(item.appId);
          list.splice(i, 1, item);
        }
        result.data = list;
        this.storeList = list;
        return result;
      },
      onFilter() {
        const filter = {};
        if (this.filter.area.length !== 0) {
          filter.provinceId = this.filter.area[0];
          filter.cityId = this.filter.area[1];
          filter.districtId = this.filter.area[2];
          this.queryParams = {
            ...this.queryParams,
            storeName: this.filter.name,
            appId: this.curAppId,
            ...filter,
          };
        } else {
          if (this.queryParams.provinceId !== undefined) {
            delete this.queryParams.provinceId;
            delete this.queryParams.districtId;
            delete this.queryParams.cityId;
          }
          this.queryParams = {
            ...this.queryParams,
            storeName: this.filter.name,
            appId: this.curAppId,
          };
        }
      },
      onChoosed(selectedRows) {
        this.$emit('selected', selectedRows);
      },
      selecteApp(item, index) {
        this.curAppId = item.id;
        this.onFilter();
      },

      onAreaChange(ids) {
        if (ids && ids.length) {
          this.fetchAreas(ids[ids.length - 1]);
        }
      },
      fetchAreas(id) {
        if (id) {
          const node = this.getNodeById(this.areas, id);
          if (!node || node.isloaded) {
            return;
          }
          return areaApi.queryRegion(id).done(({ data }) => {
            node.isloaded = true;
            node.childNode = this.addChildren(data);
          });
        }

        return areaApi.queryRegion().done(({ data }) => {
          this.areas = this.addChildren(data);
        });
      },
      addChildren(nodes) {
        if (!nodes || nodes.length === 0) {
          return null;
        }
        for (const node of nodes) {
          if (!node.isLeaf) {
            node.childNode = [];
          }
        }
        return nodes;
      },
      getNodeById(areas, id) {
        for (const area of areas) {
          if (area.id === id) {
            return area;
          }
          if (area.childNode && area.childNode.length) {
            const findedNode = this.getNodeById(area.childNode, id);
            if (findedNode) {
              return findedNode;
            }
          }
        }
      },
      // 获取路径初始化值
      fetchInitAreas(index, ids) {
        if (index >= ids.length || index >= 2) {
          // 超过数组和3级节点，不加载
          return;
        }

        const promise = this.fetchAreas(ids[index]);
        if (promise) {
          promise.done(() => {
            this.fetchInitAreas(index + 1, ids);
          });
        } else {
          this.fetchInitAreas(index + 1, ids);
        }
      },
      getPath(areaIds) {
        let list = this.areas;
        const path = [];
        for (const areaId of areaIds) {
          const finded = list.find(a => a.id === areaId);
          if (!finded) {
            return path;
          }
          path.push(finded);
          list = finded.childNode;
        }
        return path;
      },
    },
  };
</script>

<style lang="less">
  .app-select-dialog {
    .app-box {
      height: 40px;
      width: auto;
      color: @ui-theme-color-orange;
      // .select-button {
      //   padding: 0;
      //   height: 30px;
      //   color: #fa7516;
      // }
      // .span-title {
      //   line-height: 26px;
      //   margin-right: 10px;
      //   color: #303133;
      //   font-weight: 500;
      //   margin-right: 30px;
      // }
      // .activity-tab {
      //   color: @ui-theme-color-orange;
      //   font-weight: 600;
      //   padding-bottom: 5px;
      //   border-bottom: 2px solid @ui-theme-color-orange;
      // }
    }
    .app-filter {
      border-bottom: 1px solid #dce1e6;
      padding-bottom: 18px;
      padding-left: 20px;
      text-align: left;
      span {
        display: inline-block;
      }
      .filter-input {
        margin: 0px;
      }
    }

    .store-select {
      width: 220px;
    }
  }
</style>
