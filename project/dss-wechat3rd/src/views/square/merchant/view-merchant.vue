<template>
  <form-page-layout :model="form" label-width="126px" :title-visible="false">
    <form-group>
      <template #title>基础信息</template>
      <el-form-item label="LOGO图片" class="goods-label">
        <div
          class="view-img"
          :style="{ background: `url(${form.logo}) center center / cover no-repeat transparent` }"
        ></div>
      </el-form-item>
      <el-form-item label="商户状态">
        {{ form.active ? '启用' : '禁用' }}
      </el-form-item>
      <el-form-item label="商户名称" class="goods-label">
        {{ form.name }}
      </el-form-item>
      <el-form-item label="商户电话" class="goods-label">
        {{ form.tel }}
      </el-form-item>
      <el-form-item label="商户副标题" class="goods-label">
        {{ form.subtitle }}
      </el-form-item>
      <el-form-item label="商户编码" class="goods-label">
        {{ form.code }}
      </el-form-item>
      <el-form-item label="经营品类" class="goods-label">
        {{ form.tenantCategoryName || '-' }}
      </el-form-item>
      <el-form-item label="人均消费" class="goods-label">
        {{ form.avgConsume || '-' }}
      </el-form-item>
      <el-form-item label="商户标签" class="goods-label">
        {{ form.businessLabel.join('、') || '-' }}
      </el-form-item>
      <el-form-item label="营业时间" class="goods-label">
        {{ form.startTime + '-' + form.endTime }}
      </el-form-item>
      <el-form-item label="主次力店" class="goods-label">
        {{ PrimarySecondary[form.primarySecondary] }}
      </el-form-item>
      <!--位置-->
      <el-form-item label="位置" class="goods-label" prop="mallStoreCode">
        <span>{{ form.buildingName }} - {{ form.floor }} - {{ form.mallStoreCode }}</span>
      </el-form-item>
      <el-form-item label="商户照片" class="goods-label">
        <div v-if="form.pictures && form.pictures.length">
          <div
            v-for="(item, index) in form.pictures"
            :key="index"
            :style="{ background: `url(${item}) center center / cover no-repeat transparent` }"
            class="view-img"
          />
        </div>
        <span v-else>-</span>
      </el-form-item>
      <!-- 商户描述 -->
      <el-form-item label="商户描述" class="goods-label" prop="desc">
        <div class="desc" v-html="form.describe || '-'"></div>
      </el-form-item>
    </form-group>
    <template #footer>
      <form-button action="back" />
    </template>
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import './addMerchart.less';
  import merchantApi from '@/dss-wechat3rd/src/api/merchant';
  import TagInput from './tagInput';

  const PrimarySecondary = ['', '主力店', '次力店', '普通商户'];

  export default {
    components: { FormPageLayout, FormGroup, FormButton },
    mixins: [TagInput],
    data() {
      return {
        PrimarySecondary,
        floor: {
          cur: '',
          list: [],
        },
        building: {
          cur: '',
          list: [],
        },
        categoryProps: {
          value: 'id',
          label: 'categoryName',
          children: 'childrenCategory',
          disabled: 'disabled',
        },
        categoryGroup: [],
        editorKey: 0,
        form: {
          subtitle: '', // 简介
          businessLabel: [],
          name: '',
          tel: null,
          active: 1,
          logo: '',
          pictures: [], // 保存商户图片路径
          code: '',
          codeBak: '',
          tenantCategoryName: '',
          seq: '',
          avgConsume: '',
          primarySecondary: 1,
          buildingName: '',
          floor: '',
          mallStoreCode: '',
          sort: null,
          describe: '',
          startTime: '',
          endTime: '',
        },
        limit: 1,
        maxLength: 3,
      };
    },
    computed: {
      ...mapState({
        curStore: 'curStore',
        global_info: 'global_info',
      }),

      storeId() {
        return Number(this.$route.query.itemNo);
      },
      id() {
        return Number(this.$route.query.id);
      },
    },
    async created() {
      this.getBusiness();
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
              const obj = this.$plain(res.data);
              for (const key in this.form) {
                switch (key) {
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
              this.$set(this.form, 'storeId', obj.storeId);
              this.initLogoImg();
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
      /**
       * 处理营业时间格式转化
       */
      formatDate(date) {
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

  @imgHeight: 176px;

  .view-img {
    max-width: @imgHeight;
    max-height: @imgHeight;
    height: @imgHeight;
    width: @imgHeight;
    float: left;
    margin-right: 10px;
    border-radius: 4px;
    border: 1px solid #eff2f5;
  }

  .desc {
    line-height: 26px;
    margin-top: 8px;
  }

  @groupPrependWidth: 80px;

  /deep/ .el-input-group__prepend {
    width: @groupPrependWidth;
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
