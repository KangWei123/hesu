<template>
  <!-- 设置商品佣金dialog -->
  <el-dialog title="设置门店配额"
             width="800px"

             @open="onGiftDialogOpen"
             @closed="onGiftDialogClosed"
             :visible.sync="mShowDialog">
    <div class="seckill-head" style="height:30px">
      <!-- <el-input class="filter-input"
                size="mini"
                placeholder="门店名称"
                v-model="filterName"
                maxlength="80"
                style="width:200px"
                @keyup.enter.native="onSearch"
                @input="onSearch"></el-input> -->

        <el-button type="primary"
                  style="float:right"
                  @click="onAdd">一键同步库存</el-button>
    </div>

    <el-form ref="form"
            v-loading="loading"
             :model="form"
             :rules="rules"
             label-width="0px">
      <el-form-item label=""
                    prop="tableData">
  <div style="max-height:500px;overflow-y:auto">
        <el-table :data="form.tableData"
                  style="width: 100%;"
                  class="wkt-table"
                  row-key="id">

          <el-table-column prop="storeName"
                          label="门店"
                          min-width="180"></el-table-column>

          <el-table-column prop="stock"
                          label="可用库存"
                          min-width="180">
            <template slot-scope="scope">
              <div v-if="!scope.row.itemList||!scope.row.itemList.length">{{scope.row.stock||0}}</div>
              <div v-else class=""></div>
            </template>
          </el-table-column>

          <el-table-column prop="stockSeckill"
                          label="秒杀配额"
                          min-width="100">
            <template slot-scope="scope">
              <div>
                <el-input class="middle-width" v-if="!scope.row.itemList||!scope.row.itemList.length"
                      v-model="scope.row.quotaLimit" />
              </div>
            </template>
          </el-table-column>
        </el-table>
       </div>
      </el-form-item>
    </el-form>

    <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination"></el-pagination>
    <div slot="footer">
      <el-button @click="mShowDialog = false">取 消</el-button>
      <el-button type="primary"
                 @click="handleSetting('form')">确 定
      </el-button>
    </div>



  </el-dialog>
</template>

<script>
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import regexps from '@/dss-common/utils/regexps.js';
import seckillApi from '@/dss-wechat3rd/src/api/seckill.js';

