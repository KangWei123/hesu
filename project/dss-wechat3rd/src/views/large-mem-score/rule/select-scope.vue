<template>
  <div>
    <el-form-item label="选择范围" :prop="prop">
      <el-radio-group v-model="configDetail.type" @change="handleChangeGood">
        <el-radio :label="CHOOSE_TYPE.BUSINESS_CATEGORY" style="margin-top: 12px">
          经营类目:
          <label @click="handleSelect(CHOOSE_TYPE.BUSINESS_CATEGORY)" style="color: #09f">+请选择</label>
          <div
            class="good-box"
            style="margin-top: 10px"
            @click="handleSelect(CHOOSE_TYPE.BUSINESS_CATEGORY)"
            v-if="configDetail.showTags.length && configDetail.type == CHOOSE_TYPE.BUSINESS_CATEGORY"
          >
            <el-tag
              v-for="(tag, tagIndex) in configDetail.showTags"
              :key="tag.itemId"
              effect="plain"
              @close="handleDelete(CHOOSE_TYPE.BUSINESS_CATEGORY, tagIndex)"
              size="small"
              :closable="!disabled"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-radio>

        <br />
        <el-radio :label="CHOOSE_TYPE.MERCHANT" style="margin-top: 12px">
          商户:
          <label @click="handleSelect(CHOOSE_TYPE.MERCHANT)" style="color: #09f">+请选择</label>
          <div
            class="good-box"
            style="margin-top: 10px"
            @click="handleSelect(CHOOSE_TYPE.MERCHANT)"
            v-if="configDetail.showTags.length && configDetail.type == CHOOSE_TYPE.MERCHANT"
          >
            <el-tag
              v-for="(tag, tagIndex) in configDetail.showTags"
              :key="tag.itemId"
              effect="plain"
              @close="handleDelete(CHOOSE_TYPE.MERCHANT, tagIndex)"
              size="small"
              :closable="!disabled"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <select-dialog
      v-model="showSelectBusinessCategoryDialog"
      @choosed="e => handleChoosed('categories', e)"
      title="适用经营类目"
      :columns="[{ label: '经营类目', prop: 'categoryName' }]"
      :format-data="handleFormatCategoryData"
      :selected="configDetail.showTags"
      :on-fetch="handleFetchCategoryList"
    />
    <select-dialog
      v-model="showSubStoreDialog"
      @choosed="e => handleChoosed('items', e)"
      title="选择适用商户"
      :columns="[{ label: '商户', prop: 'name' }]"
      :selected="configDetail.showTags"
      :on-fetch="handleFetchStoreList"
    />
  </div>
</template>
<script>
  import SelectDialog from './select-dialog.vue';
  import { CHOOSE_TYPE } from './constant.ts';
  import api from '../../../api/large-mem-score';

  export default {
    props: {
      prop: {
        type: String,
        default: 'scope',
      },
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
      SelectDialog,
    },
    data() {
      return {
        configDetail: this.value,
        showSelectBusinessCategoryDialog: false,
        showSubStoreDialog: false,
        CHOOSE_TYPE,
      };
    },
    watch: {
      value: {
        handler(val) {
          this.configDetail = val;
        },
      },
    },
    methods: {
      handleUpdateConfig() {
        this.$emit('update', { ...this.configDetail });
      },

      async handleFetchCategoryList(params) {
        return await api.customer.businessCategoryList(params);
      },
      async handleFetchStoreList(params) {
        return await new Promise((response, rej) => {
          api.customer
            .queryBusinessList(params)
            .then(res => {
              response({ ...res, data: res.data.filter(i => !!i.active) });
            })
            .catch(rej);
        });
      },
      // 格式化经营类目数据，返回统一格式
      handleFormatCategoryData(list) {
        return list.map(i => ({ ...i, name: i.name || i.categoryName }));
      },
      handleChoosed(key, selected) {
        const ids = [];
        selected.forEach(item => {
          ids.push(item.id);
        });
        this.configDetail.showTags = selected;
        this.configDetail[key] = ids;
        this.handleUpdateConfig();
      },
      handleSelect(type) {
        if (!this.disabled) {
          // 切换类型时，清空已选列表
          if (this.configDetail.type !== type) {
            this.configDetail.showTags = [];
            this.configDetail.type = type;
          }
          switch (type) {
            case CHOOSE_TYPE.BUSINESS_CATEGORY:
              this.showSelectBusinessCategoryDialog = true;
              this.configDetail.items = [];
              break;
            case CHOOSE_TYPE.MERCHANT:
              this.showSubStoreDialog = true;
              this.configDetail.categories = [];
              break;
            default:
              break;
          }
        }
      },
      handleChangeGood() {
        // 切换类型时，清空已选列表
        this.configDetail.showTags = [];
        this.configDetail.categories = [];
        this.configDetail.items = [];
        this.handleUpdateConfig();
      },
      handleDelete(type, tagIndex) {
        switch (type) {
          case CHOOSE_TYPE.BUSINESS_CATEGORY:
            this.configDetail.categories.splice(tagIndex, 1);
            break;
          case CHOOSE_TYPE.MERCHANT:
            this.configDetail.items.splice(tagIndex, 1);
            break;
          default:
            break;
        }
        this.configDetail.showTags.splice(tagIndex, 1);
        this.handleUpdateConfig();
      },
    },
  };
</script>
<style lang="less" scoped>
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
