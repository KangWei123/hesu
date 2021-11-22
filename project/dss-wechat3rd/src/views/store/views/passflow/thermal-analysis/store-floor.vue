<template>
  <div class="show-floor-box">
    <div class="title">当前位置</div>
    <div class="floor-list">
      <div class="floor-item"
           @click="handleFloor(item)"
           :class="floor===item.id?'selected':''"
           v-for="(item,index) in storeFloors"
           :key='index'>F{{item.floorValue}}-{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import newStoreApi from '@/dss-store/src/api/index.js';
export default {
  name: 'store-floor',
  data() {
    return {
      floor: null,
      storeFloors: [],
      curFloorLayoutItem: null
    };
  },
  mounted() {
    this.getFloor();
  },
  methods: {
    //选择楼层
    handleFloor(item) {
      if (item) {
        this.floor = item.id;
        this.curFloorLayoutItem = item;
        this.$emit('floor', this.curFloorLayoutItem);
      }
    },

    //初始化楼层
    getFloor() {
      newStoreApi
        .floorList({
          pageNo: 1,
          pageSize: 100
        })
        .then(res => {
          if (res.data) {
            this.storeFloors = res.data || [];
            this.$emit('storeFloors', this.storeFloors);
            if (this.storeFloors[0]) {
              this.floor = this.storeFloors[0].id;
              this.handleFloor(this.storeFloors[0]);
            }
          }
        });
    }
  }
};
</script>

<style lang="less">
.show-floor-box {
  width: 250px;
  height: 540px;
  display: inline-block;
  background: rgba(245, 247, 250, 1);
  margin-left: 10px;
  overflow-y: auto;
  .title {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    margin: 10px 0 11px 10px;
  }
  .floor-list {
    margin: 0 10px;
    .floor-item {
      cursor: pointer;
      margin-bottom: 10px;
      width: 230px;
      height: 36px;
      background: rgba(255, 255, 255, 1);
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
      padding-left: 25px;
      line-height: 36px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .selected {
      background: rgba(226, 236, 255, 1);
      color: rgba(37, 110, 255, 1);
    }
  }
}
</style>
