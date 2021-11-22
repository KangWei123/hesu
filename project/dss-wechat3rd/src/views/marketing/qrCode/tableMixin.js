export default {
  data() {
    return {
      totalCount: 0,
      page: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      loading: {
        update: false,
        list: false
      },
      keyword: {},
      featchParams: {}
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.fetchData();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchData();
    },
    onSearch() {
      this.page = {
        ...this.page,
        ...this.keyword
      };
      this.page.pageNo = 1;
      this.fetchData();
    },
    onDelete(e) {
      this.$confirm(`确定删除${this.typeName}？`, `删除${this.typeName}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            id: e.id
          };
          this.loading.update = true;
          this.api
            .delete(params)
            .done(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.page.pageNo = 1;
              this.fetchData();
            })
            .always(() => {
              this.loading.update = false;
            });
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
    fetchData() {
      const params = {
        ...this.page,
        ...this.featchParams
      };
      this.loading.list = true;
      this.api
        .list(params)
        .done(res => {
          let tableData = res.data || [];
          if (this.formatTableData) {
            tableData = this.formatTableData(tableData);
          }
          this.tableData = tableData;
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.log(err);
        })
        .always(res => {
          this.loading.list = false;
        });
    }
  }
};
