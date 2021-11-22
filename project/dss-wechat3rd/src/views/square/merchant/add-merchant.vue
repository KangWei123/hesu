<template>
  <form-page-layout
    :model="form"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>基础信息</template>
      <el-form-item label="LOGO图片" class="goods-label" prop="logo">
        <add-shop-picture v-model="form.logo" :limit="1" />
      </el-form-item>
      <!-- 商户状态 -->
      <el-form-item label="商户状态" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--名称-->
      <el-form-item label="商户名称" class="goods-label" prop="name">
        <el-input placeholder="请输入商户名称" class="w220 primary-inputHeight" v-model.trim="form.name"></el-input>
      </el-form-item>
      <!-- 商户电话 -->
      <el-form-item label="商户电话" class="goods-label" prop="tel">
        <el-input placeholder="请输入商户电话" class="w220 primary-inputHeight" v-model.trim="form.tel"></el-input>
      </el-form-item>
      <!-- 商户副标题 -->
      <el-form-item label="商户副标题" class="goods-label" prop="subtitle">
        <el-input
          placeholder="请输入商户副标题、简介"
          class="w220 primary-inputHeight"
          v-model.trim="form.subtitle"
        ></el-input>
      </el-form-item>
      <!-- 商户编码 -->
      <el-form-item label="商户编码" class="goods-label" prop="code">
        <el-input
          v-model.trim="form.code"
          :disabled="isEdit"
          placeholder="请输入商户编码"
          class="w220 primary-inputHeight"
        ></el-input>
      </el-form-item>
      <!-- 经营品类 -->
      <el-form-item label="经营品类" class="goods-label" prop="tenantCategoryId">
        <el-select v-model="form.tenantCategoryId" placeholder="请选择经营品类" class="w220">
          <el-option
            v-for="item in categoryGroup.list"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 排序 -->
      <el-form-item label="排序" class="goods-label" prop="seq">
        <el-input
          v-model.trim="form.seq"
          maxlength="8"
          class="w220 primary-inputHeight"
          placeholder="请输入数字"
        ></el-input>
        <span style="font-size: 8px; transform: scale(0.8, 0.8)">（数值越大越靠前，相同时按照添加时间近到远排序）</span>
      </el-form-item>

      <!-- 人均消费 -->
      <el-form-item label="人均消费" class="goods-label" prop="avgConsume">
        <el-input
          v-model.trim="form.avgConsume"
          class="w220 primary-inputHeight"
          placeholder="请输入金额"
          maxlength="8"
        ></el-input
        >&nbsp;&nbsp;元
      </el-form-item>
      <!-- 商户标签 -->
      <el-form-item label="商户标签" prop="buildings">
        <el-tag
          :key="tag"
          v-for="tag in form.businessLabel"
          :disable-transitions="false"
          closable
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag w220"
          v-if="tagInput.show"
          v-model.trim="tagInput.val"
          ref="saveTagInput"
          maxlength="10"
          placeholder="限制10个字"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else-if="form.businessLabel.length < 10" class="button-new-tag" @click="showInput"
          >+ 标签</el-button
        >
      </el-form-item>

      <el-form-item label="营业时间" prop="openTime">
        <el-time-select
          placeholder="起始时间"
          v-model="form.startTime"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30',
          }"
        >
        </el-time-select>
        <el-time-select
          style="margin-left: 10px"
          placeholder="结束时间"
          v-model="form.endTime"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '24:00',
            minTime: form.startTime,
          }"
        >
        </el-time-select>
      </el-form-item>

      <!-- 主次力店 -->
      <el-form-item label="主次力店" prop="primarySecondary">
        <el-radio-group v-model="form.primarySecondary">
          <el-radio :label="1">主力店</el-radio>
          <el-radio :label="2">次力店</el-radio>
          <el-radio :label="3">普通商户</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--位置-->
      <el-form-item label="位置" class="goods-label" prop="mallStoreCode">
        <el-select
          placeholder="请选择楼栋"
          v-model="building.cur"
          style="width: 120px; margin-right: 8px"
          @change="onBuildingChange"
        >
          <el-option v-for="(item, index) in building.list" :key="index" :label="item.name" :value="item.id" />
        </el-select>
        <template v-if="building.cur">
          <el-select v-model="floor.cur" placeholder="请选择楼层" style="width: 120px; margin-right: 8px">
            <el-option
              v-for="(item, index) in floor.list"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-input
            placeholder="请输入店铺编号"
            v-model.trim="form.mallStoreCode"
            maxlength="32"
            style="width: 120px"
            v-loading="floor.loading"
          />
        </template>
      </el-form-item>
      <!-- 商户照片 -->
      <el-form-item label="商户照片" class="goods-label">
        <add-shop-picture v-model="form.pictures" />
      </el-form-item>
      <!-- 商户描述 -->
      <el-form-item label="商户描述" class="goods-label" prop="describe">
        <w-editor :data-source="form" :key="editorKey"></w-editor>
      </el-form-item>
    </form-group>
    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import './addMerchart.less';
  import merchantApi from '@/dss-wechat3rd/src/api/merchant';
  import categoryApi from '@/dss-wechat3rd/src/api/category';
  import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
  import AddShopPicture from './add-shop-picture.vue';
  import TagInput from './tagInput';

  export default {
    components: { FormPageLayout, FormGroup, FormButton, WEditor, AddShopPicture },
    mixins: [TagInput],
    data() {
      const shopNoPass = (rule, value, callback) => {
        if (this.building.cur === '') {
          callback(new Error('请选择楼栋'));
        } else if (this.floor.cur === '') {
          callback(new Error('请选择楼层'));
        } else if (value === '') {
          callback(new Error('请输入店铺编号'));
        } else {
          callback();
        }
      };

      return {
        loading: false,
        floor: {
          cur: '',
          list: [],
          loading: false,
        },
        building: {
          cur: '',
          list: [],
          loading: false,
        },
        categoryProps: {
          value: 'id',
          label: 'categoryName',
          children: 'childrenCategory',
          disabled: 'disabled',
        },
        categoryGroup: {
          list: [],
          loading: false,
        },
        logoUrl: '', // 保存logo路径
        areas: [],
        editorKey: 0,
        form: {
          subtitle: '', // 简介
          businessLabel: [],
          name: '',
          tel: null,
          active: 1,
          logo: [],
          code: '',
          codeBak: '',
          tenantCategoryId: '',
          seq: '',
          pictures: [], // 保存商户图片路径
          avgConsume: '',
          primarySecondary: 1,
          mallStoreCode: '',
          sort: null,
          describe: '',
          startTime: '',
          endTime: '',
        },
        rules: {
          logo: [{ required: true, message: '请选择图片', trigger: 'change' }],
          active: [{ required: true, message: '请选择商户状态' }],
          name: [
            { required: true, message: '请输入商户名称', trigger: 'blur' },
            { max: 10, message: '不能超过10字符', trigger: 'blur' },
          ],
          subtitle: [
            { required: true, message: '请输入商户副标题、简介', trigger: 'blur' },
            { max: 20, message: '不能超过20字符', trigger: 'blur' },
          ],
          tel: [
            { required: true, message: '请输入商户电话', trigger: 'blur' },
            { max: 15, message: '不能超过15字符', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入商户编码', trigger: 'blur' },
            { max: 32, message: '不能超过32字符', trigger: 'blur' },
          ],
          seq: [
            {
              required: false,
              message: '只能输入数字',
              pattern: /^[0-9]*$/,
              trigger: 'change',
            },
          ],
          avgConsume: [
            {
              required: true,
              message: '只能输入正整数',
              pattern: /^[0-9]*[1-9][0-9]*$/,
              trigger: 'change',
            },
          ],
          mallStoreCode: [{ required: true, validator: shopNoPass }],
          tenantCategoryId: [{ required: true, message: '请选择经营品类', trigger: 'change' }],
          primarySecondary: [{ required: true, message: '请选择主次力店', trigger: 'change' }],
        },
        // 是否不允许编辑敏感信息
        isDisabledEdit: false,
      };
    },
    computed: {
      ...mapState({
        curStore: 'curStore',
        global_info: 'global_info',
      }),
      isEdit() {
        return this.$route.fullPath.indexOf('itemNo') > 0;
      },
      storeId() {
        return Number(this.$route.query.itemNo);
      },
      id() {
        return Number(this.$route.query.id);
      },
    },

    async created() {
      await this.getStoreCategoryQueryList();
      await this.getBuildingList();
      if (this.isEdit) {
        await this.getBusiness();
      }
    },
    methods: {
      // 获取商户的详情
      getBusiness() {
        this.loading = true;
        merchantApi.business
          .detail({
            id: this.$route.query.id,
          })
          .done(res => {
            if (res.success) {
              this.editorKey++;
              const obj = res.data;
              for (const key in this.form) {
                switch (key) {
                  case 'mallStoreCode':
                    if (obj.buildingName) {
                      this.building.cur = obj.buildingId;
                      this.onBuildingChange(obj.buildingId, obj.floor, obj.mallStoreCode);
                    }
                    break;
                  case 'logo':
                    this.form.logo = [obj.logo || ''];
                    break;
                  case 'tenantCategoryId':
                    if (obj.tenantCategoryName) this.form.tenantCategoryId = obj.tenantCategoryId || '';
                    break;
                  case 'pictures':
                    if (obj.pictures) {
                      this.form.pictures = obj.pictures.split(',') || [];
                    }
                    break;
                  case 'businessLabel':
                    if (obj.labels) this.form.businessLabel = obj.labels.split(',');
                    break;
                  case 'startTime':
                    if (obj.businessStartHour !== null) {
                      this.form.startTime = this.formatDate(obj.businessStartHour.toString());
                    }
                    break;
                  case 'endTime':
                    if (obj.businessEndHour !== null) {
                      this.form.endTime = this.formatDate(obj.businessEndHour.toString());
                    }
                    break;
                  default:
                    if (obj[key] || obj[key] === 0) this.form[key] = obj[key];
                }
              }
              this.initLogoImg();
            }
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 查询经营品类
      async getStoreCategoryQueryList() {
        const { data } = await categoryApi.category.list();
        this.categoryGroup.list = data;
      },

      // 查询楼栋列表
      async getBuildingList() {
        const { data } = await merchantApi.floor.queryFloor();
        this.building.list = data;
      },

      onBuildingChange(e, cur = '', mallStoreCode = '') {
        const list = this.building.list.find(i => i.id === e);
        this.floor.list = JSON.parse(list.floor || '{}');
        this.floor.cur = cur;
        this.form.mallStoreCode = mallStoreCode;
      },

      /**
       * 处理营业时间格式转化
       */
      formatDate(date) {
        if (!date) {
          return;
        }

        // 1.5 -> 10:30
        if (date.includes('.') || Number.isInteger(Number(date))) {
          const time = date.split('.');
          const hour = time[0] < 10 ? '0' + time[0] : time[0];

          let second = '00';
          if (time[1]) {
            second = (time[1] * 60) / 10;
          }

          return `${hour}:${second}`;
        }

        // 10:30 -> 10.5
        if (date.includes(':')) {
          const time = date.split(':');
          const hour = Number(time[0]);
          const second = Number(time[1]);

          return hour + second / 60;
        }
      },

      async handleSubmit() {
        const params = { ...this.form };
        params.logo = params.logo.join(',');
        params.storeId = this.curStore.id;
        params.subStoreId = 0;
        params.businessStartHour = Number(this.formatDate(this.form.startTime));
        params.businessEndHour = Number(this.formatDate(this.form.endTime));
        params.labels = params.businessLabel.join(',');
        params.buildingId = this.building.cur;
        params.floor = this.floor.cur;
        params.pictures = params.pictures.join(',');
        params.deptId = this.curStore.deptId;

        delete params.businessLabel;
        delete params.startTime;
        delete params.endTime;

        if (this.isEdit) {
          params.businessId = this.$route.query.itemNo;
          await merchantApi.business.update({ id: this.id, ...params });
        } else {
          params.owner = this.global_info.userName;
          await merchantApi.business.add(params);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-breadcrumb__inner.is-link {
    font-weight: bold;
  }

  .goods-add-container {
    padding-top: 20px;
  }

  @groupPrependWidth: 80px;

  .el-tag {
    margin-right: 8px;
  }

  /deep/ .el-input-group__prepend {
    width: @groupPrependWidth;
  }

  /deep/ .form-page__footer {
    z-index: 1001 !important;
  }

  /deep/ .shop-no {
    position: relative;

    & > input {
      padding-left: 20px;
    }

    &::after {
      content: '-';
      position: absolute;
      display: inline-block;
      left: ~'calc(@{groupPrependWidth} + 50px)';
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
    }
  }
</style>
