<template>
  <div class="_meta-data">
    <div class="title">广告平台</div>
    <div class="list" v-loading="loading">
      <div class="item" v-for="item in adList" :key="item.id" @click="showEdit(item)">
        <svg class="icon media-logo" slot="reference" aria-hidden="true">
          <use xlink:href="#icon-data_baidu_logo" />
        </svg>
        <div class="configured" v-if="item.status === 1">已配置</div>
      </div>
    </div>
    <div class="title">CRM</div>
    <div class="list" v-loading="loading">
      <div class="item" v-for="item in saleList" :key="item.id" @click="showEdit(item)">
        <svg class="icon media-logo" slot="reference" aria-hidden="true">
          <use xlink:href="#icon-data_neocrm_logo" />
        </svg>
        <div class="configured" v-if="item.status === 1">已配置</div>
        <div class="auth-btn" v-if="item.status === 1" @click.stop="toAuth(item)">授权</div>
      </div>
    </div>
    <el-dialog class="config-dialog" :title="title" :visible.sync="dialogFormVisible1" width="460px">
      <el-form ref="form1" :model="form" :rules="rules1">
        <el-form-item label="账号:" prop="clientId" label-width="110px">
          <el-input v-model="form.clientId" placeholder="请填写账号" style="width: 300px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="clientSecret" label-width="110px">
          <el-input
            v-model="form.clientSecret"
            placeholder="请填写密码"
            style="width: 300px"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="TOKEN:" prop="accessToken" label-width="110px">
          <el-input
            v-model="form.accessToken"
            placeholder="请填写TOKEN"
            style="width: 300px"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="tip-box" v-html="form.tip"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="updateConfigParams(1)" v-loading="dialogLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="config-dialog" :title="title" :visible.sync="dialogFormVisible2" width="460px">
      <el-form ref="form2" :model="form" :rules="rules2">
        <el-form-item label="client ID:" prop="clientId" label-width="120px">
          <el-input
            v-model="form.clientId"
            placeholder="请填写client ID"
            style="width: 300px"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="client Secret:" prop="clientSecret" label-width="120px">
          <el-input
            v-model="form.clientSecret"
            placeholder="请填写client Secret"
            style="width: 300px"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="copy-btn global-btn-default" @click="copyUrl(form.callBackUrl)">复制回调地址</div>
      <div class="tip-box" v-html="form.tip"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="updateConfigParams(2)" v-loading="dialogLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import './index.less';
  import Apis from '@/mod-console/src/api/metadata/index';

  export default {
    name: 'Index',
    data() {
      return {
        loading: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogLoading: false,
        title: '',
        list: [
          {
            tip: '销售易',
            status: 1,
          },
        ],
        adList: [],
        saleList: [],
        form: {
          clientId: '',
          clientSecret: '',
          channelType: '',
          accessToken: '',
          tip: '',
          callBackUrl: '',
        },
        rules1: {
          clientId: { required: true, message: '请填写账号', trigger: 'blur' },
          clientSecret: { required: true, message: '请填写密码', trigger: 'blur' },
          accessToken: { required: true, message: '请填写TOKEN', trigger: 'blur' },
        },
        rules2: {
          clientId: { required: true, message: '请填写client ID', trigger: 'blur' },
          clientSecret: { required: true, message: '请填写client Secret', trigger: 'blur' },
        },
      };
    },
    mounted() {
      this.getAuthList();
    },
    methods: {
      // 去授权
      toAuth() {
        Apis.getTtAuthUrl({})
          .then(res => {
            window.open(res.data.url, '_blank');
            this.$confirm('是否完成授权', '', {
              confirmButtonText: '已授权',
              cancelButtonText: '未授权',
              center: true,
              customClass: 'account-message-box',
              showClose: false,
            })
              .then(() => {
                this.getAuthList();
              })
              .catch(() => {
                this.getAuthList();
              });
          })
          .catch(() => {
            this.$message.error('获取第三方授权失败，请重试');
          })
          .always(() => {});
      },
      // 获取第三方授权列表
      getAuthList() {
        this.loading = true;
        const params = {};
        Apis.getAuthList(params)
          .then(res => {
            this.adList = res.data.filter(e => {
              return e.clientType === 'AD';
            });
            console.log(this.adList);
            this.saleList = res.data.filter(e => {
              return e.clientType === 'SALE';
            });
            this.loading = false;
          })
          .catch(() => {
            this.$message.error('获取第三方授权列表失败，请重试');
          })
          .always(() => {
            this.loading = false;
          });
      },
      showEdit(item) {
        // item.status === 0配置  1编辑
        this.title = item.status === 0 ? `配置${item.appName}数据源` : `编辑${item.appName}数据源`;
        this.form = {
          clientId: item.clientId,
          clientSecret: item.clientSecret,
          id: item.id,
          tip: item.tip,
          callBackUrl: item.callBackUrl,
          accessToken: item.accessToken,
        };
        if (item.authType === 'BAIDU') {
          this.dialogFormVisible1 = true;
        } else {
          this.dialogFormVisible2 = true;
        }
      },
      updateConfigParams(type) {
        if (type === 1) {
          this.$refs.form1.validate(async valid => {
            if (!valid) return;
            this.updateAuth();
          });
        } else {
          this.$refs.form2.validate(async valid => {
            if (!valid) return;
            this.updateAuth();
          });
        }
      },
      updateAuth() {
        if (this.dialogLoading) {
          return false;
        }
        this.dialogLoading = true;
        Apis.updateAuth(this.form)
          .then(res => {
            this.getAuthList();
            this.dialogFormVisible1 = false;
            this.dialogFormVisible2 = false;
            this.$message.success('操作成功');
          })
          .catch(() => {
            this.$message.error('操作失败，请重试');
          })
          .always(() => {
            this.dialogLoading = false;
          });
      },
      copyUrl(url) {
        if (!document.queryCommandSupported('copy')) {
          throw new Error('document.execCommand method not support copy command');
        }
        const input = document.createElement('input');
        input.style.cssText =
          'display: block;opacity: 0;position: absolute;left: -10000px;top: -10000px;z-index: -1;width: 1px;height: 1px;';
        document.body.appendChild(input);
        input.value = url;
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        this.$message.success('复制成功');
      },
    },
  };
