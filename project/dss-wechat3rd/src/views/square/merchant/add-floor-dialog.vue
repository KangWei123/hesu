<template>
  <el-dialog
    :title="isEdit ? '编辑楼层' : '新增楼层'"
    :visible.sync="isShow"
    width="500px"
    @open="handleOpen"
    @close="handleClose">
    <el-form
      :model="form"
      :rules="rules"
      label-width="90px"
      ref="floorForm"
    >
      <el-form-item label="楼层名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="onSave" v-loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import merchantApi from '@/dss-wechat3rd/src/api/merchant.js';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    floorName: {
      type: String,
      default: ''
    },
    floorId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入楼层名称', trigger: 'blur' }, { max: 64, message: '不能超过64字符' }]
      }
    };
  },
  computed: {
    ...mapState({
      curStore: 'curStore'
    }),
    isShow: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    isEdit() {
      return this.floorId !== -1;
    }
  },
  methods: {
    handleOpen() {
      this.form.name = this.floorName;
    },
    handleClose() {
      this.$refs.floorForm.resetFields();
    },
    onSave() {
      this.$refs.floorForm.validate(valid => {
        if (valid) {
          if (!this.curStore || !this.curStore.id) {
            this.$message('请先选择商场');
            return false;
          }
          this.loading = true;
          if (this.isEdit) {
            this.onUpdate();
          } else {
            this.onAdd();
          }
        }
      });
    },
    onAdd() {
      let obj = {
        name: this.form.name
      };
      let params = {
        storeId: this.curStore.id,
        storeyDTO: obj
      };
      //params['storeyDTO'] = JSON.stringify(obj);
      console.log(params);
      merchantApi
        .addFloor(params)
        .done(res => {
          this.$emit('refresh');
          this.isShow = false;
        })
        .always(() => {
          this.loading = false;
        });
    },
    onUpdate() {
      let params = {
        id: this.floorId,
        name: this.form.name
      };
      merchantApi
        .updateFloor(params)
        .done(res => {
          this.$emit('refresh');
          this.isShow = false;
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>

</style>
