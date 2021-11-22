<template>
  <el-dialog class="dmp-dialog" :title="title" :visible.sync="show" :show-close="false" v-loading="loading">
    <div slot="title" class="modal-header">
      <span class="modal-title">
        {{ title }}
      </span>
      <span class="close" @click="cancle">
        <img src="./close.png" alt="" class="close-svg" />
      </span>
    </div>
    <!-- 表单 -->
    <el-form class="dmp-form" ref="form" :rules="rule" :model="form" label-width="140px">
      <el-form-item :label="isOutIn ? '导出文件名称:' : '导入文件名称:'" prop="name">
        <el-input placeholder="" v-model.trim="form.name" maxlength="10"> </el-input>
      </el-form-item>
      <el-form-item label="添加文件:" v-if="this.isOutIn === false" required>
        <div class="upload-main">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="/dmp2/rest/crowd/fileUpload"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            accept="text/plain"
            :limit="1"
          >
            <img src="./cloud.png" alt="" class="cloud-svg" />
          </el-upload>
          <div class="upload-info">
            <div class="el-upload__text">文件最大为20M，拖入或点击选择磁盘文件</div>
            <div class="el-upload__tip">
              请选择*. txt文件进行导入，每一行为一个 ID，ID 类型支持 IMEI、PHONE、MAC、微信 OPENID。
              文件模板可点击此处下载：
              <a class="download" @click="download">点击下载</a>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="isOutIn ? '导出格式:' : '导入格式:'" required>
        <el-radio-group v-model="form.idType">
          <el-radio label="imei">IMEI</el-radio>
          <!--<el-radio label="sn">SN</el-radio>-->
          <el-radio v-if="!isOutIn" label="phone">PHONE</el-radio>
          <el-radio label="mac">MAC</el-radio>
          <el-radio label="open_id">OPEN_ID</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="isOutIn && canExportLoading" style="text-align: center">检查人群包中。。。</div>
    </el-form>
    <div class="center-footer">
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="btn-sure primary-btn"
          @click="submitUpload"
          :loading="canExportLoading ? true : false"
          >{{ isOutIn ? '开始导出' : '开始导入' }}</el-button
        >
      </span>
    </div>
  </el-dialog>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';
  import axios from 'axios';

  export default {
    components: {},
    props: {
      model: {
        type: Object,
        default() {
          return {};
        },
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        form: {
          name: '',
          filePath: '',
          desc: '',
          idType: '',
        },
        rule: {
          name: [
            { required: true, trigger: 'blur', message: '请输入导出文件名' },
            { min: 1, max: 20, message: '不能超过20个字' },
          ],
        },
        fileCon: '',
        submitFalg: false,
        isLt5M: true,

        loading: false,
        file: null,
        fileList: [],
        canExportLoading: false,
        t: '',
      };
    },
    computed: {
      show: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
      title() {
        return this.isOutIn ? '人群导出' : '人群导入';
      },
      isOutIn() {
        return !!(this.model && this.model.id);
      },
    },
    watch: {
      visible(val) {
        this.form.name = (this.model && this.model.name) || '';
      },
    },
    created() {
      this.xhr = new XMLHttpRequest();
    },
    mounted() {
      // console.log('modal',this.model,'id----->',this.model.id,!(this.model && this.model.id));
    },
    methods: {
      // 下载模板
      download() {
        window.open('/dmpa/rest/admin/template/download');
      },
      // 上传
      beforeUpload(file) {
        this.isLt5M = file.size / 1024 / 1024 <= 5; // 文件大小不超过2MB
        if (!this.isLt5M) {
          this.$message.error('上传文件大小不能超过 5M!');
          return false;
        }
      },
      submitUpload() {
        this.$refs.form.validate(valid => {
          if (!valid) {
          } else {
            console.log('isOutin', this.isOutIn);
            if (this.isOutIn) {
              this.canExport();
            } else {
              const flag = this.isFill();
              if (!flag) {
                return;
              }
              this.$refs.upload.submit();
            }
          }
        });
      },
      handleChange(file) {
        this.fileCon = file;
        if (this.fileCon && !this.submitFalg) {
          document.querySelector('.upload-demo  .el-upload-dragger').style.display = 'none';
          document.querySelector('.upload-demo img').style.display = 'none';
          document.querySelector('.upload-info').style.display = 'none';
        }
      },
      handleRemove(file) {
        console.log('removefile', file);
        this.fileCon = '';
        this.isLt5M = true;

        document.querySelector('.upload-demo  .el-upload-dragger').style.display = 'flex';
        document.querySelector('.upload-demo img').style.display = 'block';
        document.querySelector('.upload-info').style.display = 'block';
      },
      // 开始导入提交
      handleSuccess(file) {
        this.form.filePath = file.data;
        // if (!this.fileList.length) {
        //   this.$message({
        //     message: '请选择上传文件',
        //     type: 'warning'
        //   });
        //   return;
        // }
        this.submitFalg = true;
        document.querySelector('.upload-demo  .el-upload-dragger').style.display = 'flex';
        document.querySelector('.upload-demo img').style.display = 'block';
        document.querySelector('.upload-info').style.display = 'block';

        const params = { ...this.form };
        console.log('params', params);

        api
          .crowdImport(params)
          .done(res => {
            console.log('res', res);
            this.$emit('saved');
            this.show = false;
          })
          .always(() => {
            this.loading = false;
            Object.keys(this.form).forEach(item => {
              this.form[item] = null;
            });
            this.fileList = [];
            //   this.$emit('saved');
            //   this.show = false;
            this.fileCon = '';
            this.submitFalg = false;
          });
      },
      isFill() {
        if (!this.form.name) {
          this.$message.error('人群包名称不能为空');
          return false;
        }
        if (!this.fileCon) {
          this.$message.error('导入文件不能为空');
          return false;
        }
        if (!this.isLt5M) {
          this.$message.error('上传文件大小不能超过 5M!');
          return false;
        }
        if (!this.form.idType) {
          this.$message.error('导入格式不能为空');
          return false;
        }

        return true;
      },
      canExport() {
        if (!this.form.idType) {
          this.$message({
            message: '请选择文件导出类型',
            type: 'warning',
          });
          return;
        }

        // const loading = this.$loading({
        //   lock: true,
        //   text: '检查人群包中。。。',
        //   spinner: 'el-icon-loading'
        // });
        this.canExportLoading = true;

        axios({
          method: 'get',
          url: '/dmp2/rest/analysis/hasCrowdFile',
          params: {
            name: this.form.name,
            id: this.model.id,
            uidType: this.form.idType,
          },
        }).then(res => {
          const { path, code } = (res.data || {}).data || {};

          if (code === 1) {
            // loading.close();
            this.canExportLoading = false;
            // 有人群包
            this.$confirm('检查完成, 确认导出?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
            })
              .then(() => {
                this.handleCrowdExport(path);
              })
              .catch(() => {});
          } else {
            this.t = setTimeout(() => {
              this.canExport();
            }, 1000);
          }
        });
      },
      // 人群导出
      handleCrowdExport(val) {
        const loading = this.$loading({
          lock: true,
          text: '正在导出',
          spinner: 'el-icon-loading',
        });
        axios({
          method: 'get',
          url: '/dmpa/rest/admin/downloadCrowdPackage',
          params: {
            id: this.model.id,
            path: val,
          },
          responseType: 'blob',
        })
          .then(res => {
            if (!res.data) {
              this.$message.error('导出失败');
              return;
            }
            loading.close();

            const url = window.URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', `${this.form.name}.txt`);
            document.body.appendChild(link);
            link.click();
          })
          .catch(error => {});
      },
      cancle() {
        this.show = false;
        if (this.canExportLoading) {
          clearTimeout(this.t);
          this.canExportLoading = false;
          this.$router.push('/group');
        }
      },
    },
  };
</script>
<style lang="less">
  .el-dialog__wrapper.conleft .el-dialog__footer {
    text-align: left !important;
  }

  .el-upload-list {
    position: relative;
    bottom: 40px;
  }
</style>
