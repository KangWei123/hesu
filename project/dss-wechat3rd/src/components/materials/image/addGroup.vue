<template>
  <div class="popover_inner">
    <div class="frm_label">创建分组</div>

    <el-input type="input"
              class="input"
              v-model="name"
              placeholder="请输入分组名称"></el-input>
    <div v-if="error" class="error">{{error}}</div>

    <div class="btns">
      <el-button class="dss-btn-primary dss-btn-small" :loading="loading" type="primary" @click="save">保存</el-button>
      <el-button class="dss-btn-small" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import mApi from '@/dss-wechat3rd/src/api/materials';
  import regexps from '@/dss-common/utils/regexps';
  import './index.less';

  export default {
    props: {
      callback: {
        type: Function,
        default: null
      },
      type: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        loading: false,
        error: '',
        name: ''
      };
    },
    methods: {
      cancel() {
        this.callback(false);
      },
      save() {
        let name = this.name;
        name = name.replace(/\s/g, '');
        if (!name) {
          this.error = '请添写组名称';
        } else if (!regexps.name.reg.test(name) || name.length > 30) {
          this.error = regexps.name.msg + ',且名称长度不超过30';
        } else {
          this.loading = true;
          mApi
            .addGroup({ name: this.name, type: this.type })
            .then(res => {
              this.callback({
                id: res.data,
                name: this.name
              });
            })
            .always(() => {
              this.loading = false;
            });
        }
      }
    }
  };
</script>

<style>
  .popover_inner {
    width: 290px;
    padding: 15px;
    border: 1px solid #d9dadc;
    background: #fff;
    box-shadow: 0 1px 20px 0 #e4e8eb;
    border-radius: 2px;
    position: absolute;
    left: 0;
    z-index: 2;
    line-height: 1;
    top:45%;
  }

  .popover_inner .error {
    color: red;
    position: absolute;
    font-size: 12px;
  }

  .popover_inner .btns {
    margin-top: 20px;
    text-align: center;
  }

  .popover_inner .el-input__inner {
    height: 28px;
    line-height: 28px;
    margin-top: 10px
  }

  .frm_label {
    font-size: 14px;
  }
</style>
