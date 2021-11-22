<template>
  <div class="mgr-edit-form" v-loading="loading">
    <el-form class="edit-form" :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="户型名称：" prop="name">
        <el-input v-model="form.name" class="form-input-w366" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="建筑面积：" prop="buildArea">
        <el-input v-model="form.buildArea" class="form-input-w366" placeholder=""></el-input>
        <span class="form-unit">/m<sup>2</sup></span>
      </el-form-item>

      <el-form-item label="套内面积：" prop="internalArea">
        <el-input v-model="form.internalArea" class="form-input-w366" placeholder=""></el-input>
        <span class="form-unit">/m<sup>2</sup></span>
      </el-form-item>

      <el-form-item label="参考总价：" prop="referencePrice" :rules="rules.referencePrice">
        <el-input v-model="form.referencePrice" :disabled="isDisabledEdit" class="form-input-w366"></el-input>
        <span class="form-unit">万元</span>
      </el-form-item>

      <!-- 标签 -->
      <el-form-item label="标签：" class="goods-label">
        <goods-label-select
          class="form-input-w366 primary-inputHeight"
          :select-label-id="form.labelIds"
          :labelType="goodsTypeEnum.layout.value"
          ref="labelCascader"
          multiple
          @selectedLabelId="selectedLabelId"
        />
        <el-button type="text" round @click="addLabelPopup()">快速增加标签</el-button>
      </el-form-item>

      <el-form-item label="亮点：" prop="strengths">
        <el-input v-model="form.strengths" class="form-input-w366" placeholder=""></el-input>
      </el-form-item>

      <el-form-item
        prop="thumbnail"
        label="户型主图："
        :style="$route.query.status == 0 ? 'pointer-events: none;' : ''"
      >
        <choose-images
          v-model="form.thumbnail[index]"
          :is-disabled-edit="isDisabledEdit"
          :height="176"
          style="margin-right: 10px;"
          @input="onImageAdd(index)"
          @delete="onDeleteImg(index)"
          v-for="(item, index) in form.thumbnail"
          :key="index"
          :limit="limit"
          :multiple="!form.thumbnail[index].imgUrl"
          :disable="index < 5"
        ></choose-images>
        <div class="form-tips">
          上传图片的最佳尺寸：640像素*640像素，其他尺寸会影响页效果，格式png，jpeg，jpg，gif。大小不超过2M，户型图片一共可以上传5张，默认第一张为主图封面
        </div>
      </el-form-item>

      <el-form-item label="VR展示：" prop="vrUrl">
        <el-input v-model="form.vrUrl" class="form-input-w366" placeholder=""></el-input>
      </el-form-item>

      <el-form-item prop="detail" label="户型描述：">
        <w-editor style="margin-bottom: -3px" paramName="detail" :key="editorKey" :dataSource="form"></w-editor>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 增加或修改标签的对话弹框 -->
    <goods-label-dialog
      v-if="showEditLabelPopup"
      :visible.sync="showEditLabelPopup"
      :edit-title="editTitle"
      :label-edit-obj="labelEditObj"
      @refresh-data="refreshData"
    ></goods-label-dialog>
  </div>
</template>

