<template>
  <div class="dss-store-select">
    <div class="title">
      <i class="key-icon icon-search"></i>

      <!--多家店铺keepers时显示级联选择-->
      <el-cascader
        v-if="storeKeepers && storeKeepers.length > 1 && selectOptions"
        v-model="curStorePath"
        :options="selectOptions"
        expand-trigger="hover"
        :show-all-levels="false"
        filterable
        @change="onCascaderChange"
        ref="cascader">
      </el-cascader>

      <!--单家店铺keepers时显示select-->
      <el-select v-model="curStoreName"
                 size="small"
                 filterable
                 placeholder="搜索店铺"
                 @visible-change="onVisibleChanged"
                 v-if="storeKeepers && storeKeepers.length <= 1">
        <el-option
          v-for="item in stores"
          :key="item.id"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import baseApi from '@/dss-common/api/base';
import utils from '@/dss-common/utils';

export default {
  data() {
    return {
      // 维表无中文名，暂时在前端定义
      // keeperMap: {
      //     XBL: '猩便利',
      //     UR: '快尚'
      // }
      keeperMap: {},
      reset: true, // 此属性是为了回滚作用
      isVisible: false // 单个选择店铺时，下拉框是否可见
    };
  },
  computed: {
    ...mapState({
      curStore: state => state.curStore,
      stores: state => state.stores,
      userInfo: 'userInfo'
    }),
    // <el-select>, <el-cascader> options
    selectOptions() {
      if (!this.storeKeepers) {
        return;
      }

      return this.storeKeepers.map(keeper => {
        return {
          label: this.keeperMap[keeper],
          value: keeper,
          children: this.stores
            .filter(store => store.epId === keeper)
            .map(store => {
              return {
                label: store.name,
                value: store.name
              };
            })
        };
      });
    },
    storeKeepers() {
      if (!this.curStore) {
        return;
      }
      const keepers = this.stores.map(item => item.epId);
      return utils.removeRepeat(keepers);
    },
    curStoreName: {
      get() {
        if (this.reset) {
          // 此代码段是为了回滚作用，curStorePath依赖reset属性，修改reset属性从而回滚组件显示值
          let tem = this.reset;
        }
        if (this.isVisible) {
          return '';
        } else {
          return this.curStore && this.curStore.name;
        }
      },
      set(val) {
        let store = this.stores.find(item => item.name === val);
        if (!store) {
          return;
        }
        const preStore = this.curStore;
        store.store_name = store.name;
        if (preStore && preStore.id === store.id) {
          return;
        }
        this.changeEp(preStore, store);
      }
    },
    curStorePath: {
      get() {
        if (this.reset) {
          // 此代码段是为了回滚作用，curStorePath依赖reset属性，修改reset属性从而回滚组件显示值
          let tem = this.reset;
        }
        return this.curStore && [this.curStore.epId, this.curStore.name];
      },
      set(val) {
        // todo 企业不同也可以切换
        const preStore = this.curStore;
        let store = this.stores.find(item => item.name === val[1]);
        store.store_name = store.name;
        if (preStore && preStore.id === store.id) {
          return;
        }
        this.changeEp(preStore, store);
      }
    }
  },
  created() {
    this.fetchShopkeeper();
  },
  methods: {
    onVisibleChanged(isVisible) {
      this.isVisible = isVisible;
    },

    // fix el-cascader 关闭后不去除焦点的问题
    onCascaderChange(e) {
      const $input = this.$refs.cascader.$el.getElementsByClassName('el-input__inner')[0];
      setTimeout(() => {
        $input.blur();
      }, 100);
    },
    fetchShopkeeper() {
      baseApi.shopKeeper().done(result => {
        if (!result.data.length) {
          this.keeperMap = {};
          return;
        }
        const obj = {};
        result.data.forEach(item => {
          obj[item.id] = item.name;
        });
        this.keeperMap = obj;
      });
    },
    changeEp(oldVal, val) {
      if (!this.storeKeepers) {
        return;
      }
      const tem = val || {};
      // 超级管理原，切换企业或者店铺
      if (this.storeKeepers.length > 1) {
        baseApi.changeEp(tem.epId, tem.id).then(
          () => {
            const selectedEp = this.userInfo.epList.find(item => {
              return item.id === tem.epId;
            });
            if (selectedEp) {
              this.$store.commit('set_epInfo', {
                epId: selectedEp.id,
                epName: selectedEp.name
              });
            }
            this.$store.commit('setCurStore', val);
          },
          () => {
            // this.$store.commit('setCurStore', null)
            this.reset = !this.reset;
            this.$store.commit('setCurStore', oldVal);
          }
        );
      } else {
        // 切换店铺
        baseApi
          .changeStore({
            storeId: tem.id
          })
          .then(
            () => {
              this.$store.commit('setCurStore', val);
            },
            () => {
              this.reset = !this.reset;
              this.$store.commit('setCurStore', oldVal);
            }
          );
      }
    }
  }
};
</script>

<style lang="less">
.dss-store-select {
  margin: 20px 16px;
  min-height: 30px;

  .title {
    position: relative;
    border-bottom: solid 1px rgba(116, 132, 154, 0.25);

    .key-icon {
      position: absolute;
    }

    .icon-search {
      position: absolute;
      left: 4px;
      top: 6px;
      width: 17px;
      height: 17px;
      background-image: url('../img/sidebar/search.png');
    }

    .icon-arrow-down {
      right: 4px;
      top: 12px;
      width: 7px;
      height: 7px;
      background-image: url('../img/sidebar/arrow-down.png');
    }

    .el-input {
      font-size: 13px;
    }

    .el-input__inner {
      box-sizing: border-box;
      padding-left: 32px;
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      height: 30px;
      line-height: 30px;
      color: #fff;
    }

    .el-input__suffix {
      right: 0;
    }

    .el-select__caret {
      color: #74849a;
    }

    .el-cascader {
      line-height: 30px;

      .el-input__icon {
        color: #74849a;
        line-height: 30px;
      }

      .el-cascader__label {
        padding: 0 25px 0 32px;
        color: #fff;
      }
    }
  }
}
</style>
