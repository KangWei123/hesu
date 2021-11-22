<template>
  <div class="goods-params-setting">
    <div>banner:</div>
    <choose-images v-model="parammaterialsId[index]"
        :is-disabled-edit='isDisabledEdit || disabledForm'
        :height="176"
        style="margin-right: 10px;"
        @input="onImageAdd(index)"
        @delete="onDeleteImg(index)"
        :multiple="parammaterialsId[index].id===0"
        v-for="(item, index) in parammaterialsId"
        :key="index"
        :limit='limit'
        :disable='goodsImgCountLimit(index)' />
    <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">建议尺寸750*300，建议图片小于2M</div>

    <!-- 参数列表 -->
    <div class="params-list">
      <el-table
        max-height="300"
        style="width: 100%;"
        :data="paramSetting">
        <el-table-column
          prop="name"
          label="参数名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="content"
          label="参数内容">
          <template slot-scope="scope">
            <div class="content-row">
              <el-input v-model="scope.row.content" class="content-input" maxlength="100" placeholder="请输入参数内容"></el-input>
              <span class="calc-num">{{scope.row.content.length || 0}}/100</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="imgUrl"
          label="图片"
          width="120">
          <template slot-scope="scope">
            <choose-images v-model="scope.row"
              :is-disabled-edit='isDisabledEdit || disabledForm'
              :height="60"
              :width="60"
              :unique="scope.$index"
              style="margin-right: 10px;"
              @input="onParamImageAdd"
              @delete="onParamDeleteImg(scope.row, scope.$index)"
              :limit='1'/>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          align="left">
          <template slot="header">
            <params-template-popover @select="onChangParamTempalte"></params-template-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/index.js';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import ParamsTemplatePopover from './params-template-popover.vue';
import api from '@/dss-wechat3rd/src/api/template.js';

export default {
  name: 'goods-params-setting',
  components: {
    ChooseImages,
    ParamsTemplatePopover
  },
  props: {
    paramBannerUrl: {
      type: Array,
      default: () => []
    },
    paramSetting: {
      type: Array,
      default: () => []
    },
    // 是否不允许整个商品
    disabledForm: {
      type: Boolean,
      default: false
    },
    // 是否不允许编辑敏感信息
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    // 商品当前选中的分类
    selectedCategorys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      limit: 5,
      parammaterialsId: [],
      parammaterialsUrl: []
    };
  },
  computed: {
    maxLength() {
      return 5;
    },
    goodsImgCountLimit() {
      return function(index) {
        return index < 5;
      };
    }
  },
  mounted() {
    this.initGoodsMaterials();
  },
  watch: {
    selectedCategorys: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          if (!this.paramSetting.length) {
            this.autoSelectParamTempalte();
          }
        });
      }
    }
  },
  methods: {
    onImageAdd(index) {
      //多选返回的是图片数组，遍历数组
      if (index === this.parammaterialsId.length - 1) {
        const deletedUrl = this.parammaterialsId.splice(index, 1);
        deletedUrl[0].forEach(item => {
          if (this.parammaterialsId.length < 5) {
            this.parammaterialsId.push(item);
          }
        });
        index = this.parammaterialsId.length - 1;
      } else {
        this.parammaterialsUrl[index] = this.parammaterialsId[index].imgUrl;
      }
      this.addWaitUploadImage(this.parammaterialsId, this.parammaterialsUrl, index);
      this.getLimit();
      this.formatUrlList();
    },
    getLimit() {
      this.limit = this.maxLength - this.parammaterialsId.length + 1;
    },
    // 更新图片列表
    addWaitUploadImage(materialsId, materialUrls, index) {
      if (utils.isUndefined(index) || index === materialsId.length - 1) {
        materialUrls.push('');
        materialsId.push({
          id: 0,
          imgUrl: ''
        });
      }
    },
    // 删除图片
    onDeleteImg(index) {
      this.parammaterialsId.splice(index, 1);
      this.parammaterialsUrl.splice(index, 1);
      this.getLimit();
      this.formatUrlList();
    },
    //初始化 商品图片素材
    initGoodsMaterials() {
      let materialsId = this.parammaterialsId ? this.parammaterialsId : [];
      let newUrls = [];
      let materialUrls = this.$plain(this.paramBannerUrl || []);

      if (materialUrls && materialUrls.length) {
        materialUrls.forEach((imgUrl, index) => {
          if (!!imgUrl) {
            materialsId[index] = {
              id: materialsId[index],
              imgUrl: imgUrl
            };
            newUrls.push(imgUrl);
          }
        });
        materialUrls = newUrls;
      }

      this.addWaitUploadImage(materialsId, materialUrls);
      this.getLimit();
      this.parammaterialsId = materialsId;
      this.parammaterialsUrl = materialUrls;
    },
    formatUrlList() {
      const materialsId = this.parammaterialsId.slice();
      let materialUrls = [];
      materialsId.forEach(item => {
        if (item && item.id) {
          materialUrls.push(item.imgUrl);
        }
      });
      materialUrls = materialUrls.filter(url => {
        return !!url;
      });
      this.$emit('update-param-banner', materialUrls);
    },
    // 切换模板
    onChangParamTempalte(paramList) {
      this.paramSetting.splice(0, this.paramSetting.length);
      paramList.forEach(item => {
        this.paramSetting.push({
          name: item,
          content: '',
          imgUrl: ''
        });
      });
    },
    onParamImageAdd(imgObj, index) {
      this.paramSetting[index].imgUrl = imgObj.imgUrl;
    },
    onParamDeleteImg(row, index) {
      const item = this.paramSetting[index];
      item.imgUrl = '';
      this.paramSetting.splice(index, 1, item);
    },
    // 需求：当前选中的商品分类下有参数模板的话，选择分类，参数模板要自动填充一个最新的模板
    autoSelectParamTempalte() {
      if (this.selectedCategorys && this.selectedCategorys.length) {
        this.fetchParamsList(this.selectedCategorys[0]).then(res => {
          let paramsList = res.data || [];
          if (!paramsList.length) return;
          this.onChangParamTempalte(paramsList[0].paramList);
        });
      }
    },
    fetchParamsList(id) {
      return api.getParameterList({
        categoryId: id,
        pageNo: 0,
        pageSize: 0
      });
    }
  }
};
</script>

<style lang="less" scoped>
.goods-params-setting {
  max-width: 1040px;
  .params-list {
    min-width: 630px;
    width: 100%;
    max-height: 300px;

    /deep/ .content-row {
      display: flex;
      .content-input.el-input {
        flex: 1;

        .el-input__inner {
          width: 100%;
        }
      }

      .calc-num {
        width: 60px;
        line-height: 30px;
        margin-left: 2px;
      }
    }
  }
}
</style>
