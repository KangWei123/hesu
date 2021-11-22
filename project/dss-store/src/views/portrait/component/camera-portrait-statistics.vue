statisticsportraitcamerap<template>
  <div v-loading="loading" class="portrait-container">
    <el-row :gutter="11">
      <el-col :span="8" :md="24" :sm="24" :lg="8">
        <el-card style="height:360px" class="portrait-card">
          <div slot="header">
            <h2 class="dss_portrait_title">年龄占比</h2>
          </div>
          <template>
            <chart :options="dataAge.options" height="280px" v-if="dataAge.data.length"></chart>
            <!-- <div v-else>暂无数据</div> -->
            <place-holder v-else :height="280"></place-holder>
          </template>
        </el-card>
      </el-col>

      <el-col :span="8" :md="12" :sm="24" :lg="8">
        <el-card style="height:360px" class="portrait-card">
          <div slot="header">
            <h2 class="dss_portrait_title">性别占比</h2>
          </div>
          <el-row class="dss_portrait_sex">
            <el-col :span="12" style="text-align:center">
              <img src="../../../asserts/images/boy.png" style="height:90px;margin-left: -10px" />
              <div class="item-num primary-color" style="color: #83A0EA;">
                {{ rate(dataGender.male) }}<span class="rate-symbole">%</span>
              </div>
              <div>男性</div>
            </el-col>
            <el-col :span="12" style="text-align:center">
              <img src="../../../asserts/images/girl.png" style="height:90px;margin-left: -10px" />
              <div class="item-num danger-color" style="color: #FF7E54;">
                {{ rate(dataGender.female) }}<span class="rate-symbole">%</span>
              </div>
              <div>女性</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="8" :md="12" :sm="24" :lg="8">
        <el-card style="height:360px" class="portrait-card no-padding-tb">
          <div slot="header">
            <h2 class="dss_portrait_title">新/老客占比</h2>
          </div>

          <el-row>
            <el-col :span="24" style="margin-bottom: 0;">
              <chart :svg="true" :options="dataUser.options" height="200px"></chart>
            </el-col>
            <el-col :span="24">
              <div class="dss_portrait_people" style="text-align:center">
                <div class="people-item" style="margin-right:12px;">
                  <div class="item-num primary-color" style="color: #83A0EA;">
                    {{ rate(dataUser.newCustomer) }}<span class="rate-symbole">%</span>
                  </div>
                  <div>新客</div>
                  <span class="item-point " style="background: #83A0EA"></span>
                </div>
                <div class="people-item" style="margin-left:12px">
                  <div class="item-num danger-color" style="color: #FF7E54;">
                    {{ rate(dataUser.oldCustomer) }}<span class="rate-symbole">%</span>
                  </div>
                  <div>旧客</div>
                  <span class="item-point" style="background: #FF7E54"></span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 会员画像数据 -->
      <div v-if="isMember">
        <el-col :span="8" :md="12" :sm="24" :lg="8">
          <el-card style="height:360px" class="portrait-card no-padding-tb">
            <div slot="header">
              <h2 class="dss_portrait_title">会员占比</h2>
            </div>
            <el-row>
              <el-col :span="24" style="margin-bottom: 10px;">
                <chart :svg="true" :options="dataMember.options" height="200px"></chart>
              </el-col>
              <el-col :span="24">
                <div class="dss_portrait_people" style="text-align:center">
                  <div class="people-item" style="margin-right:12px;">
                    <div class="item-num primary-color" style="color: #F7B500;">
                      {{ rate(dataMember.member) }}<span class="rate-symbole">%</span>
                    </div>
                    <div>会员</div>
                    <span class="item-point " style="background: #F7B500"></span>
                  </div>
                  <div class="people-item" style="margin-left:12px">
                    <div class="item-num danger-color" style="color: #FA6400;">
                      {{ rate(dataMember.notMember) }}<span class="rate-symbole">%</span>
                    </div>
                    <div>非会员</div>
                    <span class="item-point" style="background: #FA6400"></span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="8" :md="12" :sm="24" :lg="8">
          <el-card style="height:360px" class="portrait-card no-padding-tb">
            <div slot="header">
              <h2 class="dss_portrait_title">入店转化率</h2>
            </div>

            <el-row>
              <el-col :span="24" style="margin-bottom: 10px;">
                <chart :svg="true" :options="dataRate.options_enter" height="200px"></chart>
              </el-col>
              <el-col :span="24">
                <div class="dss_portrait_people" style="text-align:center">
                  <div class="people-item" style="margin-left:12px">
                    <div class="item-num danger-color" style="color: #849DE7;">
                      {{ rate(enterRate || 0) }}<span class="rate-symbole">%</span>
                    </div>
                    <div>入店转化率</div>
                    <span class="item-point" style="background: #849DE7"></span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="8" :md="12" :sm="24" :lg="8">
          <el-card style="height:360px" class="portrait-card no-padding-tb">
            <div slot="header">
              <h2 class="dss_portrait_title">会员转化率</h2>
            </div>

            <el-row>
              <el-col :span="24" style="margin-bottom: 10px;">
                <chart :svg="true" :options="dataRate.options_member" height="200px"></chart>
              </el-col>
              <el-col :span="24">
                <div class="dss_portrait_people" style="text-align:center">
                  <div class="people-item" style="margin-left:12px">
                    <div class="item-num danger-color" style="color: #FA6400;">
                      {{ rate(memberRate || 0) }}<span class="rate-symbole">%</span>
                    </div>
                    <div>会员转化率</div>
                    <span class="item-point" style="background: #FA6400"></span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import convert from '../convert';
