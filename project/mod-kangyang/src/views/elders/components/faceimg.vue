<template>
  <div class="faceid">
    <div class="upload">
      <div class="key" style="font-size: 16px; line-height: 88px">人脸头像:</div>
      <el-button
        type="primary"
        class="btn-upload"
        size="medium"
        :loading="processing"
        :disabled="stack.length >= 3"
        @click="showImageDialog"
      >
        + 上传
      </el-button>
      <div class="imgTips">最多三张，支持PNG、JPG格式，像素最小100PX*100PX、最大不能超过10M</div>
    </div>

    <!-- 开始默认显示的人脸位置 -->
    <div class="bkgLine" style="display: flex" v-if="stack.length == 0">
      <div style="display: flex" v-for="(defItem, didex) in defaultList" :key="didex">
        <div class="imgrow">
          <div class="field">
            <div class="uploader"></div>
          </div>
          <div class="field mgtb">
            <div class="key" style="font-size: 14px; color: #717378">ID:</div>
            <div class="idfont">-</div>
          </div>
        </div>
        <div :class="[didex == 2 ? '' : 'flymid']"></div>
      </div>
    </div>

    <!-- 勾选后的图片显示 -->
    <div style="display: flex" v-else>
      <div style="display: flex" v-for="(imgSrc, index) in stack" :key="index">
        <div class="imgrow">
          <div class="field">
            <div
              class="uploader"
              :style="{
                'background-image': 'url(' + imgSrc.faceImgUrl + ')',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'background-position': 'center',
              }"
            ></div>
          </div>
          <div class="field mgtb">
            <div class="key" style="font-size: 14px; color: #717378">ID:</div>
            <div class="idfont">
              {{ imgSrc.faceId != null ? imgSrc.faceId : '-' }}
            </div>
          </div>
          <span class="delfont" @click="delImg(imgSrc.id)">删除</span>
        </div>
        <div :class="[index == 2 ? '' : 'flymid']"></div>
      </div>
    </div>

    <image-picker
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      @cancel="onCancelPickImage"
      @picked="onPickedImage"
      :multiple="multiple"
      :limit="limit"
    />
  </div>
</template>

<script>
  import { ImagesPicker as ImagePicker } from '@/mod-kangyang/ref/components';
  import { elderApi } from '@/mod-kangyang/src/api/elder';

  /**
   * 长者人脸图片
   */
  export default {
    name: 'FaceId',
    components: {
      ImagePicker,
    },
    props: {
      data: {
        type: Object,
        default: function () {
          return '';
        },
      },
      // 是否多选
      multiple: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 5,
      },
    },
    data() {
      return {
        defaultList: [1, 2, 3], // 默认显示的人脸照片位置
        faceList: [], // 接收父组件 detail.vue 传过来的值
        stack: [], // 接收子组 image-material 件传过来的值
        showChooseImageDialog: false,
        processing: false,
      };
    },
    methods: {
      showImageDialog() {
        if (this.faceList.length == 3 || this.stack.length == 3) {
          return;
        }
        this.showChooseImageDialog = true;
      },
      onCancelPickImage() {
        this.showChooseImageDialog = false;
      },
      // 删除照片
      delImg(id) {
        this.$confirm('', '是否删除该图片', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: 'true',
        })
          .then(() => {
            elderApi
              .delFaceImg({
                faceId: id,
                memberId: this.$route.params.id,
              })
              .then(res => {
                if (res.code == 0) {
                  this.$parent.getCumtonDetail(this.$route.params.id);
                  this.$message({
                    message: '删除成功！',
                    type: 'success',
                  });
                }
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      },
      onPickedImage(evt) {
        this.showChooseImageDialog = false;
        this.processing = true;
        elderApi
          .changeFaceId({
            faceImgUrl: evt.imgUrl,
            id: this.$route.params.id,
          })
          .then(res => {
            const that = this;
            if (res.code == 0) {
              that.stack.push({ faceImgUrl: evt.imgUrl, faceId: res.data });
              this.$parent.getCumtonDetail(this.$route.params.id);
            }
          })
          .catch(err => {
            if (err.code == 1001) {
              this.$message.error(err.message);
            } else {
              this.$message.error('人脸照片上传重复');
            }
          })
          .finally(() => {
            this.processing = false;
          });
      },
    },
    watch: {
      data: {
        immediate: true, // immediate 选项可以开启首次赋值监听
        async handler(newVal) {
          // 图片回显
          if (newVal) {
            this.stack = newVal.faceInfoDTOList || [];
          }
        },
      },
      async 'data.faceImgUrl'(value) {
        if (value) {
          await elderApi.changeFaceId({
            faceImgUrl: value,
            id: this.data.id,
          });
        }
      },
    },
  };
</script>

<style scoped>
  .mgtb {
    margin-top: 16px;
    margin-bottom: 10px;
  }

  .delfont {
    width: 24px;
    height: 17px;
    opacity: 1;
    font-size: 12px;
    font-family: PingFang, PingFang-SC;
    font-weight: sc;
    text-align: left;
    color: #468bff;
    line-height: 17px;
    cursor: pointer;
  }

  .imgrow {
    width: 120px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .flymid {
    display: inline-block;
    height: 40px;
    width: 1px;
    margin: 26px 10px 0 10px;
    vertical-align: middle;
    background-color: #e2e2e2;
  }

  .upload {
    display: flex;
    align-items: center;
  }

  .btn-upload {
    margin-top: 0;
    margin-left: 10px;
    margin-right: 20px;
    background: #4cb46b;
    border: 1px solid #4cb46b;
    border-radius: 3px;
  }

  .nobtn {
    margin-top: 0;
    margin-left: 10px;
    margin-right: 20px;
    width: 72px;
    height: 36px;
    background: #d2d2d2;
    border: 1px solid #d2d2d2;
    border-radius: 3px;
  }

  .imgTips {
    width: 188px;
    height: 51px;
    font-size: 12px;
    font-family: PingFang, PingFang-SC;
    font-weight: sc;
    text-align: justify;
    color: #717378;
    line-height: 17px;
  }

  .faceid {
    display: inline-block;
  }

  .field {
    display: flex;
  }

  .key {
    margin-right: 8px;
  }

  .idfont {
    width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .uploader {
    width: 88px;
    height: 88px;
    border-radius: 88px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
