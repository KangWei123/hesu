<template>
  <div class="qrcode-eidtor" v-loading="loading">
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/qrCode/list' }">二维码管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEditor ? '编辑' : '新建'}}二维码</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="qrcode-form">
      <el-form
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="130px"
        ref="elForm"
        size="mini"
      >
        <el-form-item label="二维码类型:" prop="qrType">
          <el-radio-group :disabled="isEditor" v-model="form.qrType">
            <el-radio :label="1">公众号二维码</el-radio>
            <el-radio :label="2">小程序二维码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="qrname-item" label="二维码名称:" prop="qrName">
          <el-input :maxlength="14" style="width: 300px" v-model.trim="form.qrName"></el-input>
          <span class="maxLen">{{form.qrName ? form.qrName.length : 0}}/14</span>
        </el-form-item>

        <!--<el-form-item label="二维码样式:" prop="qrStyle">-->
        <!--<el-radio-group v-model="form.qrStyle">-->
        <!--<el-radio :label="1">显示品牌logo</el-radio>-->
        <!--<el-radio :label="0">不显示品牌logo</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->

        <el-form-item label="小程序id:" prop="wxMiniprogramId" v-show="form.qrType === 2">
          <el-input style="width: 300px" v-model="form.wxMiniprogramId"></el-input>
        </el-form-item>

        <el-form-item label="小程序路径:" prop="miniprogramUrl" v-show="form.qrType === 2">
          <tabbar-link-select
            :size="'mini'"
            :usedPages="usedPages"
            @change="pickMaLink"
            v-if="!!wxAuthInfo && !!wxAuthInfo.wxMaAppId && wxAuthInfo.wxMaAppId === form.wxMiniprogramId && curTemplateId && customPages && customPages.length"
          ></tabbar-link-select>
          <el-input style="width: 300px" v-else v-model="form.miniprogramUrl"></el-input>
        </el-form-item>

        <el-form-item label="备用网页" prop="backupWebPage" v-show="form.qrType === 2">
          <el-input style="width: 300px" v-model="form.backupWebPage"></el-input>
        </el-form-item>
        <el-form-item label="是否开启自动回复:" prop="replyType" v-show="form.qrType === 1">
          <el-radio-group v-model="form.replyType">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="response-box" v-show="form.replyType  === 1 && form.qrType === 1">
          <span class="response-box-label">自动回复:</span>
          <add-message-panel
            :bzName="'sendMsg'"
            :choosedMaterials="choosedMaterials"
            :store="messageData"
            :textLength="500"
            @changeMaterials="changeMaterials"
            ref="$SendMsg"
          ></add-message-panel>
        </div>
        <el-form-item label="给粉丝打标签:" prop="replyType" v-if="!isEditor">
          <multiCascader
            :showLoadingIndicator="false"
            separator=":"
            show-all-levels
            :selectChildren="true"
            childrenKey="sub"
            :allowLoadChildren="true"
            labelKey="title"
            :loadChildrenMethod="tagLoadChildrenMethod"
            :panelWidth="'auto'"
            valueKey="id"
            v-model="form.tags"
            :options="tagList"
            selectWidth="300px"
            size="mini"
          />
        </el-form-item>
      </el-form>
      <el-button size="small" class="qrcode-eidtor-save" round type="primary" @click="onSave">保存</el-button>
      <!-- <editLabel @addSuccess="addLabelSuccess" ref="editLabel" /> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import service from '@/dss-wechat3rd/src/api/index';
import UrlUtil from '@/dss-common/utils/url';
import store from '@/business-common/store.js';

import AddMessagePanel from '@/dss-wechat3rd/src/components/add-message-panel';
import { ButtonTypes, ButtonTypesArray } from '@/dss-wechat3rd/src/constants/wx-msg';

import TabbarLinkSelect from '@/dss-wechat3rd/src/bz_components/tabbarLinkSelect/index.vue';
import multiCascader from '@/dss-wechat3rd/src/components/multiCascader/index.vue';
import qrCodeApi from '@/dss-wechat3rd/src/api/qrCode.js';
import materialsApi from '@/dss-wechat3rd/src/api/materials.js';
import memberApi from '@/dss-wechat3rd/src/api/memberAPI.js';

// import dynamicLabel from './dynamicLabel';
// import editLabel from './editLabel.vue';

