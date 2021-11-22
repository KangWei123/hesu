<template>
  <div class="charge-card-list">
    <el-breadcrumb class="wkt-breadcrumb-container"
                   separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/charge-card/list' }">充值卡</el-breadcrumb-item>
      <el-breadcrumb-item>充值协议</el-breadcrumb-item>
    </el-breadcrumb>


    <div class="charge-card-deal"
         v-loading="loading">
      <div class="mobile-box">
        <div>
          <div class="head-tip"></div>
          <div class="preview-box"
              v-if="!!deal.describe||deal.describe===''">
            <div class="phone-nav">
              <span>充值协议（预览）</span>
            </div>
            <div class="preview-content-wrapper">
              <div class="preview-content"
                  v-html="deal.describe"></div>
            </div>
          </div>
        </div>

        <div class="charge-card-deal-switch"
             v-if="!deal.describe&&!!query&&deal.describe!==''">
          <!--查询请求成功但返回数据为空，显示开启按钮-->
          <div class="deal-tips">暂未开通充值协议</div>
          <el-button class="deal-add-btn"
                     type="primary"
                     @click="onDeal">开启</el-button>
        </div>
      </div>
      
      

      <div class="edit-box">
        <div class="charge-card-deal-content"
             v-if="!!deal.describe||deal.describe===''">
          <w-editor class="editor"
                    :dataSource="deal"
                    :image="false"
                    :pasteHandle="true"
                    width="600px"
                    height="669px"
                    :key="id"></w-editor>
        </div>
      </div>
    </div>

    <div class="bottom-button">
      <div class="button-center">
        <el-button class="wkt-primary-btn"
                  :disabled="!deal.describe"
                  @click="closeDeal">停用</el-button>
        <el-button class="wkt-primary-btn"
                    type="primary"
                    @click="saveDeal">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import settingsApi from '@/dss-wechat3rd/src/api/settings';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import PayProtocol from '@/dss-wechat3rd/src/bz_components/agreement/pay-protocol.vue';

export default {
  name: 'Deal',
  components: {
    WEditor,
    PayProtocol
  },
  data() {
    return {
      loading: false,
      deal: {
        describe: null
      },
      id: 0,
      //查询协议请求是否成功
      query: false,
      dialogShow: false
    };
  },
  mounted() {
    this.getDeal();
  },
  methods: {
    saveDeal() {
      if (!this.deal.describe) {
        this.showMessage('协议内容不能为空', 'warning');
        return;
      }
      settingsApi
        .updateDealContent({
          content: this.deal.describe,
          status: 1
        })
        .then(res => {
          this.$router.push('/marketing/charge-card/list');
        });
    },
    onDeal() {
      settingsApi.openDeal({ status: 1 }).then(res => {
        this.getDeal();
      });
    },
    getDeal() {
      this.loading = true;
      settingsApi
        .getDealInfo()
        .done(res => {
          if (!!res.data) {
            this.deal.describe = res.data.content;
          }
          this.id = ++this.id; //改变key值，使组件重新渲染
          this.query = true;
        })
        .always(() => {
          this.loading = false;
        });
    },
    closeDeal() {
      this.$confirm('停用后小程序里将不再显示，可再次开启。', '停用协议', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(res => {
          settingsApi.deleteDeal().then(res => {
            this.deal.describe = null;
            this.$router.push({
              path: 'list'
            });
          });
        })
        .catch(() => {
          console.log('取消停用');
        });
    },
    showMessage(text, type) {
      this.$message({
        message: text,
        type: type
      });
    },
    gotoDealPreview() {
      this.dialogShow = true;
    }
  }
};
</script>

<style lang="less">
// .charge-card-list:after {
//   content: '';
//   height: 60px;
//   display: block;
// }
.charge-card-list {
  background: #fff;
  margin-bottom: 30px;
}
.charge-card-deal {
  padding: 20px 0 20px 20px;
  min-width: 925px;
  box-sizing: border-box;
  text-align: center;
  .edit-box {
    padding-top: 20px;
    margin-left: 32px;
    display: inline-block;
    vertical-align: top;
  }

  .mobile-box {
    position: relative;
    display: inline-block;
    width: 391px;
    height: 698px;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
    padding: 20px 8px;
  }
  .head-tip {
    width: 36px;
    height: 6px;
    background: #ecf2fc;
    border-radius: 4px;
    position: relative;
    top: -7px;
    left: 167px;
  }
  .preview-box {
    // display: inline-block;
    height: 689px;
    // border: 1px solid @border-color;
    // overflow: auto;
    box-sizing: border-box;
    // margin-left: 20px;

    // width: 269px;
    // height: 478px;
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 17px;
    .phone-nav {
      margin-top: 10px;
      width: 375px;
      height: 66px;
      line-height: 86px;
      text-align: center;
      color: @black-color;
      top: 0;
      left: 0;
      background-size: 100% 50%;
      background-repeat: no-repeat;
      background-image: url('../../../images/decoration/nav/status_black.png');
      border-bottom: 1px solid #dde3ec;
      span {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        color: #33373e;
        line-height: 20px;
      }
    }
    .preview-content-wrapper {
      overflow: auto;
      height: 610px;
      overflow-x: hidden;
    }
    .preview-content {
      height: 600px;
      padding: 20px;
      width: 375px;
      box-sizing: border-box;
    }
  }
  .charge-card-deal-preview {
    margin-bottom: 10px;
    .table-href {
      font-size: @standard-font;
    }
  }
  .charge-card-deal-switch {
    position: absolute;
    top: 50%;
    left: 52%;
    transform: translate(-50%, -50%);
    .deal-tips {
      color: @black-color;
      font-size: @standard-font;
      margin-bottom: 10px;
    }
  }
  .charge-card-deal-content {
    .editor {
      .w-e-text-container {
        height: 604px !important;
      }
    }
    .charge-card-deal-options {
      margin-top: 20px;
    }
  }

}
.bottom-button {
  .button-center {
    width: 281px;
    margin-left: 34%;
  }
  button {
    margin-right: 0px !important;
  }
}
</style>
