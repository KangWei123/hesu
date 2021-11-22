<template>
  <materials-image @cancel="onCancelPickImage" @picked="onPickedImage" :multiple="false"></materials-image>
</template>

<script>
// import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/img-material/index.vue';

export default {
  components: { MaterialsImage },
  data() {
    return {};
  },
  methods: {
    onCancelPickImage() {
      console.log('onCancelPickImage');
    },
    onPickedImage(val) {
      console.log('onPickedImage', val);
    }
  },
  mounted() {}
};
</script>
