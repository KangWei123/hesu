<template>
  <el-dialog :title="editorTitle"
             v-if="showMemberEditor"
             :visible.sync="showMemberEditor"
             width="460px"
             append-to-body
             :before-close="closeHandler">

    <member-editor :is-edit="isEdit"
                   :user-id="userId"
                   :storeId="storeId"
                   :close-handler="closeHandler">
    </member-editor>

  </el-dialog>
</template>
<script>
import './index.less';
import MemberEditor from './memberEditor.vue';
export default {
  name: 'memberEditorDialog',
  components: { MemberEditor },
  props: {
    //是否弹窗
    showMemberEditor: {
      type: Boolean,
      default: false
    },
    //弹窗标题
    editorTitle: {
      type: String,
      default: '新增会员'
    },
    //是否为编辑
    isEdit: {
      type: Boolean,
      default: false
    },
    //storeId
    storeId: {
      type: Number,
      default: 0
    },
    //userId
    userId: {
      type: Number,
      default: -1
    },
    //关闭弹窗函数
    closeHandler: {
      type: Function
    }
  },
  data() {
    return {};
  }
};
</script>
