<template>
  <el-form inline
           :model="filter"
           label-position="right"
           label-width="83px"
           ref="filter">

    <!-- <el-form-item label="评价等级">
      <el-select v-model="filter.grade"
                 placeholder="全部评价">
        <el-option label="全部评价"
                   :value="null"></el-option>
        <el-option label="好评"
                   :value="commentEnum.grade.PRAISE"></el-option>
        <el-option label="中评"
                   :value="commentEnum.grade.MIDDLE"></el-option>
        <el-option label="差评"
                   :value="commentEnum.grade.BAD"></el-option>
      </el-select>
    </el-form-item> -->

    <el-form-item label="关键字：" style="display: block;" prop="itemName">
      <el-input placeholder="关键字搜索"
                prefix-icon="el-icon-search"
                v-model.trim="filter.itemName" />
    </el-form-item>

    <el-form-item label="回复状态：" prop="sellerReplyStatus">
      <el-select v-model="filter.sellerReplyStatus"
                 placeholder="全部状态">
        <el-option label="全部状态"
                   :value="null"></el-option>
        <el-option label="已回复"
                   :value="commentEnum.sellerReplyStatus.REPLIED"></el-option>
        <el-option label="未回复"
                   :value="commentEnum.sellerReplyStatus.NOREPLY"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="显示状态：" prop="showStatus">
      <el-select v-model="filter.showStatus"
                 placeholder="全部状态">
        <el-option label="全部状态"
                   :value="null"></el-option>
        <el-option label="显示中"
                   :value="commentEnum.showStatus.SHOW"></el-option>
        <el-option label="隐藏中"
                   :value="commentEnum.showStatus.HIDE"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button @click="reset" plain >重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import commentEnum from '@/dss-wechat3rd/src/constants/commentEnum.js';
export default {
  name: 'comment-filter',
  components: {},
  data() {
    return {
      commentEnum,
      /** 查询条件 */
      filter: {
        itemName: '',
        sellerReplyStatus: null,
        showStatus: null
      }
    };
  },

  watch: {
    filter: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.$emit('filter', this.$plain(this.filter));
      }
    }
  },
  methods: {
    reset() {
      this.$refs.filter.resetFields();
    }
  }
};
</script>

<style lang="less">
</style>
