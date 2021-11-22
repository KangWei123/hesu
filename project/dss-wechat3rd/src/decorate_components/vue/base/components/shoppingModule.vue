<template>
  <div>
    <div
      class="shopping-module"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        borderRadius: dataSource.radius + 'px',
      }"
    >
      <div class="shopping-info">
        <div class="name-box">
          <i class="el-icon-location-outline"></i>
          <div class="shopping-name limit-line-ellipsis" style="width: auto">
            {{ curStore && curStore.name }}
          </div>
        </div>
        <div class="address">
          <span>14.1km</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
      <div class="search">
        <i class="el-icon-search"></i>
        <span class="input-tips">搜索商户名称</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        wkLogo: '',
      };
    },
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
        curStore: 'curStore',
      }),
    },
  };
</script>
<style lang="less">
  .shopping-module {
    display: flex;
    align-items: center;
    position: relative;
    height: 60px;
    background-color: white;
    padding: 0 10px;

    .shopping-info {
      display: flex;
      align-items: center;
      height: 32px;
      padding: 0 6px 0 10px;
      background: #f4f4f4;
      border-radius: 15px 0 0 15px;

      .name-box {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #666;
        margin-right: 13px;
      }

      i {
        color: #717378;
        font-size: 16px;
      }

      .shopping-name {
        font-size: 13px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        margin-left: 5px;
      }

      .address {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #a8a8a8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        i {
          margin-left: 4px;
        }
      }
    }

    .search {
      display: flex;
      align-items: center;
      height: 32px;
      background: #f4f4f4;
      border-radius: 0 15px 15px 0;
      margin-left: 2px;
      width: 192px;
      padding: 0 16px;

      .input-tips {
        font-size: 13px;
        color: #999;
        margin-left: 6px;
      }
    }

    i {
      color: #b1b5bd;
    }
  }
</style>
