<template>
  <el-card class="dss-rtdata" v-loading="loading">
    <el-row>
      <el-col :xs="24" :span="8" class="fix">
        <h2>今日客流</h2>
        <div class="rtdata">
          <h3><span>{{data.todayCustomer|number}}</span><span>上周同期 <b>{{data.lastWeekTodayCustomer|number}}</b></span></h3>
          <div class="data-target">
            <div class="data-bar"><span><i :style="style1"></i></span></div>
            <div class="data-detail">
              <h4>今日目标</h4>
              <h5>{{data.todayTarget|number}}<span>{{exceed1}}</span></h5>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :span="8">
        <h2>本周客流</h2>
        <div class="rtdata">
          <h3><span>{{data.thisWeekCustomer|number}}</span><span>上周客流 <b>{{data.lastWeekCustomer|number}}</b></span></h3>
          <div class="data-target">
            <div class="data-bar"><span><i :style="style2"></i></span></div>
            <div class="data-detail">
              <h4>本周目标</h4>
              <h5>{{data.thisWeekTarget|number}}<span>{{exceed2}}</span></h5>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :span="8">
        <h2>本月客流</h2>
        <div class="rtdata fix">
          <h3><span>{{data.thisMonthCustomer|number}}</span><span>上月客流 <b>{{data.lastMonthCustomer|number}}</b></span></h3>
          <div class="data-target">
            <div class="data-bar"><span><i :style="style3"></i></span></div>
            <div class="data-detail">
              <h4>本月目标</h4>
              <h5>{{data.thisMonthTarget|number}}<span>{{exceed3}}</span></h5>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    precent1 () {
      return this.data.todayTarget ? ((this.data.todayCustomer || 0) / this.data.todayTarget) : 0
    },
    precent2 () {
      return this.data.thisWeekTarget ? ((this.data.thisWeekCustomer || 0) / this.data.thisWeekTarget) : 0
    },
    precent3 () {
      return this.data.thisMonthTarget ? ((this.data.thisMonthCustomer || 0) / this.data.thisMonthTarget) : 0
    },
    style1 () {
      return this.getStyle(this.precent1)
    },
    style2 () {
      return this.getStyle(this.precent2)
    },
    style3 () {
      return this.getStyle(this.precent3)
    },
    exceed1 () {
      return this.getExceed(this.precent1)
    },
    exceed2 () {
      return this.getExceed(this.precent2)
    },
    exceed3 () {
      return this.getExceed(this.precent3)
    }
  },
  methods: {
    getStyle (precent) {
      const width = precent > 1 ? '100%' : (precent * 100 + '%')
      const backgroundColor = precent > 1 ? '#FB6042' : '#3499FE'
      const backgroundImage = precent > 1 ? 'linear-gradient(90deg, #FB6042 4%, #FFAF59 100%)' : 'linear-gradient(90deg, #3499FE 4%, #3CBAF8 100%)'
      return {
        width,
        backgroundColor,
        backgroundImage
      }
    },
    getExceed (precent) {
      if (precent > 1) {
        return `+${((precent - 1) * 100).toFixed(2)}%`
      } else {
        return ''
      }
    }
  }
}
</script>


<style lang="less">
.dss-rtdata {

  margin-bottom: 20px;

  .el-card__body {
    padding: 0;
  }

  .rtdata {
    margin-top: 24px;
    border-right: 1px solid rgba(1, 35, 52, 0.15);
    &.fix {
      border-right: none;
    }
  }

  .data-target {
    height: 54px;
    margin-top: 5px;
    div {
      float: left;
      height: 54px;
      box-sizing: border-box;
    }
    .data-bar {
      width: calc(100% - 150px);
      border-right: dashed 1px #3499FE;
      position: relative;
      span {
        position: absolute;
        display: block;
        width: 100%;
        height: 12px;
        border-radius: 6px;
        overflow: hidden;
        background: rgba(142,170,199,0.20);
        top: 50%;
        left: 0;
        margin-top: -6px;
        i {
          display: block;
          width: 50%;
          height: 100%;
          background-color: #3499FE;
          border-radius: 6px;
          background-image: linear-gradient(90deg, #3499FE 4%, #3CBAF8 100%);
          transition: width 0.5s;
        }
      }
    }
    .data-detail {
      width: 150px;
      padding-left: 10px;
      h4 {
        margin: 0;
        font-size: 14px;
        color: rgba(1, 35, 52, 0.5);
      }
      h5 {
        margin: 5px 0 0 0;
        font-size: 22px;
        color: rgba(59, 72, 88, 0.5);
        span {
          font-weight: normal;
          font-size: 17px;
          color: #FB6042;
          margin-left: 10px;
        }
      }
    }
  }

  h2,h3 {
    margin: 0;
    color: #3B4757;
  }
  h2 {
    font-size: 16px;
    font-weight: normal;
  }
  h3 {
    font-size: 42px;
    margin-top: 6px;
    font-weight: normal;
    overflow: hidden;
    span {
      float: left;
      padding-right: 20px;
    }
    span + span {
      color: rgba(1, 35, 52, 0.5);
      font-size: 14px;
      margin-top: 18px;
      padding-right: 0;
    }
    b {
      font-size: 21px;
      margin-left: 5px;
      color: #3B4757;
      font-weight: normal;
    }
  }
  .el-col {
    position: relative;
    box-sizing: border-box;
    padding: 30px 20px;
  }
  .el-col.fix {
    padding-left: 40px;
  }
  @media only screen and (max-width: 1080px) {
    h3 span + span {
      width: 100%;
    }
  }
  @media only screen and (max-width: 768px) {
    h3 span + span {
      width: auto;
    }
    .rtdata {
      border-right: none;
    }
    .el-col.fix {
      padding-left: 20px;
    }
  }
}
</style>
