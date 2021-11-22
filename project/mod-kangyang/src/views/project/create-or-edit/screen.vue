<template>
  <div class="screen">
    <div class="screen__inner">
      <div class="screen__hd" :style="{ background: `url(${backgroundImage}) no-repeat`, backgroundSize: 'cover' }">
        <el-image class="screen__hd_bg" :src="headerBgImage"></el-image>
        <div class="screen__hd_percent">1/{{ form.videos.length + form.mainImgs.length }}</div>
      </div>

      <div class="screen__wrap">
        <p class="screen__wrap_title">{{ form.name }}</p>
        <div class="tags">
          <div
            v-for="(item, index) of form.prjTagList"
            :key="index"
            class="tags__tag"
            :style="{ background: item.bgColor || '#F5F7FB', color: item.fontColor || '#8B97A9' }"
          >
            {{ item.tagName }}
          </div>
        </div>
        <div class="screen__wrap_line">
          <span class="label">价格：</span>
          <p class="screen__price">
            <b>{{ form.price.start }}-{{ form.price.end }}</b
            >元/月/床
          </p>
        </div>
        <div class="screen__wrap_line">
          <span class="label">项目地址：</span>
          <p>{{ form.address.address }}</p>
          <el-image class="icon-map" :src="mapImage" />
        </div>
        <div class="screen__wrap_line">
          <el-image class="icon-group" :src="groupImage" />
          <p>2324人围观</p>
        </div>

        <div class="screen__wrap_nav">
          <div class="item">
            <p>{{ form.floorArea }}<span>m²</span></p>
            <p>建筑面积</p>
          </div>
          <div class="item">
            <p>{{ form.totalBed }}<span>个</span></p>
            <p>总床位</p>
          </div>
          <div class="item">
            <p>{{ form.publicSpace }}<span>m²</span></p>
            <p>公共空间</p>
          </div>
          <div class="item">
            <p>{{ form.occupancyRate }}<span>%</span></p>
            <p>入住率</p>
          </div>
        </div>

        <div class="screen__wrap_tab">
          <div class="item">
            <el-image class="icon-tab" :src="tab1Image" />
            <p>预约参观</p>
          </div>
          <div style="width: 1px; height: 14px; background: #dedfe0" />
          <div class="item">
            <el-image class="icon-tab" :src="tab2Image" />
            <p>费用评估</p>
          </div>
        </div>

        <div style="margin: 0 -15px; height: 10px; background: #f1f4f9" />
      </div>
    </div>
  </div>
</template>

<script>
  import headerBgImage from '../../../images/project/header.png';
  import mapImage from '../../../images/project/map.png';
  import groupImage from '../../../images/project/group.png';
  import tab1Image from '../../../images/project/tab_1.png';
  import tab2Image from '../../../images/project/tab_2.png';

  export default {
    name: 'Screen',
    props: {
      form: Object,
    },
    data() {
      return {
        mapImage,
        headerBgImage,
        groupImage,
        tab1Image,
        tab2Image,
      };
    },
    computed: {
      backgroundImage() {
        const [video] = this.form.videos;
        let url = '';
        if (video) {
          url = video.coverUrl;
        }
        return url;
      },
    },
  };
</script>

<style lang="less" scoped>
  .icon-map {
    width: 30px;
    height: 30px;
  }

  .icon-tab {
    margin-right: 10px;
    width: 19px;
    height: 19px;
  }

  .icon-group {
    margin-right: 10px;
    width: 142px;
    height: 23px;
  }

  .screen {
    padding: 27px 35px 43px;
    width: 441px;
    height: 770px;
    box-sizing: border-box;
    line-height: normal;
    background: url('../../../images/screen.png') no-repeat 100% / 100%;

    &__inner {
      overflow: hidden;
      border-radius: 20px;
    }

    &__hd {
      position: relative;
      height: 296px;

      &_bg {
        width: 100%;
        height: 276px;
      }

      &_percent {
        position: absolute;
        right: 20px;
        bottom: 20px;
        padding: 1px 6px;
        font-size: 12px;
        color: white;
        line-height: 17px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.5);
      }
    }

    &__wrap {
      position: relative;
      margin-top: -10px;
      padding: 19px 15px;
      color: #333;
      font-size: 16px;
      background: #fff;
      border-radius: 16px 16px 0 0;
      z-index: 1;

      > * {
        margin-bottom: 15px;
      }

      &_title {
        font-weight: bold;
        font-size: 19px;
      }

      &_line {
        display: flex;
        align-items: center;

        .label {
          color: #8b97a9;
        }

        p {
          flex: 1;
        }
      }

      &_tab {
        display: flex;
        align-items: center;
        font-size: 18px;
        padding: 10px 0;

        .item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &_nav {
        display: flex;
        align-items: center;
        height: 75px;
        border-radius: 3px;
        box-shadow: 0 3px 13px 0 rgba(0, 0, 0, 0.07);

        .item {
          position: relative;
          flex: 1;
          text-align: center;

          &::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            margin-top: -11px;
            width: 1px;
            height: 22px;
            background: #dedfe0;
          }

          &:last-child::after {
            display: none;
          }

          p:first-child {
            color: #fa7516;
            font-size: 21px;
            font-weight: bold;

            span {
              font-weight: 400;
              font-size: 15px;
            }
          }

          p:last-child {
            margin-top: 6px;
            color: #8b97a9;
            font-size: 14px;
          }
        }
      }
    }

    &__price {
      font-size: 19px;
      color: #fa7516;

      b {
        font-size: 25px;
      }
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;

    &__tag {
      font-size: 14px;
      line-height: 22px;
      padding: 0 0.5em;
      margin-bottom: 5px;
      margin-right: 5px;
    }
  }
</style>
