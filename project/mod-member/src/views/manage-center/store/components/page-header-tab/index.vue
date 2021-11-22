<template>
  <page-header>
    <div class="third-nav-wrapper">
      <div
        v-for="item of menuList"
        :class="{ 'third-nav-item-active': activeKey === item.key, 'third-nav-item': true }"
        :key="item.key"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </page-header>
</template>

<script>
  import PageHeader from './page-header';
  export default {
    components: {
      PageHeader,
    },
    props: {
      menuList: { type: Array, default: () => [] },
      defaultActiveKey: {
        type: [String, Number],
        required: false,
      },
    },
    watch: {
      defaultActiveKey(val) {
        this.activeKey = this.defaultActiveKey;
      },
    },
    data() {
      return { activeKey: null };
    },
    methods: {
      handleClick(menu) {
        this.$emit('click', menu);
        this.activeKey = menu.key;
      },
    },
    mounted() {
      if (this.defaultActiveKey) {
        this.activeKey = this.defaultActiveKey;
      } else {
        this.activeKey = (this.menuList.find(m => m.route === this.$route.path) || {}).key || this.defaultActiveKey;
      }
    },
  };
</script>

<style lang="less" scoped>
  .third-nav-wrapper {
    display: flex;
    align-items: center;
    background-color: white;
    box-sizing: border-box;
    .third-nav-item {
      cursor: pointer;
      display: inline-block;
      padding: 5px 9px;
      box-sizing: border-box;
      border-radius: 2px;
      margin-right: 10px;
      font-size: 12px;
      background: #f2f4f7;
      font-weight: 400;
      color: #a8a8a8;
      border: 1px solid transparent;
    }
    .third-nav-item-active {
      background: #f2f4f7;
      border: 1px solid #3879fb;
      color: #3879fb;
    }
  }
</style>
