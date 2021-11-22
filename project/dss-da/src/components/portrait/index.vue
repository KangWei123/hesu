<template>
  <div class="dsp-portrait">
    <dsp-title text="">
      <template slot="right">
        <!--广告计划下拉框-->
        <plan-unit-select v-model="unitId"></plan-unit-select>
        <!--日期-->
        <el-date-picker v-model="dateRange"
                        type="daterange"
                        size="small"
                        align="right"
                        :clearable="false"
                        range-separator="至"
                        style="width: 244px"
                        :picker-options="$element.pickerOptions">
        </el-date-picker>
        <!--下载-->
        <el-button class="dsp-circle"
                   icon="el-icon-download"
                   round></el-button>
      </template>
    </dsp-title>

    <el-tabs v-model="curTab"
             class="dsp-full">
      <el-tab-pane label="性别分布"
                   :name="TYPE_ENUM.gender.key"></el-tab-pane>
      <el-tab-pane label="年龄分布"
                   :name="TYPE_ENUM.age.key"></el-tab-pane>
      <el-tab-pane label="兴趣分布"
                   :name="TYPE_ENUM.hobby.key"></el-tab-pane>
      <el-tab-pane label="省级地域"
                   :name="TYPE_ENUM.province.key"></el-tab-pane>
      <el-tab-pane label="地级市"
                   :name="TYPE_ENUM.city.key"></el-tab-pane>
    </el-tabs>

    <bar :data="data && data[type.key]"></bar>

    <dsp-title text="受众明细"></dsp-title>
    <data-table :data="data && data[type.key]"></data-table>
  </div>
</template>

<script>
import './style.less';
import api from './common/api';
import PlanUnitSelect from './plan-unit-select.vue';
import Bar from './bar';
import DataTable from './table';
import service from '@/dss-common/utils/services';

/** 类型枚举 */
const TYPE_ENUM = {
  gender: {
    // data.gender
    key: 'gender',
    // 接口需要的参数
    params: '性别'
  },
  age: {
    key: 'age',
    params: '年龄'
  },
  hobby: {
    key: 'hobby',
    params: '兴趣'
  },
  province: {
    key: 'province',
    params: 'province'
  },
  city: {
    key: 'city',
    params: 'city'
  }
};

const DATA_RANGE_PAGE_LIFE = [new Date('2018/7/1'), new Date('2018/8/31')];

export default {
  name: 'Portrait',
  components: { PlanUnitSelect, Bar, DataTable },
  data() {
    return {
      TYPE_ENUM,
      /** 选中的Tab类型 */
      type: TYPE_ENUM.gender,

      /** 时间范围，默认最近30天 */
      /*dateRange: [
        new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30),
        new Date()
      ],*/
      dateRange: [DATA_RANGE_PAGE_LIFE[0], DATA_RANGE_PAGE_LIFE[1]], //test code
      /** 接口数据 */
      data: {
        [TYPE_ENUM.gender.key]: null,
        [TYPE_ENUM.age.key]: null,
        [TYPE_ENUM.hobby.key]: null,
        [TYPE_ENUM.province.key]: null,
        [TYPE_ENUM.city.key]: null
      },

      unitId: null
    };
  },
  created() {
    if (this.$route.query.uid) {
      this.unitId = this.$route.query.uid;
    }
  },
  computed: {
    curTab: {
      get() {
        return this.type.key;
      },
      set(val) {
        this.type = Object.entries(TYPE_ENUM).find(item => item[1].key === val)[1];
      }
    }
  },
  watch: {
    dateRange(newVal) {
      if (!!newVal && newVal.length === 2) {
        DATA_RANGE_PAGE_LIFE[0] = newVal[0];
        DATA_RANGE_PAGE_LIFE[1] = newVal[1];
      }
      this.fetchData();
    },
    type() {
      this.fetchData();
    },
    // <PlanUnitSelect> 会默认触发v-model，所以页面进来会首先执行此函数
    unitId() {
      this.fetchData();
    }
  },
  methods: {
    fetchData() {
      /*const params = {
                url: api.portrait.list,
                cache: true,
                fromCache: true,
                data: {
                    stime: this.$utils.date.format('yyyy-MM-dd', this.dateRange[0]),
                    etime: this.$utils.date.format('yyyy-MM-dd', this.dateRange[1]),
                    pageNum: 1,
                    pageSize: 1000,
                    tag: this.type.params,
                    unitId: this.unitId
                }
            };*/

      const params = {
        stime: this.$utils.timeFormat(this.dateRange[0], 'YYYY-MM-DD'),
        etime: this.$utils.timeFormat(this.dateRange[1], 'YYYY-MM-DD'),
        pageNum: 1,
        pageSize: 1000,
        tag: this.type.params,
        unitId: this.unitId
      };

      this.data[this.type.key] = null;

      if (this.unitId && this.unitId > 0) {
        // 这里的请求缓存
        return service
          .get(api.portrait.list, {
            action: '获取受众分析列表',
            params
          })
          .then(result => {
            this.data[this.type.key] = this.$utils.data.dataMapping(result.value.list, {
              // 统一x轴取值字段
              type: 'name',
              city: 'name',
              province: 'name'
            });
          })
          .catch(() => {
            this.data[this.type.key] = [];
          });
      }
    }
  }
};
</script>
