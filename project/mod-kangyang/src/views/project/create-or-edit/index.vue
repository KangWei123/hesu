<template>
  <form-page-layout :title-visible="false">
    <div class="page-content">
      <el-steps :space="200" :active="activeStep">
        <el-step title="基本信息" @click="activeStep = 0"></el-step>
        <el-step title="价格信息" @click="activeStep = 1"></el-step>
        <el-step title="详情" @click="activeStep = 2"></el-step>
      </el-steps>

      <div class="container">
        <el-form
          ref="form"
          v-loading="loading"
          :model="form"
          :rules="rules"
          label-width="130px"
          @submit.native.prevent="handleSave"
        >
          <div v-show="activeStep === 0">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="form.name" maxlength="25" class="w220" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="项目类型" prop="prjType">
              <el-select v-model="form.prjType" class="w220">
                <el-option
                  v-for="item of projectTypes"
                  :key="item.id"
                  :value="item.id"
                  :label="item.typeName"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="项目标签" prop="prjTagList">
              <label-select :all-types="tags" v-model="form.prjTagList"></label-select>
            </el-form-item>

            <el-form-item label="宣传横幅" prop="bannerUrl">
              <choose-image-single v-model="form.bannerUrl" />
              <span class="ml14 tip">建议尺寸 690px * 228px</span>
            </el-form-item>

            <el-form-item label="项目所属地区" prop="area">
              <region-select
                ref="regionSelect"
                v-model="form.area"
                class="region-select"
                :class="{ 'has-value': !!form.areaName }"
                :placeholder="isEdit ? form.areaName : '请选择省-市-区'"
              />
            </el-form-item>

            <el-form-item label="项目地址" prop="address">
              <address-select v-model="form.address" :clear-lat-lng-when-type="true" :get-lat-lng="true" />
            </el-form-item>

            <el-form-item label="开业时间" prop="openTime">
              <el-date-picker
                v-model="form.openTime"
                class="w220"
                type="date"
                placeholder="请输入开业时间"
                :value-format="DATE_FORMAT_4_ELM"
                :format="DATE_FORMAT_4_ELM"
              />
            </el-form-item>

            <el-form-item label="建筑面积" prop="floorArea">
              <el-input-number
                v-model="form.floorArea"
                class="w220"
                :controls="false"
                :min="1"
                :max="9999999"
                maxlength="7"
                placeholder="请输入"
              />
              <span class="ml14 vmiddle tip">m<span class="vsuper ft-smaller">2</span> </span>
            </el-form-item>

            <el-form-item label="公共空间" prop="publicSpace">
              <el-input-number
                v-model="form.publicSpace"
                class="w220 vmiddle"
                :controls="false"
                :min="0"
                :max="9999999"
                maxlength="7"
                placeholder="请输入"
              />
              <span class="ml14 vmiddle tip">m<span class="vsuper ft-smaller">2</span> </span>
            </el-form-item>

            <el-form-item label="总床位" prop="totalBed">
              <el-input-number
                v-model="form.totalBed"
                class="w220 vmiddle"
                :controls="false"
                :min="0"
                :max="9999999"
                maxlength="7"
                placeholder="请输入"
              />
              <span class="ml14 tip">个</span>
            </el-form-item>

            <el-form-item label="入住率" prop="occupancyRate">
              <el-input-number
                v-model="form.occupancyRate"
                class="w220 vmiddle"
                :controls="false"
                :min="0"
                :max="100"
                placeholder="请输入"
              />
              <span class="ml14 tip">%</span>
            </el-form-item>

            <el-form-item label="院区风采" prop="albums">
              <album-select v-model="form.albums" />
            </el-form-item>

            <el-form-item label="院区风采首页" prop="mainImgs">
              <choose-image-multi v-model="form.mainImgs" :limit="3" :width="88" :height="88">
                <span class="tip">提示：请上传三张图片，默认第一张为首页显示</span>
              </choose-image-multi>
            </el-form-item>

            <el-form-item label="院区视频" prop="videos">
              <choose-video-multi v-model="form.videos" />
            </el-form-item>

            <el-form-item label="VR链接" prop="vrUrl">
              <el-input v-model="form.vrUrl" class="w220" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="咨询电话" prop="contacts">
              <el-input v-model="form.contacts" class="w220" placeholder="请输入咨询电话"></el-input>
              <span class="tip ml14">区号-电话号码，手机号码，或400客服热线</span>
            </el-form-item>
          </div>

          <div v-if="activeStep === 1">
            <el-form-item label="价格" prop="price">
              <price-input v-model="form.price" />
              <span class="tip ml14">元/月/床</span>
            </el-form-item>

            <div class="preview">
              <div class="preview__title">价格区间设置预览效果</div>
              <screen :form="form" />
            </div>
          </div>

          <el-form-item v-if="activeStep === 2" label="项目详情" prop="detail">
            <w-editor v-if="loaded" :data-source="form.detail" :is-show-minapp="false" :image-limit="30"></w-editor>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
      <el-button plain :loading="loading" type="primary" @click="handleSave">保存</el-button>
      <el-button v-if="activeStep > 0" type="primary" @click="prevPress">上一步</el-button>
      <el-button v-if="activeStep < 2" type="primary" @click="nextPress">下一步</el-button>
    </template>
  </form-page-layout>
