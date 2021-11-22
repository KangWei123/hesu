<template>
  <div v-loading="isLoading" class="supplier-edit">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/supplier/list' }">供应商管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ isEdit ? '修改' : '创建' }}供应商</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      :model="form"
      :rules="rules"
      label-width="110px"
      ref="elForm"
      size="mini"
      label-position="right"
      class="supplier-edit-form"
    >
      <el-form-item label="供应商名称：" class="supplier-edit-item" prop="name">
        <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input>
      </el-form-item>
      <el-form-item label="单位电话：" class="supplier-edit-item" prop="officeTel">
        <el-input v-model="form.officeTel" placeholder="请输入单位电话"></el-input>
      </el-form-item>

      <el-form-item label="联系人：" class="supplier-edit-item" prop="contacts">
        <el-input v-model="form.contacts" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="手机号码：" class="supplier-edit-item" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="地址：" class="supplier-edit-item" prop="address">
        <div style="margin-bottom: 10px">
          <el-cascader
            style="width: 56%"
            expand-trigger="hover"
            @active-item-change="onAreaChange"
            :options="areas"
            placeholder="请选择省/市/区"
            :props="{ label: 'name', value: 'id', children: 'childNode' }"
            v-model="form.area"
            separator="-"
          />
        </div>
        <el-input v-model="form.address" placeholder="详细地址" />
      </el-form-item>
      <el-form-item label="备注：" class="supplier-edit-item" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="6" />
      </el-form-item>

      <div class="line-title">更多信息</div>
      <hr class="split-line" />

      <div class="more-block">
        <el-form-item label="QQ：" prop="qq">
          <el-input v-model="form.qq" />
        </el-form-item>
        <el-form-item label="微信号：" prop="wechat">
          <el-input v-model="form.wechat" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="传真：" prop="fax">
          <el-input v-model="form.fax" />
        </el-form-item>
      </div>
      <!-- <el-form-item>
        <el-button size="mini"
                   type="primary"
                   @click="onSave">保存</el-button>
        <el-button size="mini"
                   @click="onCancle">取消</el-button>
      </el-form-item> -->
    </el-form>

    <!-- 保存按钮 -->
    <div class="bottom-button">
      <div class="button">
        <el-button size="mini" @click="onCancle">取消</el-button>
        <el-button size="mini" type="primary" @click="onSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/dss-wechat3rd/src/api/supplier.js';
  import regexps from '@/dss-common/utils/regexps.js';

  const areaApi = api.area;
  const supplierApi = api.supplier;

  export default {
    components: {},
    data() {
      const { name, phone, email, qq, wxChat, fax } = regexps;
      const checkAddress = (rule, value, callback) => {
        if (this.form.area.length === 0) {
          return callback(new Error('请选择省/市/区'));
        }
        if (!value) {
          return callback(new Error('请输入详细地址'));
        }
        if (!name.reg.test(value)) {
          return callback(name.msg);
        }
        return callback();
      };
      return {
        id: null,
        form: {
          officeTel: '', // 固话
          name: '', // 供应商名称
          phone: '', // 手机号码
          area: [], // 区域
          contacts: '',
          address: '', // 详细地址
          remark: '', // 备注
          qq: '',
          wechat: '',
          email: '',
          fax: '',
        },
        areas: [],
        rules: {
          name: [
            { required: true, message: '请输入供应商名称' },
            {
              pattern: name.reg,
              message: name.msg,
            },
            {
              max: 16,
              message: '最大长度16个字符',
            },
          ],
          phone: [
            {
              required: true,
              message: '请输入手机号码',
            },
            {
              pattern: phone.reg,
              message: phone.msg,
            },
          ],
          contacts: [
            {
              required: true,
              message: '请输入联系人',
            },
            {
              pattern: name.reg,
              message: name.msg,
            },
            {
              max: 15,
              message: '最大长度15个字符',
            },
          ],
          officeTel: [
            {
              max: 15,
              message: '最大长度15个字符',
            },
          ],
          address: [
            {
              required: true,
              message: '请输入详细地址',
            },
            { validator: checkAddress },
            { max: 100, message: '最大长度在200字符' },
          ],
          remark: [{ max: 200, message: '最大长度在200字符' }],
          qq: [
            {
              pattern: qq.reg,
              message: qq.msg,
            },
          ],
          wechat: {
            pattern: wxChat.reg,
            message: wxChat.msg,
          },
          email: [
            {
              pattern: email.reg,
              message: email.msg,
            },
            {
              type: 'email',
              message: email.msg,
              trigger: 'blur',
            },
          ],
          fax: {
            pattern: fax.reg,
            message: fax.msg,
          },
        },
        dialog: {
          goods: false,
        },
        isLoading: false,
      };
    },
    computed: {
      isEdit() {
        return !!this.id;
      },
    },
    mounted() {
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.form.area);
      });
      const id = this.$route.query.id;
      if (!id) {
        return;
      }
      this.id = id;
      supplierApi.supplier_detail(id).then(
        res => {
          if (!res.data) {
            // 请求后端成功，但返回data为空（data为空，id有可能是乱填的），把id置为null
            this.id = null;
            this.$router.push('/supplier/list/edit');
            return;
          }
          this.setFormData(res.data || {});
        },
        () => {
          // 异常，路径去掉id进入新建态
          this.id = null;
          this.$router.push('/supplier/list/edit');
        }
      );
    },
    methods: {
      onShowGoods() {
        if (this.isEdit) {
          return;
        }
        this.dialog.goods = true;
      },
      /**
       * 填充表单数据
       */
      setFormData(data) {
        for (const key in this.form) {
          if (key === 'area') {
            this.form.area = [data.provinceId, data.cityId, data.regionId];
            this.fetchInitAreas(0, this.form.area);
            continue;
          }
          this.form[key] = data[key];
        }
      },
      onSave() {
        this.$refs.elForm.validate(valid => {
          if (!valid) {
            return;
          }
          this.save();
        });
      },
      save() {
        const params = { ...this.form };

        let methodProp = 'add_supplier';
        if (this.isEdit) {
          params.id = this.id;
          methodProp = 'update_supplier';
        }

        const areas = this.getPath(this.form.area || []);
        const province = areas[0];
        const city = areas[1];
        const region = areas[2];

        if (province) {
          params.provinceId = province.id;
          params.province = province.name;
        }
        if (city) {
          params.cityId = city.id;
          params.city = city.name;
        }
        if (region) {
          params.regionId = region.id;
          params.region = region.name;
        }
        this.isLoading = true;

        supplierApi[methodProp](params)
          .done(res => {
            this.$message({
              message: this.isEdit ? '修改成功' : '创建成功。',
              type: 'success',
            });
            this.$router.push('/warehouse/supplier/list');
          })
          .always(() => {
            this.isLoading = false;
          });
      },
      onCancle() {
        this.$router.push('/warehouse/supplier/list');
      },
      onAreaChange(ids) {
        if (ids && ids.length) {
          this.fetchAreas(ids[ids.length - 1]);
        }
      },
      fetchAreas(id) {
        if (id) {
          const node = this.getNodeById(this.areas, id);
          if (!node || node.isloaded) {
            return;
          }
          return areaApi.queryRegion(id).done(({ data }) => {
            node.isloaded = true;
            node.childNode = this.addChildren(data);
          });
        }

        return areaApi.queryRegion().done(({ data }) => {
          this.areas = this.addChildren(data);
        });
      },
      addChildren(nodes) {
        if (!nodes || nodes.length === 0) {
          return null;
        }
        for (const node of nodes) {
          if (!node.isLeaf) {
            node.childNode = [];
          }
        }
        return nodes;
      },
      getNodeById(areas, id) {
        for (const area of areas) {
          if (area.id === id) {
            return area;
          }
          if (area.childNode && area.childNode.length) {
            const findedNode = this.getNodeById(area.childNode, id);
            if (findedNode) {
              return findedNode;
            }
          }
        }
      },
      // 获取路径初始化值
      fetchInitAreas(index, ids) {
        if (index >= ids.length || index >= 2) {
          // 超过数组和3级节点，不加载
          return;
        }

        const promise = this.fetchAreas(ids[index]);
        if (promise) {
          promise.done(() => {
            this.fetchInitAreas(index + 1, ids);
          });
        } else {
          this.fetchInitAreas(index + 1, ids);
        }
      },
      getPath(areaIds) {
        let list = this.areas;
        const path = [];
        for (const areaId of areaIds) {
          const finded = list.find(a => a.id === areaId);
          if (!finded) {
            return path;
          }
          path.push(finded);
          list = finded.childNode;
        }
        return path;
      },
    },
  };
</script>

<style lang="less">
  @import './edit.less';
</style>
