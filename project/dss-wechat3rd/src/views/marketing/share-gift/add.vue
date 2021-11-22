<template>
  <div class="add">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/share-gift' }">分享有礼</el-breadcrumb-item>
      <el-breadcrumb-item>{{ isEdit ? '新建' : '查看' }}分享有礼</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="courtesy-form" v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" :disabled="!isEdit" label-position="right" label-width="100px">
        <div class="form-area">
          <h4>活动信息</h4>
          <el-form-item label="活动名称：" prop="activityName">
            <el-input :maxlength="15" v-model="form.activityName" style="width: 300px"></el-input>
            <span class="hint">{{ form.activityName ? form.activityName.length : 0 }}/15</span>
          </el-form-item>
          <el-form-item label="活动时间：" prop="time">
            <el-date-picker
              v-model="form.time"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="defaultTime"
              :picker-options="pickerStart"
            ></el-date-picker>
            <!-- <el-form-item prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                :picker-options="pickerStart"
                type="datetime"
                placeholder="开始时间"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                :picker-options="pickerEnd"
                placeholder="结束时间"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>-->
          </el-form-item>
          <el-form-item label="活动门店：" prop="shops">
            <el-radio-group v-model="form.shops">
              <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
              <el-radio :label="suitStoreTypeEnum.part">
                选定门店
                <el-button
                  class="btn-rules left10"
                  v-if="form.shops === suitStoreTypeEnum.part"
                  @click="handleSelectStore"
                  >选择门店</el-button
                >
                <el-button
                  class="btn-rules left10"
                  v-if="form.shops === suitStoreTypeEnum.part"
                  @click="handleImportStore()"
                  >导入门店
                </el-button>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!--已选门店展示区域-->
          <el-form-item v-if="this.storeList.length && form.shops === suitStoreTypeEnum.part">
            <div class="store-label">已选门店</div>
            <div v-if="isEdit">
              <el-tag v-for="(item, index) in storeList" closable :key="item.id" @close="handleDelStoreItem(index)">{{
                item.name
              }}</el-tag>
            </div>
            <div v-else>
              <el-tag v-for="item in storeList" :key="item.id">{{ item.name }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="选择奖励：" prop="award">
            <el-radio-group v-model="form.award">
              <el-form-item prop="couponList">
                <el-radio :label="rightsType.TICKET">
                  送优惠券
                  <el-button
                    size="mini"
                    v-if="form.award === rightsType.TICKET"
                    @click="chooseCoupon"
                    class="choose-coupon"
                    >选择优惠券</el-button
                  >
                </el-radio>
              </el-form-item>
              <el-form-item prop="integralAmount">
                <el-radio :label="rightsType.POINT">
                  积分
                  <span class="points" v-if="form.award === rightsType.POINT">
                    <el-input class="number-input" v-model.number="form.integralAmount"></el-input>积分
                  </span>
                </el-radio>
              </el-form-item>
            </el-radio-group>
          </el-form-item>
          <!--已选优惠券展示区域-->
          <el-form-item v-if="couponList && couponList.length === 1 && form.award === rightsType.TICKET">
            <el-table :data="couponList" class="wkt-table">
              <el-table-column label="优惠券名称">
                <template slot-scope="scope">
                  <span class="ellipsis" :title="scope.row.name">{{ scope.row.name }}</span>
                </template>
              </el-table-column>

              <el-table-column label="最低消费金额" prop="minimumFee">
                <template slot-scope="scope">
                  <span>{{ scope.row.minimumFee | price }}</span>
                </template>
              </el-table-column>

              <el-table-column label="优惠面值" prop="discountFee">
                <template slot-scope="scope">
                  <span>{{ scope.row.discountFee | price }}</span>
                </template>
              </el-table-column>

              <el-table-column label="剩余数量" prop="remainAmount">
                <template slot-scope="scope">
                  <span v-if="scope.row.quantity === 0">无限制</span>
                  <span v-else>{{ scope.row.remainAmount > 0 ? scope.row.remainAmount : '发放完毕' }}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <a class="table-delete" href="javascript:;" v-show="isEdit" @click="handleDelCouponItem(scope.row)"
                    >删除</a
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div class="form-area">
          <el-form-item label="参与次数：" prop="times">
            <el-radio-group v-model="form.times">
              <el-col :span="24">
                <el-form-item prop="dayCount">
                  <el-radio :label="joinAmount.DAYSCOUNT">
                    按天算
                    <span v-if="form.times === joinAmount.DAYSCOUNT" class="edit">
                      每天最多奖励
                      <el-input-number
                        :min="0"
                        :max="maxCount"
                        class="number-input"
                        v-model="form.perPersonPerDayTimes"
                      ></el-input-number
                      >次
                    </span>
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="personCount">
                  <el-radio :label="joinAmount.PERSONCOUNT">
                    按人算
                    <span v-if="form.times === joinAmount.PERSONCOUNT" class="edit">
                      每人最多奖励
                      <el-input-number
                        :min="0"
                        :max="maxCount"
                        class="number-input"
                        v-model="form.perPersonMostTimes"
                      ></el-input-number
                      >次
                    </span>
                  </el-radio>
                </el-form-item>
              </el-col>
            </el-radio-group>
          </el-form-item>

          <div class="customer-tip">* 商家请注意：一旦保存，活动内容将不可修改。</div>
        </div>
      </el-form>
      <local-resolve-xls @resolve="onResolveImportStore" :visible.sync="resolveXlsDialogVisible" title="导入门店" />
      <store-select-dialog
        api-url="/wp/store/query/dept"
        :is-all="true"
        :selected-stores="storeList"
        enable-multiple
        v-model="showStoreDialog"
        @choosed="onStoreChoosed"
      ></store-select-dialog>
      <coupon-select-dialog
        v-model="showCouponDialog"
        :limit="1"
        :check-function="checkCoupon"
        :enable-multiple="false"
        :selected-coupons="form.couponInfoIdList"
        @single-choosed="onCouponsSelected"
      />
    </div>
    <div class="bottom-button">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script>
  import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
  import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index';
  import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index';
  import { rightsType, joinAmount } from '../courtesy/level';
  import regexps from '@/dss-common/utils/regexps.js';
  import shareApi from '@/dss-wechat3rd/src/api/share-gift';
  import courtesyApi from '@/dss-wechat3rd/src/api/courtesy';
  import { mapState } from 'vuex';
  import utils from '@/dss-common/utils/index';
  import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';
  import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
  export default {
    name: 'CourtesyAdd',
    components: {
      LocalResolveXls,
      StoreSelectDialog,
      CouponSelectDialog,
    },
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
      const { name, positiveInt } = regexps;
      const awardValidator = (rule, value, callback) => {
        console.log('this.form.award == ', this.form.award, rightsType.TICKET);
        // 优惠券
        if (this.form.award === rightsType.TICKET) {
          if (!this.couponList || this.couponList.length !== 1) {
            callback('请只选择一张优惠券');
          } else {
            callback();
          }
        }
        // 积分
        else {
          if (!this.form.integralAmount) {
            return callback(new Error('请输入积分'));
          } else if (this.form.integralAmount === 0 || this.form.integralAmount === '0') {
            return callback(new Error('积分需要大于0'));
          } else if (!positiveInt.reg.test(this.form.integralAmount)) {
            return callback(new Error(positiveInt.msg));
          } else {
            return callback();
          }
        }
      };
      const timesValidator = (rule, value, callback) => {
        if (this.form.times === joinAmount.PERSONCOUNT) {
          if (!this.form.perPersonMostTimes) {
            return callback('请输入按人算的次数');
          } else if (!positiveInt.reg.test(this.form.perPersonMostTimes)) {
            return callback(new Error(positiveInt.msg));
          } else {
            return callback();
          }
        } else {
          if (!this.form.perPersonPerDayTimes) {
            return callback('请输入按天算的次数');
          } else if (!positiveInt.reg.test(this.form.perPersonPerDayTimes)) {
            return callback(new Error(positiveInt.msg));
          } else {
            return callback();
          }
        }
      };
      // const beginTimeValidator = (rule, value, callback) => {
      //   if (!this.form.beginTime) {
      //     return callback('请输入开始时间');
      //   } else if (new Date(this.form.beginTime).getTime() < Date.now()) {
      //     return callback('开始时间必须大于当前时间（精确到秒）');
      //   } else {
      //     callback();
      //   }
      // };
      // const endTimeValidator = (rule, value, callback) => {
      //   if (!this.form.endTime) {
      //     return callback('请输入结束时间');
      //   } else if (new Date(this.form.endTime).getTime() < Date.now()) {
      //     return callback('结束时间必须大于当前时间（精确到秒）');
      //   } else if (
      //     this.form.beginTime &&
      //     new Date(this.form.endTime).getTime() <= new Date(this.form.beginTime).getTime()
      //   ) {
      //     return callback('结束时间必须大于开始时间(精度到秒)');
      //   } else {
      //     callback();
      //   }
      // };
      const timeValidator = (rule, value, callback) => {
        if (!this.form.time || this.form.time.length < 2 || !this.form.time[0] || !this.form.time[1]) {
          return callback('请输入完整的活动时间');
        }
        // 时间小的为开始时间
        const [beginTime, endTime] =
          new Date(this.form.time[0]) <= new Date(this.form.time[1]) ? this.form.time : this.form.time.reverse();

        if (new Date(beginTime).getTime() < Date.now()) {
          return callback('开始时间必须大于当前时间（精确到秒）');
        }
        callback();
      };
      return {
        loading: false,
        resolveXlsDialogVisible: false,
        suitStoreTypeEnum,
        rightsType,
        joinAmount,
        sharePresentInfoId: null,
        form: {
          activityName: '',
          // beginTime: '',
          // endTime: '',
          shops: suitStoreTypeEnum.all,
          award: rightsType.TICKET,
          couponList: [],
          times: joinAmount.DAYSCOUNT,
          integralAmount: '0', // 积分默认为0
          perPersonPerDayTimes: '',
          perPersonMostTimes: '',
          allCouponList: [],
        },
        rules: {
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度15字以内', trigger: 'blur' },
          ],
          time: [{ required: true, validator: timeValidator, trigger: 'blur' }],
          // beginTime: [{ required: true, validator: beginTimeValidator, trigger: 'blur' }],
          // endTime: [{ required: true, validator: endTimeValidator, trigger: 'blur' }],
          shops: [{ required: true, validator: storeValidator, trigger: 'change' }],
          award: [{ required: true, validator: awardValidator, trigger: 'blur' }],
          times: [{ required: true, validator: timesValidator, trigger: 'change' }],
        },
        storeList: [],
        showStoreDialog: false,
        groupStoreList: [],
        showCouponDialog: false,
        showGroupDialog: false,
        couponList: [],
        couponId: null,
        activityStoresIds: null, // 活动门店ID(逗号分隔)(示例: ,1,2,3, )
        // pickerStart: {
        //   disabledDate: time => {
        //     let endDate = this.form.endTime;
        //     if (!!endDate) {
        //       return time.getTime() < Date.now() - 8.64e7; //只能选择今天以后的日期
        //     } else {
        //       return time.getTime() > endDate && time.getTime() < Date.now() - 8.64e7;
        //     }
        //   }
        // },
        pickerEnd: {
          disabledDate: time => {
            const startDate = this.form.beginTime;
            if (startDate) {
              return time.getTime() < Date.now() - 8.64e7; // 只能选择今天以后的日期
            } else {
              return time.getTime() < startDate && time.getTime() < Date.now() - 8.64e7;
            }
          },
        },
      };
    },
    computed: {
      isEdit() {
        return !this.sharePresentInfoId;
      },
      maxCount() {
        if (this.form.award === rightsType.POINT) {
          return Number.MAX_SAFE_INTEGER;
        }
        if (this.form.award === rightsType.TICKET && this.couponList.length) {
          const current = this.couponList[0];
          if (!current.quantity) return Infinity;
          return current.remainAmount;
        }
        return 0;
      },
      ...mapState({
        userInfo: state => state.userInfo,
        allStoreList: 'storeList',
      }),
      pickerStart() {
        return {
          disabledDate: time => time.getTime() < Date.now() - 24 * 60 * 60 * 1000, // 只能选择今天以后的日期
        };
      },
      defaultTime() {
        const nowDate = new Date();
        const hour = nowDate.getHours() + parseInt((nowDate.getMinutes() + 1) / 60);
        // 默认加 1 分钟
        const min = (nowDate.getMinutes() + 1) % 60;
        const seconds = nowDate.getSeconds();
        return [`${hour}:${min}:${seconds}`];
      },
    },
    methods: {
      formatTime(value) {
        return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
      },
      // 填充表格信息
      fillForm() {
        // 店铺列表可多选
        if (this.storeList.length) {
          const stores = [];
          this.storeList.forEach(e => {
            stores.push(',' + e.id);
          });
          this.activityStoresIds = stores.join('') + ',';
        }
      },
      checkCoupon(couponItem) {
        let flag = couponItem.fixedTerm !== null;
        if (!flag) {
          this.$message.error('该活动不可选择有效期为时间段的优惠券！');
        } else if (couponItem.receiveMethod === couponEnum.receiveMethod.custom) {
          flag = false;
          this.$message.error('该活动只支持免费领取的优惠券！');
        }
        return flag;
      },
      onSave() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.fillForm();
            // 验证通过新增分享有礼todo
            const [beginTime, endTime] =
              new Date(this.form.time[0]) <= new Date(this.form.time[1]) ? this.form.time : this.form.time.reverse();

            const params = {
              // per_chooseAppId: this.userInfo.appInfo.id,
              // per_userId: this.userInfo.userId,
              activityName: this.form.activityName,
              beginTime: this.formatTime(beginTime).toString(),
              endTime: this.formatTime(endTime).toString(),
              activityStoresSelectType: this.form.shops === suitStoreTypeEnum.all ? 1 : 2,
              activityStoresIds: this.form.shops === suitStoreTypeEnum.all ? null : this.activityStoresIds,
              rewardSelectType: this.form.award === rightsType.TICKET ? 1 : 2,
              couponTicketId: this.form.award === rightsType.TICKET ? this.couponId : null,
              integralAmount: this.form.award === rightsType.TICKET ? null : this.form.integralAmount,
              participationTimesSelectType: this.form.times === joinAmount.DAYSCOUNT ? 1 : 2,
              perPersonPerDayTimes: this.form.times === joinAmount.DAYSCOUNT ? this.form.perPersonPerDayTimes : null,
              perPersonMostTimes: this.form.times === joinAmount.DAYSCOUNT ? null : this.form.perPersonMostTimes,
            };
            console.log('params', params);
            shareApi
              .add(params)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '新增分享有礼成功!',
                });
                this.$router.push('/marketing/share-gift'); // 跳转至列表页
              })
              .catch(err => {
                console.error('新增分享有礼err', err);
              });
          } else {
            return false;
          }
        });
      },
      handleSelectStore() {
        this.showStoreDialog = true;
      },
      // 调取分享有礼详情接口
      getDetail(id) {
        shareApi
          .detail(id)
          .then(res => {
            // console.log('detail------>', res);
            if (res.data === null) {
              // 请求后端成功，但返回data为空（data为空，id有可能是乱填的），把id置为null
              this.id = null;
              this.$router.push('/marketing/share-gift/add');
              return;
            }
            this.setFormData(res.data || {});
          })
          .finally(_ => {
            this.loading = false;
          });
      },
      // 填充表单数据(从查看详情进入)
      setFormData(data) {
        console.log('data', data);
        for (const key in data) {
          // if (key === 'beginTime') {
          //   this.form.beginTime = new Date(data.beginTime);
          //   continue;
          // } else if (key === 'endTime') {
          //   this.form.endTime = new Date(data.endTime);
          //   continue;
          // }
          if (key === 'integralAmount') {
            this.form.integralAmount = data.integralAmount;
            continue;
          }
          this.form[key] = data[key];
        }
        this.form.time = [data.beginTime, data.endTime];
        // activityStoresIds存在并且activityStoresSelectType为2，门店选择为部分门店，展示出选择的门店名
        if (data.activityStoresIds && data.activityStoresSelectType === 2) {
          let storeIdList = data.activityStoresIds.split(',');
          storeIdList = storeIdList.filter(storeId => {
            return !!storeId;
          });
          this.form.shops = suitStoreTypeEnum.part;
          storeIdList.forEach(storeId => {
            const findStore = this.allStoreList.find(store => {
              return store.id === parseInt(storeId);
            });
            if (findStore) {
              this.storeList.push(findStore);
            }
          });
        } else {
          this.form.shops = suitStoreTypeEnum.all;
        }
        // 1-按天算 2-按人算
        if (data.participationTimesSelectType === 1) {
          this.form.times = joinAmount.DAYSCOUNT;
          this.form.perPersonPerDayTimes = data.perPersonPerDayTimes;
        } else {
          this.form.times = joinAmount.PERSONCOUNT;
          this.form.perPersonMostTimes = data.perPersonMostTimes;
        }
        // 1-优惠券 2-积分
        if (data.rewardSelectType === 1) {
          this.form.award = rightsType.TICKET; // 优惠券
          const findCoupon = this.allCouponList.find(item => {
            return item.id === data.couponTicketId;
          });
          if (findCoupon) {
            // console.log('findCoupon--->', findCoupon);
            this.couponList.push(findCoupon);
            // console.log('详情couponList----->', this.couponList);
          }
        } else {
          this.form.award = rightsType.POINT;
        }
      },
      handleDelStoreItem(index) {
        this.storeList.splice(index, 1);
      },
      onGroupItemsSelected(groups) {
        this.addForm[this.addForm.currentGroupType] = groups;
        // 主动除非表单进行验证
        this.$refs.addForm.validateField('currentGroupType');
      },
      onStoreChoosed(storeList) {
        this.storeList = storeList;
        this.assembleGroupStoreList();
        this.$refs.form.validateField('shops');
      },

      handleImportStore() {
        this.resolveXlsDialogVisible = true;
      },

      onResolveImportStore(list) {
        this.storeList = list;
        this.assembleGroupStoreList();
        this.$refs.form.validateField('shops');
      },
      assembleGroupStoreList() {
        this.groupStoreList = [];
        let start = 0;
        const storeGroupCount = 6;
        while (start < this.storeList.length) {
          // 每6个分成一组展示
          this.groupStoreList.push(this.storeList.slice(start, start + storeGroupCount));
          start += storeGroupCount;
        }
      },
      onCouponsSelected(coupons) {
        this.couponId = coupons.id;
        this.couponList.push(coupons);
        this.$refs.form.validateField('couponList');
      },
      handleDelCouponItem(item) {
        this.couponList.splice(this.couponList.indexOf(item), 1);
      },
      onCancel() {
        this.$router.push('/marketing/share-gift');
      },
      chooseCoupon() {
        if (this.couponList.length === 0) {
          this.showCouponDialog = true;
        }
      },
    },
    mounted() {
      // console.log('userInfo--------->', this.userInfo);
      this.loading = true;
      courtesyApi
        .getCouponList()
        .then(res => {
          this.allCouponList = res.data;
        })
        .catch(err => {
          console.error('获取所有优惠券err', err);
        })
        .finally(e => {
          const sharePresentInfoId = this.$route.query.sharePresentInfoId;
          if (!sharePresentInfoId) {
            this.loading = false;
          } else {
            this.sharePresentInfoId = sharePresentInfoId;
            // console.log('sharePresentInfoId--->', sharePresentInfoId);
            this.getDetail(sharePresentInfoId);
          }
        });
    },
  };
</script>

<style lang="less">
  .courtesy-form {
    // margin-top: 20px;
    background: #fff;
    .form-area {
      padding: 0 20px 20px 20px;
      .el-tag {
        margin-right: 10px;
      }
      .hint {
        color: #999999;
        font-size: 14px;
        font-weight: normal;
        margin-left: 5px;
      }
      h4 {
        margin-bottom: 20px;
      }

      .divider {
        margin: 0 10px;
      }

      .number-input {
        width: 157px;
        margin: 0 5px;
      }
      .customer-tip {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        font-family: PingFangSC-Regular;
        padding: 0 20px 20px 20px;
      }
    }
  }
</style>
