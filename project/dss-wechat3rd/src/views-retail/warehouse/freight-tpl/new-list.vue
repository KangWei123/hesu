<template>
  <div class="freight-tpl-list-container" v-loading="loading">
    <div class="new-tpl-box">
      <el-button class="new-tpl-btn" @click="handleAddNewTpl" type="primary">
        新增模板
      </el-button>
    </div>

    <div class="tip-card">
        <div v-for="(tpl, index) in tplList" :key="index">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{tpl.name}}</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <div class="card-content">
                    <span>类型：{{ ['买家承担','卖家包邮','运费到付'][tpl.type] }}</span>
                    <span>最后编辑时间：{{ tpl.updateTime | time }}</span>
                    <span>使用该模板商品：{{ tpl.useCount || 0 }}个</span>
                </div>
                <div class="card-bottom">
                    <span>
                        <span>默认模板</span>
                        <span @click.prevent="toggleDefaultTpl(tpl)">
                            <el-checkbox v-model="tpl.default"></el-checkbox>
                        </span>
                    </span>
                    
                    <span class="tpl-option-box">
                        <a style="margin-right: 8px;" href="javascript:;" @click="handleEdit(tpl.id)">编辑</a>
                        <a href="javascript:;" @click="handleDel(tpl)">删除</a>
                    </span>
                </div>
                
            </el-card>
        </div>
    </div>
    <el-pagination
      v-if="totalTplCount"
      layout="sizes, prev, pager, next"
      :hide-on-single-page="true"
      :total="totalTplCount"
      :page-size="pageParams.pageSize"
      :current-page="pageParams.pageNo"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    >
    </el-pagination>


    <!-- <div class="tpl-list-box">
      <template v-if="tplList && tplList.length">
        <div class="tpl-item" v-for="(tpl, index) in tplList" :key="index">
          <div class="tpl-header">
            <div class="tpl-header-left">
              <span style="margin-left: 3%">{{ tpl.name }}</span>
              <span style="margin-left: 4%"
                >类型：{{ ['买家承担','卖家包邮','运费到付'][tpl.type] }}</span>
              <span style="margin-left: 4%">最后编辑时间：{{ tpl.updateTime | time }}</span>
              <span style="margin-left: 2%">使用该模板商品：{{ tpl.useCount || 0 }}个</span>
              <span style="margin-left: 5%">默认模板</span>
              <span @click.prevent="toggleDefaultTpl(tpl)">
                <el-checkbox v-model="tpl.default"></el-checkbox>
              </span>
            </div>

            <span class="tpl-option-box">
              <a class="table-href" href="javascript:;" @click="handleEdit(tpl.id)">编辑</a>
              <a class="table-href" href="javascript:;" @click="handleDel(tpl)">删除</a>
            </span>
          </div>
          <tpl-area-table :tpl="tpl"></tpl-area-table>
        </div>
      </template>
      <place-holder v-else></place-holder>
      <el-pagination
        v-if="totalTplCount"
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalTplCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      >
      </el-pagination>
    </div> -->

    <!-- 删除运费模板对话弹框 -->
    <el-dialog class="delete_freight_tpl_dialog" :visible.sync="delTemplateDialogVisible" width="50%" center>
      <span slot="title" class="dialog-title">
        <img class="title-icon" src="../../../images/warning.png" />
        <span>删除运费模板</span>
      </span>
      <div>该模板有{{ delTemplateUseCount || 0 }}件商品在使用，请指定新的模板给这些商品后才可以完成删除</div>
      <el-select
        size="mini"
        filterable
        v-model="newTemplateId"
        placeholder="请选择运费模板"
        @change="handleSelectedTpl"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-option v-for="item in newTemplateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delTemplateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import wxFreightTplApi from '@/dss-wechat3rd/src/api/wx-freight-tpl-api.js';
import tplEnum from './tpl-enum.js';
import TplAreaTable from './tpl-area-table.vue';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';

