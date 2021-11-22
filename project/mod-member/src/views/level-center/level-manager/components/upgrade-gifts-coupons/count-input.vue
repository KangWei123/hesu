<template>
  <div class="box">
    <el-input
      type="number"
      v-model.number="row.count"
      min="1"
      :max="max"
      :class="{ error: isDirty && isError }"
      :style="{ width: '96px' }"
      :disabled="!(isSelect && isValid)"
      @input="onInput($event, row)"
    ></el-input>
    <template v-if="isDirty && isError">
      <div v-if="!row.count && row.count !== 0" class="el-form-item__error">不能为空</div>
      <div v-else-if="row.count <= 0" class="el-form-item__error">必须大于0</div>
      <div v-else-if="row.count > max" class="el-form-item__error">不能大于{{ max }}</div>
    </template>
  </div>
</template>

<script>
  import { calcMaxCount, validateCount, event } from '../../utils';
  import couponEnum from '@/mod-member/src/enum/couponEnum';

  export const SET_COUNT_DIRTY = 'SET_COUNT_DIRTY';

  export default {
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      selectedIds: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        isDirty: false,
      };
    },
    created() {
      event.$on(SET_COUNT_DIRTY, dirty => this.isSelect && (this.isDirty = dirty));
    },
    destroyed() {
      event.$off(SET_COUNT_DIRTY);
    },
    computed: {
      row() {
        return this.data;
      },
      id() {
        return this.row.couponId;
      },
      isSelect() {
        return this.selectedIds.includes(this.id);
      },
      max() {
        return calcMaxCount(this.row);
      },
      isError() {
        return !validateCount(this.row);
      },
      isValid() {
        return this.row.status === couponEnum.status.VALID;
      },
    },
    watch: {
      isSelect(value) {
        value || (this.isDirty = false);
      },
    },
    methods: {
      onInput(value, row) {
        if (value.includes('.')) {
          value = +value.split('.')[0];
          row.count = isNaN(value) ? 0 : value;
        }

        this.isDirty = true;
      },
    },
  };
</script>

<style lang="less" scoped>
  .error /deep/ .el-input__inner {
    border-color: #f56c6c;
  }

  .box {
    margin: 16px 0;
    position: relative;
  }
</style>
