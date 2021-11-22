<template>
  <div>
    <edit-header :data-source="dataSource" name="幸运转盘"></edit-header>

    <div class="com-body">
      <decorate-size :data-source="dataSource"></decorate-size>
      <div class="com-row">
        <span class="com-column">幸运转盘：</span>
        <span class="com-column">
          <template v-if="!dataSource.data.id">
            <span class="com-upload-button" @click="showDialog=true">
              <i class="el-icon-plus"></i>
              请选择活动
            </span>
          </template>

          <template v-else>
            <div style="display: flex; align-items: center;">
              <el-tag
                size="medium"
                style="margin-top: 0"
                @close="deleteTag"
                closable
              >{{dataSource.data.name}}</el-tag>
              <div class="select" @click="onReSelect">修改</div>
            </div>
            

            <!-- <div class="lucky-button"> -->
              <!-- <img :src="luckyLayoutImg" style="width:100%;" /> -->
              
            <!-- </div> -->
          </template>
        </span>
      </div>
      <materials-image-field label="活动图片" :img.sync="luckyLayoutImg" />
    </div>
    <select-dialog
      v-model="showDialog"
      @choosed="onChoose"
      title="选择幸运转盘"
      :enable-multiple="false"
      :goods-type="type"
      :filter-list="filterList"
      :is-area-manger="isAreaManger"
      :show-label="false"
    ></select-dialog>
  </div>
</template>

<script>
import './css/common.less';
import commonEdit from './commonEdit.vue';
import DecorateSize from './size.vue';
import MaterialsImageField from './materials-image-field';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
import service from "../../api";
import { mapState } from 'vuex';
import EditHeader from './edit-header.vue';

export default {
  name: 'LuckyModuleEdit',
  components: {
    commonEdit,
    DecorateSize,
    MaterialsImageField,
    selectDialog,
    MaterialsImage,
    EditHeader
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showDialog: false,
      // 选择转盘活动图片相关
      showChooseImageDialog: false,
      type: goodsTypeEnum.lucky,
      luckyLayoutImg: process.env.VUE_APP_CDN_URL + '/resources/dss-web-portal/cdn/wxma/lucky-dial/luck-dial.jpg',
      filterList: [
        {
          type: 'select', // 选择器类型
          paramName: 'activityLevel',
          label: '活动类型',
          selectOptions: [
            // 选择项
            { label: '品牌活动', value: 1 },
            { label: '门店活动', value: 10 }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState({
      curApp: 'curApp',
      roleList: 'roleList'
    }),
    // 区域管理员
    isAreaManger() {
      return (
        (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
          !!~this.roleList.split(',').indexOf('common_role_dealer_manager')) &&
        !!this.curApp.canCustomDecorate
      );
    }
  },
  methods: {
    onReSelect() {
      this.showDialog = true;
    },
    onChoose(lucky) {
      this.dataSource.data.id = lucky.id;
      this.dataSource.data.name = lucky.activityName;
      // activityScenario： 0:首页，1:Order
      service.buildCitedForLucky({ luckyTurningId: lucky.id, activityScenario: 0 });
    },

    // 选择转盘活动图片相关
    onCancelPickImage() {
      this.showChooseImageDialog = false;
    },
    onPickedImage(choosedImg) {
      this.form.showChooseImageDialog = false;
    },
    deleteTag() {
      this.dataSource.data.id = null;
      this.dataSource.data.name = null;
    }
  },
  // @WARN 默认的幸运转盘活动图片在这里设置
  mounted() {
    if (!this.dataSource.img) {
      this.$set(this.dataSource, 'img', this.luckyLayoutImg);
    } else {
      this.luckyLayoutImg = this.dataSource.img;
    }
  },
  updated() {
    if (!this.dataSource.img) {
      this.$set(this.dataSource, 'img', this.luckyLayoutImg);
    } else {
      this.luckyLayoutImg = this.dataSource.img;
    }
  },
  watch: {
    luckyLayoutImg() {
      this.$set(this.dataSource, 'img', this.luckyLayoutImg);
    }
  }
};
</script>
<style  lang="less" scoped>
.com-row {
  .title {
    width: 100px;
  }
}

.lucky-title {
  font-size: 14px;
  font-weight: 400;
  color: #566980;
  vertical-align: top;
  text-align: left;
  padding: 30px 10px;
}

.select {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #2e8dff;
  line-height: 20px;
  margin-left: 15px;
}

.lucky-button {
  border: 1px solid #2e8dffaf;
  border-radius: 3px;
  padding: 0 8px;
  position: relative;
  color: #2e8dff;
  margin-left: 5px;
  .select {
    display: none;
    position: absolute;
    z-index: 2;
    top: 40px;
    right: 120px;
    height: 26px;
    width: 80px;
    background-color: #fff;
    text-align: center;
    line-height: 26px;
    color: #000;
    font-size: 12px;
    border-radius: 2px;
    border: solid 1px silver;
    cursor: pointer;
  }
  .delete {
    position: absolute;
    top: -5px;
    right: -5px;
    height: 10px;
    width: 10px;
    background: transparent url(../images/close.png) no-repeat 0 0;
    background-size: cover;
  }
}

.lucky-button:hover .select {
  display: block;
}
</style>

