<template>
  <div class="visisted">
    <div class="filters">
      <el-form ref="query" :model="form" inline @submit.native.prevent="$refs.table.search()" :disabled="!ready">
        <el-form-item label="应用">
          <app-select
            v-model="form.appId"
            placeholder="请选择应用"
            auto-select-first
            @change="handleReady"
          ></app-select>
        </el-form-item>
        <el-form-item label="浏览来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入浏览来源"></el-input>
        </el-form-item>
        <el-form-item label="浏览时间" prop="dateRange">
          <date-range-picker v-model="form.dateRange" type="daterange"></date-range-picker>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <fat-table ref="table" :state="form" :fetch-handler="handleFetch" :fetch-on-mounted="false">
        <el-table-column label="浏览时间" v-slot="{ row }">
          {{ row.browseTime | dateTimeFormat }}
        </el-table-column>
        <el-table-column label="浏览商品" v-slot="{ row }">
          <el-tooltip effect="dark" :content="row.itemName" placement="top">
            <div class="browse-box">
              <div class="browse-img">
                <img :src="row.thumbnail" />
              </div>
              <div class="browse-desc">
                {{ row.itemName }}
              </div>
            </div>
          </el-tooltip>
        </el-table-column>
        <el-table-column label="浏览来源" prop="source"></el-table-column>
        <el-table-column label="金额" v-slot="scope">
          {{ scope.row.amount | price }}
        </el-table-column>
        <el-table-column label="浏览次数" prop="browseCount"></el-table-column>
        <el-table-column label="加购次数" prop="addCartCount"></el-table-column>
        <el-table-column label="下单次数" prop="uniferOrderCount"></el-table-column>
        <el-table-column label="支付次数" prop="payResultCount"></el-table-column>
      </fat-table>
    </div>
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import AppSelect from '@/business-common/components/app-select';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import api from '@/mod-member/src/api/memberAPI';

  export default {
    name: 'Visisted',
    components: {
      AppSelect,
      FatTable,
      DateRangePicker,
    },
    props: {
      info: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        ready: false,
        form: {
          source: null,
          appId: null,
          dateRange: null,
        },
      };
    },
    methods: {
      handleReady() {
        if (!this.ready) {
          this.ready = true;
          this.$refs.table.search();
        }
      },
      async handleFetch(params) {
        const { dateRange, ...other } = this.form;
        // 字段调整
        if (dateRange) {
          const [startCreateTime, endCreateTime] = dateRange;
          Object.assign(other, { startCreateTime, endCreateTime });
        }

        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          ...other,
          memberId: this.info.id,

          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.memberCenter.getVisisted(payload);

        return {
          list: data || [],
          total: totalCount,
        };
      },
    },
  };
</script>

<style scoped lang="less">
  .filters {
    padding: 20px;
  }

  .table {
    padding-bottom: 20px;
  }

  .browse-img img {
    @width: 70px;

    max-width: @width;
    max-height: @width;
  }

  .browse-desc {
    text-overflow: ellipsis;
    overflow: hidden;
    text-overflow: -o-ellipsis-lastline;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
