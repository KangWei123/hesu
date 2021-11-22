<template>
  <div>
    <el-form-item label="选择商品" class="activity-label choose-goods" prop="goodType">
      <el-radio-group v-model="configDetail.type" @change="handleChangeGood">
        <el-radio :label="CHOOSE_TYPE.CATEGORY" style="margin-top: 12px"
          >商品分类:
          <label @click="handleSelect(CHOOSE_TYPE.CATEGORY)" style="color: #09f; font-size: 14px">+请选择</label>
          <div
            class="category-box"
            v-if="showTags.length && configDetail.type == CHOOSE_TYPE.CATEGORY"
            @click="handleSelect(CHOOSE_TYPE.CATEGORY)"
          >
            <el-tag
              v-for="(tag, tagIndex) in showTags"
              :key="tag.id"
              effect="plain"
              @close="handleDelete(CHOOSE_TYPE.CATEGORY, tagIndex)"
              size="small"
              :closable="!disabled"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-radio>

        <br />
        <el-radio :label="CHOOSE_TYPE.GOODS" style="margin-top: 12px"
          >商品:
          <label @click="handleSelect(CHOOSE_TYPE.GOODS)" style="color: #09f; font-size: 14px">+请选择</label>
          <div
            class="good-box"
            style="margin-top: 10px"
            @click="handleSelect(CHOOSE_TYPE.GOODS)"
            v-if="showTags.length && configDetail.type == CHOOSE_TYPE.GOODS"
          >
            <el-tag
              v-for="(tag, tagIndex) in showTags"
              :key="tag.id"
              effect="plain"
              @close="handleDelete(CHOOSE_TYPE.GOODS, tagIndex)"
              size="small"
              :closable="!disabled"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <category-select-dialog
      v-model="showSelectCategoryDialog"
      @choosed="handleCategoryChoosed"
      :selected-categories="showTags"
    />
    <goods-select-dialog
      v-model="showSelectProductDialog"
      enable-multiple
      show-goods-type-tab
      :active-tabs="[goodsTypeEnum.product]"
      :selected-list="showTags"
      @selected="handleProductChoosed"
    />
  </div>
</template>
<script>
  import GoodsSelectDialog from '@/mod-member/src/components/goods-select-dialog/index.vue';
  import CategorySelectDialog from '@/mod-member/src/components/category-select-dialog/index.vue';

  import { CHOOSE_TYPE } from './constants.ts';
  import goodsTypeEnum from '@/mod-member/src/enum/goodsTypeEnum';

  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    components: {
      GoodsSelectDialog,
      CategorySelectDialog,
    },
    data() {
      return {
        goodsTypeEnum,
        configDetail: this.value,
        showTags: this.value.showTags,
        showSelectProductDialog: false,
        showSelectCategoryDialog: false,
        CHOOSE_TYPE,
      };
    },

    watch: {
      // 商品将id转换为itemNo
      value: {
        deep: true,
        handler() {
          if (this.configDetail.type == this.CHOOSE_TYPE.GOODS) {
            this.showTags = this.showTags.map(item => {
              return { ...item, itemNo: item.itemNo || item.id };
            });
          }
        },
      },
    },

    methods: {
      handleUpdateConfig() {
        this.$emit('update', this.configDetail);
      },
      handleCategoryChoosed(selected = []) {
        const ids = [];
        selected = selected.map(item => {
          ids.push(item.id);
          item.name = item.category;
          return item;
        });
        this.showTags = selected;
        this.configDetail.categories = ids;
        this.handleUpdateConfig();
      },
      handleProductChoosed(selected = []) {
        const ids = [];
        selected = (selected || []).map(item => {
          ids.push(item.itemNo);
          return item;
        });
        this.showTags = selected;
        this.configDetail.items = ids;
        this.handleUpdateConfig();
      },
      handleSelect(type) {
        if (!this.disabled) {
          // 切换类型时，清空已选列表
          if (this.configDetail.type !== type) {
            this.showTags = [];
            this.configDetail.type = type;
          }
          switch (type) {
            case CHOOSE_TYPE.GOODS:
              this.showSelectProductDialog = true;
              this.configDetail.categories = [];
              break;
            case CHOOSE_TYPE.CATEGORY:
              this.showSelectCategoryDialog = true;
              this.configDetail.items = [];
              break;
            default:
              break;
          }
        }
      },
      handleChangeGood() {
        this.showTags = [];
        this.configDetail.items = [];
        this.configDetail.categories = [];
      },
      handleDelete(type, tagIndex) {
        switch (type) {
          case CHOOSE_TYPE.GOODS:
            this.configDetail.items.splice(tagIndex, 1);
            break;
          case CHOOSE_TYPE.CATEGORY:
            this.configDetail.categories.splice(tagIndex, 1);
            break;
          default:
            break;
        }
        this.showTags.splice(tagIndex, 1);
        this.handleUpdateConfig();
      },
    },
  };
</script>
<style lang="less" scoped>
  .category-box,
  .good-box {
    padding: 5px 10px;
    border: 1px solid #dce1e6;
    width: 370px;
    // margin-left: 30px;
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;

    .el-tag {
      margin: 0 2px;
    }
  }
</style>
