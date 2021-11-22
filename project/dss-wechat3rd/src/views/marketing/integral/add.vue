<template>
  <div class="integar-edit" v-loading="isLoading">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <template v-if="curStatus == integralActivityStatus.DELETE">
        <el-breadcrumb-item :to="{ path: '/marketing/integral/delete' }">删除的活动</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </template>
      <template v-else>
        <el-breadcrumb-item :to="{ path: '/marketing/integral/list' }">积分商城</el-breadcrumb-item>
        <el-breadcrumb-item>{{ !isEdit ? '添加' : '编辑' }}商品</el-breadcrumb-item>
      </template>
    </el-breadcrumb>

    <el-form
      :model="form"
      :rules="rules"
      :disabled="curStatus != integralActivityStatus.UNOPEN"
      label-width="150px"
      ref="elForm"
      class="integar-form"
    >
      <el-form-item label="选择商品：" prop="goods">
        <el-button v-if="!isEdit && !form.goods" @click="onShowGoods">选择商品 </el-button>
        <div
          v-else-if="!!form.goods"
          class="form-goods"
          @click="onShowGoods"
          :style="{ cursor: isEdit ? 'default' : 'pointer' }"
        >
          <div class="goods-name">{{ form.goods.itemName }}</div>
          <el-button
            class="btn-close"
            v-if="!isEdit"
            icon="el-icon-close"
            @click.stop="onRemoveGoods"
            circle
          ></el-button>
        </div>
      </el-form-item>

      <div v-for="(item, index) in form.itemList" :key="index">
        <div class="ladder-container">
          <el-form-item
            label="兑换价："
            v-if="skuCols.length > 0"
            :prop="'itemList.' + index + '.skuList'"
            :rules="[{ validator: reg.checkValidate }]"
          >
            <div class="sku-div">
              <el-table :data="item.skuList" size="mini" class="sku-table">
                <el-table-column
                  v-for="col in skuCols"
                  :key="col.skuId"
                  :prop="col.prop"
                  :label="col.label"
                  :label-class-name="col.type === 'input' ? 'not' : ''"
                  :width="col.type === 'input' ? 160 : 104"
                >
                  <template slot-scope="scope">
                    <div class="input-box" v-if="col.type === 'input'">
                      <el-input
                        :class="{ 'input-success': !scope.row.hasError }"
                        step="0.01"
                        v-model="scope.row[col.prop]"
                        :placeholder="col.placeholder"
                        maxlength="10"
                      />
                      <span class="unit" v-if="col.prop === 'exchangePrice'">元</span>
                      <span v-if="col.prop === 'exchangeIntegral'">分</span>
                    </div>
                    <span v-else-if="col.type === 'money'">{{ scope.row[col.prop] | price }}</span>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

          <template v-else v-for="(sku, skuIndex) in item.skuList">
            <el-form-item label="商品售价：" prop="salePrice" :key="'salePrice' + skuIndex">
              <div class="div-input">{{ sku.salePrice | price }}</div>
              元
            </el-form-item>

            <el-form-item
              label="可兑换数量："
              :prop="'itemList.' + index + '.skuList.' + skuIndex + '.exchangeNum'"
              :key="'exchangeNum' + skuIndex"
              :rules="[
                { required: true, message: '请输入兑换数量' },
                { pattern: reg.positiveInt.reg, message: reg.positiveInt.msg },
              ]"
            >
              <el-input v-model.number="sku.exchangeNum" maxlength="10" class="middle-width" />
              <div class="tip-msg"></div>
            </el-form-item>

            <el-form-item
              label="兑换价："
              :prop="'itemList.' + index + '.skuList.' + skuIndex + '.exchangePrice'"
              :key="'exchangePrice' + skuIndex"
              :rules="[
                { required: true, message: '请输入兑换价' },
                { pattern: reg.money.reg, message: reg.money.msg },
              ]"
            >
              <el-input v-model="sku.exchangePrice" maxlength="10" class="middle-width" /> 元
              <div class="tip-msg"></div>
            </el-form-item>

            <el-form-item
              label="兑换积分："
              :prop="'itemList.' + index + '.skuList.' + skuIndex + '.exchangeIntegral'"
              :key="'exchangeIntegral' + skuIndex"
              :rules="[
                { required: true, message: '请输入兑换积分' },
                { pattern: reg.positiveInt.reg, message: reg.positiveInt.msg },
              ]"
            >
              <el-input v-model.number="sku.exchangeIntegral" maxlength="10" class="middle-width" /> 分
              <div class="tip-msg"></div>
            </el-form-item>
          </template>
        </div>
      </div>

      <div v-if="form.goods" class="tip-msg" style="margin: 0 0 20px 150px">请确认库存后填写兑换数量</div>

      <el-form-item label="活动有效期：" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="datetimerange"
          :picker-options="options"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="排序：" prop="sequence">
        <el-input v-model.number="form.sequence" maxlength="10" class="middle-width" />
        <div class="tip-msg">数字大的排序靠前，数字重复则新增商品靠前</div>
      </el-form-item>

      <el-form-item label="兑换限制：" prop="exchangeRestrict">
        <el-input v-model.number="form.exchangeRestrict" maxlength="10" class="middle-width" /> 件/人
        <div class="tip-msg">注：填写为“0”时不限购</div>
      </el-form-item>
      <div class="bottom-button">
        <el-button @click="onCancle">
          {{ curStatus == integralActivityStatus.UNOPEN ? '取消' : '关闭' }}
        </el-button>
        <el-button v-if="curStatus == integralActivityStatus.UNOPEN" type="primary" @click="onSave"> 保存 </el-button>
      </div>
    </el-form>

    <goods-select-dialog
      v-model="dialog.goods"
      filter-offline
      show-goods-type-tab
      @single-choosed="onSelectIntegralGoods"
    />
  </div>
