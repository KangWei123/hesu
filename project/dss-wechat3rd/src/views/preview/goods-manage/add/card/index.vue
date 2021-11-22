<template>
  <div class="card-add">
    <el-form class="card-form">
      <el-form-item label="选择卡项类别："
                    class="card-type-label">
        <el-radio label="1"><img /></el-radio>
        <el-radio label="2"><img /></el-radio>
      </el-form-item>
      <el-form-item label="卡项名称："
                    class="card-label">
        <el-input placeholder="请输入卡项名称"
                  class="card-w366 primary-inputHeight"></el-input>
      </el-form-item>

      <el-form-item label="充值金额："
                    class="card-label">
        <el-input placeholder="请输入金额"
                  class="card-w157 primary-inputHeight"></el-input>
        <span class="card-unit">元</span>
      </el-form-item>
      <el-form-item label="赠送金额："
                    class="card-label">
        <el-input placeholder="请输入赠送金额"
                  class="card-w157 primary-inputHeight"></el-input>
        <span class="card-unit">元</span>
      </el-form-item>

      <el-form-item label="售价："
                    class="card-label">
        <el-input placeholder="请输入价格"
                  class="card-w157 primary-inputHeight"></el-input>
        <span class="card-unit">元</span>
      </el-form-item>
      <el-form-item label="内容："
                    class="card-label">
        <el-button class="btn-rules">+添加服务</el-button>
        <div class="notes">设置此卡支持的服务项目和可用次数</div>
      </el-form-item>

      <el-form-item label="有效期："
                    class="card-label">
        <el-radio label="1">永久</el-radio>
        <el-radio label="2">自定义</el-radio>
        <el-input placeholder=""
                  class="card-day primary-inputHeight"></el-input>
        <span class="card-unit">天</span>
      </el-form-item>
      <el-form-item label="商品描述："
                    class="card-label">
        <el-input type="textarea"
                  :autosize="{ minRows: 8, maxRows: 8}"
                  placeholder=""
                  class="card-describe"></el-input>
      </el-form-item>
      <hr class="card-hr" />
      <el-form-item label="卡项样式："
                    class="card-label">
        <div class="card-radio">
          <el-radio label="1">默认背景图</el-radio>
          <el-radio label="2">自定义图片</el-radio>
        </div>
        <div class="card-box">
          <div class="card-upload-img">
            <i class="el-icon-plus"></i>
          </div>
          <div class="img-notes">建议尺寸：690x390，图片不大于1M</div>
        </div>
        <img class="card-default-img" />
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
