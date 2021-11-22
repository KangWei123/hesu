<template>
  <div class="account">
    <header :class="`account__header ${headerClass}`">
      <div class="account__col center">
        <div class="account__main-num">
          <slot name="main" :data="data"></slot>
        </div>
        <div class="account__desc">{{ title }}</div>
      </div>
      <div class="account__col right">
        <div class="account__link" v-if="detailsName" @click="switchTab(detailsName)">
          明细 <i class="el-icon-arrow-right" />
        </div>
        <div class="account__desc"><slot name="expireDate" :data="data"></slot></div>
      </div>
    </header>
    <main class="account__content">
      <div class="account__item" v-for="item of fields" :key="item.name">
        <div class="account__sub-num">{{ getValue(item) }}</div>
        <div>{{ item.name }}</div>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    inject: ['switchTab'],
    props: {
      title: {
        type: String,
        default: '',
      },
      headerClass: {
        type: String,
        default: '',
      },
      fields: {
        type: Array,
        default: () => [],
      },
      getData: {
        type: Function,
        required: true,
      },
      detailsName: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        data: {},
      };
    },
    mounted() {
      this.getData().then(({ data }) => (this.data = data || {}));
    },
    methods: {
      getValue(item) {
        let value = (typeof item.key === 'function' ? item.key(this.data) : this.data[item.key]) || 0;
        if (item.unit === '元') {
          value = value ? (value / 100).toFixed(2) : '0.00';
        }

        return `${value} ${item.unit || ''}`;
      },
    },
  };
</script>

<style lang="less" scoped>
  .account {
    flex-basis: 305px;
    padding: 0 13px;
    flex: 1;

    &:not(:last-child) {
      border-right: 1px solid #dfe3e8;
    }

    &__header {
      background-color: #fff0db;
      padding: 11px;
      border-radius: 4px;
      display: flex;

      &.blue {
        background-color: #dbeeff;
      }

      &.green {
        background-color: #e5f5dd;
      }
    }

    &__col {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &.center {
        align-items: center;
      }

      &.right {
        align-items: flex-end;
        flex-basis: 34%;
      }
    }

    &__main-num {
      font-size: 28px;
      color: #303133;
      white-space: nowrap;

      & > span {
        font-size: 14px;
      }
    }

    &__desc {
      white-space: nowrap;
      font-size: 14px;
      color: #303133;
    }

    &__content {
      display: grid;
      grid-template-columns: 33.33% 33.33% 33.33%;
    }

    &__item {
      font-size: 14px;
      color: #717378;
      padding: 15px 8px;
      text-align: center;
    }

    &__link {
      color: #1890ff;
      cursor: pointer;
    }

    &__sub-num {
      font-size: 16px;
      color: #303133;
      margin-bottom: 3px;
    }
  }
</style>