<script>
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import urlList from '@/dss-wechat3rd/src/constants/index';
import layoutApi from '@/dss-wechat3rd/src/api/estate/layout.js';
import moneyUtil from '@/dss-common/utils/money';
import GoodsLabelSelect from '@/dss-wechat3rd/src/bz_components/goods-label-select/index.vue';
import goodsLabelDialog from '@/dss-wechat3rd/src/bz_components/goods-label-dialog/index.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
export default {
  props: {
    //商品id
    itemNo: {
      type: String
    },
    // 是否不允许编辑敏感信息
    isDisabledEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ChooseImages,
    WEditor,
    goodsLabelDialog,
    GoodsLabelSelect
  },
  data() {
    //1-60整数验证
    const littleIntNumValidator = (rule, value, callback) => {
      if (!this.sixtydays.reg.test(value)) {
        callback('数值范围在1~999的整数');
      } else {
        callback();
      }
    };
    //价格验证
    const priceValidator = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!regexps.money.reg.test(value)) {
        callback(regexps.money.msg);
      } else {
        callback();
      }
    };
    const imageValidator = (rule, value, callback) => {
      if (!value[0].imgUrl) {
        callback('请选择至少一张图片');
      } else {
        callback();
      }
    };
    return {
      estateItemNo: this.$route.query.estateItemNo,
      goodsTypeEnum,
      sixtydays: {
        reg: /^[1-9][0-9]{0,2}$/
      },
      loading: false,
      editorKey: 0,
      limit: 5,
      showEditLabelPopup: false, //是否显示编辑标签弹框
      editTitle: '', //编辑标签弹框标题
      labelEditObj: { labelType: goodsTypeEnum.layout.value }, //用于传给子组件的新增的标签对象
      labelSelectedObj: { labelType: goodsTypeEnum.layout.value }, //用于传给子组件的选中的标签对象
      form: {
        name: '',
        referencePrice: '',
        buildArea: '',
        internalArea: '',
        //图片对象数组
        thumbnail: [{}],
        materialUrls: [],
        detail: '',
        labelIds: [],
        strengths: '',
        vrUrl: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入户型名称', trigger: 'blur' },
          { min: 2, max: 80, message: '长度在 2 到 80 个字符', trigger: 'blur' }
        ],
        buildArea: [{ required: true, message: '请输入建筑面积', trigger: 'blur' }],
        internalArea: [{ required: true, message: '请输入套内面积', trigger: 'blur' }],
        strengths: [{ required: true, message: '请输入亮点', trigger: 'blur' }],
        referencePrice: [
          { required: true, message: '请输入参考总价', trigger: 'blur' },
          { validator: priceValidator, trigger: 'blur' }
        ],
        thumbnail: [{ required: true, validator: imageValidator, trigger: 'change' }]
      }
    };
  },
  mounted() {
    //是修改，则获取商品详情
    if (!!this.itemNo) {
      this.getRoomsDetail();
    }
  },
  methods: {
    //选中的标签
    selectedLabelId(labelIds) {
      console.log(labelIds);
      this.form.labelIds = labelIds;
    },

    //打开快速增加标签弹窗
    addLabelPopup() {
      this.showEditLabelPopup = true;
      this.editTitle = '快速增加标签';
    },

    //监控子组件发射回来的方法，以便于新增标签之后刷新数据
    refreshData(data) {
      //将获取到的选中的标签对象赋值
      this.labelSelectedObj = {
        labelId: data.labelId,
        labelName: data.labelName,
        labelType: this.goodsTypeEnum.layout.value
      };
      this.$refs.labelCascader.labelList(); //父组件通知标签列表组件刷新数据
    },

    getRoomsDetail() {
      let params = { itemNo: this.itemNo, status: this.$route.query.status };
      this.loading = true;
      layoutApi
        .detail(params)
        .done(res => {
          this.convertMoneyUnit(res.data, true);
          this.form = Object.assign(this.form, res.data);

          // 传入详情数据时，editor重新渲染
          this.editorKey++;
          let thumbnail = [];
          //图片链接字符串数组转换为图片对象数组
          res.data.materialUrls.forEach((item, index) => {
            thumbnail.push({ imgUrl: item });
          });
          thumbnail.push({});
          this.form.thumbnail = thumbnail;
          this.getLimit();

          if (res.data.labelIds) {
            this.form.labelIds = res.data.labelIds.split(',').map(id => {
              return parseInt(id);
            });
          } else {
            this.form.labelIds = [];
          }

          //价格缩一百
          // this.form.salePrice = moneyUtil.convertHundredMoneyUnit(this.form.salePrice, true);
        })
        .always(() => {
          this.loading = false;
        });
    },

    onSubmit(ref) {
      this.$refs[ref].validate(valid => {
        if (!valid) return;
        //图片对象数组转换为图片链接字符串数组
        this.form.materialUrls = [];
        this.form.thumbnail.forEach(item => {
          if (item.imgUrl) {
            this.form.materialUrls.push(item.imgUrl);
          }
        });
        this.limit = 5 - this.form.thumbnail.length;
        let key = !!this.itemNo ? 'update' : 'add';
        let params = {
          ...this.form,
          estateItemNo: this.estateItemNo
        };
        delete params.thumbnail;

        //标签id
        if (this.form.labelIds && this.form.labelIds.length) {
          params.labelIds = this.form.labelIds.join(',');
        } else {
          params.labelIds = '';
        }
        this.convertMoneyUnit(params, false);
        //parseInt防止小数相乘失精
        // params.wxItem.salePrice = moneyUtil.convertHundredMoneyUnit(params.wxItem.salePrice, false);
        this.loading = true;
        layoutApi[key](params)
          .done(res => {
            this.$router.push({
              path: '/estate/goods-mgr/building/list/layout/list',
              query: { estateItemNo: this.estateItemNo }
            });
          })
          .always(() => {
            this.loading = false;
          });
      });
    },

    /**
     * 钱的单位转换 ,服务端返回的为分， 交互展示的为元
     * @param itemDetailDTO
     * @param isFromServer 是否转换服务端返回的数据，否则转换页面提交服务的数据
     */
    convertMoneyUnit(itemDetailDTO, isFromServer) {
      if (!itemDetailDTO) {
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
      //salePrice:售价 , freight: 运费
      if (!!itemDetailDTO) {
        itemDetailDTO.referencePrice = convert(itemDetailDTO.referencePrice);
      }
    },

    onImageAdd(index) {
      //多选返回的是图片数组，遍历数组
      if (index === this.form.thumbnail.length - 1) {
        const deletedUrl = this.form.thumbnail.splice(index, 1);
        deletedUrl[0].forEach(item => {
          if (this.form.thumbnail.length < 5) {
            this.form.thumbnail.push(item);
          }
        });
        index = this.form.thumbnail.length - 1;
      }
      if (index === this.form.thumbnail.length - 1) {
        this.form.thumbnail.push({});
      }
      this.getLimit();
    },

    getLimit() {
      this.limit = 5 - this.form.thumbnail.length + 1;
    },

    onDeleteImg(index) {
      this.form.thumbnail.splice(index, 1);
      this.getLimit();
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';

.mgr-edit-form {
  padding: 20px 20px 0;
  overflow: hidden;

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
  }

  .form-unit {
    width: 40px;
    display: inline-block;
    text-align: right;
  }

  .form-tips {
    color: @light-black-color;
  }
}
</style>
