<template>
  <div class="service">
    <el-form class="service-form">
      <div><span class="service-icon">1</span>
        <h3 class="service-title">选择商品分类</h3>
      </div>
      <el-form-item label="商品分类："
                    class="goods-label">
        <el-select placeholder="选择服务分类"
                   class="service-w177 primary-inputHeight">
          <el-option label=""
                     value=""></el-option>
        </el-select>
        <span class="service-add">+快速增加分类</span>
      </el-form-item>
      <hr class="service-hr" />
      <div><span class="service-icon">2</span>
        <h3 class="service-title">商品基本信息</h3>
      </div>
      <el-form-item label="商品标题："
                    class="goods-label">
        <el-input placeholder="请输入商品名称"
                  class="service-w366 primary-inputHeight"></el-input>
      </el-form-item>
      <el-form-item label="条形码："
                    class="goods-label">
        <el-input placeholder="支持14位内的数字+英文组合"
                  class="service-w366 primary-inputHeight"></el-input>
        <div class="notes">自定义条形码提交后不可修改，请谨慎填写（注：该项不填写时，系统会自动生成，你有1次机会修改）</div>
      </el-form-item>

      <el-form-item label="商品视频："
                    class="goods-label">
        <el-input placeholder="请输入视频源地址，仅支持腾讯视频"
                  class="service-w366 primary-inputHeight"></el-input>
        <el-button type="primary"
                   class="btn-preview">预览视频</el-button>
      </el-form-item>
      <el-form-item label="商品图片："
                    class="goods-label">

      </el-form-item>
      <el-form-item label="规格："
                    class="goods-label">
        <el-button class="btn-rules">+添加规格</el-button>
      </el-form-item>
      <div class="service-rules">
        <el-form class="rules-form">
          <el-form-item label="请输入规格名称"
                        class="rules-label">
            <el-input placeholder="如大小、厚度、深度、颜色等"
                      class="rules-name primary-inputHeight"></el-input>
            <el-checkbox class="checkImg"
                         label="添加规格图片"
                         name="type"></el-checkbox>
          </el-form-item>
          <el-form-item label="请输入规格参数"
                        class="rules-label">
            <el-input class="rules-parameter primary-inputHeight"
                      value="规格1"
                      readonly="readonly"></el-input>
            <el-input class="rules-parameter primary-inputHeight"
                      value="规格2"
                      readonly="readonly"></el-input>
            <span class="rules-add">+新增参数</span>
            <div class="rules-notes">如：大瓶、中瓶、小瓶等</div>
          </el-form-item>
          <template>
            <el-table class="rules-table"
                      :data="tableData">
              <el-table-column label="规格名称"
                               width="200"
                               align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="价格/元"
                               width="150"
                               align="center">
                <template slot-scope="scope">
                  <el-input class="primary-inputHeight"
                            style="width:60px;"
                            v-model="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="条形码">
                <template slot-scope="scope">
                  <el-input class="primary-inputHeight"
                            style="width:163px;"
                            v-model="scope.row.barcode"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <div>
            <el-button type="primary"
                       class="rules-save">保存规格</el-button>
          </div>
        </el-form>
      </div>
      <el-form-item label="售价："
                    class="goods-label">
        <el-input placeholder="请输入价格"
                  class="service-price primary-inputHeight"></el-input>
        <span class="service-unit">元</span>
      </el-form-item>
      <el-form-item label="时长："
                    class="goods-label">
        <el-input placeholder="请输入服务时长"
                  class="service-price primary-inputHeight"></el-input>
        <span class="service-unit">分钟</span>
      </el-form-item>
      <el-form-item label="线上预约："
                    class="goods-label">
        <template>
          <el-radio label="1">需支付</el-radio>
          <el-radio label="2">无需支付</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="商品描述："
                    class="goods-label">
        <el-input type="textarea"
                  :autosize="{ minRows: 8, maxRows: 8}"
                  placeholder="请输入商品描述内容"
                  class="service-describe"></el-input>
      </el-form-item>
      <div>
        <el-button type="primary"
                   class="service-save">保存</el-button>
      </div>
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
      tableData: [
        {
          name: '规格1',
          price: '',
          barcode: ''
        },
        {
          name: '规格2',
          price: '',
          barcode: ''
        }
      ]
    };
  }
};
</script>
