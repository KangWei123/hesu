<template>
  <div>
    <choose-image
      :height="176"
      :value="imgList"
      @input="onImageAdd"
      @delete="onDeleteImg"
      :multiple="true"
      :limit="limit"
    />
    <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">
      建议尺寸750*750，建议图片小于2M
    </div>
  </div>
</template>

<script>
  import ChooseImage from '@/dss-wechat3rd/src/components/choose-image/index.vue';

  export default {
    components: { ChooseImage },
    props: {
      value: {
        type: Array,
        default() {
          return [];
        },
      },
      limit: {
        type: Number,
        default: 5,
      },
    },
    data() {
      return {
        imgList: (this.value || []).map((i, idx) => ({ id: idx, imgUrl: i })),
      };
    },
    watch: {
      value(val) {
        this.imgList = (this.value || []).map((i, idx) => ({ id: idx, imgUrl: i }));
      },
    },

    methods: {
      handleUpdate() {
        this.$emit(
          'input',
          this.imgList.map(i => i.imgUrl)
        );
      },
      // 删除图片
      onDeleteImg(index) {
        this.imgList.splice(index, 1);
        this.handleUpdate();
      },
      // 添加商品图片
      onImageAdd(imgs) {
        let hasSelect = false;
        imgs.forEach(ele => {
          if (!~this.imgList.findIndex(i => i.imgUrl === ele.imgUrl)) {
            this.imgList.push(ele);
          } else {
            hasSelect = true;
          }
        });
        if (hasSelect) {
          this.$message.info('选择列表中包含已选图片，已自动进行过滤');
        }
        this.handleUpdate();
      },
    },
  };
</script>
