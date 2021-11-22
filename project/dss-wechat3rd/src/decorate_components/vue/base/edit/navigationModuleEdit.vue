<template>
  <div>
    <edit-header :data-source="dataSource" name="导航图标"></edit-header>

    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />

    <div class="com-body">
      <div class="com-row">
        <span class="com-column">每行个数：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.rowNum">
            <el-radio :label="2" v-if="isXiCha" border>2个</el-radio>
            <el-radio :label="4" border>4个</el-radio>
            <el-radio :label="5" border>5个</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">图片圆角：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.circularCorner">
            <el-radio :label="1" border>开启</el-radio>
            <el-radio :label="0" border>关闭</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">图标自定义：</span>
        <span class="com-column">
          <span class="recovery" @click="resetNav">恢复默认分类导航</span>
        </span>
      </div>

      <decorate-size :data-source="dataSource"></decorate-size>

      <div class="com-row">
        <span class="com-column">背景颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.backgroundColor"
            :color-model.sync="dataSource.bgMode"
            :default-color="defaultBgColor"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">文字颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.titleColor"
            :color-model.sync="dataSource.titleMode"
            :default-color="defaultTitleColor"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div class="nav-mode-edit">
        <Container :group-name="'4'" :get-child-payload="getChildPayload" @drop="onDrop($event)">
          <Draggable v-for="(item, index) in dataSource.list" :key="index">
            <div class="_row clearfix">
              <div class="com-close" @click="handlerDeleteItem(index)"></div>
              <div class="_left" @click="handlerPickImage(index)" v-if="!item.logo">
                <img class="color-img" src="../images/decorate-colorbg.png" />
                <div class="pick pick-add">添加图片</div>
              </div>

              <div class="_left" @click="handlerPickImage(index)" v-else>
                <div class="nav-left-mask">
                  <div class="pick pick-changeImg">修改图片</div>
                </div>
                <img class="img" :src="item.logo" />
              </div>

              <div class="_right">
                <div>
                  <el-input size="mini" placeholder="请输入内容" v-model="item.name">
                    <template slot="prepend">名称：</template>
                  </el-input>
                </div>
                <div style="margin-top: 4px">
                  <link-select
                    v-model="item.link"
                    v-if="linkReady"
                    :link-mixins="linkMixins"
                    :selected-options="item.link"
                    :size="'mini'"
                    :filter-link-options="handleFilterLinkOptions"
                  />
                </div>
              </div>
            </div>
          </Draggable>
        </Container>

        <div class="bottom" @click="handlerAddItem">
          <a class="dss-link" href="javascript:void(0);">+添加一个</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import LinkSelect from '@/dss-wechat3rd/src/bz_components/linkSelect/index.vue';
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import linkMixins from '@/dss-wechat3rd/src/bz_components/linkSelect';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin';
  import EditHeader from './edit-header.vue';
  import DecorateSize from './size.vue';
  import './css/common.less';
  import navParamsAssember from '../../../utils/nav-params-assember';

  export default {
    name: 'NavigationModuleEdit',
    mixins: [appFeaturesMixin, industryHelperMixin],
    components: {
      MaterialsImage,
      LinkSelect,
      Container,
      Draggable,
      DecorateSize,
      colorSelect,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        linkMixins,
        linkReady: false,
        visibleUpload: false,
        pickImageIndex: -1,
        defaultBgColor: 'rgba(255,255,255,1)',
        defaultTitleColor: '#333',
        handleFilterLinkOptions: navParamsAssember.addMerchantDetailLink,
      };
    },
    watch: {
      dataSource: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal.list && newVal.list.length) {
            return;
          }
          if (this.linkReady) {
            this.initClassifyList();
          }
        },
      },
    },
    computed: {
      ...mapState({
        customPages: 'customPages',
        currentEditPageIndex: 'currentEditPageIndex',
        env: 'env',
      }),
    },
    mounted() {
      this.addDataSourceProps();
      const batchRequest = this.mGetLinkSelectBatchRequest(linkMixins);
      Promise.all(batchRequest).then(batchRes => {
        this.linkReady = batchRes.every(res => {
          return !!res;
        });
        if (this.linkReady && (!this.dataSource.list || !this.dataSource.list.length)) {
          this.initClassifyList();
        }
      });
    },
    methods: {
      // 屏幕内组件库  内部的拖动
      onDrop: function (dropResult) {
        const { removedIndex, addedIndex, payload } = dropResult;
        this.dataSource.list.splice(removedIndex, 1);
        this.dataSource.list.splice(addedIndex, 0, payload);
        this.editIndex = addedIndex;
      },

      // 屏幕内组件库内部的拖动 返回具体组件
      getChildPayload: function (index) {
        return this.dataSource.list[index];
      },

      handlerPickImage(index) {
        this.visibleUpload = true;
        this.pickImageIndex = index;
      },
      handlerAddItem() {
        this.dataSource.list.push({
          logo: '',
          name: '',
          link: [],
        });
      },
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(e) {
        const item = this.dataSource.list[this.pickImageIndex];
        this.visibleUpload = false;
        this.$set(item, 'logo', e.imgUrl);
      },
      // 初始化分类容器
      initClassifyList() {
        this.dataSource.list = this.mInitNavList(linkMixins);
      },
      // 恢复默认分类导航
      resetNav() {
        this.initClassifyList();
      },
      // 移除某项
      handlerDeleteItem(index) {
        this.dataSource.list.splice(index, 1);
      },
      addDataSourceProps() {
        const dataSource = this.dataSource;
        if (!dataSource.backgroundColor) {
          this.$set(dataSource, 'backgroundColor', 'rgba(255,255,255,1)');
        }
        if (!dataSource.bgMode) {
          this.$set(dataSource, 'bgMode', 'default');
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .bottom {
    text-align: center;
    background: #f8f9fe;
    // border: 1px solid #bac6d3;
    background: rgba(240, 242, 247, 1);
    width: 315px;
    height: 20px;
    line-height: 20px;
    margin: 20px 5px;
    font-size: 10px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(86, 105, 128, 1);
    padding: 3px 0;
  }

  .recovery {
    width: 113px;
    height: 19px;
    line-height: 19px;
    border-radius: 2px;
    border: 1px solid rgba(67, 121, 237, 1);
    text-align: center;
    display: inline-block;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(67, 121, 237, 1);
    cursor: pointer;
  }

  .nav-mode-edit {
  }

  ._row {
    width: 315px;
    box-sizing: border-box;
    margin: 5px;
    padding: 5px;
    position: relative;
    border-radius: 1px;
    border: 1px solid #dcdfe6;
    margin-top: 15px;
    background: #f5f7fa;

    .com-close {
      position: absolute;
      right: -5px;
      top: -5px;
    }

    ._left,
    ._right {
      height: 100%;
      float: left;
    }

    ._left {
      width: 62px;
      height: 62px;
      position: relative;
      border: 1px dashed #ff7844;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // overflow: hidden;

      .img {
        width: 55px;
        height: 55px;
        line-height: 100px;
        text-align: center;
      }

      .color-img {
        width: 18px;
        height: 18px;
        margin-top: -20px;
      }

      .pick {
        width: 100%;
        height: 16px;
        line-height: 16px;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        color: #2e8dff;
        border: 1px solid rgba(240, 242, 247, 1);
        border-left: 0;
        border-right: 0;
        cursor: pointer;
        font-size: 10px;
      }

      .pick-add {
        bottom: 10px;
      }

      .nav-left-mask {
        align-items: center;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(109, 109, 109, 0.8);
        border-radius: 4px;
        display: none;
      }
    }

    ._left:hover {
      .nav-left-mask {
        display: block;
      }

      .pick-changeImg {
        opacity: 1;
        bottom: 29%;
        border: none;
        color: #fff;
      }
    }

    ._right {
      width: 234px;
      margin-left: 5px;

      /deep/ .el-input-group__prepend {
        border: none;
        background-color: #f5f7fa;
        color: #303133;
        padding: 0 13px;
      }
    }
  }

  .clearfix::after {
    display: block;
    clear: both;
    content: '';
    visibility: hidden;
    height: 0;
  }

  .clearfix {
    zoom: 1;
  }
</style>
