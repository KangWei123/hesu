<template>
  <el-dialog title="商家评论" :visible.sync="show" width="400px" @close="show = false">
    <el-form label-width="80px" :model="form" :rules="rules" ref="form" v-loading="loading">
      <el-form-item prop="replyComment" label="商家回复">
        <textarea v-model.trim="form.replyComment" placeholder="请输入评论内容" style="width: 250px; height: 100px;">
        </textarea>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="loading">提交</el-button>
    </template>
  </el-dialog>
</template>
<script>
import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleName: {
      type: String,
      default: ''
    },
    articleId: {
      type: Number,
      default: null
    },
    commentId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      form: {
        replyComment: ''
      },
      rules: {
        replyComment: [{ required: true, message: '评论内容不能为空！', trigger: 'blur' }]
      }
    };
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        if (!val) {
          this.form.replyComment = '';
        }
        this.$emit('input', val);
      }
    }
  },

  methods: {
    handleSubmit() {
      if (!this.articleId) {
        return this.$message.error('获取文章ID失败');
      } else if (!this.commentId) {
        return this.$message.error('获取图文评论ID失败');
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          marketArticleApi
            .addReplyComment({
              articleName: this.articleName,
              articleId: this.articleId,
              replyId: this.commentId,
              content: this.form.replyComment
            })
            .then(res => {
              this.$message.success('添加回复评论成功');
              this.show = false;
              this.$emit('refreshList');
            })
            .finally(_ => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
textarea {
  padding: 5px;
  border: 1px solid #ddd;
}
</style>
