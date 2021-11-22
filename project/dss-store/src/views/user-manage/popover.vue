<template>
  <el-popover placement="left"
              trigger="hover"
              popper-class="tag-popover"
              @show='getShopTag'>
    <img class="popover-img"
         :src="'data:image/jpeg;base64,' + row.image" />
    <div class="popover-list">
      <div class="popover-item"
           v-if="row.tag&&row.tag.gzl_name">
        <div class="popover-label">会员姓名：</div>
        <div class="popover-info">{{row.tag.gzl_name}}</div>
      </div>
      <div class="popover-item"
           v-if="!(row.tag&&row.tag.gzl_name)&&row.name">
        <div class="popover-label">会员姓名：</div>
        <div class="popover-info">{{row.name}}</div>
      </div>
      <div class="popover-item"
           v-if="row.phone">
        <div class="popover-label">手机号码：</div>
        <div class="popover-info">{{row.phone}}</div>
      </div>
      <div class="popover-item"
           v-if="row.tag&&row.tag.gzl_vip_level">
        <div class="popover-label">会员等级：</div>
        <div class="popover-info">{{row.tag.gzl_vip_level}}</div>
      </div>
      <div class="popover-item"
           v-if="row.tag&&row.tag.gzl_consumption">
        <div class="popover-label">消费水平(元/年)：</div>
        <div class="popover-info">{{row.tag.gzl_consumption}}</div>
      </div>
      <div class="popover-item"
           v-if="row.tag&&row.tag.gzl_travel_consultant">
        <div class="popover-label">绑定专属旅游顾问：</div>
        <div class="popover-info">{{row.tag.gzl_travel_consultant}}</div>
      </div>
      <div class="popover-item"
           v-if="row.tag&&row.tag.gzl_call">
        <div class="popover-label">CALL目标用户：</div>
        <div class="popover-info">{{row.tag.gzl_call}}</div>
      </div>
      <div class="popover-item"
           v-if="row.tag&&row.tag.gzl_prefer">
        <div class="popover-label">产品等级爱好：</div>
        <div class="popover-info">{{row.tag.gzl_prefer}}</div>
      </div>
      <div class="popover-item"
           v-if="row.tag&&row.tag.gzl_passport_remain">
        <div class="popover-label">护照到期时间：</div>
        <div class="popover-info">{{row.tag.gzl_passport_remain}}</div>
      </div>

      <div class="empty"
           v-if="!row.tag&&!row.name&&!row.phone&&!ImpressionList">暂无数据</div>

      <div class="popover-item"
           v-if="ImpressionList&&ImpressionList.length">
        <div class="popover-desc">商家标签：</div>
      </div>
      <div class="popover-item"
           v-if="ImpressionList">
        <div class="tag-list">
          <div class="tag-item"
               v-for="(item,index) in ImpressionList"
               :key="index">{{item}}
          </div>
        </div>
      </div>

      <div class="popover-item"
           v-if="row.tagList&&row.tagList.length">
        <div class="popover-desc">画像标签：</div>
      </div>
      <div class="popover-item"
           v-if="row.tagList">
        <div class="tag-list">
          <div class="tag-item"
               v-for="(item,index) in row.tagList"
               :key="index">{{item}}
          </div>
        </div>
      </div>

    </div>

    <a class="table-href"
       slot="reference"
       @click="getDetail">查看</a>

    <user-dialog :showMemberEditor='showDialog'
                 :userData='row'
                 v-if="showDialog"
                 :closeHandler="close"></user-dialog>
  </el-popover>
</template>
<script>
import './editor-dialog.less';
import userDialog from './user-dialog.vue';
import utils from '@/dss-common/utils/date.js';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
export default {
  name: 'EditorDialog',
  components: { userDialog },
  props: {
    row: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {},
  data() {
    return {
      showDialog: false,
      ImpressionList: null
    };
  },
  methods: {
    getDetail() {
      this.showDialog = true;
    },

    close() {
      this.showDialog = false;
    },

    //获取商家印象
    getShopTag() {
      cameraFlowApi
        .getImpression({
          customerId: this.row.customerId
        })
        .then(result => {
          this.ImpressionList = result.data;
        })
        .always(() => {});
    },

    formatDate(strDate) {
      if (!strDate) {
        return '';
      }
      return utils.format(new Date(strDate), 'MM/DD HH:mm', 8);
    }
  }
};
</script>
<style  lang="less">
.tag-popover {
  padding: 0px;
  padding-bottom: 10px;
  .popover-list {
    margin-top: 37px;
    width: 227px;
    min-height: 70px;
    .popover-item {
      font-size: 0;
      width: 227px;
      padding: 0 5px;
      box-sizing: border-box;
      line-height: 24px;
      background: rgba(255, 255, 255, 1);
      .popover-label {
        display: inline-block;

        font-size: 12px;
        color: rgba(96, 98, 102, 1);
        text-align: left;
        margin-left: 5px;
        vertical-align: top;
      }
      .popover-info {
        display: inline-block;
        width: 43%;
        font-size: 12px;
        color: rgba(96, 98, 102, 1);
        text-align: center;
        vertical-align: top;
      }
      .popover-desc {
        display: inline-block;
        width: 100px;
        font-size: 12px;
        color: rgba(96, 98, 102, 1);
        vertical-align: top;
        margin-left: 5px;
      }
      .popover-remark {
        display: inline-block;
        width: 170px;
        font-size: 12px;
        color: rgba(96, 98, 102, 1);
        vertical-align: top;
      }
    }
    .popover-item:nth-child(odd) {
      background: rgba(247, 247, 249, 1);
    }
  }

  .popover-img {
    position: absolute;
    top: -83px;
    left: 49px;
    width: 120px;
    height: 120px;
    border-radius: 4px;
  }
  .empty {
    text-align: center;
    font-size: 12px;
    color: rgba(96, 98, 102, 1);
    min-height: 70px;
    line-height: 70px;
  }
  .tag-list {
    overflow: hidden;
    font-size: 0;
    line-height: 1;
    margin-left: 2px;
    .tag-item {
      display: inline-block;
      padding: 0 10px;
      line-height: 22px;
      height: 22px;
      overflow: hidden;
      background: rgba(46, 141, 255, 0.21);
      border-radius: 11px;
      text-align: center;
      font-size: 12px;
      color: rgba(46, 141, 255, 1);
      margin: 4px 5px 4px 0px;
    }
  }
}
</style>
