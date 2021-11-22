<template>
  <div class="lucky-add">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/lucky' }">幸运转盘</el-breadcrumb-item>
      <el-breadcrumb-item>{{ isAddMode ? '新建' : '查看' }}幸运转盘</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        v-loading="loading"
        class="lucky-add-form"
        label-width="152px"
        :disabled="!isAddMode"
        label-position="right"
      >
        <h4>活动信息</h4>
        <el-form-item label="活动场景:" prop="activityScenario">
          <el-radio-group v-model="form.activityScenario">
            <el-radio label="0">首页活动</el-radio>
            <el-radio label="1">下单有礼</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动名称:" prop="activityName">
          <el-input v-model.trim="form.activityName" placeholder="活动名称15字以内" class="long-input"></el-input>
          <span :style="ifOverlength(form.activityName.length, 15) && 'color: red;'"
            >{{ form.activityName.length }}/15</span
          >
        </el-form-item>

        <el-form-item label="活动时间:" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="defaultTime"
            :picker-options="pickerStart"
          ></el-date-picker>
          <!-- <el-date-picker
              v-model="form.activityStartTime"
              :picker-options="pickerStart"
              type="datetime"
              placeholder="开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="activityEndTime">
            <el-date-picker
              v-model="form.activityEndTime"
              :picker-options="pickerEnd"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>-->
        </el-form-item>

        <el-form-item label="规则说明:" prop="ruleDescription">
          <el-input
            class="long-input"
            type="textarea"
            placeholder="规则说明将被展示在活动页底部，500字以内"
            v-model="form.ruleDescription"
            @change="onRuleDescriptionChange"
            :autosize="{ minRows: 5, maxRows: 6 }"
          ></el-input>
          <span class="textarea-span" :style="ifOverlength(form.ruleDescription.length, 500) && 'color: red;'"
            >{{ form.ruleDescription.trim().length }}/500</span
          >
        </el-form-item>

        <el-form-item label="活动类型:" prop="participationType">
          <el-radio-group v-model="form.participationType" @change="onparticipationTypeChange">
            <el-radio label="0">免费抽奖</el-radio>
            <el-radio label="1">积分抽奖</el-radio>
          </el-radio-group>
          <el-input
            :min="1"
            style="width: 60px; margin: 0 5px 0 0"
            v-model="form.perPoints"
            controls-position="right"
            :disabled="form.participationType === '0'"
          />分
        </el-form-item>

        <div v-if="form.activityScenario === '0'">
          <el-form-item v-if="form.activityScenario === '0'" label="参与次数:" prop="participationTimesType">
            <el-radio-group v-if="form.activityScenario === '0'" v-model="form.participationTimesType">
              <el-radio label="1" @change="form.participationTimesType === '1'">按天计算</el-radio>
              <el-radio label="0" @change="form.participationTimesType === '0'">按人计算</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="form.participationTimesType === '1'">
            <el-form-item label="每人每天可抽奖:" prop="drawNumbers">
              <el-input-number class="shot-input" :min="1" :max="9999" v-model="form.drawNumbers"></el-input-number>次
            </el-form-item>
            <!-- <div class="flex-input-wrap"> -->
            <el-form-item label="每天分享可额外抽奖:" prop="everyShare">
              <el-input-number class="shot-input" :min="0" :max="9999" v-model="form.everyShare"></el-input-number>次
            </el-form-item>
            <el-form-item label="每天可分享">
              <el-input-number class="shot-input" :min="0" :max="9999" v-model="form.shareTimes"></el-input-number>次
            </el-form-item>
            <!-- </div> -->
          </div>

          <div v-if="form.participationTimesType === '0'">
            <el-form-item label="每人一共可抽奖:" prop="drawNumbers">
              <el-input-number class="shot-input" :min="1" :max="9999" v-model="form.drawNumbers"></el-input-number>次
            </el-form-item>
            <!-- <div class="flex-input-wrap"> -->
            <el-form-item label="每人分享可额外抽奖:" prop="everyShare">
              <el-input-number class="shot-input" :min="0" :max="9999" v-model="form.everyShare"></el-input-number>次
            </el-form-item>
            <el-form-item label="每人可分享">
              <el-input-number class="shot-input" :min="0" :max="9999" v-model="form.shareTimes"></el-input-number>次
            </el-form-item>
            <!-- </div> -->
          </div>
        </div>

        <div v-if="form.activityScenario === '1'">
          <el-form-item label="参与次数:" prop="participationTimesType">
            <el-radio-group v-model="form.participationTimesType">
              <el-radio label="1">每次下单</el-radio>
              <el-radio label="0">每天第一次下单</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <el-form-item prop="suitStoreType" label="参与活动的门店">
          <el-radio-group v-if="isEnterpriseManager" v-model="form.suitStoreType">
            <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
            <el-radio :label="suitStoreTypeEnum.part"
              >选定门店
              <el-button
                class="btn-rules left10"
                v-if="form.suitStoreType === suitStoreTypeEnum.part"
                @click="handleSelectStore()"
                >选择门店
              </el-button>
              <el-button
                class="btn-rules left10"
                v-if="form.suitStoreType === suitStoreTypeEnum.part"
                @click="handleImportStore()"
                >导入门店
              </el-button>
            </el-radio>
          </el-radio-group>

          <el-button v-else-if="!isEnterpriseManager" class="btn-rules left10" @click="handleSelectStore()"
            >选择门店</el-button
          >
        </el-form-item>

        <div
          class="store-list-box"
          v-if="
            storeList &&
            storeList.length &&
            (form.suitStoreType === suitStoreTypeEnum.part || !isEnterpriseManager) &&
            isAddMode
          "
        >
          <div class="store-label">已选门店</div>
          <div class="store-content">
            <div class="store-item-box" v-for="(storeList, groupIndex) in groupStoreList" :key="groupIndex">
              <el-tag
                v-for="(store, storeIndex) in storeList"
                :key="store.id"
                @close="handleDelStoreItem(groupIndex, storeIndex)"
                :closable="isAddMode"
              >
                {{ store.name }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 非编辑状态下参与门店展示 -->
        <div
          class="store-list-box"
          v-else-if="
            storeNameList &&
            storeNameList.length &&
            (form.suitStoreType === suitStoreTypeEnum.part || !isEnterpriseManager) &&
            !isAddMode
          "
        >
          <div class="store-label">已选门店</div>
          <div class="store-content">
            <el-tag v-for="(store, i) in storeNameList" :key="i">
              {{ store }}
            </el-tag>
          </div>
        </div>

        <h4>奖品设置</h4>

        <el-form-item label="选择奖品:" prop="giftsList">
          <el-button class="giftsList-button" @click="onshowAddgift">选择奖品</el-button>
          <div v-show="showGiftList">
            <gift-list
              :in-list="form.giftsList"
              @edit="onGiftListEdit"
              @remove="onGiftListRemove"
              :canedit="isAddMode"
            ></gift-list>
          </div>
        </el-form-item>

        <h4>未中奖设置</h4>
        <el-form-item label="名称:" prop="unluckyName">
          <el-input class="long-input" v-model.trim="form.unluckyName" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="未中奖图:" prop="unluckyPhotoUrl">
          <choose-images
            :width="96"
            :height="96"
            v-model="form.unluckyPhotoUrl"
            @delete="onDeleteLuckyUrl"
            :can-reset="isAddMode"
          />
          <p style="font-size: 12px; color: #a1a4ab">建议尺寸96X96像素，支持JPG、PNG、JPEG格式</p>
        </el-form-item>
        <el-form-item label="提示语:" prop="unluckyTips">
          <el-input class="long-input" v-model="form.unluckyTips" placeholder="很遗憾，未中奖，下次加油~"></el-input>
          <span :style="ifOverlength(form.unluckyTips.length, 15) && 'color: red;'"
            >{{ form.unluckyTips.length }}/15</span
          >
        </el-form-item>

        <!-- <el-form-item > -->
        <p style="color: #a1a4ab; text-align: center">*商家请注意：一旦保存，活动内容将不可修改</p>
        <!-- </el-form-item> -->
      </el-form>

      <add-gift
        v-if="showAddgiftdialog"
        @done="showAddgiftdialog = false"
        @cancel="onAddGiftCancel"
        @onAddGiftOk="onAddGiftOk"
        @onEditGiftOk="onEditGiftok"
        :time="form.time"
        :form="form1"
        :position="this.position"
        :gifts-list-edit-index="this.giftsListEditIndex"
      />

      <store-select-dialog
        api-url="/wp/store/query/dept"
        :is-all="true"
        :selected-stores="storeList"
        enable-multiple
        v-model="showStoreDialog"
        @choosed="onStoreChoosed"
      />

      <local-resolve-xls @resolve="onResolveImportStore" :visible.sync="resolveXlsDialogVisible" title="导入门店" />
    </div>
    <div class="bottom-button">
      <div v-if="isAddMode">
        <el-button @click="$router.push('/marketing/lucky')">取消</el-button>
        <el-button class="lucky-eidtor-save" type="primary" @click="onSubmit('form')" :loading="submitLoading"
          >保存</el-button
        >
      </div>
      <div v-if="!isAddMode">
        <el-button class="lucky-eidtor-save" type="primary" @click="onBack()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
  import luckyApi from '@/dss-wechat3rd/src/api/lucky.js';
  import GiftList from './giftlist';
  import AddGift from './add-gift.vue';
  import './add.less';
  import utilDate from '@/dss-common/utils/date.js';
  import regexps from '@/dss-common/utils/regexps.js';
  import { mapState } from 'vuex';
  import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
  import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
  import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
  const storeGroupCount = 6;

  export default {
    components: { GiftList, AddGift, ChooseImages, LocalResolveXls, StoreSelectDialog },
    mounted() {
      const id = this.$route.query.id;
      if (id) {
        // 如果id有值为详细页面
        luckyApi.detail({ id: id }).then(res => {
          const inData = res.data;
          inData.activityScenario = inData.activityScenario.toString();
          inData.participationType = inData.participationType.toString();
          inData.participationTimesType = inData.participationTimesType.toString();
          // if (inData.participationTimesType === '1') {
          //   inData.perPoints = null;
          // }
          if (!inData.perPoints) {
            inData.perPoints = null;
          }
          inData.unluckyPhotoUrl = { imgUrl: inData.unluckyPhotoUrl };
          if (inData.activityStartTime && inData.activityEndTime) {
            inData.time = [inData.activityStartTime, inData.activityEndTime];
          }
          // 处理参与门店展示
          this.storeNameList = inData.storeNameList || [];
          this.form = inData;
          this.showGiftList = true;
        });
      } else {
        this.form.unluckyPhotoUrl = {
          imgUrl: process.env.VUE_APP_CDN_URL + '/resources/dss-web-portal/cdn/web/markting/unlucky-default.png',
        };
      }
    },
    computed: {
      pickerStart() {
        return {
          disabledDate: time => time.getTime() < Date.now() - 24 * 60 * 60 * 1000, // 只能选择今天以后的日期
        };
      },
      isAddMode() {
        return !this.$route.query.id;
      },
      defaultTime() {
        const nowDate = new Date();
        const hour = nowDate.getHours() + parseInt((nowDate.getMinutes() + 1) / 60);
        // 默认加 1 分钟
        const min = (nowDate.getMinutes() + 1) % 60;
        const seconds = nowDate.getSeconds();
        return [`${hour}:${min}:${seconds}`];
      },
      ...mapState({
        roleList: 'roleList',
      }),
      // 是否企业管理员
      isEnterpriseManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },
    },
    data() {
      const { positiveInt } = regexps;

      // const activityStartTimeValidator = (rule, value, callback) => {
      //   if (!this.form.activityStartTime) {
      //     callback('请输入开始时间');
      //   } else if (new Date(this.form.activityStartTime).getTime() < Date.now()) {
      //     callback('开始时间必须大于当前时间（精确到秒）');
      //   } else {
      //     callback();
      //   }
      // };
      // const activityEndTimeValidator = (rule, value, callback) => {
      //   if (!this.form.activityEndTime) {
      //     callback('请输入结束时间');
      //   } else if (new Date(this.form.activityEndTime).getTime() < Date.now()) {
      //     callback('结束时间必须大于当前时间（精确到秒）');
      //   } else if (
      //     this.form.activityStartTime &&
      //     new Date(this.form.activityEndTime).getTime() < new Date(this.form.activityStartTime).getTime()
      //   ) {
      //     callback('结束时间必须大于开始时间(精度到秒)');
      //   } else {
      //     callback();
      //   }
      // };

      const giftlistValidator = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请添加奖品'));
        } else if (value.length > 7) {
          this.showAddgiftdialog = false;
          callback(new Error('最多只能添加7个奖品'));
        } else {
          let allrate = 0;
          for (let i = 0; i < value.length; i++) {
            allrate += parseInt(value[i].winningRate);
          }
          if (allrate > 100) {
            callback(new Error('所有奖品中奖率不能超过100%'));
          }
          callback();
        }
      };

      const unluckyPhotoUrlVlidator = (rule, value, callback) => {
        if (value.imgUrl == '') {
          callback(new Error('请选择未中奖图'));
        } else {
          callback();
        }
      };

      const participationTypeValidator = (rule, value, callback) => {
        if (value === '1') {
          const perPoints = this.form.perPoints;
          if (!positiveInt.reg.test(perPoints)) {
            callback(new Error(positiveInt.msg));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

      const activityNameValidator = (rule, value, callback) => {
        // 先提交发布到81

        luckyApi.checkName({ activityName: value }).then(res => {
          if (res.data) {
            callback(new Error('活动名称重复,请重新输入.'));
          } else {
            callback();
          }
        });
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

      const storeValidator = (rule, value, callback) => {
        if (!this.isAddMode) return callback();
        if (this.isEnterpriseManager) {
          if (this.form.suitStoreType === suitStoreTypeEnum.all) {
            return callback();
          } else {
            if (this.storeList && this.storeList.length) {
              return callback();
            } else {
              return callback('请选择门店');
            }
          }
        } else {
          if (this.storeList && this.storeList.length && this.isAddMode) {
            return callback();
          } else {
            return callback('请选择门店');
          }
        }
      };
      return {
        submitLoading: false,
        // 正在编辑的giftlist的索引
        giftsListEditIndex: -1,
        chooseGiftstips: true,
        unluckyPhoto: { imgUrl: '' },
        // 转盘位置
        position: [1, 2, 3, 4, 5, 6, 7, 8],
        id: null,
        // 控制添加奖品列表是否显示
        showGiftList: false,
        // 控制添加奖品对话框是否显示
        showAddgiftdialog: false,
        form: {
          time: [],
          // // 活动开始日期
          // activityStartTime: '',
          // // 活动结束日期
          // activityEndTime: '',
          // 活动场景
          activityScenario: '0',
          // 活动名称
          activityName: '',
          // 规则说明
          ruleDescription: '',
          // 活动类型
          participationType: '0',
          // 每次需要消耗的积分
          perPoints: '',
          // 参与次数
          participationTimesType: '1',
          everyShare: 0,
          shareTimes: 1,
          drawNumbers: '',
          // 未中奖名称
          unluckyName: '',
          // 提示语
          // “很遗憾，未中奖，下次加油~“
          unluckyTips: '',
          // 上传图片之后返回的url
          unluckyPhotoUrl: {
            id: 0,
            imgUrl: '',
          },
          // 礼物列表
          giftsList: [],
          activityStatus: 0,
          beCited: 0,
          suitStoreType: suitStoreTypeEnum.all,
        },
        form1: {
          // 奖品名称
          giftName: '',
          // 奖品种类
          giftType: null,
          // 中奖率
          winningRate: null,
          // 序号
          giftIndex: null,
          // 礼物url
          giftPhotoUrl: '',
          //  积分
          giftPoints: null,
          // 优惠券id
          couponId: 0,
          // 礼券名
          couponName: '',
          //  发放数量
          amountGifts: null,
          //  剩余数量
          remainGifts: 0,
        },
        loading: false,
        tagList: [],

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
        // pickerEnd: {
        //   disabledDate: time => {
        //     let startDate = this.form.beginTime;
        //     if (!!startDate) {
        //       return time.getTime() < Date.now() - 8.64e7; //只能选择今天以后的日期
        //     } else {
        //       return time.getTime() < startDate && time.getTime() < Date.now() - 8.64e7;
        //     }
        //   }
        // },

        rules: {
          unluckyName: [{ required: true, message: '请填写未中奖名称', trigger: 'blur' }],
          // 活动场景校验
          activityScenario: [{ required: true, message: '请选中活动场景', trigger: 'change' }],
          // 活动名称校验
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 1, max: 15, message: '活动名称15字以内', trigger: 'blur' },
            {
              validator: activityNameValidator,
              trigger: 'blur',
            },
          ],
          // 规则说明校验
          actrules: [
            { required: true, message: '请输入规则说明' },
            { min: 1, max: 100, message: '规则说明不能超过100字', trigger: 'blur' },
          ],
          participationType: [{ required: true, validator: participationTypeValidator, trigger: 'blur' }],
          unluckyTips: [
            { message: '请输入未中奖名称', trigger: 'blur' },
            { min: 1, max: 15, message: '最多只能输入15字', trigger: 'change' },
          ],
          // 参与次数
          participationTimesType: [{ required: true, message: '请选中参与类型', trigger: 'change' }],
          giftsList: [{ type: 'array', required: true, validator: giftlistValidator, trigger: 'change' }],
          unluckyPhotoUrl: [{ required: true, validator: unluckyPhotoUrlVlidator, trigger: 'blur' }],
          ruleDescription: [
            { required: true, message: '请输入活动规则说明', trigger: 'blur' },
            {
              min: 1,
              max: 500,
              message: '活动规则只能在500字以内！',
              trigger: 'change',
            },
          ],
          time: [{ required: true, validator: timeValidator, trigger: 'blur' }],

          // activityStartTime: [{ required: true, validator: activityStartTimeValidator, trigger: 'blur' }],
          // activityEndTime: [{ required: true, validator: activityEndTimeValidator, trigger: 'blur' }],
          drawNumbers: [{ required: true, message: '请输入可抽奖次数', trigger: 'blur' }],
          everyShare: [
            {
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                if (value) {
                  if (!positiveInt.reg.test(value)) {
                    return callback(new Error(positiveInt.msg));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              },
            },
          ],
          suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }],
        },
        suitStoreTypeEnum,
        showStoreDialog: false,
        resolveXlsDialogVisible: false,
        storeList: [],
        groupStoreList: [],
        storeNameList: [],
      };
    },

    methods: {
      onparticipationTypeChange(e) {
        if (this.form.participationType === '0') {
          this.form.perPoints = '';
        }
      },
      ifOverlength(length, limit) {
        return length > limit;
      },
      onAddImageDone(url) {
        console.log('url', url);
        this.form.unluckyPhotoUrl = url;
      },
      onshowAddgift() {
        if (this.form.giftsList.length <= 6) {
          this.showAddgiftdialog = true;
        } else {
          this.$message({
            message: '最多只能添加七个奖品哦',
            type: 'info',
          });
        }
      },
      onEditGiftok(gift) {
        this.position.push(this.form.giftsList[this.giftsListEditIndex].giftIndex);
        this.position.sort();
        // 从position里面移除已选择的转盘位置
        const toRemove = this.position.findIndex(function (value) {
          return value === parseInt(gift.giftIndex);
        });
        this.position.splice(toRemove, 1);
        this.form.giftsList[this.giftsListEditIndex] = gift;
        this.giftsListEditIndex = -1;
        this.form1 = {};
        this.showAddgiftdialog = false;
      },
      onAddGiftOk(gift) {
        // 从position里面移除已选择的转盘位置
        const toRemove = this.position.findIndex(function (value) {
          return value === parseInt(gift.giftIndex);
        });
        this.position.splice(toRemove, 1);

        this.form.giftsList.push(gift);

        this.showAddgiftdialog = false;
        this.showGiftList = true;
      },
      // 取消添加奖品
      onAddGiftCancel(param) {
        this.form1 = {};

        this.showAddgiftdialog = false;
      },
      // 子组件通知父组件正在编辑
      onGiftListEdit(index) {
        this.form1 = this.form.giftsList[index];
        this.giftsListEditIndex = index;
        this.showAddgiftdialog = true;
      },
      // 子组件通知父组件该行删除
      onGiftListRemove(index) {
        this.$confirm('确认删除这个奖品吗？', '删除奖品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.form.giftsList.splice(index, 1);
            //  弹窗点击确认之后会执行到这里
          })
          .catch(() => {
            console.log('取消删除');
          });
      },
      onDeleteLuckyUrl() {
        this.form.unluckyPhotoUrl = {
          id: 0,
          imgUrl: '',
        };
      },

      onBack() {
        this.$router.push('/marketing/lucky');
      },
      // 规则说明 trim
      onRuleDescriptionChange() {
        this.form.ruleDescription = this.form.ruleDescription.trim();
      },
      // 保存按钮点击处理
      onSubmit(formName) {
        // loading 按钮状态
        this.submitLoading = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log('validOK');

            const [beginTime, endTime] =
              new Date(this.form.time[0]) <= new Date(this.form.time[1]) ? this.form.time : this.form.time.reverse();

            const params = { ...this.form, activityStartTime: beginTime, activityEndTime: endTime };
            params.unluckyPhotoUrl = this.form.unluckyPhotoUrl.imgUrl;
            if (params.unluckyTips === '') params.unluckyTips = '很遗憾，未中奖，下次加油~';
            // console.log('valid',params)
            params.activityScenario = parseInt(params.activityScenario);
            params.perPoints = parseInt(params.perPoints);
            params.participationTimesType = parseInt(params.participationTimesType);

            // 选中参与门店
            if (params.suitStoreType === suitStoreTypeEnum.part || !this.isEnterpriseManager) {
              params.storeIdList = this.storeList.map(store => {
                return store.id;
              });
              // 活动生效范围 0-所有门店，1-部门门店
              params.suitStoreType = suitStoreTypeEnum.part;
            }

            luckyApi
              .add(params)
              .then(res => {
                console.log('res', res.data);
                this.$message({
                  type: 'success',
                  message: '创建幸运转盘成功',
                });
                this.$router.push('/marketing/lucky');
              })
              .always(() => {
                this.submitLoading = false;
              });
          } else {
            console.log('校验失败');
            this.submitLoading = false;
          }
        });
      },
      formatDate(time) {
        return utilDate.format(time, 'YYYY-MM-DD HH:mm:ss');
      },

      handleSelectStore() {
        this.showStoreDialog = true;
      },

      handleImportStore() {
        this.resolveXlsDialogVisible = true;
      },

      onResolveImportStore(list) {
        this.storeList = list;
        this.assembleGroupStoreList();
        this.$refs.form.validateField('suitStoreType');
      },

      onStoreChoosed(storeList) {
        this.storeList = storeList;
        this.assembleGroupStoreList();
        this.$refs.form.validateField('suitStoreType');
      },

      handleDelStoreItem(groupIndex, storeIndex) {
        this.storeList.splice(groupIndex * storeGroupCount + storeIndex, 1);
        this.assembleGroupStoreList();
        this.$refs.form.validateField('suitStoreType');
      },

      assembleGroupStoreList() {
        this.groupStoreList = [];
        let start = 0;
        while (start < this.storeList.length) {
          // 每6个分成一组展示
          this.groupStoreList.push(this.storeList.slice(start, start + storeGroupCount));
          start += storeGroupCount;
        }
      },
    },
  };
</script>

<style type="less" scoped>
  .img-title {
    position: absolute;
    color: #ffffff;
    top: 22px;
    left: 84px;
    width: 154px;
  }

  span {
    color: gray;
  }

  .avatar-empty,
  .avatar {
    width: 174px;
    height: 174px;
    display: inline-block;
    cursor: pointer;
  }

  .el-icon-plus {
    font-size: 18px;
    line-height: 132px;
    color: #566980;
    font-weight: bold;
  }

  .avatar-empty {
    background: #eff2f5;
    border-radius: 4px;
    border: 1px solid #eff2f5;
  }

  /* &:hover {
    .btn-img-del,
    .upload-desc {
      display: inline-block;
    }
  } */

  .upload-desc {
    border-radius: 2px;
    background: #2c3641;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-size: 12px;
    line-height: 24px;
    display: inline-block;
    width: 68px;
    height: 24px;
    cursor: pointer;
  }
</style>
