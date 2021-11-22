<template>
    <div >
      <div class="wrap" v-if="!companyId " v-loading="loading">
        <span class="title">企业微信企业ID绑定</span>
        <br>
        <el-input
          placeholder="请复制企业ID黏贴输入"
          style="width: 390px;margin-left: 407px;border:1px solid rgba(215,218,224,1)"
          v-model="companyID"
        />

        <div class="confirmBtn">
          <el-button type="primary" @click="confirmCommit" style="background:#3879FB;width: 100px;height: 30px" >确认提交</el-button>
        </div>
      </div>
      <div class="wrap" v-else="companyID || companyId">
        <span class="title">已绑定ID：</span>
        <span class="showCompanyId"> {{companyId || companyID}}</span>
        <span @click="amendCompanyId" class="amend">修改</span>
        <div class="confirmBtn">
          <el-button type="primary" @click="enterSet" >下一步</el-button>
        </div>
      </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import settingsApi from '@/dss-wechat3rd/src/api/settings';
  export default {
    name: 'index',
    data() {
      return {
        isCommit: false,
        authStatus: false,
        companyID: '',
        loading: false,
        companyId: ''
      };
    },
    mounted() {
      this.getCompanyId();
    },
    methods: {
      ...mapActions(['saveCompanyId', 'updateCompany']),
      confirmCommit() {
        if (this.companyID) {
          this.saveCompanyId(this.companyID);
          this.companyId = this.companyID;
        } else {
          this.$message.error('输入的企业ID不能为空');
        }
      },
      amendCompanyId() {
        this.companyID = '';
        this.companyId = '';
        this.updateCompany();
      },
      enterSet() {
        this.$router.push('/setting/wx/qy/authList');
      },
      getCompanyId() {
        this.loading = true;
        settingsApi
          .getCompanyAuthCondition()
          .then(res => {
            this.companyId = res.data[0].corpId;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      help() {
        this.$router.push({
          path: '/setting/wx/qy/clientAuth',
          query: {
            src: '../../../../images/wxAuth/startAuth.png',
            title: '按照下图选择企业ID复制',
            back: '/setting/wx/qy'
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>

  .wrap{
    margin-top: 150px;
    .title{
      margin-left: 407px;
      margin-bottom: 20px;
      display: inline-block;
      width:154px;
      height:22px;
      font-size:16px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:22px;
    }
    .img{
      position: relative;
      top: 2px;
    }
    .showCompanyId{
      margin-right: 20px;
    }
    .amend{
      color:#0e16e1;
      margin-right: 200px;
      cursor:pointer;
    }
    .router-link-active{
      color:#0e16e1;
    }
    .confirmBtn{
      margin-top:50px;
      width: 100%;
      text-align: center;
    }
  }
</style>
