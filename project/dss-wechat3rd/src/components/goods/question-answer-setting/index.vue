<template>
  <div class="question-answer-setting">
    <el-button @click="addQuestion" v-if="commonQa.length < limit">新增问题</el-button>

    <div class="setting-content">
      <el-table
        max-height="300"
        style="width: 100%;"
        :data="commonQa">
        <el-table-column>
          <template slot-scope="scope">
            <div class="content">
              <div class="content-item">
                <span class="label">问:</span>
                <div class="content-row">
                  <el-input v-model="scope.row.q" class="content-input" maxlength="100" placeholder="请输入问题"></el-input>
                  <span class="calc-num">{{scope.row.q.length || 0}}/100</span>
                </div>
              </div>
              <div class="content-item">
                <span class="label">答:</span>
                <div class="content-row">
                  <el-input v-model="scope.row.a" class="content-input" maxlength="100" placeholder="请输入答案"></el-input>
                  <span class="calc-num">{{scope.row.a.length || 0}}/100</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          align="left">
          <template slot="header">
            <question-template-popover @select="onChangQATempalte"></question-template-popover>
          </template>
          <template slot-scope="scope">
            <div style="text-align: center;">
              <i class="el-icon-delete" style="color: #256EFF; font-size: 16px; cursor: pointer;" @click="onDelete(scope.$index)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="tool-container">
        <el-button type="text" @click="saveAsTemplate">保存为模板</el-button>
      </div>
    </div>

    <save-template-dialog v-if="showSaveDialog" :show.sync="showSaveDialog" :common-qa="commonQa"></save-template-dialog>
  </div>
</template>

<script>
import QuestionTemplatePopover from './question-template-popover.vue';
import SaveTemplateDialog from './save-template-dialog.vue';

export default {
  name: 'question-answer-setting',
  components: { QuestionTemplatePopover, SaveTemplateDialog },
  props: {
    commonQa: {
      type: Array,
      default: () => []
    },
    // 是否不允许整个商品
    disabledForm: {
      type: Boolean,
      default: false
    },
    // 是否不允许编辑敏感信息
    isDisabledEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSaveDialog: false,
      limit: 10
    };
  },
  methods: {
    onChangQATempalte(list) {
      this.commonQa.splice(0, this.commonQa.length);
      list.forEach(item => {
        this.commonQa.push({
          q: item.q,
          a: item.a
        });
      });
    },
    addQuestion() {
      if (this.commonQa && this.commonQa.length >= 10) return;
      this.commonQa.push({
        q: '',
        a: ''
      });
    },
    onDelete(index) {
      this.commonQa.splice(index, 1);
    },
    saveAsTemplate() {
      this.showSaveDialog = true;
    }
  }
};
</script>

<style lang="less" scoped>
.question-answer-setting {
  max-width: 1040px;
  .setting-content {
    width: 100%;

    .content {
      .content-item {
        display: flex;

        .label {
          width: 50px;
        }

        /deep/ .content-row {
          flex: 1;
          display: flex;
          .content-input.el-input {
            flex: 1;

            .el-input__inner {
              width: 100%;
            }
          }

          .calc-num {
            width: 60px;
            line-height: 30px;
            margin-left: 2px;
          }
        }

        &:first-child {
          margin-bottom: 10px;
        }
      }
    }

    .tool-container {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
    }
  }
}
</style>
