<template>
  <!-- 标签值1 -->
  <div class="label-value-box">
    <div class="label-input" v-for="(item, index) in formNumber" :key="item.index">
      <el-form ref="ruleForm" label-width="100px" class="ruleForm" :disabled="!canEdit">
        <el-form-item :label="'标签值' + (index + 1)" prop="name">
          <el-input v-model="item.labelValue" placeholder="请输入" style="width: 350px"></el-input>
          <i v-show="index > 0" class="el-icon-circle-close" @click="clearnLabelVaule(index)"></i>
        </el-form-item>
      </el-form>
      <div class="attribute-box">
        <div class="nav-left">
          <div class="border-box"></div>
          <span class="border-naem" @click="handlerChangeModel">{{ activeModelIndex == 'or' ? '或' : '且' }}</span>
        </div>
        <div class="nav-right">
          <!-- 客户属性 -->
          <CustomerAttribute @customerParmas="customerParmas" :client-list="clientList"></CustomerAttribute>
          <!-- 订单属性 -->
          <OrderAttribute @ordersParmas="ordersParmas"></OrderAttribute>
          <!-- 行为属性 -->
          <BehaviorAttribute @userListParmas="userListParmas"></BehaviorAttribute>
        </div>
      </div>
    </div>
    <el-button class="marginTop label-add" type="primary" round @click="addLabeValue">+标签值</el-button>
    <div class="save-box marginTop">
      <el-button type="primary" round @click="saveHandlerChange" :loading="loading" v-if="canEdit">保 存</el-button>
      <el-button :round="true" v-if="canEdit">取消</el-button>
      <el-button :round="true" @click="goTagListWithLastActiveTagName" v-if="!canEdit">返回</el-button>
    </div>
    <div style="margin: 0 0 40px 0px; padding-bottom: 40px" class="tip-text">
      创建的商家标签次日可在洞察平台进行圈人
    </div>
  </div>
</template>

<script>
  import CustomerAttribute from './CustomerAttribute.vue';
  import BehaviorAttribute from './BehaviorAttribute.vue';
  import OrderAttribute from './OrderAttribute.vue';
  import API from '@/mod-member/src/api/new-myLabel.js';
  export default {
    name: 'LabelValue',
    inject: ['canEdit'],
    props: {
      ruleForm: {
        type: Object,
        default() {
          return {};
        },
      },
      labelData: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        loading: false,
        formNumber: [
          // {
          //   labelValue: ''
          // }
        ],
        modelOptions: [
          { id: 'or', name: '或' },
          { id: 'and', name: '且' },
        ],
        activeModelIndex: 'and',

        saveList: [],
        customerProperty: {},
        ordersProperty: {},
        behaviorProperty: {},
        flag: true,
        clientList: {},
        orderList: {},
        userList: {},
      };
    },
    components: {
      CustomerAttribute,
      BehaviorAttribute,
      OrderAttribute,
    },
    computed: {},
    watch: {
      labelData: {
        deep: true,
        handler: function () {
          console.log(this.labelData, '标签的labelData');
          this.formNumber = this.labelData;
          // console.log(this.formNumber)
          this.formNumber.map((v, i) => {
            this.clientList = v.customerProperty;
            this.orderList = v.customerPropert;
            this.userList = v.orderProperty;
          });
        },
      },
    },
    destroyed() {},
    mounted() {
      // this.getClientData()
      // this.getOrderData()
      // this.getUserData()
      // this.saveHandlerChange()
      // this.flag = this.$route.query.flag
      // console.log(this.flag, '000')
    },
    methods: {
      // 添加标签值
      addLabeValue() {
        // const last = this.formNumber[this.formNumber.length - 1].index
        if (this.formNumber.length < 21) {
          this.formNumber.push({
            id: 'init' + new Date().getTime(),
            labelName: null,
          });
        } else {
          this.$message({
            showClose: true,
            message: '每个分类最多新增6条纬度',
            type: 'warning',
          });
        }
      },
      // 删除标签值
      clearnLabelVaule(index) {
        if (index !== -1) {
          this.formNumber.splice(index, 1);
        }
      },
      // 修改 "且" "或" 条件关系
      handlerChangeModel() {
        this.activeModelIndex = this.activeModelIndex == 'and' ? 'or' : 'and';
        console.log(this.activeModelIndex);
      },
      // 保存按钮触发
      saveHandlerChange() {
        /** param传值
         * labelValue        标签值
         * propertyRelation  且和或的条件
         * customerProperty  客户属性
         * orderProperty     订单属性
         * behaviorProperty  行为属性
         */
        console.log(this.ruleForm);
        this.loading = true;
        const values = [];
        let params = {};
        const params2 = {};
        this.formNumber.map((item, index) => {
          params = {
            labelName: this.ruleForm.name,
            updRule: this.ruleForm.rule,
            description: this.ruleForm.desc,
            labelSeq: index + 1,
            useDefaultDesc: this.ruleForm.descripLabel == true ? 0 : 1,
            values: [
              {
                labelValue: item.labelValue,
                propertyRelation: this.activeModelIndex,
                labelSeq: index + 1,
                customerProperty: this.customerProperty,
                orderProperty: this.ordersProperty,
                behaviorProperty: this.behaviorProperty,
              },
            ],
          };
        });
        console.log(params, 'params');
        API.getSaveList(params)
          .then(res => {
            console.log(res.data, '保存按钮触发');
            if (res.data == true) {
              const name = 'conditionTag';
              this.$message.success('新增条件标签成功');
              this.$router.push({
                name: 'portraitMyTag',
                params: {
                  lastActiveTagName: 'conditionTag',
                },
              });
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
      customerParmas(val) {
        console.log(val, '客户属性');
        this.customerProperty = val;
      },
      ordersParmas(val) {
        console.log(val, '订单属性属性');
        this.ordersProperty = val;
      },
      userListParmas(val) {
        console.log(val, '行为属性');
        let propertyDetailList = [];
        propertyDetailList = val;
        this.behaviorProperty = {
          propertyDetailList,
          propertyType: 'behavior',
        };
      },
      // 返回列表
      goTagListWithLastActiveTagName() {
        this.$router.push({
          name: 'portraitMyTag',
          // path: '/portrait/manage/myTag/new',
          params: { lastActiveTagName: 'conditionTag' },
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  .label-value-box {
    padding-top: 20px;
    background: #fafafa;
    .marginTop {
      margin-top: 20px;
    }
    .label-add {
      margin-left: 60px;
    }
    .save-box {
      text-align: center;
      padding-bottom: 20px;
    }
    .attribute-box {
      width: 100%;
      height: 100%;
      display: flex;
      .nav-left {
        margin-left: 60px;
        width: 5%;
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
          top: 40%;
          left: -24.3%;
        }
      }
      .nav-right {
        width: 95%;
      }
    }
    .tip-text {
      color: #ccc;
      text-align: center;
    }
    i {
      font-size: 20px;
      color: #3879fb;
      margin-left: 20px;
      align-self: center;
    }
    /deep/.el-icon-circle-close {
      cursor: pointer;
    }
  }
</style>
