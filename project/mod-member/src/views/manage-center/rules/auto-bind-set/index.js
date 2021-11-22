import './index.less';
import api from '@/mod-member/src/api/manage.js';
import datetime from '@/dss-common/utils/date';
import sourceEnum from '../../../../enum/sourceEnum';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      channelsList: sourceEnum.CLUE_AUTO_BIND,
      isLoading: false,
      memberList: [],
      pageParams: {
        pageSize: 10,
        pageNo: 1,
      },
      totalMemberCount: 0,
      area: {
        province: null,
        city: null,
        district: null,
      },
      keyword: {
        clientSource: null,
      },
    };
  },
  filters: {
    source(value) {
      const target = sourceEnum.CLUE_AUTO_BIND.find(item => {
        return item.value === value;
      });
      return target ? target.name : '--';
    },
  },
  computed: {
    ...mapState({
      roleList: state => state.userInfo && state.userInfo.roleList,
    }),
    hasPermission() {
      return this.roleList.indexOf('common_role_enterprise') !== -1;
    },
  },
  // 避免编辑或新增不刷新列表
  beforeRouterEnter(to, from, next) {
    next(vm => {
      vm.doSearch();
    });
  },
  methods: {
    onAdd() {
      this.$router.push({
        path: '/manage/rules/auto-bind-set/edit',
      });
    },
    onEdit(row) {
      this.$router.push({
        path: '/manage/rules/auto-bind-set/edit',
        query: {
          id: row.id,
        },
      });
    },
    changeStatus(row) {
      api
        .changeStatus({
          taskId: row.id,
          isActive: row.isActive,
        })
        .then(res => {})
        .catch(err => {
          row.isActive = !row.isActive;
        });
    },
    onDelete(e) {
      console.log('删除', e);
      if (e.isActive) {
        this.$message({
          message: '已启动的任务不能删除',
          type: 'warning',
        });
        return;
      }
      this.$confirm('此操作将永久删除线索，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api
            .deleteTask({
              taskIds: e.id,
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                });
                this.pageParams.pageNo =
                  this.memberList.length === 1 && this.pageParams.pageNo != 1
                    ? this.pageParams.pageNo - 1
                    : this.pageParams.pageNo;
                this.doSearch();
              }
            })
            .catch(err => {
              this.$message({
                type: 'info',
                message: `${err.errorMessage}`,
              });
            });
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
    onFilter() {
      this.pageParams.pageNo = 1;
      this.doSearch();
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.doSearch();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.doSearch();
    },
    doSearch() {
      this.isLoading = true;
      api
        .getTask({
          pageNo:
            this.memberList.length === 1 && this.pageParams.pageNo != 1
              ? this.pageParams.pageNo - 1
              : this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          clientSource: this.keyword.clientSource,
        })
        .then(res => {
          this.memberList = res.data || [];
          this.totalMemberCount = res.totalCount;
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },
    formatTime(row, column) {
      const date = row[column.property];
      if (date) {
        return datetime.format(new Date(date), 'YYYY-MM-DD');
      }
      return '';
    },
  },
  mounted() {
    if (!this.$route.path.includes('add')) {
      this.doSearch();
    }
  },
};
