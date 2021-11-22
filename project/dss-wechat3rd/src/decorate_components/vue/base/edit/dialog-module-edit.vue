<template>
  <div class="dialog-module-edit">
    <!-- <div class="com-title">
      <span>
        悬浮框
        <el-tooltip class="item" effect="dark" content="开启后悬浮框将常驻页面右下角" placement="top-start">
          <i class="question">?</i>
        </el-tooltip>
      </span>
    </div> -->
    <edit-header
      :data-source="dataSource"
      :show-tool-tip="true"
      tool-tip-content="开启后悬浮框将常驻页面右下角"
      name="悬浮框"
    ></edit-header>

    <div class="com-body">
      <div class="row">
        <div>
          <div>
            主窗口：
            <el-tooltip
              class="item hover-pointer"
              effect="dark"
              content="开启两个及两个以上的子窗口时才展示主窗口样式"
              placement="top-start"
            >
              <i class="question">?</i>
            </el-tooltip>
          </div>
          <div class="hover-pointer" style="color: #2e8dff; margin-left: 10px" @click="handleDefault">恢复默认</div>
        </div>
        <div class="primary-window">
          <div class="uploader-wrap">
            <span>展开前：</span>
            <div class="upload-box">
              <div
                class="uploader"
                @click="handleCollapseImage"
                :style="{ backgroundImage: dataSource.collapseImage ? `url(${dataSource.collapseImage})` : '' }"
              >
                <span v-if="!dataSource.collapseImage">
                  <i class="el-icon-plus"></i>
                </span>
              </div>
              <span v-if="dataSource.collapseImage" class="close" @click="dataSource.collapseImage = collapseImage">
                重置
              </span>
            </div>
          </div>
          <div class="uploader-wrap">
            <span>展开后：</span>
            <div class="upload-box">
              <div
                class="uploader"
                @click="handleExpandImage"
                :style="{ backgroundImage: dataSource.expandImage ? `url(${dataSource.expandImage})` : '' }"
              >
                <span v-if="!dataSource.expandImage">
                  <i class="el-icon-plus"></i>
                </span>
              </div>
              <span v-if="dataSource.expandImage" class="close" @click="dataSource.expandImage = expandImage"
                >重置</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <span class="column"></span>
        <span class="column">
          <div class="fieldset">
            <div class="com-row">
              <div class="com-column">在线客服：</div>
              <el-switch
                v-model="dataSource.wechatMsg"
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
                active-color="#52C41A"
                inactive-color="#B1B5BD"
              />
            </div>
            <div class="com-row">
              <span class="com-column">图标：</span>
              <div class="upload-box">
                <div
                  class="uploader"
                  @click="handlePickMsgImage"
                  :style="{ backgroundImage: dataSource.msgImage ? `url(${dataSource.msgImage})` : '' }"
                >
                  <span v-if="!dataSource.msgImage"><i class="el-icon-plus"></i></span>
                </div>
                <span v-if="dataSource.msgImage" class="close" @click="dataSource.msgImage = ''">重置</span>
              </div>
            </div>
          </div>
          <!-- <div class="fieldset">
            <div class="com-row">
              <div class="com-column">导购名片：</div>
              <el-switch  v-model="dataSource.shoppingGuide"
                          :active-value="true"
                          :inactive-value="false"
                          active-text="开启"
                          inactive-text="关闭"
                          active-color="#52C41A"
                          inactive-color="#B1B5BD" />
            </div>
            <div class="com-row">
              <span class="com-column">图标：</span>
              <div class="upload-box">
                <div
                  class="uploader"
                  @click="handlePickSGImage"
                  :style="{ backgroundImage: dataSource.sgImage ? `url(${dataSource.sgImage})` : '' }"
                >
                  <span
                    v-if="!dataSource.sgImage"
                  ><i class="el-icon-plus"></i></span>
                </div>
                <span v-if="dataSource.sgImage" class="close" @click="dataSource.sgImage = ''">重置</span>
              </div>
            </div>
            <div class="card-rules-title">名片导购显示规则:</div>
            <ol class="card-rules-container">
              <li>门店无导购时不显示导购名片；</li>
              <li>客户在门店有归属导购时，优先展示归属导购的名片；</li>
              <li>客户在门店无归属导购时，随机展示门店导购的名片。</li>
            </ol>
          </div> -->
        </span>
      </div>
    </div>
    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="pickerHandle"
      :visible.sync="visibleUpload"
      v-if="visibleUpload"
    />
  </div>