function urlValidator(rule, value, callback) {
  if (!value) {
    callback(new Error('备用网页不能为空'));
  } else if (!UrlUtil.isUrl(value)) {
    callback(new Error('请输入正确的链接地址'));
  } else {
    callback();
  }
}

export default {
  computed: {
    ...mapState({
      wxAuthInfo: 'wxAuthInfo',
      curTemplateId: 'sellerTemplateId',
      customPages: 'customPages'
    })
  },
  components: {
    TabbarLinkSelect,
    // dynamicLabel,
    multiCascader,
    AddMessagePanel
    // editLabel
  },
  data() {
    return {
      usedPages: { custom: [], default: [] },
      form: {
        //1: 公众号二维码
        //2: 小程序二维码
        qrType: 1,

        //公众号二维码信息
        qrName: '',
        tags: [],
        replyType: 0,
        qrStyle: 0,

        //小程序二维码信息
        wxMiniprogramId: '',
        miniprogramUrl: '',
        backupWebPage: 'https://www.wakedata.com'
      },
      loading: false,
      tagList: [],
      isEditor: false,
      choosedMaterials: {},
      messageData: {
        type: ButtonTypes.TEXT
      },

      rules: {
        qrName: [{ required: true, message: '二维码名称不能为空', trigger: 'blur' }],
        wxMiniprogramId: [{ required: true, message: '小程序Id不能为空', trigger: 'blur' }],
        miniprogramUrl: [{ required: true, message: '小程序路径不能为空', trigger: 'blur' }],
        backupWebPage: [
          {
            required: true,
            validator: urlValidator,
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    let { id } = this.$route.query;
    if (id) {
      this.isEditor = true;
      this.qrId = id;
      this.fetchQrData(id);
    }
    this.featchTags().always(() => {
      this.useSystemMaAppId();
    });
  },
  watch: {
    'form.wxMiniprogramId'(newVal, oldVal) {
      if (oldVal === this.wxAuthInfo.wxMaAppId) {
        this.form.miniprogramUrl = '';
      }
    }
  },
  methods: {
    pickMaLink(option) {
      let opt = JSON.parse(option[1]);
      this.form.miniprogramUrl = opt.index;
    },
    useSystemMaAppId() {
      if (!this.form.wxMiniprogramId && this.wxAuthInfo.wxMaAppId) {
        if (
          !!(this.form.wxMiniprogramId = this.wxAuthInfo.wxMaAppId) &&
          (!this.customPages || !this.customPages.length)
        ) {
          service
            .getCustomPages({
              sellerTemplateId: this.curTemplateId
            })
            .then(response => {
              store.commit('set_customPages', response.data);
            });
        }
      }
    },
    changeMaterials(value) {
      if (this.messageData.type === ButtonTypes.TEXT) {
        this.choosedMaterials[this.messageData.type] = value;
        this.messageData.value = value;
        return;
      }
      if (!value) {
        this.choosedMaterials[this.messageData.type] = null;
        this.messageData.value = null;
        return;
      }
      this.choosedMaterials[this.messageData.type] = {
        ...value,
        type: this.messageData.type
      };
      this.choosedMaterials = { ...this.choosedMaterials };
      this.messageData.value = {
        ...value,
        type: this.messageData.type
      };
    },
    // 根据id获取素材的信息
    featchMaterialsById(id) {
      let articleIds = [];
      let materialsIds = [];
      if (this.messageData.type === ButtonTypes.Article) {
        articleIds.push(id);
      } else {
        materialsIds.push(id);
      }
      materialsApi
        .queryMaterialsById({ articleIds: articleIds.join(','), materialsIds: materialsIds.join(',') })
        .done(res => {
          let wxArticleVOList = res.data.wxArticleVOList || [];
          let wxMaterialsVOList = res.data.wxMaterialsVOList || [];
          let data = [...wxArticleVOList, ...wxMaterialsVOList][0];

          console.log('fetched data', data);
          if (!data) return false;

          if (this.messageData.type === ButtonTypes.Article) {
            let { title, id, wxMediaId, author, digest, thumbUrl } = data;
            // TODO: 注意如果支持多图文这里需要修改
            this.changeMaterials({
              value: id,
              wxMediaId,
              article: [data]
            });
          } else if (this.messageData.type === ButtonTypes.IMAGE) {
            this.changeMaterials({
              value: data.id,
              imgUrl: data.url,
              wxMediaId: data.wxMediaId
            });
          } else {
            this.changeMaterials({
              value: data.id,
              originalName: data.originalName,
              wxMediaId: data.wxMediaId
            });
          }
        })
        .always(_ => {
          this.loading = false;
        });
    },
    fetchQrData(id) {
      qrCodeApi.single({ id: id }).done(res => {
        console.log(res);
        // this.form.qrName = res.data.qrName;
        let data = res.data || {};
        let form = this.form;
        form.qrType = data.qrType || 1;
        form.qrName = data.qrName || '';
        form.replyType = data.replyType || 0;
        form.tags = data.tags ? data.tags.split('#').map(item => +item) : [];

        // 自动回复类型
        if (data.contentType === 1) {
          // 文字回复
          let content = data.content;
          this.messageData = { value: content, type: ButtonTypes.TEXT };
          this.choosedMaterials = { value: content };
        } else if (data.contentType === 2) {
          let content = data.content;
          this.messageData.type = ButtonTypes.IMAGE;
          this.featchMaterialsById(+content);
        }
      });
    },
    addLabelSuccess() {
      this.featchTags();
    },
    featchTags() {
      this.loading = true;
      return memberApi
        .getLabelCategories()
        .done(res => {
          this.tagList = (res.data || []).map(item => {
            let id = item.id;
            return {
              title: item.name,
              type: 'main',
              id: id + '',
              childCount: item.childCount
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
            sub: null
          };
        });
      });
    },
    onSave() {
      let params = this.verify();
      if (!params) return false;
      this.loading = true;
      if (this.isEditor) {
        qrCodeApi
          .updated({ ...params })
          .done(res => {
            this.$router.push('/marketing/qrCode/list');
          })
          .always(i => {
            this.loading = false;
          });
      } else {
        qrCodeApi
          .add(params)
          .done(res => {
            this.$router.push('/marketing/qrCode/list');
          })
          .always(i => {
            this.loading = false;
          });
      }
    },
    verify() {
      let { qrName, tags, qrType, replyType, qrStyle, wxMiniprogramId, miniprogramUrl, backupWebPage } = this.form;
      console.log(tags);
      let params = {
        qrName,
        qrType,
        replyType,
        tags,
        qrStyle
      };
      if (qrType === 1) {
        this.$refs.elForm.validateField('qrName');
        if (replyType === 1) {
          let { type, value } = this.messageData;
          if (type === ButtonTypes.TEXT) {
            if (!value) {
              this.$refs.$SendMsg.verify();
              return false;
            }
            params.content = value;
          } else {
            if (!(value && value.value)) {
              this.$refs.$SendMsg.verify();
              return false;
            }
            params.content = value.value;
          }
          params.contentType = ButtonTypesArray.findIndex(i => i === type);
        }
        if (!qrName) return false;
      } else {
        let success = false;
        this.$refs.elForm.validate((pass, object) => {
          success = pass;
        });
        if (!success) return false;

        params = {
          ...params,
          miniProgramInfo: JSON.stringify({
            wxMiniprogramId,
            miniprogramUrl,
            backupWebPage
          })
        };
      }
      // 修改二维码如果 tags 为空，那么传递空字符串
      if (this.isEditor && !tags.length) {
        params.tags = null;
      }
      if (this.isEditor) {
        params.id = this.qrId;
      }
      return params;
    }
  }
};
</script>

<style lang="less">
.qrcode-form {
  padding: 20px 20px 0;
}
.qrcode-eidtor {
  // padding-left: 20px;
  .qrcode-eidtor-title {
    margin: 20px 0 10px;
  }
  .qrcode-eidtor-save.el-button--small,
  .el-button--small.is-round {
    padding: 0;
    width: 100px;
    height: 30px;
    box-sizing: border-box;
    margin: 10px 0 0 120px;
  }
  .response-box {
    width: 900px;
    display: flex;
    .response-box-label {
      width: 130px;
      display: inline-block;
      text-align: right;
      box-sizing: border-box;
      padding: 0 12px 0 0;
    }
    .wx-msg-panel {
      flex: 1;
      // margin-left: 10px;
    }
  }
  .qrname-item {
    position: relative;
    .maxLen {
      left: 305px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      position: absolute;
    }
  }
}
</style>