</template>

<script>
  import {
    FORMAT_4_ELM,
    DATE_FORMAT_4_ELM,
    ChooseImageSingle,
    ChooseImageMulti,
    ChooseVideoMulti,
    AddressSelect,
  } from '@/register/kangyang';
  import { projectApi } from '@/mod-kangyang/src/api/project';
  import LabelSelect from './label-select';
  import AlbumSelect from './album-select';
  import PriceInput from './price-input';
  import regexps from '@/dss-common/utils/regexps';
  import { WEditor } from '@/register/wechat3rd';
  import { FormPageLayout, FormGroup } from '@/dss-common/components/form-page';
  import RegionSelect from './region-select';
  import Screen from './screen';

  const required = message => ({ required: true, message: message || '不能为空' });
  const rules = {
    name: [required('请输入项目名称')],
    prjType: [required('请选择项目类型')],
    relatedOrgId: [required('请选择关联组织架构')],
    prjTagList: [
      required('请添加项目标签'),
      {
        validator(rule, value, callback) {
          if (value == null || value.length === 0) {
            callback(new Error('请添加项目标签'));
          } else {
            callback();
          }
        },
      },
    ],
    address: [
      required('请输入项目地址'),
      {
        validator(rule, value, callback) {
          const { address, latitude, longitude } = value;
          if (!address || !latitude || !longitude) {
            callback(new Error('请选择项目地址'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    floorArea: [required('请输入建筑面积')],
    openTime: [required('请输入开业时间')],
    totalBed: [required('请输入总床位')],
    albums: [
      required('请上传相册'),
      {
        validator(rule, value, callback) {
          if (value.some(i => i.name == null || i.name.trim() === '')) {
            callback(new Error('请输入相册名称'));
          } else if (value.some(i => i.urls.length === 0)) {
            callback(new Error('有相册遗漏相片'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    mainImgs: [
      required('请上传院区风采首页'),
      {
        validator(rule, value, callback) {
          if (value == null || value.length !== 3) {
            callback(new Error('请选择 3 张照片'));
          } else {
            callback();
          }
        },
      },
    ],
    videos: [
      required('请上传院区视频'),
      {
        validator(rule, value, callback) {
          if (value.some(i => i.name === null || i.name.trim() === '')) {
            callback(new Error('请输入视频名称'));
          } else if (value.some(i => !i.url || !i.coverUrl)) {
            callback(new Error('请设置视频和封面'));
          } else {
            callback();
          }
        },
      },
    ],
    price: [
      required('请输入价格'),
      {
        validator(rule, value, callback) {
          const { start: _start, end: _end } = value;
          const start = parseFloat(_start);
          const end = parseFloat(_end);
          if (Number.isNaN(start)) {
            callback(new Error('请输入最低价格'));
          } else if (Number.isNaN(end)) {
            callback(new Error('请输入最高价格'));
          } else if (end <= start) {
            callback(new Error('最低价格不能高于最高价格'));
          } else {
            callback();
          }
        },

        trigger: 'blur',
      },
    ],
    contacts: [
      required('请输入咨询电话'),
      { pattern: regexps.servicePhone.reg, message: '请输入正确的联系电话', trigger: 'blur' },
    ],
    detail: [
      {
        validator(rule, value, callback) {
          if (!value.describe) {
            callback(new Error('请输入项目详情'));
            return;
          }
          callback();
        },
      },
    ],
  };

  /**
   * 创建和编辑项目
   */
  export default {
    name: 'CreateOrEditProject',
    components: {
      LabelSelect,
      AlbumSelect,
      PriceInput,
      ChooseImageSingle,
      ChooseImageMulti,
      ChooseVideoMulti,
      AddressSelect,
      WEditor,
      FormPageLayout,
      FormGroup,
      RegionSelect,
      Screen,
    },
    data() {
      return {
        FORMAT_4_ELM,
        DATE_FORMAT_4_ELM,
        projectTypes: [],
        tags: [],
        rules,
        loading: false,
        activeStep: 0,
        form: {
          name: '',
          id: undefined,
          prjType: undefined,
          relatedOrgId: undefined,
          prjTagList: [],
          address: undefined,
          openTime: undefined,
          floorArea: undefined,
          publicSpace: undefined,
          needAssess: 1,
          contacts: undefined,
          totalBed: undefined,
          occupancyRate: undefined,
          albums: /** @type {Array<{id: number | string, name: string, urls: string[]}>} */ ([]),
          mainImgs: [],
          videos: [],
          price: { start: undefined, end: undefined },
          detail: {},
          vrUrl: '',
          bannerUrl: '',
          weChatImage: '',
          area: [],
        },
        loaded: false,
      };
    },
    computed: {
      id() {
        return this.$route.params.id;
      },
      isEdit() {
        return !!this.id;
      },
      minPrice() {
        const { start } = this.form.price;
        return start || 0;
      },
      maxPrice() {
        const { end } = this.form.price;
        return end || 0;
      },
    },
    watch: {
      daterange(range) {
        if (!range) {
          this.form.startTime = null;
          this.form.endTime = null;
          return;
        }
        const [startTime, endTime] = range;
        if (startTime) {
          this.form.startTime = startTime;
        }
        if (endTime) {
          this.form.endTime = endTime;
        }
      },
    },

    async mounted() {
      this.getProjectTypes();
      this.getProjectTags();

      if (this.isEdit) {
        const { data } = await projectApi.getDetail({ id: this.id });
        this.origin = data;
        const normalized = this.fromPayload(data);
        Object.assign(this.form, normalized);
      }
      this.loaded = true;
    },

    methods: {
      handleSave() {
        this.$refs.form
          .validate()
          .then(() => {
            this.save();
          })
          .catch(e => {
            console.error(e);
          });
      },

      fromPayload(data) {
        const {
          prjName,
          prjType,
          prjTagList,
          bannerUrl,
          areaCode,
          areaName,
          address,
          latitude,
          longitude,
          openDay,
          floorArea,
          publicArea,
          totalBed,
          occupancyRate,
          prjPhotoAlbumList,
          firstPageImgList,
          prjVideoList,
          vrUrl,
          hotline,

          lessPrice,
          maxPrice,

          detail,
        } = data;
        const start = lessPrice;
        const end = maxPrice;

        const normalized = {
          name: prjName,
          prjType: prjType ? parseInt(prjType) : undefined,
          prjTagList: prjTagList,
          bannerUrl: bannerUrl || '',
          area: [areaCode],
          areaCode,
          areaName,
          address: {
            address: address,
            latitude: latitude ? parseFloat(latitude) : 0,
            longitude: longitude ? parseFloat(longitude) : 0,
          },
          openTime: openDay,
          floorArea: floorArea,
          publicSpace: publicArea === null ? undefined : publicArea,
          totalBed: totalBed,
          occupancyRate: occupancyRate === null ? undefined : occupancyRate,
          albums: (prjPhotoAlbumList || []).map(item => {
            return {
              urls: item.imgUrlList,
              name: item.name,
            };
          }),
          mainImgs: firstPageImgList,
          videos: prjVideoList,
          vrUrl: vrUrl,
          contacts: hotline,

          price: {
            start: start ? parseFloat(start) : 0,
            end: end ? parseFloat(end) : 0,
          },

          detail: {
            describe: detail,
          },
        };
        return normalized;
      },

      toPayload() {
        const {
          areaCode,
          areaName,
          address: { address, latitude, longitude },
          price: { start, end },
          mainImgs,
          videos: videoList,
          albums,
          detail,
          ...others
        } = this.form;

        const { value, pathLabels } = this.$refs.regionSelect.getCheckedNodes();
        const payload = {
          id: this.id,
          prjName: others.name,
          prjType: others.prjType,
          prjTagList: others.prjTagList,
          bannerUrl: others.bannerUrl || '',
          areaCode: value || areaCode,
          areaName: pathLabels || areaName,
          address: address,
          latitude: latitude,
          longitude: longitude,
          openDay: others.openTime,
          floorArea: others.floorArea, // 建筑面积
          publicArea: others.publicSpace || '', // 公共空间
          totalBed: others.totalBed,
          occupancyRate: others.occupancyRate || '',
          prjPhotoAlbumList: albums.map((item, index) => {
            return {
              imgUrlList: item.urls,
              name: item.name,
              order: index,
            };
          }),
          firstPageImgList: mainImgs,
          prjVideoList: videoList,
          vrUrl: others.vrUrl,
          hotline: others.contacts,

          lessPrice: start,
          maxPrice: end,

          detail: detail.describe,
        };

        return payload;
      },

      prevPress() {
        this.activeStep >= 1 ? (this.activeStep = this.activeStep - 1) : '';
      },
      nextPress() {
        this.$refs.form.validate().then(() => {
          this.activeStep <= 1 ? (this.activeStep = this.activeStep + 1) : '';
        });
      },

      async getProjectTypes() {
        const { data } = await projectApi.getTypes({});
        this.projectTypes = data;
      },
      async getProjectTags() {
        const { data } = await projectApi.getTags({});
        this.tags = data;
      },
      async save() {
        const payload = this.toPayload();
        try {
          this.loading = true;
          if (this.isEdit) {
            await projectApi.update(payload);
          } else {
            await projectApi.add(payload);
          }
          this.$message.success('保存成功');
          this.$router.go(-1);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped lang="less">
  .page-content {
    background-color: #fff;
    padding-bottom: 60px;
    position: relative;

    /deep/ .el-input-number .el-input__inner {
      text-align: left;
    }

    /deep/ .el-input-number__increase + .el-input > .el-input__inner {
      text-align: center;
    }

    /deep/ .el-step__icon {
      color: #fff;
      background-color: #d4d4d4;
    }

    /deep/ .el-step .is-process {
      .el-step__icon {
        background-color: #fa7516;
        border-color: #fa7516;
      }
    }

    /deep/ .el-step .is-finish .is-text {
      background-color: #fa7516;
    }

    /deep/ .is-process.el-step__title {
      color: #fa7516;
    }
  }

  .el-steps {
    padding: 20px;
  }

  .w220 {
    width: 220px;
  }

  .region-select {
    width: 300px;
  }

  .vsuper {
    vertical-align: super;
  }

  .vmiddle {
    vertical-align: middle;
  }

  .ft-smaller {
    font-size: 0.5em;
  }

  .ml14 {
    margin-left: 14px;
  }

  .tip {
    color: #717378;
  }

  .price-range {
    display: flex;
    align-items: center;
  }

  .preview {
    display: inline-flex;
    flex-direction: column;
    position: relative;
    top: 0;
    left: 514px;

    &__title {
      color: #303133;
      padding-left: 20px;
      font-size: 14px;
      font-weight: 400;
    }
  }
</style>
