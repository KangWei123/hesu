<template>
  <div class="decorate-components">
    <div class="decorate-label-box">
      <div class="decorate-label">装修组件</div>
      <div class="decorate-tip">提示：组建大小可通过拖拽调节</div>
    </div>
    <div class="components-label">设备区域</div>
    <div class="device-box">
      <div class="store-components-item"
           draggable="true"
           data-tag="canvas-panel"
           v-for="(item,index) in deviceItems"
           :key="index"
           @dragstart="e => onDragstart(e, item.type, item.name, item.iconName)">
        <img class="components-icon"
             :src="item.icon" />
        <div>{{item.name}}</div>
      </div>
    </div>
    <div class="components-label">装饰区域</div>
    <div class="device-box">
      <div class="store-components-item"
           draggable="true"
           data-tag="canvas-panel"
           v-for="(item,index) in decorateItems"
           :key="index"
           @dragstart="e => onDragstart(e, item.type, item.name, item.iconName)">
        <img class="components-icon"
             :src="item.icon" />
        <div>{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import floorEnum from '../floor-enum.js';
const decorateItems = [
  {
    name: '服务台',
    icon: require('@/dss-store/src/images/ic-service-bar.png'),
    iconName: 'ic-service-bar.png',
    type: floorEnum.decorateType.area
  },
  {
    name: '货架',
    icon: require('@/dss-store/src/images/ic-goods-shelves.png'),
    iconName: 'ic-goods-shelves.png',
    type: floorEnum.decorateType.area
  },
  {
    name: '收银台',
    icon: require('@/dss-store/src/images/ic-cashier.png'),
    iconName: 'ic-cashier.png',
    type: floorEnum.decorateType.area
  },
  {
    name: '休息区',
    icon: require('@/dss-store/src/images/ic-desk.png'),
    iconName: 'ic-desk.png',
    type: floorEnum.decorateType.area
  },
  {
    name: '洗手间',
    icon: require('@/dss-store/src/images/ic-wc.png'),
    iconName: 'ic-wc.png',
    type: floorEnum.decorateType.area
  },
  {
    name: '扶梯',
    icon: require('@/dss-store/src/images/ic-stairs.png'),
    iconName: 'ic-stairs.png',
    type: floorEnum.decorateType.area
  },
  {
    name: '试衣间',
    icon: require('@/dss-store/src/images/ic-fitting-room.png'),
    iconName: 'ic-fitting-room.png',
    type: floorEnum.decorateType.area
  },
  {
    name: '自定义',
    icon: require('@/dss-store/src/images/ic-custom.png'),
    iconName: 'ic-custom.png',
    type: floorEnum.decorateType.custom
  }
];

const deviceItems = [
  {
    name: '店内',
    icon: require('@/dss-store/src/images/ic-face.png'),
    iconName: 'ic-face.png',
    type: floorEnum.decorateType.shop
  },
  {
    name: '入口',
    icon: require('@/dss-store/src/images/ic-enter-exit.png'),
    iconName: 'ic-enter-exit.png',
    type: floorEnum.decorateType.enter_exit
  },
  {
    name: '店外',
    icon: require('@/dss-store/src/images/ic-outside.png'),
    iconName: 'ic-outside.png',
    type: floorEnum.decorateType.outside
  },
  {
    name: '收银',
    icon: require('@/dss-store/src/images/ic-cashier.png'),
    iconName: 'ic-cashier.png',
    type: floorEnum.decorateType.cashier
  }
];

export default {
  name: 'decorate-component',
  data() {
    return {
      floorEnum,
      decorateItems,
      deviceItems
    };
  },
  methods: {
    onDragstart(ev, type, areaName, iconName) {
      const data = ev.dataTransfer;
      data.setDragImage(ev.target, 0, 0);
      data.setData('tag', 'canvas-panel'); // 标记，可以拖拽到指定的dom
      const decorate = {
        type,
        areaName,
        iconName
      };
      data.setData('decorate', JSON.stringify(decorate));
    }
  }
};
</script>

<style lang="less">
.decorate-components {
  width: 212px;
  height: 100%;
  background: white;
  box-sizing: border-box;
  font-size: @small-font;
  .decorate-label-box {
    height: 60px;
    border-bottom: 1px solid #dadada;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 13px;
  }
  .decorate-label {
    font-size: @standard-font;
    color: @black-color;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    height: 20px;
    line-height: 20px;
  }
  .decorate-tip {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 17px;
    margin-top: 4px;
  }
  .components-label {
    height: 17px;
    font-size: @small-font;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: @black-color;
    line-height: 17px;
    padding-bottom: 6px;
    padding-left: 10px;
  }
  .device-box {
    padding-bottom: 21px;
    font-size: 0;
    padding-right: 40px;
    padding-left: 10px;
  }
  .store-components-item {
    display: inline-block;
    width: 70px;
    height: 70px;
    box-sizing: border-box;
    padding-top: 11px;
    border: 1px solid rgba(225, 225, 225, 1);
    text-align: center;
    font-size: 12px;
    color: #999999;
    vertical-align: top;
  }
  .components-icon {
    width: 34px;
    height: 34px;
  }
}
</style>
