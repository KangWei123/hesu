<template>
  <!--过滤器-->
  <el-form inline class="normal-filter" :model="filter" ref="filter">
    <el-form-item v-if="filterList.length && showLabel">
      <span class="list-title">搜索{{ goodsType.label }}</span>
    </el-form-item>

    <template v-for="(item, index) in filterList">
      <el-form-item v-if="!!item.type" :label="(item.showFormLabel && item.label) || ''" :key="index">
        <!-- 选择器 -->
        <el-select v-if="item.type == 'select'" v-model="filter[item.paramName]" :placeholder="'选择' + item.label">
          <el-option
            v-for="option in item.selectOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
          </el-option>
        </el-select>

        <!-- 搜索框 -->
        <el-input v-if="item.type == 'input'" :placeholder="item.label + '搜索'" v-model="filter[item.paramName]" />

        <!-- 搜索框 -->
        <store-select
          v-if="item.type == 'select-store'"
          :select-stores.sync="selectStores"
          :show-dept="isEnterManger"
          :show-store="!isEnterManger"
          class="store-select"
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
  import { mapState } from 'vuex';
  import storeSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

  export default {
    name: 'NormalFilter',
    components: { storeSelect },
    props: {
      goodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      // 是否显示过滤器label
      showLabel: {
        type: Boolean,
        default: true,
      },
      filterList: {
        type: Array,
        default() {
          return [];
          /** 示例：
           *[
           * {
           *    type: 'input',  //输入框类型
           *    paramName: 'title',  //接口请求参数名
           *    label: '文章标题'
           *  },
           *  {
           *    type: 'select', //选择器类型
           *    paramName: 'categroy',
           *    label: '图文分类',
           *    selectOptions: [  //选择项
           *      {label: '默认分类', value: '1'},
           *      {label: '分类一', value: '2'}
           *    ]
           *   }
           * ]
           */
        },
      },
    },

    data() {
      return {
        filter: {},
        selectStores: [],
      };
    },

    computed: {
      showStoreSelect() {
        return ['coupon'].includes(this.goodsType.type);
      },
      ...mapState({
        roleList: 'roleList',
      }),
      // key管/企业管理员享有相同权限
      isEnterManger() {
        return (
          !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
          !!~this.roleList.split(',').indexOf('common_role_admin')
        );
      },
    },

    watch: {
      filterList: {
        deep: true,
        handler(newVal, oldVal) {
          this.initFilter();
        },
      },
      filter: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.$emit('filter', this.$plain(this.filter));
        },
      },
      selectStores(newVal) {
        this.filter.storeIds = (newVal || []).join(',');
        this.$emit('filter', this.$plain(this.filter));
      },
    },
    methods: {
      initFilter() {
        const obj = {};
        if (this.filterList.length) {
          this.filterList.forEach(item => {
            obj[item.paramName] = '';
          });
          this.filter = obj;
        } else {
          this.filter = {};
        }
      },
    },
  };
</script>

<style lang="less">
  .normal-filter {
    text-align: left;
    padding-left: 20px;

    .list-title {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(32, 37, 44, 1);
      line-height: 19px;
      margin-right: 32px;
      font-weight: 600;
    }
  }
</style>
