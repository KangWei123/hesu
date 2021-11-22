<template>
  <el-table
    class="wkt-table"
    v-if="tpl && tpl.freightTemplateAreaDTOList && tpl.freightTemplateAreaDTOList.length"
    :data="tpl.freightTemplateAreaDTOList"
  >
    <el-table-column label="区域">
      <template slot-scope="scope">
        <span class="area-contents">{{ computeAreaTitle(scope.row) }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="tpl.valuationModel ? '首件(kg)' : '首件(个)'" width="120" align="center" prop="first">
      <template slot-scope="scope">
        <div v-if="tpl.valuationModel">{{ scope.row.first | price(1000) }}</div>
        <div v-else>{{ scope.row.first }}</div>
      </template>
    </el-table-column>
    <el-table-column label="运费(元)" width="120" align="center" prop="firstFreight">
      <template slot-scope="scope">
        <div>{{ scope.row.firstFreight | price }}</div>
      </template>
    </el-table-column>
    <el-table-column :label="tpl.valuationModel ? '续件(kg)' : '续件(个)'" width="120" align="center" prop="continues">
      <template slot-scope="scope">
        <div v-if="tpl.valuationModel">{{ scope.row.continues | price(1000) }}</div>
        <div v-else>{{ scope.row.continues }}</div>
      </template>
    </el-table-column>
    <el-table-column label="续费(元)" width="120" align="center" prop="continueFreight">
      <template slot-scope="scope">
        <div>{{ scope.row.continueFreight | price }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import floatNumUtil from '@/dss-common/utils/float-num.js';
import tplEnum from './tpl-enum.js';
export default {
  name: 'tpl-area-table',
  props: {
    //是否把默认运费加入到
    addDefaultItem: {
      type: Boolean,
      default: false
    },
    tpl: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },
  watch: {
    tpl: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.parseTpl();
        }
      }
    }
  },
  computed: {
    computeAreaTitle() {
      return function(item) {
        return item.regionDTOS
          .map(region => {
            return region.regionName;
          })
          .join(';');
      };
    }
  },
  methods: {
    parseTpl() {
      if (!this.tpl.freightTemplateAreaDTOList) {
        this.tpl.freightTemplateAreaDTOList = [];
      }
      if (this.tpl.type === tplEnum.type.buyerBear) {
        if (this.tpl.freightTemplateAreaDTOList.length && !this.tpl.freightTemplateAreaDTOList[0].isDefault) {
          this.tpl.freightTemplateAreaDTOList.unshift({
            isDefault: true, //默认运费标识
            first: this.tpl.defaultFirst,
            firstFreight: this.tpl.defaultFirstFreight,
            continues: this.tpl.defaultContinues,
            continueFreight: this.tpl.defaultContinueFreight,
            regionDTOS: [{ regionName: '默认运费' }]
          });
        }
      }
    }
  }
};
</script>

<style scoped></style>
