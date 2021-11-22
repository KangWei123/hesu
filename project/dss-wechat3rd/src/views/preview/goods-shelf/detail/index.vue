<template>
  <div class="goods-detail">
    <el-form>
      <el-form-item label="商品分类："
                    class="goods-label">
        <span class="goods-type">美容业</span>
      </el-form-item>
      <el-form-item label="商品标题："
                    class="goods-label">
        <span>3D电子光电子纳米纤维护理 美白 护肤</span>
      </el-form-item>
      <el-form-item label="条形码："
                    class="goods-label">
        <span>231231239hiuasdasd</span>
      </el-form-item>

      <el-form-item label="商品视频："
                    class="goods-label">
        <span>v.qq.com</span>
        <el-button type="primary"
                   class="btn-preview">预览视频</el-button>
      </el-form-item>
      <el-form-item label="商品图片："
                    class="goods-label">
        <div>
          <img class="goods-imgs" />
          <img class="goods-imgs" />
        </div>
      </el-form-item>
      <el-form-item label="规格："
                    class="goods-label">
        <template>
          <el-table class="rules-table"
                    :data="tableData">
            <el-table-column v-bind:label="rulesName"
                             width="240">
              <template slot-scope="scope">
                <img class="rules-img" />
                <span class="rules-name">{{ scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="价格/元"
                             prop="price"
                             width="150"
                             align="center">

            </el-table-column>
            <el-table-column label="条形码"
                             prop="barcode">
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>

      <el-form-item label="时长："
                    class="goods-label">
        <span class="goods-time">120</span>
        <span class="service-unit">分钟</span>
      </el-form-item>
      <el-form-item label="线上预约："
                    class="goods-label">
        <span v-if="1===1">需支付</span>
        <span v-else>无需支付</span>
      </el-form-item>
      <el-form-item label="商品描述："
                    class="goods-label">
        <span class="goods-desc">奥术大师大所多，阿达是动物的，爱仕达搜读阿斯达， 爱哦时段so地阿苏都阿斯达阿萨德科技阿斯兰对。暗杀接电话 大石街道杀机是的，热个人。</span>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import './index.less';

export default {
  name: 'index',
  components: {},
  data() {
    return {
      rulesName: '厚度',
      tableData: [
        {
          name: '规格1',
          price: '11',
          barcode: '123123124141'
        },
        {
          name: '规格2',
          price: '22',
          barcode: '22222222'
        }
      ]
    };
  }
};
</script>
