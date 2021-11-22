statisticsportraitcamerap<template>
  <div v-loading="loading">
    <el-row :gutter="11">
      <el-col :span="8"
              :md="24"
              :sm="24"
              :lg="8">
        <el-card style="height:455px">
          <div slot="header">
            <h2 class="dss_portrait_title">年龄占比</h2>
          </div>
          <chart :options="dataAge.options"
                 height="321px"
                 v-if="dataAge.data.length"></chart>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>

      <el-col :span="8"
              :md="12"
              :sm="24"
              :lg="8">
        <el-card style="height:455px">
          <div slot="header">
            <h2 class="dss_portrait_title">性别占比</h2>
          </div>
          <el-row class="dss_portrait_sex">
            <el-col :span="12"
                    style="text-align:center">
              <img src="../../asserts/images/boy.png"
                   style="height:90px;margin-left: -10px" />
              <div class="item-num primary-color">
                {{rate(dataGender.male)}}<span class="rate-symbole">%</span>
              </div>
              <div>男性</div>
            </el-col>
            <el-col :span="12"
                    style="text-align:center">
              <img src="../../asserts/images/girl.png"
                   style="height:90px;margin-left: -10px" />
              <div class="item-num danger-color">
                {{rate(dataGender.female)}}<span class="rate-symbole">%</span>
              </div>
              <div>女性</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="8"
              :md="12"
              :sm="24"
              :lg="8">
        <el-card style="height:455px">
          <div slot="header">
            <h2 class="dss_portrait_title">会员占比</h2>
          </div>

          <el-row>
            <el-col :span="24">
              <chart :svg="true"
                     :options="dataUser.options"
                     height="241px"></chart>
            </el-col>
            <el-col :span="24">
              <div class="dss_portrait_people"
                   style="text-align:center">
                <div class="people-item"
                     style="margin-right:12px;">
                  <div class="item-num primary-color">
                    {{rate(dataUser.newCustomer)}}<span class="rate-symbole">%</span>
                  </div>
                  <div>非会员</div>
                  <span class="item-point "
                        style="background: #487CED"></span>
                </div>
                <div class="people-item"
                     style="margin-left:12px">
                  <div class="item-num danger-color">
                    {{rate(dataUser.oldCustomer)}}<span class="rate-symbole">%</span>
                  </div>
                  <div>会员</div>
                  <span class="item-point"
                        style="background: #FF5C56"></span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import convert from '@/dss-store/src/views/portrait/convert';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import Chart from '@/dss-common/components/Chart';
import '@/dss-store/src/views/portrait/passflow.less';

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

export default {
  name: 'PortraitStatistic',

  components: {
    Chart
  },

  props: {
    paramType: {
      type: Number,
      default: 0
    },

    dateRange: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  data() {
    return {
      loading: false,
      dataGender: getDefaultGender(),
      dataAge: getDefaultAge(),
      dataUser: getDefaultUser()
    };
  },

  watch: {
    dateRange(newVal) {}
  },

  mounted() {
    this.getData();
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
    },

    setData(data) {
      this.setDefaultData();
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
            item.data.forEach(subItem => {
              subItem.portraitName = subItem.portraitName;
            });
            this.dataAge.data = item.data || [];
            this.dataAge.options = convert.ageToBar(this.dataAge.data);
            break;

          case 'member':
            item.data.forEach(subItem => {
              if (subItem.portraitName === '非会员') {
                this.dataUser.newCustomer = subItem.portraitRate;
              } else if (subItem.portraitName === '会员') {
                this.dataUser.oldCustomer = subItem.portraitRate;
              }
            });
            const { newCustomer, oldCustomer } = this.dataUser;
            this.dataUser.options = convert.marriToPie(newCustomer, oldCustomer);
            break;
        }
      });
    },

    getAgeName(portraitName) {
      let name = '';
      switch (portraitName) {
        case '0':
          name = '20岁及以下';
          break;
        case '1':
          name = '20岁-30岁';
          break;
        case '2':
          name = '30-40岁';
          break;
        case '3':
          name = '40岁以上';
          break;
      }
      return name;
    },

    getData() {
      this.loading = true;
      let params = {
        isCustomer: this.paramType
      };
      cameraFlowApi.getUserPortrait(params).then(
        ({ data }) => {
          this.loading = false;
          this.setData(data || []);
        },
        () => {
          this.loading = false;
        }
      );
    }
  }
};
</script>
