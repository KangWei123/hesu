<template>
  <!-- 订单属性 -->
  <div class="customer-box">
    <div class="title-box">
      <span>订单属性</span>
      <i class="el-icon-circle-plus-outline" @click="addAttribute"></i>
    </div>
    <!-- <PublicAttribute :customerList="customerList" :propertyOptions="propertyOptions"></PublicAttribute> -->
    <div class="attribute-box nav-item">
      <div class="nav-left" v-show="this.customerList.length > 1">
        <div class="border-box"></div>
        <span class="border-naem" @click="handlerChangeModel">{{ activeModelIndex == 'or' ? '或' : '且' }}</span>
      </div>
      <div :class="this.customerList.length > 1 ? 'nav-right' : 'item-left'">
        <PublicAttribute
          :customer-list="customerList"
          :property-options="propertyOptions"
          @attributeParmas="attributeParmas"
        ></PublicAttribute>
      </div>
    </div>
  </div>
</template>

<script>
  import arrData from './mock.js';
  import PublicAttribute from './PublicAttribute';
  export default {
    name: 'OrderAttribute',
    props: {
      orderList: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        customerList: [
          // {
          //   index: 0,
          //   property: null,
          //   condition: null,
          //   conditionOptions: [],
          //   filterValue: null,
          //   filterValueAnother: null, // 区间的第二个值
          //   filterOptions: null
          // }
        ],
        activeModelIndex: 'and',
        propertyOptions: [],
      };
    },
    components: {
      PublicAttribute,
    },
    computed: {},
    watch: {
      orderList: {
        deep: true,
        handler: function () {
          console.log(this.clientList, 'this.clientList===>');
          this.activeModelIndex = this.clientList.propertyDetailRelation;
          // this.clientList.propertyDetailList
          const arr = this.orderList.propertyDetailList;
          this.customerList = [];
          let obj = {};
          arr.map((v, i) => {
            this.activeModelIndex = v.dimRelation;
            obj = {
              index: i,
              property: v.propertyName + '/' + v.dimName,
              condition: v.dimCondition,
              conditionOptions: [],
              filterValue: v.dimValue,
              filterValueAnother: null,
              filterOptions: null,
            };
            this.customerList.push(obj);
          });
        },
      },
    },
    destroyed() {},
    mounted() {
      this.propertyOptions = arrData.list;
    },
    methods: {
      // 添加属性
      addAttribute() {
        if (this.customerList.length < 6) {
          this.customerList.push({
            id: 'init-02' + new Date().getTime(),
            property: null,
            condition: null,
            conditionOptions: [],
            filterValue: null,
            filterValueAnother: null,
            filterOptions: null,
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
          this.customerList.splice(index, 1);
        }
      },
      // 修改 "且" "或" 条件关系
      handlerChangeModel() {
        this.activeModelIndex = this.activeModelIndex == 'and' ? 'or' : 'and';
      },
      /** 订单属性传参数
     * "orderProperty":{
        "propertyDetailList":[
          {
            "dimCondition":"eq",
            "dimDataType":"numerical",
            "dimName":"订单金额",
            "dimSeq":1,
            "dimValue":"522.2",
            "propertyName":"订单属性"
          }]
        "propertyDetailRelation":"AND",
        "propertyType":"orders"
     * 
     */
      attributeParmas(val) {
        const arr = [];
        let dateValue = '';
        val.map((item, i) => {
          if (item.filterValue instanceof Array) {
            dateValue = item.filterValue[0] + '&' + item.filterValue[1];
          } else {
            dateValue = item.filterValue;
          }
          arr.push({
            dimCondition: item.dimCondition,
            dimName: item.dimName,
            propertyName: item.propertyName,
            dimValue: item.filterValue,
            dimSeq: item.index + 1,
            dimDataType: item.dimDataType,
            propertyDetailRelation: this.activeModelIndex,
          });
        });
        const newArr = {
          propertyDetailRelation: this.activeModelIndex,
          propertyType: 'orders',
          propertyDetailList: arr,
        };
        this.$emit('ordersParmas', newArr);
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
      background-color: #fff;
    }
    .input-item {
      width: 220px;
      padding: 10px 0 10px 80px;
    }
    .input-left {
      width: 220px;
      margin-left: 10px;
    }
    .attribute-box {
      width: 100%;
      display: flex;
      // padding: 20px 0 20px 0;
      background-color: #fff;
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
          // background: rgba(242, 244, 247, 0.6);
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
    .item-left {
      padding-left: 0px;
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
