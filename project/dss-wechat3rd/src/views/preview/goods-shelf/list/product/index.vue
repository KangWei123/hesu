<template>
  <div class="product-list">
    <div>
      <el-checkbox v-model="checked"
                   class="goods-total"
                   @change="toggleSelection(checked)">全选</el-checkbox>
      <el-button type="primary"
                 class="onshelf">上架</el-button>
      <el-button class="downshelf">下架</el-button>
    </div>
    <el-table ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              class="dss-list_table">
      <el-table-column type="selection"
                       width="70">
      </el-table-column>
      <el-table-column label="商品名称"
                       min-width="400">
        <template slot-scope="scope">
          <div class="goods-img"><img /></div>
          <div class="goods-desc">
            <div>{{ scope.row.desc}}</div>
            <span>￥{{ scope.row.price}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type"
                       label="商品分类"
                       width="150"
                       align="center">
      </el-table-column>
      <el-table-column width="250"
                       label="上下架"
                       align="center">
        <template slot-scope="scope">
          <div class="goods-shlef"
               v-if="scope.row.shelf===true">
            <el-button class="btn-state">已上架</el-button>
            <span class="goods-line"></span>
            <a>下架</a>
          </div>
          <div class="goods-lower"
               v-else>
            <el-button class="btn-state">已下架</el-button>
            <span class="goods-line"></span>
            <a>上架</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="count"
                       width="150"
                       label="总库存"
                       align="center">
      </el-table-column>
      <el-table-column prop="count"
                       width="150"
                       label="总销量"
                       align="center">
      </el-table-column>
      <el-table-column prop="address"
                       width="220"
                       label="操作">
        <template slot-scope="scope">
          <div class="goods-operation">
            <a>二维码</a>
            <a>编辑</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import './index.less';

export default {
  data() {
    return {
      checked: false,
      tableData: [
        {
          desc: '卡姿兰亮彩眼影 魅力四射 活力无限 爱美女性的第一选择',
          type: '商品分类',
          count: '2222',
          price: '120',
          shelf: true
        },
        {
          desc: '卡姿兰亮彩眼影 魅力四射 活力无限 爱美女性的第一选择',
          type: '商品分类',
          count: '2222',
          price: '120',
          shelf: false
        },
        {
          desc: '卡姿兰亮彩眼影 魅力四射 活力无限 爱美女性的第一选择',
          type: '商品分类',
          count: '2222',
          price: '120',
          shelf: true
        }
      ]
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        //  this.tableData.forEach(row => {
        //   this.$refs.multipleTable.toggleRowSelection(row);
        // });
        this.$refs.multipleTable.toggleAllSelection();
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    }
  }
};
</script>
