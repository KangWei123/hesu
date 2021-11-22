<template>
  <div>
    <template v-if="handlerConfig && handlerConfig.edit">
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="row.preSell || (row.inActivity && row.inActivity > 0)"
        content="该商品参加活动中，不允许编辑敏感信息!"
      >
        <a href="javascript:;" slot="reference" @click="editGoods(row)">详情</a>
      </el-popover>
      <a v-else href="javascript:;" @click="editGoods(row)">编辑</a>
    </template>

    <!--自定义一个component，并将数据回传出去-->
    <div v-if="slotHandler" :is="slotHandler" :item-data="row"></div>

    <a href="javascript:;" v-if="handlerConfig && handlerConfig.shelf" @click="shelfGoods(row)">门店上下架</a>

    <el-popover
      placement="top"
      :title="minAppInfo.name"
      width="200"
      v-if="handlerConfig && handlerConfig.link"
      :content="minAppInfo.path"
      trigger="click"
    >
      <a href="javascript:void(0);" slot="reference" @click="checkMinApp(row)">链接</a>
    </el-popover>

    <Qrcode
      v-if="handlerConfig && handlerConfig.qrCode"
      :goods-type="goodsType.type"
      :estate-path="qrCodePath"
      :item-no="scope.row.itemNo"
    ></Qrcode>

    <template v-if="handlerConfig && handlerConfig.del">
      <a href="javascript:;" v-if="!row.inActivity || row.inActivity < 0" @click="delGoods(row)">删除</a>
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-else-if="row.inActivity && row.inActivity > 0"
        content="该商品参加活动中，不允许删除!"
      >
        <a href="javascript:;" slot="reference">删除</a>
      </el-popover>
    </template>
  </div>
</template>

<script>
  import services from '@/dss-common/utils/services';
  import constants from '@/dss-wechat3rd/src/constants/index.js';
  import Qrcode from '@/dss-wechat3rd/src/components/qrcode';

  export default {
    props: ['row', 'col'],
    data: function () {
      return {
        slotHandler: this.col.slotHandler,
        handlerConfig: this.col.handlerConfig,
        goodsType: this.col.goodsType,
        update_item: this.col.update_item,
        manage_item: this.col.manage_item,
        qrCodePath: this.col.qrCodePath,
        addProductPath: this.col.addProductPath,
        qrCode: null,
        qrCodeLoading: true,

        minAppInfo: {
          path: '',
          name: '',
        },
      };
    },
    components: {
      Qrcode,
    },
    methods: {
      editGoods(row) {
        if (!this.update_item) {
          this.warnTip('请登录管理员账号使用此功能');
        } else {
          this.$router.push({
            path: this.addProductPath,
            query: {
              itemNo: row.itemNo,
              labelType: this.goodsType.value,
              isDisabledEdit: row.preSell || (row.inActivity && row.inActivity > 0 ? 1 : 0),
            },
          });
        }
      },
      // 删除商品
      delGoods(row) {
        this.$confirm('是否确认删除商品? ', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            if (row.inActivity && row.inActivity > 0) {
              return this.warnTip('该商品参加营销活动中，不允许删除!');
            }
            const params = { itemNo: row.itemNo, barcode: row.barcode, itemName: row.name };
            services
              .get(constants.Api.goods.del, {
                params,
                action: '删除商品',
              })
              .done(res => {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                });
                this.$emit('del');
                // this.listGoodsByType(); // 根据商品类型获取商品列表
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(() => {
            console.log('取消删除商品');
          });
      },

      shelfGoods(row) {
        if (!this.update_item) {
          this.warnTip('请登录管理员账号使用此功能');
        } else {
          const path = this.mGetPatchShelvesPath(this.goodsType.value);
          this.$router.push({
            path: path,
            query: { itemNo: row.itemNo, type: this.goodsType.value },
          });
        }
      },

      checkMinApp(row) {
        const maPath = this.qrCodePath;
        this.minAppInfo.path = maPath + '?itemNo=' + row.itemNo;
        this.minAppInfo.name = row.name;
      },
      warnTip(msg) {
        this.$message({
          message: msg,
          type: 'warning',
        });
      },
    },
  };
</script>
