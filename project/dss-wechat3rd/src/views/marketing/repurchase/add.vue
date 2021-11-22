<template>
  <div class="add">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/repurchase/list' }">加价换购</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEdit?'新建':'编辑'}}加价换购</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="repurchase-form">
      <el-form v-loading="loading"
               ref="form"
               @submit.native.prevent
               :model="form"
               :rules="rules"
               size="mini"
               label-position="right"
               label-width="100px">
        <el-form-item label="活动名称："
                      prop="repurchaseActivityName">
          <el-input placeholder="如：开业筹备活动、最多20字"
                    v-model="form.repurchaseActivityName"
                    :maxlength="20"
                    style="width: 300px"
                    :disabled="activityStatus === 1 || activityStatus === 2"></el-input>
          <span class="hint">{{form.repurchaseActivityName?form.repurchaseActivityName.length:0}}/20</span>
        </el-form-item>
        <el-form-item label="活动时间："
                      prop="beginTime">
          <el-date-picker :disabled="activityStatus === 1 || activityStatus === 2"
                          style="width: 300px"
                          v-model="form.beginTime"
                          :picker-options="pickerStart"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          format="yyyy-MM-dd HH:mm:ss"
                          :default-time="['00:00:00', '23:59:59']"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动门店："
                      prop="shops">
          <el-radio-group v-model="form.shops">
            <el-radio :label="suitStoreTypeEnum.all"
                      :disabled="activityStatus === 2">全部门店</el-radio>
            <el-radio :label="suitStoreTypeEnum.part"
                      :disabled="activityStatus === 2">
              选定门店
              <el-button :disabled="activityStatus === 2"
                         class="btn-rules left10"
                         v-if="form.shops === suitStoreTypeEnum.part"
                         @click="handleSelectStore">选择门店</el-button>
            </el-radio>
            <p class="yellow-tips"
               v-if="form.shops === suitStoreTypeEnum.all">提示：您选择的门店有正在「进行中」的下单有礼活动，如需叠加本次活动，则忽略此条提示。</p>
          </el-radio-group>
        </el-form-item>
        <!--已选门店展示区域-->
        <el-form-item v-if="this.storeList.length && form.shops === suitStoreTypeEnum.part">
          <div class="store-label">已选门店</div>
          <div v-if="!isEdit">
            <el-tag v-for="item in storeList"
                    :key="item.id">{{item.name}}</el-tag>
          </div>
          <div v-else>
            <el-tag v-for="(item, index) in storeList"
                    closable
                    :key="item.id"
                    @close="handleDelStoreItem(index)">{{item.name}}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="活动商品："
                      prop="ACTableData">
          <el-button :disabled="activityStatus === 2"
                     class="btn-rules left10"
                     @click="handleSelectCommodity('ACTableData')">选择商品</el-button>
          <el-table :data="form.ACTableData"
                    style="width: 500px;"
                    v-if="form.ACTableData && form.ACTableData.length">
            <el-table-column label="商品名称">
              <span slot-scope="scope"
                    class="ellipsis"
                    :title="scope.row.name || scope.row.itemName">
                {{ scope.row.name || scope.row.itemName }}
              </span>
            </el-table-column>
            <el-table-column width="200"
                             label="售价">
              <template slot-scope="scope">
                ￥{{scope.row.salePrice|price}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="93">
              <template slot-scope="scope">
                <a :style="{ 'color': activityStatus === 2 ? '#c0c4cc' : '', 'cursor': activityStatus === 2 ? 'no-drop' : '' }"
                   href="javascript:;"
                   @click="handleRemove(scope.$index, commodityType = 'ACTableData')">
                  删除
                </a>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="使用门槛："
                      prop="repurchaseThresholdFee">
          <p class="amount">
            活动商品总额满
            <el-input :disabled="activityStatus === 2"
                      v-model="form.repurchaseThresholdFee"
                      size="mini"
                      aria-placeholder="输入金额"
                      style="width: 100px;margin: 0 5px;"
                      @blur="inputBlur($event, 'repurchaseThresholdFee')"></el-input>元
          </p>
        </el-form-item>
        <el-form-item label="加价金额："
                      prop="repurchaseMarkupFee">
          <p class="amount">
            加
            <el-input :disabled="activityStatus === 2"
                      v-model="form.repurchaseMarkupFee"
                      size="mini"
                      aria-placeholder="输入金额"
                      style="width: 100px;margin: 0 5px;"
                      @blur="inputBlur($event, 'repurchaseMarkupFee')"></el-input>元换购以下任意一种商品
          </p>
        </el-form-item>
        <el-form-item label="换购商品："
                      prop="RTableData">
          <el-button :disabled="activityStatus === 2"
                     class="btn-rules left10"
                     @click="handleSelectCommodity('RTableData')">选择商品</el-button>
          <el-table :data="form.RTableData"
                    style="width: 500px;"
                    v-if="form.RTableData && form.RTableData.length">
            <el-table-column label="商品名称">
              <span slot-scope="scope"
                    class="ellipsis"
                    :title="scope.row.name || scope.row.itemName">
                {{ scope.row.name || scope.row.itemName }}
              </span>
            </el-table-column>
            <el-table-column width="200"
                             label="售价">
              <template slot-scope="scope">
                ￥{{scope.row.salePrice|price}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="93">
              <template slot-scope="scope">
                <a :style="{ 'color': activityStatus === 2 ? '#c0c4cc' : '', 'cursor': activityStatus === 2 ? 'no-drop' : '' }"
                   href="javascript:;"
                   @click="handleRemove(scope.$index, commodityType = 'RTableData')">
                  删除
                </a>
              </template>
            </el-table-column>
          </el-table>
          <div class="desc-tip"
               v-show="form.RTableData.length !== 0">参与换购商品的售价须大于加价金额，如：加1元商品换购售价10元的果汁一瓶。</div>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCancel"
                     :loading="isLoading">取消</el-button>
          <el-button type="primary"
                     @click="onSubmit('form')"
                     :loading="isLoading"
                     :disabled="activityStatus === 2">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <goods-select-dialog v-model="showAddGoodsDialog"
                         enable-multiple
                         :extParams="goodsExtParams"
                         :selected-list="commodityType === 'ACTableData' ? form.ACTableData : form.RTableData"
                         @selected="onChooseGoods" />
    <store-select-dialog api-url="/wp/store/query/dept"
                         :is-all="true"
                         :selected-stores="storeList"
                         enable-multiple
                         v-model="showStoreDialog"
                         @choosed="onStoreChoosed"></store-select-dialog>
  </div>
</template>

<script>
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import regexps from '@/dss-common/utils/regexps.js';
import repurchaseApi from '@/dss-wechat3rd/src/api/repurchaseApi.js';
import { mapState } from 'vuex';

export default {
  components: { GoodsSelectDialog, StoreSelectDialog },
  data() {
    const storeValidator = (rule, value, callback) => {
      if (this.form.shops === suitStoreTypeEnum.all) {
        return callback();
      } else {
        if (this.storeList && this.storeList.length) {
          return callback();
        } else {
          return callback('请至少选择一个门店');
        }
      }
    };
    const ACTableDataValidator = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请选择活动商品'));
      }
      return callback();
      // if (value.length === 0) {
      //   return callback(new Error('请选择活动商品'));
      // } else {
      //   if (this.form.repurchaseThresholdFee === '') {
      //     return callback();
      //   } else {
      //     let arr = (value || []).filter(
      //       item => Number(item.salePrice / 100) >= Number(this.form.repurchaseThresholdFee)
      //     );
      //     if (arr.length !== 0) {
      //       return callback(new Error('参与活动商品的售价须小于使用门槛金额'));
      //     } else {
      //       return callback();
      //     }
      //   }
      // }
    };
    const { name, money } = regexps;
    const repurchaseThresholdFeeValidator = (rule, value, callback) => {
      if (!money.reg.test(value)) {
        return callback(new Error(money.msg));
      } else {
        return callback();
      }
      // if (!money.reg.test(value)) {
      //   return callback(new Error(money.msg));
      // } else {
      //   let testPrice = false,
      //     testCommodityPrice = false;

      //   // 判断使用门槛金额是否大于加价金额
      //   if (this.form.repurchaseMarkupFee !== '') {
      //     if (Number(value) > Number(this.form.repurchaseMarkupFee)) {
      //       testPrice = true;
      //     } else {
      //       return callback(new Error('使用门槛金额需大于加价金额'));
      //     }
      //   } else {
      //     testPrice = true;
      //   }

      //   // 判断使用门槛金额是否大于商品售价
      //   if (this.form.ACTableData.length !== 0) {
      //     let arr = (this.form.ACTableData || []).filter(item => Number(item.salePrice / 100) >= Number(value));
      //     if (arr.length !== 0) {
      //       return callback(new Error('使用门槛金额需大于活动商品售价'));
      //     } else {
      //       testCommodityPrice = true;
      //     }
      //   } else {
      //     testCommodityPrice = true;
      //   }

      //   if (testPrice && testCommodityPrice) {
      //     return callback();
      //   }
      // }
    };
    const repurchaseMarkupFeeValidator = (rule, value, callback) => {
      if (!money.reg.test(value)) {
        return callback(new Error(money.msg));
      } else {
        let testPrice = false,
          testCommodityPrice = false;

        // 判断加价金额是否小于使用门槛金额
        if (this.form.repurchaseThresholdFee !== '') {
          if (Number(value) < Number(this.form.repurchaseThresholdFee)) {
            testPrice = true;
          } else {
            return callback(new Error('加价金额不可大于商品售价'));
          }
        } else {
          testPrice = true;
        }

        // 判断价金额是否小于换购商品售价
        if (this.form.RTableData.length !== 0) {
          let arr = (this.form.RTableData || []).filter(
            item => Number(item.salePrice / 100) <= Number(this.form.repurchaseMarkupFee)
          );
          if (arr.length !== 0) {
            return callback(new Error('加价金额需大于参与换购商品的售价'));
          } else {
            testCommodityPrice = true;
          }
        } else {
          testCommodityPrice = true;
        }

        if (testPrice && testCommodityPrice) {
          return callback();
        }
      }
    };
    const RTableDataValidator = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请选择换购商品'));
      } else {
        return callback();
      }
      // if (value.length === 0) {
      //   return callback(new Error('请选择换购商品'));
      // } else {
      //   if (this.form.repurchaseMarkupFee === '') {
      //     return callback();
      //   } else {
      //     let arr = (value || []).filter(item => Number(item.salePrice / 100) <= Number(this.form.repurchaseMarkupFee));
      //     if (arr.length !== 0) {
      //       return callback(new Error('参与换购商品的售价须大于加价金额'));
      //     } else {
      //       return callback();
      //     }
      //   }
      // }
    };
    return {
      loading: false,
      isEdit: true,
      isLoading: false,
      form: {
        repurchaseActivityName: '',
        beginTime: [],
        shops: suitStoreTypeEnum.all,
        ACTableData: [],
        repurchaseThresholdFee: '',
        repurchaseMarkupFee: '',
        RTableData: []
      },
      rules: {
        repurchaseActivityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        beginTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
        shops: [{ required: true, validator: storeValidator, trigger: 'change' }],
        ACTableData: [{ type: 'array', required: true, validator: ACTableDataValidator, trigger: 'change' }],
        repurchaseThresholdFee: [{ required: true, validator: repurchaseThresholdFeeValidator, trigger: 'blur' }],
        repurchaseMarkupFee: [{ required: true, validator: repurchaseMarkupFeeValidator, trigger: 'blur' }],
        RTableData: [{ type: 'array', required: true, validator: RTableDataValidator, trigger: 'change' }]
      },
      pickerStart: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7; //只能选择今天以后的日期
        }
      },
      suitStoreTypeEnum,
      showStoreDialog: false,
      storeList: [],
      commodityType: '',
      showAddGoodsDialog: false,
      currentId: null,
      goodsExtParams: {
        tagNoEqualsList: `${1 << 14},${1 << 15}` /*参加加价购活动的商品，不再展示出来*/
      },
      activityStatus: 0
    };
  },

  mounted() {
    if (this.$route.query && this.$route.query.id) {
      this.currentId = this.$route.query.id;
      this.isEdit = false;
      this.getDetail();
    }
  },

  computed: {
    ...mapState({
      allStoreList: 'storeList'
    })
  },

  methods: {
    getDetail() {
      this.loading = true;
      if (!this.currentId || this.currentId === '') {
        this.$router.push('/marketing/repurchase/list');
      }
      repurchaseApi
        .repurchaseDetail({
          activityId: this.currentId
        })
        .then(res => {
          if (res.data) {
            this.activityStatus = res.data.status || 0;

            this.form.repurchaseActivityName = res.data.repurchaseActivityName || '';

            if (res.data.startTime && res.data.endTime) {
              this.form.beginTime = [res.data.startTime, res.data.endTime];
            }

            if (!res.data.storeIds || res.data.storeIds === '') {
              this.form.shops = 0;
            } else {
              this.form.shops = 1;
              let storeList = res.data.storeIds.split('|');
              storeList.shift();
              storeList.pop();

              storeList.forEach(storeId => {
                const findStore = this.allStoreList.find(store => {
                  return store.id === parseInt(storeId);
                });
                if (findStore) {
                  this.storeList.push(findStore);
                }
              });
            }

            this.form.ACTableData = res.data.joinRepurchaseActivityItemDTOList || [];
            this.form.RTableData = res.data.canRepurchaseItemDTOList || [];

            if (res.data.repurchaseThresholdFee && res.data.repurchaseThresholdFee !== '') {
              this.form.repurchaseThresholdFee = parseInt(res.data.repurchaseThresholdFee || 0) / 100;
            }

            if (res.data.repurchaseMarkupFee && res.data.repurchaseMarkupFee !== '') {
              this.form.repurchaseMarkupFee = parseInt(res.data.repurchaseMarkupFee || 0) / 100;
            }
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    handleSelectCommodity(type) {
      this.commodityType = type;
      this.showAddGoodsDialog = true;
    },

    handleSelectStore() {
      this.showStoreDialog = true;
    },

    handleDelStoreItem(index) {
      this.storeList.splice(index, 1);
      if (this.storeList.length === 0) {
        this.$refs.form.validateField('shops');
      }
    },

    onStoreChoosed(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.form.validateField('shops');
    },

    assembleGroupStoreList() {
      this.groupStoreList = [];
      let start = 0;
      const storeGroupCount = 6;
      while (start < this.storeList.length) {
        //每6个分成一组展示
        this.groupStoreList.push(this.storeList.slice(start, start + storeGroupCount));
        start += storeGroupCount;
      }
    },

    // 选择商品
    onChooseGoods(list) {
      this.form[this.commodityType] = list;
      this.$refs.form.validateField(this.commodityType);
      if (this.commodityType === 'RTableData') {
        this.$refs.form.validateField('repurchaseMarkupFee');
      }
    },

    // 删除商品
    handleRemove(index, type) {
      if (this.activityStatus === 2) return;
      this.form[this.commodityType].splice(index, 1);
      this.$refs.form.validateField(this.commodityType);
    },

    onSubmit(formName) {
      this.$refs[formName].validate().then(valid => {
        if (valid) {
          const {
            repurchaseActivityName,
            beginTime,
            shops,
            ACTableData,
            repurchaseThresholdFee,
            repurchaseMarkupFee,
            RTableData
          } = this.form;

          let ACTableList = ACTableData.map(item => {
            return {
              activityId: item.activityId || '',
              itemNo: item.itemNo,
              skuId: item.skuId || '',
              barcode: item.barcode || '',
              itemName: item.name || item.itemName || '',
              itemThumbnail: item.thumbnail || item.itemThumbnail || '',
              salePrice: item.salePrice
            };
          });

          let RTableList = RTableData.map(item => {
            return {
              activityId: item.activityId || '',
              itemNo: item.itemNo,
              skuId: item.skuId || '',
              barcode: item.barcode || '',
              itemName: item.name || item.itemName || '',
              itemThumbnail: item.thumbnail || item.itemThumbnail || '',
              salePrice: item.salePrice
            };
          });

          let params = {
            id: this.currentId,
            repurchaseActivityName,
            startTime: beginTime[0],
            endTime: beginTime[1],
            repurchaseThresholdFee: parseFloat(repurchaseThresholdFee) * 100,
            repurchaseMarkupFee: parseFloat(repurchaseMarkupFee) * 100,
            joinRepurchaseActivityItemDTOList: ACTableList,
            canRepurchaseItemDTOList: RTableList
          };

          if (shops === 1) {
            let storeListId = this.storeList.map(item => item.id).join('|');
            storeListId = `|${storeListId}|`;
            params.storeIds = storeListId;
          }

          if (this.currentId !== '') {
            params.id = this.currentId;
          }

          this.isLoading = true;

          repurchaseApi
            .addRepurchase(params)
            .then(res => {
              this.$message.success('保存成功！');
              this.$router.push('/marketing/repurchase/list');
            })
            .always(() => {
              this.isLoading = false;
            });
        }
      });
    },

    inputBlur(e, type) {
      // if (type === 'repurchaseThresholdFee') {
      //   this.$refs.form.validateField('ACTableData');
      // }
      if (type === 'repurchaseMarkupFee' && this.form.RTableData.length !== 0) {
        this.$refs.form.validateField('RTableData');
      }
    },

    onCancel() {
      this.$router.push({
        path: '/marketing/repurchase/list'
      });
    }
  }
};
</script>

<style lang="less">
.repurchase-form {
  margin: 20px;
}

.hint {
  color: #999999;
  font-size: 14px;
  font-weight: normal;
  margin-left: 5px;
}

.customer-tip {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  font-family: PingFangSC-Regular;
  padding: 0 20px 20px 20px;
}

.form-area {
  padding: 0 20px;
  .red {
    color: #f56c6c;
    margin-right: 4px;
  }
  h4 {
    margin-bottom: 20px;
  }
  .activity-img-area {
    width: 315px;
    height: 74px;
  }
  .yellow-tips {
    color: #fdcb60;
    font-size: 14px;
    font-weight: 500;
    margin-top: 20px;
  }

  .divider {
    margin: 0 10px;
  }
  .ticket,
  .lucky-turning {
    position: relative;
    cursor: pointer;
  }
  .img-title {
    position: absolute;
    color: #ffffff;
    top: 22px;
    left: 76px;
    //width: 154px;
  }
  .turning-title {
    position: absolute;
    color: #ffffff;
    top: 19px;
    left: 84px;
    width: 154px;
    line-height: 20px;
  }
}
</style>
