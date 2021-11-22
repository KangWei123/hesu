<template>
  <div class="mgr-edit-form"
       v-loading="loading">
    <el-form class="edit-form"
             :model="form"
             ref="form"
             :rules="rules"
             label-width="100px"
             :disabled="abandonGift">
      <el-form-item label="赠品名称："
                    prop="name">
        <el-input v-model="form.name"
                  class="form-input-w366"
                  placeholder="请输入赠品名称"></el-input>
      </el-form-item>

      <el-form-item label="条形码："
                    prop="barcode">
        <el-input v-model="form.barcode"
                  :disabled="isEdit"
                  placeholder="拉取商品时条码不可编辑"
                  class="form-input-w366"></el-input>
        <div class="notes">*自定义条形码提交后不可修改，请谨慎填写（注:该项不填写时，系统会自动生成）</div>
      </el-form-item>

      <!-- 单位 -->
      <el-form-item label="单位:"
                    class="goods-label"
                    prop="unit">
        <el-input placeholder="请输入单位"
                  class="goods-price primary-inputHeight"
                  v-model="form.unit"></el-input>
      </el-form-item>

      <!-- 产品类型设置 -->

      <!-- 重量 -->
      <el-form-item label="重量:"
                    class="goods-label"
                    prop="weight">
        <el-input placeholder="请输入商品重量"
                  class="goods-price primary-inputHeight"
                  v-model="form.weight"></el-input>
        <span class="goods-unit">克</span>
      </el-form-item>

      <!-- 保质期 -->
      <el-form-item label="保质期:"
                    class="goods-label"
                    prop="shelfLife">
        <el-input placeholder="请输入保质期"
                  class="goods-price primary-inputHeight"
                  v-model="form.shelfLife"></el-input>
        <el-select v-model="form.shelfLifeUnit"
                   size="mini"
                   placeholder="请选择"
                   class="shelf-life-unit-select">
          <el-option v-for="item in shelfLifeUnitOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <!-- 产地 -->
      <el-form-item label="产地:"
                    class="goods-label"
                    prop="placeOfOrigin">
        <el-input placeholder="请输入商品产地"
                  class="goods-price primary-inputHeight"
                  v-model="form.placeOfOrigin"></el-input>
      </el-form-item>

      <!-- 品牌 -->
      <el-form-item label="品牌:"
                    class="goods-label"
                    prop="brand">
        <el-input placeholder="请输入品牌名称"
                  class="goods-price primary-inputHeight"
                  v-model="form.brand"></el-input>
      </el-form-item>

      <!-- 虚拟兑换量-->
      <el-form-item label="虚拟兑换量:"
                    class="goods-label"
                    prop="virtualSalesVolume">
        <el-input placeholder="请输入虚拟兑换量"
                  class="goods-price primary-inputHeight"
                  v-model="form.virtualSalesVolume"></el-input>
      </el-form-item>

      <el-form-item prop="images"
                    label="商品图片："
                    :style="abandonGift ? 'pointer-events: none;' : ''">
        <choose-images v-model="form.images[index]"
                       :is-disabled-edit="abandonGift"
                       :height="176"
                       style="margin-right: 10px;"
                       @input="onImageAdd(index)"
                       @delete="onDeleteImg(index)"
                       v-for="(item, index) in form.images"
                       :key="index"
                       :limit='limit'
                       :multiple='!form.images[index].imgUrl'
                       :disable='index<5'></choose-images>
        <div class="form-tips">上传图片的最佳尺寸：640像素*640像素，其他尺寸会影响页效果，格式png，jpeg，jpg，gif。大小不超过2M，赠品图片一共可以上传5张，默认第一张为主图封面
        </div>
      </el-form-item>

      <el-form-item prop="describe"
                    label="商品描述：">
        <w-editor style="margin-bottom: -3px"
                  :key="editorKey"
                  :image-limit="30"
                  :dataSource="form"></w-editor>
      </el-form-item>

      <!--运费-->
      <el-form-item label="运费设置:"
                    class="goods-label"
                    :rules="rules.freightTemplateId"
                    prop="freightTemplateId">
        <div>请设置固定运费或者选择一个运费模板</div>

        <div>
          <span class="freight-label">固定运费: </span>
          <el-input placeholder="请输入运费"
                    class="goods-price primary-inputHeight"
                    :disabled="abandonGift||!!isDisabledEdit"
                    v-model="form.freight"
                    @change="onFreightChange"></el-input>
          <span class="goods-unit">元</span>
        </div>

        <div style="margin-top: 10px">
          <span class="freight-label">运费模板: </span>
          <el-select size="mini"
                     style="width: 166px"
                     clearable
                     :disabled="abandonGift||!!isDisabledEdit"
                     v-model="form.freightTemplateId"
                     placeholder="请选择运费模板">
            <el-option v-for="tpl in freightTplList"
                       :key="tpl.id"
                       :label="tpl.name"
                       :value="tpl.id"></el-option>
          </el-select>
          <tpl-area-table :tpl="freightTpl"></tpl-area-table>
        </div>
      </el-form-item>

      <!-- 保存按钮 -->
      <div class="bottom-button">
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
      </div>
    </el-form> 
    </div>
  </div>
