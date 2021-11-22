<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" :width="width" @close="handleClose">
    <el-form :rules="rules" :model="form" ref="form" class="shop-dialog-form">
      <!-- error="该门店已存在导购跟进，不可再次分配导购" -->
      <el-form-item label="选择门店：" v-if="isShowStore" :disabled="disabledStore" class="is-required">
        <!--门店信息,带门店选择-->
        <el-popover v-model="popoverVisible" placement="bottom" width="300" trigger="click" :disabled="disabledStore">
          <div class="popover-content">
            <!-- 按城市搜索 -->
            <el-cascader
              v-if="showProvince"
              @active-item-change="handleCascaderChange"
              :options="provinceList"
              v-model="location"
              placeholder="选择指定城市"
              clearable
            ></el-cascader>
            <!-- 按名称搜索 -->
            <el-input placeholder="输入门店关键词" @input="searchByName" v-model="storeName" v-else></el-input>
            <el-button @click="switchSearch" style="margin-top: 10px">{{ tips }}</el-button>
            <!-- 门店滚动列表 -->
            <el-scrollbar style="height: 400px" class="store-list-wapper" v-loading="storeLoading">
              <div
                @click="changeStore(item.id)"
                :class="['store-item', { active: item.id === form.storeId }]"
                v-for="item in currentStoreList"
                :key="item.id"
              >
                {{ item.name }}
              </div>
            </el-scrollbar>
          </div>
          <div :class="['store-picker', { 'store-picker-disabled': disabledStore }]" slot="reference">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <span :class="['store-name', { 'store-name-active': !!currentStoreName }]">{{
              currentStoreName || '选择门店'
            }}</span>
          </div>
          <!-- <el-button slot="reference">click 激活</el-button> -->
        </el-popover>
        <div class="store-tips">
          <span v-if="storeErrorTips">{{ storeErrorTips }}</span>
          <span v-if="storeTips">{{ storeTips }}</span>
        </div>
      </el-form-item>

      <el-form-item
        label="选择导购："
        v-if="isShowShop && !isMultipleShop && shopDataSource.length > 0"
        prop="employeeId"
      >
        <el-select
          placeholder="请选择"
          size="mini"
          default-first-option
          v-model="form.employeeId"
          @change="handleChangeShop"
          :disabled="disabledShop"
          style="width: 297px"
          filterable
          clearable
        >
          <el-option v-for="item in shopDataSource" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="选择导购："
        v-if="isShowShop && isMultipleShop && shopDataSource.length > 0"
        prop="employeeIds"
      >
        <el-select
          multiple
          placeholder="请选择"
          size="mini"
          default-first-option
          v-model="form.employeeIds"
          @change="handleChangeShopMultiple"
          :disabled="disabledShop"
          style="width: 297px"
          filterable
          clearable
        >
          <el-option v-for="item in shopDataSource" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div class="warn-text" v-if="isShowShop && isMultipleShop">
        若选择多个导购，将随机分配；（若客户在分配门店已存在导购跟进，则不进行再次分配）
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { sharedStoreApi } from '@/register/console';
  const { queryStoreByLocation } = sharedStoreApi;
  export default {
    props: {
      handleCascaderChange: {
        type: Function,
      },
      width: {
        type: String,
        default: '450px',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      submitLoading: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      // 区域
      provinceList: {
        type: Array,
        default() {
          return [];
        },
      },
      // 门店数据
      storeDataSource: {
        type: Array,
        default() {
          return [];
        },
      },
      // 导购数据
      shopDataSource: {
        type: Array,
        default() {
          return [];
        },
      },
      clientEmployeeBinds: {
        type: Array,
        default() {
          return [];
        },
      },
      // 是否显示门店
      isShowStore: {
        type: Boolean,
        default: false,
      },
      // 是否显示导购
      isShowShop: {
        type: Boolean,
        default: false,
      },
      // 导购是否支持多选
      isMultipleShop: {
        type: Boolean,
        default: false,
      },
      // 是否禁用导购
      disabledShop: {
        type: Boolean,
        default: false,
      },
      // 是否禁用门店
      disabledStore: {
        type: Boolean,
        default: false,
      },
      // 查询导购列表loading
      guideLoading: {
        type: Boolean,
        default: false,
      },
      // 门店id
      curStoreId: {
        type: Number,
        default: null,
      },
    },
    computed: {
      currentStoreList() {
        if (this.location[1]) {
          return this.lStoreList;
        } else if (this.storeName) {
          return this.actStoreList;
        } else {
          return this.storeDataSource;
        }
      },
      storeTips() {
        // if (this.isMultipleShop) return '';
        let str = '';

        if (this.form.storeId && this.isShowShop && !this.guideLoading) {
          if (this.shopDataSource.length === 0) {
            str = '该门店暂无导购，将分配到门店成为线索';
          } else if (!this.isMultipleShop && this.shopDataSource.length > 0) {
            const flag = this.clientEmployeeBinds.some(item => {
              return item.storeId === this.form.storeId && item.employeeId;
            });
            if (flag) {
              str = '门店已存在导购跟进，不可再次分配导购';
            }
          }
        }

        return str;
      },
      currentStoreName() {
        const store = this.currentStoreList.find(i => i.id === this.form.storeId);
        return store ? store.name : '';
      },
    },
    watch: {
      visible(val) {
        this.open = val;
      },
      curStoreId(newVal) {
        this.form.storeId = newVal;
      },
      location() {
        this.queryStoreList();
      },
      'form.storeId'(newVal) {
        if (newVal) {
          this.storeErrorTips = '';
        }
      },
    },
    data() {
      return {
        open: this.visible,
        popoverVisible: false,
        showProvince: false,
        storeName: '',
        // 指定 城市/省份 的门店
        lStoreList: [],
        location: [],
        storeLoading: false,
        tips: '按城市搜索',
        actStoreList: [],
        form: {
          storeId: null, // 门店id
          employeeId: null, // 导购id（员工id）
          employeeIds: [], // 导购多选
        },
        rules: {
          storeId: [{ required: true, message: '请选择门店' }],
          employeeId: [{ required: true, message: '请选择导购员', trigger: 'change' }],
          employeeIds: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个导购员',
              trigger: 'change',
            },
          ],
        },
        storeErrorTips: null,
      };
    },
    mounted() {},
    methods: {
      reset() {
        this.form.storeId = null;
        this.form.employeeId = null;
        this.form.employeeIds = [];
        this.actStoreList = [];
        this.location = [];
        this.lStoreList = [];
        this.popoverVisible = false;
        this.storeName = '';
      },
      handleClose() {
        this.reset();
        this.$refs.form.resetFields();
        this.$emit('close');
      },

      // 多选导购改变时
      handleChangeShopMultiple() {
        this.$emit('change-shop-multiple', this.form.employeeIds);
      },
      // 单选导购改变时
      handleChangeShop() {
        this.$emit('change-shop', this.form.employeeId);
      },
      // 门店改变时
      handleChangeStore(storeId) {
        this.form.employeeId = null;
        this.form.employeeIds = [];
        this.$emit('change-store', storeId);
      },

      handleSubmit() {
        this.$refs.form.validate(err => {
          if (!err) {
            return;
          }
          if (!this.form.storeId) {
            this.storeErrorTips = '请选择门店';
            return;
          }

          this.$emit('submit', this.form);
        });
      },

      searchByName() {
        const list = this.currentStoreList.length ? this.currentStoreList : this.storeDataSource;
        this.actStoreList = list.filter(i => i.name.indexOf(this.storeName) > -1);
      },

      // 切换搜索模式
      switchSearch() {
        this.storeName = '';
        this.location = [];
        this.showProvince = !this.showProvince;
        this.tips = this.showProvince === true ? '按门店搜索' : '按城市搜索';
      },

      /**
       * 切换门店
       */
      changeStore(id) {
        this.popoverVisible = false;
        if (this.form.storeId == id) return;
        this.form.storeId = id;
        this.handleChangeStore(id);
      },

      async queryStoreList() {
        const [_, cityName] = this.location;
        if (!cityName) {
          this.lStoreList = this.storeDataSource;
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
  .dialog-footer {
    justify-content: space-around;
  }
  .warn-text {
    font-size: 12px;
    color: #999;
  }
  .store-picker {
    width: 280px;
    height: 30px;
    line-height: 30px;
    padding-left: 14px;
    color: #999999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border: 1px solid #dcdee0;
    &:focus {
      outline: none;
    }
  }
  .aside-cashier .disabled {
    cursor: not-allowed;
  }
  .store-tips {
    padding-left: 92px;
    span {
      font-size: 12px;
      color: red;
    }
  }

  .store-picker-disabled {
    background-color: #c8c9cc;
    border-color: #c8c9cc;
  }
  .store-name-active {
    color: #333;
  }
</style>

<style lang="less">
  .popover-content {
    .el-button {
      height: 30px;
      line-height: 30px;
      padding: 0 14px;
      min-width: 86px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      border: 1px solid #256eff;
      color: #256eff;
      box-sizing: border-box;
      border-radius: 15px;
    }
  }

  .store-list-wapper {
    margin-top: 10px;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .store-item {
      line-height: 2em;
      padding: 0 10px;
      &:hover,
      &.active {
        color: #409eff;
        background: #f2f6fc;
        cursor: pointer;
      }
    }
  }

  .shop-dialog-form {
    .el-form-item__error {
      padding-left: 82px;
    }
  }
</style>
