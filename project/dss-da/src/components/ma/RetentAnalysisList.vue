<template>
      <div class="formtable">
        <div class="card-title">
          <!--<span class="da-block-title">场景值详情列表</span>-->
          <span class="export-btn"
                v-if="this.tableData && this.tableData.length"
                style="cursor:pointer"
                @click="downloadExcel(isActive)">导出报表</span>
        </div>
        <div class="cla-buttom">
          <el-button size="mini" :class="{ 'is-active': isActive === 'newadd' ? true : false  }"  @click="newadd('newadd')">新增留存</el-button>
          <el-button size="mini" :class="{ 'is-active': isActive === 'activeadd' ? true : false }" @click="newadd('activeadd')">活跃留存</el-button>
        </div>
        <table class="da-table imagetable" style="text-align:center;">
          <thead>
            <tr style="padding: 5px 0;">
              <th>日期</th>
              <th>{{ isActive === 'newadd'? '新增用户':'活跃用户'}}</th>
              <th>次日</th>
              <th>2日</th>
              <th>3日</th>
              <th>4日</th>
              <th>5日</th>
              <th>6日</th>
              <th>7日</th>
              <th>14日</th>
              <th>30日</th>
            </tr>
          </thead>
          <tbody v-if="tableData && tableData.length">
            <tr v-for="item in tableData">
              <td v-bind="{'exist':item.statDate}">{{item.statDate}}</td>
              <td v-bind="{'exist':item.newUser}">{{item.newUser||item.activeUser}}</td>
              <td class="cla-color1" v-bind:class="{'exist':item.oneLeftUserRate}">{{item.oneLeftUserRate ? parseFloat(item.oneLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color2" v-bind:class="{'exist':item.twoLeftUserRate}">{{item.twoLeftUserRate ? parseFloat(item.twoLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color3" v-bind:class="{'exist':item.threeLeftUserRate}">{{item.threeLeftUserRate ? parseFloat(item.threeLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color3" v-bind:class="{'exist':item.fourLeftUserRate}">{{item.fourLeftUserRate ? parseFloat(item.fourLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color3" v-bind:class="{'exist':item.fiveLeftUserRate}">{{item.fiveLeftUserRate ? parseFloat(item.fiveLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color3" v-bind:class="{'exist':item.sixLeftUserRate}">{{item.sixLeftUserRate ? parseFloat(item.sixLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color3" v-bind:class="{'exist':item.sevenLeftUserRate}">{{item.sevenLeftUserRate ? parseFloat(item.sevenLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color3" v-bind:class="{'exist':item.fourteenLeftUserRate}">{{item.fourteenLeftUserRate ? parseFloat(item.fourteenLeftUserRate*100).toFixed(0)+'%':''}}</td>
              <td class="cla-color4" v-bind:class="{'exist':item.thirtyLeftUserRate}">{{item.thirtyLeftUserRate ? parseFloat(item.thirtyLeftUserRate*100).toFixed(0)+'%':''}}</td>
            </tr>
          </tbody>
          <tbody v-else >
          <tr>
            <td colspan="11" width="100%" ><place-holder :height="300"/>
            </td>
          </tr>
          </tbody>

        </table>
      </div>
    </template>

    <script>
      import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
      import utils from '@/dss-common/utils/index';
      const DateRange = 'dateRange';
      const APPKEY = 'app_key';
      function formatDate(t) {
        return utils.timeFormat(t, 'YYYY-MM-DD');
      }
      export default {
        props: ['parenformtable', 'status', 'strDateRange'],
        components: {
          PlaceHolder
        },
        data() {
          return {
            isActive: 'newadd',
            select: false,
            eltable: false,
            tableData: [],
            dateRange: []
          };
        },
        watch: {
          parenformtable: function() {
            this.tableData = this.parenformtable;
          },
          status: function() {
            this.eltable = this.status.eltable;
            this.select = this.status.select;
            this.isActive = this.status.activepage;
          }
          //监听状态变化
          // isActive: function(){
          //   if (this.isActive === 'newadd'){
          //     this.isActive = 'newadd'
          //   } else{
          //     this.isActive = 'activeadd'
          //   }
          // }
        },
        mounted() {
          this.tableData = this.parenformtable;
          this.eltable = this.status.eltable;
          this.select = this.status.select;
          this.isActive = this.status.activepage ? this.status.activepage : this.isActive;
          this.getappkey();
        },
        methods: {
          toviewtrend() {
            this.$router.push({ path: '/count/viewtrend' });
          },
          toviewparameter() {
            this.$router.push({ path: '/count/viewparameter' });
          },
          getappkey() {
            this.appKey = window.localStorage.getItem(APPKEY);
          },
          newadd(val) {
            this.isActive = val;
            this.$emit('toSwitch', this.isActive);
          },
          // 下载留存分析表格
          downloadExcel(val) {
            this.dateRange = this.strDateRange;
            if (this.dateRange) {
              let beginDate = this.dateRange[0];
              let endDate = this.dateRange[1];
              if (val === 'newadd') {
                let url =
                  location.protocol +
                  '//' +
                  location.host +
                  '/athena/reportforms/downloadnewremainanalysisdata?appKey=' +
                  this.appKey +
                  '&' +
                  'beginDate=' +
                  beginDate +
                  '&' +
                  'endDate=' +
                  endDate;
                window.open(url);
              } else if (val === 'activeadd') {
                let url =
                  location.protocol +
                  '//' +
                  location.host +
                  '/athena/reportforms/downloadactiveremainanalysisdata?appKey=' +
                  this.appKey +
                  '&' +
                  'beginDate=' +
                  beginDate +
                  '&' +
                  'endDate=' +
                  endDate;
                window.open(url);
              }
            }
          }
        }
      };
    </script>

    <style>
      .cla-buttom{
        display:inline-block;
        text-align:left;
        margin-bottom:20px;
      }
      .el-button.active{

      }
      .formtable{
        padding:20px;
        box-sizing: border-box;
        background:rgba(255,255,255,1);
        border-radius: 4px;
      }
      table.imagetable {
        height: 20px;
        border-collapse: collapse;
        width: 100%;
        border: 1px solid #ebeef5;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        thead{
          background: #fafafa;
          color: #666;
          border-bottom: 1px solid #ebeef5;
        }
      }
      table.imagetable thead th {
        padding: 5px 0;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      table.imagetable tbody td {
        /*background-color: #fff;*/
        padding: 12px 0;
        border-bottom: 1px solid #ebeef5;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      table.imagetable tbody tr:nth-child(even){
        background: #fafafa;
      }
      table.imagetable tbody td.cla-color1.exist{
        background-color:#1090B1;
        color:#ffffff;
      }
      table.imagetable tbody td.cla-color2.exist{
        background-color:#27A4C4;
        color:#ffffff;
      }
      table.imagetable tbody td.cla-color3.exist{
        background-color:#3AAFCD;
        color:#ffffff;
      }
      table.imagetable tbody td.cla-color4.exist{
        background-color:#53C0DC;
        color:#ffffff;
      }
      .card-title {
        margin-bottom: 15px;

      .export-btn {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(46, 141, 255, 1);
        line-height: 20px;
        float: right;
      }
      }
    </style>

