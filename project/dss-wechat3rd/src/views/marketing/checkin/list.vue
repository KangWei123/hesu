<template>
  <div class="checkin">
    <div class="Add-Manage-Button">
      <div class="switch-container">
        <span style="color: #717378">是否启用：</span>
        <div class="block-switch" @click="onToggle"></div>
        <el-switch :width="53" active-color="#52C41A" inactive-color="#B1B5BD" v-model="isEnable"></el-switch>
        <span class="statusTip Show" v-if="isEnable">开启</span>
        <span class="statusTip hidden" v-else>关闭</span>
      </div>

      <el-button @click="gotoSetting" type="primary">签到设置</el-button>
    </div>

    <div class="checkin-filter">
      <el-form inline @submit.native.prevent class="wkt-opt-label-container">
        <el-form-item label="号码搜索：">
          <el-input
            v-model="keyword.signedUserPhone"
            type="input"
            prefix-icon="el-icon-search"
            class="dss-filter-large-input"
            placeholder="搜索手机号"
          ></el-input>
        </el-form-item>
        <el-button class="single-search-btn" type="primary" @click="onSearch">搜索</el-button>
      </el-form>
    </div>
    <div class="checkin-list" v-loading="loading">
      <el-table :data="checkinData" class="wkt-table" v-loading="listLoading">
        <el-table-column align="center" label="签到用户">
          <template slot-scope="scope">
            <div class="header-user">
              <img :src="scope.row.signedUserPhotoUrl" alt="no image " />
              <p style="padding-left: 5px">{{ scope.row.signedUserName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="signedUserPhone" label="手机号" />
        <el-table-column
          align="center"
          :formatter="allSignedCountformater"
          prop="allSignedCount"
          label="累计签到天数"
        />
        <el-table-column align="center" :formatter="allAwardPointsformater" prop="allAwardPoints" label="奖励总积分" />
        <el-table-column
          align="center"
          :formatter="allAwardCouponNumformater"
          prop="allAwardCouponNum"
          label="奖励优惠券数量"
        />
      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="page.pageSize"
                     :current-page="page.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"></el-pagination> -->
      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        layout="sizes, prev, pager, next"
        :total="totalCount"
      >
      </el-pagination>
      <!-- <edit ref="edit" /> -->
    </div>
  </div>
</template>

<script>
  import checkinApi from '@/dss-wechat3rd/src/api/checkin.js';
  import '@/dss-wechat3rd/src/views/marketing/marketing.less';

  export default {
    data() {
      return {
        signedDetailId: null,
        // 是否启用：
        isEnable: false,
        checkinData: [],
        totalCount: 0,
        loading: false,
        listLoading: false,
        page: {
          pageNo: 1,
          pageSize: 10,
        },

        // 搜索手机号
        keyword: {
          signedUserPhone: '',
        },
        // downloadUrl,
        typeName: '二维码',
        api: checkinApi,
        options: [
          {
            value: '选择分享奖励',
            label: '选择分享奖励',
          },
          {
            value: '积分',
            label: '积分',
          },
          {
            value: '优惠券',
            label: '优惠券',
          },
        ],
      };
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.initSetting(); // 初始化设置
      });
    },

    methods: {
      onSizeChange(e) {
        this.page.pageSize = e;
        this.getlist();
      },
      initSetting() {
        this.loading = true;
        checkinApi
          .query()
          .then(res => {
            if (res.success) {
              const { id, activityStatus } = res.data || {};
              this.signedDetailId = id;

              // 判断是否启用
              this.isEnable = activityStatus === 1;

              if (id) {
                this.getlist();
                this.getInformMessage();
              }
            } else {
              console.log('checkinApi.query error');
            }
          })
          .always(_ => {
            this.loading = false;
          });
      },
      // 获取提示给商家的信息，如优惠券过期等
      getInformMessage() {
        checkinApi.getInformMessage().done(res => {
          console.log(res);
          if (res.data) {
            this.$notify({
              title: '提示',
              message: res.data,
              duration: 3000,
            });
          }
        });
      },

      onPageChange(e) {
        this.page.pageNo = e;
        this.getlist();
      },

      getlist() {
        this.listLoading = true;
        checkinApi
          .list({
            pageNo: this.page.pageNo,
            pageSize: this.page.pageSize,
            signedUserPhone: this.keyword.signedUserPhone,
            signedDetailId: this.signedDetailId,
          })
          .then(res => {
            this.checkinData = res.data;
            this.page.pageSize = res.pageSize;
            this.page.pageNo = res.pageNo;
            this.totalCount = res.totalCount;
          })
          .always(_ => {
            this.listLoading = false;
          });
      },
      onSearch() {
        this.page.pageNo = 1;
        this.getlist();
      },
      onToggle() {
        if (!this.signedDetailId) {
          this.$message.error('开启签到失败：未对签到规则进行设置，请到“签到设置”中进行配置');
          return false;
        }
        if (this.isEnable) {
          this.$confirm('关闭活动将会清空用户签到数据', '确定关闭', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              this.senderStatus(2);
            })
            .catch(() => {
              console.log('取消关闭');
            });
        } else {
          this.senderStatus(1);
        }
      },
      senderStatus(value) {
        checkinApi.change({ activityId: this.signedDetailId, openOrPending: value }).then(res => {
          if (res.success) {
            this.getlist();
            this.isEnable = value === 1;
          }
        });
      },
      // 跳转到签到设置页面
      gotoSetting() {
        this.$router.push(`/marketing/checkin/setting?isEnable=${this.isEnable}&signedDetailId=${this.signedDetailId}`);
      },
      // 累计签到格式化
      allSignedCountformater(row, column, cellValue, index) {
        return cellValue + '天';
      },
      // 奖励总积分格式化
      allAwardPointsformater(row, column, cellValue, index) {
        return cellValue + '分';
      },
      // 奖励优惠券格式化
      allAwardCouponNumformater(row, column, cellValue, index) {
        return cellValue + '张';
      },
      formatTableData(data) {
        return data.map(item => {
          const checkinUrl = item.qrSceneStr && JSON.parse(item.qrSceneStr).checkinUrl;
          let tagStr = '';
          item.categoryTagDTOList &&
            item.categoryTagDTOList.forEach(item => {
              const categoryName = item.categoryName;
              item.tagDTOList &&
                item.tagDTOList.forEach(item => {
                  tagStr += categoryName + ': ' + item.tag + '，';
                });
            });
          item.checkinUrl = checkinUrl;
          item.tagStr = tagStr || '无';
          return item;
        });
      },
      onDisabled(row) {
        const { status, id } = row;
        checkinApi
          .updated({
            ...row,
            status: 0,
          })
          .done(res => {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            const index = this.tableData.findIndex(item => item.id === id);
            this.tableData[index].status = 0;
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .checkin {
    padding: 0px;
    .Add-Manage-Button {
      display: flex;
    }
    .switch-container {
      display: flex;
      align-items: center;
      padding: 0;
      .statusTip {
        position: relative;
        z-index: 10;
        color: #fff;
        top: 1px;
        font-size: 12px;
      }
      .Show {
        right: 46px;
      }
      .hidden {
        right: 32px;
      }
    }
    .header-user {
      display: flex;
      justify-content: start;
      align-items: center;
    }

    // padding: 0 20px;
    .title {
      height: 50px;
      font-size: 20px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 50px;
    }

    .checkin-list {
      // padding: 20px 0;
      background: white;
      border-radius: 4px;
      margin-top: 16px;
      /deep/ .el-table {
        padding-top: 0px;
        th.is-leaf {
          border-top: none;
        }
      }
      img {
        width: 40px;
        height: 40px;
      }
    }

    .block-switch {
      position: absolute;
      top: 0;
      left: 50px;
      width: 100px;
      height: 30px;
      z-index: 2;
      cursor: pointer;
    }

    .checkin-filter {
      position: relative;
      background: #fff;
      padding-left: 20px;
      .el-input__inner {
        border-radius: 4px 0 0 4px;
      }

      .checkin-box {
        position: absolute;
        top: 30px;
        right: 20px;
      }

      .wkt-opt-label-container {
        box-shadow: none;
        padding-top: 16px;
        .el-form-item {
          display: inline-block;
          margin-right: 10px;
        }
      }
    }

    .el-table .disabled-checkin {
      color: #ccc;
      cursor: no-drop;
    }

    .el-table .disabled-checkin:hover {
      color: #ccc;
      cursor: no-drop;
    }
  }

  .checkin-list-tooltip-img {
    width: 150px;
  }
</style>
