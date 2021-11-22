<template>
  <div class="store-filter-container">
    <span class="filter-title">{{title}}</span>
    <el-form inline :model="filter" ref="filter">
      <!-- <el-form-item>
        <span class="filter-title"
              style="margin-right: 10px">{{title}}</span>
      </el-form-item> -->
      <el-form-item label="状态：" prop="isOpen">
        <el-select v-model="filter.isOpen"
                   placeholder="请选择">
          <el-option label="全部状态"
                     :value="null"></el-option>
          <el-option label="营业"
                     :value="1"></el-option>
          <el-option label="打烊"
                     :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="关键字：" prop="storeName">
        <el-input placeholder="关键字搜索"
                  maxlength="60"
                  v-model="filter.storeName" />
      </el-form-item>
      <el-form-item>
        <el-button plain @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="select-box">
     <el-button type="primary" @click="showStoreCity" v-if="isShowArea" class="select-city-button">选择门店区域</el-button>
     <el-button @click="showDealerSelectDialog = true" v-if="isShowDealer" type="primary" style="margin-left: 15px;">选择经销商</el-button>
      <!-- <div class="select-city" :style="{width: isShowDealer ? '50%' : '100%'}" v-if="isShowArea"> -->
    </div>
    <div class="condition" :title="selectedCityStr" v-if="selectedCityStr && isShowArea">
      <span>门店区域：</span>
      <el-scrollbar class="scroll-box">{{selectedCityStr}}</el-scrollbar>
    </div>
    <div class="condition" :title="selectedDealerStr" v-if="selectedDealerStr && isShowDealer">
      <span>经销商：</span>
      <el-scrollbar class="scroll-box">{{selectedDealerStr}}</el-scrollbar>
    </div>

    <!-- 选择门店区域对话弹框 -->
    <city-select-dialog v-model="showCitySelectDialog"
                        ref="citySelect"
                        :selected-areas="selectedCity"
                        @choosed="onAreasChoosed"></city-select-dialog>
    <!-- 选择经销商对话弹框 -->
    <dealer-select-dialog
      v-model="showDealerSelectDialog"
      ref="dealerSelect"
      :selected-areas="selectedDealer"
      @choosed="onDealerChoosed" />
  </div>

</template>

<script>
import CitySelectDialog from '@/dss-wechat3rd/src/bz_components/city-select-dialog/index.vue';
import DealerSelectDialog from '@/dss-wechat3rd/src/bz_components/dealer-select-dialog/index.vue';

export default {
  props: {
    title: {
      type: String,
      default: '选择门店'
    },
    isShowArea: {
      type: Boolean,
      default: true
    },
    isShowDealer: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CitySelectDialog,
    DealerSelectDialog
  },
  watch: {
    filter: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (oldVal != null) {
          this.$emit('filter', this.$plain(this.filter));
        }
      }
    }
  },
  data() {
    return {
      filter: {
        isOpen: null,
        storeName: null,
        storeIdList: []
      },
      selectedCity: [],
      selectedCityStr: '',
      showCitySelectDialog: false,
      showDealerSelectDialog: false,
      selectedDealer: [],
      selectedDealerStr: ''
    };
  },
  methods: {
    showStoreCity() {
      this.showCitySelectDialog = true;
    },
    onAreasChoosed(val) {
      this.selectedDealer = null;
      this.selectedDealerStr = '';

      if (val && val.length) {
        this.selectedCity = val;
        let storeIdList = [];
        let cityStr = '';

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
      } else {
        this.selectedCity = null;
        this.filter.storeIdList = null;
        this.selectedCityStr = '';
      }
      this.$refs.dealerSelect && this.$refs.dealerSelect.delAll();
    },
    onDealerChoosed(val) {
      this.selectedCity = null;
      this.selectedCityStr = '';

      if (val && val.length) {
        this.selectedDealer = val;
        let storeIdList = [];
        let selectedDealerStr = '';

        this.selectedDealer.forEach((item, index) => {
          storeIdList = storeIdList.concat(item.storeDTOList || []);
          selectedDealerStr += `${item.dealerName}${index < val.length - 1 ? '，' : ''}`;
        });

        this.filter.storeIdList = storeIdList.map(item => item.id);
        this.selectedDealerStr = selectedDealerStr;
      } else {
        this.selectedDealer = null;
        this.selectedDealerStr = '';
        this.filter.storeIdList = null;
      }
      this.$refs.citySelect && this.$refs.citySelect.delAll();
    },
    handleReset() {
      this.$refs.filter.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.store-filter-container {
  position: relative;
  .el-form {
    text-align: left;
    padding-left: 20px;
    padding-top: 15px;
  }
  .filter-title {
    position: absolute;
    top: -20px;
    left: 20px;
    text-align: left;
    height: 26px;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #303133;
    line-height: 26px;
    display: block;
  }

  .condition {
    text-align: left;
    padding: 0 20px;
    margin-top: 8px;
    font-size: 14px;
    color: #717378;

    .scroll-box {
      width: 583px;
      height: 60px;
      border: 1px solid #dce1e6;
      padding: 7px 12px;
      border-radius: 2px;
      margin-top: 6px;
      font-size: 12px;
      box-sizing: border-box;
    }

    ::-webkit-scrollbar {
      width: 0;
    }
  }
  .area-city {
    flex: 1;
  }

  .select-box {
    display: flex;
    box-sizing: border-box;
    margin-left: 20px;
  }
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style lang="less">
.store-filter-container {
  .el-form {
    .el-input--mini .el-input__inner {
      width: 180px;
    }
  }
}
</style>
