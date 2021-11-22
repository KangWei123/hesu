<template>
  <div class="preview-template">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/setting/homedecorate/mini-index' }">小程序主页</el-breadcrumb-item>
      <el-breadcrumb-item>自定义主题色</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="preview-template-container">
      <div class="custom-title">自定义主题色</div>
      <!-- 颜色选择 -->
      <div class="preview-content">
        <div class="template-box">
          <div class="item">
            <el-color-picker class="com-color-picker"
                            v-model="template.navColor"
                            size="mini"></el-color-picker>
            <div>主颜色</div>
          </div>

          <div class="item"
              style="margin-left:385px;">
            <el-color-picker class="com-color-picker"
                            v-model="template.bgGradualChange1"
                            size="mini"></el-color-picker>
            <div>渐变色色号1</div>
          </div>

          <div class="item">
            <el-color-picker class="com-color-picker"
                            v-model="template.bgGradualChange2"
                            size="mini"></el-color-picker>
            <div>渐变色色号2</div>
          </div>
        </div>

        <!-- 展示 -->
        <div class="content"
            style="margin-top:20px">
          <div class="home-page">
            <div class="top"
                :style="'background:'+template.navColor+''"></div>
            <div class="poster"></div>
            <div class="goods">
              <div class="img"></div>
              <div class="info-box">
                <div class="name"></div>
                <div class="info"></div>
                <div class="info"></div>
              </div>
              <div class="btn"
                  :style="'background:'+template.navColor+''"></div>
            </div>
            <div class="goods-box">
              <div class="box">
                <div class="img"></div>
                <div class="info"></div>
                <div class="info"></div>
                <div class="cart"
                    :style="'background:'+template.navColor+''"></div>
              </div>
              <div class="box">
                <div class="img"></div>
                <div class="info"></div>
                <div class="info"></div>
                <div class="cart"
                    :style="'background:'+template.navColor+''"></div>
              </div>
            </div>

            <div class="bottom">
              <div class="tabbar"
                  :style="'background:'+template.navColor+''"></div>
              <div class="tabbar"></div>
              <div class="tabbar"></div>
              <div class="tabbar"></div>
              <div class="tabbar"></div>
            </div>
          </div>
          <!-- 第二个 -->
          <div class="goods-page">
            <div class="top"></div>
            <div class="poster"></div>
            <div class="info1"></div>
            <div class="info2"></div>
            <div class="price">
              ￥88
            </div>
            <div class="bottom">
              <div class="cart"
                  :style="'background:'+template.navColor+';opacity:0.7'"></div>
              <div class="buy"
                  :style="'background:'+template.navColor+''"></div>
            </div>
          </div>
          <!-- 第三个 -->
          <div class="act-page"
              style="margin-left:20px">
            <div class="top"></div>
            <div class="poster"></div>
            <div class="price"
                :style='"background:linear-gradient(90deg," + template.bgGradualChange1 + " 0%," + template.bgGradualChange2 + " 100%)"'>
              ￥88
            </div>
            <div class="info1"></div>
            <div class="info2"></div>
            <div class="tag"></div>
            <div class="tag1"></div>
            <div class="bottom">
              <div class="buy"
                  :style='"background:linear-gradient(90deg," + template.bgGradualChange1 + " 0%," + template.bgGradualChange2 + " 100%)"'></div>
            </div>
          </div>

        </div>

        <!-- 按钮组 -->
        <div class="bottom-button">
          <el-button @click="goBack"
                    class="cancel">取消</el-button>
          <el-button type="primary"
                    class="save"
                    @click="createTemplate">保存</el-button>
        </div>
      </div>
    </div>
     
  </div>
</template>

<script>
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import './index.less';
export default {
  mixins: [industryHelperMixin],
  data: function() {
    return {
      template: {
        id: 'custom',
        navColor: null,
        bgGradualChange1: null,
        bgGradualChange2: null
      }
    };
  },

  computed: {
    templateUrl() {
      if (this.template && this.template.id === 'custom') {
        return null;
      }
      return this.template && this.template.id
        ? require('../../../../images/setting/template/' + this.template.id + '1.png')
        : '';
    }
  },
  mounted() {
    if (this.$route.query.templateId === 'custom' && this.$route.query.template) {
      let template = this.$route.query.template;
      this.template = JSON.parse(template);
    }
  },

  methods: {
    //新建模板
    createTemplate() {
      this.$confirm('此操作将更换您的整个小程序主题?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.$router.push({
            name: 'mini-index-template',
            params: { createTemplate: this.template }
          });
        })
        .catch(() => {
          console.log('取消更换');
        });
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/setting/homedecorate/mini-index'
      });
    }
  }
};
</script>
<style lang="less" >
.preview-template {
  .preview-template-container {
    background: #fff;
    padding: 20px;
    padding-top: 0px;
  }
  .custom-title {
    padding-left: 20px;
    height: 43px;
    line-height: 43px;
    font-size: 14px;
  }

  .preview-content {
    padding-top: 20px;
  }

  .item {
    display: inline-block;
    margin-left: 26px;
    text-align: center;
    font-size: 12px;
  }

  .com-color-picker {
    width: 65px;
    height: 65px;
    border: 3px solid #d0d5d9;
    border-radius: 4px;
  }
  .el-color-picker--mini .el-color-picker__trigger {
    width: 65px;
    height: 65px;
  }
  .content {
    margin-left: 20px;
    margin-top: 20px;
  }

}
</style>
