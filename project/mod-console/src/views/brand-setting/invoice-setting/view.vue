<template>
  <div class="invoice-wrapper">
    <div class="wkt-opt-label-container head-box">
      <div class="title">
        <span style="font-weight: 600">发票功能</span>
        <div class="switch-wrapper" @click="handleClick">
          <el-switch
            v-model="useInvoice"
            @change="hanleSwitch"
            :disabled="isOpen"
            :active-value="open"
            :inactive-value="close"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <span>开启后，客户可在小程序中申请开具发票</span>
      </div>

      <el-button @click="onSet" type="primary">设置企业信息</el-button>
      <el-button @click="onAdd" type="primary">新增模板</el-button>
    </div>

    <div class="invoice-list">
      <el-row>
        <el-table :data="invoiceList" class="wkt-table">
          <el-table-column label="模板名称" min-width="120" prop="name"> </el-table-column>
          <el-table-column label="开票项编码" min-width="100" prop="spbm"> </el-table-column>

          <el-table-column label="开票项名称" min-width="100" prop="spmc"> </el-table-column>

          <el-table-column label="税率" min-width="100" prop="sl"> </el-table-column>

          <el-table-column label="默认模板" min-width="100" prop="sl">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.defaultFlag"
                active-color="#4379ed"
                inactive-color="rgba(0, 0, 0, 0.25)"
                :active-value="open"
                :inactive-value="close"
                @change="onStatusChange($event, scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="最后编辑时间" min-width="100" prop="updateTime">
            <template slot-scope="scope">
              {{ scope.row.updateTime | time }}
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="130">
            <span slot-scope="scope">
              <a class="table-href" href="javascript:;" @click="onAlter(scope.row)">编辑</a>
              <a class="table-delete" href="javascript:;" @click="handleDel(scope.row)">删除</a>
            </span>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          layout="prev, pager, next, jumper, sizes, total"
          hide-on-single-page
          :total="totalCount"
          :page-size="pageParams.pageSize"
          :current-page="pageParams.pageNo"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          class="wkt-pagination"
        >
        </el-pagination>
      </el-row>
    </div>
    <msg-dialog
      :visible.sync="isShow"
      :title="content.title"
      :msg="content.msg"
      @handleConfirm="handleConfirm"
    ></msg-dialog>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import MsgDialog from './MsgDialog';
  import wxInvoiceTplApi from '@/mod-console/src/api/brand-setting/wx-invoice-tpl-api';
  import store from '@/business-common/store.js';

  export default {
    components: {
      MsgDialog,
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
      }),
      isOpen() {
        return !(this.entData.length > 0 && this.invoiceList.length > 0);
      },
    },
    data() {
      return {
        useInvoice: 0,
        pageParams: {
          pageSize: 10,
          pageNo: 1,
        },
        invoiceList: [],
        entData: [],
        totalCount: 0,
        isShow: false,
        content: {
          flag: '',
          title: '',
          msg: '',
        },
        open: 1,
        close: 0,
      };
    },
    mounted() {
      if (!!this.curApp.useInvoice || this.curApp.useInvoice === 0) {
        this.useInvoice = this.curApp.useInvoice;
      }

      this.getEntInfo();
      this.getInvoiceList();
    },
    methods: {
      handleClick() {
        this.content.title = '填写发票信息';
        if (this.entData.length === 0) {
          this.isShow = true;
          this.content.flag = 'ENT';
          this.content.msg = "未检测到发票信息，请点击'设置企业信息'按钮设置企业信息或点击'确认'跳转";
        } else if (this.invoiceList.length === 0) {
          this.isShow = true;
          this.content.flag = 'TPL';
          this.content.msg = "未检测到发票模板，请点击'新增模板'按钮设置发票模板或点击'确认'跳转";
        }
      },
      handleConfirm() {
        this.content.flag === 'ENT'
          ? this.$router.push('/brand-setting/invoice-setting/edit-company')
          : this.$router.push('/brand-setting/invoice-setting/edit');
        this.isShow = false;
      },
      hanleSwitch() {
        const param = {
          useInvoice: this.useInvoice,
        };
        wxInvoiceTplApi
          .postInvoiceStatus(param)
          .then(res => {
            if (res.success) {
              // 全局更新发票开具能力状态
              this.curApp.useInvoice = this.useInvoice;
              store.commit('update_curApi', this.curApp);

              this.$message({
                message: this.useInvoice ? '开启成功' : '关闭成功',
                type: 'success',
              });
            }
          })
          .catch(() => {
            this.$message.error('发票开具能力失败，请重试');
          });
      },
      async getEntInfo() {
        this.entData = await wxInvoiceTplApi.getEntInfo();
      },
      getInvoiceList() {
        const param = {
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
        };
        wxInvoiceTplApi.getInvoice(param).then(res => {
          this.invoiceList = res.data || [];
          this.totalCount = res.totalCount;
        });
      },
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.getInvoiceList();
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getInvoiceList();
      },
      onAdd() {
        if (this.entData.length !== 0) {
          this.$router.push('/brand-setting/invoice-setting/edit');
        } else {
          this.$confirm("未检测到发票信息，请点击'设置企业信息'按钮设置企业信息或点击'确认'跳转;", '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              this.$router.push('/brand-setting/invoice-setting/edit-company');
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消',
              });
            });
        }
      },
      onSet() {
        this.$router.push('/brand-setting/invoice-setting/edit-company');
      },
      onAlter(row) {
        this.$router.push(`/brand-setting/invoice-setting/edit?id=${row.id}`);
      },
      handleDel(tpl) {
        // 判断该模板是否为默认模板，是则不允许删除
        if (tpl.defaultFlag) {
          this.$message.error('默认模板无法删除');
        } else {
          this.$confirm('发票模板删除后不可撤销，是否确认删除？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              this.onDelete(tpl); // 删除发票模板
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除',
              });
            });
        }
      },
      onDelete(row) {
        wxInvoiceTplApi
          .deleteInvoice(row.id)
          .then(res => {
            if (res.success) {
              const index = this.invoiceList.indexOf(row);
              this.invoiceList.splice(index, 1);
              if (this.invoiceList.length === 0) {
                this.useInvoice = 0;
                // 全局更新发票开具能力状态
                this.curApp.useInvoice = this.useInvoice;
                store.commit('update_curApi', this.curApp);
              }
              this.$message.success('删除成功');
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      onStatusChange(v, row) {
        wxInvoiceTplApi
          .setDefaultInvoice({
            templateId: row.id,
            defaultFlag: v,
          })
          .then(res => {
            this.$message({
              message: '设置默认模板成功',
              type: 'success',
            });
            if (res.success) {
              this.getInvoiceList();
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .invoice-wrapper {
    .head-box {
      display: flex;
      align-items: center;
      padding: 20px;
      border-bottom: 16px solid #f5f7fa;
      .title {
        flex: 1;
        margin-right: 20px;
      }
    }

    .switch-wrapper {
      display: inline;
      margin: 0px 5px;
    }

    .switch {
      padding: 5px 10px;
    }

    .title {
      display: inline;
    }

    .invoice-list {
      padding-bottom: 20px;
      background: white;
      border-radius: 4px;
    }
  }
</style>
