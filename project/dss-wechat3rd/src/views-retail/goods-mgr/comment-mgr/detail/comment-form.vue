<template>
  <div class="comment-add">
    <el-form :model="commentForm"
             ref="commentForm"
             :rules="rules"
             v-loading="loading"
             class="comment-form"
             label-width="95px">

      <el-form-item label="选择商品："
                    prop="itemNo">
        <el-button @click="handleAddGoods"
                   round>添加商品</el-button>
      </el-form-item>
      <el-form-item class="comment-label"
                    v-if="skuInfo.itemNo">
        <div class="goods-info">
          <img :src="skuInfo.thumbnail" /><span>{{skuInfo.itemName}} {{skuInfo.itemAttrAsStr}}</span>
        </div>
      </el-form-item>

      <goods-select-dialog v-model="showSkuDialog"
                           choose-sku
                           :active-tabs="computeActiveTabs"
                           @single-choosed="onChooseSku">
      </goods-select-dialog>

      <el-form-item label="用户昵称："
                    prop="userName">
        <el-input placeholder="请输入用户昵称"
                  v-model="commentForm.userName"
                  class="comment-w366 primary-inputHeight"></el-input>
      </el-form-item>

      <el-form-item label="评价等级："
                    prop="grade">

        <el-select v-model="commentForm.grade"
                   placeholder="请选择"
                   prop="grade"
                   class="comment-w366 primary-inputHeight">
          <el-option label="好评"
                     :value="commentEnum.grade.PRAISE"></el-option>
          <el-option label="中评"
                     :value="commentEnum.grade.MIDDLE"></el-option>
          <el-option label="差评"
                     :value="commentEnum.grade.BAD"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="评论内容："
                    prop="content">
        <el-input placeholder="请输入评论内容"
                  type="textarea"
                  v-model="commentForm.content"
                  maxlength="140"
                  :autosize="{ minRows: 8, maxRows: 8}"
                  class="comment-describe"></el-input>
      </el-form-item>

      <!--图片-->
      <el-form-item label="评论图片"
                    prop="images">
        <image-selector style="margin-top: 10px;margin-right:10px;"
                        v-model="images[index]"
                        :height="176"
                        @delete="onDeleteImg(index)"
                        @input="onImageAdd(index)"
                        v-for="(item, index) in images"
                        :disable='index<3' 
                        :key="index" />
        <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">建议尺寸1:1,最多3张图片</div>
      </el-form-item>

      <div class="bottom-button">
        <el-button type="primary"
                   @click="onSubmit('commentForm')">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import './comment-form.less';
import commentEnum from '@/dss-wechat3rd/src/constants/commentEnum.js';
import commentAPI from '@/dss-wechat3rd/src/api/commentAPI.js';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
export default {
  name: 'comment-form',
  components: { GoodsSelectDialog, ImageSelector },

  data() {
    return {
      commentAPI,
      commentEnum,
      showSkuDialog: false,
      images: [{}],
      commentForm: {
        images: [],
        itemNo: null
      },
      skuInfo: {},
      loading: false,
      rules: {
        itemNo: [{ required: true, message: '请选择商品', trigger: 'blur' }],
        userName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16个字符', trigger: 'blur' }
        ],
        grade: [{ required: true, message: '请选择评价等级', trigger: 'change' }],
        content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapState({
      env: 'env'
    }),
    computeActiveTabs() {
      return this.env.BEAUTIFUL ? [goodsTypeEnum.server, goodsTypeEnum.product] : [goodsTypeEnum.product];
    }
  },
  methods: {
    handleAddGoods(e) {
      this.showSkuDialog = true;
    },
    onCancel() {
      this.$router.push({
        path: '/retail/goods-mgr/comment-mgr'
      });
    },

    onSubmit(refName) {
      this.$refs[refName]
        .validate()
        .then(valid => {
          if (!valid) {
            return;
          }

          this.commentForm.images = [];
          this.images.forEach(item => {
            if (item.imgUrl) {
              this.commentForm.images.push(item.imgUrl);
            }
          });
          const params = {
            ...this.commentForm
          };
          this.loading = true;
          commentAPI
            .addComment(params)
            .done(res => {
              this.$router.push({
                path: '/retail/goods-mgr/comment-mgr'
              });
            })
            .always(() => {
              this.loading = false;
            });
        })
        .catch(res => {
          return false;
        });
    },

    onImageAdd(index) {
      this.images.push({});
    },

    onDeleteImg(index) {
      this.images.splice(index, 1);
    },

    onValidityChang() {
      this.$refs.commentForm.validateField('itemNo');
    },

    onChooseSku(skuInfo) {
      this.commentForm.itemNo = skuInfo.itemNo;
      this.commentForm.skuId = skuInfo.skuId;
      this.skuInfo = skuInfo;
      this.onValidityChang();
    }
  }
};
</script>
