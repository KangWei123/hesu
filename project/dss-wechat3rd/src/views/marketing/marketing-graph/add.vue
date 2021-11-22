<template>
  <div class="add">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/marketing-graph/list' }">营销图文</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEdit?'新增':'查看'}}营销图文</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form" v-loading="loading">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-dynamic">
        <el-form-item class="form-item" prop="categoryId" label="文章分类：">
          <el-select v-model="form.categoryId" placeholder="请选择" :disabled="!isEdit || onShelve">
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item" prop="coverUrl" label="文章封面：">
          <img class="cover-img" :src="form.coverUrl" v-if="writable||id" />
          <choose-images v-else v-model="form.coverUrl" @delete="onDeleteUrl" />
          <span class="hint">建议尺寸:174*176</span>
        </el-form-item>
        <el-form-item prop="title" label="文章标题：">
          <el-input
            :maxlength="80"
            style="width: 300px;"
            v-model.trim="form.title"
            :disabled="!isEdit"
          ></el-input>
          <span class="hint">{{form.title?form.title.length:0}}/80</span>
        </el-form-item>
        <el-form-item prop="index" label="排序：">
          <el-input
            :maxlength="20"
            style="width: 300px;"
            v-model.number="form.index"
            :disabled="!isEdit"
          ></el-input>
          <span class="hint">排序决定图文在微商城的图文展示顺序，数字大的排序靠前，数字重复则新增图文靠前</span>
        </el-form-item>
        <el-form-item prop="content" label="正文：" class="umeditor-wrap">
          <div class="umeditor-content" v-html="form.content" />
          <!-- <umeditor
            ref="editor"
            @ready="editorReady"
            :id="umeditorId"
            :config="umeditorConfig"
            @change="contentChange"
            v-model="form.content"
          ></umeditor>-->
        </el-form-item>
        <div class="bottom-button" v-if="isEdit">
          <el-button v-if="writable" type="primary" @click="onUpdate">修改</el-button>
          <el-button v-else type="primary" @click="onSave">保存</el-button>
          <el-button @click="onPreview">预览</el-button>
        </div>
        <div class="bottom-button" v-else>
          <el-button @click="onBack">返回</el-button>
        </div>
        <!-- <el-form-item class="form-btn" v-if="isEdit">
          <el-button v-if="writable" type="primary" @click="onUpdate">修改</el-button>
          <el-button v-else type="primary" @click="onSave">保存</el-button>
          <el-button @click="onPreview">预览</el-button>
        </el-form-item>
        <el-form-item class="form-btn" v-else>
          <el-button type="primary" @click="onBack">返回</el-button>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import umeditor from '../../../components/umeditor/umeditor.vue';
