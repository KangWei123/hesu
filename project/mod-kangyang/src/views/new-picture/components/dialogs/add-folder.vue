<template>
  <el-dialog
    :title="isEdit ? '编辑文件夹' : '新建文件夹'"
    :visible.sync="showPopup"
    append-to-body
    class="common-dialog"
    width="420px"
  >
    <el-form :model="form" ref="form" :rules="rules" class="upload-from" label-width="90px">
      <el-form-item label="文件夹名称：" prop="name">
        <el-input v-model.trim="form.name" maxlength="20" placeholder="请输入文件夹名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="创建位置：" prop="parentId" v-if="showGroup">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          :props="defaultProps"
          change-on-select
          filterable
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitUpload">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import materialEnum from '../material-type';

  export default {
    name: 'AddFolder',
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    props: {
      // 是否显示弹窗
      visible: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
      showGroup: {
        type: Boolean,
        default: true,
      },
      isEdit: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      // 规则，中文占 2 个字节，其他算一个字节
      const checkByte = (rule, value, callback) => {
        if (value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 20) {
          callback(new Error(`不超过20字节，中文2字节，英文/数字1字节`));
        }
        callback();
      };

      return {
        options: [
          {
            id: 0,
            name: '全部',
            subFolderList: null,
            domainId: [],
          },
        ],
        defaultProps: {
          value: 'id',
          label: 'name',
          children: 'subFolderList',
        },
        form: {
          name: '',
          parentId: null,
          materialType: materialEnum.materialType.IMAGE,
          moduleType: this.moduleType,
        },
        selectedOptions: [],
        rules: {
          name: [
            { required: true, message: '请输入文件夹名称', trigger: 'blur' },
            {
              validator: checkByte,
              trigger: 'blur',
            },
          ],
          parentId: [{ required: true, message: '请选择创建位置', trigger: 'blur' }],
        },
      };
    },
    computed: {
      // 计算属性-是否显示弹窗
      showPopup: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },

    mounted() {
      if (this.isEdit) {
        this.form.id = this.data.id;
        this.form.name = this.data.groupName;
        this.form.parentId = this.data.parentId;
      } else {
        this.form.parentId = this.data.id;
      }
      this.queryTree();
    },

    methods: {
      queryTree() {
        const params = {
          materialType: materialEnum.materialType.IMAGE,
          moduleType: this.moduleType,
        };
        elderSpaceApi
          .queryTree(params)
          .then(res => {
            this.options[0].subFolderList = res.data || [];
            if (this.isElderSpace) {
              // 长者空间不允许在"全部"下面新建文件夹（包括修改文件夹时）
              this.options[0].disabled = true;
            }
            this.options = [...this.options];
            const selectOptions = [];
            this.filterOptions(this.options, selectOptions);
          })
          .always(res => {});
      },
      // 递归，过滤数组，获取当前选中
      filterOptions(options, selectOptions) {
        options.forEach(item => {
          item.groupName = item.name;
          item.domainId = [].concat(selectOptions);
          item.domainId.push(item.id);
          // 文件夹最多三级
          if (item.level === 2) {
            item.subFolderList = null;
          }
          // 编辑时不能移动到自己下级，去除下级
          if (item.id === this.form.id) {
            item.subFolderList = null;
          }
          // 得到当前选中的节点
          if (item.id === this.form.parentId) {
            this.selectedOptions = item.domainId;
          }
          if (item.subFolderList && item.subFolderList.length) {
            this.filterOptions(item.subFolderList, item.domainId);
          } else {
            item.subFolderList = null;
          }
        });
      },

      handleChange() {
        this.form.parentId = this.selectedOptions[this.selectedOptions.length - 1];
      },
      // 关闭弹窗
      handleClose() {
        this.showPopup = false;
      },
      // 确定
      submitUpload() {
        if (this.selectedOptions && this.selectedOptions.length) {
          this.form.parentId = this.selectedOptions[this.selectedOptions.length - 1];
        }

        this.$refs.form.validate(valid => {
          if (valid) {
            const params = this.form;
            let fun = elderSpaceApi.addFolder;
            if (this.isEdit) {
              fun = elderSpaceApi.updateFolder;
            }
            fun(params)
              .then(res => {
                this.showPopup = false;
                this.$emit('submit');
              })
              .always(res => {});
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '../../css/common.less';

  .common-dialog {
    .upload-from {
      padding: 0 12px;
      text-align: left;

      .upload-box {
        text-align: center;

        /deep/ .el-upload-dragger {
          width: 836px;
          height: 224px;
          background: #fff;
          border: 1px solid #ebeef5;
          border-radius: 4px;

          .upload-icon {
            margin-top: 30px;
            width: 68px;
            height: 68px;
          }

          .el-upload__text {
            font-size: 14px;
            color: #303133;
            line-height: 20px;
            margin-top: 8px;
          }

          .el-upload__tip {
            font-size: 14px;
            color: #a1a4ab;
            line-height: 20px;
            margin-top: 8px;
          }
        }
      }
    }
  }
</style>
