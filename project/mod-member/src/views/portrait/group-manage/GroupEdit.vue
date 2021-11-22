<template>
  <el-dialog
    class="dmp-dialog group-edit-dmp-dialog"
    :title="title"
    :visible.sync="show"
    :show-close="false"
    v-loading="loading"
  >
    <div slot="title" class="modal-header">
      <span class="modal-title">{{ title }}</span>
      <span class="close" @click="show = false">
        <img src="./close.png" alt class="close-svg" />
      </span>
    </div>
    <!-- 表单 -->
    <el-form class="dmp-form" ref="form" :rules="rules" :model="form" label-width="120px">
      <template v-if="model && model.type == 'condition'">
        <el-form-item label="人群名称:" prop="name">
          <el-input placeholder="请输入人群名称" v-model.trim="form.name" maxlength="20"></el-input>
          <span class="hint">{{ form.name ? form.name.length : 0 }}/20</span>
        </el-form-item>
        <el-form-item label="人群说明:" prop="desc">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入人群说明"
            v-model.trim="form.desc"
            maxlength="60"
          ></el-input>
          <span class="hint">{{ form.desc ? form.desc.length : 0 }}/60</span>
        </el-form-item>
        <el-form-item label="人群标签:" prop="label">
          <div class="label">
            <condition-label :conditions="bindConditions"></condition-label>
          </div>
        </el-form-item>
        <el-form-item label="人群更新机制：" prop="renewalMechanism">
          <el-radio-group class="radio-group" v-model="form.renewalMechanism">
            <el-radio :label="0" name="renewalMechanism">不更新</el-radio>
            <el-radio :label="1" name="renewalMechanism">T+1更新</el-radio>
          </el-radio-group>
          <p class="describe" v-show="form.renewalMechanism === 0">若选择不更新，则固化保存时圈出的人群</p>
          <p class="describe" v-show="form.renewalMechanism === 1">若选择每天更新，则在每日00：00更新人群</p>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item class="form-block-item" label="人群名称：" prop="name">
          <el-input :maxlength="20" placeholder="请输入人群名称" v-model.trim="form.name"></el-input>
          <span class="max">{{ form.name ? form.name.length : 0 }}/20</span>
        </el-form-item>
        <el-form-item class="form-block-item" label="人群说明：" prop="desc">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入人群说明"
            v-model.trim="form.desc"
            :maxlength="60"
          ></el-input>
          <span class="max">{{ form.desc ? form.desc.length : 0 }}/60</span>
        </el-form-item>
        <el-form-item class="form-block-item" label="人群标签：" prop="label">
          <div class="label">
            <condition-label :conditions="bindConditions"></condition-label>
          </div>
        </el-form-item>
        <el-form-item label="人群更新机制：" prop="renewalMechanism">
          <el-radio-group class="radio-group" v-model="form.renewalMechanism">
            <el-radio :label="0" name="renewalMechanism">不更新</el-radio>
            <el-radio :label="1" name="renewalMechanism">T+1更新</el-radio>
          </el-radio-group>
          <p class="describe" v-show="form.renewalMechanism === 0">若选择不更新，则固化保存时圈出的人群</p>
          <p class="describe" v-show="form.renewalMechanism === 1">若选择每天更新，则在每日00：00更新人群</p>
        </el-form-item>
      </template>
    </el-form>
    <div class="center-footer" v-if="model && model.type == 'condition'">
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-cancle" @click="show = false">取 消</el-button>
        <el-button type="primary" class="btn-sure primary-btn" @click="onSave">保 存</el-button>
      </span>
      <p class="tips">*注意：人群更改成功后，次日可在人群管理中查看新的覆盖人数</p>
    </div>
    <div class="end-footer" v-else>
      <span slot="footer" class="dialog-footer end-footer">
        <el-button class="btn-cancle" @click="show = false">取 消</el-button>
        <el-button :loading="form.loading" type="primary" v-if="isFromList" class="btn-sure primary-btn" @click="onSave"
          >保 存</el-button
        >
        <el-button :loading="form.loading" type="primary" v-else class="btn-sure primary-btn" @click="toSave"
          >保 存</el-button
        >
      </span>
      <p class="tips">*注意：人群{{ this.isEdit ? '更改' : '新建' }}成功后，次日可在人群管理中查看新的覆盖人数</p>
    </div>
  </el-dialog>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';
  import ConditionLabel from '@/mod-member/src/components/conditionLabel';
  import helper from '@/mod-member/src/mixins/helper';

  export default {
    name: 'GroupEdit',
    components: {
      ConditionLabel,
    },
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
      conditions: {
        type: Array,
        default() {
          return [];
        },
      },
      isFromList: {
        type: Boolean,
        default: false,
      },
      total: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        form: {
          name: '',
          desc: '',
          label: '',
          renewalMechanism: null,
          loading: false,
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入人群名称' },
            { min: 1, max: 20, message: '长度20字以内', trigger: 'blur' },
          ],
          desc: { trigger: 'blur', message: '请输入人群说明' },
          renewalMechanism: [{ required: true, message: '请选择一个更新机制', trigger: 'change' }],
        },
        bindConditions: [], // 条件通过参数传入（筛选条件,保群人群），也可向服务获取(编辑时人群时)
        fromPath: '',
        loading: false,
        criteriaValue: '',
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
        return this.isEdit ? '编辑人群' : '保存人群';
      },
      isEdit() {
        return !!(this.model && this.model.id);
      },
    },
    mounted() {},
    watch: {
      visible(val) {
        if (!val) {
          return;
        }

        const form = this.$refs.form;
        if (form && form.resetFields) {
          form.resetFields();
        }
        if (this.isEdit) {
          this.setValues();
        }
        if (this.isFromList) {
          this.fetchData();
        } else {
          this.bindConditions = this.conditions;
        }
      },
    },
    methods: {
      setValues() {
        const temModel = this.model || {};
        this.form.name = temModel.name;
        this.form.desc = temModel.desc;
      },
      onCancle() {
        this.show = false;
      },
      toSave() {
        this.form.loading = true;
        this.$refs.form.validate(valid => {
          if (!valid) {
            this.form.loading = false;
          } else {
            const params = {
              name: this.form.name,
              descriptions: this.form.desc,
              criteria: JSON.stringify(helper.formatCondition(this.bindConditions)),
              coverNumber: this.total > -1 ? this.total : 0, // 覆盖人数
              renewalMechanism: this.form.renewalMechanism, // 0- 不更新 1- t+1更新
            };
            api
              .saveCrowd(params)
              .done(res => {
                if (res.success) {
                  this.$router.push({
                    name: 'portraitSave',
                  });
                }
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.errorMessage,
                });
              })
              .finally(() => {
                this.form.loading = false;
              });
          }
        });
      },
      onSave() {
        this.form.loading = true;
        const params = {
          name: this.form.name,
          descriptions: this.form.desc,
          // criteria: this.criteriaValue.toString(),
          coverNumber: this.total > -1 ? this.total : 0, // 覆盖人数
          renewalMechanism: this.form.renewalMechanism, // 0- 不更新 1- t+1更新
        };
        if (this.isEdit) {
          params.id = this.model.id;
        }
        this.$refs.form.validate(valid => {
          if (!valid) {
            return;
          }
          if (this.isEdit) {
            console.log('edit 保存params------>', params);
            api
              .updateCrowd(params)
              .done(res => {
                this.show = false;
                this.$emit('saved');
              })
              .catch(e => {
                this.$message.error(`保存失败:${e.errorMessage}`);
              })
              .finally(() => {
                this.form.loading = false;
              });
          } else {
            api
              .saveCrowd(params)
              .done(res => {
                this.$message.success('保存成功');
                this.$router.push('/group');
              })
              .catch(e => {
                this.$message.error(`保存失败:${e.errorMessage}`);
              })
              .finally(() => {
                this.form.loading = false;
              });
          }
        });
      },
      gotoPortrait() {
        this.$router.push({
          name: 'portrait',
          params: {
            groupInfo: this.model,
            cdns: this.bindConditions,
          },
        });
      },
      fetchData() {
        this.loading = true;
        api
          .getCrowdById(this.model.id)
          .done(res => {
            this.form.renewalMechanism = res.data.renewalMechanism;
            this.form.desc = res.data.descriptions;
            this.criteriaValue = res.data.criteria;
            this.bindConditions = helper.toConditions(res.data.criteria);
            // this.bindConditions = JSON.parse(res.data.criteria)
            // console.log(this.bindConditions,'this.bindConditions',typeof(this.bindConditions))
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
  };
</script>
<style lang="less" scoped>
  .el-input {
    width: 600px;
  }

  .max {
    color: #666666;
    font-size: 14px;
  }

  .describe {
    margin: 0 5px;
    line-height: 30px;
  }

  .tips {
    width: 96%;
    color: #e72930;
    font-size: 14px;
    display: inline-flex;
    justify-content: center;
  }

  .hint {
    width: 100%;
    color: #666;
    font-size: 14px;
    text-align: center;
    position: relative;
    bottom: 20px;
  }
</style>
