<template>
  <el-dialog
    title="批量填充"
    :visible.sync="visible"
    width="300"
    custom-class="sku-info-batch"
    @closed="close">
    <div class="content">
      <template v-for="(item, index) in list">
        <div class="content-item" :key="index" v-if="item.key !== 'frontMoney' || isFrontMoneyItem">
          <div>{{item.label}}：{{item.price}}</div>
          <div v-for="attr in item.skuAttList" :key="attr.keyId">
            <el-checkbox v-model="attr.checked">同{{attr.keyName}}</el-checkbox>
          </div>
        </div>
      </template>
    </div>

     <div slot="footer" style="text-align: center;">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
     </div>
  </el-dialog>
</template>

<script>
const LABELLIST = [
  { key: 'salePrice', label: '售价' },
  { key: 'labelPrice', label: '标价' },
  { key: 'frontMoney', label: '定金' }
];
export default {
  name: 'batch-operation',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    skuAttList: {
      type: Array,
      default: () => []
    },
    curBatchEditItem: {
      type: Object,
      default: () => {}
    },
    /*是否为定金模式*/
    isFrontMoneyItem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    visible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      }
    }
  },
  mounted() {
    this.list = [];
    const skuAttList = this.skuAttList.map((skuAtt, skuAttIndex) => ({
      checked: false,
      keyId: skuAtt.keyId,
      keyName: skuAtt.keyName,
      keyValue: this.curBatchEditItem[`valName_${skuAttIndex}`]
    }));
    LABELLIST.forEach(item => {
      this.list.push({
        key: item.key,
        label: item.label,
        price: this.curBatchEditItem[item.key],
        skuAttList: this.$plain(skuAttList)
      });
    });
  },
  methods: {
    cancel() {
      this.visible = false;
    },
    save() {
      this.$emit('save', this.list);
      this.visible = false;
    },
    close() {}
  }
};
</script>

<style lang="less" scoped>
.sku-info-batch {
  .content {
    display: flex;
    .content-item {
      flex: 1;
    }
  }
}
</style>
