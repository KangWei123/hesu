<template>
  <div class="filter-box" v-loading="loading">
    <div class="filter-tab">
      <span class="filter-label">时间</span>
      <el-date-picker
        class="dss-filter-input"
        size="mini"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="至"
        :picker-options="pickerOptions"
        v-model="filterParams.date"
        @change="onFilter"
      ></el-date-picker>
    </div>

    <!-- 门店选择 -->
    <div class="filter-tab">
      <el-select v-model="filterParams.storeId" filterable placeholder="请选择门店" @change="onFilter">
        <el-option v-for="item in storeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </div>

    <!-- 部门选择 -->
    <div class="filter-tab">
      <el-cascader
        placeholder="请选择部门"
        @visible-change="val => val || onFilter()"
        :show-all-levels="false"
        :change-on-select="true"
        :options="departmentOptons"
        v-model="filterParams.departmentIds"
      />
      <!-- <el-select v-model="filterParams.departmentId"
                 filterable
                 placeholder="请选择部门"
                 @change="onFilter">
        <el-option v-for="item in departmentOptons"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select> -->
    </div>

    <!-- 状态选择 -->
    <div class="filter-tab">
      <el-select v-model="filterParams.applyStatus" filterable placeholder="请选择" @change="onFilter">
        <el-option v-for="item in applyStatusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="filter-tab">
      <el-input
        class="filter-input"
        size="mini"
        placeholder="员工名字搜索"
        v-model="filterParams.name"
        maxlength="30"
      ></el-input>
    </div>

    <!-- 手机号码 -->
    <div class="filter-tab">
      <el-input
        size="mini"
        class="order-search"
        v-model.trim="filterParams.phone"
        @input="checkFilterParam('phone', 11)"
        placeholder="请输入手机号码"
      ></el-input>
    </div>

    <el-button type="primary" size="mini" class="search-btn" @click="onFilter">搜索</el-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import utils from '@/dss-common/utils';
  import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';

  export default {
    name: 'StaffFilter',

    data() {
      return {
        loading: false,

        filterParams: {
          date: null, // 时间
          storeId: null, // 门店id
          applyStatus: null, // 审核状态
          departmentIds: null,
          name: null, // 员工名字
          phone: null, // 员工手机号码
        },

        // 日期时间选择选项
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },

        storeOptions: [], // 门店列表选择项

        departmentOptons: [],

        // 状态列表选择项
        applyStatusOptions: [
          { label: '全部', value: null },
          { label: '待审核', value: 0 },
          { label: '已通过', value: 1 },
          { label: '已冻结', value: 2 },
          { label: '已拒绝', value: -1 },
        ],
      };
    },

    computed: {
      ...mapState({
        userInfo: state => state.userInfo,
      }),
    },

    mounted() {
      this.getStoreList(); // 获取该商户下所有门店列表
      this.getDepartmentOptons();
    },
    methods: {
      // 校验输入字段搜索进行实时模糊查询(不包括字段校验)
      checkFilterParam(param, maxlength) {
        // 参数存在，且最大长度为maxlength，所以截取maxlength个字符
        if (this.filterParams[param] && this.filterParams[param].length > maxlength) {
          this.filterParams[param] = this.filterParams[param].substr(0, maxlength);
        }
      },

      /**
       * 获取该商户下所有门店列表
       */
      getStoreList() {
        const storeInfo = {
          per_chooseAppId: this.userInfo.appInfo.id,
          per_chooseEpId: this.userInfo.appInfo.epId,
        };
        const params = {
          storeInfo,
        };
        distributionApi.queryStoreList(params).done(res => {
          if (res.data) {
            res.data.forEach(e => {
              this.storeOptions.push({
                value: e.id,
                label: e.name,
              });
            });
            this.storeOptions.unshift({
              value: null,
              label: '全部门店',
            });
          }
        });
      },

      /**
       * 改变查询条件通知父组件进行查询
       */
      onFilter() {
        const filterParams = { ...this.filterParams };

        // 时间
        if (filterParams.date) {
          filterParams.startDate = utils.timeFormat(filterParams.date[0], 'YYYY-MM-DD');
          filterParams.endDate = utils.timeFormat(filterParams.date[1], 'YYYY-MM-DD');
        }

        delete filterParams.date; // 删除未转化的日期对象

        // 循环删除查询条件中为空的参数
        Object.keys(filterParams).forEach(key => {
          if (filterParams[key] === null || filterParams[key] === '') {
            delete filterParams[key];
          }
        });
        this.$emit('filter', filterParams);
      },

      async getDepartmentOptons() {
        const { data } = await distributionApi.queryOrg();
        const _data = (data || []).map(i => ({ ...i, label: i.name, value: i.id }));
        this.departmentOptons = this.genTreeData(
          _data.filter(d => !d.upperOrgId),
          _data
        );
        const genIdsVal = node => {
          node.value = this.genDepartmentIds(node).join(',');
          if (node.children) {
            node.children.forEach(c => genIdsVal(c));
          }
        };

        this.departmentOptons.forEach(genIdsVal);

        this.departmentOptons.unshift({
          value: null,
          label: '全部部门',
        });
      },

      genTreeData(nodeArr, data) {
        const res = nodeArr.map(node => {
          const children = this.genTreeData(
            data.filter(d => {
              return d.upperOrgId === node.id;
            }),
            data
          );
          return { ...node, children: children && children.length ? children : null };
        });
        return res;
      },

      flatten(arr) {
        return arr.reduce((pre, cur) => {
          if (cur instanceof Array) {
            pre.push(...this.flatten(cur));
          } else {
            pre.push(cur);
          }
          return pre;
        }, []);
      },

      genDepartmentIds(node) {
        if (!node) return [];
        const ids = [node.id, ...(node.children || []).map(this.genDepartmentIds)];
        return this.flatten(ids);
      },
    },
  };
</script>
