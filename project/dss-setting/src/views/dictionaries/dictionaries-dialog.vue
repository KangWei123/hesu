<template>
  <!-- 设置商品佣金dialog -->
  <el-dialog :title="isAdd?'新增字典详情':'编辑字典详情'"
             width="600px"
             v-loading="loading"
             @open="onGiftDialogOpen"
             :visible.sync="mShowDialog">
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="140px">

      <el-form-item label="所属字典："
                    prop="name">
           <span>{{form.dictionaryName}}</span>
      </el-form-item>

      <el-form-item label="字典标签："
                    prop="dictionaryLabel">
        <el-input class="setting-input"
                  style="width: 200px;"
                  v-model="form.dictionaryLabel"
                  placeholder="请输入字典标签"></el-input>
      </el-form-item>

      <el-form-item label="排序："
                    prop="order">
        <el-input class="setting-input"
                  style="width: 200px;"
                  v-model="form.order"
                  placeholder="请输入排序"></el-input>
      </el-form-item>

    </el-form>

    <div slot="footer">
      <el-button @click="mShowDialog = false">取 消</el-button>
      <el-button type="primary"
                 @click="handleSetting('form')">确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
import dictionariesApi from '@/dss-setting/src/api/dictionaries';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import regexps from '@/dss-common/utils/regexps.js';

export default {
  name: 'set-gift-dialog',
  mixins: [dialogMixin],
  components: {},
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isAdd: true,
      loading: false,
      form: {
        dictionaryLabel: null,
        order: null
      },
      isDisable: false,
      rules: {
        dictionaryLabel: [
          {
            required: true,
            message: '请输入字典标签',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '最多输入20个字符',
            trigger: 'blur'
          }
        ],
        order: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          },
          {
            pattern: regexps.littleIntNum.reg,
            message: regexps.littleIntNum.msg,
            trigger: 'blur'
          }
        ]
      }
    };
  },

  watch: {
    data() {
      this.form = this.$plain(this.data);
    }
  },

  methods: {
    onGiftDialogOpen() {
      this.$refs.form.clearValidate();
      if (this.data && this.data.id) {
        this.isAdd = false;
      } else {
        this.isAdd = true;
      }
    },
    handleSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        const params = {
          dictionaryId: this.form.dictionaryId,
          dictionaryLabel: this.form.dictionaryLabel,
          order: this.form.order
        };
        let key = 'create';
        if (!this.isAdd) {
          key = 'update';
          params.id = this.form.id;
        }
        dictionariesApi[key](params)
          .then(res => {
            this.mShowDialog = false;
            this.$message.success('操作成功');
            this.$emit('done');
          })
          .always(() => {
            this.loading = false;
          });
      });
    }
  }
};
</script>
