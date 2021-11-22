<template>
  <div class="lucky">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/lucky' }">幸运转盘</el-breadcrumb-item>
      <el-breadcrumb-item>抽奖记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="lucky-filter">
      <el-form inline class="wkt-opt-label-container">
        <el-form-item>
          <el-select clearable v-model="keyword.giftsName" placeholder="选择中奖结果" @change="onResultChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="keyword.userPhone"
            type="input"
            class="dss-filter-large-input"
            placeholder="搜索手机号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="single-search-btn" type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="recordList" style="width: 100%" class="wkt-table">
      <el-table-column align="center" prop="luckyDogName" label="抽奖者" />
      <el-table-column align="center" prop="luckyDogPhone" label="手机号" />
      <el-table-column align="center" prop="luckyTime" label="抽奖时间" />
      <el-table-column align="center" prop="luckyGiftName" label="中奖结果">
        <template slot-scope="scope">
          <p>{{ !scope.row.luckyCouponId && !scope.row.luckyPoints ? '未中奖' : scope.row.luckyGiftName }}</p>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="totalCount"
      :page-size="page.pageSize"
      :current-page="page.pageNo"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>

<script>
  import luckyApi from '@/dss-wechat3rd/src/api/lucky.js';
  export default {
    mounted() {
      this.keyword.luckyTurningId = this.$route.query.id;
      this.getRecordList();
      this.getGiftList();
    },
    data() {
      return {
        keyword: {
          giftsName: '',
          userPhone: '',
          luckyTurningId: 0,
        },
        totalCount: 0,
        page: {
          pageNo: 1,
          pageSize: 20,
        },
        options: [
          { label: '选择中奖结果', value: '' },
          { label: '未中奖', value: 'Unlucky' },
        ],
        recordList: [],
      };
    },
    methods: {
      getGiftList() {
        // 如果id有值为详细页面
        luckyApi.detail({ id: this.$route.query.id }).then(res => {
          (res.data.giftsList || []).forEach(item => {
            this.options.push({ label: item.giftName, value: item.giftName });
          });
        });
      },
      onResultChange(e) {
        console.log('onResultChange', this.keyword);
        this.getRecordList();
      },
      onSearch(e) {
        this.getRecordList();
      },
      getRecordList() {
        luckyApi.record.list({ ...this.keyword, ...this.page }).then(res => {
          this.recordList = res.data;
          this.totalCount = res.totalCount;
          this.page.pageSize = res.pageSize;
          this.page.pageNo = res.pageNo;
        });
      },
      onSizeChange(pageSize) {
        this.page.pageSize = pageSize;
        this.page.pageNo = 1;
        this.getRecordList();
      },
      onPageChange(page) {
        this.page.pageNo = page;
        this.getRecordList();
      },
    },
  };
</script>

<style></style>
