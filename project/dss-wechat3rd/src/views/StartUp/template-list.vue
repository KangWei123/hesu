
<style lang="less">
.template-list {
  .template-title {
    font-weight: bold;
    padding-left: 20px;
  }
  .container {
    display: flex;
    .item {
      margin: 20px;
      width: 224px;
      height: 398px;
      background-size: cover;
      background-position: center center;
      border: 1px solid rgba(200, 200, 200, 0.2);
      border-radius: 1px;
      position: relative;

      .choose-btn-box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .choose-btn-box:hover {
        background-color: rgba(255, 255, 255, 0.8);
      }
      .choose-btn-box:hover .choose-btn {
        display: block;
      }
      .choose-btn {
        background: rgba(67, 121, 237, 1);
        border: 1px solid rgba(67, 121, 237, 1);
        color: #fff;
        width: 80px;
        display: none;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-40px, -16px);
      }
      .choose-btn:hover {
        background-color: rgba(67, 121, 237, 0.8);
        border-color: rgba(67, 121, 237, 0.8);
      }
    }

      .beautiful {
        background-image: url(../../images/industry/beautiful-bg.png);
      }
      .retail {
        background-image: url(../../images/industry/retail-bg.png);
      }
      .clother {
        background-image: url(../../images/industry/clother-bg.png);
      }
      .education {
        background-image: url(../../images/industry/education-bg.png);
      }
      .bodybuilding {
        background-image: url(../../images/industry/bodybuilding-bg.png);
      }
      .fruit {
        background-image: url(../../images/industry/fruit-bg.png);
      }
  }
}
</style>

<template>
  <div class="template-list" v-loading="loading">
    <div class="template-title">选择店铺模板</div>
    <div class="container">
      <!-- <div v-for="(item,index) in dataSource"
           class="item"
           :key="index"
           :style="{'background-image': 'url('+item.imgUrl+')'}"> -->
      <div v-for="(item,index) in dataSource"
           class="item"
           :key="index"
           :class="$route.query.bgImgae">
        <div class="choose-btn-box">
          <el-button class="choose-btn"
                     size="small"
                     type="primary"
                     @click="clickItem(item)">选择</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/dss-wechat3rd/src/api/index.js';
export default {
  data: function() {
    return {
      dataSource: [],
      loading: false
    };
  },

  mounted() {
    this.loading = true;
    service
      .getTemplateList({
        industryId: this.$route.query.industryId
      })
      .then(response => {
        this.dataSource = response.data;
      })
      .always(data => {
        this.loading = false;
      });
  },

  methods: {
    clickItem(val) {
      // this.$router.push({
      //   path: '/storemgr/homedecorate',
      //   query: { templateConfig: val.config, templateId: val.templateId }
      // });

      this.$router.push({
        path: '/startup/create',
        query: {
          industryId: this.$route.query.industryId,
          industryKey: this.$route.query.industryKey,
          templateId: val.templateId,
          // imgUrl: val.imgUrl,
          bgImage: this.$route.query.bgImgae
        }
      });
    }
  }
};
</script>



