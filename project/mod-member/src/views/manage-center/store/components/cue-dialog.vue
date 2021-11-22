<template>
  <el-dialog title="分配线索" :visible.sync="dialogVisible" width="30%">
    <el-form :model="form" :rules="rules" ref="Form" label-width="150px">
      <el-form-item prop="clueId" label="分配线索：">
        <template>
          <el-radio size="small" v-model="form.groupType" :label="1">分配导购</el-radio>
          <el-radio size="small" v-model="form.groupType" :label="2">总部客服</el-radio>
          <el-radio size="small" v-model="form.groupType" :label="3">外包电销</el-radio>
        </template>
      </el-form-item>
      <el-form-item prop="group">
        <el-select :loading="loading" v-model="form.group" multiple placeholder="请选择" style="width: 70%">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import services from '@/dss-common/utils/services';

  export default {
    props: {
      visible: {},
    },

    data() {
      return {
        form: {
          groupType: 1,
          group: null,
        },
        rules: {
          group: [{ required: true, message: '请选择', trigger: 'change' }],
        },
        options: [],
        loading: false,
        url: '/wp/client/guide/list',
      };
    },

    watch: {
      'form.groupType': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.form.group = [];
            this.getOptions(newVal);
          }
        },
      },
    },

    computed: {
      dialogVisible: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },

    methods: {
      onSubmit() {
        this.$refs.Form.validate(valid => {
          if (!valid) return;
          this.doSubmit();
        });
      },

      doSubmit() {
        console.log(this.form, 'form----');
      },

      getOptions(val) {
        this.loading = true;
        let params = {};
        let action = '';
        switch (val) {
          case 1:
            action = '获取导购员列表';
            this.url = '/wp/client/guide/list';
            params = { queryAll: 1 };
            break;
          case 2:
            action = '获取客服列表';
            this.url = '/wp/store/query_list';
            break;
          case 3:
            action = '获取外包电销列表';
            this.url = '/wp/article_group/list';
            params = {
              pageNo: 1,
              pageSize: 10,
            };
            break;
        }
        services
          .get(this.url, { action, params })
          .then(({ data }) => {
            if (val == 3) {
              (data || []).forEach(item => {
                item.name = item.groupName;
              });
            }
            this.options = data || [];
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
    mounted() {
      this.getOptions(1);
    },
  };
</script>
