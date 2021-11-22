<template>
  <div class="image-module">
    <div
      class="image-module-container"
      v-if="dataSource.data.length"
      :style="{
        margin: dataSource.isMineCenter
          ? 0
          : dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        borderRadius: dataSource.radius + 'px',
      }"
    >
      <!-- 轮播 -->
      <div class="banner">
        <div class="slide-show" :style="{ height: dataSource.height / 2 + 'px' }" @mouseover="clear" @mouseout="run">
          <div class="slide-img">
            <a>
              <transition name="slide-trans">
                <div
                  v-if="isShow"
                  class="image-module-image"
                  :style="{
                    'background-image': 'url(' + images[nowIndex].wkSrc + ')',
                    borderRadius: dataSource.radius + 'px',
                  }"
                ></div>
              </transition>
              <transition name="slide-trans-old">
                <div
                  v-if="!isShow"
                  class="image-module-image"
                  :style="{
                    'background-image': 'url(' + images[nowIndex].wkSrc + ')',
                    borderRadius: dataSource.radius + 'px',
                  }"
                ></div>
              </transition>
            </a>
          </div>
          <ul class="slide-pages">
            <li
              v-for="(item, index) in dataSource.data"
              @click="goto(index)"
              :key="index"
              :class="{ active: index === nowIndex, normal: index !== nowIndex }"
            ></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 没有数据的时候 -->
    <div v-else class="no-data" :style="{ height: dataSource.height / 2 + 'px' }">
      <img src="../images/decorate-bg.png" alt="" />
      <div>编辑图片</div>
      <div>建议宽度{{ dataSource.isMineCenter ? 690 : 750 }}px</div>
    </div>
  </div>
</template>
<script>
  import ImageFilter from './image-filter';

  export default {
    name: 'ImageModule',
    props: {
      dataSource: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        nowIndex: 0,
        isShow: true,
        inv: 5000,
        invId: 0,
      };
    },

    watch: {
      'dataSource.data': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.nowIndex = 0;
          if (newVal) {
            this.addWkbImage(newVal, 'src', 'wkSrc');
          }
        },
      },
    },
    computed: {
      prevIndex() {
        if (this.nowIndex === 0) {
          return this.dataSource.data.length - 1;
        } else {
          return this.nowIndex - 1;
        }
      },
      nextIndex() {
        if (this.nowIndex === this.dataSource.data.length - 1) {
          return 0;
        } else {
          return this.nowIndex + 1;
        }
      },
      images() {
        return this.dataSource.data;
      },
    },

    methods: {
      goto(index) {
        this.isShow = false;
        setTimeout(() => {
          this.isShow = true;
          this.nowIndex = index;
        }, 100);
      },
      run() {
        this.invId = setInterval(() => {
          if (this.dataSource.data.length > 1 && this.dataSource.showType === 'banner') {
            this.goto(this.nextIndex);
          }
        }, this.inv);
      },
      clear() {
        clearInterval(this.invId);
      },

      imageStyle(item, index) {
        let margin = this.dataSource.margin;
        const imageHeight = 120;
        const imageWidth = 375;
        if (index === 0) {
          margin = 0;
        }
        return {
          width: imageWidth + 'px',
          height: imageHeight + 'px',
          marginTop: margin + 'px',
          backgroundImage: 'url(' + item.wkSrc + ')',
        };
      },

      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            // const reg = new RegExp('https://.*?com', '');
            // item[addKey] = originImage.replace(reg, '');
            item[addKey] = ImageFilter(originImage);
          }
        });
      },
    },
    mounted() {
      if (!this.dataSource.hasOwnProperty('height')) {
        this.$set(this.dataSource, 'height', 240);
      }
      this.run();
    },
  };
</script>

<style lang="less">
  .image-module {
    .image-module-container {
      overflow: hidden;
      .banner {
        .slide-trans-enter-active {
          transition: all 0.5s;
        }
        .slide-trans-enter {
          transform: translateX(100%);
        }
        .slide-trans-old-leave-active {
          transition: all 0.5s;
          transform: translateX(-100%);
        }

        .slide-show {
          position: relative;
          width: 100%;
          overflow: hidden;
          // height: 120px;
        }

        .slide-img {
          width: 100%;
          height: 100%;
          background-color: white;
        }
        .slide-img .image-module-image {
          width: 100%;
          position: absolute;
          height: 100%;
          top: 0;
          left: 0;
        }
        .slide-img img {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .slide-pages {
          position: absolute;
          width: 100%;
          bottom: 10px;
          text-align: center;
        }
        .slide-pages .normal {
          display: inline-block;
          cursor: pointer;
          width: 8px;
          height: 8px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          margin-right: 6px;
          background-color: white;
        }
        .slide-pages .active {
          display: inline-block;
          cursor: pointer;
          width: 8px;
          height: 8px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          margin-right: 6px;
          background-color: gray;
        }
      }

      .image-module-image {
        background-position: center;
        background-size: cover;
        // height: 100%;
      }
    }

    .no-data {
      width: 100%;
      height: 120px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      img {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }
    }
  }
</style>
