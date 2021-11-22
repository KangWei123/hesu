<template>
  <div>
    <el-dialog :visible.sync="show" title="添加VR链接" class="vr-dialog" :width="'600px'">
      <el-form label-position="left" label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="展示图片：" prop="imageUrl">
          <image-picker v-model="form.imageUrl" />
        </el-form-item>

        <el-form-item label="VR展示：" prop="vrLink">
          <el-input v-model.trim="form.vrLink" placeholder="请输入VR链接" />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImagePicker from './image-picker';

export default {
  components: {
    ImagePicker
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: {
        imageUrl: '',
        vrLink: ''
      },
      imageRules: {
        imageUrl: { required: true, message: '请选择展示图片' }
      },
      linkRules: {
        vrLink: { required: true, message: '请输入VR链接' }
      }
    };
  },

  computed: {
    rules() {
      return {
        ...this.linkRules,
        ...this.imageRules
      };
    },
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },

  methods: {
    handleCancel() {
      this.$emit('on-cancel');
      this.show = false;
    },

    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('on-submit', this.form);
          this.show = false;
        }
      });
    }
  },

  mounted() {},

  watch: {}
};
</script>

<style lang="less" scoped>
</style>
