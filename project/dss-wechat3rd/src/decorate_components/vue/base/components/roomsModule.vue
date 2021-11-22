<template>
  <goods-module :dataSource="dataSource"
                :type="goodsTypeEnum.rooms"></goods-module>
</template>

<script>
import goodsModule from './goodsModule.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import ImageFilter from './image-filter';

export default {
  props: {
    dataSource: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },

  components: {
    goodsModule
  },

  filters: {
    money(mony) {
      return !!mony ? mony / 100 : 0;
    }
  },

  watch: {
    'dataSource.posterData': {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.nowIndex = 0;
        if (newVal) {
          this.addWkbImage(newVal, 'src', 'wkSrc');
        }
      }
    },
    'dataSource.data': {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.nowIndex = 0;
        if (newVal) {
          this.addWkbImage(newVal, 'thumbnail', 'wkThumbnail');
        }
      }
    }
  },
  data() {
    return {
      goodsTypeEnum: goodsTypeEnum,
      type: goodsTypeEnum.rooms
    };
  },
  methods: {
    addWkbImage(items, originKey, addKey) {
      (items || []).forEach(item => {
        if (item.hasOwnProperty(originKey)) {
          const originImage = item[originKey];
          //const reg = new RegExp('https://.*?com', '');
          if (originImage) {
            //item[addKey] = originImage.replace(reg, '');
            item[addKey] = ImageFilter(originImage);
          }
        }
      });
    }
  }
};
</script>
