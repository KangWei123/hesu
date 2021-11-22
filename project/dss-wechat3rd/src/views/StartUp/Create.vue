<template>
  <div class="start-up-create">
    <!--创建店铺-->
    <div class="creating" v-if="step == Steps.Creating">
      <!--企业logo ,默认图片，根据选择的行业类型不一样-->
      <div class="logo-spot" :class="industryKey" v-if="!form.logo" ref="$domDefaultLogo"></div>
      <img class="logo-spot" v-if="form.logo" :src="form.logo" />

      <add-image @success="onLogoUploadSuccess">
        <a href="javascript:;" class="start-upload">上传企业logo</a>
      </add-image>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="dss-form"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input type="input" v-model="form.name" placeholder="请输入店铺名称"></el-input>
        </el-form-item>

        <el-form-item label="主营业务" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择主营业务">
            <el-option v-for="(item, index) in categorys" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择地图位置" prop="longitude" ref="mapFormItem">
          <div class="dss-map" id="id_for_map">地图初始化容器</div>
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input
            type="input"
            v-model="form.address"
            @input="onLocationLatLng"
            placeholder="请填写详细地址，方便会员查找"
          ></el-input>
        </el-form-item>

        <el-form-item label="" prop="agreement" class="agreement-item">
          <el-checkbox v-model="form.agreement"></el-checkbox>
          <a href="javascript:;" @click="clickAgreement" class="agreement">我已阅读并同意《惟客宝产品及服务协议》</a>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" size="mini" class="submit-btn" @click="onSubmit"
            >创建店铺
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--创建成功-->
    <div class="created" v-else>
      <div class="_title">
        <i class="_success_icon"></i>
        创建成功
      </div>
      <div class="_desc">
        如果您有微信公众号及小程序，马上把店铺与微信打通吧，<br />
        为保证所有功能正常，授权时请保持默认选择，把权限统一授权给惟客宝
      </div>
      <ul class="_rules">
        <li>• 绑定微信公众号，将可适用惟客宝帮助您推送营销图文</li>
        <li>• 绑定小程序，将可以通过惟客宝一键发布小程序</li>
        <li>• 如果您还没有微信公众号，可以点此注册</li>
        <li>• 如果您还没有小程序，可以点此注册</li>
      </ul>
      <div class="_btns" v-loading="!storeChanged" element-loading-spinner="el-icon-loading">
        <el-button type="primary" size="mini" @click="toBind">去绑定公众号及小程序 </el-button>
        <el-button size="mini" @click="toConsole">稍后再说，进入店铺后台 </el-button>
      </div>

      <!-- <div class="home-spot"
            :style="{'background-image': 'url('+imgUrl+')'}" /> -->
      <div class="home-spot" :class="bgImage" />
      <div class="split-line"></div>
    </div>
    <agreement-dialog :visible.sync="dialog.agreement" protocol="wkb-product"> </agreement-dialog>
  </div>
</template>

