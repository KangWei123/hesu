<template>
  <el-dialog :visible.sync="show" title="提交详情" width="600px" class="form-utils-detail-dialog">
    <div class="fieldset">
      <div class="content">
        <img :src="currentData.avatar" alt="" class="avatar" />
        <div class="info">
          <span>{{ currentData.name }}</span>
          <span>{{ currentData.phone }}</span>
        </div>
      </div>
    </div>
    <div class="fieldset">
      <p class="label">表单内容</p>
      <div class="content form-content" v-loading="loading">
        <div
          :class="['form-item', item.type, { required: item.required }]"
          v-for="item in formContent"
          :key="item.uuid"
        >
          <span class="label">{{ item.label }}</span>
          <!-- 可能有空值 -->
          <span class="value">{{ (currentData.list.find(i => i.uuid === item.uuid) || {}).value }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { queryForm } from '../api/form';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    formId: {
      type: [Number, String]
    },
    submitData: {
      type: Object,
      default: () => ({})
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return { formContent: [], loading: false };
  },

  methods: {
    async fetchForm() {
      try {
        this.loading = true;
        const res = await queryForm({ formId: this.currentData.formId, deleted: this.isDeleted });
        this.formContent = (res.data.formBody && JSON.parse(res.data.formBody)) || [];
      } finally {
        this.loading = false;
      }
    }
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    currentData() {
      return {
        ...this.submitData,
        list: (this.submitData.submitFormBody && JSON.parse(this.submitData.submitFormBody)) || []
      };
    }
  },

  watch: {
    submitData() {
      this.fetchForm();
    }
  }
};
</script>

<style lang="less" scoped>
.form-utils-detail-dialog {
  /deep/ .el-dialog__body {
    text-align: left;
  }
}
.fieldset {
  margin-bottom: 20px;
}

.content {
  display: flex;
  align-items: center;
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
    flex-shrink: 0;
    flex-grow: 0;
    // background: #ccc;
    border-radius: 50%;
    margin-right: 20px;
  }
  .info {
    display: flex;
    flex-direction: column;
  }
}

.form-content {
  flex-direction: column;
  align-items: flex-start;
  width: 520px;
  height: 300px;
  overflow-y: scroll;
  margin: 10px auto;
}

.form-item {
  word-break: break-all;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #eee;
  &:last-child {
    border: 0;
  }
  &.textarea {
    display: block;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .value {
      margin-top: 5px;
      padding-left: 0.4em;
      display: block;
      width: 340px;
      min-height: 40px;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: normal;
    }
  }
  .label {
    display: inline-block;
    width: 8em;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .value {
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.required {
  .label::after {
    content: '*';
    color: red;
    position: absolute;
    top: 0;
    left: -1.2em;
  }
}
</style>
