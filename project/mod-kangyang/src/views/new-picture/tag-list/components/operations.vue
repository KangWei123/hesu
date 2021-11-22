<template>
  <div class="operations" :style="locationStyle" @click.stop="stop">
    <ul>
      <li><div class="content" @click="handleOperate('viewMat')">查看相关素材</div></li>
      <li>
        <div class="content">
          添加至群组
          <span class="el-icon-caret-right"></span>
        </div>
        <el-scrollbar
          class="scrollbar"
          ref="scrollbar"
          :wrap-style="`max-height: ${activeIndex.includes('a') ? '128px' : '160px'};`"
          :style="{ left: scrollbarLeft }"
        >
          <ul class="group-list">
            <li v-for="item in groupList" :key="item.id">
              <a class="content limit-line" :title="item.groupName" @click="handleOperate('addToGroup', item.id)">{{
                item.groupName
              }}</a>
            </li>
          </ul>
        </el-scrollbar>
      </li>
      <li v-if="!activeIndex.includes('a')">
        <div class="content" @click="handleOperate('remove')">从标签组移除</div>
      </li>
      <li><div class="content" @click="handleOperate('choose')">选择</div></li>
      <li><div class="content" @click="handleOperate('edit')">修改</div></li>
      <li><div class="content" @click="handleOperate('delete')">删除</div></li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'Operations',
    props: {
      locationStyle: {
        type: Object,
        default() {
          return {};
        },
      },
      groupList: {
        type: Array,
        default: [],
      },
      activeIndex: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        screenWidth: window.innerWidth,
        scrollbarLeft: '100%',
      };
    },
    watch: {
      locationStyle() {
        this.$nextTick(() => {
          // 调整群组列表超出屏幕时的位置，底部超出暂不处理
          this.scrollbarLeft =
            this.$refs.scrollbar.$el.getBoundingClientRect().right > this.screenWidth ? '-100%' : '100%';
        });
      },
    },
    mounted() {},
    methods: {
      handleOperate(...args) {
        this.$emit('handleOperate', ...args);
      },
      stop() {},
    },
  };
</script>
<style lang="less" scoped>
  .scrollbar {
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.05);

    /deep/ .el-scrollbar__wrap {
      margin-bottom: 0 !important;
      overflow-x: hidden;
    }

    /deep/ .is-vertical {
      opacity: 1;
    }
  }

  .operations {
    position: absolute;
    z-index: 99;
    border-radius: 8px;
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.05);

    ul {
      background: #fff;
    }

    li {
      position: relative;

      &:hover {
        > .content {
          color: #1890ff;
          background: #e6f7ff;
        }

        .scrollbar {
          opacity: 1;
        }
      }
    }

    .content {
      padding: 0 30px 0 15px;
      line-height: 32px;
      cursor: pointer;
      color: inherit;
    }

    .el-icon-caret-right {
      position: absolute;
      top: 8px;
      right: 5px;
      font-size: 16px;
    }

    .scrollbar {
      opacity: 0;
      position: absolute;
      top: 0;
      min-width: 100%;

      .content {
        padding: 0 15px;
      }
    }
  }

  .limit-line {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    align-content: center;
    word-break: break-all;
  }
</style>
