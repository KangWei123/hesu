<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option
      v-for="item of list"
      :key="item.levelNumber"
      :label="item.levelName"
      :value="item.levelNumber"
    ></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import api from '@/mod-member/src/api/memberAPI';

  /**
   * 等级选择器类型选择器
   */
  export default {
    name: 'LevelSelect',
    props: {
      ...Select.props,
      addInitialMember: {
        type: Boolean,
        default: false,
      },
      // 值字段
      valueKey: {
        type: String,
        default: 'id',
      },
    },
    data() {
      return {
        list: [],
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      async getList() {
        const { data } = await api.levelManager.getLevelList({ pageNo: 1, pageSize: 1000 });

        this.list = data || [];
        if (this.addInitialMember) {
          this.list.unshift({ id: 0, levelNumber: 0, levelName: '初始会员' });
        }
      },
    },
  };
</script>

<style></style>
