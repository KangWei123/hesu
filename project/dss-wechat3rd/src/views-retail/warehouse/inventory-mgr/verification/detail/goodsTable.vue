<template>

  <div class="inventory wkt-card">
    <el-table class="wkt-table"
              :data="goodsList">

      <el-table-column label="商品名称">
        <template slot-scope="scope">
          <div class="goods-info">
            <div class="goods-img">
              <i v-if="scope.row.avatar===''"
                 class="el-icon-question avatar-size" />
              <img v-else
                   :src="scope.row.imgUrl" />
            </div>

            <div class="goods-desc">
              <div class="goods-name"> {{ scope.row.itemName }} {{scope.row.itemAttribute? '(' + scope.row.itemAttribute + ')' :''}}</div>
              <div> {{ scope.row.skuBarcode }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="单位"
                       align="center"
                       prop="unit">
      </el-table-column>

      <el-table-column label="实物库存"
                       prop="stock">
      </el-table-column>

      <el-table-column label="盘点数量"
                       prop="reviewNum">
      </el-table-column>

      <el-table-column label="盈亏数量" width="110px">
        <template slot-scope='scope'>
          <span :style="{color: scope.row.reviewNum-scope.row.stock !==0 ? 'red' : 'black'}">
            {{(scope.row.profitNum = scope.row.reviewNum - scope.row.stock) > 0? '+': ''}}{{scope.row.profitNum}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import '../common/goodsTable.less';

export default {
  props: {
    goodsList: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