import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import { mapState } from 'vuex';
export default {
  name: 'graph-add',
  components: {
    umeditor,
    ChooseImages
  },
  data() {
    return {
      id: null,
      umeditorId: '1',
      umeditorConfig: {
        readonly: true,
        toolbar: [
          // 'fontfamily paragraph fontsize | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
          // 'insertorderedlist insertunorderedlist | selectall cleardoc',
          // '| justifyleft justifycenter justifyright justifyjustify |',
          // ' emotion link unlink image',
          // '| horizontal fullscreen'
        ]
      },
      form: {
        coverUrl: null,
        title: '',
        content: '',
        categoryId: '',
        index: '',
        status: '',
        author: ''
      },
      rules: {
        coverUrl: [{ required: true, message: '文章封面不能为空' }],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          { min: 1, max: 80, message: '最大长度80个汉字', trigger: 'blur' }
        ],
        content: [{ required: true, message: '文章正文不能为空', trigger: 'blur' }],
        categoryId: [{ required: true, message: '文章分类不能为空', trigger: 'change' }],
        index: [
          { required: true, message: '文章排序不能为空', trigger: 'blur' },
          { type: 'number', message: '排序必须为数字值', trigger: 'blur' }
        ]
      },
      classifyList: [],
      dialogVisible: false,
      isMass: false,
      isEditor: false,
      writable: false,
      date: null,
      loading: false
    };
  },
  computed: {
    isEdit() {
      return this.writable || !this.id;
    },
    onShelve() {
      return this.form.status === 1;
    },
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    onBack() {
      this.$router.back();
    },
    activeValidate() {
      this.$refs.form.validate(() => {});
    },
    handleRemove(file, fileList) {
      //console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.form.coverUrl = file.url;
      this.dialogVisible = true;
    },
    onDeleteUrl() {
      this.form.coverUrl = null;
    },
    submitForm() {},
    editorReady(editor) {
      // editor.setContent(this.store.content || '');
      // let range = editor.selection.getRange();
      // range && range.select();
    },
    fillDetail(data) {
      this.form.categoryId = data.categoryId;
      this.form.index = data.index;
      this.form.status = data.status;
      if (data.title) {
        this.form.title = data.title;
      }
      if (data.content) {
        this.form.content = data.content;
      }
      if (data.coverUrl) {
        this.form.coverUrl = data.coverUrl;
      }
      if (data.author) {
        this.form.author = data.author;
      }
    },
    getDetail() {
      // let params = {
      //   per_chooseAppId: this.userInfo.appInfo.id,
      //   id: this.id
      // };
      // console.log('详情params', params);
      this.loading = true;
      marketArticleApi
        .detail(this.userInfo.appInfo.id, this.id)
        .then(res => {
          let data = res.data;
          //console.log('detail', data);
          this.fillDetail(res.data || {});
        })
        .catch(err => {})
        .finally(() => {
          this.loading = false;
        });
    },
    getClassify() {
      marketArticleApi
        .categoryList({
          pageNo: 1,
          pageSize: 1000,
          deleteFlag: 'N'
        })
        .then(res => {
          this.classifyList = res.data;
        })
        .catch(err => {
          this.classifyList = [];
        });
    },
    // setUeditorError(error) {
    //   this.$refs.editor && this.$refs.editor.setError(error);
    // },
    // contentChange(val) {
    //   let { content, text } = val;
    //   this.form.content = content;
    //   // this.store.content = content;
    //   // this.store.defaultDigest = text;
    //   if (!!val) {
    //     this.setUeditorError(false);
    //   }
    // },
    onPreview() {
      this.date = new Date().getTime();
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            title: this.form.title,
            content: this.form.content,
            updateTime: this.date
          };
          localStorage.setItem('_market_graph_preview', JSON.stringify(params));
          window.open('/wkb.html#/marketing/marketing-graph/list/preview', '_blank');
        } else {
          return false;
        }
      });
    },
    submit(send, preview) {
      let graphicList = this.form;
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {
            isMass: this.isMass ? 1 : 0,
            content: JSON.stringify({
              article: graphicList
            })
          };
          this.isEditor ? this.editor(data, send, preview) : this.add(data, send, preview);
        } else {
          return false;
        }
      });
    },
    editor(data, send, preview) {
      this.loading = true;
      this.closePreviewUser();
      marketArticleApi
        .update(data)
        .done(res => {
          if (preview) return this.preview(res);
          if (send) return this.$router.push(`/marketing/marketing-graph/list/add?type=graphic&graphicid=${res.data}`);
          this.$router.push('/marketing/marketing-graph/list');
        })
        .catch(res => {
          this.$message.error('保存失败');
        })
        .always(() => {
          this.loading = false;
        });
    },
    onUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            id: this.id,
            index: this.form.index,
            categoryId: this.form.categoryId,
            homeArticle: 0,
            homeIndex: 0,
            title: this.form.title,
            coverUrl: this.form.coverUrl,
            content: this.form.content
          };
          marketArticleApi
            .update(params)
            .then(res => {
              //console.log('新增-->', res);
              this.$message({
                type: 'success',
                message: '修改营销图文成功'
              });
              this.$router.push('/marketing/marketing-graph/list'); //跳转至列表页
            })
            .catch(err => {
              console.error('修改err', err);
            });
        } else {
          return false;
        }
      });
    },
    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            index: this.form.index,
            categoryId: this.form.categoryId,
            homeArticle: 0,
            homeIndex: 0,
            title: this.form.title,
            coverUrl: this.writable ? this.form.coverUrl : this.form.coverUrl.imgUrl,
            content: this.form.content,
            author: '',
            digest: '',
            contentSourceName: '',
            contentSourceUrl: '',
            viewsCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0
          };
          marketArticleApi
            .add(params)
            .then(res => {
              this.$message({
                type: 'success',
                message: '创建营销图文成功'
              });
              this.$router.push('/marketing/marketing-graph/list'); //跳转至列表页
            })
            .catch(err => {
              console.error('创建err', err);
            });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.writable = this.$route.query.writable === 'true';
    // console.log('writable', this.writable);
    this.getClassify();
    if (this.id) {
      this.getDetail();
      console.log('id', this.id);
    } else {
      return;
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  // margin-top: 20px;
  padding-bottom: 20px;
  background: #fff;
  .form-item {
    position: relative;
  }
  .hint {
    color: #999999;
    font-size: 14px;
    font-weight: normal;
    margin-left: 5px;
  }
  .cover-img {
    width: 174px;
    height: 174px;
  }
  .form-btn {
    position: fixed;
    bottom: -20px;
    z-index: 5000;
    width: 90%;
    height: 60px;
    display: flex;
    background: #fff;
    align-items: center;
    border-top: 1px solid #dedede;
    z-index: 999;
  }
  .max-length {
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    position: absolute;
  }
  .umeditor-wrap {
    max-width: 800px;
    .umeditor-content {
      border: 1px solid #eee;
      padding: 16px;
    }
  }
}
</style>
