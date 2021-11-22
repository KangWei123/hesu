<template>
  <div class="main-container">
    <div class="header">
      <div class="avatar-box">
        <img class="avatar-icon" :src="logo" />
        <div class="desc">
          <span>{{ userInfo.userPhone || userInfo.userName }}</span>
          <span>欢迎回来！</span>
        </div>
      </div>
      <!-- todo 暂时不做 -->
      <!-- <div class="search">
         <el-input placeholder="搜索企业" prefix-icon="el-icon-search" v-model="searchValue" />
      </div> -->
    </div>

    <div class="content">
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane v-for="tab in tabsList" :key="tab.key" :label="tab.value" :name="tab.key" />
      </el-tabs>
      <div class="card-container">
        <div
          v-for="seller in sellerList"
          :key="seller.id"
          @click="handleChoose(seller.id, seller.employeeId)"
          class="card"
        >
          <div class="title">
            {{ industryEnum.get(seller.industryKey) }}
          </div>
          <div class="card-content">
            <p class="name">{{ seller.name }}</p>
            <p class="gray">有效期至：{{ seller.expireTime }}</p>
            <div class="role gray">
              <label>角色：</label>
              <div class="orange role-name limit-line line-2">
                {{ seller.employeePosition || '-' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/dss-common/style/base.less';
  import logo from '@/dss-common/img/avatar-orange.png';
  import industryEnum from './industryEnum.js';
  import { mapState } from 'vuex';
  import api from '@/business-common/api/epApi.js';

  export default {
    name: 'EnterpriseIndex',
    computed: {
      ...mapState({
        userInfo: 'userInfo',
      }),
      tabsList() {
        const list = this.userInfo.sellerAppInfoVOList;
        const seen = new Map();

        if (list && list.length !== 0) {
          const data = list
            .map(item => {
              return {
                key: item.industryKey,
                value: industryEnum.get(item.industryKey),
              };
            })
            .filter(val => !seen.has(val.key) && seen.set(val.key, 1));

          data.unshift({
            key: 'all',
            value: '全部行业',
          });

          return data;
        }
        return [];
      },
    },
    data() {
      return {
        api,
        industryEnum,
        activeName: 'all',
        logo,
        searchValue: '',
        sellerList: [],
      };
    },
    methods: {
      handleClickTab(e) {
        if (e.name === 'all') {
          this.sellerList = this.$plain(this.userInfo.sellerAppInfoVOList);
          return;
        }

        this.sellerList = this.userInfo.sellerAppInfoVOList.filter(item => item.industryKey === e.name);
      },

      handleChoose(employeeChooseAppId, employeeId) {
        const params = {
          employeeChooseAppId: employeeChooseAppId,
          employeeId: employeeId,
        };
        api.chooseEp(params).then(res => {
          if (res.data.appInfo) {
            window.top.location.href = '/wkb.html';
          }
        });
      },
    },
    mounted() {
      this.sellerList = this.$plain(this.userInfo.sellerAppInfoVOList);
    },
  };
</script>

<style lang="less">
  @common-color: #ff6b41;
  .main-container {
    .el-tabs__item.is-active {
      color: @common-color;
    }

    .el-tabs__item:hover {
      color: @common-color;
    }

    .el-tabs__active-bar {
      background-color: @common-color;
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
</style>

<style lang="less" scoped>
  .main-container {
    padding-top: 55px;

    .header {
      width: 1010px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      margin-bottom: 21px;
    }

    .avatar-box {
      display: flex;
      align-items: center;
      margin-right: 372px;

      .avatar-icon {
        width: 48px;
        height: 48px;
        margin-right: 10px;
      }

      .desc {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: @ui-font-color-black;
        line-height: 22px;
      }
    }

    .search {
      width: 400px;
    }

    .content {
      width: 1080px;
      min-height: 600px;
      margin: 0 auto;
      background: rgba(245, 247, 250, 1);
      padding: 24px 40px;
      display: flex;
      flex-direction: column;
    }

    .card-container {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .card {
      position: relative;
      width: 235px;
      height: 156px;
      padding: 20px;
      margin-right: 20px;
      border-radius: 4px;
      border: 1px solid rgba(230, 230, 230, 1);
      font-size: 14px;
      box-sizing: border-box;
      background-color: #fff;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        border: 1px solid rgba(240, 99, 28, 1);
        box-shadow: 0px 10px 12px 0px rgba(0, 0, 0, 0.1);
      }

      .title {
        position: absolute;
        top: -1px;
        right: 0;
        width: 56px;
        height: 27px;
        line-height: 27px;
        background: rgba(240, 115, 41, 1);
        border-radius: 0px 4px 0px 10px;
        text-align: center;
        color: #fff;
        font-size: 14px;
      }

      .disable-gray-title {
        background: rgba(213, 218, 226, 1);
      }

      .name {
        color: @ui-font-color-black;
      }

      .role {
        display: flex;
        flex-direction: row;

        label {
          width: 48px;
        }

        .role-name {
          width: 165px;
          height: 40px;
        }
      }

      .gray {
        color: #909399;
      }
    }

    .orange {
      color: #f07329;
    }

    .disable-gray-bg {
      background-color: #f0f2f5;
    }

    .card.disable-gray-bg:hover {
      border: 1px solid rgba(230, 230, 230, 1);
    }
  }
</style>