</template>

<script>
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import regex from '@/dss-wechat3rd/src/constants/regex';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
import moneyUtil from '@/dss-common/utils/money';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import wxFreightTplApi from '@/dss-wechat3rd/src/api/wx-freight-tpl-api.js';
import TplAreaTable from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-area-table.vue';
const shelfLifeUnitOptions = [
  { value: 0, label: '小时' },
  { value: 1, label: '天' },
  { value: 2, label: '月' },
  { value: 3, label: '年' }
];
export default {
  components: {
    ChooseImages,
    WEditor,
    TplAreaTable
  },
  data() {
    const imageValidator = (rule, value, callback) => {
      if (!value[0].imgUrl) {
        callback('请选择至少一张图片');
      } else {
        callback();
      }
    };

    const freightValidator = (rule, value, callback) => {
      if (this.form.freight && !regex.price.reg.test(this.form.freight)) {
        callback(Error(regex.price.msg));
      } else {
        callback();
      }
    };

    return {
      giftNo: this.$route.query.giftNo,
      isDisabledEdit: this.$route.query.isDisabledEdit,
      shelfLifeUnitOptions,
      isEdit: false,
      loading: false,
      freightTplList: [],
      loading: false,
      freightTpl: null,
      editorKey: 0,
      limit: 5,
      goodsTypeEnum,
      form: {
        name: '',
        barcode: null,
        type: null,
        weight: null,
        placeOfOrigin: null,
        brand: null,
        virtualSalesVolume: null,
        unit: null,
        shelfLife: null,
        shelfLifeUnit: 0,
        //图片对象数组
        images: [{}],
        materialUrls: [],
        describe: '',
        freight: null,
        freightTemplateId: null
      },
      rules: {
        name: [
          { required: true, message: '请输入赠品名称', trigger: 'blur' },
          { min: 2, max: 80, message: '长度在 2 到 80 个字符', trigger: 'blur' }
        ],
        shelfLife: [
          {
            validator: regex.goods.checkShelfLife,
            trigger: 'blur'
          }
        ],
        placeOfOrigin: [{ max: 20, message: '长度最大20 个字符', trigger: 'blur' }],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          { max: 20, message: '长度最大20 个字符', trigger: 'blur' }
        ],
        weight: [
          {
            validator: regex.goods.checkWeight,
            trigger: 'blur'
          }
        ],
        brand: [{ max: 20, message: '长度最大20 个字符', trigger: 'blur' }],
        placeOfOrigin: [{ max: 20, message: '长度最大20 个字符', trigger: 'blur' }],
        images: [
          {
            required: true,
            validator: imageValidator,
            trigger: 'change'
          }
        ],
        barcode: [
          {
            pattern: regexps.charAndNum.reg,
            message: regexps.charAndNum.msg,
            trigger: 'blur'
          }
        ],

        freightTemplateId: [
          {
            validator: freightValidator.bind(this),
            trigger: 'change'
          }
        ]
      }
    };
  },

  computed: {
    // 是否废弃赠品
    abandonGift() {
      if (this.$route.query.status == 0) {
        return true;
      }
      return false;
    }
  },

  watch: {
    // 监听运费模板
    'form.freightTemplateId': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.freightTpl = this.freightTplList.find(tpl => {
            return tpl.id === newVal;
          });
        } else {
          this.freightTpl = null;
        }
      }
    },
    freightTplList: {
      handler(newVal, oldVal) {
        this.freightTpl = this.freightTplList.find(tpl => {
          return tpl.id === this.form.freightTemplateId;
        });
      }
    }
  },

  mounted() {
    //设置管理的类型
    this.form.type = this.goodsTypeEnum.gift.value;
    this.isEdit = !!this.$route.query.giftNo ? true : false;
    this.getFreightTplList();
    //是修改，则获取商品详情
    if (!!this.giftNo) {
      this.getRoomsDetail();
    }
  },

  methods: {
    getFreightTplList() {
      this.loading = true;
      const params = {
        pageNo: 1,
        pageSize: 1000
      };
      wxFreightTplApi
        .getTplList(params)
        .done(res => {
          this.freightTplList = res.data || [];
        })
        .always(() => {
          this.loading = false;
        });
    },

    getRoomsDetail() {
      let params = { giftNo: this.giftNo };
      this.loading = true;
      let key = this.abandonGift ? 'getAbandonGiftInfo' : 'getGiftInfo';
      giftApi[key](params)
        .done(res => {
          this.form = Object.assign(this.form, res.data);
          // 传入详情数据时，editor重新渲染
          this.editorKey++;
          //图片链接字符串数组转换为图片对象数组
          res.data.materialUrls.forEach((item, index) => {
            this.form.images.splice(index, 0, {
              imgUrl: item
            });
            this.convertMoneyUnit(this.form, true);
          });
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 钱的单位转换 ,服务端返回的为分， 交互展示的为元
     * @param itemDetailDTO
     * @param isFromServer 是否转换服务端返回的数据，否则转换页面提交服务的数据
     */
    convertMoneyUnit(form, isFromServer) {
      if (!form) {
        return;
      }
      //转换函数
      let convert = isFromServer
        ? v => {
            return moneyUtil.convertHundredMoneyUnit(v, true);
          }
        : v => {
            return moneyUtil.convertHundredMoneyUnit(v, false);
          };
      form.freight = convert(form.freight);
    },

    // 变更运费模板，手动触发验证
    onFreightChange() {
      this.$refs.form.validateField('freightTemplateId');
    },

    onSubmit(ref) {
      this.$refs[ref].validate(valid => {
        if (!valid) return;
        //图片对象数组转换为图片链接字符串数组
        this.form.materialUrls = [];
        this.form.images.forEach(item => {
          if (item.imgUrl) {
            this.form.materialUrls.push(item.imgUrl);
          }
        });
        let params = {
          ...this.form
        };
        this.convertMoneyUnit(params, false);
        this.limit = 5 - this.form.images.length;
        delete params.images;
        delete params.itemNo;
        this.loading = true;
        let key = this.isEdit ? 'updateGift' : 'addGift';
        if (this.isEdit) {
          params.giftNo = this.giftNo;
        }

        giftApi[key](params)
          .done(res => {
            this.$router.push('/retail/goods-mgr/gift-mgr/list');
          })
          .always(() => {
            this.loading = false;
          });
      });
    },

    onImageAdd(index) {
      //多选返回的是图片数组，遍历数组
      if (index === this.form.images.length - 1) {
        const deletedUrl = this.form.images.splice(index, 1);
        deletedUrl[0].forEach(item => {
          if (this.form.images.length < 5) {
            this.form.images.push(item);
          }
        });
        index = this.form.images.length - 1;
      }
      if (index === this.form.images.length - 1) {
        this.form.images.push({});
      }
      this.getLimit();
    },

    getLimit() {
      this.limit = 5 - this.form.images.length + 1;
    },

    onDeleteImg(index) {
      this.form.images.splice(index, 1);
      this.getLimit();
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';

.mgr-edit-form:after {
  content: '';
  height: 60px;
  display: block;
}
.mgr-edit-form {
  background: #fff;
  padding: 20px 20px 0;
  margin-bottom: 28px;
  overflow: hidden;

  .notes {
    line-height: 25px;
    font-size: 12px;
    color: #999;
  }

  .mgr-slot {
    border-bottom: 1px solid @border-color;
    padding-bottom: 20px;
    margin-bottom: 20px;

    .slot-title {
      display: inline-block;
      width: 90px;
      text-align: right;
    }
  }

  .edit-form {
    .form-input-w366 {
      width: 366px;
    }

    .form-input-w188 {
      width: 188px;
    }

    .form-input-w50 {
      width: 50px;
    }
    .goods-price {
      width: 166px;
    }
  }

  .form-unit {
    width: 40px;
    display: inline-block;
    text-align: right;
  }

  .form-tips {
    color: @light-black-color;
  }

  // .bottom-button {
  //   margin-left: -40px !important;
  //   width: 100% !important;
  //   button {
  //     margin-left: -40px !important;
  //   }
  // }
}
</style>
