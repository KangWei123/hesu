<template>
  <!-- 公共属性 -->
  <div>
    <div class="input-box" v-for="(item, index) in customerList" :key="item.index">
      <el-cascader
        v-model="item.property"
        :options="propertyOptions"
        :props="{
          value: 'id',
          label: 'eventPropertyName',
          children: 'childList',
        }"
        @change="handlerChangeProp($event, index)"
        :style="multiple ? 'width: 220px' : 'width:' + width"
      ></el-cascader>
      <!-- 过滤条件 -->
      <el-select
        v-model="item.condition"
        value-key="id"
        placeholder="筛选条件"
        v-if="item.conditionOptions && item.conditionOptions.length"
        @change="handlerChangeCondtion($event, index)"
        class="input-left"
        :style="multiple ? 'width: 150px' : 'width: ' + width"
      >
        <el-option
          v-for="option in item.conditionOptions"
          :key="option.id"
          :label="option.eventPropertyName"
          :value="option"
        ></el-option>
      </el-select>

      <!-- 筛选值 -->
      <!-- 筛选值：输入值 -->
      <el-input
        placeholder="请输入筛选值"
        v-model.trim="item.filterValue"
        v-if="item.filterOptions && item.filterOptions.isShow && item.filterOptions.type === 'INPUT'"
        class="input-left"
        :style="multiple ? 'width: 150px' : 'width: ' + width"
      ></el-input>
      <span v-if="item.filterOptions && item.filterOptions.region">
        <span>至</span>
        <el-input
          placeholder="请输入筛选值"
          v-model.trim="item.filterValueAnother"
          v-if="item.filterOptions && item.filterOptions.isShow && item.filterOptions.type === 'INPUT'"
          :style="multiple ? 'width: 150px' : 'width: ' + width"
        ></el-input>
      </span>
      <!-- 筛选值：时间选择器 -->
      <el-date-picker
        v-model="item.filterValue"
        type="date"
        placeholder="选择日期时间"
        :style="multiple ? 'width: 200px' : 'width: ' + width"
        class="input-left"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        v-if="item.filterOptions && item.filterOptions.isShow && item.filterOptions.type === 'DATE_TIME'"
      ></el-date-picker>
      <el-date-picker
        v-model="item.filterValue"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        type="daterange"
        placeholder="选择日期时间"
        :style="multiple ? 'width: 300px' : 'width: ' + width"
        class="input-left"
        v-if="item.filterOptions && item.filterOptions.isShow && item.filterOptions.type === 'DATE_TIME_RANGE'"
      ></el-date-picker>
      <!-- 筛选值：选择器 -->
      <el-select
        v-model="item.filterValue"
        value-key="value"
        placeholder="请选择"
        v-if="item.filterOptions && item.filterOptions.isShow && item.filterOptions.type === 'SELECT'"
        class="input-left"
        :style="multiple ? 'width: 150px' : 'width: ' + width"
      >
        <el-option
          v-for="item in item.filterOptions.options"
          :key="item.value"
          :label="item.label"
          :value="item"
        ></el-option>
      </el-select>

      <!-- 删除 -->
      <i class="el-icon-circle-close" @click="clearnAttribute"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PublicAttribute',
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
        default: '220px',
      },
      customerList: {
        type: Array,
        default() {
          return {};
        },
      },
      propertyOptions: {
        type: Array,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        // customerList: [
        //   {
        //     index: 0,
        //     property: null,
        //     condition: null,
        //     conditionOptions: [],
        //     filterValue: null,
        //     filterValueAnother: null, // 区间的第二个值
        //     filterOptions: null
        //   }
        // ],
        // propertyOptions: []
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
      };
    },
    components: {},
    computed: {},
    watch: {
      customerList: {
        deep: true,
        handler: function () {
          this.$emit('attributeParmas', this.customerList);
          console.log(this.customerList, '公共的属性数据 ');
        },
      },
    },
    destroyed() {},
    mounted() {},
    methods: {
      // 添加属性
      addAttribute() {
        const last = this.customerList[this.customerList.length - 1].index;
        if (this.customerList.length < 6) {
          // this.customerList.push({
          //   index: last + 1,
          //   property: null,
          //   condition: null,
          //   conditionOptions: [],
          //   filterValue: [],
          //   filterValueAnother: null,
          //   filterOptions: null,
          //   propertyName: null,
          //   dimName: null,
          //   dimDataType: [],
          //   dimCondition: [],
          // });
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
          // this.customerList.splice(index, 1)
        }
      },
      // 下拉列表触发事件
      handlerChangeProp(prop, index) {
        const level1 = this.propertyOptions.filter(item => {
          return item.id === prop[0];
        })[0];

        const level2 = level1.childList.filter(item => {
          return item.id === prop[1];
        })[0];

        const conditionItem = this.customerList[index];
        // 修改属性筛选条件及选项列表
        conditionItem.condition = null;
        conditionItem.conditionOptions = level2.eventAttrList || [];
        // 修改属性值
        conditionItem.filterValue = null;
        conditionItem.filterValueAnother = null;
        conditionItem.filterOptions = null;
      },
      // 过滤条件触发
      handlerChangeCondtion(condition, index) {
        const conditionItem = this.customerList[index];
        const level1 = this.propertyOptions.filter(item => {
          return item.id === conditionItem.property[0];
        })[0];

        const level2 = level1.childList.filter(item => {
          return item.id === conditionItem.property[1];
        })[0];
        const relatedItem = level2.relatedItem;
        conditionItem.filterValue = null;
        conditionItem.filterValueAnother = null;
        conditionItem.propertyName = level1.eventPropertyName;
        conditionItem.dimName = level2.eventPropertyName;
        conditionItem.dimDataType = level2.dimDataType;
        conditionItem.dimCondition = condition.id;
        console.log(relatedItem, 'relatedItem');
        this.handlerFilter(relatedItem, condition).then(filter => {
          conditionItem.filterOptions = filter;
        });
      },
      // 修改筛选值类型
      handlerFilter(relatedItem, condition) {
        console.log(relatedItem, condition);
        const filter = { isShow: true, region: false };
        if (condition.eventPropertyName === '有值' || condition.eventPropertyName === '无值') {
          filter.isShow = false;
        }
        if (condition.eventPropertyName === '区间') {
          filter.region = true;
        }
        if (relatedItem.indexOf('INPUT') !== -1) {
          filter.type = 'INPUT';
          switch (relatedItem) {
            case 'NUM_INPUT':
              filter.rules = this.checkNum;
              break;
            case 'PHONE_INPUT':
              filter.rules = this.checkPhone;
              break;
            case 'EMAIL_INPUT':
              filter.rules = this.checkEmail;
              break;
            default:
              filter.rules = [{ required: true, message: '筛选值不为空', trigger: 'blur' }];
          }
          return Promise.resolve(filter);
        } else if (relatedItem === 'DATE') {
          switch (condition.eventPropertyName) {
            case '绝对时间/=':
              filter.type = 'DATE_TIME';
              break;
            case '绝对时间/区间':
              filter.type = 'DATE_TIME_RANGE';
              break;
            case '相对当前时间/N天内':
              filter.type = 'INPUT';
              filter.rules = this.checkNum;
              break;
            case '相对当前时间/N天前':
              filter.type = 'INPUT';
              filter.rules = this.checkNum;
          }
          return Promise.resolve(filter);
        } else {
          filter.type = 'SELECT';
          switch (relatedItem) {
            case 'SEX':
              filter.options = this.getSex();
              return Promise.resolve(filter);
            case 'SOURCE':
              filter.options = this.getSourceChannel();
              return Promise.resolve(filter);
            case 'VIP_LEVEL':
              filter.options = this.getVipLevel();
              return Promise.resolve(filter);
            // 待补充完整其他类型
          }
        }
        console.log(filter);
      },
      // 获取性别选项
      getSex() {
        return [
          { value: 1, label: '男' },
          { value: 2, label: '女' },
        ];
      },
      // 获取来源渠道
      getSourceChannel() {
        return [
          { value: 1, label: '线上顾客' },
          { value: 2, label: '会员批量导入' },
          { value: 3, label: '线下录入' },
          { value: 4, label: '开放平台导入' },
          { value: 5, label: 'AI人脸绑定' },
        ];
      },
      // 获取会员等级
      getVipLevel() {
        return [
          { value: 1, label: '线上顾客' },
          { value: 2, label: '会员批量导入' },
          { value: 3, label: '线下录入' },
          { value: 4, label: '开放平台导入' },
          { value: 5, label: 'AI人脸绑定' },
        ];
      },
    },
  };
</script>
<style lang="less" scoped>
  .input-box {
    background-color: #fff;
    padding: 10px 0 10px 80px;
    .input-item {
      // width: 220px;padding: 10px 0 10px 80px;
    }
    .input-left {
      margin-left: 10px;
    }
    .select-item {
      width: 100px;
      margin-left: 10px;
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