export default {
  name: 'freight-tpl-list',
  components: {
    PlaceHolder,
    TplAreaTable
  },
  data() {
    return {
      tplEnum,
      loading: false,
      tplList: [],
      totalTplCount: 0,
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },

      delTemplateDialogVisible: false, // 删除运费模板对话弹框
      delTemplateId: null, // 删除的运费模板id
      delTemplateUseCount: null, // 删除的运费模板使用数量

      newTemplateList: [], // 新的运费模板列表
      newTemplateId: null // 选中新的运费模板id
    };
  },
  computed: {
    computeAreaTitle() {
      return function(item) {
        return item.regionDTOS
          .map(region => {
            return region.regionName;
          })
          .join(';');
      };
    }
  },
  watch: {
    // 监听删除运费模板对话弹框，以便清空部分参数
    delTemplateDialogVisible(newVal, oldVal) {
      if (!newVal) {
        this.emptyProcessData(); // 清空模板删除进程操作的数据
      }
    }
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getTplList(); // 获取运费模板列表
    });
  },

  mounted() {
    // this.getTplList(); // 获取运费模板列表
  },
  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getTplList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getTplList();
    },

    // 获取运费模板列表
    getTplList() {
      this.loading = true;
      const params = { ...this.pageParams };
      wxFreightTplApi
        .getTplList(params)
        .done(res => {
          this.tplList = res.data || [];
          this.totalTplCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 新增运费模板
    handleAddNewTpl() {
      this.$router.push('/warehouse/logistics-setting/freight-tpl/list/add');
    },

    // 设置为默认模板
    toggleDefaultTpl(tpl) {
      if (tpl.default) {
        return;
      }
      this.loading = true;
      wxFreightTplApi
        .setTplDefault({
          templateId: tpl.id
        })
        .done(res => {
          if (res.success) {
            this.getTplList();
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 编辑运费模板
    handleEdit(tplId) {
      this.$router.push({
        path: '/warehouse/logistics-setting/freight-tpl/list/add',
        query: {
          tplId: tplId
        }
      });
    },

    // 清空模板删除进程操作的数据
    emptyProcessData() {
      this.delTemplateId = null; // 删除的运费模板id
      this.delTemplateUseCount = null; // 删除的运费模板使用数量

      this.newTemplateList = []; // 新的运费模板列表
      this.newTemplateId = null; // 选中新的运费模板id
    },

    // 删除运费模板，显示运费模板对话弹框
    handleDel(tpl) {
      // 判断该模板是否为默认模板，是则不允许删除
      if (!!tpl.default) {
        this.$message.error('默认模板无法删除');
        return;
      }

      this.delTemplateId = tpl.id; // 删除的运费模板id
      this.delTemplateUseCount = tpl.useCount; // 删除的运费模板使用数量

      // 判断该模板是否有商品使用，没有则出现警告，确定则直接删除
      if (!this.delTemplateUseCount) {
        // 该模板没有商品使用，直接删除
        this.$confirm('此操作将删除该运费模板, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning'
        })
          .then(() => {
            this.delTemplate(); //删除运费模板
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });

            this.emptyProcessData(); // 清空模板删除进程操作的数据
          });
      } else {
        // 该模板有商品使用，查询新的运费模板列表以便替换
        this.loading = true;

        // 查询新的运费模板列表
        const params = {};
        wxFreightTplApi
          .getTplList(params)
          .then(res => {
            this.newTemplateList = res.data || []; // 新的运费模板列表

            // 删除新的运费模板列表中当前操作的运费模板
            const tslIdex = this.newTemplateList.findIndex(item => {
              return item.id === tpl.id;
            });
            if (tslIdex !== -1) {
              this.newTemplateList.splice(tslIdex, 1);
            }

            // 判断是否有新的替换运费模板列表
            if (this.newTemplateList.length > 0) {
              this.delTemplateDialogVisible = true; // 显示运费模板对话弹框
            } else {
              this.$message.error(
                `该模板有${this.delTemplateUseCount}件商品在使用，暂无新的模板指定给这些商品，无法删除`
              );

              this.emptyProcessData(); // 清空模板删除进程操作的数据
            }
          })
          .catch(() => {
            this.$message.error('新的运费模板列表查询失败，请稍后重试');
            this.emptyProcessData(); // 清空模板删除进程操作的数据
          })
          .always(() => {
            this.loading = false;
          });
      }
    },

    // 选中替换的运费模板
    handleSelectedTpl(value) {
      this.newTemplateId = value; // 选中新的运费模板id
    },

    // 确定删除运费模板
    handleConfirmDel() {
      if (!this.newTemplateId) {
        this.$message.error('请先选择新的运费模板');
        return;
      }

      this.delTemplate(); //删除运费模板
    },

    // 删除运费模板
    delTemplate() {
      this.loading = true;
      wxFreightTplApi
        .delTpl({
          templateId: this.delTemplateId,
          newTemplateId: this.newTemplateId
        })
        .done(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            this.delTemplateDialogVisible = false; // 隐藏运费模板对话弹框
            this.getTplList(); // 获取运费模板列表
          }
        })
        .always(() => {
          this.loading = false;
          this.emptyProcessData(); // 清空模板删除进程操作的数据
        });
    }
  }
};
</script>

