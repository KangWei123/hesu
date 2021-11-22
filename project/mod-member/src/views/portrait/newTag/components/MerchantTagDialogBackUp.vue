<template>
  <el-dialog :visible.sync="dialogVisible" width="30%">
    <el-table :data="tableData">
      <el-table-column label="分类名称" prop="name">
        <template slot-scope="scope">
          <!-- 创建新标签 -->
          <template v-if="editing.isEditing && scope.row.id === editing.index">
            <el-input placeholder="10字以内" v-model="editing.value"></el-input>
          </template>
          <template v-else>{{ scope.row.name }}</template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 创建新标签和编辑的操作 -->
          <!-- 编辑状态 -->
          <template v-if="editing.isEditing && scope.row.id === editing.index">
            <el-button :disabled="!editing.value.length" @click="onConfirm(scope)" type="text">确定</el-button>
            <el-button @click="onCancel(scope)" type="text" v-if="scope.row.id !== 0">取消</el-button>
          </template>
          <!-- 普通状态 -->
          <template v-else>
            <el-button :disabled="isDoing" @click="onEdit(scope)" type="text">编辑</el-button>
            <el-button
              :class="{ 'not-allowed-link': !scope.row.canDelete }"
              :disabled="isAdding"
              @click="onDelete(scope)"
              type="text"
              v-if="scope.row.canDelete"
              >删除</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 创建新标签按钮 -->
    <div class="append-new-tag">
      <el-button :disabled="isAdding || initing" @click="onAddTag" type="text">+新增分类</el-button>
    </div>
    <span slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button :loading="loading" @click="onSave" type="primary">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';

  export default {
    name: 'MerchantTagDialog',
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log(val);
          this.dialogVisible = val;
        },
      },
      dialogVisible(newVal) {
        this.$emit('input', newVal);
      },
    },
    props: {
      value: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    computed: {
      isDoing() {
        return this.editing.isEditing || this.isAdding;
      },
    },
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        // 编辑状态
        editing: {
          index: '',
          value: '',
          isEditing: false,
        },
        // 创建新的分类
        isAdding: false,
        loading: false,
        initing: false,
      };
    },
    methods: {
      // 接口适配器
      tableDataAdapter(data) {
        return data.map(item => {
          item.canDelete = !item.defaultCategory && !item.childCount;
          return item;
        });
      },
      // 获取 tableData 数据
      fetchData() {
        // this.tableData = [{id: 0, name: '基本属性', childCount: 3, defaultCategory: true}, {id: 1, name: '设备信息', childCount: 0, defaultCategory: false}, {id: 2, name: '收入消费', childCount: 1, defaultCategory: false}]
        this.initing = true;
        api
          .getCategories()
          .then(d => {
            this.tableData = this.tableDataAdapter(d.data);
            this.initing = false;
          })
          .catch(e => {
            this.$message.error(e.errorMessage);
          });
      },
      // 操作管理分类
      onConfirm(scope) {
        if (this.editing.value.length && this.editing.value.length <= 10) {
          this.tableData.filter(item => item.id === this.editing.index)[0].name = this.editing.value;
          this.editing.index = '';
          this.editing.value = '';
          this.editing.isEditing = false;
          this.isAdding = false;
        } else {
          this.$message.error('请填写正确的分类名称，长度不要超过 10 个字符');
        }
      },
      onEdit(scope) {
        this.editing.index = scope.row.id;
        this.editing.value = this.tableData.filter(item => item.id === scope.row.id)[0].name;
        this.editing.isEditing = true;
      },
      onDelete(scope) {
        if (!scope.row.canDelete) {
          this.$message.info('该分类下含有标签，无法删除该分类');
          return;
        }
        let index = '';
        this.tableData.forEach((item, _index) => {
          if (item.id === scope.row.id) {
            index = _index;
          }
        });
        this.tableData.splice(index, 1);
      },
      onAddTag() {
        this.isAdding = true;
        const lastId = (this.tableData[this.tableData.length - 1] || {}).id || -1;
        const newId = lastId + 1;
        this.tableData.push({ id: newId, name: '', canDelete: true, newTag: true }); // newTag 识别为新增 tag
        this.onEdit({ row: { id: newId } });
      },
      // 表单按钮
      onCancel(scope) {
        if (!scope.row.name.length) {
          const index = scope.$index;
          this.tableData.splice(index, 1);
        }
        this.editing.isEditing = false;
        this.isAdding = false;
      },
      onSave(scope) {
        this.loading = true;
        const data = {
          businessImpressionTagCategories: this.tableData.map(item => ({
            id: item.newTag ? undefined : item.id,
            name: item.name,
            createTime: item.createTime || undefined,
            childCount: item.childCount >= 0 ? item.childCount : undefined,
          })),
        }; // 根据 newTag 属性判断是否去掉 id 字段
        api
          .addCategory(data)
          .then(d => {
            this.$message.success('保存成功');
            this.$emit('change');
          })
          .catch(e => {
            this.$message.error(e.errorMessage);
          })
          .finally(() => {
            this.dialogVisible = false;
            this.loadng = false;
          });
      },
      onClose() {
        this.dialogVisible = false;
      },
      onDialogClosed() {
        console.log('closed');
      },
    },
    mounted() {
      this.fetchData();
    },
  };
</script>

<style lang="less" scoped>
  .append-new-tag {
    text-align: center;
    /deep/ & > .el-button {
      display: inline-block;
    }
  }
  /deep/ .not-allowed-link span {
    cursor: not-allowed;
    color: #ccc;
    position: relative;
  }
</style>
