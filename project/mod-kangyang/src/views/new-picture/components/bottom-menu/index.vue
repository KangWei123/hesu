<template>
  <ul class="bottom-menu">
    <li
      v-for="(item, index) in menuList"
      :key="index"
      @click="jumpToPage(item.path)"
      :class="{ active: setActive(item.path) }"
      v-show="item.hideOnElderSpace ? !isElderSpace : true"
    >
      <span class="icon" :class="item.icon"></span>
      {{ item.name }}
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'BottomMenu',
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    data() {
      return {
        menuList: [
          {
            name: '素材标签',
            path: this.isElderSpace ? '/elderspace/tag-list' : '/materials/picture/tag-list',
            icon: 'icon-tag',
          },
          {
            name: '回收站',
            path: '/materials/picture/recycle-bin',
            icon: 'icon-bucket',
            hideOnElderSpace: true,
          },
        ],
      };
    },
    computed: {
      setActive() {
        return path => {
          return this.$route.path.includes(path);
        };
      },
    },
    mounted() {},
    methods: {
      jumpToPage(path) {
        this.$router.push({ path });
      },
    },
  };
</script>

<style lang="less" scoped>
  .bottom-menu {
    line-height: 40px;
    width: 100%;

    li {
      padding-left: 12px;
      cursor: pointer;

      &:hover,
      &.active {
        background: #edf6ff;
        color: #256dff;

        .icon-tag {
          background-image: url(../../../../../images/materials/picture/tag-active.svg);
        }

        .icon-bucket {
          background-image: url(../../../../../images/materials/picture/bucket-active.svg);
        }
      }
    }

    .icon {
      display: inline-block;
      vertical-align: middle;
      margin: 0 8px 3px 0;
      width: 16px;
      height: 16px;
      background-size: 100% 100%;
    }

    .icon-tag {
      background-image: url(../../../../../images/materials/picture/tag.svg);
    }

    .icon-bucket {
      background-image: url(../../../../../images/materials/picture/bucket.svg);
    }
  }
</style>
