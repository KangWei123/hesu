<template>
  <!-- <div class="container"> -->
  <form-page-layout
    :model="form"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>基础信息</template>
      <el-form-item label="权益归属" prop="appId">
        <el-select class="w220" v-model="form.appId" :disabled="status != 0" placeholder="请选择应用">
          <el-option v-for="(item, index) in appList" :label="item.appName" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权益名称" prop="name">
        <el-input
          class="w220"
          :disabled="status == 2"
          maxlength="18"
          v-model.trim="form.name"
          placeholder="请输入权益名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="权益图片：" prop="imgUrl">
        <img v-if="status == 2" :src="form.imgUrl" width="120" height="120" />
        <choose-images
          v-else
          :value="{ imgUrl: form.imgUrl }"
          :height="120"
          :width="120"
          unique="dimensionsImg"
          @input="onExtraImageAdd"
          @delete="onExtraDeleteImg('dimensionsImg')"
        />
        <br />
        <span style="margin-left: 0; margin-top: -10px; color: #666">尺寸：100*60像素，支持JPG、PNG、JPEG格式</span>
      </el-form-item>
      <el-form-item label="权益简介" prop="desc">
        <el-input
          :disabled="status == 2"
          class="textarea"
          v-model="form.desc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="最多输入60个字"
        ></el-input>
      </el-form-item>
    </form-group>
    <form-group>
      <template #title>规则设置</template>
      <el-form-item label="面向群体" prop="levelNums">
        <el-checkbox-group v-model="form.levelNums" @change="onChange">
          <el-checkbox
            v-for="(item, index) in levelList"
            :key="index"
            :label="item.levelNumber"
            :disabled="status == 2"
            >{{ item.levelName }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <div v-show="isShowService" class="service">
        <el-form-item label="服务方式" prop="serviceType">
          <el-select v-model="form.serviceType">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.serviceType === 3" label="URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入跳转URL"></el-input>
        </el-form-item>
      </div>
    </form-group>
    <template v-if="status != 2" #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import { ChooseImages } from '@/mod-member/ref';
  import memberApi from '@/mod-member/src/api/memberAPI';

  export default {
    name: 'AddRights',
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
      ChooseImages,
    },
    data() {
      const validateImgUrl = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请上传权益图片'));
        } else callback();
      };
      return {
        // 0: 新建， 1：编辑  2：查看
        status: 0,
        levelList: [],
        serviceUrl: '',
        appList: [],
        isShowService: false,
        form: {
          appId: '',
          name: '',
          imgUrl: '',
          desc: '',
          levelNums: [],
          serviceType: '',
          url: '',
        },
        rules: {
          appId: [{ required: true, message: '请选择权益归属', trigger: 'blur' }],
          name: [
            { required: true, message: '请输入权益名称', trigger: 'blur' },
            { min: 1, max: 18, message: '长度在1到18个字符', trigger: 'blur' },
          ],
          imgUrl: [{ required: true, validator: validateImgUrl, trigger: 'change' }],
          desc: [
            { required: true, message: '请输入权益简介', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在1到60个字符', trigger: 'blur' },
          ],
          group: [{ required: true, message: '请选择面向群体', trigger: 'blur' }],
        },
      };
    },
    mounted() {
      this.status = this.$route.query.status;
      const id = this.$route.query.id;
      if (id) {
        this.rightDetail(id);
      }
      memberApi.application
        .getAppList({
          epId: this.$store.epId,
          pageNo: 1,
          pageSize: 100,
        })
        .then(res => {
          const list = res.data;
          // 集团账号下或编辑状态下可以显示通用权益
          if (this.globalIsUmpPlatformApp || id) {
            list.unshift({
              appName: '通用权益',
              id: 0,
            });
          }
          this.appList = list;
          if (list.length === 1) {
            this.form.appId = list[0].id;
          }
        });
      memberApi.levelManager.getLevelList().then(res => {
        this.levelList = res.data;
      });
    },
    methods: {
      rightDetail(id) {
        memberApi.rightsCenter.configDetail({ id }).then(res => {
          if (res.success) {
            this.form = res.data;
            this.form.levelNums = Array.from(new Set(res.data.levelNums));
          }
        });
      },
      back() {
        this.$router.back();
      },
      async handleSubmit() {
        const params = { ...this.form };
        params.type = this.form.appId;
        // params.epId = this.form.appId;
        if (this.status == 0) {
          await memberApi.rightsCenter.addConfig(params);
        } else if (this.status == 1) {
          await memberApi.rightsCenter.updateConfig(params);
        }
      },
      onExtraImageAdd(e) {
        this.form.imgUrl = e.imgUrl;
      },
      onExtraDeleteImg(e) {
        this.form.imgUrl = '';
      },
      onChange(e) {
        console.log(e);
      },
    },
  };
</script>

<style scoped lang="less">
  .uploader {
    width: 120px;
    height: 120px;
    background: lightcoral;
  }

  .textarea {
    width: 300px;
  }
</style>
