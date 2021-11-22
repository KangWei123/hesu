<template>
  <div class="goods-detail-setting">
    <hr class="goods-hr">
    <div class="title" @click="showContent = !showContent">
      <span class="goods-icon">4</span>
      详情装修 <i :class="showContent ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
    </div>
    <transition name="el-zoom-in-top">
      <div v-show="showContent">
        <div class="select-content" v-show="showContent">
          <Container
            behaviour="copy"
            :group-name="'1'"
            orientation="horizontal"
            :get-child-payload="getChildPayload"
            class="components-container">
            <template v-for="item in settingOptions">
              <Draggable v-if="item.id !== 'baseInfo'" :key="item.id">
                <div class="draggable-item">
                  {{item.label}}
                </div>
              </Draggable>
            </template>
          </Container>
        </div>

        <div class="setting-content" v-show="showContent">
          <!-- 拖拽组件放置区域 -->
          <div class="setting-area">
            <Container
              :group-name="'1'"
              :get-child-payload="getChildPayload2"
              @drop="onDrop('settingSource', $event)"
              drag-class="drag"
              class="setting-area-container">
              <Draggable v-for="(item, index) in settingSource" :key="index">
                <div class="setting-area-item">
                  {{item.label}}
                  <div class="desc">{{descOptions[item.id].desc}}</div>
                  <div class="desc">{{descOptions[item.id].subDesc}}</div>
                  <div class="cover" @click="clickScreenComponents(item, $event)" :class="{ select: item === editItem }">
                    <i class="com-close" v-if="item.id !== 'baseInfo'" @click="deleteScreenComponents(index)"></i>
                  </div>
                </div>
              </Draggable>
            </Container>
          </div>

          <!-- 编辑区域 -->
          <div class="edit-area" v-if="editItem">
            <div class="header">{{editItem.label}}</div>
            <div v-if="editItem.id === 'cp'" class="no-setting-tips">没有需要配置的内容</div>
            <w-editor v-else-if="editItem.id === 'description'" :key="editIndex" width="100%" height="562px" :content-height="528" :dataSource="editItem.config"></w-editor>
            <component v-else :is="editItem.id" :config.sync="editItem.config"></component>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import BaseInfo from './base-info.vue';
import BuyerShow from './buyer-show.vue';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';

const BASEINFO = {
  id: 'baseInfo',
  label: '基本信息区',
  config: [
    {
      id: 'detail',
      label: '详情',
      name: '',
      checked: true
    },
    {
      id: 'params',
      label: '参数',
      name: '',
      checked: false
    },
    {
      id: 'cp',
      label: 'CP',
      name: '',
      checked: false
    },
    {
      id: 'show',
      label: '晒单',
      name: '',
      checked: false
    }
  ]
};

export default {
  name: 'goods-detail-setting',
  props: {
    settingSource: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Container,
    Draggable,
    BaseInfo,
    BuyerShow,
    WEditor
  },
  data() {
    return {
      showContent: true,
      descOptions: {
        baseInfo: {
          label: '基本信息区',
          desc: '固定样式，显示商品主图、价格等信息',
          subDesc: '可修改tab标题'
        },
        description: {
          label: '商品描述区',
          desc: '在右侧编辑图文、可增加多个描述区',
          subDesc: '可改变区域排序'
        },
        buyerShow: {
          label: '晒单区',
          desc: '固定样式',
          subDesc: '可自定义名称标题及改变区域排序'
        },
        cp: {
          label: '推荐搭配区',
          desc: '可自定义标题名称及改变区域排序'
        }
      },
      settingOptions: [
        {
          id: 'description',
          label: '商品描述区',
          config: {
            describe: ''
          }
        },
        {
          id: 'buyerShow',
          label: '晒单区',
          config: [
            {
              id: 'show',
              label: '晒单',
              name: '',
              checked: true
            },
            {
              id: 'questions',
              label: '问答',
              name: '',
              checked: false
            }
          ]
        },
        {
          id: 'cp',
          label: '推荐搭配区'
        }
      ],
      editIndex: -1
    };
  },
  watch: {
    settingSource: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          if (!this.settingSource.length) this.settingSource.push(this.clone(BASEINFO));
        });
      }
    }
  },
  computed: {
    editItem() {
      return this.editIndex !== -1 ? this.settingSource[this.editIndex] : null;
    }
  },
  methods: {
    // 组件库往屏幕的拖组件 返回具体组件
    getChildPayload(index) {
      return this.settingOptions[index];
    },
    // 屏幕内组件库内部的拖动 返回具体组件
    getChildPayload2(index) {
      return this.settingSource[index];
    },
    onDrop(collection, dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult;
      if (payload && payload.id === 'baseInfo') return;
      if (addedIndex === 0) return;
      // 晒单区、推荐搭配区只允许添加1个
      if (payload && (payload.id === 'buyerShow' || payload.id === 'cp')) {
        const beingStatus = this[collection].findIndex(el => el.id === payload.id);
        if (beingStatus > -1) {
          this.editIndex = 0;
          return;
        }
      }
      let temp = null;
      if (removedIndex === null) {
        temp = this.clone(payload);
      } else {
        temp = payload;
        this[collection].splice(removedIndex, 1);
      }
      this[collection].splice(addedIndex, 0, temp);
      this.editIndex = addedIndex;
    },
    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    deleteScreenComponents(index) {
      this.settingSource.splice(index, 1);
    },
    // 点击组件，主要返回一个编辑index
    clickScreenComponents(val, event) {
      this.editIndex = this.settingSource.indexOf(val);
    }
  }
};
</script>

<style lang="less" scoped>
.goods-detail-setting {
  .title {
    display: inline-block;
    margin: 20px 0;
    cursor: pointer;
  }

  .select-content {
    .components-container {
      .draggable-item {
        width: 94px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        cursor: pointer;
      }
    }
  }

  .setting-content {
    margin: 20px 0;
    display: flex;

    .setting-area {
      width: 280px;
      // position: relative;

      .setting-area-container {
        width: 100%;
        height: 600px;
        border: 1px solid #ccc;
        // position: absolute;
        // left: 0;
        overflow-x: hidden;
        overflow-y: auto;
        .setting-area-item {
          position: relative;
          width: 100%;
          height: 180px;
          background-color: #f1f1f1;
          border-bottom: 1px dashed #ccc;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          cursor: move;

          .desc {
            opacity: .6;
          }

          .cover {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            // display: none;

            &.select {
              border: 1px dashed #256EFF;
            }

            .com-close {
              cursor: pointer;
              position: absolute;
              top: 0;
              right: 0;
            }
          }
        }
      }
    }

    .edit-area {
      margin-left: 20px;
      flex: 1;
      height: 600px;
      border: 1px solid #ccc;

      .header {
        height: 38px;
        line-height: 38px;
        padding: 0 20px;
        border-bottom: 1px solid #ccc;
      }

      .no-setting-tips {
        width: 100%;
        height: 100%;
        line-height: 560px;
        text-align: center;
      }
    }
  }
}
</style>