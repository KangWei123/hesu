<template>
  <el-dialog
    :title="editorTitle"
    v-if="showCueEditor"
    :visible.sync="showCueEditor"
    width="460px"
    append-to-body
    :before-close="beforeClose"
  >
    <cue-editor
      :is-edit="isEdit"
      :id="id"
      :store-list="storeList"
      :is-refresh="isRefresh"
      :close="close"
      :close-handler="closeHandler"
    >
    </cue-editor>
  </el-dialog>
</template>
<script>
  import './index.less';
  import cueEditor from './cueEditor.vue';

  export default {
    name: 'CueEditorDialog',
    components: { cueEditor },
    props: {
      // 是否弹窗
      // 弹窗标题
      editorTitle: {
        type: String,
        default: '新增线索',
      },
      // 是否为编辑
      isEdit: {
        type: Boolean,
        default: false,
      },
      // userId
      id: {
        type: Number,
        default: -1,
      },
      // 静默关闭(不触发列表查询)
      slientClose: {
        type: Function,
      },
      // 关闭弹窗函数
      closeHandler: {
        type: Function,
      },
      storeList: {
        type: Array,
      },
      isRefresh: {
        type: Function,
      },
    },
    data() {
      return {
        showCueEditor: false,
      };
    },
    methods: {
      open() {
        this.showCueEditor = true;
      },
      close() {
        this.showCueEditor = false;
      },
      beforeClose() {
        this.close();
      },
    },
  };
</script>
