<template>
  <!-- 用户属性 -->
  <div class="customer-box">
    <div class="title-box">
      <span>用户属性</span>
      <i class="el-icon-circle-plus-outline" @click="addAttribute"></i>
    </div>
    <div class="input-box nav-right-item" v-for="(item, index) in userList" :key="item.index">
      <div class="attribute-box" v-if="userList && userList.length > 0">
        <div class="nav-left">
          <div class="border-box"></div>
          <span class="border-naem" @click="handlerChangeModel">{{ activeModelIndex == 'or' ? '或' : '且' }}</span>
        </div>
        <div class="nav-right">
          <div class="vaw-top">
            <span class="border-name">{{ index + 1 }}</span>
            <el-form ref="ruleForm" class="ruleForm">
              <el-form-item label="在" label-width="30px">
                <el-date-picker
                  v-model="item.date"
                  align="center"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :clearable="false"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="内，发生" label-width="80px">
                <el-select
                  v-model="item.consumption"
                  placeholder="请选择消费类型"
                  style="width: 200px"
                  @change="consumptionTypeChange($event, index)"
                >
                  <el-option
                    v-for="item in consumptionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button type="text" round @click="conditionClick($event, index)">+添加过滤条件</el-button>
                <i class="el-icon-circle-close" @click="clearnAttribute"></i>
              </el-form-item>
            </el-form>
          </div>

          <div class="attribute-box nav-item" v-if="item.conditionNum && item.conditionNum.length > 0">
            <div class="nav-left">
              <div class="border-box"></div>
              <span class="border-naem" @click="handlerChangeModel_a">{{
                activeModelIndex_a == 'or' ? '或' : '且'
              }}</span>
            </div>

            <!-- +添加过滤条件list -->
            <div class="nav-right">
              <div class="input-box" v-for="(item, conditionNumIndex) in item.conditionNum" :key="conditionNumIndex">
                <!-- 第一个筛选 -->
                <el-select
                  v-model="item.property"
                  placeholder="请选择消费类型"
                  style="width: 200px"
                  @change="itemTypeChange($event, index)"
                >
                  <el-option
                    v-for="item in item.consumeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>

                <!-- 第二个筛选 -->
                <el-select
                  v-model="item.condition"
                  value-key="id"
                  placeholder="筛选条件"
                  v-if="
                    item.property == '消费金额' ||
                    item.property == '消费次数' ||
                    item.property == '最后消费时间距今天数' ||
                    item.property == '充值金额' ||
                    item.property == '充值次数' ||
                    item.property == '加购次数' ||
                    item.property == '浏览次数' ||
                    item.property == '到店次数'
                  "
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

                <!-- 第二个按钮筛选 -->
                <el-select
                  v-model="item.product"
                  value-key="id"
                  placeholder="请选择"
                  v-if="
                    item.property == '消费商品' ||
                    item.property == '加购商品' ||
                    item.property == '浏览商品' ||
                    item.property == '门店名称'
                  "
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

                <!-- 按钮 -->
                <el-button
                  v-if="
                    (item.property == '消费商品' &&
                      item.property == '加购商品' &&
                      item.property == '浏览商品' &&
                      item.property == '门店名称') ||
                    item.buttonName == '指定商品' ||
                    item.buttonName == '指定标签' ||
                    item.buttonName == '指定分类'
                  "
                  :style="multiple ? 'width: 120px' : 'width:' + width"
                  class="select-btn select-item"
                  :class="{ 'single-condition-btn': !multiple }"
                  @click="handlerSelect(item, index)"
                  >{{ item.buttonName }}</el-button
                >

                <!-- 筛选输入值 -->
                <el-input
                  placeholder="请输入筛选值"
                  v-model.trim="item.filterValue"
                  v-if="
                    item.property == '消费金额' ||
                    item.property == '消费次数' ||
                    item.property == '最后消费时间距今天数' ||
                    item.property == '充值金额' ||
                    item.property == '充值次数' ||
                    item.property == '加购次数' ||
                    item.property == '浏览次数' ||
                    item.property == '到店次数'
                  "
                  class="input-left select-item"
                  :style="multiple ? 'width: 150px' : 'width: ' + width"
                ></el-input>
                <span v-if="item.condition && item.condition == 'sec'">
                  <span>至</span>
                  <el-input
                    placeholder="请输入筛选值"
                    v-model.trim="item.filterValueAnother"
                    v-if="item.condition"
                    :style="multiple ? 'width: 150px' : 'width: ' + width"
                  ></el-input>
                </span>
                <i class="el-icon-circle-close" @click="clearnCondition(index, conditionNumIndex)"></i>

                <div>
                  <!-- 指定商品 表格 -->
                  <el-table :data="item.targetList" style="width: 500px" v-if="item.buttonName == '指定商品'">
                    <el-table-column label="商品名" prop="name"></el-table-column>
                    <el-table-column label="价格" :formatter="priceFormatter" prop="price"></el-table-column>
                  </el-table>

                  <!-- 指定分类 表格 -->
                  <el-table :data="item.classifyList" style="width: 500px" v-if="item.buttonName == '指定分类'">
                    <el-table-column label="分类" prop="name"></el-table-column>
                  </el-table>

                  <!-- 指定标签 表格 -->
                  <el-table :data="item.appointList" style="width: 500px" v-if="item.buttonName == '指定标签'">
                    <el-table-column label="商品标签" prop="name"></el-table-column>
                    <el-table-column label="覆盖商品数" prop="coverNumber"></el-table-column>
                  </el-table>
                </div>

                <!-- 指定商品对话框 -->
                <GoodsSelectDialog
                  :active-tabs="activeTabs"
                  :selected-list="goods"
                  @selected="onProductChoosed($event, index)"
                  enable-multiple
                  v-model="goodsSelectProductDialog"
                ></GoodsSelectDialog>

                <!-- 指定分类对话框 -->
                <ClassifySelectDialog
                  :active-tabs="activeTabs"
                  :selected-categories="categories"
                  @choose="onCategoryChoosed($event, index)"
                  v-model="classificationDialogVisible"
                ></ClassifySelectDialog>

                <!-- 商品标签对话框 -->
                <ConditionTagDialog
                  @change="onChangeProductLabel($event, index)"
                  v-model="goodsTagDialogVisible"
                ></ConditionTagDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import arrDate from './mock2.js';
  import { ClassifySelectDialog, GoodsSelectDialog, goodsTypeEnum } from '@/register/wechat3rd';
  import ConditionTagDialog from '../../newTag/components/ConditionTagDialog.vue';
  import PublicAttribute from './PublicAttribute';
  import consumeFilter from './consumeFilter';
  export default {
    name: 'BehaviorAttribute',
    inject: ['canEdit'],
    props: {
      label: {
        type: String,
        default: '条件',
      },
      multiple: {
        // 是否支持多条件
        type: Boolean,
        default: true,
      },
      width: {
        type: String,
        default: '320px',
      },
      behaviorList: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        // 第一层list
        userList: [],
        // 级联触发事件
        consumptionList: [
          { label: '消费行为', value: '消费行为' },
          { label: '充值行为', value: '充值行为' },
          { label: '加入购物车', value: '加入购物车' },
          { label: '浏览行为', value: '浏览行为' },
          { label: '到店行为', value: '到店行为' },
        ],
        //
        pickerOptions: {},
        // 或与且的条件
        activeModelIndex: 'and',
        activeModelIndex_a: 'and',
        // 第二层list
        consumeList: [],
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
          { name: '全部商品', relatedItem: 'text_all_item' },
          { name: '指定商品', relatedItem: 'text_spe_item' },
          { name: '指定标签', relatedItem: 'text_spe_tag' },
          { name: '指定分类', relatedItem: 'text_spe_category' },
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
        detailList: [],
      };
    },
    components: {
      GoodsSelectDialog,
      ClassifySelectDialog,
      ConditionTagDialog,
      PublicAttribute,
      consumeFilter,
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
      activeTabs() {
        console.log([goodsTypeEnum.server, goodsTypeEnum.product], '000');
        return this.env.BEAUTIFUL ? [goodsTypeEnum.server, goodsTypeEnum.product] : [goodsTypeEnum.product];
      },
    },
    watch: {
      conditionNum: {
        deep: true,
        handler: function () {
          // console.log(this.conditionNum, '第二层conditionNum')
        },
      },
      behaviorList: {
        deep: true,
        handler: function () {
          console.log(this.behaviorList, 'this.behaviorList===>');
          this.activeModelIndex = this.behaviorList.propertyDetailRelation;
          // this.clientList.propertyDetailList
          const arr = this.orderList.propertyDetailList;
          // this.customerList = []
          // let obj = {}
          // arr.map((v, i) => {
          //   this.activeModelIndex = v.dimRelation
          //   obj = {
          //     index: i,
          //     property: v.propertyName + '/' + v.dimName,
          //     condition: v.dimCondition,
          //     conditionOptions: [],
          //     filterValue: v.dimValue,
          //     filterValueAnother: null,
          //     filterOptions: null
          //   }
          //   this.customerList.push(obj)
          // })
        },
      },
      userList: {
        deep: true,
        handler: function () {
          /** 行为属性的Parmas
         * "behaviorProperty":{
            "propertyDetailList":[
              {
                "detailList":[
                    {
                      "dimCondition":"eq",
                      "dimDataType":"numerical",
                      "dimName":"消费金额",
                      "dimValue":"362"
                    }
                ],
                "dimRelation":"OR",
                "endDate":"2020-02-22",
                "propertyName":"消费行为",
                "startDate":"2020-02-20"
              }
            ],
            "propertyType":"behavior"
        },
         */
          let propertyDetailList = '';
          const detailList = [];
          const arrParams = [];
          this.userList.map((v, i) => {
            v.conditionNum.map((item, index) => {
              let dimType = '';
              const value = [];
              let filter = [];
              const objDetail = {};
              // 判断指定商品、指定标签、指定分类、触发的表格数据
              if (item.targetList) {
                item.targetList.map(v => {
                  value.push(v.id);
                });
              }
              if (item.classifyList) {
                item.classifyList.map(v => {
                  value.push(v.id);
                });
              }
              if (item.appointList) {
                item.appointList.map(v => {
                  value.push(v.id);
                });
              }
              // 判断指定商品，分类，全部商品 dimDataType的值
              if (
                item.consumption != '消费商品' ||
                item.consumption != '加购商品' ||
                item.consumption != '浏览商品' ||
                item.consumption != '门店名称'
              ) {
                if (item.product == 'text_all_item') {
                  dimType = 'text_all_item';
                  filter = JSON.stringify(value);
                } else if (item.product == 'text_spe_category') {
                  dimType = 'text_spe_category';
                  filter = JSON.stringify(value);
                } else if (item.product == 'text_spe_item') {
                  dimType = 'text_spe_item';
                  filter = JSON.stringify(value);
                } else if (item.product == 'text_spe_tag') {
                  dimType = 'text_spe_tag';
                  filter = JSON.stringify(value);
                } else {
                  dimType = 'numerical';
                  filter = item.filterValue;
                }
              }
              detailList.push({
                dimCondition: item.condition,
                dimDataType: dimType,
                dimName: item.property,
                dimSeq: index + 1,
                dimValue: filter,
              });
            });
            propertyDetailList = {
              dimRelation: this.activeModelIndex,
              endDate: v.date ? v.date[1] : null,
              propertyName: v.consumption,
              startDate: v.date ? v.date[0] : null,
              detailList: detailList,
            };
            arrParams.push(propertyDetailList);
          }),
            this.$emit('userListParmas', arrParams);
          console.log(arrParams, '用户行为params');
        },
      },
    },
    destroyed() {},
    mounted() {
      this.propertyOptions = arrDate.data;
    },
    methods: {
      // 修改 "且" "或" 条件关系
      handlerChangeModel() {
        this.activeModelIndex = this.activeModelIndex == 'and' ? 'or' : 'and';
      },
      handlerChangeModel_a() {
        this.activeModelIndex_a = this.activeModelIndex_a == 'and' ? 'or' : 'and';
      },
      // 添加属性
      addAttribute() {
        if (this.userList.length < 6) {
          this.userList.push({
            id: 'init' + new Date().getTime(),
            date: null,
            conditionNum: [],
            consumeList: [],
          });
        } else {
          this.$message({
            showClose: true,
            message: '每个分类最多新增6条纬度',
            type: 'warning',
          });
        }
      },
      // 删除属性
      clearnAttribute(index) {
        if (index !== -1) {
          this.userList.splice(index, 1);
        }
      },
      // 时间选择触发
      dateChange(val) {
        this.userList.map((item, index) => {
          item.date = val;
        });
      },
      // 消费类型触发
      consumptionTypeChange(val, index) {
        const item1 = this.userList[index];
        item1.conditionNum = [];
      },
      // 第一个筛选值触发
      itemTypeChange(val, index) {
        const Item1 = this.userList[index];
        const relatedItem = Item1.conditionNum;
        // this.handlerFilter(relatedItem,val)
        // .then(filter => {
        //   relatedItem = filter;
        // })
      },
      // 第二个筛选值触发
      productHandlerChange(val, index) {
        // console.log(val,'val===>')
        const Item1 = this.userList[index];
        const relatedItem = Item1.conditionNum;
        //  console.log(relatedItem,'relatedItem===>')
        // this.handlerFilter(relatedItem,val)
        // .then(filter => {
        //   relatedItem = filter;
        // })
        Item1.conditionNum.map(v => {
          if (val == 'text_all_item') {
            v.buttonName = '全部商品';
          } else if (val == 'text_spe_item') {
            v.buttonName = '指定商品';
          } else if (val == 'text_spe_tag') {
            v.buttonName = '指定标签';
          } else if (val == 'text_spe_category') {
            v.buttonName = '指定分类';
          }
        });
      },
      handlerFilter(relatedItem, val) {
        console.log(relatedItem, val, '监听');
        if (!relatedItem) return Promise.resolve();
        const select_type = [];
        const productOptions = {
          text_all_item: { name: '全部商品', relatedItem: 'text_all_item' },
          text_spe_item: { name: '指定商品', relatedItem: 'text_spe_item' },
          text_spe_tag: { name: '指定标签', relatedItem: 'text_spe_tag' },
          text_spe_category: { name: '指定分类', relatedItem: 'text_spe_category' },
        };
        let filter = {
          type: select_type.indexOf(relatedItem) === -1 ? 'BUTTON' : 'SELECT',
        };
        if (filter.type === 'BUTTON') {
          filter = productOptions[relatedItem];
          // console.log(filter)
          return Promise.resolve(filter);
        }
      },
      // +添加过滤条件
      conditionClick(val, index) {
        const item1 = this.userList[index];
        let arr = [];
        if (item1.consumption == '消费行为') {
          arr = [
            { label: '消费商品', value: '消费商品' },
            { label: '消费金额', value: '消费金额' },
            { label: '消费次数', value: '消费次数' },
            { label: '最后消费时间距今天数', value: '最后消费时间距今天数' },
          ];
        } else if (item1.consumption == '充值行为') {
          arr = [
            { label: '充值金额', value: '充值金额' },
            { label: '充值次数', value: '充值次数' },
          ];
        } else if (item1.consumption == '加入购物车') {
          arr = [
            { label: '加购商品', value: '加购商品' },
            { label: '加购次数', value: '加购次数' },
          ];
        } else if (item1.consumption == '浏览行为') {
          arr = [
            { label: '浏览商品', value: '浏览商品' },
            { label: '浏览次数', value: '浏览次数' },
          ];
        } else if (item1.consumption == '到店行为') {
          arr = [
            { label: '到店次数', value: '到店次数' },
            { label: '门店名称', value: '门店名称' },
          ];
        }
        const obj = {
          id: 'initChild' + new Date().getTime(),
          property: null,
          condition: null,
          typeCondition: null,
          filterValue: null,
          filterOptions: null,
          product: null,
          buttonName: null,
          consumeList: arr,
          // 按钮指定的商品，分类，指定标签
          targetList: null,
          classifyList: null,
          appointList: null,
        };
        item1.conditionNum.push(obj);
      },
      // 删除过滤条件
      clearnCondition(index) {
        if (index !== -1) {
          const Item1 = this.userList[index];
          Item1.conditionNum.splice(index, 1);
        }
      },
      // 修改筛选条件
      handlerChangeCondtion(val, index) {
        // let  name = this.userList[index]
      },
      // 点击筛选按钮-显示相应弹窗
      handlerSelect(targetItem, index) {
        const activeSelectType = targetItem.product;
        switch (activeSelectType) {
          case 'text_spe_item':
            this.goodsSelectProductDialog = true;
            break;
          case 'text_spe_category':
            this.classificationDialogVisible = true;
            break;
          case 'text_spe_tag':
            this.goodsTagDialogVisible = true;
            break;
        }
      },
      // 选择商品
      onProductChoosed(selectedProducts, index) {
        this.goods = selectedProducts;
        const selectedItems = this.goods.map(item => ({
          id: item.id,
          name: item.name,
          price: item.salePrice,
        }));
        const Item1 = this.userList[index];
        Item1.conditionNum.map((v, i) => {
          v.targetList = selectedItems;
        });
      },
      // 指定分类
      onCategoryChoosed(selectedCategories, index) {
        this.categories = selectedCategories;
        const selectedItems = this.categories.map(item => ({
          id: item.id,
          name: item.category,
        }));
        const Item1 = this.userList[index];
        Item1.conditionNum.map((v, i) => {
          v.classifyList = selectedItems;
        });
      },
      // 指定标签
      onChangeProductLabel(selectedTags, index) {
        this.goodTags = selectedTags;
        const selectedItems = this.goodTags.map(item => ({
          id: item.id,
          name: item.label,
          coverNumber: item.coverNumber,
        }));
        const Item1 = this.userList[index];
        Item1.conditionNum.map((v, i) => {
          v.appointList = selectedItems;
        });
      },
      // formatter
      priceFormatter(row, col, cellVal, index) {
        return cellVal ? (cellVal / 100).toFixed(2) : '';
      },
    },
  };
