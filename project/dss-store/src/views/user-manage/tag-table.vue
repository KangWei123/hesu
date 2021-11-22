<template>
  <div v-loading="loading"
       class="user-flow">

    <div class="btn-box">
      <el-form class="condition-form" ref="form" :model="queryForm" label-width="80px">
        <div>
          <div class="btn-box-item">
            <el-form-item label="制单时间:">
              <el-date-picker
                style="width: 240px;"
                size="mini"
                v-model="queryForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="onDatePickerChange">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="btn-box-item">
            <el-form-item label-width="0px">
              <el-radio-group v-model="queryForm.dateType" size="mini" @change="onDateTypeChange">
                <el-radio-button class="user-flow-condition has-badge" label="today">今日</el-radio-button>
                <el-radio-button class="user-flow-condition" label="week">本周</el-radio-button>
                <el-radio-button class="user-flow-condition" label="month">本月</el-radio-button>
                <el-radio-button class="user-flow-condition" label="all">全部</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div>
          <div class="btn-box-item">
            <el-form-item label="用户搜索:">
              <el-input
                type="input"
                size="mini"
                style="width: 240px;"
                placeholder="输入用户ID/姓名查看"
                v-model.trim="queryForm.keyword">
                <i class="el-icon-picture-outline el-input__icon"
                  v-if="!ImgUrl"
                  slot="suffix"
                  @click="uploadImg"
                  style="cursor: pointer">
                </i>
                <div class="search-img"
                    slot="suffix"
                    v-if="ImgUrl">
                  <img :src="ImgUrl">
                  <i class="el-icon-close search-icon"
                    @click="deleteImg"></i>
                </div>
              </el-input>
            </el-form-item>
          </div>
          <div class="btn-box-item">
            <el-form-item label="用户类型:">
              <el-select v-model="queryForm.memberType" size="mini" style="width: 180px;">
                <el-option
                  v-for="item in userTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-button type="primary" style="background: #409EFF; font-size: 12px; margin-left: 8px;" @click="onQuery">查看</el-button>
        </div>
      </el-form>
    </div>

    <div class="compare-table tag-table">
      <template>
        <template v-if="customerTagData && customerTagData.length">
          <el-table
            :data="customerTagData"
            stripe
            style="width: 100%">
            <el-table-column label="头像" min-width="150">
              <div slot-scope="scope">
                <img class="avatar" :src="'data:image/jpeg;base64,' + scope.row.image" @click="onShowAvatar(scope.row)">
                <!-- <span>{{scope.row.name ? scope.row.name : scope.row.customerId}}</span> -->
                <!-- <span>{{scope.row.customerId}}{{scope.row.name?'/'+scope.row.name:''}}</span> -->
                <span>{{scope.row.id}}{{scope.row.name?'/'+scope.row.name:''}}</span>
              </div>
            </el-table-column>
            <el-table-column prop="sex" label="性别" min-width="80"></el-table-column>

            <el-table-column prop="age"
                            label="年龄"
                            min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.age |age}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="enterCount"
                            label="到店次数"
                            min-width="80"></el-table-column>
            <el-table-column prop="memberType"
                            label="用户类型"
                            min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.memberType === 1">会员</span>
                <span v-else-if="scope.row.memberType === 2">店员</span>
                <span v-else-if="scope.row.memberType === 3">黑名单</span>
                <span v-else>普通用户</span>
              </template>
            </el-table-column>
            <el-table-column prop="enterTime"
                            :formatter="formateDateTime"
                            label="进店时间(最近)">
            </el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <popover :row='scope.row'></popover>
                <a href="javascript:void (0);"
                  @click="editTag(scope.row)">编辑</a>
              </template>
            </el-table-column>

          </el-table>
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalTagsCount"
            :current-page="pageParams.pageNo"
            :page-size="pageParams.pageSize"
            :page-sizes="[5, 10, 20, 30, 40, 50]"
            @size-change="onSizeChange"
            @current-change="onPageChange">
          </el-pagination>
        </template>

        <div v-else class="nodata-content">
          <div class="content">
            <img src="../../images/no-data.png" alt="暂无数据">
            <p class="tips">未查询到匹配记录</p>
          </div>
        </div>
      </template>
      <editor-dialog :showMemberEditor='showMemberEditor'
                     :userData='userData'
                     v-if="showMemberEditor"
                     :closeHandler="close"></editor-dialog>

      <image-dialog :showEditor='showImgDialog'
                    v-if="showImgDialog"
                    @choose="imageColse"
                    :closeHandler="imgColse"></image-dialog>
      <avatar-dialog :value.sync="showAvatarDialog" :avatar="curAvatatData"></avatar-dialog>
    </div>
  </div>
