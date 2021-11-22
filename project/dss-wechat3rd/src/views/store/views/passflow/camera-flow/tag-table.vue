<template>
  <div class="compare-table tag-table"
       v-loading="loading">
    <el-table :data="customerTagData"
              stripe
              style="width: 100%">
      <el-table-column label="用户ID/名称"
                       width="180">
        <template slot-scope="scope">
          <span>{{scope.row.id}}{{scope.row.name?'/'+scope.row.name:''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sex"
                       label="性别"
                       width="150"></el-table-column>

      <el-table-column prop="age"
                       label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.age |age}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="enterCount"
                       label="到店次数"></el-table-column>
      <el-table-column label="是否为会员">
        <template slot-scope="scope">
          <span> {{scope.row.memberType? '是': '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oldCustomer"
                       label="新/老客户">
        <template slot-scope="scope">
          <span> {{scope.row.oldCustomer? '老客': '新客'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enterTime"
                       :formatter="formateDateTime"
                       label="进店时间(最近)">
      </el-table-column>
      <el-table-column label="详情"
                       width="150">
        <template slot-scope="scope">
          <popover :row='scope.row'></popover>
        </template>
      </el-table-column>
      <el-table-column width="150"
                       label="备注">
        <template slot-scope="scope">
          <a href="javascript:void(0);"
             @click="editTag(scope.row)">编辑</a>
        </template>
      </el-table-column>
      <!--修改无数据时的展示-->
      <template slot="empty">
        <place-holder></place-holder>
      </template>

    </el-table>

    <el-pagination layout="prev, pager, next, jumper, sizes, total"
                   :total="totalTagsCount"
                   :current-page="pageParams.pageNo"
                   :page-size="pageParams.pageSize"
                   :page-sizes="[5, 10, 20, 30, 40, 50]"
                   @size-change="onSizeChange"
                   @current-change="onPageChange">
    </el-pagination>
    <editor-dialog :showMemberEditor='showMemberEditor'
                   v-if="showMemberEditor"
                   :userData='userData'
                   :closeHandler="close"></editor-dialog>

  </div>
</template>

<script>
import PlaceHolder from '@/dss-common/components/placeholder/index';
import DateUtil from '@/dss-common/utils/date.js';
import utils from '@/dss-common/utils';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import PassengerFlowEnum from '@/dss-common/enums/PassengerFlow.js';
import EditorDialog from './editor-dialog.vue';
import popover from './popover.vue';

export default {
  components: {
    PlaceHolder,
    EditorDialog,
    popover
  },

  data() {
    return {
      dateRange: [],
      showDialog: false,
      lived: false,
      loading: false,
      showPopover: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10
      },
      totalTagsCount: 0,
      // 到店客户标签数据
      customerTagData: [],
      showMemberEditor: false,
      userData: {},
      enterTime: null
    };
  },

  watch: {
    dateRange(newVal) {
      if (!!newVal && newVal.length > 0) {
        this.apiTagData(true);
      }
    },
    enterTime(newVal) {
      if (newVal) {
        this.getTagDataInterval(true);
      }
    }
  },

  mounted() {
    this.lived = true;
    this.dateRange = utils.getTimeRange(7, new Date(new Date().getTime()));
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
      this.apiTagData();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      if (this.pageParams.pageNo === 1) {
        this.lived = true;
      } else {
        this.lived = false;
        this.enterTime = null;
      }
      this.apiTagData();
    },

    //编辑
    editTag(row) {
      this.showMemberEditor = true;
      this.userData = row;
    },

    close() {
      this.showMemberEditor = false;
      this.apiTagData();
    },

    onCheckChanged(row) {
      if (!!row.employee) {
        this.hideCustomerTag(row);
      } else {
        this.showCustomerTag(row);
      }
    },

    togglePopover() {
      this.showPopover = !this.showPopover;
    },

    /*用户标签数据*/
    apiTagData(autoRefresh) {
      if (!autoRefresh) {
        this.loading = true;
      }
      let params = {
        startDate: this.formatDate(this.dateRange[0]),
        endDate: this.formatDate(this.dateRange[1]),
        equType: PassengerFlowEnum.equType.camera,
        ...this.pageParams
      };
      return cameraFlowApi
        .getNewCameraTag(params)
        .then(result => {
          if (result.data && result.data.length) {
            this.customerTagData = result.data || [];
            this.enterTime = this.customerTagData[0].enterTime;
            this.totalTagsCount = result.totalCount;
            this.tagJson();
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    getMilliseconds(date, zone) {
      //得到1970年一月一日到现在的秒数
      let len = date.getTime();
      //本地时间与GMT时间的时间偏移差
      let offset = date.getTimezoneOffset() * 60000;
      let utcTime = len + offset;
      date = new Date(utcTime + 3600000 * zone);
      return date.getMilliseconds();
    },

    /*锚点查询用户标签数据*/
    apiNewTagData(autoRefresh) {
      if (!autoRefresh) {
        this.loading = true;
      }
      let enterTime = this.enterTime;
      let params = {
        enterTimeAnchor: enterTime,
        pageNo: 1,
        pageSize: this.pageParams.pageSize
      };
      return cameraFlowApi
        .getNewCameraTag(params)
        .then(result => {
          if (result.data && result.data.length) {
            this.enterTime = result.data[0].enterTime;
            //返回errorCode=101全量刷新
            if (result.errorCode === 101) {
              this.enterTime = null;
            }
            let data = result.data || [];
            this.customerTagData = this.unique(data.concat(this.customerTagData)).slice(0, this.pageParams.pageSize);
            this.totalTagsCount = this.totalTagsCount + result.totalCount;
            this.tagJson();
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    unique(arr) {
      // 根据唯一标识id来对数组进行去重
      const res = new Map(); //定义常量 res,值为一个Map对象实例
      //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter(item => !res.has(item.id) && res.set(item.id, 1));
    },

    tagJson() {
      this.customerTagData.forEach(item => {
        if (item.tag) {
          item.tag = JSON.parse(item.tag);
        }
        if (item.jiGuangTag) {
          item.jiGuangTag = JSON.parse(item.jiGuangTag);
          let list = [];
          //消费能力
          if (item.jiGuangTag.fim_fism_conl_cir) {
            if (item.jiGuangTag.fim_fism_conl_cir !== '低')
              this.pushList(list, '消费能力' + item.jiGuangTag.fim_fism_conl_cir);
          }
          //职业
          if (item.jiGuangTag.som_ocm_career && item.jiGuangTag.som_ocm_career !== '其他') {
            //list.push(item.jiGuangTag.som_ocm_career);
            this.pushList(list, item.jiGuangTag.som_ocm_career);
          }
          //学历
          if (item.jiGuangTag.cpl_indm_edu_level) {
            if (item.jiGuangTag.cpl_indm_edu_level !== '低')
              this.pushList(list, '学历' + item.jiGuangTag.cpl_indm_edu_level);
          }
          //消费偏好
          if (item.jiGuangTag.gbm_bhm_purb_conp) {
            //list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_conp));
            this.pushList(list, item.jiGuangTag.gbm_bhm_purb_conp);
          }
          //上网目的
          if (item.jiGuangTag.gbm_bhm_purb_supr) {
            //list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_supr));
            this.pushList(list, item.jiGuangTag.gbm_bhm_purb_supr);
          }
          //应用偏好
          if (item.jiGuangTag.gbm_bhm_appp_appr_s) {
            //list.push(this.getOne(item.jiGuangTag.gbm_bhm_appp_appr_s));
            this.pushList(list, item.jiGuangTag.gbm_bhm_appp_appr_s);
          }
          //购买方式
          if (item.jiGuangTag.gbm_bhm_purb_purw) {
            //list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_purw));
            this.pushList(list, item.jiGuangTag.gbm_bhm_purb_purw);
          }
          //兴趣爱好
          if (item.jiGuangTag.gbm_hbm_s) {
            //list.push(this.getOne(item.jiGuangTag.gbm_hbm_s));
            this.pushList(list, item.jiGuangTag.gbm_hbm_s);
          }
          item.tagList = list;
        }
      });
    },

    pushList(list, tag) {
      if (!tag) {
        return;
      }
      //从大类中取一个标签，过滤标签等于其他，取下一个
      let reg = /(其它)|(未知)|(-99999)/;
      tag = tag.split(',');
      for (let i = 0, j = tag.length; i < j; i++) {
        if (!!tag[i] && !reg.test(tag[i])) {
          return list.push(tag[i]);
        }
      }
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

    hideCustomerTag(row) {
      let params = {
        identifier: row.identifier,
        deviceType: PassengerFlowEnum.deviceType.camera
      };
      cameraFlowApi.setTagFlag(params).then(res => {
        if (!!res && res.data) {
          this.getTagDataInterval(true);
        }
      });
    },

    showCustomerTag(row) {
      let params = {
        identifier: row.identifier,
        deviceType: PassengerFlowEnum.deviceType.camera
      };
      cameraFlowApi.deleteTagFlag(params).then(res => {
        if (!!res && res.data) {
          this.getTagDataInterval(true);
        }
      });
    },

    slimScroll() {
      $(this.$el)
        .find('tag-table-body')
        .slimScroll({
          size: '5px',
          height: '420px'
        })
        .trigger('mouseleave');
    },

    indexMethod(index) {
      return this.customerTagData.length - index;
    },

    formateDateTime(row, column) {
      let date = row[column.property];
      if (!!date) {
        return DateUtil.format(new Date(date), 'MM/DD HH:mm', 8);
      }

      return '';
    },

    formatDate(datetime) {
      return utils.timeFormat(datetime, 'YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>
<style  lang="less">
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
</style>
