import store from '@/business-common/store.js';

const { body } = document;
const MIN_WIDTH = 1280;

export default {
  mounted() {
    this.$_resizeHandler();
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler);
  },
  methods: {
    $_isCloseSidebar() {
      const rect = body.getBoundingClientRect();
      return rect.width - 1 < MIN_WIDTH;
    },
    $_resizeHandler() {
      const _isCloseSidebar = this.$_isCloseSidebar();
      if (_isCloseSidebar) {
        store.dispatch('closeSideBar');
      }
    }
  }
};
