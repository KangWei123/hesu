<template>
  <div class="logistics-setting">
    <h3 class="logistics-setting-title">物流设置</h3>
    <el-form label-width="82px" v-loading="loading">
      <el-form-item label="物流方式：">
        <el-checkbox-group v-model="expressType">
          <el-checkbox :label="EXPRESS_TYPES.EXPRESS.label" name="type"></el-checkbox>
          <el-checkbox :label="EXPRESS_TYPES.SELF_DELIVERY.label" name="type"></el-checkbox>
          <el-checkbox :label="EXPRESS_TYPES.CITY_DELIVERY.label" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="配送服务商：" v-if="curApp.supportLocal" label-width="96px">
        <servicer-table
          :servicerList="servicerList"
          @handleServicerOpen="handleServicerOpen"
          @toggleServicer="toggleServicer"
          :type="'logistics-setting'"
          :noServicer="noServicer"
        />
      </el-form-item>

      <h3 class="logistics-setting-title">运费模板</h3>
    </el-form>

    <tpl-list ref="list" />

    <open-servicer
      v-if="showOpenServicer"
      @cancel="handleOpenServicerCancel"
      :curServicer="curServicer"
      @done="handleOpenServicerDone"
    />
  </div>
</template>
<script>
import './index.less';
import { mapState } from 'vuex';
import tplList from '../freight-tpl/new-list.vue';
import { EXPRESS_TYPES } from '@/dss-wechat3rd/src/constants/warehouseEnum';
import api from '@/dss-setting/src/api';
import store from '@/business-common/store.js';
import openServicer from './dialog/open-servicer.vue';
import servicerTable from '@/dss-wechat3rd/src/components/servicer-table';

export default {
  components: { tplList, openServicer, servicerTable },
  computed: {
    ...mapState({
      curApp: 'curApp'
    })
  },
  data() {
    return {
      EXPRESS_TYPES: EXPRESS_TYPES,
      expressType: [],
      loading: false,
      showOpenServicer: false,
      curServicer: {},
      servicerList: [],
      dialogVisible: false,
      noServicer: false,
      stopSetDelivery: true
    };
  },
  mounted() {
    this.initExpressType();
    this.queryServicer();
  },
  methods: {
    initExpressType() {
      this.expressType = [];
      if (this.curApp.supportExpress) {
        this.expressType.push(this.EXPRESS_TYPES.EXPRESS.label);
      }
      if (this.curApp.supportLocal) {
        this.expressType.push(this.EXPRESS_TYPES.CITY_DELIVERY.label);
      }
      if (this.curApp.supportPickUp) {
        this.expressType.push(this.EXPRESS_TYPES.SELF_DELIVERY.label);
      }
    },
    setExpressType(label) {
      // 至少勾选一项
      if (!this.expressType.length) {
        this.$message({
          message: '物流方式至少勾选一项',
          type: 'warning'
        });
        this.initExpressType();
        return (this.stopSetDelivery = true);
      }

      let state = this.expressType.indexOf(label) === -1 ? 0 : 1,
        deliveryTag,
        key;

      switch (label) {
        case EXPRESS_TYPES.SELF_DELIVERY.label:
          deliveryTag = 2;
          key = 'supportPickUp';
          break;
        case EXPRESS_TYPES.EXPRESS.label:
          deliveryTag = 4;
          key = 'supportExpress';
          break;
        case EXPRESS_TYPES.CITY_DELIVERY.label:
          deliveryTag = Math.pow(2, 20);
          key = 'supportLocal';
          break;
      }

      this.loading = true;

      api
        .updateDelivery({ deliveryTag, state })
        .then(res => {
          // 全局更新物流状态
          this.curApp[key] = state;
          store.commit('update_curApi', this.curApp);
        })
        .catch(() => {
          this.stopSetDelivery = true;
          this.initExpressType();
        })
        .always(() => {
          this.loading = false;
        });
    },

    queryServicer() {
      api.queryServicer({}).then(res => {
        if (res.data) {
          if (!res.data || !res.data.length) {
            this.noServicer = true;
            return;
          }
          this.servicerList = res.data;
        }
      });
    },

    toggleServicer({ deliveryType, enable }) {
      enable = enable === 0 ? 1 : 0;

      // this.$confirm(`是否确认${enable === 0 ? '关闭' : '开启'}服务？`, `${enable === 0 ? '关闭' : '开启'}服务`, {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(() => {
      api
        .toggleServicer({
          deliveryType,
          enable
        })
        .then(res => {
          if (res.data) {
            this.queryServicer();
          }
        });
      // });
    },

    handleServicerOpen(item) {
      this.curServicer = item;
      this.showOpenServicer = true;
    },

    handleOpenServicerCancel() {
      this.showOpenServicer = false;
    },

    handleOpenServicerDone(servicerInfo) {
      api.applyDada(servicerInfo).then(res => {
        if (res.data) {
          this.showOpenServicer = false;
          this.queryServicer();
          this.$message({
            message: '申请成功',
            type: 'success'
          });
        }
      });
    }
  },
  watch: {
    expressType: {
      handler: function(newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          let label = newVal.concat(oldVal).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
          })[0];
          if (this.stopSetDelivery) {
            return (this.stopSetDelivery = false);
          }
          this.setExpressType(label);
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.getTplList(); // 获取运费模板列表
    });
  }
};
</script>

<style lang="less">
.logistics-setting-title {
  margin-bottom: 17px;
  font-size: 14px;
  font-weight: 500;
}
</style>