</template>

<script>
  import './css/common.less';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import EditHeader from './edit-header.vue';

  export default {
    components: {
      MaterialsImage,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        visibleUpload: false,
        pickerHandle: null,
        collapseImage: '',
        expandImage: '',
      };
    },
    methods: {
      // 悬浮窗恢复默认
      handleDefault() {
        this.$set(this.dataSource, 'collapseImage', this.collapseImage);
        this.$set(this.dataSource, 'expandImage', this.expandImage);
      },
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      handleCollapseImage() {
        this.visibleUpload = true;
        this.pickerHandle = function (choosedImg) {
          this.$set(this.dataSource, 'collapseImage', choosedImg.imgUrl);
          this.visibleUpload = false;
        }.bind(this);
      },
      handleExpandImage() {
        this.visibleUpload = true;
        this.pickerHandle = function (choosedImg) {
          this.$set(this.dataSource, 'expandImage', choosedImg.imgUrl);
          this.visibleUpload = false;
        }.bind(this);
      },
      handlePickMsgImage() {
        this.visibleUpload = true;
        this.pickerHandle = function (choosedImg) {
          this.$set(this.dataSource, 'msgImage', choosedImg.imgUrl);
          this.visibleUpload = false;
        }.bind(this);
      },
      handlePickSGImage() {
        this.visibleUpload = true;
        this.pickerHandle = function (choosedImg) {
          this.$set(this.dataSource, 'sgImage', choosedImg.imgUrl);
          this.visibleUpload = false;
        }.bind(this);
      },
    },
    mounted() {},
  };
</script>

<style lang="less" scoped>
  .primary-window {
    display: flex;
    flex-direction: column;
    width: 200px;
    margin-top: 15px;
  }

  .uploader-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    position: relative;
    margin-top: 20px;
  }

  .upload-box {
    display: flex;
    align-items: flex-end;
    margin-left: 16px;
  }

  .close {
    font-size: 14px;
    color: #2e8dff;
    margin-left: 8px;
  }

  .close:hover {
    cursor: pointer;
  }

  .uploader {
    width: 40px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dce1e6;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    color: #717378;
    font-size: 12px;
    text-align: center;
  }

  .com-row {
    display: flex;

    .com-column {
      &:first-child {
        min-width: 54px;
      }
    }
  }

  .row {
    display: flex;
    font-family: PingFangSC-Regular;
    margin-top: 18px;
    flex-direction: column;

    & > *:first-child {
      display: flex;
      min-width: 74px;
      font-size: 14px;
      font-weight: 400;
      vertical-align: top;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .fieldset {
    width: 320px;
    padding: 0 16px 18px;
    box-sizing: border-box;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    margin-bottom: 20px;
  }

  .question {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    text-align: center;
    line-height: 14px;
    font-size: 12px;
    color: #909399;
    display: inline-block;
    vertical-align: middle;
    font-style: normal;
    background-color: #eaedf5;
    font-family: PingFangSC-Regular;
    position: relative;
    top: -2px;
  }

  .card-rules-title {
    margin-top: 16px;
    font-size: 12px;
    line-height: 21px;
    color: #909399;
  }

  .card-rules-container {
    padding: 0 14px;
    list-style-type: decimal;
    width: 200px;
    font-size: 12px;
    color: #909399;

    li {
      line-height: 21px;
    }
  }
</style>
