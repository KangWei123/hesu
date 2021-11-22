<template>
  <el-dialog title="确认核销员" class="verification-dailog" append-to-body :visible.sync="showSelectGoodsDialog">
    <div v-loading="loading">
      <div>
        <el-form :model="checker" inline ref="ruleForm">
          <el-form-item label="手机号码:" prop="printerName" label-width="75px">
            <el-input v-model="checker.nickname" style="width: 200px"></el-input>
            <el-button type="primary" class="single-search-btn" @click="clickSearch()">查 找 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="searchMemberList">
        <el-table :data="searchMemberList" class="wkt-table" style="width: 99.9%; max-height: 370px; overflow-y: auto">
          <el-table-column label="昵称">
            <template slot-scope="scope">
              <i
                v-if="!scope.row.avatar"
                style="
                  width: 40px;
                  height: 40px;
                  display: inline-block;
                  vertical-align: middle;
                  font-size: 40px;
                  color: #e4e4e4;
                "
                class="el-icon-question"
              />
              <div
                v-else
                style="width: 40px; height: 40px; display: inline-block; vertical-align: middle"
                :style="{ background: 'transparent url(' + scope.row.avatar + ') no-repeat center / cover' }"
              ></div>
              <div style="display: inline-block">{{ scope.row.username }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <a @click="setChecker(scope.row)" v-if="!scope.row.employee">设为核销员 </a>
              <a v-else style="color: #909399">已设置 </a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="onMemberSizeChange"
          @current-change="onMemberCurrentChange"
          :current-page="memberPage.pageNo"
          :page-size="memberPage.pageSize"
          :page-sizes="[10, 15, 50, 100]"
          class="wkt-pagination"
          layout="prev, pager, next, jumper, sizes, total"
          v-if="memberPage && memberPage.totalCount"
          :total="memberPage.totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" @click="showSelectGoodsDialog = false">关 闭 </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as staffApi from '@/mod-org/src/api/staffApi';

  export default {
    components: {},
    model: {
      prop: 'dialogFromVisible',
    },
    props: {
      dialogFromVisible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        loading: false,
        showSelectGoodsDialog: false,
        checker: {},
        searchMemberList: null,
        memberPage: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
        },
      };
    },

    watch: {
      dialogFromVisible(newVal, oldVal) {
        this.showSelectGoodsDialog = newVal;
      },
      showSelectGoodsDialog(newVal, oldVal) {
        this.$emit('input', newVal);
      },
    },
    methods: {
      setChecker(row) {
        this.$emit('choose', row);
        this.showSelectGoodsDialog = false;
      },

      // 每页条数变化
      onMemberSizeChange(size) {
        this.memberPage.pageNo = 1;
        this.memberPage.pageSize = size;
        this.listMember();
      },
      // 翻页
      onMemberCurrentChange(page) {
        this.memberPage.pageNo = page;
        this.listMember();
      },

      // 搜索会员
      clickSearch() {
        this.memberPage.pageNo = 1;
        this.memberPage.pageSize = 10;
        this.listMember();
      },

      // 查询核销员列表
      listMember() {
        const params = {
          pageNo: this.memberPage.pageNo,
          pageSize: this.memberPage.pageSize,
          keyword: this.checker.nickname,
        };
        this.loading = true;
        staffApi
          .getVerificationEmployeeList(params)
          .then(res => {
            if (res.success === true) {
              this.searchMemberList = res.data || [];
              this.memberPage.totalCount = res.totalCount;
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
  };
</script>
