<template>
  <ul class="breadcrumb">
    <li @click="jumpToPage('/materials/picture/list')">图片</li>
    <li v-for="item in activeMenus" :key="item.index" :class="{ active: item.active }" @click="jumpToPage(item.path)">
      /{{ item.name }}
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'BottomMenu',
    data() {
      return {
        menuList: [
          {
            name: '标签',
            path: '/materials/picture/tag-list',
            icon: 'icon-tag',
            children: [
              {
                name: '相关素材',
                path: '/materials/picture/tag-related',
              },
            ],
          },
          {
            name: '回收站',
            path: '/materials/picture/recycle-bin',
            icon: 'icon-bucket',
            children: [],
          },
        ],
      };
    },
    computed: {
      activeMenus() {
        const activeMenus = [];
        const curPath = this.$route.path;

        this.menuList.forEach(item => {
          if (curPath.includes(item.path)) {
            item.active = true;
            activeMenus.push(item);
          } else {
            item.children.forEach(childItem => {
              if (curPath.includes(childItem.path)) {
                item.active = false;
                activeMenus.push(item);
                childItem.active = true;
                activeMenus.push(childItem);
              }
            });
          }
        });
        return activeMenus;
      },
    },
    methods: {
      jumpToPage(path) {
        this.$router.push({ path });
      },
    },
  };
</script>

<style lang="less" scoped>
  .breadcrumb {
    display: flex;
    line-height: 48px;
    padding: 0 24px;
    font-size: 16px;
    border-bottom: 1px solid #dcdee0;

    li {
      cursor: pointer;

      &:last-child {
        cursor: auto;
      }
    }

    .active {
      color: #a1a4ab;
    }
  }
</style>
