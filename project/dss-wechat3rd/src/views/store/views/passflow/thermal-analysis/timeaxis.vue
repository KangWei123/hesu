<template>
  <div class="timeaxis-box">
    <div class="axis"></div>
    <div class="timeaxis">

      <div class="timeaxis-item"
           v-for="(item,index) in list"
           :key='index'>
        <div class="axis-box"
             @click="handleChange(item)">
          <div class="dot"><span :class="item.isDisable ? 'disable': item.time >= start && item.time <= end ? '' : 'none'"></span></div>
          <div>{{item.time}}:00</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import dateUtil from '@/dss-common/utils/date';
export default {
  name: 'store-floor',
  props: {
    startDate: {
      type: [Date, String],
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      list: [],
      axis: false,
      start: 8,
      end: 24,
      inRange: false
    };
  },
  watch: {
    startDate() {
      this.start = 8;
      this.end = 24;
      this.initDate();
    }
  },
  mounted() {
    this.initDate();
  },
  methods: {
    initDate() {
      const date = new Date();
      const startDate = dateUtil.format(this.startDate, 'YYYY/MM/DD').toString();
      const today = dateUtil.format(date, 'YYYY/MM/DD').toString();
      const hour = date.getHours();

      if (startDate === today) {
        this.start = hour - 1;
        this.end = hour + 1;
      }

      let list = [];

      for (let index = 8; index <= 24; index++) {
        let isDisable = false;

        if (index > hour + 1 && startDate === today) {
          isDisable = true;
        }

        let point = {
          time: index,
          isDisable: isDisable
        };
        list.push(point);
      }
      this.list = list;

      this.$emit('selectTime', this.start, this.end);
    },
    handleChange(item) {
      if (item.isDisable) {
        return;
      }

      if (item.time > this.start && item.time < this.end) {
        const total = (this.start + this.end) / 2;
        if (item.time < total) {
          this.end = item.time;
        } else {
          this.start = item.time;
        }
      }

      if (item.time < this.start && item.time < this.end) {
        this.start = item.time;
      }

      if (item.time > this.start && item.time > this.end) {
        this.end = item.time;
      }

      this.$emit('selectTime', this.start, this.end);
    }
  }
};
</script>

<style lang="less">
.timeaxis-box {
  margin-top: 38px;
  margin-left: 39px;
  font-size: 12px;
  color: rgba(51, 51, 51, 1);
  position: relative;
  .axis {
    width: 1141px;
    height: 8px;
    background: rgba(245, 245, 245, 1);
    margin-top: 3px;
  }
  .timeaxis {
    position: absolute;
    top: -3px;
    width: 1141px;
    display: flex;
    .timeaxis-item {
      flex: 1;
    }
    .axis-box {
      cursor: pointer;
      width: 25px;
      font-size: 12px;
      line-height: 17px;
      color: rgba(51, 51, 51, 1);
      text-align: center;
      .dot {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 18px;
        text-align: center;
        border-radius: 100%;
        span {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: rgba(112, 160, 255, 1);
          border: 3px solid rgba(209, 225, 255, 1);
          border-radius: 100%;
          z-index: 9;
        }
        .none {
          background: rgba(255, 255, 255, 1);
        }
        .disable {
          background: #e6e6e6;
          border: 3px solid #ececec;
        }
      }
    }
  }
}
</style>
