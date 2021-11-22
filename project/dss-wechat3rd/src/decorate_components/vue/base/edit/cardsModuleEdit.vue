<template>
  <div>
    <edit-header :data-source="dataSource" name="卡片导航"></edit-header>

    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />

    <div class="com-body">
      <div class="com-row">
        <span class="com-column">样式：</span>
        <span class="com-column">
          <el-radio-group class="custom-radio" v-model="dataSource.mode">
            <el-radio-button label="name">样式一</el-radio-button>
            <el-radio-button label="cover">样式二</el-radio-button>
          </el-radio-group>
        </span>
      </div>

      <decorate-size :data-source.sync="dataSource.style" show-gap gap-name="卡片间隙"></decorate-size>

      <div class="com-row">
        <span class="com-column">卡片宽度：</span>
        <span class="com-column">
          <div class="com-slide">
            <el-input
              class="number-input"
              v-model.number="dataSource.cardWidth"
              type="number"
              min="0"
              max="500"
              @blur="handleBlue('dataSource.cardWidth')"
            />
          </div>
        </span>
        <span class="px-title">px</span>
        <el-tooltip class="item" effect="dark" content="请输入一个小于或等于500的值" placement="bottom">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </div>

      <div class="com-row">
        <span class="com-column">卡片高度：</span>
        <span class="com-column">
          <div class="com-slide">
            <el-input class="number-input" v-model.number="dataSource.cardHeight" type="number" min="0" />
          </div>
        </span>
        <span class="px-title">px</span>
        <el-tooltip class="item" effect="dark" content="请输入一个不小于0的值" placement="bottom">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </div>

      <div class="com-row">
        <span class="com-column">功能区：</span>
        <span class="com-column">
          <el-radio-group class="custom-radio" v-model="dataSource.showModule">
            <el-radio-button :label="true">展示</el-radio-button>
            <el-radio-button :label="false">不展示</el-radio-button>
          </el-radio-group>
        </span>
      </div>

      <div class="cards">
        <div class="cards__title">
          卡片内容设置: <a v-if="dataSource.list.length < 5" @click="handlerAddItem">+ 新增卡片</a>
        </div>
        <container class="item-draggable" group-name="item-draggable" @drop="handleDrop">
          <draggable
            v-for="(item, index) in dataSource.list"
            :key="index"
            :class="['card', { active: dataSource.active === index }]"
          >
            <div class="com-close" @click.stop="handlerDeleteItem(index)"></div>
            <div class="card__main" @click="handleActive(index)">
              <div v-if="mode === 'cover'" class="card__field">
                <div class="card__field-name">卡片图片：</div>
                <div class="card__field-value">
                  <image-select
                    :param="item"
                    :img-url="item.logo"
                    :show-tip="false"
                    img-tip-size="440 x 192"
                    @handleShow="handlerPickImage"
                    @handleDeleteImg="handleDeleteImg"
                  />
                </div>
              </div>
              <div v-else class="card__field">
                <div class="card__field-name">卡片名称：</div>
                <div class="card__field-value">
                  <el-input placeholder="编辑卡片名称" maxlength="6" v-model.trim="item.name" size="mini" />
                </div>
              </div>
              <div class="card__field" style="align-items: flex-start">
                <div class="card__field-name">链接地址：</div>
                <div class="card__field-value">
                  <link-select
                    :show-label="false"
                    v-model="item.link"
                    v-if="linkReady"
                    :link-mixins="linkMixins"
                    :selected-options="item.link"
                    size="mini"
                  />
                </div>
              </div>
              <div v-if="dataSource.showModule && item.list.length === 1" class="card__field">
                <div class="card__field-name w65">子功能文字布局：</div>
                <div class="card__field-value">
                  <el-radio-group class="custom-radio" v-model="dataSource.moduleNameAlign">
                    <el-radio-button label="left">居左</el-radio-button>
                    <el-radio-button label="right">居右</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>

            <el-button
              v-if="dataSource.showModule && item.list.length < 3"
              class="card__add"
              style="width: 100%"
              plain
              type="primary"
              size="mini"
              @click="handleAddSubItem(item)"
              >添加子功能</el-button
            >

            <div v-if="dataSource.showModule && item.list.length > 0" class="card__items">
              <container
                class="subItem-draggable"
                group-name="subItem-draggable"
                @drop="handleDrop($event, index, 'subItem')"
              >
                <draggable class="card__item" v-for="(subItem, subIndex) in item.list" :key="subIndex">
                  <div class="card__field">
                    <div class="card__field-name">功能名称：</div>
                    <div class="card__field-value">
                      <el-input placeholder="请输入" maxlength="5" size="mini" v-model.trim="subItem.name"></el-input>
                    </div>
                  </div>
                  <div class="card__field">
                    <div class="card__field-name">图标展示：</div>
                    <div class="card__field-value">
                      <image-select
                        :param="subItem"
                        :img-url="subItem.logo"
                        @handleShow="handlerPickImage"
                        @handleDeleteImg="handleDeleteImg"
                      />
                    </div>
                  </div>
                  <div class="card__field" style="align-items: flex-start">
                    <div class="card__field-name">链接地址：</div>
                    <div class="card__field-value">
                      <LinkSelect
                        v-model="subItem.link"
                        :show-label="false"
                        v-if="linkReady"
                        :link-mixins="linkMixins"
                        :selected-options="subItem.link"
                        :size="'mini'"
                      ></LinkSelect>
                    </div>
                  </div>
                  <div class="card__item-del">
                    <span @click.stop="handleRemoveItem(item.list, subIndex)">
                      <i class="el-icon-delete" />删除子功能
                    </span>
                  </div>
                </draggable>
              </container>
            </div>
          </draggable>
        </container>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import LinkSelect from '@/dss-wechat3rd/src/bz_components/linkSelect/index.vue';
  import linkMixins from '@/dss-wechat3rd/src/bz_components/linkSelect/index.js';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import DecorateSize from './size.vue';
  import EditHeader from './edit-header.vue';
  import ImageSelect from './image-select.vue';
  import './css/common.less';

  export default {
    name: 'CardsModuleEdit',
    mixins: [appFeaturesMixin, industryHelperMixin],
    components: {
      MaterialsImage,
      LinkSelect,
      DecorateSize,
      EditHeader,
      Container,
      Draggable,
      ImageSelect,
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
        pickImageItem: null,
        defaultBgColor: 'rgba(255,255,255,1)',
        defaultTitleColor: '#333',
      };
    },

    computed: {
      mode() {
        return this.dataSource.mode;
      },
      ...mapState({
        customPages: 'customPages',
        currentEditPageIndex: 'currentEditPageIndex',
        env: 'env',
      }),
    },
    mounted() {
      const batchRequest = this.mGetLinkSelectBatchRequest(linkMixins);
      Promise.all(batchRequest).then(batchRes => {
        this.linkReady = batchRes.every(res => {
          return !!res;
        });
      });
    },
    methods: {
      handleActive(index) {
        this.$set(this.dataSource, 'active', index);
      },
      handlerPickImage(item) {
        this.visibleUpload = true;
        this.pickImageItem = item;
      },
      handleDeleteImg(item) {
        this.$set(item, 'logo', '');
      },
      handleBlue(key) {
        if (key === 'dataSource.cardWidth') {
          if (this.dataSource.cardWidth > 500) {
            this.dataSource.cardWidth = 500;
          }
        }
      },
      handlerAddItem() {
        this.dataSource.list.push({
          logo: '',
          name: '卡片内容',
          link: null,
          list: [{ name: '功能名称', logo: '', link: '' }],
        });
      },
      handleDrop(evt, index, key) {
        const { removedIndex, addedIndex } = evt;
        // 不需要处理的情况
        if (!removedIndex && !addedIndex) {
          return false;
        }

        if (key === 'subItem') {
          // eslint-disable-next-line vue/no-mutating-props
          const addImage = this.dataSource.list[index].list.splice(removedIndex, 1)[0];

          // eslint-disable-next-line vue/no-mutating-props
          this.dataSource.list[index].list.splice(addedIndex, 0, addImage);
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          const addImage = this.dataSource.list.splice(removedIndex, 1)[0];

          // eslint-disable-next-line vue/no-mutating-props
          this.dataSource.list.splice(addedIndex, 0, addImage);
        }
      },
      handleRemoveItem(list, idx) {
        if (list.length > 1) {
          list.splice(idx, 1);
        }
      },
      handleAddSubItem(item) {
        item.list.push({
          logo: '',
          name: '功能名称',
          link: [],
        });
      },
      onCancelPickImage() {
        this.visibleUpload = false;
      },

      onSuccessPickedImage(e) {
        this.visibleUpload = false;
        this.$set(this.pickImageItem, 'logo', e.imgUrl);
      },

      // 移除某项
      handlerDeleteItem(index) {
        if (this.dataSource.list.length > 1) {
          this.dataSource.list.splice(index, 1);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .com-row {
    display: flex;
    align-items: center;
  }

  .number-input {
    width: 203px;

    /deep/& .el-input__inner {
      text-align: center !important;
    }
  }

  .cards {
    padding-right: 40px;
  }

  .cards__title {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #303133;
    margin-top: 20px;

    a {
      color: #ff8341;
      font-size: 14px;
    }
  }

  .card {
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    position: relative;
    margin-top: 15px;
    padding: 30px 12px;

    &.active {
      border-color: #ff8341;
    }

    .com-close {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .card__field {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .card__field-name {
      width: 70px;
      margin-right: 4px;
    }

    .w65 {
      width: 65px;
      margin-right: 10px;
    }

    .card__field-value {
      flex: 1;
      display: flex;
      align-items: center;

      .tip {
        display: flex;
        flex-direction: column;
        color: gray;
        align-self: flex-end;
        margin-left: 5px;
        font-size: 12px;
      }
    }
  }

  .card__image {
    position: relative;
    width: 56px;
    height: 56px;
    border: 1px solid #dce1e6;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: #717378;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .card__items {
    margin-top: 10px;
    border-radius: 3px;
    border-top: 1px solid #dcdfe6;
  }

  .card__add {
    background: #fff;
    padding: 8px;
    margin-top: 10px;
  }

  .card__item {
    margin-top: 15px;

    &:not(:last-child) {
      border-bottom: 1px dashed gainsboro;
    }
  }

  .card__item-del {
    color: #ff8341;
    text-align: right;
    margin-bottom: 10px;
    font-size: 12px;

    & span {
      cursor: pointer;
    }
  }
</style>
