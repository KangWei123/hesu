<template>
  <el-checkbox-group v-model="permission">
    <el-checkbox v-for="item in options" :key="item.id" :label="Number(item.id)" :name="item.id">{{
      item.menuName
    }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  import { permissionMenu } from '@/dss-wechat3rd/src/api/account-coupon';

  export default {
    data() {
      return { options: [] };
    },
    props: {
      selected: {
        type: Array,
        default: () => [],
      },
    },
    model: {
      prop: 'selected',
      event: 'change',
    },
    computed: {
      permission: {
        get() {
          return this.selected;
        },
        set(val) {
          this.$emit('change', val);
        },
      },
    },
    mounted() {
      this.getPermissionData();
    },
    methods: {
      async getPermissionData() {
        const { data } = await permissionMenu();
        this.options = data;
      },
    },
  };
</script>