// import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import Chart from '@/dss-common/components/Chart';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import '../passflow.less';

const getDefaultGender = function() {
  return {
    male: 0,
    female: 0,
    count: 0
  };
};

const getDefaultAge = () => {
  return {
    data: [],
    options: null
  };
};

const getDefaultUser = () => {
  return {
    oldCustomer: 0,
    newCustomer: 0,
    options: convert.marriToPie(0, 0)
  };
};

const getDefaultMember = () => {
  return {
    notMember: 0,
    member: 0,
    options: convert.marriToPie(0, 0)
  };
};

const getDefaultRate = () => {
  return {
    enterCount: 0,
    newCustomerCount: 0,
    newMemberCount: 0,
    passByCount: 0,
    options: convert.marriToPie(0, 0)
  };
};

export default {
  name: 'PortraitStatistic',

  components: {
    Chart,
    PlaceHolder
  },

  props: {
    paramType: {
      type: Number,
      default: 0
    },

    isGlobal: {
      type: String,
      default: ''
    },

    dateRange: {
      type: [Array, Object],
      default: function() {
        return [];
      }
    },
    portraitData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    rateData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    isStore: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    isMember() {
      return this.isGlobal === 'global';
    },
    enterRate() {
      const { enterCount, passByCount } = this.dataRate;
      const totalCount = (enterCount || 0) + (passByCount || 0);
      return (enterCount || 0) / totalCount;
    },
    memberRate() {
      const { newMemberCount, newCustomerCount } = this.dataRate;
      const totalCount = (newMemberCount || 0) + (newCustomerCount || 0);
      return (newMemberCount || 0) / totalCount;
    }
  },

  data() {
    return {
      // loading: false,
      dataGender: getDefaultGender(),
      dataAge: getDefaultAge(),
      dataUser: getDefaultUser(),
      dataMember: getDefaultMember(),
      dataRate: getDefaultRate()
    };
  },

  watch: {
    dateRange(newVal) {
      if (!!newVal && newVal.length > 0) {
        // this.getData();
        this.setData(this.portraitData || []);
        this.setRateData(this.rateData || {});
      }
    },
    portraitData: {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal != null) {
          this.setData(this.portraitData || []);
        }
      }
    },
    rateData: {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal != null) {
          this.setRateData(this.rateData || {});
        }
      }
    }
  },

  methods: {
    formatDate(datetime) {
      if (!!datetime) {
        return utils.timeFormat(datetime, 'YYYY-MM-DD');
      }
      return null;
    },

    rate(value, decimal = 1) {
      return (value * 100).toFixed(decimal);
    },

    percent(value, max = 100, decimal = 0) {
      return max ? `${((value / max) * 100).toFixed(decimal)}` : '0';
    },

    //  每次setData前先设置成默认的数据
    setDefaultData() {
      this.dataGender = getDefaultGender();
      this.dataAge = getDefaultAge();
      this.dataUser = getDefaultUser();
      if (!this.isStore) this.dataMember = getDefaultMember();
    },

    setDefaultRate() {
      this.dataRate = getDefaultRate();
      if (this.isStore) this.dataMember = getDefaultMember();
    },

    setData(data) {
      this.setDefaultData();
      let ageData = {
        tag: 'age',
        data: []
      };
      const barColor = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#45C7FA'
          },
          {
            offset: 1,
            color: '#2196F3'
          }
        ]
      };
      let ageList = [
        {
          portraitName: '20岁及以下',
          portraitCount: 10,
          portraitRate: 0
        },
        {
          portraitName: '21-25岁',
          portraitCount: 0,
          portraitRate: 0
        },
        {
          portraitName: '26-30岁',
          portraitCount: 0,
          portraitRate: 0
        },
        {
          portraitName: '31-40岁',
          portraitCount: 0,
          portraitRate: 0
        },
        {
          portraitName: '41岁及以上',
          portraitCount: 0,
          portraitRate: 0
        }
      ];

      data.forEach(item => {
        switch (item.tag) {
          case 'sex':
            item.data.forEach(subItem => {
              if (subItem.portraitName === '男' || subItem.portraitName === 'male') {
                this.dataGender.male = subItem.portraitRate;
              } else if (subItem.portraitName === '女' || subItem.portraitName === 'female') {
                this.dataGender.female = subItem.portraitRate;
              }
            });
            break;

          case 'age':
            ageData.data = item.data || [];
            this.dataAge.data = item.data || [];
            //补全数据
            if (this.dataAge.data.length < ageList.length) {
              ageList.forEach(age => {
                this.dataAge.data.forEach(ageItem => {
                  if (age.portraitName === ageItem.portraitName) {
                    age.portraitCount = ageItem.portraitCount;
                    age.portraitRate = ageItem.portraitRate;
                  }
                });
              });
              this.dataAge.data = ageList || [];
            }
            this.dataAge.options = convert.ageToBar(this.dataAge.data, 100, barColor, '#3B4757', true);
            break;

          case 'newOldCus':
            item.data.forEach(subItem => {
              if (subItem.portraitName === '新客') {
                this.dataUser.newCustomer = subItem.portraitRate;
              } else if (subItem.portraitName === '旧客') {
                this.dataUser.oldCustomer = subItem.portraitRate;
              }
            });
            const { newCustomer, oldCustomer } = this.dataUser;
            this.dataUser.options = convert.marriToPie(newCustomer, oldCustomer);
            break;

          case 'member':
            if (!this.isStore) {
              item.data.forEach(subItem => {
                if (subItem.portraitName === '会员') {
                  this.dataMember.member = subItem.portraitRate;
                } else if (subItem.portraitName === '非会员') {
                  this.dataMember.notMember = subItem.portraitRate;
                }
              });
              const { member, notMember } = this.dataMember;
              this.dataMember.options = convert.marriToPie(
                member,
                notMember,
                false,
                ['46%', '65%'],
                ['#F7B500', '#FF7E54']
              );
            }
            break;
        }
      });

      // 应后端需求年龄无数据处理
      if (!ageData.data.length) {
        ageData.data = ageList;
        this.dataAge.data = ageData.data || [];
        this.dataAge.options = convert.ageToBar(this.dataAge.data, 100, barColor, '#3B4757', true);
      }
    },

    setRateData(data) {
      this.setDefaultRate();
      this.dataRate = this.$plain(data);

      const { enterCount, newMemberCount, newCustomerCount, passByCount } = data;
      const totalCount = (newMemberCount || 0) + (newCustomerCount || 0);

      this.dataRate.options_member = convert.marriToPie(
        { value: newMemberCount, name: '绑定用户数' },
        { value: totalCount, name: '总客户数' },
        true,
        ['46%', '65%'],
        ['#FF7E54', '#F7B500']
      );
      this.dataRate.options_enter = convert.marriToPie(
        { value: passByCount, name: '总路过人数' },
        { value: enterCount, name: '总进店人数' },
        true,
        ['46%', '65%'],
        ['#FF7E54', '#83A0EA']
      );

      // 今日概览
      if (this.isStore) {
        const member = this.dataRate.member || 0;
        const notMember = this.dataRate.notMember || 0;
        this.dataMember.member = member;
        this.dataMember.notMember = notMember;
        this.dataMember.options = convert.marriToPie(member, notMember, false, ['46%', '65%'], ['#F7B500', '#FF7E54']);
      }
    }

    // getData() {
    //   this.loading = true;
    //   let params = {
    //     isCustomer: this.paramType,
    //     startDate: this.formatDate(this.dateRange[0]),
    //     endDate: this.formatDate(this.dateRange[1])
    //   };
    //   cameraFlowApi.getCameraPortrait(params).then(
    //     ({ data }) => {
    //       this.loading = false;
    //       this.setData(data || []);
    //     },
    //     () => {
    //       this.loading = false;
    //     }
    //   );
    // }
  }
};
</script>
