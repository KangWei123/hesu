<template>
  <el-dialog title="添加商品到门店"
             :visible.sync="isVisible"
             v-loading="loading"
             @open="onDialogOpen">
    <el-checkbox-group v-model="checkedGoodsList">
      <div v-for="item in allGoodsList">
        <el-checkbox :label="item.id"
                     :disabled="isSelected(item.id)">
          {{item.name}}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <div slot="footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import services from '@/dss-common/utils/services';
  import constants from '../../constants/index';

  export default {
    name: 'GoodsAddDialog',
    model: {
      prop: 'dialogFormVisible'
    },
    props: {
      goodsType: {
        type: Object,
        default: function() {
          return null;
        }
      },
      dialogFormVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: true,
        allGoodsList: [],
        addedGoodsList: [],
        isVisible: false,
        checkedGoodsList: []
      };
    },

    computed: {
      isSelected() {
        return function(id) {
          return (
            typeof this.addedGoodsList.find(item => {
              return item.id === id;
            }) !== 'undefined'
          );
        };
      }
    },

    watch: {
      dialogFormVisible(newVal, oldVal) {
        this.isVisible = newVal;
      }
    },

    methods: {
      listPendingAddItems() {
        Promise.all([this.listAllManagedGoods(), this.listStoreItems()]).done(packRes => {
          this.allGoodsList = packRes[0].data || [];
          this.addedGoodsList = packRes[1].data || [];
        });
      },

      listAllManagedGoods() {
        this.loading = true;
        const params = {
          type: this.goodsType.value
        };
        return services.get(constants.Api.goods.list, {
          params,
          action: '商品列表'
        });
      },

      listStoreItems() {
        const params = {
          type: this.goodsType.value
        };

        return services.get(constants.Api.store.queryStoreItems, {
          params,
          action: '门店商品列表'
        });
      },

      onCancel() {
        this.isVisible = false;
        this.$emit('input', false);
      },
      onConfirm() {
        this.isVisible = false;
        this.$emit('input', false);
        console.log(this.checkedGoodsList);
      },
      onDialogOpen() {
        this.listPendingAddItems();
      }
    }
  };
</script>

<style scoped>

</style>