</template>

<script>
  // eslint-disable-next-line import/extensions
  import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
  import api from '@/dss-wechat3rd/src/constants';
  import integralApi from '@/dss-wechat3rd/src/api/integral';
  import { integralActivityStatus } from '@/dss-wechat3rd/src/constants/enum';
  import regexps from '@/dss-common/utils/regexps';
  import utilDate from '@/dss-common/utils/date';

  // 将价格转换成分
  const convert = {
    salePrice: v => v * 100,
    itemList(v, form) {
      if (!v || v.length === 0) {
        return '';
      }
      let list = [];
      v.forEach(item => {
        list = list.concat(
          item.skuList.map(sku => {
            const skuParam = {
              itemNo: sku.itemNo,
              barCode: sku.barCode,
              exchangePrice: Math.round(sku.exchangePrice * 100),
              exchangeNum: parseInt(sku.exchangeNum),
              exchangeIntegral: parseInt(sku.exchangeIntegral),
              skuId: sku.skuId,
              paidNum: 0,
            };
            return skuParam;
          })
        );
      });
      return list;
    },
    goods: v => null,
  };

  export default {
    components: {
      GoodsSelectDialog,
    },
    computed: {
      isEdit() {
        return !!this.id;
      },
    },
    mounted() {
      const id = this.$route.query.id;
      if (!id) {
        return;
      }
      this.id = id;
      this.curStatus = this.$route.query.status;
      this.getDetail(id, this.$route.query.itemNo);
    },
    data() {
      // 正则常量中的规则
      const { money, positiveInt } = regexps;

      const checkValidate = (rule, value, callback) => {
        let msg = null;
        value.forEach(v => {
          if (!money.reg.test(v.exchangePrice + '')) {
            v.hasError = true;
            msg = money.msg;
          }
          if (!positiveInt.reg.test(v.exchangeNum + '')) {
            v.hasError = true;
            msg = positiveInt.msg;
          }
          if (!positiveInt.reg.test(v.exchangeIntegral + '')) {
            v.hasError = true;
            msg = positiveInt.msg;
          }
          if (v.exchangePrice > v.salePrice / 100) {
            v.hasError = true;
            msg = '兑换价不能大于售价';
          }
          v.hasError = false;
        });
        if (msg) {
          return callback(msg);
        }
        return callback();
      };

      return {
        id: null,
        integralActivityStatus,
        curStatus: 0,
        form: {
          goods: null,
          dateRange: [],
          itemList: [],
          sequence: '',
          exchangeRestrict: 0,
          status: 0, // 活动状态
        },
        skuCols: [], // 规格动态列表
        hasSku: false, // 是否有规格，卡项无规格
        rules: {
          goods: {
            required: true,
            message: '请选择商品',
          },
          dateRange: [
            {
              type: 'array',
              required: true,
              message: '请选择活动时间',
            },
            {
              validator(_, value, callbacck) {
                const now = Date.now();
                if (value?.some(date => date.getTime() < now)) {
                  return callbacck(new Error('活动有效期只能选择现在及未来的时间'));
                }

                callbacck();
              },
            },
          ],
          sequence: [
            {
              pattern: regexps.positiveInt.reg,
              message: regexps.positiveInt.msg,
              trigger: 'blur',
            },
          ],
          exchangeRestrict: [
            { required: true, message: '兑换限制不能为空' },
            {
              pattern: regexps.intWithZero.reg,
              message: regexps.intWithZero.msg,
              trigger: 'blur',
            },
          ],
        },
        reg: {
          positiveInt,
          money,
          checkValidate,
        },
        dialog: {
          goods: false,
        },
        isLoading: false,
        options: {
          shortcuts: [
            {
              text: '未来一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '未来一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '未来三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
          disabledDate(date) {
            return date.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          },
        },
      };
    },
    methods: {
      getDetail(id, itemNo) {
        const params = {
          id: id,
          itemNo: itemNo,
        };
        integralApi.detail(params).then(res => {
          this.isLoading = true;
          if (res.data === null) {
            // 请求后端成功，但返回data为空（data为空，id有可能是乱填的），把id置为null
            this.id = null;
            this.$router.push('/marketing/integral/add');
            return;
          }
          this.setFormData(res.data || {});
        });
      },
      // 填充表单数据
      setFormData(data) {
        for (const key in this.form) {
          if (key === 'dateRange') {
            if (data.startTime && data.endTime) {
              this.form.dateRange = [new Date(data.startTime), new Date(data.endTime)];
            }
            continue;
          }
          this.form[key] = data[key];
        }

        this.setSkuList(data);
      },
      onShowGoods() {
        if (this.isEdit) {
          return;
        }
        this.dialog.goods = true;
      },
      // 删除选中商品
      onRemoveGoods() {
        this.form.goods = null;
        this.form.itemList = [];
      },
      // 设置规格信息
      setSkuList(data) {
        api.goods
          .detail(data.itemNo)
          .done(res => {
            // 商品基础信息
            const baseItem = res.data.wxItem;
            // 商品规格信息
            const skuInfoList = res.data.skuInfoList || [];

            const skuCols = [];
            const productInfo = {
              itemName: baseItem.name,
              itemNo: baseItem.itemNo,
              itemThumbnail: baseItem.thumbnail,
            };

            // 处理有规格的情况
            if (skuInfoList && skuInfoList.length) {
              const list = [];
              this.$plain(skuInfoList).forEach((sku, index) => {
                let obj = {};
                // 过滤禁用sku
                if (!sku.notOptional) {
                  obj = {
                    skuId: sku.skuId,
                    itemNo: sku.itemNo,
                    salePrice: sku.salePrice,
                    barCode: sku.skuBarcode,
                    notOptional: sku.notOptional,
                  };

                  // 判断是否为编辑活动，以便添加秒杀价渲染页面
                  if (this.isEdit) {
                    obj.exchangePrice = data.itemList[index].exchangePrice /= 100;
                    obj.exchangeNum = data.itemList[index].exchangeNum;
                    obj.exchangeIntegral = data.itemList[index].exchangeIntegral;
                  }

                  list.push(obj);
                }

                sku.skuInfoNames.forEach((item, itemIndex) => {
                  // 设置表格内容
                  const key = `dy_prop_${itemIndex}`;
                  obj[key] = item.valName;
                  if (index === 0) {
                    skuCols.push({
                      label: item.keyName,
                      prop: key,
                    });
                  }
                });
              });

              productInfo.skuInfoList = list;
            } else {
              // 处理没有规格的情况
              productInfo.skuInfoList = [
                {
                  // skuId: null,
                  itemNo: data.itemNo,
                  salePrice: baseItem.salePrice,
                  barCode: data.barcode || data.itemList[0].barCode,
                },
              ];

              // 判断是否为编辑活动，以便添加秒杀价渲染页面
              if (this.isEdit) {
                productInfo.skuInfoList[0].exchangePrice = data.itemList[0].exchangePrice /= 100;
                productInfo.skuInfoList[0].exchangeNum = data.itemList[0].exchangeNum;
                productInfo.skuInfoList[0].exchangeIntegral = data.itemList[0].exchangeIntegral;
              }
            }

            this.form.goods = productInfo;

            // 规格处理
            const skuList = productInfo.skuInfoList.map(sku => {
              const ptSku = { hasError: false };
              for (const key in sku) {
                ptSku[key] = sku[key];
              }
              return ptSku;
            });

            this.form.itemList = [{ skuList: skuList }];

            if (skuCols.length > 0) {
              skuCols.push(
                {
                  label: '商品售价',
                  prop: 'salePrice',
                  type: 'money',
                },
                {
                  label: '可兑换数量',
                  prop: 'exchangeNum',
                  type: 'input',
                  placeholder: '请输入整数',
                },
                {
                  label: '兑换价',
                  prop: 'exchangePrice',
                  type: 'input',
                  placeholder: '请输入小数',
                },
                {
                  label: '兑换积分',
                  prop: 'exchangeIntegral',
                  type: 'input',
                  placeholder: '请输入整数',
                }
              );
            }
            this.skuCols = skuCols;
          })
          .always(() => {
            this.isLoading = false;
          });
      },
      onSelectIntegralGoods(row) {
        this.isLoading = true;
        // 设置规格List
        this.setSkuList(row);
      },
      setGoodsInfo(data) {
        this.form.itemName = data.name || '';
        this.form.itemNo = data.itemNo || '';
        this.form.itemThumbnail = data.thumbnail || '';
      },
      toParam() {
        const params = {};
        for (const key in this.form) {
          if (convert[key]) {
            const value = convert[key](this.form[key], this.form);
            if (value !== null) {
              params[key] = value;
            }
            continue;
          }
          params[key] = this.form[key];
        }

        params.itemNo = this.form.goods.itemNo || null;
        params.itemName = this.form.goods.itemName || null;
        params.itemThumbnail = this.form.goods.itemThumbnail || null;

        const timemat = 'YYYY-MM-DD HH:mm:ss';
        params.startTime = utilDate.format(this.form.dateRange[0], timemat);
        params.endTime = utilDate.format(this.form.dateRange[1], timemat);
        delete params.dateRange;

        return params;
      },
      handleSubmit() {
        const params = this.toParam();

        let methodProp = 'add';
        if (this.isEdit) {
          params.id = this.id;
          methodProp = 'update';
        }
        this.isLoading = true;

        integralApi[methodProp](params)
          .done(res => {
            this.$message({
              message: this.isEdit ? '修改成功' : '创建成功。',
              type: 'success',
            });
            this.$router.push('/marketing/integral/list');
          })
          .always(() => {
            this.isLoading = false;
          });
      },
      onSave() {
        // todo 校验
        this.$refs.elForm.validate(valid => {
          if (!valid) {
            return;
          }
          this.handleSubmit();
        });
      },
      onCancle() {
        this.$router.push('/marketing/integral/list');
      },
    },
  };
</script>

<style lang="less">
  @import './index.less';
  .integar-edit .wkt-body .el-table .el-input__inner,
  .wkb-market .el-table .el-input__inner {
    width: 96%;
  }
</style>
