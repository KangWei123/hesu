<template>
  <div>
    <el-dialog :visible.sync="show" title="添加小程序链接" class="minapp-dialog" :width="'600px'">
      <el-form label-position="left" label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="小程序ID：" prop="minappId">
          <el-input v-model="form.wxMiniprogramId" disabled />
        </el-form-item>

        <el-form-item label="跳转类型" prop="pageType">
          <el-radio-group v-model="form.pageType">
            <el-radio :label="'page'">页面</el-radio>
            <el-radio :label="'goods'">商品</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="小程序路径：" prop="miniprogramUrl" v-if="form.pageType === 'page'">
          <tabbar-link-select
            v-if="this.wxAuthInfo && this.form.wxMiniprogramId == this.wxAuthInfo.wxMaAppId"
            @change="pickMinappPath"
          />
          <el-input v-model.trim="form.miniprogramUrl" v-else />
        </el-form-item>
        <el-form-item label="商品页面：" prop="miniprogramUrl" v-if="form.pageType === 'goods'">
          <div>
            <el-button @click="handleOpenSkuDialog">选择商品</el-button>
            <span>{{ form.goodsItem ? '已选商品：' + form.goodsItem.name : '' }}</span>
          </div>
        </el-form-item>
        <el-form-item label="展示方式：" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio v-for="item of typeList" :key="item.value" :label="item.value">{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文字内容：" prop="text" v-if="form.type === 0">
          <el-input v-model.trim="form.text" />
        </el-form-item>
        <el-form-item label="上传图片：" prop="imageUrl" v-else-if="form.type === 1">
          <image-picker v-model="form.imageUrl" />
        </el-form-item>

        <template v-else>
          <el-form-item label="卡片标题" prop="minappCardTitle">
            <el-input v-model.trim="form.minappCardTitle" />
            <span :class="{ tip: true, warning: form.minappCardTitle.length > 35 }"
              >{{ form.minappCardTitle.length }}/35</span
            >
          </el-form-item>
          <el-form-item label="小程序卡片：" prop="minappCardImageUrl">
            <minapp-card :title="form.minappCardTitle" v-model="form.minappCardImageUrl" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <goods-select-dialog
      v-model="showSkuDialog"
      :active-tabs="computeActiveTabs"
      @single-choosed="onChooseSkuProduct"
    ></goods-select-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/business-common/store.js';
import service from '../../api';
import TabbarLinkSelect from '@/dss-wechat3rd/src/bz_components/tabbarLinkSelect/index.vue';
import ImagePicker from './image-picker';
import MinappCard from './minapp-card';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';

export default {
  components: {
    TabbarLinkSelect,
    ImagePicker,
    MinappCard,
    GoodsSelectDialog
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const checkMiniprogramUrl = (rules, value, callback) => {
      if (!value) {
        return callback('小程序路径不能为空');
      } else if (this.form.miniprogramUrl.linkType && !this.form.miniprogramUrl.detailId) {
        return callback(this.form.miniprogramUrl.name + '详情项不能为空');
      } else {
        return callback();
      }
    };
    return {
      showSkuDialog: false,
      typeList: [
        { text: '文字', value: 0 },
        {
          text: '图片',
          value: 1
        },
        {
          text: '小程序卡片',
          value: 2
        }
      ],
      customPages: [],
      form: {
        wxMiniprogramId: '',
        miniprogramUrl: '',
        _miniprogramUrl: '',
        type: 0,
        text: '',
        imageUrl: '',
        minappCardTitle: '',
        minappCardImageUrl: '',
        pageType: 'page',
        goodsItem: null
      },
      baseRules: {
        wxMiniprogramId: { required: true },
        type: { required: true },
        pageType: { required: true },
        miniprogramUrl: { validator: checkMiniprogramUrl, trigger: 'change' }
      },
      textRules: {
        text: { required: true, message: '请输入显示的文本' }
      },
      imageRules: {
        imageUrl: { required: true, message: '请上传显示的图片' }
      },
      cardRules: {
        minappCardTitle: [
          { required: true, message: '请输入小程序标题' },
          { max: 35, message: '长度不超过 35 个字符', trigger: 'blur' }
        ],
        minappCardImageUrl: { required: true, message: '请上传显示的图片' }
      }
    };
  },

  computed: {
    ...mapState({
      wxAuthInfo: 'wxAuthInfo',
      curTemplateId: 'sellerTemplateId'
    }),
    rules() {
      return {
        ...(this.baseRules || {}),
        ...([this.textRules, this.imageRules, this.cardRules][this.form.type] || {})
      };
    },
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    computeActiveTabs() {
      return [goodsTypeEnum.product];
    }
  },

  methods: {
    onChooseSkuProduct(goodsItem) {
      this.form.goodsItem = goodsItem;
      console.log(goodsItem);
      this.form.miniprogramUrl = `wxat-common/pages/goods-detail/index?itemNo=${goodsItem.itemNo}&source=quick_buy`;
    },
    handleOpenSkuDialog() {
      this.showSkuDialog = true;
    },
    useSystemMaAppId() {
      service.getCustomPages({ sellerTemplateId: this.curTemplateId }).then(response => {
        this.customPages = response.data;
        store.commit('set_customPages', response.data);
        this.form.wxMiniprogramId = this.wxAuthInfo ? this.wxAuthInfo.wxMaAppId : '';
      });
    },
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
    },
    pickMinappPath(params) {
      const path = JSON.parse(params.slice(-1)[0]);
      this.form.miniprogramUrl = path && path.index;
      // 拼接完整的自定义页面路径
      this.form.miniprogramUrl = this.form.miniprogramUrl.replace(/^pages\/custom/, 'wxat-common/pages/custom');
    }
  },

  mounted() {
    this.useSystemMaAppId();
  },

  watch: {
    'form.miniprogramUrl': {
      handler: function() {
        if (this.form.pageType === 'page' && this.form.miniprogramUrl) {
          // 备份下，切换回页面路径时还原
          this.form._miniprogramUrl = this.form.miniprogramUrl;
        }
      },
      deep: true
    },
    'form.pageType': {
      handler: function() {
        this.form.miniprogramUrl = '';
        if (this.form.pageType === 'goods') {
          if (this.form.goodsItem) {
            this.form.miniprogramUrl = `wxat-common/pages/goods-detail/index?itemNo=${this.form.goodsItem.itemNo}&source=quick_buy`;
          }
        } else {
          this.form.miniprogramUrl = this.form._miniprogramUrl;
        }
      },
      deep: true
    },
    'form.type': {
      handler: function() {
        this.$refs.form.clearValidate();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.minapp-dialog {
  .el-input {
    min-width: 155px;
    max-width: 50%;
  }
  .tip {
    color: #999;
    font-size: 14px;
    &.warning {
      color: red;
    }
  }
}
</style>
