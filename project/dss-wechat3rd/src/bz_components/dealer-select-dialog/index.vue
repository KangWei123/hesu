<template>
  <el-dialog :visible.sync="showDialog"
             title="选择经销商"
             class="city-select-dialog"
             append-to-body>

    <div class="area-content" v-loading="loading">
      <div class="area-box">
        <div class="area-item"
             @click.self="clickCityItem(index)"
             :style="{cursor: 'pointer'}"
             v-for="(item, index) in areas"
             :key="index">
          <span @click.self="clickCityItem(index)">{{item.dealerName}}</span>
        </div>
      </div>
      <div class="open-box">
        <div>
          <el-button type="primary"
                     class="open-btn choice-btn"
                     @click="selectAll">全部选择</el-button>
        </div>
        <div>
          <el-button type="primary"
                     class="open-btn delete-btn"
                     @click="delAll">全部删除</el-button>
        </div>
      </div>
      <div class="area-box">
        <div class="area-item"
             :style="{cursor: 'pointer'}"
             @click.self="delCityItem(index)"
             v-for="(item,index) in selectedCity"
             :key="index">
          <span @click.self="delCityItem(index)">{{item.dealerName}}</span>
        </div>
      </div>
    </div>
    <div slot="footer"
         style="text-align: center;">
      <el-button class="btn-cancel"
                 @click="showDialog = false">取消</el-button>
      <el-button type="primary"
                 class="btn-confirm"
                 @click="handleOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import wechat3rdApi from '@/dss-wechat3rd/src/api/index.js';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

export default {
  name: 'dealer-select-dialog',
  mixins: [AdapterIfr.AdapterMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectedAreas: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      originAreas: [],
      areas: [], //各个区域列表
      selectedCity: []
    };
  },
  watch: {
    value(newVal, oldVal) {
      this.showDialog = newVal;
      setTimeout(() => {
        this.adapterIfmMask(true);
      });
    },
    showDialog: function(newVal, oldVal) {
      this.$emit('input', newVal);
      if (newVal) {
        this.fetchAreas();
      }
    }
  },

  methods: {
    fetchAreas() {
      if (this.originAreas && this.originAreas.length) {
        this.areas = this.$plain(this.originAreas);
        this.getSelect();
        return;
      }
      this.loading = true;
      wechat3rdApi
        .getDealerList()
        .done(res => {
          this.areas = res.data || [];
          this.originAreas = this.$plain(res.data || []);
          this.getSelect();
        })
        .always(() => {
          this.loading = false;
        });
    },

    //获取当前选中
    getSelect() {
      let areas = [];
      this.areas.map((ele, index) => {
        let isItem = false;
        (this.selectedAreas || []).forEach(item => {
          if (ele.id === item.id) {
            isItem = true;
          }
        });
        if (!isItem) {
          areas.push(ele);
        }
      });
      this.areas = areas;

      this.selectedCity = this.selectedAreas || [];
    },

    selectAll() {
      this.selectedCity = this.selectedCity.concat(this.$plain(this.areas));
      this.areas = [];
    },

    delAll() {
      this.areas = this.areas.concat(this.$plain(this.selectedCity || []));
      this.selectedCity = [];
    },

    clickCityItem(index) {
      let item = this.areas.splice(index, 1);
      let selectedCity = this.selectedCity || [];
      selectedCity.push(item[0]);
      this.selectedCity = selectedCity;
    },

    delCityItem(index) {
      let item = this.selectedCity.splice(index, 1);
      let areas = this.areas;
      areas.push(item[0]);
      this.areas = areas;
    },

    handleOk() {
      this.showDialog = false;
      this.$emit('choosed', this.selectedCity);
    }
  }
};
</script>

<style lang="less">
.city-select-dialog {
  .el-dialog {
    width: 580px;
    height: 510px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 25px 0px rgba(179, 179, 179, 0.5);
    border-radius: 4px;
    position: relative;

    .el-dialog__header {
      padding: 0 0 0 20px;
      height: 60px;
      background: rgba(245, 247, 250, 1);
      box-sizing: border-box;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 60px;
      border-radius: 4px 4px 0px 0px;
    }

    .el-dialog__body {
      padding: 0 0;
      margin: 20px;
    }

    .area-title {
      margin: 0 64px 0 15px;
      height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #eeeeee;
      font-size: 16px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 30px;
    }

    .area-content {
      height: 320px;
      box-sizing: border-box;
      font-size: 0px;
      .area-box {
        width: 220px;
        height: 320px;
        padding: 0px 20px 10px;
        float: left;
        overflow-y: auto;
        box-sizing: border-box;
        // border: 1px solid #dcdee0;
        background-color: rgba(245, 247, 250, 1);
        border-radius: 4px;
      }

      .open-box {
        width: 60px;
        float: left;
        height: 290px;
        margin: 0 20px;
        padding-top: 30px;
        .open-btn {
          width: 60px;
          height: 24px;
          line-height: 24px;
          min-width: auto;
          margin-top: 10px;
          padding: 0px;
          font-size: 12px;
          border: none;
          border-radius: 2px;
        }
        .choice-btn {
          background-color: rgba(37, 110, 255, 1);
        }
        .delete-btn {
          background-color: rgba(233, 236, 241, 1);
          color: rgba(153, 153, 153, 1);
        }
      }

      .area-item {
        position: relative;
        font-size: 14px;
        color: #999999;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        box-sizing: border-box;
        margin-top: 10px;
        line-height: 20px;

        .area-check {
          position: absolute;
          right: 5px;
        }
      }
    }

    .el-dialog__footer {
      padding: 20px;
      font-family: PingFangSC-Regular;
      font-size: 0px;
      .el-button {
        width: 80px;
        height: 30px;
        border: none;
        padding: 0px;
        min-width: auto;
        border-radius: 2px;
        font-size: 12px;
      }
      .btn-cancel {
        background-color: rgba(233, 236, 241, 1);
        color: rgba(153, 153, 153, 1);
      }
      .btn-confirm {
        margin-left: 20px;
      }
    }

    .area-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 80px;
      background: rgba(244, 244, 244, 1);
      text-align: center;

      .ok-btn {
        margin-top: 23px;
      }
    }
  }
}
</style>
