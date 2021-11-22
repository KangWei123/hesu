<template>
  <div class="activity-selector">
    <el-select
      v-model="currentActivity"
      placeholder="请选择活动"
      :disabled="disabled"
      filterable>
      <el-option
        v-for="item in activities"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'ActivitySelector',
    model: {
      prop: 'currentActivity'
    },

    props: {
      disabled: {
        type: Boolean,
        default: true
      },
      defaultActivity: {
        type: Number,
        default: null
      },
      activities: {
        type: Array,
        default: function() {
          return null; //[{id,name},...]
        }
      }
    },

    data() {
      return {
        currentActivity: null
      };
    },

    watch: {
      defaultActivity(newVal, oldVal) {
        if (newVal) {
          this.currentActivity = newVal;
        }
      },
      currentActivity(newVal, oldVal) {
        if (newVal) {
          this.$emit('input', newVal);
        }
      }
    }
  };
</script>

<style lang="less">
  .activity-selector {
    display: inline-block;

    .el-select {
      background: transparent;

      .el-input__inner {
        background: none;
      }
    }
  }
</style>
