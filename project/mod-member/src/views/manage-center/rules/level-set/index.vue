<template>
  <div class="level-set">
    <div class="level-set-header" v-if="hasPermission">
      <el-button class="btn" type="primary" v-if="levelList.length > 1" @click="onAdjustSort" :loading="sortLoading">{{
        editingSort ? '确定' : '调整阶段顺序'
      }}</el-button>
      <el-button class="cancle-btn" @click="onCancleSort" v-if="editingSort" :disabled="sortLoading">取消</el-button>
      <el-button class="btn" type="primary" :disabled="sortLoading" @click="onAdd">新增阶段</el-button>
      <div class="tip" v-show="editingSort">拖拽表格行调整顺序，调整完成后请点击上方确定按钮</div>
    </div>
    <div class="level-set-content">
      <el-table :data="levelList" stripe ref="levelTable" row-key="id" v-loading="loading" id="client-stage-table">
        <el-table-column prop="stageName" label="客户阶段"> </el-table-column>
        <el-table-column prop="judgeType" label="判定方式">
          <template slot-scope="scope">
            <div>{{ scope.row.judgeType | judgeTypeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="stageDesc" label="阶段描述" min-width="250px"></el-table-column>
        <!-- <el-table-column label="阶段顺序" align="center" v-if="editingSort">
          <template slot-scope="scope">
            <div class="sort">
              <i class="el-icon-caret-top" v-if="scope.row.orderNum !== 0" @click="onUpdateSort(scope.row, true)"></i>
              <i class="el-icon-caret-bottom" v-if="scope.row.orderNum !== levelList.length-1" @click="onUpdateSort(scope.row, false)"></i>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="changeStatus(scope.row)"
              active-color="#409EFF"
              inactive-color="#E0E0E0"
              active-text="开启"
              inactive-text="关闭"
              v-if="hasPermission"
            />
            <div v-else>{{ scope.row.status ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" v-if="hasPermission">
          <template slot-scope="scope">
            <el-button type="text" @click="onEdit(scope.row)" :disabled="scope.row.judgeType === 1">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <disabel-level :level-list="levelList" :level-item="activeLevel" v-model="showDisabledDialog" />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import manageApi from '@/mod-member/src/api/manage.js';
  import utils from '@/dss-common/utils/index.js';
  import DisabelLevel from './disable-level.vue';
  import sortable from 'sortablejs'; // vuedraggable依赖 Sortable.js
  export default {
    components: { DisabelLevel },
    data() {
      return {
        loading: false,
        sortLoading: false,
        editingSort: false,
        showDisabledDialog: false,
        originLevelList: [],
        levelList: [],
        activeLevel: null,
      };
    },
    watch: {
      editingSort(val) {
        this.sortableObj.option('disabled', !val);
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
    filters: {
      judgeTypeFilter(val) {
        const text = ['--', '系统判断', '人工判断'];
        return text[val || 0];
      },
    },
    methods: {
      getData() {
        // 获取阶段等级
        this.loading = true;
        manageApi
          .getClientStage()
          .then(res => {
            const { data } = res;
            this.levelList = data;
            this.originLevelList = JSON.parse(JSON.stringify(this.levelList));
          })
          .finally(_ => {
            this.loading = false;
          });
      },
      onUpdateSort(target, isUp = true) {
        const orderNum = target.orderNum;
        const targeIndex = this.levelList.findIndex(item => {
          return item.orderNum === orderNum;
        });
        const list = JSON.parse(JSON.stringify(this.levelList));
        if (isUp) {
          list[targeIndex].orderNum = orderNum - 1;
          list[targeIndex - 1].orderNum = orderNum;
        } else {
          list[targeIndex].orderNum = orderNum + 1;
          list[targeIndex + 1].orderNum = orderNum;
        }
        list.sort(utils.arraySortBy('orderNum'));
        this.levelList = list;
      },
      onAdjustSort() {
        if (this.editingSort) {
          // 更新阶段顺序接口
          this.loading = true;
          this.sortLoading = true;
          const params = [];
          this.levelList.forEach((item, index) => {
            item.orderNum = index;
            params.push({
              stageId: item.stageId,
              orderNum: item.orderNum,
            });
          });
          manageApi
            .sortClientStage(params)
            .then(res => {
              this.editingSort = false;
              this.originLevelList = JSON.parse(JSON.stringify(this.levelList));
            })
            .finally(_ => {
              this.loading = false;
              this.sortLoading = false;
            });
        } else {
          this.editingSort = true;
        }
      },
      // 取消排序
      onCancleSort() {
        this.editingSort = false;
        this.levelList = JSON.parse(JSON.stringify(this.originLevelList));
      },
      // 新建阶段
      onAdd() {
        this.$router.push(`/manage/rules/level-set/edit`);
      },
      // 编辑阶段
      onEdit(item) {
        this.$router.push(
          `/manage/rules/level-set/edit?id=${item.id}&stageId=${item.stageId}&stageName=${item.stageName}&stageDesc=${
            item.stageDesc || ''
          }`
        );
      },
      // 切换阶段状态
      async changeStatus(item) {
        this.activeLevel = item;
        try {
          const { data } = await manageApi.getClientStageCount({
            stageId: item.stageId,
          });
          this.activeLevel.count = data || 0;
          // 更新 originLevelList
          if (this.originLevelList) {
            this.originLevelList = this.originLevelList.map(originItem => {
              if (originItem.stageId === item.stageId) {
                return JSON.parse(JSON.stringify(this.activeLevel));
              } else {
                return originItem;
              }
            });
          }
          this.showDisabledDialog = true;
        } catch (err) {
          console.log(err);
          item.status = !item.status;
        }
      },
      // 行拖拽
      rowDrop() {
        const tbody = document.querySelector('#client-stage-table tbody');
        const _this = this;
        this.sortableObj = sortable.create(tbody, {
          onEnd(e) {
            const { newIndex, oldIndex } = e;
            const currRow = _this.levelList.splice(oldIndex, 1)[0];
            _this.levelList.splice(newIndex, 0, currRow);
          },
          onUpdate(e) {
            console.log(e);
          },
        });
        this.sortableObj.option('disabled', true);
      },
    },
    mounted() {
      this.getData();
      this.rowDrop();
    },
  };
</script>

<style scoped lang="less">
  .level-set-header {
    height: 71px;
    padding: 21px 20px 20px 20px;
    background: rgba(250, 250, 250, 1);
    box-sizing: border-box;
    text-align: right;
    position: relative;
    .btn,
    .cancle-btn {
      display: inline-block;
      font-size: 12px;
      border-radius: 15px;
      width: 100px;
      height: 30px;
      margin: 0 0 0 10px;
    }
    .cancle-btn {
      margin-right: 20px;
    }
    .tip {
      text-align: left;
      color: rgb(153, 153, 153);
      font-size: 12px;
      margin-top: -17px;
    }
  }
  .level-set-content {
    padding: 0 20px 20px;
    .level-icon {
      display: inline-block;
      vertical-align: top;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 100%;
      font-size: 20px;
      text-align: center;
      color: #fff;
      background: linear-gradient(144deg, rgba(108, 194, 255, 1) 0%, rgba(58, 143, 255, 1) 100%);
    }
    .sort {
      font-size: 20px;
      i {
        cursor: pointer;
      }
      i:hover {
        color: #256eff;
      }
    }
    .el-button.is-disabled {
      background: none;
      color: #cdcdcd;
      border: 0;
    }
  }
</style>
