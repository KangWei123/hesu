<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-size= parms.numbers
    :page-sizes=[15,30,50,100]
    layout="total, sizes, prev, pager, next, jumper"
    :page-count= totalpage
    >
  </el-pagination>
</template>

<script>
  const NUMBERS = 'numbers';
  export default {
    props: ['totalpage'],
    data() {
      return {
        currentPage: 1,
        pagenum: '',
        parms: {
          pn: '1',
          numbers: 15
        }
      };
    },
    watch: {
      totalpage: function() {
        this.pagenum = this.totalpage ? this.totalpage : 0;
      }
    },
    mounted() {
      this.parms.numbers = parseInt(window.localStorage.getItem(NUMBERS) ? window.localStorage.getItem(NUMBERS) : 15);
      this.pagenum = this.totalpage ? this.totalpage : 0;
    },
    methods: {
      handleSizeChange(val1) {
        window.localStorage.setItem(NUMBERS, val1);
        this.parms.numbers = val1;
        this.publicchange();
      },
      handleCurrentChange(val2) {
        this.parms.pn = val2;
        this.publicchange();
      },
      publicchange() {
        this.$emit('pick', this.parms);
      }
    }
  };
</script>

<style scoped>

</style>
