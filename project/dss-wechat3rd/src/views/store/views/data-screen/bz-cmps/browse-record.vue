<template>
  <div class="browse-record blue-shadow-box"> 
       <!-- v-if="!noVip" -->
    <div class="box-title">
      <div>浏览记录</div>
    </div>
    <transition-group class="record-list" name="vuelist" tag="div">
      <div class="record-item"
            v-for="(item, index) in list"
            :key="index">
        <span class="record-item-name hidden-over">{{item.itemName}}</span>
      </div>
    </transition-group>
    <div class="no-data"
            v-show="noVip || !list.length">暂无浏览记录</div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    wkbStatus: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [],
    };
  },
  watch: {
    data(val, oldVal) {
      if (val && val.memberId) {
        this.getList(val);
      } else {
        this.list = [];
      }
    }
  },
  computed: {
    noVip() {
      return !(this.data.memberId && this.wkbStatus);
    },
  },
  methods: {
   // 获取消费记录
    getList(row) {
      cameraFlowApi
        .getBrowseRecordList({
          memberId: row.memberId,
          pageNo: 1,
          pageSize: 3
        })
        .then(result => {
          this.list = result.data || []
        })
        .catch(() => {
          this.list = [];
        })
    }
  }
};
</script>

<style lang="less" scoped>
.browse-record {
  height: 100%;
}

.record-list {
  margin: 10px 0;
}

.record-item {
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  margin: 5px 0;
}

.record-item-name {
  width: 100%;
  display: inline-block;
}
</style>
