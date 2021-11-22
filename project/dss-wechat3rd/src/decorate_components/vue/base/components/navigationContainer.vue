<template>
  <div class="nav-container" :style="mystyle">
    <div class="nav-container__tabs">
      <div
        v-for="(item, index) of list"
        :key="`${item.name}${index}`"
        :id="uid + '_tab_' + index"
        :class="['nav-container__tab', { active: index === dataSource.activeIndex }]"
        :style="list.length < 5 ? { flex: '1', justifyContent: 'center' } : {}"
      >
        <img class="logo" v-if="item.logo && index === dataSource.activeIndex" :src="item.logo" />
        <div class="label">{{ item.name }}</div>
      </div>
    </div>
    <div class="nav-container__panels">
      <div
        v-for="(item, index) of list"
        v-show="dataSource.activeIndex === index"
        :key="`${item.name}${index}`"
        class="nav-container__panel"
      >
        <component-container :data-source="item" :show-border="false" />
      </div>
    </div>
  </div>
</template>

<script>
  import ComponentContainer from './componentContainer';

  let uid = 0;

  export default {
    name: 'NavigationContainer',
    components: { ComponentContainer },
    props: {
      dataSource: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        uid: uid++,
      };
    },
    watch: {
      'dataSource.activeIndex'(idx) {
        console.log('index change', idx);
        this.$nextTick(() => {
          const el = document.getElementById(this.uid + '_tab_' + idx);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      },
    },
    computed: {
      mystyle() {
        const style = this.dataSource.style || {};
        const wrapPx = u => (u != null ? u + 'px' : undefined);
        return {
          borderRadius: wrapPx(style.radius),
          marginTop: wrapPx(style.marginUp),
          marginBottom: wrapPx(style.marginDown),
          marginLeft: wrapPx(style.marginLeftRight),
          marginRight: wrapPx(style.marginLeftRight),
        };
      },
      list() {
        return this.dataSource.list.filter(i => !!i.name);
      },
    },
  };
</script>

<style lang="less" scoped>
  .nav-container {
    background-color: white;
    overflow: hidden;
  }

  .nav-container__tabs {
    display: flex;
    width: 100%;
    overflow-x: auto;
    padding: 8px 8px 0;

    .logo {
      width: 14px;
      height: 14px;
      object-fit: contain;
      margin-right: 5px;
    }

    .nav-container__tab {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      padding: 12px;
      font-size: 14px;
      color: #374055;
      border-radius: 0;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      background-color: #f9fbfc;

      &.active {
        color: #ff8341;
        font-size: 15px;
        background-color: #fff;
        border-radius: 8px 8px 0 0;
        box-shadow: 0 2px 10px 2px #e6e6e6;
        z-index: 1;
      }
    }
  }
</style>
