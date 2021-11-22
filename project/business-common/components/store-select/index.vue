<template>
  <!--门店信息,带门店选择-->
  <el-popover v-model="popoverVisible" placement="right" width="200" trigger="click">
    <div class="store-popover-content">
      <el-tabs v-model="activeName" @tab-click="switchSearch">
        <el-tab-pane label="按门店搜索" name="store">
          <!-- 按名称搜索 -->
          <el-input placeholder="输入关键字" @input="searchByName" prefix-icon="el-icon-search" v-model="storeName" />
        </el-tab-pane>
        <el-tab-pane label="按城市搜索" name="second">
          <!-- 按城市搜索 -->
          <el-cascader
            @active-item-change="handleCascaderChange"
            :options="provinceList"
            v-model="location"
            placeholder="选择指定城市"
            clearable
          />
        </el-tab-pane>
      </el-tabs>

      <!-- 门店滚动列表 -->
      <el-scrollbar style="height: 250px" class="store-list-wapper" v-loading="storeLoading">
        <div
          @click="changeStore(item.id)"
          :class="['store-item', { active: item.id === curStoreId }]"
          v-for="item in currentStoreList"
          :key="item.id"
        >
          {{ item.name }}
        </div>
      </el-scrollbar>
    </div>
    <div slot="reference">
      <div v-if="!isCollapse" class="store-picker">
        <span class="store-name">{{ (currentStoreList.find(i => i.id === curStoreId) || {}).name || '选择门店' }}</span>
        <i slot="prefix" class="el-input__icon el-icon-arrow-right"></i>
      </div>
      <el-popover placement="top-start" width="200" trigger="hover" :content="curStore.name" v-else>
        <wk-icon name="icon-store" slot="reference" class="wk-icon" />
      </el-popover>
    </div>
  </el-popover>
</template>

<script>
  import { mapState } from 'vuex';
  import { sharedStoreApi } from '@/register/console';

  const { queryProvinceList, queryCityList, queryStoreByLocation } = sharedStoreApi;

  export default {
    data() {
      return {
        provinceList: [],
        location: [],
        lStoreList: [], // 指定城市/省份的门店
        showProvince: false,
        popoverVisible: false,
        storeLoading: false,
        storeName: '',
        actStoreList: [],
        activeName: 'store',
      };
    },
    mounted() {
      this.queryProvinceList();
    },
    computed: {
      ...mapState({
        storeList: 'storeList',
        curStore: 'curStore',
        sidebar: 'sidebar',
      }),
      currentStoreList() {
        if (this.location[1]) {
          return this.lStoreList;
        } else if (this.storeName) {
          return this.actStoreList;
        } else {
          return this.storeList;
        }
      },
      // 当前门店id
      curStoreId: {
        get() {
          if (this.curStore && this.curStore.id) {
            return this.curStore.id;
          }
          // return this.storeList.length > 0 ? this.storeList[0].id : '';
          return '';
        },
        set(val) {},
      },
      isCollapse() {
        return !this.sidebar.opened;
      },
    },
    watch: {
      location() {
        this.queryStoreList();
      },
    },
    methods: {
      async queryProvinceList() {
        const { data } = await queryProvinceList();
        this.provinceList = (data || []).map(i => ({ label: i.province, value: i.province, children: [] }));
      },

      async handleCascaderChange([provinceName]) {
        const cityList = await this.queryCityList(provinceName);
        const cur = this.provinceList.find(i => i.value === provinceName);
        if (cur) {
          cur.children = cityList;
        }
      },

      async queryCityList(provinceName) {
        const { data } = await queryCityList({ provinceName });
        return data.map(i => ({ label: i.city, value: i.city }));
      },

      // 切换搜索模式
      switchSearch() {
        this.storeName = '';
        this.location = [];
        this.showProvince = !this.showProvince;
      },

      searchByName() {
        const list = this.currentStoreList.length ? this.currentStoreList : this.storeList;
        this.actStoreList = list.filter(i => i.name.indexOf(this.storeName) > -1);
      },

      changeStore(id) {
        this.popoverVisible = false;
        if (this.curStoreId !== id) {
          this.$emit('changeStore', id);
        }
      },

      async queryStoreList() {
        const [_, cityName] = this.location;
        if (!cityName) {
          this.lStoreList = this.storeList;
          return;
        }
        try {
          this.storeLoading = true;
          const { data } = await queryStoreByLocation({
            dimFlg: 'c',
            cityName: cityName,
          });
          this.lStoreList = data || [];
        } finally {
          this.storeLoading = false;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .store-popover-content {
    .store-list-wapper {
      margin-top: 10px;

      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .store-item {
        line-height: 2em;
        padding: 0 10px;

        &:hover {
          color: #409eff;
          background: #f2f6fc;
          cursor: pointer;
        }
      }
    }
  }

  .store-picker {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    width: 160px;
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    margin: 24px auto 10px;
    color: #303133;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border: 1px solid #dce1e6;
    border-radius: 2px;
    text-align: left;

    .store-name {
      font-size: 14px;
      color: #303133;
    }

    .el-input__icon {
      font-size: 16px;
      color: #b1b5bd;
    }
  }

  .wk-icon {
    cursor: pointer;
    width: 24px;
    height: 24px;
    margin: 13px 15px;
    fill: #b1b5bd;
    cursor: pointer;
  }
</style>
