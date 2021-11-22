<template>
  <div class="user-info">
    <img class="avetor"
        :style="{opacity: curent === 1 ? 1 : 0}"
        :src="img_1">
    <img class="avetor"
        :style="{opacity: curent === 2 ? 1 : 0}"
        :src="img_2">
    
    <!-- 疑似标识 -->
    <span class="suspected"
          v-if="data.faceTag===2">
      <span class="suspected-logo">!</span>      
      <span class="suspected-text">照片不佳</span>
    </span>
    
    <div class="base-info">
      <p>
        <span>{{hideName || '--'}}</span><span>|</span>
        <span>{{data.faceGender === 1 ? '男': '女'}}</span><span>|</span>
        <span>{{data.faceAge|age}}岁</span>
      </p>
      <p>
        <span>{{tags.phone && tags.phone.value || '--'}}</span><span>|</span>
        <span>{{levelName}}</span>
      </p>
    </div>
    <div class="count-info">
      <div class="count-item gradual-bg">
        <P class="number">{{tags.count && tags.count.value || '--'}}</P>
        <P class="dec">累计到店次数</P>
      </div>
      <div class="count-item gradual-bg">
        <P class="number">{{data.totalCount || 0}}</P>
        <P class="dec">消费次数</P>
      </div>
      <div class="count-item gradual-bg">
        <P class="number" :class="~~data.totalConsume > 100000000 ? 'small-number': ''">{{data.totalConsume | formatMoney(2)}}</P>
        <P class="dec">累计消费金额</P>
      </div>
      <div class="count-item gradual-bg">
        <P class="number" :class="~~data.totalCharge > 100000000 ? 'small-number': ''">{{data.totalCharge | formatMoney(2)}}</P>
        <P class="dec">累计充值金额</P>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    wkbStatus: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      img_1: '',
      img_2: '',
      curent: 1,
      userName: null,
      tags: {}
    };
  },
  computed: {
    noVip() {
      return !(this.data.memberId && this.wkbStatus);
    },
    showVersions() {
      // return this.data.memberId && this.wkbStatus ? '' : 'no-vip';
      return this.noVip ? 'no-vip' : '';
    },
    sex() {
      return {
        call: this.data.faceGender === 1 ? '先生' : '女士',
        sex: this.data.faceGender === 1 ? '男性' : '女性'
      };
    },
    hideName() {
      if (this.userName) {
        return this.userName.slice(0, 1) + this.sex.call;
      } else {
        return this.data.name ? this.data.name.slice(0, 1) + this.sex.call : '--';
      }
    },
    levelName() {
      if (this.noVip || !this.data.levelName) {
        return '非会员';
      } else {
        return this.data.levelName.replace(/会员/g, '') + '会员';
      }
    }
  },
  watch: {
    data(val, oldVal) {
      if (val) {
        this.getTagList(val);
      }
      // if (oldVal && val.idStr === oldVal.idStr) {
      //   return;
      // }
      if (this.curent === 1) {
        this.img_2 = val.faceImgUrl;
        this.curent = 2;
        if (!oldVal) {
          this.img_1 = val.faceImgUrl;
        }
      } else {
        this.img_1 = val.faceImgUrl;
        this.curent = 1;
        if (!oldVal) {
          this.img_2 = val.faceImgUrl;
        }
      }
    }
  },
  filters: {
    textoverflow(val) {
      if (val.length > 16) {
        val = val.substring(0, 15) + '...';
      }
      return val;
    },

    age(val) {
      if (val < 18) {
        val = '< ' + 18;
      }
      return val;
    },

    formatMoney(money, precision = 2) {
      return (~~money / 100).toFixed(precision);
    }
  },

  created() {
    if (this.data) {
      this.img_1 = this.data.faceImgUrl;
      this.img_2 = this.data.faceImgUrl;
    }
  },

  methods: {
    //根据tagTemplate获取tag列表
    getTagList(row) {
      let tags = {};
      if (row.tagTemplate) {
        let tagTemplate = JSON.parse(row.tagTemplate);
        let customTag = JSON.parse(row.tag) || {};
        if (!tagTemplate) {
          return;
        }
        tagTemplate.forEach(item => {
          let tag = {
            name: item.tagName,
            tagKey: item.tagKey,
            value: null
          };
          //type为0从row里面取数据，1从customTag里取数据
          if (item.type === 0) {
            if (item.tagKey === 'vip') {
              tag.value = row[item.tagKey] === 0 ? '否' : '是';
            } else if (item.tagKey === 'updateTime') {
              tag.value = this.formatDate(row[item.tagKey]);
            } else {
              tag.value = row[item.tagKey];
            }
            tags[tag.tagKey] = tag;
          } else {
            //如果有userName，替换name
            if (item.tagName === 'userName') {
              this.userName = customTag[item.tagKey];
            } else {
              tag.value = customTag[item.tagKey];
              tags[tag.tagKey] = tag;
            }
          }
        });
      }
      this.tags = tags;
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

<style lang="less" scoped>
@import '../css/base.less';
.user-info {
  width: 100%;
  height: 100%;
  background: url('../../../asserts/images/base-bg.png');

  .avetor {
    width: 145px;
    height: 140px;
    position: absolute;
    top: 29px;
    left: 74px;
    border: 1.5px solid #19C1FF;
    border-top-left-radius: 45px;
    border-top-right-radius: 45px;
    border-bottom-left-radius: 15px 40px;
    border-bottom-right-radius: 15px 40px;
    transition: all 0.8s linear;
  }

  .suspected {
    position: absolute;
    top: 20px;
    left: 189px;
    background: rgba(0,0,0,0.5);
    border-radius: 5px;
    display: inline-block;
    line-height: 36px;
    color: #FFF;
    width: 133px;
    font-size: 15px;
    letter-spacing: 1px;

    &-logo {
      background: #FF944D;
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      margin-left: 10px;
      vertical-align: middle;
    }

    &-text {
      padding-left: 6px;
    }
  }

  .base-info {
    position: absolute;
    top: 260px;
    left: 30px;
    font-size: 16px;
    color: @font-blue;

    span {
      padding: 5px;
    }
  }

  .count-info {
    position: absolute;
    top: 360px;

    .count-item {
      display: inline-block;
      width: 136px;
      height: 85px;
      margin: 0 0 15px 7px;
    }

    .number {
      line-height: 25px;
      font-size: 25px;
      margin: 24px auto 14px 14px;
      color: @font-blue;
    }

    .dec {
      color: #FCFEFF;
      margin: 0 0 0 14px;
      font-size: 14px;
      line-height: 14px;
    }

    .small-number {
      font-size: 20px;
      line-height: 20px;
    }
  }
}
</style>
