<template>
  <check-ma>
    <div class="all">
      <div class="da-title">用户画像</div>
      <!--日期选择组件-->
      <date-range @pick="onSelectDateRange" visible-short-cut style="margin-left: 20px"/>
      <!--<DateRange @pick="receiveDateRage"-->
      <!--:dataRangeStatus="dataRangeStatus"></DateRange>-->
      <div class="cla-crowd">
        <div class="cla-crowd-child cla-sex">
          <p class="sex-title">性别占比</p>
          <div class="sex-content">
            <div class="content-left">
              <img src="../../assets/images/countprogram/man.png">
              <p class="p-rate-man">{{manpercent?parseFloat(manpercent*100).toFixed(2)+'%':'--'}}</p>
              <p class="p-sex">男性</p>
            </div>
            <div class="content-center">
              <img src="../../assets/images/countprogram/woman.png">
              <p class="p-rate-woman">{{femalepercent?parseFloat(femalepercent*100).toFixed(2)+'%':'--'}}</p>
              <p class="p-sex">女性</p>
            </div>
            <!--<div class="content-right" >-->
              <!--&lt;!&ndash;<img src="../../assets/images/countprogram/woman.png">&ndash;&gt;-->
              <!--<p class="p-rate-woman">{{nullpercent?parseFloat(nullpercent*100).toFixed(2)+'%':'&#45;&#45;'}}</p>-->
              <!--<p class="p-sex">未知</p>-->
            <!--</div>-->
          </div>
        </div>
        <div class="cla-crowd-child cla-age">
          <p class="age-title">年龄占比</p>
          <VerticalBarGraph :user_age="user_age"></VerticalBarGraph>
        </div>
        <div class="cla-crowd-child cla-edu">
          <p class="edu-title">学历占比</p>
          <HorizontalBarGraph :user_educational="user_educational"></HorizontalBarGraph>
        </div>
      </div>
      <!--用户来源以及设备品牌比-->
      <div class="user-device">
        <div class="cla-user">
          <span class="title">用户设备品牌占比</span>
          <PieChart :parencladevice="parencladevice"></PieChart>
        </div>
        <div class="cla-device">
          <span class="title">设备使用区域</span>
          <PortraitMap :user_life_city_province="user_life_city_province"></PortraitMap>
        </div>
      </div>
    </div>
  </check-ma>
</template>

<script>
  import DateRange from '../../components/date-range.vue';
  import VerticalBarGraph from '../../components/ma/VerticalBarGraph';
  import HorizontalBarGraph from '../../components/ma/HorizontalBarGraph';
  import PieChart from '../../components/ma/PieChart';
  import PortraitMap from '../../components/ma/PortraitMap';
  import daApi from '@/dss-da/src/api/da';
  import Portrait from '../../components/portrait/index';
  import CheckMa from './check-ma.vue';
  const APPKEY = 'app_key';
  export default {
    components: { Portrait, DateRange, VerticalBarGraph, HorizontalBarGraph, PieChart, PortraitMap, CheckMa },
    data() {
      return {
        status: [
          {
            activepage: true,
            select: false,
            eltable: false
          }
        ],
        // dataRangeStatus: true,
        startdate: '',
        enddate: '',
        items: '',
        manpercent: '',
        femalepercent: '',
        nullpercent: '',
        user_age: [],
        user_educational: [],
        user_life_city_province: [],
        user_mobile_phone: [],
        user_sex: [],
        parencladevice: '',
        paresimplebar1: []
      };
    },
    mounted() {
      // this.getappkey();
    },
    methods: {
      onSelectDateRange(range) {
        this.appKey = window.localStorage.getItem(APPKEY);
        this.startdate = range[0];
        this.enddate = range[1];
        this.getactive();
      },
      //获取人群画像的数据
      getactive() {
        daApi.ma
          .portraitAnalysis({
            // appKey: this.appKey,
            beginDate: this.startdate,
            endDate: this.enddate,
            pn: ''
          })
          .then(res => {
            this.user_age = res.data.user_age ? res.data.user_age : '';
            this.user_educational = res.data.user_educational ? res.data.user_educational : '';
            this.user_life_city_province = res.data.user_life_city_province ? res.data.user_life_city_province : '';
            this.parencladevice = res.data.user_mobile_phone ? res.data.user_mobile_phone : '';
            this.user_sex = res.data.user_sex ? res.data.user_sex : '';
            if (res.data.user_sex) {
              res.data.user_sex.forEach(item => {
                switch (item.tagValue) {
                  case '未知':
                    this.nullpercent = item.userPercent ? item.userPercent : '';
                    break;
                  case '男':
                    this.manpercent = item.userPercent ? item.userPercent : '';
                    break;
                  case '女':
                    this.femalepercent = item.userPercent ? item.userPercent : '';
                    break;
                }
              });
            } else {
              this.manpercent = '';
              this.femalepercent = '';
            }
          });
      }
    }
  };
</script>

<style lang="less">
.p-title {
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(44, 54, 65, 1);
  line-height: 25px;
  margin-top: 20px;
}
.cla-crowd {
  font-size: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  .cla-crowd-child {
    display: inline-block;
    width: 32.6%;
    height: 340px;
    box-sizing: border-box;
    vertical-align: middle;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    padding: 20px;
    position: relative;
    .sex-title,
    .age-title,
    .edu-title {
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(34, 43, 77, 1);
      line-height: 22px;
      position: absolute;
    }
    .content-left {
      width: 50%;
      display: inline-block;
      text-align: center;
      img {
        width: 60px;
        height: 90px;
        margin: 50px auto 26px;
      }
      .p-rate-man {
        font-size: 30px;
        font-family: Lato-Regular;
        font-weight: 400;
        color: rgba(72, 124, 237, 1);
        line-height: 36px;
        margin: 0px auto 30px;
      }
      .p-sex {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(44, 54, 65, 1);
        line-height: 20px;
      }
    }
    .content-center {
      width: 40%;
      display: inline-block;
      text-align: center;
      img {
        width: 60px;
        height: 90px;
        margin: 50px auto 26px;
      }
      .p-rate-woman {
        font-size: 30px;
        font-family: Lato-Regular;
        font-weight: 400;
        color: rgba(255, 92, 86, 1);
        line-height: 36px;
        margin: 0px auto 30px;
      }
      .p-sex {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(44, 54, 65, 1);
        line-height: 20px;
      }
    }
    .content-right {
      width: 20%;
      display: inline-block;
      text-align: center;
      img {
        width: 60px;
        height: 90px;
        margin: 50px auto 26px;
      }
      .p-rate-woman {
        font-size: 30px;
        font-family: Lato-Regular;
        font-weight: 400;
        color: rgba(255, 92, 86, 1);
        line-height: 36px;
        margin: 0px auto 30px;
      }
      .p-sex {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(44, 54, 65, 1);
        line-height: 20px;
      }
    }
  }
  .cla-sex {
    margin-right: 1.1%;
  }
  .cla-age {
    margin-right: 1.1%;
  }
}
.user-device {
  font-size: 0;
  .cla-user {
    width: 49.5%;
    margin-right: 1%;
    display: inline-block;
    vertical-align: middle;
    background: #ffffff;
    padding: 20px;
    box-sizing: border-box;
  }
  .cla-device {
    width: 49.5%;
    display: inline-block;
    vertical-align: middle;
    background: #ffffff;
    padding: 20px;
    box-sizing: border-box;
  }
}
.title {
  display: block;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  margin-bottom: 15px;
}
</style>
