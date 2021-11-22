<template>
  <div class="today-statistics">
    <p class="title">今日统计</p>
    <div class="sta-con">
      <div class="statistics">
        <p class="access">访问次数</p>
        <p class="data">{{newparenTodayStatistics.lauchTimes?newparenTodayStatistics.lauchTimes:'--'}}</p>
        <p class="desc"><span>昨日:</span>
          <template v-if="newparenTodayStatistics.lauchTimesInc">
            <span v-if=" newparenTodayStatistics.lauchTimesInc[0] === '+' " style="color:#FF6F3A;">{{parenTodayStatistics.lauchTimesInc}}</span>
            <span v-if=" newparenTodayStatistics.lauchTimesInc[0] === '-' " style="color:#37be8f;;">{{parenTodayStatistics.lauchTimesInc}}</span>
          </template>
          <template v-else>--</template>
        </p>
      </div>
      <div class="statistics">
        <p class="access">访问人数</p>
        <p class="data">{{newparenTodayStatistics.activeUser?newparenTodayStatistics.activeUser:'--'}}</p>
        <p class="desc"><span>昨日:</span>
          <template v-if="newparenTodayStatistics.activeUserInc">
          <span v-if=" newparenTodayStatistics.activeUserInc[0] === '+' " style="color:#FF6F3A;">{{parenTodayStatistics.activeUserInc}}</span>
          <span v-if=" newparenTodayStatistics.activeUserInc[0] === '-' " style="color:#37be8f;;">{{parenTodayStatistics.activeUserInc}}</span>
          </template>
          <template v-else>--</template>
        </p>
      </div>
      <div class="statistics">
        <p class="access">新增用户</p>
        <p class="data">{{newparenTodayStatistics.newUsers?newparenTodayStatistics.newUsers:'--'}}</p>
        <p class="desc"><span>昨日:</span>
          <template v-if="newparenTodayStatistics.newUsersInc">
            <span v-if=" newparenTodayStatistics.newUsersInc[0] === '+' " style="color:#FF6F3A;">{{parenTodayStatistics.newUsersInc}}</span>
            <span v-if=" newparenTodayStatistics.newUsersInc[0] === '-' " style="color:#37be8f;;">{{parenTodayStatistics.newUsersInc}}</span>
          </template>
          <template v-else>--</template>
        </p>
      </div>
      <div class="statistics">
        <p class="access">新增用户占比</p>
        <p class="data">{{newparenTodayStatistics.newActiveRate?newparenTodayStatistics.newActiveRate:'--'}}</p>
        <p class="desc" style="opacity:0;"><span>昨日:</span><span style="color:#FF6F3A;">+10%</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'todaystatistics',
    props: ['parenTodayStatistics'],
    data() {
      return {
        newparenTodayStatistics: {}
      };
    },
    watch: {
      parenTodayStatistics: function() {
        this.newparenTodayStatistics = this.parenTodayStatistics;
      }
    },
    mounted() {
      this.newparenTodayStatistics = this.parenTodayStatistics;
    }
  };
</script>

<style lang="less">

  .today-statistics{
    margin-top:20px;
    .alerttips{
      width: 100%;
      padding: 8px 20px;
      margin-top: 20px;
      box-sizing: border-box;
      border-radius: 4px;
      position: relative;
      background-color: #fef0f0;
      color: #f56c6c;
      overflow: hidden;
      opacity: 1;
      display: flex;
      align-items: center;
      transition: opacity .2s;
      font-size: 13px;
      line-height: 18px;
    }
    .title{
      font-size: 16px;
      color: #333333;
      margin: 20px 0 0px 20px;
    }
    /*p{*/
      /*font-size: 16px;*/
      /*color: #333333;*/
    /*}*/
    .sta-con{
      width:100%;
      font-size: 0;
      overflow: hidden;
        .statistics{
            width: 24%;
            height: 150px;
            background: #ffffff;
            border-radius: 4px;
            margin-right: 1.21%;
            margin-bottom: 20px;
            float: left;
            padding: 20px;
            box-sizing: border-box;
            p{
              margin:0;
              padding:0;
            }
            .access{
              font-size: 14px;
              color: #333333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .data{
              font-size: 36px;
              color: #333333;
              margin-top: 10px;
            }
            .desc{
              margin-top:20px;
              span{
                color: #333333;
                font-size:12px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(86,105,128,1);
                line-height:20px;
                text-align:center;
              }
            }
        }
      .statistics:last-child{
        margin-right:0;
      }
    }
  }
</style>
