<template>
  <div
    class="img-uploader"
    :class="{isAllowEdit:!isDisabledEdit}"
    :style="{width: width + 'px', height: height + 'px', 'line-height': height + 'px'}"
    v-if="disable"
  >
    <template v-if="imgUrl">
      <!-- <img :src="imgUrl" class="avatar" :style="{maxWidth: width + 'px', maxHeight: height + 'px'}"> -->
      <div
        class="avatar"
        :style="{'background': 'transparent url('+imgUrl+') no-repeat center center / cover',maxWidth: width + 'px', maxHeight: height + 'px'}"
      >
        <span class="upload-desc" @click="handleChooseImage" v-if="canReset">点击重选</span>
        <el-button class="btn-img-del" icon="el-icon-delete" circle @click.stop="onRemove"></el-button>
      </div>
    </template>

    <div
      :style="{cursor: !isDisabledEdit ? 'pointer' : 'not-allowed'}"
      v-else
      @click="handleChooseImage"
    >
      <i class="el-icon-plus" :style="{'line-height': height + 'px'}"></i>
    </div>

    <images-picker
      :visible.sync="showChooseImageDialog"
      v-if="showChooseImageDialog"
      @cancel="onCancelPickImage"
      @picked="onPickedImage"
      :multiple="multiple"
      :limit="limit"
    />
  </div>
</template>

<script>
import emitter from 'element-ui/lib/mixins/emitter.js';
// import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
import ImagesPicker from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
export default {
  name: 'image-uploader',
  mixins: [emitter, AdapterIfr.AdapterMixins],
  components: {
    // MaterialsImage,
    ImagesPicker
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return null;
      }
    },
    // 是否禁止编辑
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    //是否显示
    disable: {
      type: Boolean,
      default: true
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 5
    },
    //透传标示
    unique: {
      default: ''
    },
    width: {
      type: Number,
      default: 176
    },
    height: {
      type: Number,
      default: 176
    },
    rects: {
      type: Array,
      default() {
        return [{ w: 800, h: 600 }, { w: 640, h: 800 }, { w: 800, h: 800 }];
      }
    },
    rect: {
      type: Object,
      default() {
        return { w: 0, h: 0 };
      }
    },
    canReset: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imgUrl: this.value && this.value.imgUrl ? this.value.imgUrl : '',
      showChooseImageDialog: false
    };
  },
  computed: {
    rectTipMsg() {
      let msg = '';
      this.rects.forEach((rect, index) => {
        if (index > 0) {
          msg += '，';
        }
        msg += `${rect.w}x${rect.h}px`;
      });
      return msg;
    }
  },
  watch: {
    value(val) {
      console.log(val);
      this.imgUrl = val && (val.imgUrl || '');
    }
  },
  methods: {
    handleChooseImage() {
      // 判断是否禁止编辑
      if (!this.isDisabledEdit) {
        this.showChooseImageDialog = true;
        this.adapterIfmMask(true);
      }
    },

    onCancelPickImage() {
      this.showChooseImageDialog = false;
      this.adapterIfmMask(false);
    },

    onPickedImage(choosedImg) {
      this.showChooseImageDialog = false;
      this.adapterIfmMask(false);
      this.updateValue(choosedImg);
    },

    onRemove() {
      this.$emit('delete');
      this.imgUrl = '';
    },
    updateValue(v) {
      console.log(v);
      this.imgUrl = !!v && !!v.imgUrl ? v.imgUrl : '';
      this.$emit('input', v, this.unique);
      //触发表单验证
      this.dispatch('ElFormItem', 'el.form.change', [v]);
    }
  }
  // route:{
  //   data(){
  //     this.sendFalse();
  //   }
  // }
};
</script>

<style lang="less" scoped>
.img-uploader {
  display: inline-block;
  width: 176px;
  height: 132px;
  background: #eff2f5;
  border-radius: 4px;
  border: 1px solid #eff2f5;
  position: relative;
  line-height: 132px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;

  .el-icon-plus {
    font-size: 18px;
    line-height: 132px;
    color: #566980;
    font-weight: bold;
  }
}
.isAllowEdit:hover {
  .btn-img-del,
  .upload-desc {
    display: inline-block;
    z-index: 99;
  }
}

.avatar {
  width: 100%;
  /*width: 174px;*/
  height: 174px;
  position: absolute;
  top: 0;
  left: 0;
}

.btn-img-del {
  position: absolute;
  top: 0;
  right: 8px;
  color: #ff5b56;
  display: none;
}

.upload-desc {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 2px;
  background: #2c3641;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-size: 12px;
  line-height: 24px;
  display: none;
  width: 68px;
  height: 24px;
  margin-top: -12px;
  margin-left: -34px;
  cursor: pointer;
}
</style>
