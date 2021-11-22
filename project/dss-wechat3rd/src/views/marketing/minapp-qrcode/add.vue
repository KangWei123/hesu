<template>
  <div class="qrcode-add" v-loading="loading">
    <header class="page-header">
      <span>新增小程序二维码</span>
    </header>
    <main>
      <el-form label-width="130px" :model="form" :rules="rules" ref="form">
        <el-form-item label="二维码名称" prop="qrName">
          <el-input v-model.trim="form.qrName" />
        </el-form-item>
        <el-form-item label="小程序 Id" prop="wxMiniprogramId">
          <el-input v-loading="loadingMaAppId" disabled v-model="form.wxMiniprogramId" />
        </el-form-item>
        <el-form-item label="二维码参数" prop="relationParam">
          <el-input v-model.trim="form.relationParam" />
        </el-form-item>

        <el-form-item key="urlArr" label="小程序路径" prop="urlArr" v-if="isShowPathSelect">
          <minapp-path-select v-model="form.urlArr" :custom-pages="customPages" />
        </el-form-item>
        <!-- appid非授权 人工录入 -->
        <el-form-item key="miniprogramUrl" label="小程序路径" prop="miniprogramUrl" v-else>
          <el-input v-model="form.miniprogramUrl" placeholder="请输入小程序路径" />
        </el-form-item>
        <!-- 人工录入 -->
        <el-form-item
          key="miniprogramInputUrl"
          label=""
          prop="miniprogramInputUrl"
          v-if="isShowPathSelect && form.urlArr.length && form.urlArr[0] === 'manualEntry'"
        >
          <el-input v-model="form.miniprogramInputUrl" placeholder="请输入小程序路径" />
        </el-form-item>
        <el-form-item label="备用网页" prop="backupWebPage">
          <el-input v-model="form.backupWebPage" />
        </el-form-item>
        <!-- <el-form-item label="给粉丝打标签" prop="tags">
          <wx-tags-select v-model="form.tags" multiple :defaultTags="tagList" />
          <multi-cascader
            :show-loading-indicator="false"
            separator=":"
            show-all-levels
            :select-children="true"
            children-key="sub"
            :allow-load-children="true"
            label-key="title"
            :load-children-method="tagLoadChildrenMethod"
            :panel-width="'auto'"
            value-key="id"
            v-model="form.tags"
            :options="tagList"
            select-width="300px"
            size="mini"
          />
        </el-form-item> -->
      </el-form>
    </main>
    <footer class="bottom-button">
      <el-button @click="onGiveUp">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import MultiCascader from '@/dss-wechat3rd/src/components/multiCascader/index.vue';
  import WxTagsSelect from './wxtags-select.vue';
  import qrCodeApi from '@/dss-wechat3rd/src/api/qrCode.js';
  import service from '@/dss-wechat3rd/src/api/index';
  import store from '@/business-common/store.js';
  import memberApi from '@/dss-wechat3rd/src/api/memberAPI';

  import MinappPathSelect from './minapp-path-select.vue';

  function urlValidator(rule, value, callback) {
    const reg = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
    const isUrl = reg.test(value);
    if (!value) {
      callback(new Error('备用网页不能为空'));
    } else if (!isUrl) {
      callback(new Error('请输入正确的链接地址'));
    } else {
      callback();
    }
  }

  export default {
    components: {
      MultiCascader,
      MinappPathSelect,
      WxTagsSelect,
    },

    computed: {
      ...mapState({
        wxAuthInfo: 'wxAuthInfo',
        curTemplateId: 'sellerTemplateId',
        roleList: 'roleList',
        curStore: 'curStore',
      }),
      // 管理员
      isManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },
      // 是否显示小程序路径下拉选择控件
      isShowPathSelect() {
        this.form.miniprogramUrl = '';
        return this.wxAuthInfo && this.form.wxMiniprogramId == this.wxAuthInfo.wxMaAppId;
      },
    },

    data() {
      const checkMiniprogramUrl = (rules, value, callback) => {
        if (!value) {
          return callback(new Error('小程序路径不能为空'));
        } else if (this.form.miniprogramUrl.linkType && !this.form.miniprogramUrl.detailId) {
          return callback(new Error(this.form.miniprogramUrl.name + '详情项不能为空'));
        } else {
          return callback();
        }
      };
      return {
        loading: false,
        tagList: [],
        form: {
          // 1: 公众号二维码
          // 2: 小程序二维码
          qrType: 2,
          qrStyle: 0,
          replyType: 0,

          // 公众号二维码信息
          qrName: '',
          tags: [],

          // 小程序二维码信息
          wxMiniprogramId: '',
          miniprogramUrl: '',
          backupWebPage: 'https://www.wakedata.com',
          relationParam: '',
          urlArr: [],
        },

        rules: {
          qrName: [{ required: true, message: '二维码名称不能为空', trigger: 'blur' }],
          wxMiniprogramId: [{ required: true, message: '小程序Id不能为空', trigger: 'blur' }],
          miniprogramUrl: [{ required: true, validator: checkMiniprogramUrl, trigger: 'blur' }],
          urlArr: [{ required: true, message: '小程序路径不能为空', trigger: 'blur' }],
          miniprogramInputUrl: [{ required: true, message: '小程序路径不能为空', trigger: 'blur' }],
          backupWebPage: [
            {
              validator: urlValidator,
              trigger: 'blur',
            },
          ],
        },

        customPages: [],
        loadingMaAppId: false,
      };
    },

    methods: {
      featchTags() {
        this.loading = true;
        return memberApi
          .getLabelCategories()
          .done(res => {
            this.tagList = (res.data || []).map(item => {
              const id = item.id;
              return {
                title: item.name,
                type: 'main',
                id: id + '',
                childCount: item.childCount,
              };
            });
          })
          .always(i => {
            this.loading = false;
          });
      },

      tagLoadChildrenMethod(data) {
        return memberApi.getTagByCategory({ categoryId: data.id }).done(res => {
          return (res.data || []).map(item => {
            const childMax = data.title.length > 8 ? 8 : 10;
            let title = item.name || '';
            title = title.length > 10 ? title.slice(0, childMax) + '...' : title;
            return {
              title,
              id: item.id,
              subId: item.id,
              type: 'sub',
              sub: null,
            };
          });
        });
      },

      useSystemMaAppId() {
        this.loadingMaAppId = true;
        // service
        //   .getCustomPages({
        //     sellerTemplateId: this.curTemplateId
        //   })
        //   .then(response => {
        //     this.customPages = response.data;
        //     this.form.wxMiniprogramId = this.wxAuthInfo ? this.wxAuthInfo.wxMaAppId : '';
        //     store.commit('set_customPages', response.data);
        //   });

        service
          .getCustomPagesV3({
            sellerTemplateId: this.curTemplateId,
            storeId: this.isManager ? 0 : this.curStore.id,
          })
          .then(response => {
            if (response.success === true) {
              this.customPages = response.data;
              this.form.wxMiniprogramId = this.wxAuthInfo ? this.wxAuthInfo.wxMaAppId : '';
              store.commit('set_customPages', response.data);
            }
          })
          .always(() => {
            this.loadingMaAppId = false;
          });
      },

      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (!valid) return;
          let miniprogramUrl = null;
          let scene = null;
          let pathInfo = null;
          let newUrlArr = null;
          const urlArr = this.form.urlArr;
          if (this.isShowPathSelect && urlArr && urlArr.length >= 2) {
            newUrlArr =
              Object.prototype.toString.call(urlArr[urlArr.length - 1]).toLowerCase() === '[object string]'
                ? JSON.parse(urlArr[urlArr.length - 1])
                : urlArr[urlArr.length - 1];
          } else {
            newUrlArr = [...urlArr];
          }

          // appid是当前授权的小程序appid且是选择的路径
          if (this.isShowPathSelect && urlArr[0] !== 'manualEntry') {
            if (newUrlArr && newUrlArr.linkType) {
              miniprogramUrl = newUrlArr.index.split('?')[0];
              pathInfo = newUrlArr.index.split('?')[1] + newUrlArr.detailId;
              scene = newUrlArr.index.split('?')[1] + newUrlArr.detailId;
            } else {
              miniprogramUrl = newUrlArr.index;
            }

            // 人工录入
          } else if (this.isShowPathSelect && urlArr[0] === 'manualEntry') {
            miniprogramUrl = this.form.miniprogramInputUrl;

            // appid非授权 人工录入
          } else if (!this.isShowPathSelect) {
            miniprogramUrl = this.form.miniprogramUrl;
          }

          const params = {
            miniProgramInfo: JSON.stringify({
              wxMiniprogramId: this.form.wxMiniprogramId,
              // 自定义页（不带 tabbar 版本）需要添加 wxat-common/ 前缀
              miniprogramUrl: /^pages\/custom\//.test(miniprogramUrl)
                ? 'wxat-common/' + miniprogramUrl
                : miniprogramUrl,
              pathInfo,
              backupWebPage: this.form.backupWebPage,
            }),
            scene,
            qrName: this.form.qrName,
            qrStyle: this.form.qrStyle,
            qrType: this.form.qrType,
            replyType: this.form.replyType,
            relationParam: this.form.relationParam,
            // tags: this.form.tags
          };
          this.loading = true;
          qrCodeApi
            .add(params)
            .done(res => {
              this.$router.push('/marketing/minapp-qrcode');
            })
            .always(i => {
              this.loading = false;
            });
        });
      },
      // 取消时返回上一页
      onGiveUp() {
        this.$router.back();
      },
    },

    mounted() {
      // this.featchTags().always(() => {
      //   console.log('featchTags-bingo')
      //
      // });
      this.useSystemMaAppId();
    },
    watch: {
      // 'form.urlArr'(val) {
      //   console.log('urlArr--', val)
      //   if ((val && val.length < 3 && val[1] === 'custom') || (!val.length && this.isShowPathSelect)) {
      //     this.form.miniprogramUrl = '';
      //     return;
      //   }
      //   if (val && val.length >= 2) {
      //     this.form.miniprogramUrl =
      //       Object.prototype.toString.call(val[val.length - 1]).toLowerCase() === '[object string]'
      //         ? JSON.parse(val[val.length - 1])
      //         : val[val.length - 1];
      //     console.log(this.form.miniprogramUrl);
      //   }
      //   // 手工录入小程序路径
      //   if (val && val.length === 1 && val[0] === 'manualEntry') {
      //     this.form.miniprogramUrl = {}
      //   }
      // }
    },
  };
</script>

<style lang="less" scoped>
  .qrcode-add {
    .bg-mixin;

    padding: 18px 20px;
    border-radius: 0 0 4px 4px;

    header {
      width: 100%;
      height: 50px;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #333;
    }

    main {
      .el-input {
        width: 300px;
      }
    }
  }
</style>