<style lang="less">
// .freight-tpl-list-container {
//   .new-tpl-box {
//     padding-right: 20px;
//     text-align: right;
//   }

//   .tpl-list-box {
//     padding: 0 0 20px;

//     .tpl-item {
//       margin-top: 20px;
//     }

//     .tpl-header {
//       position: relative;
//       background: rgba(242, 244, 247, 1);
//       border-top: 1px solid rgba(220, 221, 224, 1);
//       border-left: 1px solid rgba(220, 221, 224, 1);
//       border-right: 1px solid rgba(220, 221, 224, 1);
//       line-height: 40px;
//       font-size: 14px;
//       font-family: PingFangSC-Regular;
//       font-weight: 400;
//       color: rgba(51, 51, 51, 1);
//       // clear: both;
//       display: inline-block;
//       width: 100%;

//       .tpl-header-left {
//         display: inline-block;
//         width: 90%;
//       }
//     }

//     .tpl-option-box {
//       float: right;
//       margin-right: 30px;
//     }

//     .wkt-table {
//       margin-top: 0;
//     }

//     .wkt-table .el-table__header th {
//       background-color: #fff;
//     }

//     .area-contents {
//       font-size: 12px;
//       font-family: PingFangSC-Regular;
//       font-weight: 400;
//       color: rgba(51, 51, 51, 1);
//       line-height: 17px;
//     }
//   }

//   .delete_freight_tpl_dialog {
//     .el-dialog {
//       width: 500px !important;
//       min-width: 400px;
//     }
//     .el-dialog__header {
//       text-align: left;
//     }
//     .dialog-title {
//       display: inline-block;
//       img {
//         width: 30px;
//         height: 30px;
//         margin-right: 10px;
//         vertical-align: middle;
//       }
//       span {
//         vertical-align: sub;
//       }
//     }
//     .el-select {
//       width: 80%;
//       margin-top: 20px;
//     }
//   }
// }

.freight-tpl-list-container {
  .delete_freight_tpl_dialog {
    .el-input--mini .el-input__icon {
      line-height: 30px;
    }
    .el-dialog--center .el-dialog__body {
      text-align: center;
    }
  }
 .new-tpl-box {
    text-align: left;
    margin-bottom: 15px;
 }
 .tip-card {
     display: flex;
     flex-wrap: wrap;
 }
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .clearfix:before {
    width: 2px;
    height: 20px;
    background: #ff6b41;
    position: absolute;
    top: 10px;
    left: 0px;
  }

  .box-card {
    width: 300px;
    height: 195px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .card-content {
      margin-left: 20px;
      span {
          display: block;
          margin-bottom: 10px;
          color: #909399;
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
      }
      span:last-child {
          margin-bottom: 18px;
      }
  }
  .card-bottom {
      height: 36px;
      padding: 10px 20px 0px 20px;
      border-top: 1px solid #e4e7ed ;
      display: flex;
      justify-content: space-between;
      a {
          color: #2E8DFF;
      }
  }
  .el-card__header {
      padding: 10px 20px;
  }
  .el-card__body {
      padding: 0px;
      padding-top: 10px;
  }
}
</style>
