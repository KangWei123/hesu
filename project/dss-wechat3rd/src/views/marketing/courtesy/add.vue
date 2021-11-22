<template>
  <div class="add">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/courtesy' }">下单有礼</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEdit?'新建':'查看'}}下单有礼</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="courtesy-orderlist-form">
      <el-form ref="form"
               @submit.native.prevent
               :model="form"
               :rules="rules"
               :disabled="!isEdit"
               label-position="right"
               label-width="100px">
        <div class="form-area">
          <h4>活动信息</h4>
          <el-form-item label="活动名称："
                        prop="activityName">
            <el-input v-model="form.activityName"
                      :maxlength="15"
                      style="width: 300px"></el-input>
            <span class="hint">{{form.activityName?form.activityName.length:0}}/15</span>
          </el-form-item>

          <el-form-item label="活动时间："
                        prop="time">
            <el-date-picker v-model="form.time"
                            type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="defaultTime"
                            :picker-options="pickerStart"></el-date-picker>
          </el-form-item>
        </div>
        <div class="form-area">
          <h4>参与条件</h4>
          <el-form-item label="活动门店："
                        prop="shops"
                        class="shops-form-item"
                        required>
            <el-radio-group v-model="form.shops">
              <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
              <el-radio :label="suitStoreTypeEnum.part">
                选定门店
                <el-button class="btn-rules left10"
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
              <el-tag v-for="(item) in storeList"
                      :key="item.id">{{item.name}}</el-tag>
            </div>
            <div v-else>
              <el-tag v-for="(item,index) in storeList"
                      closable
                      :key="item.id"
                      @close="handleDelStoreItem(index)">{{item.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="会员等级："
                        prop="level"
                        required>
            <el-radio-group v-model="form.level">
              <el-radio :label="vip.all">全部会员</el-radio>
              <el-radio :label="vip.part">
                选定会员等级
                <el-button size="mini"
                           v-if="form.level === vip.part"
                           @click="handleSelectLevel">选择等级</el-button>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!--已选会员等级展示区域-->
          <el-form-item v-if="form.level === vip.part && selectedLevelList.length">
            <div class="store-label">已选会员等级</div>
            <div v-if="!isEdit">
              <el-tag v-for="(item,index) in selectedLevelList"
                      :key="item.id">{{item.name}}</el-tag>
            </div>
            <div v-else>
              <el-tag v-for="(item,index) in selectedLevelList"
                      :key="item.id"
                      closable
                      @close="handleDellevelItem(index)">{{item.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="消费金额："
                        prop="activityOrderConsume">
            <p class="amount">
              满
              <el-input v-model.number="form.activityOrderConsume"
                        aria-placeholder="输入金额"
                        placeholder="请输入"
                        style="width: 100px;margin: 0 5px;"></el-input>元，参与下单有礼。
            </p>
          </el-form-item>
          <el-form-item label="付款场景："
                        prop="scene">
            <el-checkbox-group v-model="form.scene">
              <el-checkbox v-for="tag in tags"
                           :key="tag.id"
                           :label="tag.name"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="form-area">
          <h4>
            下单有礼
            <span class="hint hint-tips">友情提示：请在创建相关优惠券/幸运转盘活动时确保活动参与条件与下单有礼参与条件保持一致，否则可能导致用户无法参加下单有礼。</span>
          </h4>
          <el-form-item label="选择权益："
                        prop="rights">
            <el-radio-group v-model="form.rights">
              <el-col>
                <el-form-item prop="couponList">
                  <el-radio :label="rightsType.TICKET">
                    送优惠券
                    <el-button size="mini"
                               v-if="form.rights===rightsType.TICKET"
                               @click="chooseCoupon"
                               class="choose-coupon">选择优惠券</el-button>
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item prop="lucky">
                  <el-radio :label="rightsType.LUCKY">
                    幸运转盘
                    <el-button size="mini"
                               :disabled="!form.time.length"
                               v-if="form.rights===rightsType.LUCKY"
                               @click="chooseLucky"
                               class="choose-coupon">选择幸运转盘</el-button>
                    <p class="error"
                       v-if="!form.time.length&&form.rights===rightsType.LUCKY">请先设置下单有礼的活动时间</p>
                  </el-radio>
                </el-form-item>
              </el-col>
            </el-radio-group>
          </el-form-item>
          <!--已选优惠券展示区域-->
          <el-form-item v-if="couponList && couponList.length===1 && form.rights===rightsType.TICKET">
            <el-table :data="couponList"
                      class="wkt-table">
              <el-table-column label="优惠券名称">
                <template slot-scope="scope">
                  <span class="ellipsis"
                        :title="scope.row.name">{{scope.row.name}}</span>
                </template>
              </el-table-column>

              <el-table-column label="最低消费金额"
                               prop="minimumFee">
                <template slot-scope="scope">
                  <span>{{ scope.row.minimumFee | price}}</span>
                </template>
              </el-table-column>

              <el-table-column label="优惠面值">
                <template slot-scope="scope">
                  <span>{{ scope.row.discountFee | price}}</span>
                </template>
              </el-table-column>

              <el-table-column label="剩余数量">
                <template slot-scope="scope">
                  <span v-if="scope.row.quantity===0">无限制</span>
                  <span v-else>{{scope.row.remainAmount>0?scope.row.remainAmount:'发放完毕'}}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作"
                               width="100">
                <template slot-scope="scope">
                  <a href="javascript:;"
                     v-show="isEdit"
                     @click="handleDelCouponItem(scope.row)">删除</a>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!--已选幸运转盘展示区域-->
          <el-form-item v-if="luckyList && luckyList.length===1 && form.rights===rightsType.LUCKY">
            <el-table :data="luckyList"
                      class="wkt-table">
              <el-table-column label="活动名称">
                <template slot-scope="scope">
                  <span class="ellipsis"
                        :title="scope.row.activityName">{{scope.row.activityName}}</span>
                </template>
              </el-table-column>

              <el-table-column label="活动时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.activityStartTime | time}} 至 {{ scope.row.activityEndTime | time}}</span>
                </template>
              </el-table-column>
              <el-table-column label="活动类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.participationType===0">无门槛</span>
                  <span v-if="scope.row.participationType===1">积分</span>
                </template>
              </el-table-column>

              <el-table-column label="活动场景">
                <template slot-scope="scope">
                  <span v-if="scope.row.activityScenario===0">首页</span>
                  <span v-if="scope.row.activityScenario===1">下单有礼</span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.activityStatus===0">初始</span>
                  <span v-if="scope.row.activityStatus===1">引用</span>
                  <span v-if="scope.row.activityStatus===2">开始未进行</span>
                  <span v-if="scope.row.activityStatus===3">进行中</span>
                  <span v-if="scope.row.activityStatus===4">结束</span>
                </template>
              </el-table-column>

              <el-table-column label="操作"
                               width="100">
                <template slot-scope="scope">
                  <a href="javascript:;"
                     v-show="isEdit"
                     @click="handleDelLuckyItem(scope.row)">删除</a>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="活动图片:"
                        required>
            <div class="activity-img">
              <!--优惠券图片-->
              <div class="ticket"
                   v-if="form.rights===rightsType.TICKET">
                <template v-if="isTicketPhotoAlive">
                  <choose-images v-if="isEdit"
                                 :width="315"
                                 :height="74"
                                 :rect="{w:315,h:74}"
                                 v-model="form.ticketPhoto"
                                 @choose="onPickImage"
                                 @delete="onDeleteTicketUrl" />
                  <img v-else
                       class="activity-img-area"
                       :src="form.activityPhoto"
                       alt />
                </template>
                <!-- <span class="img-title" v-if="showTicketTxt">恭喜你！获得一张优惠券</span> -->
                <span class="size">建议尺寸:315*74</span>
              </div>
              <!--幸运转盘图片-->
              <div class="lucky-turning"
                   v-else>
                <template v-if="isLuckyPhotoAlive">
                  <choose-images v-if="isEdit"
                                 :width="315"
                                 :height="74"
                                 :rect="{w:315,h:74}"
                                 v-model="form.luckyPhoto"
                                 @choose="onPickImage"
                                 @delete="onDeleteLuckyUrl" />
                  <img v-else
                       class="activity-img-area"
                       :src="form.activityPhoto"
                       alt />
                </template>
                <!-- <span class="turning-title" v-if="showLuckyTxt">恭喜你！获得一次大转盘抽奖的机会</span> -->
                <span class="size">建议尺寸:315*74</span>
              </div>
            </div>
          </el-form-item>
        </div>

        <div class="customer-tip">* 商家请注意：一旦保存，活动内容将不可修改。</div>
      </el-form>
      <store-select-dialog api-url="/wp/store/query/dept"
                           :is-all="true"
                           :selected-stores="storeList"
                           :loading="loading.store"
                           enable-multiple
                           v-model="showStoreDialog"
                           @choosed="onStoreChoosed"></store-select-dialog>
      <group-select-dialog v-model="showGroupDialog"
                           label="会员等级"
                           :all-group="currentGroup"
                           :selected-group="selectedGroup"
                           @select="onGroupItemsSelected"></group-select-dialog>
      <coupon-select-dialog v-model="showCouponDialog"
                            :limit="1"
                            :check-function="checkCoupon"
                            :enable-multiple="false"
                            :selected-coupons="couponList"
                            @single-choosed="onCouponsSelected" />
      <lucky-select-dialog v-model="showLuckyDialog"
                           :limit="1"
                           :activity-start-time="form.time[0]"
                           :activity-end-time="form.time[1]"
                           :enable-multiple="false"
                           :selected-lucky="luckyList"
                           @selected="onLuckySelected" />
    </div>
    <div class="bottom-button">
      <el-button @click="onCancel">取消</el-button>
       <el-button type="primary"
                    @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index.vue';
import LuckySelectDialog from '@/dss-wechat3rd/src/bz_components/lucky-select-dialog/index.vue';
import memberApi from '@/dss-wechat3rd/src/api/memberAPI.js';
import GroupSelectDialog from '@/dss-wechat3rd/src/views/marketing/directional-coupons/group-select-dialog.vue';
import { vip, activityStatus, rightsType } from './level';
import courtesyApi from '@/dss-wechat3rd/src/api/courtesy';
import utils from '@/dss-common/utils/index';
import { mapState } from 'vuex';
import regexps from '@/dss-common/utils/regexps.js';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';
import { webMarketingCdnPrefix } from '@/dss-wechat3rd/src/constants/marketingEnum';

export default {
  name: 'CourtesyAdd',
  components: {
    StoreSelectDialog,
    CouponSelectDialog,
    GroupSelectDialog,
    LuckySelectDialog,
    ChooseImages
  },
  data() {
    const validateCouponInfoList = (rule, value, callback) => {
      if (this.form.rights === rightsType.LUCKY) {
        return callback();
      } else {
        if (this.couponList && this.couponList.length === 1) {
          return callback();
        } else {
          return callback('请选择一张优惠券');
        }
      }
    };
    const luckyValidator = (rule, value, callback) => {
      if (this.form.rights === rightsType.TICKET) {
        return callback();
      } else {
        if (this.luckyList && this.luckyList.length === 1) {
          return callback();
        } else {
          return callback('请选择一个幸运转盘');
        }
      }
    };
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
    // 选定会员等级至少选一个
    const validateGroup = (rule, value, callback) => {
      // 全部会员返回
      if (value === vip.all) {
        callback();
      }
      // 选定会员等级已选择返回
      else if (this.selectedLevelList && this.selectedLevelList.length > 0) {
        callback();
      }
      // 选定会员等级未选择时抛错
      else {
        callback('请至少选择一个会员等级');
      }
    };
    const { name, money } = regexps;
    const consumeValidator = (rule, value, callback) => {
      if (!money.reg.test(this.form.activityOrderConsume)) {
        return callback(new Error(money.msg));
      } else {
        callback();
      }
    };
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
      loading: {
        store: false
      },
      isLuckyPhotoAlive: true,
      isTicketPhotoAlive: true,
      suitStoreTypeEnum,
      vip,
      activityStatus,
      rightsType,
      id: null,
      showTicketTxt: true,
      showLuckyTxt: true,
      form: {
        activityName: '',
        time: [],
        shops: suitStoreTypeEnum.all,
        level: vip.all,
        activityOrderConsume: '',
        scene: [],
        rights: rightsType.TICKET,
        couponList: [],
        luckyList: [],
        ticketPhoto: {
          imgUrl: `${webMarketingCdnPrefix}courtesy-ticket.png`
        },
        luckyPhoto: { imgUrl: `${webMarketingCdnPrefix}courtesy-lucky.png` },
        activityPhoto: {} // 上传图片之后返回的url
      },
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度15字以内', trigger: 'blur' }
        ],
        time: [{ required: true, validator: timeValidator, trigger: 'blur' }],
        shops: [{ validator: storeValidator, trigger: 'change' }],
        level: [{ validator: validateGroup, trigger: 'change' }],
        activityOrderConsume: [{ required: true, validator: consumeValidator, trigger: 'blur' }],
        scene: [{ type: 'array', required: true, message: '请选择至少一个付款场景', trigger: 'change' }],
        rights: [{ required: true, message: '请选择至少一个权益', trigger: 'change' }],
        couponList: [{ validator: validateCouponInfoList, trigger: 'change' }],
        luckyList: [{ validator: luckyValidator, trigger: 'change' }]
      },
      tags: [
        { name: '扫码购', id: 1 },
        { name: '自提', id: 2 },
        { name: '送货', id: 3 }
      ],
      levelList: [],
      allMemberList: [],
      selectedLevelList: [],
      storeList: [],
      luckyList: [],
      couponId: null,
      luckyTurningId: null,
      showStoreDialog: false,
      groupStoreList: [],
      showCouponDialog: false,
      showLuckyDialog: false,
      showGroupDialog: false,
      couponList: [],
      allCouponList: [],
      allLuckyList: [],
      storeInfo: {
        pageNo: 1,
        pageSize: 10
      },
      allStores: '', // 所有门店id拼接
      memberLevelIds: null, // 会员等级ID(逗号分隔)(,1,2,3,)
      activityStoresIds: null, // 活动门店ID(逗号分隔)(示例: ,1,2,3, )
      paymentChannelIds: null, // 付款场景渠道(逗号分隔)(,1,2,3,)
      curStatus: activityStatus.UNOPEN
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      allStoreList: 'storeList'
    }),
    currentGroup() {
      if (this.form.level) {
        return this.allMemberList;
      }
    },
    selectedGroup() {
      return this.selectedLevelList;
    },
    isEdit() {
      return !this.id;
    },
    defaultTime() {
      const nowDate = new Date();
      const hour = nowDate.getHours() + parseInt((nowDate.getMinutes() + 1) / 60);
      // 默认加 1 分钟
      const min = (nowDate.getMinutes() + 1) % 60;
      const seconds = nowDate.getSeconds();
      return [`${hour}:${min}:${seconds}`];
    },
    pickerStart() {
      return {
        disabledDate: time => time.getTime() < Date.now() - 24 * 60 * 60 * 1000 // 只能选择今天以后的日期
      };
    }
  },
  methods: {
    fitTime(value) {
      return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
    },
    // 填充表单数据(从查看详情进入)
    setFormData(data) {
      for (const key in this.form) {
        if (key === 'time') {
          this.form.time = [new Date(data.beginTime), new Date(data.endTime)];
          continue;
        } else if (key === 'activityOrderConsume') {
          this.form.activityOrderConsume = data.activityOrderConsume;
          continue;
        } else if (key === 'activityPhoto') {
          this.form.activityPhoto = data.activityPhoto;
          continue;
        }
        this.form[key] = data[key];
      }
      if (data.paymentChannelIds) {
        const payment = [];
        if (data.paymentChannelIds.includes(1)) {
          payment.push('扫码购');
        }
        if (data.paymentChannelIds.includes(2)) {
          payment.push('自提');
        }
        if (data.paymentChannelIds.includes(3)) {
          payment.push('送货');
        }
        this.form.scene = payment;
      }
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
      // memberLevelIds存在，会员等级选择为选定会员，展示出选择的会员名
      if (data.memberLevelIds) {
        this.form.level = vip.part;
        let memberIdList = data.memberLevelIds.split(',');
        memberIdList = memberIdList.filter(memeberId => {
          return !!memeberId;
        });
        memberIdList.forEach(memeberId => {
          const findMember = this.allMemberList.find(item => {
            return item.id === parseInt(memeberId);
          });
          if (findMember) {
            this.selectedLevelList.push(findMember);
          }
        });
      } else {
        this.form.level = vip.all;
      }
      // couponId存在，则选择权益为优惠券，展示已选优惠券，否则展示已选幸运转盘
      if (data.couponId) {
        this.form.rights = rightsType.TICKET; // 优惠券
        const params = {
          couponInfoId: data.couponId
        };
        courtesyApi
          .getCoupon(params)
          .then(res => {
            if (res.data) {
              this.couponList.push(res.data);
            }
          })
          .catch(err => {
            console.log('没有优惠券');
          });
      } else {
        this.form.rights = rightsType.LUCKY;

        const findLucky = this.allLuckyList.find(item => {
          // console.log('allLuckyList---->', item.id, data.luckyTurningId);
          return item.id === data.luckyTurningId;
        });
        if (findLucky) {
          this.luckyList.push(findLucky);
        }
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
    fillForm() {
      // 会员等级可多选
      if (this.selectedLevelList.length) {
        const levelList = [];
        this.selectedLevelList.forEach(e => {
          levelList.push(',' + e.id);
        });
        this.memberLevelIds = levelList.join('') + ',';
      }
      // 店铺列表可多选
      if (this.storeList.length) {
        const stores = [];
        this.storeList.forEach(e => {
          stores.push(',' + e.id);
        });
        this.activityStoresIds = stores.join('') + ',';
      }
      const payMent = [];
      if (this.form.scene.includes('扫码购')) {
        payMent.push(',' + 1);
      }
      if (this.form.scene.includes('自提')) {
        payMent.push(',' + 2);
      }
      if (this.form.scene.includes('送货')) {
        payMent.push(',' + 3);
      }
      this.paymentChannelIds = payMent.join('') + ',';
      // activityPhoto为空对象则活动图片赋默认值，否则图片为自定义图片
      if (this.form.rights === rightsType.TICKET && this.form.ticketPhoto.imgUrl === '') {
        // 优惠券图片
        this.form.ticketPhoto.imgUrl =
          process.env.VUE_APP_CDN_URL + '/resources/dss-web-portal/cdn/web/markting/courtesy-ticket.png';
      } else if (this.form.rights === rightsType.LUCKY && this.form.luckyPhoto.imgUrl === '') {
        // 幸运转盘图片
        this.form.luckyPhoto.imgUrl =
          process.env.VUE_APP_CDN_URL + '/resources/dss-web-portal/cdn/web/markting/courtesy-lucky.png';
      }
    },
    onSave() {
      console.log(this.form);
      this.$refs.form.validate(valid => {
        // 时间小的为开始时间
        const [beginTime, endTime] =
          new Date(this.form.time[0]) <= new Date(this.form.time[1]) ? this.form.time : this.form.time.reverse();

        if (valid) {
          this.fillForm();
          // 验证通过新增下单有礼todo
          const params = {
            // epId: this.userInfo.appInfo.epId,
            // per_chooseAppId: this.userInfo.appInfo.id,
            activityName: this.form.activityName,
            beginTime: this.fitTime(beginTime).toString(),
            endTime: this.fitTime(endTime).toString(),
            memberLevelSelectType: this.form.level === vip.all ? 1 : 2,
            memberLevelIds: this.form.level === vip.all ? null : this.memberLevelIds,
            activityStoresSelectType: this.form.shops === suitStoreTypeEnum.all ? 1 : 2,
            activityStoresIds: this.form.shops === suitStoreTypeEnum.all ? this.allStores : this.activityStoresIds,
            activityOrderConsume: this.form.activityOrderConsume,
            paymentChannelIds: this.paymentChannelIds,
            equityType: this.couponId ? 1 : 2,
            couponId: this.couponId,
            luckyTurningId: this.luckyTurningId,
            activityPhoto:
              this.form.rights === rightsType.TICKET ? this.form.ticketPhoto.imgUrl : this.form.luckyPhoto.imgUrl
          };
          // console.log('params', params);
          courtesyApi
            .add(params)
            .then(res => {
              // console.log('新增下单有礼-->', res);
              this.$message({
                type: 'success',
                message: '创建下单有礼成功'
              });
              this.$router.push('/marketing/courtesy'); // 跳转至列表页
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },
    handleSelectStore() {
      this.showStoreDialog = true;
    },
    handleSelectLevel() {
      this.fetchMemberLevelList();
      if (this.form.level === vip.part) {
        this.showGroupDialog = true;
      }
    },
    handleDellevelItem(index) {
      this.selectedLevelList.splice(index, 1);
    },
    // 添加商品图片
    onImageAdd(index) {
      this.form.activityPhoto = this.form.materialsId[index].imgUrl;
      this.addWaitUploadImage(this.form.materialsId, this.form.materialUrls, index);
    },
    // 更新图片列表
    addWaitUploadImage(materialsId, materialUrls, index) {
      if (utils.isUndefined(index) || index === materialsId.length - 1) {
        materialUrls.push('');
        materialsId.push({
          id: 0,
          imgUrl: ''
        });
      }
    },
    // 删除图片
    onDeleteImg(index) {
      this.form.materialsId.splice(index, 1);
      this.form.materialUrls.splice(index, 1);
    },
    // 初始化 商品图片素材
    initGoodsMaterials() {
      const materialsId = this.form.materialsId ? this.form.materialsId : [];
      const newUrls = [];
      let materialUrls = this.form.materialUrls;

      if (materialUrls && materialUrls.length) {
        materialUrls.forEach((imgUrl, index) => {
          if (imgUrl) {
            materialsId[index] = {
              id: materialsId[index],
              imgUrl: imgUrl
            };
            newUrls.push(imgUrl);
          }
        });
        materialUrls = newUrls;
      }

      this.addWaitUploadImage(materialsId, materialUrls);
      this.form.materialsId = materialsId;
      this.form.materialUrls = materialUrls;
    },
    // 获取等级列表
    openMemberList() {
      this.fetchMemberLevelList();
      if (this.form.level === vip.part) {
        this.showGroupDialog = true;
      }
    },
    fetchMemberLevelList() {
      memberApi.getLevelSimplyList().then(res => {
        if (res.data && res.data.length) {
          this.allMemberList = res.data.map(item => {
            return { id: item.id, name: item.levelName };
          });
        } else {
          this.allMemberList = [];
        }
      });
    },
    onGroupItemsSelected(groups) {
      this.selectedLevelList = groups;
      // 主动除非表单进行验证
      this.$refs.form.validateField('level');
    },
    onStoreChoosed(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.form.validateField('shops');
    },
    handleDelStoreItem(index) {
      this.storeList.splice(index, 1);
    },
    handleDelLuckyItem(index) {
      this.luckyList.splice(index, 1);
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
    onLuckySelected(lucky) {
      this.luckyList.push(lucky);
      this.luckyList.forEach(e => {
        this.luckyTurningId = e.id;
      });
      this.$refs.form.validateField('luckyList');
    },
    onCouponsSelected(coupons) {
      this.couponList.push(coupons);
      this.couponList.forEach(e => {
        this.couponId = e.id;
      });
      // console.log('couponId', this.couponId);
      this.$refs.form.validateField('couponList');
    },
    handleDelCouponItem(couponItem) {
      this.couponList.splice(this.couponList.indexOf(couponItem), 1);
    },
    onCancel() {
      this.$router.push('/marketing/courtesy');
    },
    onDeleteTicketUrl() {
      this.form.ticketPhoto.imgUrl = '';
      this.showTicketTxt = false;
      this.isTicketPhotoAlive = false;
      this.$nextTick(() => (this.isTicketPhotoAlive = true));
    },
    onDeleteLuckyUrl() {
      this.form.luckyPhoto.imgUrl = '';
      this.showLuckyTxt = false;
      this.isLuckyPhotoAlive = false;
      this.$nextTick(() => (this.isLuckyPhotoAlive = true));
    },
    handlePreview(file) {
      if (this.fileList.length) {
        this.ticketImg = this.fileList[0].url;
      }
    },
    getStores() {
      // console.log('userInfo--->', this.userInfo);
      // this.storeInfo.per_chooseAppId = this.userInfo.appInfo.id;
      // this.storeInfo.per_chooseEpId = this.userInfo.appInfo.epId;
      const params = {
        ...this.storeInfo
      };
      this.loading.store = true;
      courtesyApi
        .queryList(params)
        .then(res => {
          res.data.forEach(item => {
            this.allStores += ',' + item.id;
          });
          this.allStores = this.allStores + ',';
          // console.log('所有门店id', this.allStores);
        })

        .catch(err => {
          console.error('获取所有门店异常', err);
        })
        .always(() => {
          this.loading.store = false;
        });
    },
    getDetail(id, appId) {
      courtesyApi.detail(id, appId).then(res => {
        console.log('detail------>', res);
        if (res.data === null) {
          // 请求后端成功，但返回data为空（data为空，id有可能是乱填的），把id置为null
          this.id = null;
          this.$router.push('/marketing/courtesy/add');
          return;
        }
        this.setFormData(res.data || {});
      });
    },
    chooseCoupon() {
      // 已选优惠券后必须删除后再选择新的
      if (this.couponList.length === 0) {
        this.showCouponDialog = true;
      }
      
    },
    chooseLucky() {
      if (this.luckyList.length === 0) {
        this.showLuckyDialog = true;
      }
      
    },
    onPickImage(img) {
      this.form.activityPhoto = {};
      this.form.activityPhoto = img;
      if (this.form.rights === rightsType.TICKET) {
        this.form.luckyPhoto.imgUrl = '';
        this.form.ticketPhoto.imgUrl = this.form.activityPhoto;
        this.showTicketTxt = true;
        // console.log('picked ticket', this.form.ticketPhoto.imgUrl);
      } else {
        this.form.ticketPhoto.imgUrl = '';
        this.form.luckyPhoto.imgUrl = this.form.activityPhoto;
        this.showTicketTxt = true;
        // console.log('picked lucky', this.form.luckyPhoto.imgUrl);
      }
    }
  },
  mounted() {
    // this.getStores();
    courtesyApi.getLuckyList().then(res => {
      this.allLuckyList = res.data;
      courtesyApi
        .getCouponList()
        .then(res => {
          this.allCouponList = res.data;
          memberApi.getLevelSimplyList().then(res => {
            if (res.data && res.data.length) {
              this.allMemberList = res.data.map(item => {
                return { id: item.id, name: item.levelName };
              });
            } else {
              this.allMemberList = [];
            }
            const id = this.$route.query.id;
            if (!id) {
              
            } else {
              this.id = id;
              this.getDetail(this.id, this.userInfo.appInfo.id);
            }
          });
        })
        .catch(err => {
          console.error('获取优惠券列表异常', err);
        });
    });
  }
};
</script>

<style lang="less">
.courtesy-orderlist-form {
  background: #fff;
  margin-top: 0px;
  margin-bottom: 30px;
  .form-area {
    padding: 0 20px;
    .amount {
      color: #A1A4AB;
    }
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
      color: #A1A4AB;
      font-size: 14px;
      font-weight: 500;
      position: absolute;
      top: 18px;
      left: -83px;
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
    .error {
      color: red;
      margin: 0;
      margin-top: 4px;
      font-size: 14px;
    }
    .size {
      display: block;
      margin-top: -15px;
      color: #A1A4AB;
    }
  }
}

.hint-tips {
  position: relative;
  left: -63px;
  top: 22px;
}
.hint {
  color: #A1A4AB;
  font-size: 14px;
  font-weight: normal;
  margin-left: 5px;
}

// 选择权益按钮
.choose-coupon {
  border: none;
  span {
    color: @ui-blue-default;
  }
}

.customer-tip {
  font-size: 12px;
  font-weight: 400;
  color:  #A1A4AB;
  font-family: PingFangSC-Regular;
  padding: 0 20px 20px 20px;
  text-align: center;
}
</style>
