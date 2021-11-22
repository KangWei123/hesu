<template>
  <div class="wd-image-editor" v-if="dataSource">
    <div class="com-title">
      <span>预售</span>
    </div>

    <div class="com-body">
      <size :dataSource="dataSource"></size>
      <div class="com-row">
        <span class="com-column">标题</span>
        <span class="nav-column">
          <el-input class="com-input" v-model="dataSource.textNavSource.title" placeholder></el-input>
        </span>
      </div>
    </div>
    <!--点击上传图片-->
    <div class="one-row-upload">
      <a class="dss-link" @click="visibleUpload=true">+添加图片</a>
      <div>建议尺寸750*100</div>
    </div>

    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />

    <!--已存在图片的预览-->
    <div class="image-container">
      <div class="img-preview1" v-for="(item,index) in dataSource.data" :key="index">
        <i class="com-close" @click="deteleImage(item)"></i>

        <div class="nav-row">
          <span class="nav-column">图片：</span>
          <div class="nav-column">
            <div class="img" :style="{'background-image': 'url(' + item.preSaleImg + ')'}"></div>
          </div>
        </div>

        <div class="nav-row">
          <span class="nav-column">链接：</span>
          <div class="nav-column info">
            <div class="link-page">
              <div>{{item.linkName}}</div>
            </div>
          </div>
        </div>
        <!-- <div class="nav-row"> -->
        <div class="nav-row" v-if="item.linkType && item.linkId">
          <span class="nav-column">对应{{item.tips}}：</span>
          <div class="nav-column">
            <div v-if="!!item.detailUrl">
              <div
                class="detail-image"
                :style="{'background': 'transparent url('+ item.detailUrl +') no-repeat center / cover'}"
              >
                <div class="delete" @click="deleteDetail(item)"></div>
              </div>
            </div>
            <div v-else-if="!!item.detailText">
              <div class="detail-image detail-text">
                {{item.detailText}}
                <div class="delete" @click="deleteDetail(item)"></div>
              </div>
            </div>
            <div class="dss-link1" v-else @click="chooseDetail(item.linkId,index)">选择{{item.tips}}</div>
          </div>
        </div>
      </div>
    </div>

    <select-dialog
      v-model="detailDialog"
      @choosed="onChooseGoods"
      :enableMultiple="false"
      :goods-type="detailType"
    ></select-dialog>
  </div>
</template>
<script>
// import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import size from './size.vue';
import './css/common.less';
import './css/imageModuleEdit.less';
import './css/select-detail.less';
import { mapState } from 'vuex';
import timesCardBg from '@/dss-wechat3rd/src/images/card/times-card.png';

export default {
  name: 'imageModuleEdit',
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  components: {
    MaterialsImage,
    selectDialog,
    size
  },

  data() {
    return {
      linkPage: {},

      visibleUpload: false,
      detailDialog: false,
      detailType: goodsTypeEnum.product,
      editIndex: 0,

      timerLimitShow: false //图片轮播图时间设定显示
    };
  },

  computed: {
    ...mapState({
      customPages: 'customPages',
      linkedPages: 'linkedPages',
      appFeatures: 'appFeatures'
    })
  },

  mounted() {
    this.linkPage = this.linkedPages.find(item => {
      return item.linkId === goodsTypeEnum.product.type;
    });
  },

  methods: {
    onCancelPickImage() {
      this.visibleUpload = false;
    },
    onSuccessPickedImage(src) {
      this.visibleUpload = false;
      const linkPage = this.$plain(this.linkPage);
      let obj = {
        linkPage: linkPage.index || linkPage.page,
        preSaleImg: src.imgUrl,
        linkName: '预售商品',
        linkType: linkPage.linkType || 0,
        linkId: linkPage.linkId,
        tips: linkPage.tips
      };
      this.dataSource.data.push(obj);
      this.detailType = goodsTypeEnum[linkPage.linkId];
    },

    //选择图片对应的链接地址
    choosePage(val) {
      let item = val.item;
      let page = val.page;
      item.linkName = page.name;
      item.linkPage = page.index || page.page;
      this.$set(item, 'linkType', page.linkType || 0);
      this.$set(item, 'linkId', page.linkId);
      this.$set(item, 'tips', page.tips);
      // 更新选择对应详情的dialog
      if (page.linkType) {
        this.detailType = goodsTypeEnum[page.linkId];
      }
    },

    // 删除图片对应链接
    deleteItemLinkPage(item) {
      item.linkPage = '';
      item.linkName = '';
      this.$set(item, 'detailUrl', null);
      this.$set(item, 'detailId', null);
      this.$set(item, 'linkType', null);
    },

    //点击选择图片对应的详情
    chooseDetail(id, index) {
      this.detailType = goodsTypeEnum[id];
      this.editIndex = index;
      this.detailDialog = true;
    },

    //图片选择对应的详情
    onChooseGoods(val) {
      const item = this.dataSource.data[this.editIndex];
      if (this.detailType.type === goodsTypeEnum.group.type) {
        this.$set(item, 'detailId', val.id);
        this.$set(item, 'itemNo', val.itemNo);
      } else if (this.detailType.type === goodsTypeEnum.haggle.type) {
        this.$set(item, 'detailId', val.id);
      } else {
        this.$set(item, 'detailId', val.itemNo);
      }
      this.$set(item, 'detailUrl', val.thumbnail);
      if (val.type === goodsTypeEnum.card.value) {
        this.$set(item, 'detailUrl', val.styleUrl || timesCardBg);
      }
      if (this.detailType.type === goodsTypeEnum.article.type) {
        this.$set(item, 'detailUrl', val.coverUrl);
        this.$set(item, 'detailId', val.id);
      }
      if (this.detailType.type === goodsTypeEnum.articleClassify.type) {
        this.$set(item, 'detailId', val.id);
        this.$set(item, 'detailText', val.categoryName);
      }
    },

    //删除图片对应的详情
    deleteDetail(item) {
      item.detailId = '';
      item.detailUrl = '';
      this.detailDialog = false;
    },

    // 删除图片
    deteleImage(val) {
      this.dataSource.data.slice().forEach((item, index) => {
        if (val == item) {
          this.dataSource.data.splice(index, 1);
        }
      });
    }
  }
};
</script>
