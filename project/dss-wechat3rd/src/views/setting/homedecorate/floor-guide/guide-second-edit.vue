<template>
  <div class="edit-content" v-loading="loading">
    <div class="title">{{editCategory.name}}</div>
    <div class="icon-box">
      <div class="icon-type">主题图片</div>
      <!--点击上传图片-->
      <div class="one-row-upload">
        <a class="dss-link" @click="visibleUpload=true">+{{handleStatus}}图片</a>
        <div>建议尺寸600*200</div>
      </div>
    </div>

    <!--<div class="choose-content">
      <div class="theme-img-box" v-if="editCategory.imgUrl">
        <span class="theme-img-title">主题图片：</span>
        <div class="theme-img">
          <img :src="editCategory.imgUrl" class="theme-img-icon" />
          <div class="delete" @click="deleteTheme"></div>
        </div>
      </div>
      <div class="choose-goods-box">
        <span class="choose-goods-title">主题图片链接：</span>
        <div class="choose-goods-tab">
          <span class="choose-goods" v-if="!choosedGoods.detailUrl" @click="chooseDetail">选择商品</span>
          <div class="choosed-goods-tab" v-else>
            <div
              class="detail-image"
              :style="{'background': 'transparent url('+ choosedGoods.detailUrl +') no-repeat center / cover'}"
            ></div>
            <div class="delete" @click="deleteDetail"></div>
          </div>
        </div>
      </div>
    </div>-->

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
        detailUrl: ''
      }
    };
  },
  watch: {
    //侦听二级分类解析对应商品
    categorySecond: function(newVal, oldVal) {
      this.editCategory = newVal;
      if (newVal.imgUrlValue) {
        this.choosedGoods = {
          detailId: this.getImgUrlValueParams(newVal.imgUrlValue, 'detailId'),
          detailUrl: this.getImgUrlValueParams(newVal.imgUrlValue, 'detailUrl')
        };
      } else {
        this.choosedGoods = {
          detailId: '',
          detailUrl: ''
        };
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
      this.editCategory.imgUrl = obj.src;
    },
    //删除选中的主题图片
    deleteTheme() {
      let obj = {
        id: '',
        src: ''
      };
      this.$emit('chooseImg', obj);
      this.editCategory.imgUrl = '';
    },

    //点击选择商品
    chooseDetail() {
      this.detailDialog = true;
    },
    //选中的商品
    onChooseGoods(val) {
      this.choosedGoods = {
        detailId: val.itemNo,
        detailUrl: val.thumbnail
      };
    },
    //删除选中的商品
    deleteDetail() {
      this.choosedGoods = {
        detailId: '',
        detailUrl: ''
      };
    },

    //保存类目配置
    saveCategory(callback) {
      if (this.choosedGoods.detailId && !this.editCategory.imgUrl) {
        this.$message.error('请先选择主题图片！');
        return;
      }

      this.loading = true;
      const imgUrl = this.editCategory.imgUrl ? this.editCategory.imgUrl : '';
      const imgUrlValue = this.choosedGoods.detailId
        ? 'detailId=' + this.choosedGoods.detailId + '&detailUrl=' + this.choosedGoods.detailUrl
        : '';

      const params = {
        id: this.editCategory.id,
        name: this.editCategory.category,
        imgUrl: imgUrl,
        imgUrlValue: imgUrlValue
      };
      service
        .saveCategory(params)
        .done(res => {
          // this.$message.success('保存成功！');
          callback && callback('success');
        })
        .always(() => {
          this.loading = false;
        });
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
  width: 344px;
  height: 629px;
  padding: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 4px 4px 0;
  .title {
    font-weight: bold;
    padding-bottom: 5px;
    border-bottom: 1px solid #8c8c8c;
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
    padding: 20px;
    border: 1px dashed gray;
    .theme-img-box {
      overflow: hidden;
      font-size: 14px;
      margin-bottom: 20px;
      .theme-img-title {
        float: left;
        width: 100px;
        text-align: right;
      }
      .theme-img {
        display: inline-block;
        float: left;
        margin-left: 10px;
        position: relative;
        font-size: 0px;
        .theme-img-icon {
          display: inline-block;
          width: 192px;
          height: 64px;
        }
        .delete {
          width: 15px;
          height: 15px;
          background: transparent url(../../../../images/close.png) no-repeat 0 0;
          background-size: cover;
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
        }
      }
    }
    .choose-goods-box {
      overflow: hidden;
      .choose-goods-title {
        float: left;
        width: 100px;
        text-align: right;
      }
      .choose-goods-tab {
        float: left;
        margin-left: 10px;
        .choose-goods {
          color: #2e8dff;
          cursor: pointer;
        }
        .choosed-goods-tab {
          position: relative;
          font-size: 0px;
          .detail-image {
            display: inline-block;
            width: 50px;
            height: 50px;
          }
          .delete {
            width: 15px;
            height: 15px;
            background: transparent url(../../../../images/close.png) no-repeat 0 0;
            background-size: cover;
            position: absolute;
            top: 0;
            right: 0;
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

