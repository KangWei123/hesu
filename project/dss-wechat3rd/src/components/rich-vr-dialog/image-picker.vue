<template>
  <div>
    <choose-images v-model="model" @delete="onDeleteImg" />
  </div>
</template>

<script>
// 包装 uploader => v-model
import Uploader from '../material-picker/single-uploader';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

export default {
  components: {
    Uploader,
    ChooseImages
  },

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return { visible: false };
  },

  methods: {
    onDeleteImg() {
      this.$emit('input', '');
    }
  },

  computed: {
    model: {
      get() {
        return { imgUrl: this.value };
      },
      set(val) {
        this.$emit('input', val && val.imgUrl);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.upload {
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

  .re-upload {
    align-self: flex-end;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    color: #ffffff;
  }
}
</style>
