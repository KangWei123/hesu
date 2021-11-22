<template>
  <div v-show="conditionNum && conditionNum.length">
    <div class="input-box" v-for="(item, index) in conditionNum" :key="item.index">
      <el-select
        v-model="item.property"
        placeholder="请选择消费类型"
        style="width: 200px"
        @change="itemTypeChange($event, index)"
      >
        <el-option v-for="item in consumeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-select
        v-model="item.condition"
        value-key="id"
        placeholder="筛选条件"
        v-if="item.property == 'INPUT' || item.property == 'INPUT_NUM' || item.property == 'INPUT_DAY'"
        @change="handlerChangeCondtion($event, index)"
        class="select-item"
        :style="multiple ? 'width: 150px' : 'width: ' + width"
      >
        <el-option
          v-for="option in conditionOptions"
          :key="option.id"
          :label="option.eventPropertyName"
          :value="option.id"
        ></el-option>
      </el-select>

      <el-select
        v-model="item.product"
        value-key="id"
        placeholder="请选择"
        v-if="item.property == 'BUTTON'"
        @change="productHandlerChange($event, index)"
        class="select-item"
        :style="multiple ? 'width: 150px' : 'width: ' + width"
      >
        <el-option
          v-for="option in productOptions"
          :key="option.relatedItem"
          :label="option.name"
          :value="option.relatedItem"
        ></el-option>
      </el-select>

      <el-button
        v-if="
          (item.property == 'BUTTON' && item.buttonName === '选择商品') ||
          item.buttonName === '选择商品标签' ||
          item.buttonName === '选择指定分类'
        "
        :style="multiple ? 'width: 120px' : 'width:' + width"
        class="select-btn select-item"
        :class="{ 'single-condition-btn': !multiple }"
        @click="handlerSelect(item)"
        >{{ item.buttonName }}</el-button
      >

      <el-input
        placeholder="请输入筛选值"
        v-model.trim="item.filterValue"
        v-if="
          (item.condition && item.property == 'INPUT') || item.property == 'INPUT_NUM' || item.property == 'INPUT_DAY'
        "
        class="input-left select-item"
        :style="multiple ? 'width: 150px' : 'width: ' + width"
      ></el-input>
      <span v-if="item.filterOptions && item.filterOptions.region">
        <span>至</span>
        <el-input
          placeholder="请输入筛选值"
          v-model.trim="item.filterValueAnother"
          v-if="item.condition"
          :style="multiple ? 'width: 150px' : 'width: ' + width"
        ></el-input>
      </span>
      <i class="el-icon-circle-close" @click="clearnCondition"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      multiple: {
        // 是否支持多条件
        type: Boolean,
        default: true,
      },
      conditionNum: {
        type: Array,
        default() {
          return [];
        },
      },
      consumeList: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        // 过滤条件
        conditionOptions: [
          { id: 'eq', eventPropertyName: '=' },
          { id: 'ne', eventPropertyName: '≠' },
          { id: 'it', eventPropertyName: '>' },
          { id: 'gt', eventPropertyName: '<' },
          { id: 'ge', eventPropertyName: '≥' },
          { id: 'le', eventPropertyName: '≤' },
          { id: 'sec', eventPropertyName: '区间' },
          { id: 'nv', eventPropertyName: '有值' },
          { id: 'hv', eventPropertyName: '无值' },
        ],
        productOptions: [
          { name: '选择商品', relatedItem: 'GOODS' },
          { name: '选择商品标签', relatedItem: 'GOODS_TAG' },
          { name: '选择指定分类', relatedItem: 'CLASSIFICATION' },
        ],
        // 指定商品
        goods: [],
        goodsTypeEnum: true,
        goodsSelectProductDialog: false,
        // 指定分类
        categories: [],
        classificationDialogVisible: false,
        goodsTagDialogVisible: false,
        propertyOptions_a: [],
      };
    },
    components: {},
    computed: {},
    watch: {},
    destroyed() {},
    mounted() {},
    methods: {
      // 行为触发
      itemTypeChange(val) {
        console.log(val, this.conditionNum, '===行为触发');
      },
      // 选择商品
      commodityChange() {
        this.showSelectProductDialog = true;
      },
      // 修改筛选条件
      handlerChangeCondtion(condition, index) {
        console.log(condition, index, '修改筛选条件');
      },
      // 选择商品触发
      productHandlerChange(val) {
        // console.log(val,'--选择商品触发')
        this.conditionNum.map(item => {
          if (val == 'GOODS') {
            item.buttonName = '选择商品';
          } else if (val == 'GOODS_TAG') {
            item.buttonName = '选择商品标签';
          } else if (val == 'CLASSIFICATION') {
            item.buttonName = '选择指定分类';
          }
        });
      },
      // 点击筛选按钮-显示相应弹窗
      handlerSelect(targetItem) {
        console.log(targetItem.product, 'targetItem');
        // this.activeItemId = targetItem.id
        const activeSelectType = targetItem.product;
        switch (activeSelectType) {
          case 'GOODS':
            this.goodsSelectProductDialog = true;
            break;
          case 'CLASSIFICATION':
            this.classificationDialogVisible = true;
            break;
          case 'GOODS_TAG':
            this.goodsTagDialogVisible = true;
            break;
        }
      },
      // 修改筛选值类型
      handlerFilter(relatedItem) {
        if (!relatedItem) return Promise.resolve();
        const select_type = ['WX_LIST', 'WX_MENU_LIST', 'WX_QR_CODE'];
        const btn_type_options = {
          GOODS: { name: '选择商品', relatedItem: 'GOODS' },
          GOODS_TAG: { name: '选择商品标签', relatedItem: 'GOODS_TAG' },
          CLASSIFICATION: { name: '选择指定分类', relatedItem: 'CLASSIFICATION' },
        };
        const filter = {
          type: select_type.indexOf(relatedItem) === -1 ? 'BUTTON' : 'SELECT',
        };
        if (filter.type === 'BUTTON') {
          filter.options = btn_type_options[relatedItem];
          return Promise.resolve(filter);
        }
        // else if (filter.type === 'SELECT' && relatedItem === 'GOODS_CATAGORY') {
        //   // 商品分类特殊处理
        //   filter.options = {
        //     list: null,
        //     relatedItem
        //   }
        //   return Promise.resolve(filter)
        // }
        else {
          return this['get_' + relatedItem]().then(options => {
            filter.options = {
              list: options,
              relatedItem: relatedItem,
            };
            return Promise.resolve(filter);
          });
        }
      },
      // 选择商品
      onProductChoosed(selectedProducts) {
        console.log('已选商品', selectedProducts);
        this.goods = selectedProducts;
        // let selectedItems = this.goods.map(item => ({
        //   id: item.id,
        //   name: item.name,
        //   price: item.salePrice
        // }))
      },
      // 指定分类
      onCategoryChoosed(selectedCategories) {
        console.log('已选分类', selectedCategories);
        this.categories = selectedCategories;
        const selectedItems = this.categories.map(item => ({
          id: item.id,
          name: item.category,
        }));
      },
      // 指定标签
      onChangeProductLabel() {},
      // 删除过滤条件
      clearnCondition(index) {
        if (index !== -1) {
          // TODO: 不能修改props
          // this.conditionNum.splice(index, 1)
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  /deep/.input-box {
    background: rgba(242, 244, 247, 0.6);
    padding: 10px 0 10px 0px;
  }
  .vaw-top {
    display: flex;
  }
  .border-name {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-top: 10px;
    background-color: #f2f4f7;
  }
  .ruleForm {
    display: flex;
  }
  .input-item {
    width: 220px;
  }
  .select-item {
    width: 100px;
    margin-left: 10px;
  }
  .button-left {
    margin-left: 10px;
  }
  i {
    font-size: 20px;
    color: #3879fb;
    margin-left: 20px;
    align-self: center;
    cursor: pointer;
  }
</style>