</script>
<style lang="less">
  .launchconfig {
    .title {
      height: 48px;
      background: #ffffff;
      padding-left: 24px;
      line-height: 48px;
      font-size: 16px;
      color: #303133;
      margin-bottom: 24px;
    }
    .media-list {
      display: flex;
      flex-wrap: wrap;
      border-radius: 4px;
      background: #ffffff;
      min-height: calc(100vh - 180px);
      box-sizing: border-box;
      padding: 24px 32px 0;
      box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.06);
      .media-box {
        min-width: 360px;
        height: 140px;
        margin-right: 24px;
        border: 1px solid #e6e6e6;
        border-radius: 2px;
        box-sizing: border-box;
        padding: 24px;
        .top-box {
          height: 36px;
          display: flex;
          align-items: center;
          .media-logo {
            width: 36px;
            height: 36px;
            /*font-size: 36px;*/
            display: block;
            color: #ff6c0e;
          }
          .media-name {
            padding: 0 8px 0 16px;
            font-size: 16px;
            line-height: 22px;
            color: #303133;
            font-weight: 500;
          }
          .tip-icon {
            font-size: 22px;
            width: 22px;
            height: 22px;
            display: block;
            cursor: pointer;
            color: #dee1e7;
          }
        }
        .bottom-box {
          padding: 18px 0 0 50px;
          display: flex;
          height: 32px;
          align-items: center;
          .btn {
            width: 64px;
            height: 32px;
            font-size: 12px;
            &.finish {
              color: #303133;
              border-color: #e6e6e6;
              cursor: default;
            }
          }
          .copy-btn {
            margin-left: 8px;
            width: 100px;
            height: 32px;
            background: #ffffff;
            font-size: 12px;
          }
          .empty-box {
            flex: 1;
          }
          .edit-box {
            display: flex;
            align-items: center;
            cursor: pointer;
            .edit-icon {
              width: 12px;
              height: 12px;
              font-size: 12px;
              color: #ff6c0e;
              display: block;
            }
            .edit-txt {
              padding-left: 8px;
              font-size: 12px;
              line-height: 17px;
              color: #303133;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      .el-button {
        padding: 0 14px;
        height: 32px;
      }
    }
    .ml8 {
      margin-left: 8px;
    }
  }
  //按钮样式
  .global-btn-default {
    background: #fff;
    border-radius: 4px;
    color: #717378;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #dcdfe6;
    &:hover {
      border-color: #f86c1d;
      color: #f86c1d;
    }
    &[disabled] {
      background: #f0f2f5;
      border-color: #dcdfe6;
      color: #a1a4ab;
      cursor: default;
    }
  }
  ._meta-data {
    background: #ffffff;
    margin: 20px 20px 0 20px;
    padding: 24px;
    border-radius: 2px;
    min-height: calc(100vh - 180px);
    .title {
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      font-weight: 500;
    }
    .list {
      padding: 16px 0;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 300px;
        height: 150px;
        border: 1px solid #dce1e6;
        cursor: pointer;
        position: relative;
        border-radius: 3px;
        margin: 0 16px 16px 0;
        &:hover {
          border-color: #fa7516;
        }
        .media-logo {
          width: 300px;
          height: 150px;
          display: block;
        }
        .configured {
          position: absolute;
          right: 0;
          top: 0;
          height: 24px;
          padding: 0 7px;
          background: #fa7516;
          border-radius: 0 3px 0 8px;
          font-size: 14px;
          line-height: 24px;
          color: #ffffff;
        }
        .auth-btn {
          width: 64px;
          height: 24px;
          background: #f2f4f7;
          border-radius: 2px;
          text-align: center;
          line-height: 24px;
          font-size: 12px;
          color: #717378;
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 3;
          cursor: pointer;
          &:hover {
            background: #fff4ee;
            color: #fa7516;
          }
        }
      }
    }
  }
  .config-dialog {
    .copy-btn {
      width: 116px;
      height: 32px;
      background: #ffffff;
      font-size: 14px;
    }
    .tip-box {
      padding-top: 16px;
      font-size: 12px;
      line-height: 17px;
      color: #b1b5bd;
      a {
        color: #1890ff;
        cursor: pointer;
      }
    }
  }
</style>
