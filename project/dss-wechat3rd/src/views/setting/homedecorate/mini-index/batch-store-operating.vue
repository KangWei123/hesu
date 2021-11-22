/**
 * 批量设置多门店主页
 */

<template>
  <el-dialog
    custom-class="batch-store-setting"
    :visible.sync="show"
    width="400px"
    title="设为主页"
    :modal-append-to-body="false"
    @closed="reset"
    @open="fetchStoreList">
    <el-form ref="form" class="content" :model="form" :rules="rules" v-loading="loading">
      <el-form-item label="选择生效门店" prop="stores">
        <el-select v-model="form.stores" filterable multiple placeholder="请选择门店" style="width: 100%;">
          <el-option
            v-for="item in storeList"
            :key="item.storeId"
            :label="item.storeName"
            :value="item.storeId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import service from '@/dss-wechat3rd/src/api/index';

export default {
  name: 'batch-store-operating',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    page: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      form: {
        stores: []
      },
      storeList: [],
      rules: {
        stores: [
          {
            required: true,
            message: '请选择门店',
            trigger: 'change'
          }
        ]
      }
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.batchSetting();
        }
      });
    },
    reset() {
      this.$refs.form.resetFields();
      this.loading = false;
      this.storeList = [];
    },
    // 获取当前角色(区域管理员)权限范围内的门店列表
    fetchStoreList() {
      this.loading = true;
      const params = {
        'roleIdentifierList[0]': 'common_role_area_manager',
        'roleIdentifierList[1]': 'common_role_dealer_manager'
      };
      service
        .fetchStoreList(params)
        .then(res => {
          if (res.data && res.data.length) {
            this.storeList = res.data.map(item => ({ storeName: item.storeName, storeId: item.storeId }));
            return;
          }
          this.storeList = [];
        })
        .catch(() => {
          this.storeList = [];
        })
        .always(() => {
          this.loading = false;
        });
    },
    // 批量设置门店主页
    batchSetting() {
      if (!this.page || !this.page.id) return;
      const params = {
        pageId: this.page.id,
        storeIds: this.form.stores
      };
      this.loading = true;
      return service
        .batchSetCustomHomePage(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: '同步成功',
              type: 'success'
            });
            this.show = false;
            this.$emit('succeed');
          }
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
.el-dialog.batch-store-setting {
  .dialog-footer {
    text-align: center;
  }

  .content {
    .el-tag.el-tag--info.el-tag--small {
      border-color: transparent;
      margin: 2px 0 2px 6px;
      background-color: #f0f2f5;
    }

    .el-tag__close.el-icon-close {
      color: #FFF;
    }
  }
}
</style>
