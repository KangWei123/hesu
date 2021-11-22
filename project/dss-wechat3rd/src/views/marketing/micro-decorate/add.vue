<template>
  <div class="integar-edit">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/micro-decorate/list' }">微装方案</el-breadcrumb-item>
      <el-breadcrumb-item>{{isView? '查看' : isEdit ? '编辑' : '新增' }}方案</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      size="mini"
      label-width="135px"
      v-loading="loading"
      class="integar-form"
    >
      <el-form-item label="方案名称：" prop="name">
        <el-input placeholder="请输入" v-model.trim="form.name" maxlength="20" :disabled="isView"/>
        <span class="tip-msg ml5">{{form.name.length}}/20</span>
      </el-form-item>

      <el-form-item label="方案标签：" prop="labels">
         <el-select v-model="form.labels" multiple placeholder="选择标签" :disabled="isView">
          <el-option
            v-for="item in labelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-button type="text" round @click="showLabelDialog" v-if="!isView&&isEnterpriseManager">标签管理</el-button>
      </el-form-item>

      <el-form-item label="方案主图：" prop="thumbnail">
          <choose-images
            :width="176"
            :height="176"
            v-model="form.thumbnail"
            :isDisabledEdit="isView"
            @delete="onDelete"
          />
          <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">
            建议尺寸750*424，建议图片小于2M
          </div>
      </el-form-item>

      <el-form-item label="VR展示：" prop="vrUrl">
        <el-input placeholder="请输入VR链接" :disabled="isView" v-model.trim="form.vrUrl"/>
      </el-form-item>

      <el-form-item label="预约表单：" prop="chooseForm">
        <el-button size="small" 
                   round 
                   @click="showFormUtilsDialog" 
                   v-if="!isView">
          选择表单
        </el-button>

        <div class="chooseForm" v-for="(item, index) in form.chooseForm" :key="index">
          <span class="limit-line-ellipsis">{{item.name}}</span>
          <a @click="form.chooseForm = []" v-if="!isView">删除</a>
        </div>
      </el-form-item>

      <el-form-item label="方案正文：">
        <template v-if="loaded">
          <w-editor :dataSource="form.desc" :vr="true"></w-editor>
        </template>
      </el-form-item>

      <div class="bottom-button" v-if="!isView">
        <el-button @click="onCancle">
          取消
        </el-button>
        <el-button type="primary" @click="onSave">
          保存
        </el-button>
      </div>
    </el-form>
  
    <label-dialog ref="labelDialog" @closeClassDialog="getLabels"></label-dialog>
    <form-utils-dialog ref="formUtilsDialog" @changeChooseForm="changeChooseForm"></form-utils-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import labelDialog from './components/label-dialog.vue';
import formUtilsDialog from './components/form-utils-dialog.vue';
import microDecorate from '@/dss-wechat3rd/src/api/micro-decorate';

export default {
  components: {
    WEditor,
    ChooseImages,
    labelDialog,
    formUtilsDialog
  },
  data() {
    const checkLabels = (rule, value, callback) => {
      if (!value.length) {
        return callback('请选择方案标签');
      }
      return callback();
    };

    const checkThumbnail = (rule, value, callback) => {
      if (!value.id) {
        return callback('请选择方案主图');
      }
      return callback();
    };

    const checkChooseForm = (rule, value, callback) => {
      if (!value.length) {
        return callback('请选择预约表单');
      }
      return callback();
    };

    return {
      id: undefined,
      isLoading: false,
      isEdit: false,
      isView: false,
      loading: false,
      loaded: false,
      labelOptions: [],

      form: {
        name: '',
        vrUrl: '',
        labels: [],
        chooseForm: [],
        thumbnail: {
          id: '',
          imgUrl: ''
        },
        desc: {
          describe: ''
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入方案名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        labels: [{ required: true, validator: checkLabels, trigger: 'change' }],
        thumbnail: [{ required: true, validator: checkThumbnail, trigger: 'change' }],
        chooseForm: [{ required: true, validator: checkChooseForm, trigger: 'change' }]
      }
    };
  },
  mounted() {
    const id = this.$route.query.id;
    const isView = this.$route.query.isView;

    if (id) {
      this.id = id;
      this.isEdit = true;
      this.loading = true;
      this.getDetails();
      this.isView = !!Number(isView);
    } else {
      this.getLabels();
      this.loaded = true;
    }
  },
  computed: {
    ...mapState({
      roleList: 'roleList'
    }),
    /**
     * 是否企业管理员
     */
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    }
  },

  methods: {
    onSave() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;

        let params = {
          id: this.id,
          name: this.form.name,
          vrUrl: this.form.vrUrl,
          desc: this.form.desc.describe,
          formId: this.form.chooseForm[0].id,
          thumbnail: this.form.thumbnail.imgUrl,
          labels: this.form.labels.map(item => {
            return { id: item };
          })
        };

        microDecorate[this.id ? 'update' : 'add'](params)
          .then(
            res => {
              this.$router.push({
                path: '/marketing/micro-decorate/list'
              });
            },
            error => {}
          )
          .always(() => {
            this.loading = false;
          });
      });
    },

    getDetails() {
      microDecorate
        .detial({ id: this.id })
        .then(res => {
          let data = res.data || {},
            { name, vrUrl, labels = [], desc, formId, formName, thumbnail } = data;

          this.form.name = name;
          this.form.vrUrl = vrUrl;
          this.form.chooseForm = [{ id: formId, name: formName }];
          this.form.desc = {
            describe: desc
          };
          this.form.thumbnail = {
            id: 1,
            imgUrl: thumbnail
          };
          this.loaded = true;
          this.getLabels(labels);
        })
        .always(() => {
          this.loading = false;
        });
    },

    onDelete() {
      this.form.thumbnail = {
        id: 0,
        imgUrl: ''
      };
    },

    onCancle() {
      this.$router.push('/marketing/micro-decorate/list');
    },

    showLabelDialog() {
      this.$refs.labelDialog.show();
    },

    showFormUtilsDialog() {
      this.$refs.formUtilsDialog.show();
    },

    changeChooseForm(row) {
      this.form.chooseForm = [row];
      this.$refs.form.validateField('chooseForm');
    },

    getLabels(labels) {
      microDecorate
        .labelList({
          pageNo: 1,
          pageSize: 1000
        })
        .then(res => {
          let data = res.data || [],
            labelOptions = [];

          data.forEach(item => {
            labelOptions.push({
              value: item.id,
              label: item.label
            });
          });

          this.labelOptions = labelOptions;

          if (labels) {
            this.form.labels = labels.map(item => item.id);
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.tip-msg {
  color: #999;
  font-size: 12px;
}
.ml5{
  margin-left: 5px;
}
.ml10 {
  margin-left: 10px;
}
.chooseForm {
  box-sizing: border-box;
  padding: 0 20px;
  line-height: 50px;
  background: #eff2f5;
  width: 300px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  border-radius: 3px;

  .limit-line-ellipsis{
    width: 80%;
  }

  a{
    color: #256eff;
  }
}
</style>
