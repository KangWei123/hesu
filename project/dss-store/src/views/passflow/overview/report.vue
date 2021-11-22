<template>
  <div class="weekly">
    <report-header :type="type" @changeValue="changeDate" @share="clickShare"/>
    <div class="container">
      <section class="top">
        <div>
          <div class="title">WakeData门店{{type=="day"?"日":"周"}}报（{{companyName}}）</div>
          <div class="store-name">
            <div>{{storeName}}</div>
            <div class="time-container"><span class="time">{{startTime}}</span><span class="time" v-show="!!endTime"> ~ {{endTime}}</span>
            </div>
          </div>
        </div>
      </section>
      <!-- 门店指标 -->
      <section class="moudle-container" v-for="(dataSource,index) in data" :key="index" v-if="!!dataSource.data.length" v-loading="loading">
        <div class="title">{{dataSource.group | name}}</div>
        <div class="store-indicator-container">
          <report-card v-for="(item,index) in dataSource.data" :key="index" :group-id="dataSource.group" :data="item" :type="type"></report-card>
        </div>
      </section>
      <section class="moudle-container" v-if="type === 'week' && !!portraitsData"  v-loading="portraitsLoading">
        <div class="title">客流画像</div>
        <div class="passenger-flow-portrait-container">
          <div v-for="(item,index) in portraitsData" :key="index" class="passenger-flow-portrait-sub-container" :class="{age: item.tag === 'user_age', job:item.tag === 'user_job',sex:item.tag === 'sex' , consumption: item.tag === 'user_consumption'}">
            <div class="passenger-flow-portrait-title">{{item.tag | portraitsName}}</div>
            <div class="data-container" v-if="item.tag !== 'user_job'">
              <div v-for="(data,index1) in item.data" :key="index1" class="content-container">
                <div class="value">{{data.portraitRate.toFixed(1)}}%</div>
                <div class="name" :class="{man: item.tag === 'sex' && data.portraitName === '男',woman: item.tag === 'sex' && data.portraitName === '女'}">{{data.portraitName}}</div>
                <div v-if="data.dayOnDay || data.dayOnDay === 0" class="data-container-rate" :class="{'increase' : data.dayOnDay >= 0 , 'reduce' : data.dayOnDay < 0}">
                  <div>环比</div>
                  <div class="ratio-value">{{data.dayOnDay > 0 ? '+' : ''}}{{data.dayOnDay}}%</div>
                  <div class="indicator"></div>
                </div>
              </div>
            </div>
            <chart-job-bar v-else :data="item.data"  height="280px" style="padding:0px 100px;"></chart-job-bar>
          </div>
        </div>
      </section>
      
      <!-- 分享dialog -->
      <el-dialog width="640px" height="260px" :show-close="false" :visible.sync="dialogVisible" :modal-append-to-body="false">
        <div class="weekly-dialog-container">
          <div class="header">
            <div @click="handleClick(0)">
              <div :class="{normal: shareSelectIndex !== 0,select:shareSelectIndex === 0}">链接分享</div>
              <div class="line" v-if="shareSelectIndex === 0"></div>
            </div>
            <!-- <div @click="handleClick(1)">
              <div :class="{normal: shareSelectIndex !== 1,select:shareSelectIndex === 1}">微信分享</div>
              <div class="line" v-if="shareSelectIndex === 1"></div>
            </div> -->
          </div>
          <div class="sperator-line"></div>
          <div class="link-container">
            <div v-if="shareSelectIndex === 0">
              <el-input class="input" type="text" v-model="shareLink" placeholder="请输入内容" :disabled="true">
                <template slot="suffix"><el-button @click="handleIdName()" type="primary">&nbsp;复制&nbsp;</el-button></template>
              </el-input>
            </div>
            <div v-else>
              <!-- 微信分享内容 -->
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import weeklyLess from './report.less';
import reportHeader from './report-header.vue';
import reportCard from './report-card.vue';
import storeApi from '@/dss-common/api/store';
import ChartJobBar from './chartJobBar.vue';
export default {
  data() {
    return {
      storeIndicatorData: [],
      data: [],
      portraitsData: [],
      type: '',
      startTime: '',
      endTime: '',
      dialogVisible: false,
      activeName: 'first',
      shareLink: '',
      loading: false,
      portraitsLoading: false,
      shareSelectIndex: 0
    };
  },
  components: {
    reportHeader,
    reportCard,
    ChartJobBar
  },
  filters: {
    name(value) {
      switch (value) {
        case 'index':
          return '门店指数';
        case 'customer':
          return '门店指标';
        case 'satisfyRate':
          return '指标达成率';
      }
    },

    portraitsName(value) {
      switch (value) {
        case 'sex':
          return '性别';
        case 'user_age':
          return '年龄';
        case 'user_job':
          return '职业';
        case 'user_consumption':
          return '消费水平';
      }
    }
  },
  created() {
    this.type = this.$route.query.type;
  },

  computed: {
    companyName() {
      return this.$store.state.selectedEp.epName;
    },
    storeName() {
      return this.$store.state.curStore.name;
    }
  },
  methods: {
    changeDate(param) {
      this.type = param.type;
      this.startTime = param.startTime;
      this.endTime = param.endTime ? param.endTime : '';
      this.loading = true;
      if (this.type === 'day') {
        storeApi.dailyReportData({ date: this.startTime }).then(response => {
          this.loading = false;
          this.data = response.data;
        });
      } else {
        // 获取周报接口
        storeApi.weeklyReportData({ startDate: this.startTime, endDate: this.endTime }).then(response => {
          this.loading = false;
          this.data = response.data;
        });
        // 获取周报画像接口
        this.portraitsLoading = true;
        storeApi.weeklyReportPortraitsData({ startDate: this.startTime, endDate: this.endTime }).then(response => {
          this.portraitsLoading = false;
          // 对response排序
          let tempArr = response.data;
          for (let i = 0; i < tempArr.length - 1; i++) {
            for (let j = i + 1; j < tempArr.length; j++) {
              if (
                tempArr[i].data.length > tempArr[j].data.length ||
                (tempArr[i].tag === 'user_age' && tempArr[j].tag === 'user_consumption')
              ) {
                let temp = tempArr[j];
                tempArr[j] = tempArr[i];
                tempArr[i] = temp;
              }
            }
          }

          this.portraitsData = tempArr;
          for (let i = 0; i < this.portraitsData.length; i++) {
            if (this.portraitsData[i].tag === 'user_job') {
              for (const iterator of this.portraitsData[i].data) {
                iterator.portraitRate = iterator.portraitRate / 100;
              }
            }
          }
        });
      }
    },

    clickShare() {
      let params = {
        startDate: this.startTime,
        endDate: this.endTime || this.startTime,
        type: this.type === 'day' ? 'D' : 'W'
      };
      storeApi.shareReport(params).then(response => {
        this.shareLink = window.location.origin + '/report.html?shareUuid='+response.data.shareId;
        this.dialogVisible = true;
      });
    },

    handleClick(index) {
      this.shareSelectIndex = index;
    },

    handleIdName(val) {
      var oInput = document.createElement('input');
      oInput.value = this.shareLink;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      oInput.style.display = 'none';
      this.$message({
        message: '复制成功',
        type: 'success'
      });
    }
  }
};
</script>

