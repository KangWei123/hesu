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
          <!-- <div v-for="attr in item.skuAttList" :key="attr.keyId">
            <el-checkbox v-model="attr.checked">同<span style="color: #2e8dff;">{{attr.keyName}}</span></el-checkbox>
          </div> -->
        </div>
      </template>
    </div>

    <div class="attr">
      <div class="attr-item" v-for="attr in attList" :key="attr.keyId">
        <el-checkbox v-model="attr.checked">同<span style="color: #2e8dff;">{{attr.keyName}}</span></el-checkbox>
      </div>
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
      list: [],
      attList: []
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
    // const skuAttList = this.skuAttList.map((skuAtt, skuAttIndex) => ({
    //   checked: false,
    //   keyId: skuAtt.keyId,
    //   keyName: skuAtt.keyName,
    //   keyValue: this.curBatchEditItem[`valName_${skuAttIndex}`]
    // }));
    this.attList = this.$plain(this.skuAttList);
    LABELLIST.forEach(item => {
      this.list.push({
        key: item.key,
        label: item.label,
        price: this.curBatchEditItem[item.key]
        // skuAttList: this.$plain(skuAttList)
      });
    });
  },
  methods: {
    cancel() {
      this.visible = false;
    },
    save() {
      const selectedList = [];
      // 当前选中项的规格值
      const attrValList = [];
      this.attList.forEach((item, i) => {
        if (!!item.checked) {
          selectedList.push(item.keyId);
          if (!!this.curBatchEditItem[`valId_${i}`]) {
            attrValList.push(this.curBatchEditItem[`valId_${i}`]);
          }
        }
      });
      this.$emit('save', selectedList, attrValList);
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
      text-align: left;
    }
  }

  .attr {
    display: flex;
    .attr-item {
      flex: 1;
      text-align: left;
    }
  }
}
</style>
