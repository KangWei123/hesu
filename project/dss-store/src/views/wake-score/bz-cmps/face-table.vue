<template>
  <div class="table-div">
    <img class="leftTop"
         src="../../../asserts/images/face-score/leftLine.png" />
    <img class="rightTop"
         src="../../../asserts/images/face-score/rightTop.png" />
    <div class="table-head">{{isEnterFaceScore ? '访问列表' :'签到列表'}}</div>
    <div class="table-body">
      <transition-group name="vuelist"
                        tag="div"
                        class="face-table"
                        key="table">
        <div class="row"
             v-for="(user) in data"
             :key="user.unionId">
          <div class="cell table-td"
               :data-id="user.unionId">
            <img class="aevter"
                 :src="user.image" />
          </div>
          <div class="cell table-td">{{user.faceGender === 1 ? '男': '女'}}</div>
          <div class="cell table-td">
            <span class="right"> <span>{{user.faceAge <18 ?'<':''}}</span>
              <span class="number">{{user.faceAge|age}}</span>岁
            </span>
          </div>
          <div class="cell table-td color">颜值<span class="number">{{user.beauty||90}}</span>分</div>
          <div class="cell table-td color" v-if="isEnterFaceScore">{{user.count > 1 ? user.count+'次访问' : '首次访问'}}</div>
          <div class="cell table-td color" v-else>{{user.count > 1 ? user.count+'次体验' : '首次体验'}}</div>
          <div class="cell table-td"><span class="number">{{formatDate(user.signInTime)}}</span></div>
        </div>
      </transition-group>

    </div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    isEnterFaceScore: {
      type: Boolean,
      default: false
    }
  },

  filters: {
    age(val) {
      if (val < 18) {
        val = 18;
      }
      return val;
    }
  },

  methods: {
    onTest() {
      this.data.push({});
    },
    formatDate(strDate) {
      if (!strDate) {
        return '';
      }
      return utils.format(new Date(strDate), 'MM/DD HH:mm', 8);
    }
  }
};
</script>

<style lang="less" scoped>
.table-div {
  width: 100%;
  height: 100%;
  background-image: url('../../../asserts/images/face-score/table-bg.png');
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: contain;
  .leftTop {
    width: 134px;
    height: 42px;
    position: absolute;
    top: -7px;
    left: -6px;
    z-index: 1;
  }
  .rightTop {
    width: 134px;
    height: 42px;
    position: absolute;
    right: -6px;
    top: -7px;
    z-index: 1;
  }

  .table-head {
    padding: 39px 0 0 16px;
    font-size: 18px;
    vertical-align: middle;
    font-size: 18px;
    font-family: 'PingFangSC-Regular';
    font-weight: 400;
    color: rgba(124, 250, 255, 1);
    line-height: 25px;
    text-align: center;
  }
  .table-body {
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    font-family: 'PingFangSC-Regular';
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    margin-top: 15px;
  }

  .face-table {
    display: table;
    width: 100%;
    .row {
      display: table-row;
    }

    .cell {
      display: table-cell;
      min-width: 45px;
    }

    .table-td {
      padding-bottom: 22px;
      vertical-align: middle;
      font-size: 14px;
      text-align: center;
      .right {
        text-align: right;
        width: 50px;
        display: inline-block;
        margin-left: -23px;
        white-space: nowrap;
      }
      .left {
        text-align: left;
      }
    }
    .color {
      color: rgba(124, 250, 255, 1);
    }

    .aevter {
      width: 58px;
      height: 58px;
      border-radius: 100%;
    }
    .row:first-child .aevter {
      width: 66px;
      height: 66px;
      border: 4px solid #7cfaff;
      box-sizing: border-box;
    }
  }
}
</style>
