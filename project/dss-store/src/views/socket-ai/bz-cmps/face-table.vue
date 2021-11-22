
<template>
  <div class="table-div">
    <div class="title">实时客流</div>
    <div class="table-body">
      <transition-group name="vuelist"
                        tag="div"
                        class="face-table"
                        key="table">
        <div class="row table-thead"
             key="tr-row">
          <div class="cell table-th">图像</div>
          <div class="cell table-th">&nbsp;&nbsp;性别&nbsp;&nbsp;</div>
          <div class="cell table-th">&nbsp;&nbsp;年龄&nbsp;&nbsp;</div>
          <div class="cell table-th">到店次数</div>
          <div class="cell table-th">是否会员</div>
          <div class="cell table-th">新/老客户</div>
          <div class="cell table-th">到店时间</div>
        </div>

        <div class="row"
             v-for="(user) in data"
             :key="user.idStr">
          <div class="cell table-td"
               :data-id="user.idStr">
            <img class="aevter"
                 :src="user.faceImgUrl" />
          </div>
          <div class="cell table-td">{{user.faceGender === 1 ? '男': '女'}}</div>
          <div class="cell table-td"><span class="right">{{user.faceAge|age}}
            </span>
          </div>
          <div class="cell table-td">{{user.count}}</div>
          <div class="cell table-td">{{user.vip === 0 ? '否': '是'}}</div>
          <div class="cell table-td">{{user.count > 1 ? '老客户' : '新客户'}}</div>
          <div class="cell table-td">{{formatDate(user.updateTime)}}</div>
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
    }
  },

  filters: {
    age(val) {
      if (val < 18) {
        val = '< ' + 18;
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
  overflow: hidden;
  background: linear-gradient(90deg, rgba(29, 35, 71, 1) 0%, rgba(29, 70, 67, 1) 100%);
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: white;

  .title {
    text-align: center;
    background: rgba(255, 255, 255, 0.0232);
    height: 40px;
    line-height: 40px;
    margin-bottom: 28px;
    font-size: 22px;
    color: rgba(50, 255, 234, 1);
  }

  .table-body {
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }

  .face-table {
    display: table;
    width: 100%;

    .row {
      display: table-row;
    }

    .cell {
      display: table-cell;
    }

    .cell,
    .row {
      text-align: center;
    }

    .table-td {
      padding-top: 31px;
      padding-bottom: 9px;
      vertical-align: middle;
      font-size: 24px;
      .right {
        text-align: right;
        width: 50px;
        display: inline-block;
        margin-left: -23px;
        white-space: nowrap;
      }
    }

    .table-thead {
      font-size: 18px;
      vertical-align: middle;
    }

    .table-th {
      height: 30px;
      line-height: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .table-cell {
      padding-top: 31px;
      vertical-align: middle;
      display: table-cell;
      height: 0.5rem;
    }

    .aevter {
      width: 50px;
      height: 50px;
      border-radius: 4px;
    }
  }
}
</style>
