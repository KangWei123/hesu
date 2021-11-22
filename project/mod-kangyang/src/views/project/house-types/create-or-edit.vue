<template>
  <form-page-layout :title-visible="false">
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="120px"
      @submit.native.prevent="handleSave"
    >
      <el-form-item label="户型名称" prop="name">
        <el-input v-model="form.name" maxlength="25" class="w220" placeholder="请输入户型名称"></el-input>
      </el-form-item>

      <el-form-item label="户型类型" prop="type">
        <el-input v-model="form.type" class="w220" placeholder="请输入户型类型"></el-input>
      </el-form-item>

      <el-form-item label="建筑面积" prop="floorArea">
        <el-input v-model="form.floorArea" class="w220" placeholder="请输入建筑面积"></el-input>
      </el-form-item>

      <el-form-item label="参考价格" prop="referencePrice">
        <el-input v-model="form.referencePrice" class="w220" placeholder="请输入参考价格"></el-input>
      </el-form-item>

      <el-form-item label="收费模式" prop="chargeMode">
        <el-input v-model="form.chargeMode" class="w220" placeholder="请输入收费模式"></el-input>
      </el-form-item>

      <el-form-item label="户型图片" prop="imgUrl">
        <choose-image-multi v-model="form.imgUrl" :limit="10" :width="88" :height="88" />
        <span class="tip">
          上传图片的最佳尺寸：640像素*640像素，其他尺寸会影响页效果，格式png，jpeg，jpg，gif。大小不超过2M，户型图片一共可以上传10张，默认第一张为主图封面
        </span>
      </el-form-item>

      <el-form-item label="VR展示" prop="vrUrl">
        <el-input v-model="form.vrUrl" class="w220" placeholder="请输入VR 链接"></el-input>
      </el-form-item>
      <el-form-item label="户型描述" prop="desc">
        <template v-if="loaded">
          <w-editor :data-source="form.desc" :is-show-minapp="false" :image-limit="30"></w-editor>
        </template>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSave">保存</el-button>
    </template>
  </form-page-layout>
</template>

<script>
  import { FormPageLayout } from '@/dss-common/components/form-page';
  import { ChooseImageMulti } from '@/mod-kangyang/shared/components';
  import { WEditor } from '@/register/wechat3rd';
  import { projectApi } from '@/mod-kangyang/src/api/project';

  const required = message => ({ required: true, message: message || '不能为空' });
  const rules = {
    name: [required('请输入户型名称')],
    type: [required('请输入户型类型')],
    floorArea: [required('请输入建筑面积')],
    referencePrice: [required('请输入参考价格')],
    chargeMode: [{ max: 50, message: '不能超过50个字符', trigger: 'blur' }],
    desc: [
      required('请输入户型名称'),
      {
        validator: (a, value, callback) => {
          if (!value.describe) {
            callback(new Error('请输入户型描述'));
            return;
          }
          callback();
        },
      },
    ],
  };

  export default {
    name: 'CreateOrEdit',
    components: {
      FormPageLayout,
      ChooseImageMulti,
      WEditor,
    },
    data() {
      return {
        loading: false,
        loaded: false,
        rules,
        form: {
          name: '',
          type: '',
          chargeMode: '',
          floorArea: undefined,
          imgUrl: [],
          referencePrice: undefined,
          vrUrl: '',
          desc: {
            describe: '',
          },
        },
      };
    },
    computed: {
      id() {
        // 项目 id
        return this.$route.query.id;
      },
      houseId() {
        return this.$route.params.id;
      },
      isEdit() {
        return !!this.houseId;
      },
    },
    mounted() {
      if (this.isEdit) {
        this.getDetail();
      } else {
        this.loaded = true;
      }
    },
    methods: {
      async handleSave() {
        this.$refs.form
          .validate()
          .then(valid => {
            this.save();
          })
          .catch(e => {
            console.warn(e);
          });
      },
      toPayload() {
        const { imgUrl, desc, name, type, floorArea, referencePrice, chargeMode, vrUrl } = this.form;
        return {
          id: this.houseId,
          layoutName: name,
          layoutType: type,
          layoutArea: floorArea,
          chargeMode: chargeMode,
          layoutPics: imgUrl,
          prjId: +this.id,
          refPrice: referencePrice,
          vrUrl: vrUrl,
          description: desc.describe,
        };
      },
      async save() {
        const payload = this.toPayload();
        try {
          this.loading = true;
          if (this.isEdit) {
            await projectApi.updateHouseType(payload);
          } else {
            await projectApi.addHouseType(payload);
          }
          this.$message.success('保存成功');
          this.$router.go(-1);
        } finally {
          this.loading = false;
        }
      },
      getDetail() {
        this.loading = true;
        projectApi
          .getHouseTypeDetail({
            id: this.houseId,
          })
          .then(res => {
            const data = res.data || {};
            this.form = {
              id: +data.id,
              name: data.layoutName,
              type: data.layoutType,
              floorArea: data.layoutArea,
              chargeMode: data.chargeMode,
              imgUrl: data.layoutPics,
              referencePrice: data.refPrice,
              vrUrl: data.vrUrl,
              desc: {
                describe: data.description,
              },
            };
          })
          .always(() => {
            this.loading = false;
            this.loaded = true;
          });
      },
    },
  };
</script>

<style scoped>
  .w220 {
    width: 220px;
  }

  .tip {
    display: inline-block;
    width: 50%;
    color: #717378;
  }
</style>
