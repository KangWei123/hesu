<template>
  <el-dialog
    title="新增分类"
    :visible.sync="visible"
    width="300"
    @open="fetchCategoryList"
    @close="resetForm('form')">
    <el-form
      :model="form"
      :rules="rules"
      style="padding: 20px 0;"
      ref="form"
      v-loading="loading"
      label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-select v-model="form.name"
                  filterable
                  allow-create
                  default-first-option
                  class="primary-attr-select"
                  @change="onAttrParentSelect"
                  popper-class="custom-select"
                  placeholder="选择或输入规格">
          <el-option v-for="item in categoryOptions"
                    :key="item.id"
                    :disabled="item.disabled"
                    :label="item.attrName"
                    :value="item.attrName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

     <div slot="footer" style="text-align: center;">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
     </div>
  </el-dialog>
</template>

<script>
import constants from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';

export default {
  name: 'add-category-dialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    parentNode: {
      type: Object,
      default: () => {}
    },
    type: {
      type: [Number, String],
      default: 1
    },
    skuTreeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { max: 6, message: '最多支持6个字符', trigger: 'change' }
        ]
      },
      categoryOptions: [],
      currentSelectItem: {}
    };
  },
  computed: {
    visible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.save(this.form.name);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.visible = false;
      this.currentSelectItem = {};
      this.categoryOptions = [];
      this.loading = false;
    },
    save() {
      if (!this.currentSelectItem || !this.currentSelectItem.id) {
        this.$message({
          type: 'warning',
          message: '当前规格分类选项未成功创建，请重新操作'
        });
        return;
      }
      const category = {
        attrKeySort: 0,
        childAttrMap: [],
        treeValList: [],
        keyId: this.currentSelectItem.id,
        keyName: this.currentSelectItem.attrName,
        leafTag: 0,
        mapLevel: this.parentNode && this.parentNode.mapLevel ? this.parentNode.mapLevel + 1 : 1,
        moreInfoUrl: '',
        parentId: (this.parentNode && this.parentNode.keyId) || 0,
        showImage: 1,
        skuExplain: '',
        skuShowType: 2,
        parentKeyId: this.parentNode && this.parentNode.parentKeyId ? this.parentNode.parentKeyId : 0, // 根节点(一级分类)的keyId： 一级分类parentKeyId： 0  二级后parentKeyId指向一级分类的keyId
        parentKeyName: this.parentNode && this.parentNode.parentKeyName ? this.parentNode.parentKeyName : '' // 根节点(一级分类)的keyName
      };
      // if (category.mapLevel === 1) {
      //   category.parentKeyId = 0;
      //   category.parentKeyName = '';
      // }else
      if (category.mapLevel === 2) {
        category.parentKeyId = this.parentNode.keyId;
        category.parentKeyName = this.parentNode.keyName;
      }
      // else {
      //   category.parentKeyId = this.parentNode.parentKeyId;
      //   category.parentKeyName = this.parentNode.parentKeyName;
      // }
      this.$emit('save', category);
      this.visible = false;
    },
    apiAddGoodAttribute(attrName) {
      const params = {
        type: this.type,
        attrName
      };
      this.loading = true;
      if (this.parentNode && this.parentNode.keyId) params.parentId = this.parentNode.keyId;
      return services
        .post(constants.Api.goods.attribute.add, params, {
          action: '添加规格分类'
        })
        .then(res => {
          if (!res.success || !res.data) {
            return;
          }
          this.categoryOptions.push({ attrName: attrName, id: res.data, type: this.type });
          this.currentSelectItem = this.categoryOptions[this.categoryOptions.length - 1];
          // return new Promise((resolve, reject) => {
          //   resolve(this.categoryOptions[this.categoryOptions.length - 1]);
          // });
        })
        .always(() => {
          this.loading = false;
        });
    },
    hasParentItem(attrName) {
      return this.categoryOptions.find(item => {
        return item.attrName === attrName;
      });
    },
    fetchCategoryList() {
      const params = {
        type: this.type
      };
      this.loading = true;
      if (this.parentNode && this.parentNode.keyId) params.parentId = this.parentNode.keyId;
      return services
        .get(constants.Api.goods.attribute.list, {
          action: '商品规格',
          params
        })
        .then(res => {
          this.categoryOptions = res.data || [];
          this.resetAttrChildDisable();
        })
        .always(() => {
          this.loading = false;
        });
    },
    resetAttrChildDisable() {
      this.categoryOptions.forEach(item => {
        this.$set(item, 'disabled', false);
        let selectedItem = null;
        if (this.parentNode && this.parentNode.childAttrMap) {
          selectedItem = this.parentNode.childAttrMap.find(attr => {
            return attr.keyId === item.id;
          });
        } else {
          selectedItem = this.skuTreeList.find(attr => {
            return attr.keyId === item.id;
          });
        }

        if (selectedItem) {
          this.$set(item, 'disabled', true);
        }
      });
    },
    onAttrParentSelect(attrName) {
      if (attrName && attrName.length > 6) {
        return;
      }
      const hasParentItem = this.hasParentItem(attrName);
      if (hasParentItem) {
        this.currentSelectItem = hasParentItem;
        return;
      }
      this.apiAddGoodAttribute(attrName).then(item => {
        // this.currentSelectItem = item;
      });
    }
  }
};
</script>