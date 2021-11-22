<template>
  <div class="choose-guide-dialog">
    <el-dialog
      title="修改订单归属导购"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form" :rules="rules" ref="Form" label-width="100px">
        <el-form-item prop="guides" label="选择导购">
          <el-select 
            v-model="form.guides"
            :loading="loading.list"
            value-key="id"
            placeholder="请选择"
            multiple
            clearable=""
            style="width: 80%">
            <el-option
              v-for="item in guideList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" :disabled="loading.submit">取 消</el-button>
        <el-button type="primary" @click="onConfirm" :loading="loading.submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import orderApi from '@/dss-wechat3rd/src/api/order';
import { mapState } from 'vuex';
export default {
  name: 'chooseGuideDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderNo: {
      type: String,
      default: ''
    },
    storeId: {
      type: Number,
      default: null
    },
    belongGuides: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      guideList: [],
      form: {
        guides: []
      },
      rules: {
        guides: [{ required: true, message: '请选择导购', trigger: 'change' }]
      },
      loading: {
        list: false,
        submit: false
      }
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    storeId(val) {
      this.getGuideList();
    },
    belongGuides(val) {
      this.filterGuide(this.guideList, val);
    }
  },
  methods: {
    getGuideList() {
      if (!this.storeId) {
        this.guideList = [];
        return;
      }
      this.loading.list = true;
      let params = {
        queryAll: true,
        storeId: this.storeId,
        positionIds: 'common_role_storeKeeper,common_role_sales'
      };
      orderApi
        .queryGuideList(params)
        .then(({ data }) => {
          this.guideList = data || [];
          this.filterGuide(data, this.belongGuides);
        })
        .finally(() => {
          this.loading.list = false;
        });
    },
    onConfirm() {
      this.$refs.Form.validate()
        .then(valid => {
          this.loading.submit = true;
          let params = {
            orderNo: this.orderNo,
            employeeIds: this.form.guides
          };
          return orderApi.changeBelongGuide(params);
        })
        .then(({ data }) => {
          this.$message({ message: '修改导购成功', type: 'success' });
          this.dialogVisible = false;
          this.$emit('successChange');
        })
        .finally(_ => {
          this.loading.submit = false;
        });
    },
    // 过滤掉该门店下不存在的导购
    filterGuide(guideList, belongGuides) {
      if (guideList && guideList.length && this.belongGuides && this.belongGuides.length) {
        const allGuideIds = guideList.map(item => item.id);
        this.form.guides = belongGuides.filter(item => {
          return allGuideIds.includes(item);
        });
      }
    }
  },
  mounted: function() {
    this.getGuideList();
  }
};
</script>

<style lang="less" scoped>
/deep/.el-tag{
  background: #c5dafd;
  color: #0064f9;
  border-radius: 0;
  border: 0;
  .el-icon-close  {
    background: none;
  }
}

</style>
