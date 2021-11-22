<template>
  <div class="nav-container">
    <edit-header :data-source="dataSource" name="导航容器"></edit-header>
    <div class="com-body">
      <decorate-size :data-source.sync="dataSource.style"></decorate-size>

      <div class="nav-mode-edit">
        <div class="nav-edit__title">
          卡片内容设置: <a v-if="dataSource.list.length < 10" @click="handlerAddItem">+ 新增导航</a>
        </div>
        <container class="navigation-draggable" group-name="navigation-draggable" @drop="handleDrop">
          <!-- 下级组件 -->
          <draggable v-for="(item, index) in dataSource.list" :key="item.id + '_' + index">
            <div :class="['row', { active: index === dataSource.activeIndex }]" @click="updateActive(index)">
              <div class="com-close" @click="handlerDeleteItem(index)" />
              <div class="row__field">
                <div class="row__label">导航图标:</div>
                <image-select
                  :param="item"
                  :img-url="item.logo"
                  @handleShow="handlerPickImage"
                  @handleDeleteImg="handleDeleteImg"
                />
              </div>

              <div class="row__field">
                <div class="row__label">导航名称:</div>
                <el-input size="mini" placeholder="不超过 6 个中文" maxlength="6" v-model.trim="item.name"></el-input>
              </div>
            </div>
          </draggable>
        </container>
      </div>
    </div>
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />
  </div>
</template>

<script>
  import { Container, Draggable } from 'vue-smooth-dnd';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import EditHeader from './edit-header.vue';
  import DecorateSize from './size.vue';
  import ImageSelect from './image-select.vue';

  export default {
    name: 'NavigationContainerEdit',
    inject: ['isEditing', 'setEditing', 'canEdit', 'canSave'],
    components: {
      EditHeader,
      DecorateSize,
      MaterialsImage,
      Container,
      Draggable,
      ImageSelect,
    },
    props: {
      dataSource: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        visibleUpload: false,
        pickImageItem: null,
      };
    },
    mounted() {
      this.updateActive();
    },
    methods: {
      handlerAddItem() {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.list.push({
          logo: '',
          name: '导航标题',
          // 下级组件
          children: [],
        });
        this.updateActive();
      },
      handlerPickImage(item) {
        this.visibleUpload = true;
        this.pickImageItem = item;
      },
      handleDeleteImg(item) {
        this.$set(item, 'logo', '');
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
          // eslint-disable-next-line vue/no-mutating-props
          this.dataSource.list.splice(index, 1);
          this.updateActive();
        }
      },
      handleDrop(evt) {
        const { removedIndex, addedIndex } = evt;
        // 不需要处理的情况
        if (!removedIndex && !addedIndex) {
          return false;
        }

        // eslint-disable-next-line vue/no-mutating-props
        const addImage = this.dataSource.list.splice(removedIndex, 1)[0];

        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.list.splice(addedIndex, 0, addImage);
      },
      updateActive(index) {
        this.$set(this.dataSource, 'activeIndex', index != null ? index : 0);
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

  .nav-edit__title {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #303133;
    margin-top: 20px;
    margin-right: 40px;

    a {
      color: #ff8341;
      font-size: 14px;
    }
  }

  .row {
    width: 320px;
    box-sizing: border-box;
    margin: 5px;
    padding: 5px;
    position: relative;
    border-radius: 1px;
    border: 1px solid #dcdfe6;
    margin-top: 15px;
    background: #f5f7fa;

    &.active {
      border-color: #fa7516;
    }

    .row__field {
      display: flex;
      align-items: center;
      padding: 5px 0;
    }

    .row__label {
      white-space: nowrap;
      width: 74px;
      flex-shrink: 0;
    }

    .com-close {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>
