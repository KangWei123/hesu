<template>
  <div class="show-order-container">
    <el-form v-loading='loading.form' ref="Form" :rules="rules" :model="form" class="form-wrap">
      <!-- 评论设置 -->
      <el-form-item prop='switchStatus' label="用户发表晒单:">
        <el-switch class="wkt-switch"
                 v-model="form.switchStatus"
                 :width="53"
                 :active-value="1"
                 :inactive-value="0"
                 active-color="#52C41A"
                 inactive-color="#B1B5BD">
        </el-switch>
        <span class="statusTip Show" v-if="form.switchStatus">开启</span>
        <span class="statusTip hidden" v-else>关闭</span>

        <span class="tips">关闭时，订单中的晒单入口按钮屏蔽</span>
      </el-form-item>
      <!-- 状态设置 -->
      <el-form-item style="margin:50px 0" label="晒单默认状态：" prop="defaultState">

        <el-switch class="wkt-switch"
                 v-model="form.defaultState"
                 :width="53"
                 :active-value="1"
                 :inactive-value="0"
                 active-color="#52C41A"
                 inactive-color="#B1B5BD">
        </el-switch>

        <span class="statusTip Show" v-if="form.defaultState">显示</span>
        <span class="statusTip hidden" v-else>隐藏</span>

        <!-- <el-radio-group v-model="form.defaultState">
          <el-radio :label="1">显示</el-radio><br>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group> -->
        <span class="tips-status">设置晒单的默认状态为显示时，用户的新增晒单在微商城默认展示；</span>
        <span class="tips-status">隐藏则默认不展示，需手动切换为显示方可在商品详情中显示。</span>
      </el-form-item>
      <!-- 字数设置 -->
      <el-form-item prop='limitWord' label="用户晒单字数限制：">
        <el-input placeholder="请输入" v-model.number="form.limitWord" class="limit-input"></el-input> 字
      </el-form-item>

    </el-form>
    <!-- 保存按钮 -->
    <div class="bottom-button">
      <el-button type="primary" class="save-btn" v-loading='loading.submit' @click="onSubmit('Form')">保  存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/dss-wechat3rd/src/api/commentAPI.js';

export default {
  data() {
    return {
      form: {
        defaultState: 0,
        limitWord: '',
        switchStatus: ''
      },
      loading: {
        form: false,
        submit: false
      },
      id: '', //配置的主键ID
      rules: {
        limitWord: [
          { required: true, message: '请填写晒单字数限制', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (typeof value !== 'number') {
                callback(new Error('请正确填写字数限制'));
              } else if (Number.isInteger(Number(value)) && Number(value) < 0) {
                callback(new Error('晒单评论限制0-999字符'));
              } else if (value.toString().length > 3) {
                callback(new Error('晒单评论限制0-999字符'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        defaultState: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ShowStatus(defaultState) {
      return Boolean(defaultState);
    },
    onSubmit(name) {
      this.$refs[name].validate(valid => {
        console.log('submitForm start ---->', valid);
        if (valid) {
          this.saveConfig();
          console.log(this.form, 'form-result------------');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveConfig() {
      this.loading.submit = true;
      let params = {
        commentLimit: this.form.limitWord,
        commentAppearance: this.form.switchStatus, //是否开启晒单评论
        defaultShowFlag: this.form.defaultState, //默认状态
        id: this.id
      };
      api
        .saveSetUpMeassage(params)
        .then(res => {
          this.$message.success('配置成功');
        })
        .finally(() => {
          this.loading.submit = false;
        });
    },
    getSetUpMessage() {
      this.loading.form = true;
      api
        .querySetUpMeassage()
        .then(res => {
          let data = res.data || {};
          this.form.defaultState = data.defaultShowFlag || 0;
          this.form.limitWord = data.commentLimit || '';
          this.form.switchStatus = data.commentAppearance;
          this.id = data.id;
        })
        .finally(() => {
          this.loading.form = false;
        });
    }
  },
  mounted() {
    //获取默认晒单设置
    this.getSetUpMessage();
  }
};
</script>
<style lang='less' scoped>
.show-order-container {
  background: #fff;
}
.show-order-container:after {
  content: '';
  height: 60px;
  display: block;
}
.form-wrap{
  padding: 50px 60px;
}
.tips{
  line-height: 18px;
  margin-left: 100px;
}
.tips-status{
  margin: 10px 0 0 120px;
}
.tips,.tips-status {
  display: block;
  color: #999;
  font-size: 14px;
}
.bottom-button {
  width: 100% !important;
}
.save-btn{
  margin-right: 126px !important;
}
.limit-input{
  width: 200px !important;
}
/deep/ .el-radio-group{
  vertical-align: text-top;
}
// 
.statusTip {
      position: relative;
      z-index: 10;
      color: #fff;
      top: 1px;
      font-size: 12px;
    }
    .Show {
      right: 52px;
    }
    .hidden {
      right: 38px;
    }
</style>
