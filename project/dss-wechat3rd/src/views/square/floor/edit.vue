<template>
  <form-page-layout
    refs="form"
    :model="form"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>楼层管理</template>
      <el-form-item label="楼栋名称" prop="name" placeholder="请输入">
        <el-input v-model.trim="form.name" class="w220" maxlength="10" placeholder="请输入楼栋名称"></el-input>
      </el-form-item>
      <el-form-item label="楼层配置" prop="floorList">
        <el-button @click="onAddFloor">新增楼层</el-button>
        <el-table v-if="form.floorList && form.floorList.length" :data="form.floorList">
          <el-table-column prop="floorName" label="楼层名称">
            <template slot-scope="scope">
              <el-form-item :prop="`floorList.${scope.$index}.name`" :rules="rules.floorValid">
                <el-input
                  v-model.trim="scope.row.name"
                  class="w220"
                  maxlength="10"
                  placeholder="请输入楼层名称"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="onDelte(scope.row.name, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { FormPageLayout, FormButton, FormGroup } from '@/dss-common/components/form-page';
  import merchantApi from '@/dss-wechat3rd/src/api/merchant';

  export default {
    components: {
      FormPageLayout,
      FormButton,
      FormGroup,
    },
    data() {
      const floorNameCheck = (rule, value, callback) => {
        if (!value) {
          callback();
          return;
        }

        const idx = Number(rule.field.split('.')[1]);
        const list = this.form.floorList;

        list.forEach((item, index) => {
          if (index < idx) {
            if (item.name === value) {
              callback(new Error('楼层名称不能相同'));
            }
          } else {
            callback();
          }
        });
      };

      return {
        form: {
          name: null,
          floorList: [],
        },
        rules: {
          name: [
            { required: true, message: '请输入楼栋名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          ],
          floorList: [
            { required: true, message: '请添加楼层', trigger: 'change' },
            {
              validator: (rules, value, callback) => {
                if (value && value.length && value.some(i => !i.name)) {
                  return callback(new Error('请输入楼层名称'));
                }
                return callback();
              },
              trigger: ['blur', 'change'],
            },
          ],
          floorValid: [
            {
              trigger: 'blur',
              validator: floorNameCheck,
            },
          ],
        },
      };
    },
    computed: {
      id() {
        return this.$route.query.id;
      },
      isEdit() {
        return !!this.id;
      },
    },
    mounted() {
      if (this.isEdit) {
        this.getDetail();
      }
    },

    methods: {
      onAddFloor() {
        this.form.floorList.push({
          name: '',
        });
      },
      async confirmDelete() {
        try {
          await this.$confirm('请确认该楼层下是否存在商户，删除后将无法通过楼层查询到对应商户，请谨慎操作!', '提示', {
            type: 'warning',
            closeOnClickModal: false,
          });
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
      async onDelte(value, index) {
        if (value && !(await this.confirmDelete(this.selected))) {
          return;
        }
        this.form.floorList.splice(index, 1);
      },
      async getDetail() {
        const { data } = await merchantApi.floor.detailFloor({ id: this.id });
        const { name, floor } = data;

        this.form = { name, floorList: JSON.parse(floor || '{}') };
      },
      async handleSubmit() {
        const { name, floorList } = this.form;
        const params = { name, floor: JSON.stringify(floorList) };

        if (!this.isEdit) {
          await merchantApi.floor.addFloor(params);
        } else {
          await merchantApi.floor.updateFloor({ id: parseInt(this.id), ...params });
        }
      },
    },
  };
</script>