</script>
<style lang="less" scoped>
  .customer-box {
    margin-top: 20px;
    border: 1px solid #dcdde0;
    .title-box {
      width: 100%;
      font-size: 14px;
      color: #333333;
      line-height: 30px;

      background-color: #f2f4f7;
      // border: 1px solid #DCDDE0;
      display: flex;
      span {
        width: 92%;
        margin-left: 20px;
        align-self: center;
        justify-content: flex-start;
      }
      .el-icon-circle-plus-outline {
        justify-content: flex-end;
      }
    }
    .input-box {
      padding: 20px 0 0px 0;
      // display: flex;
      width: 100%;
      // background-color: #fff;
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
      .attribute-box {
        width: 100%;
        display: flex;
        .nav-left {
          margin-left: 45px;
          width: 3.5%;
          // height: 100vh;
          position: relative;
          .border-box {
            width: 50px;
            height: 100%;
            border: 1px solid;
            border-bottom-color: #dcdde0;
            border-left-color: #dcdde0;
            border-top-color: #dcdde0;
            border-right-color: #fafafa;
            position: absolute;
          }
          .border-naem {
            width: 30px;
            height: 30px;
            line-height: 30px;
            background-color: #3879fb;
            text-align: center;
            display: inline-block;
            position: absolute;
            cursor: pointer;
            top: 40%;
            left: -24.3%;
          }
        }
        .nav-right {
          width: 95%;
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
        }
      }
    }
    .nav-right-item {
      padding: 20px 0 20px 0;
      background-color: #fff;
    }
    .nav-item {
      padding: 0px 0 20px 0;
      background: rgba(242, 244, 247, 0.6);
    }
    i {
      font-size: 20px;
      color: #3879fb;
      margin-left: 20px;
      align-self: center;
      cursor: pointer;
    }
  }
</style>
