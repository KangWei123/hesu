<template>
  <div class="edit-content" v-loading="loading">
    <div class="title"><span class="label-color">当前大分类：</span>{{editCategory.category}}</div>

    <div class="choose-content">
      <div class="theme-img-box">
        <span class="theme-img-title label-color">主题图片：</span>
        <div v-if="!editCategory.imgUrl" class="theme-img">
          <div class="add-img" @click="visibleUpload=true">
            <i class="el-icon-plus"></i>
          </div>
          <div class="theme-img-operate">
            <div class="operate-box">
              <a class="label-color" @click="visibleUpload=true">添加图片</a>
            </div>
            <span style="font-size: 12px;" class="label-color">建议尺寸300*100</span>
          </div>
        </div>
        <div v-else class="theme-img">
          <div
            class="theme-img-icon"
            :style="{'background': 'transparent url('+editCategory.imgUrl+') center / cover no-repeat'}"
          ></div>
          <!-- <img :src="editCategory.imgUrl"
          class="theme-img-icon" />-->
          <div class="theme-img-operate">
            <div class="operate-box">
              <a class="dss-link" @click="visibleUpload=true">替换图片</a>
              <div class="delete" @click="deleteTheme">删除图片</div>
            </div>
            <span style="font-size: 12px;" class="label-color">建议尺寸300*100</span>
          </div>
        </div>
      </div>
      <div class="choose-goods-box">
        <span class="choose-goods-title label-color">图片链接：</span>
        <div class="choose-goods-tab">
          <span class="choose-goods" v-if="!choosedGoods.detailUrl" @click="chooseDetail">选择商品</span>
          <div class="choosed-goods-tab" v-else>
            <div
              class="detail-image"
              :style="{'background': 'transparent url('+ choosedGoods.detailUrl +') no-repeat center / cover'}"
            ></div>
            <div class="label-color limit-line-ellipsis line-2" style="width:96px;margin-left: 8px;">{{ choosedGoods.name }}</div>
            <i class="el-icon-close delete" @click="deleteDetail"></i>
            <!-- <div class="delete"></div> -->
          </div>
        </div>
      </div>
    </div>

    <!--上传选择图片-->
    <materials-image
      class="choose-img"
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />

    <!--选择商品-->
    <select-dialog
      v-model="detailDialog"
      @choosed="onChooseGoods"
      :enableMultiple="false"
      :goods-type="type"
    ></select-dialog>
  </div>
</template>

<script>
// import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import service from '@/dss-wechat3rd/src/api/wx_store_item.js';

