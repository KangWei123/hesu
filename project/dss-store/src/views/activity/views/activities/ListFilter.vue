<template>
  <!--过滤器-->
  <div class="activity-list-filter">
    <!--搜索条件-->
    <el-form :inline="true">
      <el-form-item>
        <single-store-selector :with-all="true" @select-store="onStoreSelected"></single-store-selector>
      </el-form-item>
      <el-form-item>
        <!--日期-->
        <shortcut-date-picker @pick="onDateSelected"></shortcut-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary-light" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!--右侧操作按钮-->
    <div class="filter-right">
      <el-button type="primary" round size="small" @click="addActivity">+ 新建活动</el-button>
    </div>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils';
  import SingleStoreSelector from '../../components/SingleStoreSelector';
  import ShortcutDatePicker from '../../components/ShortcutDatePicker';

  export default {
    name: 'ListFilter',
    components: {
      SingleStoreSelector,
      ShortcutDatePicker
    },

    data() {
      return {
        dateRange: null,
        /** 查询条件 */
        query: {
          storeId: '',
          startTime: '',
          endTime: ''
        }
      };
    },
    methods: {
      search() {
        this._postFilterEvent();
      },

      addActivity() {
        this.$router.push('/activity/create');
      },

      onStoreSelected(storeId) {
        this.query.storeId = storeId;
      },

      onDateSelected(dateRange) {
        this.dateRange = dateRange;
      },

      _postFilterEvent() {
        if (this.dateRange) {
          this.query.startTime = utils.timeFormat(this.dateRange[0], 'YYYY-MM-DD');
          this.query.endTime = utils.timeFormat(this.dateRange[1], 'YYYY-MM-DD');
        }
        this.$emit('filter', this.$plain(this.query));
      }
    },

    mounted() {
      this.$nextTick(function() {
        this._postFilterEvent();
      });
    }
  };
</script>

<style lang="less">
  .activity-list-filter {
    display: flex;

    .filter-right {
      margin-left: auto;
    }

    .el-form--inline {
      .el-form-item {
        margin-right: 20px;
      }
    }

    .el-form-item__content {
      > .el-select {
        .el-input {
          .el-input__inner {
            background: transparent;
            border: 2px solid rgba(1, 35, 52, 0.1);
            color: rgba(1, 35, 52, 1);
            font-size: 14px;

            &:focus {
              border: 2px solid rgba(1, 35, 52, 0.2);
            }
          }
        }
      }

      > .el-input {
        background-color: none;
        box-shadow: none;

        .el-input__inner {
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(1, 35, 52, 0.1);
          border-radius: 0;
          color: rgba(1, 35, 52, 1);
          font-size: 14px;

          &::placeholder {
            color: rgba(1, 35, 52, 0.5);
          }

          &:focus {
            border-color: rgba(1, 35, 52, 0.2);
            color: rgba(1, 35, 52, 1);
          }
        }
      }
    }
  }
</style>