</template>

<script>
import PlaceHolder from '@/dss-common/components/placeholder/index';
import DateUtil from '@/dss-common/utils/date.js';
import utils from '@/dss-common/utils';
// import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import newCameraFlowApi from '../../api/camera-flow.js';
import PassengerFlowEnum from '@/dss-common/enums/PassengerFlow.js';
import EditorDialog from './editor-dialog.vue';
import imageDialog from './image-dialog.vue';
import popover from './popover.vue';
import AvatarDialog from './avatar-dialog.vue';
const typeEnum = { DEFAULT: 0, WHITE: 1 };

export default {
  components: {
    PlaceHolder,
    EditorDialog,
    popover,
    imageDialog,
    AvatarDialog
  },

  props: {
    dateRange: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      loading: false,
      showPopover: false,
      showImgDialog: false,
      ImgUrl: null,
      pageParams: {
        pageNo: 1,
        pageSize: 10
      },
      totalTagsCount: 0,
      // 到店客户标签数据
      customerTagData: [],
      showMemberEditor: false,
      userData: {},
      type: false,
      typeEnum,
      showAvatarDialog: false,
      curAvatatData: null,
      lived: false,
      enterTime: null,
      keyword: '',
      queryForm: {
        keyword: '',
        dateRange: [new Date(), new Date()],
        dateType: 'today',
        memberType: ''
      },
      userTypeOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '普通用户',
          value: 0
        },
        {
          label: '会员',
          value: 1
        },
        {
          label: '店员',
          value: 2
        },
        {
          label: '黑名单',
          value: 3
        }
      ]
    };
  },

  mounted() {
    this.lived = true;
    this.apiTagData();
  },

  destroyed() {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.lived = false;
  },

  filters: {
    age(val) {
      if (val < 18) {
        val = '< ' + 18;
      }
      return val;
    }
  },

  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      if (this.queryForm.dateType === 'today') this.lived = true;
      this.apiTagData();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      if (this.pageParams.pageNo === 1 && this.queryForm.dateType === 'today') {
        this.lived = true;
      } else {
        this.lived = false;
        this.enterTime = null;
      }
      this.apiTagData();
    },

    //编辑
    editTag(row) {
      this.userData = row;
      this.showMemberEditor = true;
    },

    close() {
      this.showMemberEditor = false;
      if (this.queryForm.dateType === 'today') {
        this.apiTagData();
        return;
      }
      this.getEditRech();
    },

    //编辑时只刷新编辑的那一条
    getEditRech() {
      let params = {
        pageSize: 10,
        pageNo: 1,
        unionId: this.userData.unionId
      };
      // cameraFlowApi
      //   .getCustomerList(params)
      newCameraFlowApi
        .fetchCustomerList(params)
        .then(result => {
          let data = result.data;
          if (data && data.length) {
            let customerTagData = [];
            this.customerTagData.forEach((item, index) => {
              if (item.unionId === this.userData.unionId) {
                item = data[0];
                item.customerId = item.id;
                item.enterTime = item.lastEnterTime;
              }
              customerTagData.push(item);
            });
            this.customerTagData = customerTagData;
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    uploadImg() {
      if (!this.ImgUrl && !this.type) {
        this.showImgDialog = true;
      }
    },

    deleteImg() {
      this.ImgUrl = null;
    },

    imgColse() {
      this.showImgDialog = false;
    },

    imageColse(res) {
      if (res) {
        this.ImgUrl = res;
        this.showImgDialog = false;
      }
      // if (res) {
      //   this.pageParams.pageNo = 1;
      //   this.totalTagsCount = res.data.length;
      //   this.customerTagData = res.data;
      //   this.ImgUrl = res.img;
      //   this.showImgDialog = false;
      // }
    },

    onFliter() {
      this.pageParams.pageNo = 1;
      this.apiTagData();
    },

    /*用户标签数据*/
    apiTagData(autoRefresh) {
      if (!autoRefresh) {
        this.loading = true;
      }
      // 今日(实时)获取实时数据
      if (this.queryForm.dateType === 'today') {
        let params = {
          // startDate: this.formatDate(this.queryForm.dateRange[0]),
          // endDate: this.formatDate(this.queryForm.dateRange[1]),
          // equType: PassengerFlowEnum.equType.camera,
          ...this.pageParams
        };
        return (
          // cameraFlowApi
          newCameraFlowApi
            .fetchRealTimeCustomerList(params)
            // .getNewCameraTag(params)
            .then(
              result => {
                if (result.data && result.data.length) {
                  // this.customerTagData = result.data || [];
                  const list = result.data || [];
                  list.forEach(item => {
                    item.id = item.customerId;
                  });
                  this.customerTagData = list;
                  this.enterTime = this.customerTagData[0].enterTime;
                  this.totalTagsCount = result.totalCount;
                  this.tagJson();
                }
              },
              error => {
                this.customerTagData = [];
              }
            )
            .always(() => {
              this.loading = false;
              if (this.lived) this.getTagDataInterval(true);
            })
        );
      } else {
        // 请求非实时接口
        let params = {
          name: this.queryForm.keyword ? this.queryForm.keyword : undefined,
          startDate:
            this.queryForm.dateRange && this.queryForm.dateRange[0]
              ? `${this.formatDate(this.queryForm.dateRange[0])} 00:00:00`
              : undefined,
          endDate:
            this.queryForm.dateRange && this.queryForm.dateRange[1]
              ? `${this.formatDate(this.queryForm.dateRange[1])} 23:59:59`
              : undefined,
          memberType: this.queryForm.memberType,
          ...this.pageParams,
          imageBase64: this.ImgUrl
        };
        return (
          // cameraFlowApi
          // .getCustomerList(params)
          newCameraFlowApi
            .fetchCustomerList(params)
            .then(
              result => {
                const list = result.data || [];
                list.forEach(item => {
                  item.customerId = item.id;
                  item.enterTime = item.lastEnterTime;
                });
                this.customerTagData = list;
                // this.customerTagData = result.data || [];
                this.totalTagsCount = result.totalCount;
                this.tagJson();
              },
              error => {
                this.customerTagData = [];
              }
            )
            .always(() => {
              this.loading = false;
            })
        );
      }
    },

    /*锚点查询用户标签数据*/
    apiNewTagData(autoRefresh) {
      if (!autoRefresh) {
        this.loading = true;
      }
      let enterTime = this.enterTime;
      let params = {
        enterTimeAnchor: enterTime ? enterTime : undefined,
        pageNo: 1,
        pageSize: this.pageParams.pageSize
      };
      return (
        // cameraFlowApi
        newCameraFlowApi
          .fetchRealTimeCustomerList(params)
          // .getNewCameraTag(params)
          .then(
            result => {
              if (result.data && result.data.length) {
                this.enterTime = result.data[0].enterTime;
                //返回errorCode=101全量刷新
                if (result.errorCode === 101) {
                  this.enterTime = null;
                }
                let data = result.data || [];
                data.forEach(item => {
                  item.id = item.customerId;
                });
                this.customerTagData = this.unique(data.concat(this.customerTagData)).slice(
                  0,
                  this.pageParams.pageSize
                );
                this.totalTagsCount = this.totalTagsCount + result.totalCount;
                this.tagJson();
              }
            },
            error => {
              this.customerTagData = [];
            }
          )
          .always(() => {
            this.loading = false;
          })
      );
    },

    unique(arr) {
      // 根据唯一标识id来对数组进行去重
      const res = new Map(); //定义常量 res,值为一个Map对象实例
      //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter(item => !res.has(item.id) && res.set(item.id, 1));
    },

    tagJson: function() {
      this.customerTagData.forEach(item => {
        if (item.tag) {
          item.tag = JSON.parse(item.tag);
        }
        if (item.jiGuangTag) {
          item.jiGuangTag = JSON.parse(item.jiGuangTag);
          let list = [];
          if (item.jiGuangTag.fim_fism_conl_cir) {
            list.push('消费能力' + item.jiGuangTag.fim_fism_conl_cir);
          }
          if (item.jiGuangTag.som_ocm_career && item.jiGuangTag.som_ocm_career !== '其他') {
            list.push(item.jiGuangTag.som_ocm_career);
          }
          if (item.jiGuangTag.cpl_indm_edu_level) {
            list.push('学历' + item.jiGuangTag.cpl_indm_edu_level);
          }
          if (item.jiGuangTag.gbm_bhm_purb_conp) {
            list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_conp));
          }
          if (item.jiGuangTag.gbm_bhm_purb_supr) {
            list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_supr));
          }
          if (item.jiGuangTag.gbm_bhm_appp_appr_s) {
            list.push(this.getOne(item.jiGuangTag.gbm_bhm_appp_appr_s));
          }
          if (item.jiGuangTag.gbm_bhm_purb_purw) {
            list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_purw));
          }
          if (item.jiGuangTag.gbm_hbm_s) {
            list.push(this.getOne(item.jiGuangTag.gbm_hbm_s));
          }
          item.tagList = list;
        }
      });
    },
    getOne(data) {
      let one = '';
      data = data.split(',');
      data.forEach(item => {
        if (item !== '其它' && item !== '其他' && one === '') {
          one = item;
        }
      });
      return one;
    },
    getTagDataInterval(autoRefresh) {
      if (!!this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      if (this.lived) {
        this.apiNewTagData(autoRefresh).always(() => {
          if (this.lived) {
            this.timeoutId = setTimeout(() => {
              this.getTagDataInterval(autoRefresh);
            }, 1000);
          }
        });
      }
    },

    formateDateTime(row, column) {
      let date = row[column.property];
      if (!!date) {
        return DateUtil.format(new Date(date), 'MM/DD HH:mm', 8);
      }

      return '';
    },

    formatDate(datetime) {
      return utils.timeFormat(datetime, 'YYYY-MM-DD');
    },

    onQuery() {
      this.lived = false;
      this.pageParams.pageNo = 1;
      if (this.queryForm.dateType === 'today') this.queryForm.dateType = '';
      this.apiTagData();
    },
    onDatePickerChange(val) {
      this.queryForm.dateType = '';
    },
    onDateTypeChange(val) {
      this.queryForm.dateType = val;
      this.pageParams.pageNo = 1;
      this.lived = false;
      this.enterTime = null;
      this.customerTagData = [];
      if (val === 'month') this.queryForm.dateRange = this.getTargetDate().month;
      if (val === 'week') this.queryForm.dateRange = this.getTargetDate().week;
      if (val === 'all') this.queryForm.dateRange = [];

      // 如选中今日(实时) 切换至请求实时数据
      if (val === 'today') {
        this.lived = true;
        this.queryForm = {
          keyword: '',
          dateRange: [new Date(), new Date()],
          dateType: 'today',
          memberType: ''
        };
        this.ImgUrl = null;
      }
      this.apiTagData();
    },
    // 获取本周、本月日期
    getTargetDate(target) {
      return {
        week: this.getWeekDate(),
        month: this.getCurrentMonth()
      };
    },
    // 获取本周起止日期(周一到周日)
    getWeekDate() {
      const startStop = new Array();
      const currentDate = new Date();
      const week = currentDate.getDay();
      const month = currentDate.getDate();

      const millisecond = 1000 * 60 * 60 * 24;
      const minusDay = week != 0 ? week - 1 : 6;
      //本周 周一
      const monday = new Date(currentDate.getTime() - minusDay * millisecond);
      //本周 周日
      const sunday = new Date(monday.getTime() + 6 * millisecond);
      startStop.push(monday); //本周起始时间
      startStop.push(sunday); //本周终止时间
      return startStop;
    },
    getCurrentMonth() {
      const startStop = [];
      const currentDate = new Date();
      let currentMonth = currentDate.getMonth();
      let currentYear = currentDate.getFullYear();
      const firstDay = new Date(currentYear, currentMonth, 1);
      //当为12月的时候年份需要加1 月份需要更新为0 也就是下一年的第一个月
      if (currentMonth == 11) {
        currentYear++;
        currentMonth = 0;
      } else {
        currentMonth++;
      }
      const millisecond = 1000 * 60 * 60 * 24;
      //下月的第一天
      const nextMonthDayOne = new Date(currentYear, currentMonth, 1);
      //求出上月的最后一天
      const lastDay = new Date(nextMonthDayOne.getTime() - millisecond);
      startStop.push(firstDay);
      startStop.push(lastDay);
      return startStop;
    },
    onShowAvatar(row) {
      this.curAvatatData = row.image || null;
      if (this.curAvatatData) {
        this.showAvatarDialog = true;
      }
    }
  }
};
</script>
<style lang="less">
.user-flow {
  padding: 0 20px;

  .tag_check {
    display: block;
    margin-top: 10px;
  }
  .right {
    text-align: right;
    width: 40px;
    display: inline-block;
    margin-right: 22px;
  }
  .passenger-flow-main .detail-button {
    display: inline-block;
    cursor: pointer;
  }

  /*白名单*/
  .white-list {
    margin-top: 20px;
  }
  /*搜索区域*/
  .btn-box {
    margin-top: 20px;
    padding: 20px;
    // height: 162px;
    box-sizing: border-box;
    // line-height: px;
    background: rgba(250, 250, 250, 1);

    .user-flow-condition.el-radio-button {
      .el-radio-button__inner {
        width: 90px;
        height: 30px;
        padding: 0;
        line-height: 30px;
        color: #333333;
        font-weight: 400;
      }

      &.is-active .el-radio-button__inner {
        color: #ffffff;
      }

      &.has-badge {
        position: relative;
        &::after {
          display: inline-block;
          content: '实时';
          width: 30px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          background: rgba(250, 88, 88, 1);
          border-radius: 1px;
          position: absolute;
          top: -8px;
          right: 0;
        }
      }
    }

    .btn-box-item {
      display: inline-block;
      vertical-align: top;
    }

    /deep/ .el-form.condition-form {
      .el-form-item__label {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
  .dss-filter-input {
    width: 250px;
  }

  .search-img {
    display: inline-block;
    position: relative;
    vertical-align: top;
    margin-left: 10px;
    width: 25px;
    height: 30px;
    img {
      width: 25px;
      height: 30px;
    }
    .search-icon {
      position: absolute;
      cursor: pointer;
      top: -7px;
      right: -7px;
      width: 15px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      font-size: 12px;
      color: white;
      background: #cecece;
      border-radius: 100%;
    }
  }

  .img-search-btn.checked {
    border: none;
    background: #e1e3e6;
    color: white;
    .search-text {
      color: white;
    }
  }
  .img-search-btn {
    display: inline-block;
    width: 120px;
    height: 30px;
    line-height: 28px;
    box-sizing: border-box;
    cursor: pointer;
    margin-left: 10px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(220, 222, 224, 1);
    .search-icon {
      display: inline-block;
      vertical-align: top;
      img {
        margin-left: 12px;
        display: inline-block;
        position: relative;
        top: 4px;
        width: 20px;
        height: 20px;
      }
    }
    .search-text {
      display: inline-block;
      margin-left: 2px;
      display: inline-block;
      font-size: 14px;
      color: rgba(37, 110, 255, 1);
    }
  }

  /*选项卡*/
  .bar-action-box {
    z-index: 1;
    overflow: hidden;

    .bar-action {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 20px;
      cursor: pointer;
    }

    .bar-action + .bar-action {
      margin-left: 20px;
    }

    .bar-action-active {
      color: rgba(56, 121, 251, 1);
      border-bottom: 2px solid rgba(56, 121, 251, 1);
    }
  }

  .tag-table {
    .avatar {
      display: inline-block;
      margin-right: 8px;
      width: 48px;
      height: 48px;
      border-radius: 100%;
      vertical-align: middle;
    }
  }

  .nodata-content {
    width: 100%;
    min-height: 200px;
    min-height: 300px;
    text-align: center;
    position: relative;

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        display: block;
        width: 195px;
        height: 216px;
      }

      .tips {
        font-size: 16px;
        font-weight: 400;
        margin-top: 20px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }

  .el-input--mini {
    .el-input__inner {
      font-size: 12px;
    }
  }
}
</style>