export default {
  name: 'categoryEdit',
  components: {
    MaterialsImage,
    selectDialog
  },
  props: {
    categorySecond: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      visibleUpload: false,
      detailDialog: false,
      type: goodsTypeEnum.product,
      editCategory: {},
      choosedGoods: {
        detailId: '',
        detailUrl: '',
        name: ''
      }
    };
  },
  watch: {
    //侦听二级分类解析对应商品
    categorySecond: function(newVal, oldVal) {
      this.editCategory = newVal;

      if (newVal.imgUrlValue) {
        this.choosedGoods.detailId = this.getImgUrlValueParams(newVal.imgUrlValue, 'detailId');
        this.choosedGoods.detailUrl = this.getImgUrlValueParams(newVal.imgUrlValue, 'detailUrl');
        this.choosedGoods.name = newVal.name;
      } else {
        this.choosedGoods.detailId = '';
        this.choosedGoods.detailUrl = '';
        this.choosedGoods.name = '';
      }
    }
  },

  computed: {
    //主题图片的操作状态
    handleStatus() {
      if (this.editCategory.imgUrl) {
        return '替换';
      } else {
        return '添加';
      }
    }
  },
  methods: {
    //取消选择主题图片
    onCancelPickImage() {
      this.visibleUpload = false;
    },
    //选择主题图片
    onSuccessPickedImage(imgObj) {
      this.visibleUpload = false;
      let obj = {
        id: imgObj.id,
        src: imgObj.imgUrl
      };
      this.$emit('chooseImg', obj);
      this.$set(this.editCategory, 'imgUrl', obj.src);
    },
    //删除选中的主题图片
    deleteTheme() {
      let obj = {
        id: '',
        src: ''
      };
      this.$emit('chooseImg', obj);
      this.$set(this.editCategory, 'imgUrl', '');
    },

    //点击选择商品
    chooseDetail() {
      this.detailDialog = true;
    },
    //选中的商品
    onChooseGoods(val) {
      this.choosedGoods.detailId = val.itemNo;
      this.choosedGoods.detailUrl = val.thumbnail;
      this.choosedGoods.name = val.name;
      const imgUrlValue = val.itemNo ? 'detailId=' + val.itemNo + '&detailUrl=' + val.thumbnail : '';
      this.$emit('chooseGoods', imgUrlValue);
    },
    //删除选中的商品
    deleteDetail() {
      this.choosedGoods.detailId = '';
      this.choosedGoods.detailUrl = '';
      this.choosedGoods.name = '';
      const imgUrlValue = '';
      this.$emit('chooseGoods', imgUrlValue);
    },

    //分解后台返回的商品图片字符串中的参数
    getImgUrlValueParams(str, name) {
      let reName = str.split(name + '=')[1];
      if (reName) {
        reName = reName.split('&')[0];
      } else {
        return null;
      }
      return reName;
    }
  }
};
</script>
<style lang="less" scoped>
.edit-content {
  // width: 344px;
  height: 629px;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 4px 4px 0;

  .label-color {
    font-size: 14px;
    color: @ui-font-color-darkGrey;
  }

  .title {
    display: flex;
    color: #fa7516;
    padding-bottom: 32px;
    span {
      display: block;
      width: 100px;
    }
  }
  .icon-box {
    margin: 20px 0px 30px;
    .icon-type {
      font-size: 14px;
    }
    .one-row-upload {
      width: 350px;
      height: 76px;
      background: rgba(233, 236, 241, 1);
      margin: 20px auto 0;
      text-align: center;
      .dss-link {
        padding-top: 24px;
        display: inline-block;
      }
      div {
        font-size: 12px;
        font-weight: 400;
        color: rgba(133, 140, 153, 1);
      }
    }
  }
  .choose-content {
    .theme-img-box {
      overflow: hidden;
      font-size: 14px;
      margin-bottom: 20px;
      .theme-img-title {
        float: left;
        width: 100px;
        text-align: left;
      }
      .theme-img {
        display: flex;
        align-items: flex-end;
        // margin-left: 10px;
        position: relative;

        .add-img {
          width: 78px;
          height: 78px;
          line-height: 78px;
          text-align: center;
          background: #ffffff;
          border: 1px solid #dce1e6;
          border-radius: 4px;
          font-size: 20px;
          color: #717378;
          cursor: pointer;
        }

        .theme-img-icon {
          display: inline-block;
          width: 234px;
          height: 78px;
          border: 1px solid #dce1e6;
          border-radius: 2px;
        }
        
        .theme-img-operate {
          display: flex;
          flex-direction: column;
          margin-left: 16px;
        }

        .operate-box {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
        }
        .delete {
          font-size: 14px;
          color: #ff5218;
          margin-left: 12px;
          cursor: pointer;
        }
        .dss-link {
          font-size: 14px;
        }
      }
    }
    .choose-goods-box {
      display: flex;
      overflow: hidden;
      .choose-goods-title {
        float: left;
        width: 100px;
        text-align: left;
      }
      .choose-goods-tab {
        float: left;
        // margin-left: 10px;
        .choose-goods {
          color: #2e8dff;
          cursor: pointer;
        }
        .choose-goods-box {
          display: flex;
          align-items: flex-end;
        }
        .choosed-goods-tab {
          display: flex;
          align-items: center;
          position: relative;
          width: 216px;
          height: 64px;
          border: 1px solid #dce1e6;
          border-radius: 2px;
          padding-left: 8px;
          font-size: 0px;
          .detail-image {
            display: inline-block;
            width: 48px;
            height: 48px;
            border: 1px solid #dce1e6;
            border-radius: 2px;
          }
          .delete {
            font-size: 16px;
            position: absolute;
            top: 4px;
            right: 4px;
            color: #717378;
            cursor: pointer;
          }
        }
      }
    }
  }
  .chooseImg {
    font-size: 14px;
  }
}
</style>

