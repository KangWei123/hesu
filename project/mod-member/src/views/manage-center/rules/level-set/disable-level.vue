<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    center
    width="500px"
    class="disable-level"
    v-if="levelItem"
  >
    <div v-if="status">确定开启当前阶段？</div>
    <div v-else-if="levelItem.count !== 0">
      <div>该阶段目前存在{{ levelItem.count }}位客户，若禁用阶段，需将本客户阶段变更为：</div>
      <div style="margin: 10px 0 20px">
        <span>选择客户阶段：</span>
        <el-select v-model="choosedLevel" placeholder="请选择">
          <el-option v-for="item in chooseLevelList" :key="item.stageId" :label="item.stageName" :value="item.stageId">
          </el-option>
        </el-select>
      </div>
    </div>
    <div v-else>该阶段目前存在0位客户，可变更阶段</div>
    <div slot="footer">
      <el-button @click="onCancle" :disabled="loading">取 消 </el-button>
      <el-button
        type="primary"
        @click="onSubmit"
        :loading="loading"
        :disabled="!levelItem.status && levelItem.count !== 0 && !choosedLevel"
        >确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import manageApi from '../../../../api/manage.js';
  export default {
    props: {
      // 是否显示弹窗
      value: {
        type: Boolean,
        default: false,
      },
      // 阶段列表
      levelList: {
        type: Array,
        default() {
          return [];
        },
      },
      // 当前操作阶段
      levelItem: {
        type: Object,
        default() {
          return null;
        },
      },
    },
    data() {
      return {
        visible: false,
        loading: false,
        choosedLevel: '',
      };
    },
    watch: {
      value(val) {
        this.visible = val;
      },
      visible(val) {
        if (val) {
          this.choosedLevel = '';
        }
        this.$emit('input', val);
      },
    },
    computed: {
      chooseLevelList() {
        return this.levelList.filter(item => {
          if (item.id !== this.levelItem.id && item.status) {
            return item;
          }
        });
      },
      status() {
        return this.levelItem.status;
      },
      title() {
        return this.levelItem.status ? '开启阶段' : '禁用阶段';
      },
    },
    methods: {
      onCancle() {
        this.visible = false;
        this.levelList.map(item => {
          if (item.stageId === this.levelItem.stageId) {
            item.status = !item.status;
          }
        });
      },
      onSubmit() {
        this.loading = true;
        const params = {
          isEnable: this.status,
          updateStageId: this.levelItem.stageId,
          transferStageId: this.choosedLevel,
        };
        manageApi
          .updateClientStageStatus(params)
          .then(res => {
            this.$message.success(`${this.title}成功！`);
            this.visible = false;
          })
          .catch(err => {
            this.onCancle();
          })
          .finally(_ => {
            this.loading = false;
          });
      },
    },
  };
</script>
<style lang="less" scoped>
  .disable-level {
    /deep/.el-dialog__header {
      padding: 20px;
    }
  }
</style>
