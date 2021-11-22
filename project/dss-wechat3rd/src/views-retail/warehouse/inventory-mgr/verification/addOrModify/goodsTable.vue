<template>

  <div class="inventory wkt-card">
    <el-table class="wkt-table goods-info-table"
              :data="goodsList">

      <el-table-column label="商品名称"
                       width="300">
        <template slot-scope="scope">
          <div class="goods-info">
            <div class="goods-img">
              <i v-if="scope.row.imgUrl ===''"
                 class="el-icon-question avatar-size" />
              <img v-else
                   :src="scope.row.imgUrl" />
            </div>

            <div class="goods-desc">
              <div class="goods-name"> {{ scope.row.itemName }}{{scope.row.itemAttribute?'('+scope.row.itemAttribute+')':''}}</div>
              <div> {{ scope.row.barcode }}</div>
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

      <el-table-column label="可用库存"
                       prop="usableStock">
      </el-table-column>

      <el-table-column label="盘点数量"
                       width="120px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.reviewNum"
                    size="mini">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="盈亏数量">
        <template slot-scope='scope'>
          <span :style="{color: scope.row.reviewNum-scope.row.stock !==0 ? 'red' : 'black'}">
            {{(scope.row.profitNum = scope.row.reviewNum - scope.row.stock) > 0? '+': ''}}{{scope.row.profitNum}}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="批次"
                       sortable
                       prop="batchNo">
        <template slot-scope='scope'>
          {{scope.row.batchNo&& scope.row.batchNo !=='-1000'?scope.row.batchNo:'N/A'}}
        </template>
      </el-table-column>

      <el-table-column label="质保期"
                       sortable
                       prop="expirationDate">
        <template slot-scope='scope'>
          {{scope.row.expirationDate|time('YYYY-MM-DD')}}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <a class="dss-link"
             href="javascript:;"
             @click="onDelete(scope.row)">删除</a>
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
      default: []
    }
  },

  methods: {
    onDelete(item) {
      console.log('delete item -->', JSON.stringify(item));
      this.goodsList.splice(this.goodsList.indexOf(item), 1);
    }
  }
};
</script>
