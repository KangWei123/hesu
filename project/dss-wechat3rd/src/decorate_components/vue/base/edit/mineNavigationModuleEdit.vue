<template>
  <div class="mine-navigation-module-edit">
    <div class="com-title">
      <span>导航图标</span>
    </div>

    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />

    <div class="com-body">
      <div class="com-row">
        <span class="com-column">工具栏名称</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showTitle">
            <el-radio :label="true" border>显示</el-radio>
            <el-radio :label="false" border>隐藏</el-radio>
          </el-radio-group>
        </span>
        <el-input class="nav-title" v-if="dataSource.showTitle" v-model="dataSource.title"></el-input>
      </div>

      <size :data-source="dataSource" />

      <div class="com-row">
        <span class="com-column">页面风格</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.displayStyle">
            <el-radio label="default" border>经典版</el-radio>
            <el-radio label="custom" border>宫格版</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column" style="width: 100px">信息展示设置</span>
        <span class="tips">(至少选择一个,图标建议尺寸：58*58px)</span>
      </div>

      <div class="nav-mode-edit" v-if="dataSource.list">
        <Container :group-name="'4'" :get-child-payload="getChildPayload" @drop="onDrop($event)">
          <Draggable v-for="(item, index) in dataSource.list" :key="index">
            <div class="_row clearfix">
              <el-checkbox
                class="nav-check-box"
                v-model="item.checked"
                @change="value => checkSelectedCount(item, value)"
              ></el-checkbox>
              <div class="_left">
                <div class="img" v-if="!item.logo" @click="handlerPickImage(index)"></div>
                <img class="img" v-else :src="item.logo" @click="handlerPickImage(index)" />
                <div class="pick" @click="handlerPickDefaultImage(index)">恢复默认</div>
              </div>
              <div class="_right">{{ item.name }}</div>
            </div>
          </Draggable>
        </Container>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import Size from './size.vue';
  import './css/common.less';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';

  export default {
    name: 'MineNavigationModuleEdit',
    mixins: [appFeaturesMixin, industryHelperMixin],
    components: {
      MaterialsImage,
      Container,
      Draggable,
      Size,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        visibleUpload: false,
        pickImageIndex: -1,
        defaultBgColor: 'rgba(255,255,255,1)',
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
    },
    mounted() {},
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
      handlerPickDefaultImage(index) {
        this.dataSource.list[index].logo = this.dataSource.list[index].defaultLogo;
      },
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(e) {
        const item = this.dataSource.list[this.pickImageIndex];
        this.visibleUpload = false;
        this.$set(item, 'logo', e.imgUrl);
      },
      checkSelectedCount(item, value) {
        if (!value) {
          const hasChecked = this.dataSource.list.some(checkItem => {
            return checkItem.checked;
          });
          if (!hasChecked) {
            item.checked = true;
          }
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .mine-navigation-module-edit {
    .bottom {
      text-align: center;
      background: #f8f9fe;
      border: 1px solid #bac6d3;
      background: rgba(240, 242, 247, 1);
      width: 315px;
      height: 20px;
      line-height: 20px;
      margin: 20px 5px;
      font-size: 10px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(86, 105, 128, 1);
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

    .nav-title {
      width: 150px;
      margin-top: 10px;
      margin-left: 74px;
    }

    .nav-mode-edit {
    }

    ._row {
      width: 315px;
      box-sizing: border-box;
      margin: 5px;
      padding: 5px;
      cursor: move;
      position: relative;
      border-radius: 1px;
      border: 1px solid rgba(240, 242, 247, 1);
      margin-top: 15px;

      .com-close {
        position: absolute;
        right: -5px;
        top: -5px;
      }

      .nav-check-box {
        float: left;
        margin-top: 17px;
        margin-left: 10px;
        margin-right: 10px;
      }

      ._left,
      ._right {
        height: 100%;
        float: left;
      }

      ._left {
        width: 58px;
        height: 58px;
        position: relative;
        border: 1px solid rgba(240, 242, 247, 1);
        // overflow: hidden;

        .img {
          width: 28px;
          height: 28px;
          margin-left: 15px;
          margin-top: 7px;
          line-height: 100px;
          text-align: center;
        }

        .pick {
          width: 100%;
          height: 16px;
          line-height: 16px;
          position: absolute;
          bottom: 0;
          left: 0;
          text-align: center;
          color: rgba(86, 105, 128, 1);
          border: 1px solid rgba(240, 242, 247, 1);
          border-left: 0;
          border-right: 0;
          cursor: pointer;
          font-size: 10px;
          background-color: rgba(255, 255, 255, 1);
        }
      }

      ._right {
        width: 190px;
        margin-left: 5px;
        height: 60px;
        line-height: 60px;
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

    .tips {
      font-size: 10px;
      color: #566980;
      margin-left: -10px;
    }
  }
</style>