<script>
  import store from '@/business-common/store.js';
  import api from '@/dss-wechat3rd/src/api';
  import DssMap from '@/dss-wechat3rd/src/components/Map/index';
  import AgreementDialog from '@/dss-wechat3rd/src/bz_components/agreement/AgreementDialog';
  import AddImage from '@/dss-wechat3rd/src/components/materials/addImage.vue';
  import storeUser from '@/business-common/store_user.js';
  import './Create.less';

  /**
   * 提取背景图片绝对地址
   * @param dom {Element}
   * @returns {string}
   */
  function extractBgImageAbsUrl(dom) {
    const currentStyle = dom.currentStyle ? dom.currentStyle : window.getComputedStyle(dom);
    let url = '';
    if (currentStyle) {
      if ((url = currentStyle.backgroundImage)) {
        url = url.replace(/(url\()|\)|"/g, '');

        const loc = window.location;
        const protocol = loc.protocol;
        const hostname = loc.hostname;
        const port = loc.port;
        const curLoc = `${protocol}//${hostname}${port ? ':' + port : ''}/`;
        const isProd = new RegExp(/^(https)/).test(protocol);
        const prefix = isProd ? process.env.VUE_APP_CDN_URL + '/' : curLoc;
        url = url.replace(curLoc, prefix);
      }
    }
    return url;
  }

  const Steps = {
    Creating: 'Creating',
    Created: 'Created',
  };

  export default {
    mixins: [storeUser],
    components: {
      AddImage,
      AgreementDialog,
    },
    data() {
      const agreementCheck = (rule, value, callback) => {
        if (!value) {
          callback('请同意服务协议');
        } else {
          callback();
        }
      };

      return {
        searchKeyWord: '',
        sellerId: 190,
        wxAppId: 'wx5083b1e276e29739',

        industryKey: 'beautiful',
        industryId: null,
        templateId: null,
        // imgUrl: null,
        bgImage: null,

        loading: true,
        submitting: false,
        storeCreated: false,
        storeChanged: false,
        Steps: Steps,

        rules: {
          name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
          categoryId: [
            {
              required: true,
              message: '请输入主营业行业',
              trigger: ['blur', 'change'],
            },
          ],
          address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
          agreement: [{ validator: agreementCheck, trigger: ['blur', 'change'] }],
          longitude: [{ required: true, message: '请选择地图位置', trigger: 'blur' }],
        },

        // 提交表单
        form: {
          logo: null, // logo
          defaultLogo: null, // 默认头像

          longitude: null, // 经度
          latitude: null, // 纬度

          province: null, // 省份
          city: null, // 城市
          district: null, // 区

          address: null, // 详细地址
          name: null, // 店铺名称
          categoryId: null, // 店铺类目类型

          agreement: false,
        },
        // 类目列表
        categorys: [],
        dialog: {
          agreement: false,
        },
      };
    },
    computed: {
      step() {
        return this.storeCreated || this.storeChanged ? Steps.Created : Steps.Creating;
      },
    },
    mounted() {
      // const { industryId, industryKey, templateId, imgUrl } = this.$route.query;
      const { industryId, industryKey, templateId, bgImage } = this.$route.query;
      this.industryKey = industryKey;
      this.industryId = industryId;
      this.templateId = templateId;
      // this.imgUrl = imgUrl;
      this.bgImage = bgImage;

      // 初始化 表单数据
      api
        .queryIndustry(industryId)
        .then(res => {
          this.categorys = res.data;
        })
        .always(() => {
          this.loading = false;
        });

      this.form.defaultLogo = extractBgImageAbsUrl(this.$refs.$domDefaultLogo);

      // 初始化地图
      DssMap.initMap({
        htmlId: 'id_for_map',
        onClickMap: this.onClickMap,
        onMapLocation: this.onMapLocation,
        installSearchInvoke: this.installSearchInvoke,
      });
    },
    methods: {
      installSearchInvoke(callback) {
        this._searchInvoke = callback;
        this.onLocationLatLng();
      },
      onLocationLatLng() {
        if (!!this._searchInvoke && !!this.form.address) {
          this._searchInvoke(this.form.address).then(poi => {
            if (poi) {
              DssMap.locationLatLng(poi.latLng);
            }
          });
        }
      },
      // 图片上传成功回调
      onLogoUploadSuccess(url) {
        this.form.logo = url;
      },

      // 点击地图回调
      onClickMap(latitude, longitude) {
        // console.log('onClickMap(latitude, longitude)',latitude, longitude);
        // form: 经纬度
        this.$refs.mapFormItem.resetField();
        this.form.latitude = latitude;
        this.form.longitude = longitude;
      },

      // 地图位置信息定为后回调
      onMapLocation(address, addressComponents) {
        // console.log('onMapLocation(address, addressComponents)',address, addressComponents)
        this.form.address = address;
        const { city, district, province } = addressComponents;
        this.form.province = province;
        this.form.city = city;
        this.form.district = district;
      },

      onSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.apiCreate();
          } else {
            return false;
          }
        });
      },

      apiCreate() {
        const form = this.form;
        this.submitting = true;
        api
          .addApp({
            logo: form.logo || form.defaultLogo, // logo
            longitude: form.longitude, // 经度
            latitude: form.latitude, // 纬度
            province: form.province, // 省份
            city: form.city, // 城市
            district: form.district, // 区
            address: form.address, // 详细地址
            appName: form.name, // 店铺名称
            industryId: this.industryId, // 行业ID
            industryCategoryId: form.categoryId, // 店铺类目类型
            templateId: this.templateId, // 店铺模板的id
          })
          .then(res => {
            this.storeCreated = true;
            this.changeApp(res.data);
          })
          .always(() => {
            this.submitting = false;
          });
      },

      // 切换店铺
      changeApp(storeId) {
        api.changeApp({ appId: storeId }).then(res => {
          this.update_userInfo(res.data);
          this.storeChanged = true;
        });
      },

      // 点击协议 todo
      clickAgreement() {
        this.dialog.agreement = true;
      },
      // 跳绑定设置
      toBind() {
        this.$router.push('/setting/wx/mp/version');
      },
      // 跳控制台
      toConsole() {
        this.$router.push('/console');
        this.getUserTemplateId();
      },
      getUserTemplateId() {
        api.getUserTemplate().then(response => {
          if (response.data && response.data.templateId) {
            store.commit('set_sellerTemplateId', response.data.id);
          }
        });
      },
    },
  };
</script>