export default {
  name: 'seckill-quota-dialog',
  mixins: [dialogMixin],
  components: {},
  props: {
    storeIdList: {
      type: Array,
      default: null
    },
    quotaList: {
      type: Array,
      default: null
    },
    queryParams: {
      type: Object,
      default: null
    }
  },
  data() {
    let reg = /^[1-9]\d*|0$/;
    const checkValidate = (rule, value, callback) => {
      let msg = null;
      value.forEach(v => {
        if (v.itemList && v.itemList.length) {
          v.itemList.forEach(item => {
            if (!reg.test(item.quotaLimit) && item.quotaLimit) {
              return (msg = '请输入正整数');
            }
            if (item.quotaLimit > item.stock) {
              return (msg = '秒杀配额不能超过可用库存');
            }
          });
        } else {
          if (!reg.test(v.quotaLimit) && v.quotaLimit) {
            return (msg = '请输入正整数');
          }
          if (v.quotaLimit > v.stock) {
            return (msg = '秒杀配额不能超过可用库存');
          }
        }
      });
      if (msg) {
        return callback(msg);
      }
      return callback();
    };

    return {
      storeQuotaList: [], //秒杀配额数据
      suitStoreTypeEnum,
      loading: false,
      showLevelDialog: false,
      showStoreDialog: false,
      groupStoreList: [],
      form: { tableData: [] },
      isDisable: false,
      filterName: null,
      pageParams: {
        pageNo: 1,
        pageSize: 5
      },
      storeIds: null,
      totalCount: 0,
      rules: {
        tableData: [{ validator: checkValidate, trigger: ['blur', 'change'] }]
      }
    };
  },
  watch: {
    quotaList(newVal, oldVal) {
      if (newVal) {
        this.storeQuotaList = newVal;
      }
    }
  },
  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.setQuotaLimitList(this.form.tableData);
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getSeckillList(); // 获取秒杀活动列表
    },
    // 翻页
    onPageChange(page) {
      this.setQuotaLimitList(this.form.tableData);
      this.pageParams.pageNo = page;
      this.getSeckillList(); // 获取秒杀活动列表
    },

    /**
     * 搜索查询
     */
    onSearch() {
      this.pageParams.pageNo = 1;
      this.getSeckillList(); // 获取秒杀活动列表
    },

    //查询门店库存
    getSeckillList() {
      const params = {
        ...this.pageParams,
        ...this.queryParams,
        storeIds: this.storeIds
      };
      // 过滤搜索条件
      if (this.filterName || this.filterName === 0) {
        params.name = this.filterName;
      }
      this.loading = true;
      seckillApi
        .getListQuota(params)
        .done(res => {
          let data = res.data;
          data.forEach((item, index) => {
            //生成唯一id
            item.id = item.storeId.toString() + item.skuId;
            if (item.itemList && item.itemList.length) {
              item.children = item.itemList;
              item.children.forEach(it => {
                //生成唯一id
                it.id = item.storeId.toString() + it.skuId.toString();
                it.storeName = it.itemName;
                it = this.setQuotaLimit(it, item.storeId);
              });
            } else {
              item = this.setQuotaLimit(item, item.storeId);
            }
          });

          this.form.tableData = data;
          this.totalCount = res.totalCount;
        })
        .always(res => {
          this.loading = false;
        });
    },

    //显示列表秒杀配额数据
    setQuotaLimit(data, storeId) {
      this.storeQuotaList.forEach(item => {
        if (item.storeId === storeId && item.skuId === data.skuId) {
          data.quotaLimit = item.quotaLimit;
        }
      });
      return data;
    },

    onGiftDialogOpen() {
      if (this.storeIdList && this.storeIdList.length === 0) {
        this.storeIds = null;
      } else {
        let storeIds = '';
        this.storeIdList.forEach((item, index) => {
          if (index !== 0) {
            storeIds += ',';
          }
          storeIds += item.id;
        });
        this.storeIds = storeIds;
      }
      this.pageParams.pageNo = 1;
      this.getSeckillList();
    },

    onGiftDialogClosed() {},

    //一键配置库存
    onAdd() {
      const params = {
        ...this.queryParams,
        pageNo: 1,
        pageSize: 1000,
        storeIds: this.storeIds
      };
      this.loading = true;
      seckillApi
        .getListQuota(params)
        .done(res => {
          let data = this.formatData(res.data);
          this.form.tableData = this.formatData(this.form.tableData);
          this.setQuotaLimitList(data);
        })
        .always(res => {
          this.loading = false;
        });
    },

    //赋值秒杀配额为可用库存
    formatData(data) {
      data.forEach((item, index) => {
        if (item.itemList && item.itemList.length) {
          item.itemList.forEach(it => {
            if (it.stock !== 0) {
              it.quotaLimit = it.stock;
            }
          });
        } else {
          if (item.stock !== 0) {
            item.quotaLimit = item.stock;
          }
        }
      });
      return data;
    },

    unique(arr) {
      // 根据唯一标识idStr来对数组进行去重
      const res = new Map(); //定义常量 res,值为一个Map对象实例
      //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      arr.forEach(item => {
        item.idStr = item.skuId + item.storeId.toString();
      });
      arr = arr.filter(item => {
        return !res.has(item.idStr) && res.set(item.idStr, 1);
      });

      //去除不必要字段
      arr.forEach(item => {
        delete item.idStr;
      });
      return arr;
    },

    //生成秒杀配额列表
    setQuotaLimitList(data) {
      let storeQuotaList = this.storeQuotaList || [];
      data.forEach(item => {
        if (item.itemList && item.itemList.length) {
          item.itemList.forEach(it => {
            let quotaLimit = {
              storeId: item.storeId,
              skuId: it.skuId,
              ...this.queryParams,
              quotaLimit: it.quotaLimit
            };
            storeQuotaList.unshift(quotaLimit);
          });
        } else {
          let quotaLimit = {
            storeId: item.storeId,
            skuId: item.skuId,
            ...this.queryParams,
            quotaLimit: item.quotaLimit
          };
          storeQuotaList.unshift(quotaLimit);
        }
      });
      //过滤为空的数据
      this.storeQuotaList = this.unique(storeQuotaList).filter(item => {
        return item.quotaLimit;
      });
      console.log(this.storeQuotaList);
    },

    handleSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.setQuotaLimitList(this.form.tableData);
        this.$emit('done', this.storeQuotaList);
        this.mShowDialog = false;
      });
    }
  }
};
</script>
