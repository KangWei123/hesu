<template>
  <div class="picture-item" :draggable="true" @dragstart="drag">
    <div
      v-if="data.type === materialEnum.materialType.FOLDER"
      class="folder-material"
      @drop="allowDrop"
      @dragover="drop"
      @dblclick="handleGroup"
      @click="handleClick"
      :class="showSupernatant || isChecked ? 'picture-checked' : ''"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
    >
      <el-checkbox
        v-model="isChecked"
        class="check"
        v-show="showSupernatant || isChecked"
        :disabled="!selectable(data)"
        @change="change"
      ></el-checkbox>

      <div class="folder-header"></div>
      <div class="folder-content" @click="selectImg">
        <div class="img-box">
          <div class="img-item" v-for="(item, index) in 4" :key="index">
            <img
              v-if="data.coverUrlList && data.coverUrlList[index]"
              :src="data.coverUrlList[index]"
              :draggable="false"
            />
            <div v-else class="none"></div>
          </div>
        </div>

        <div class="material-name">{{ data.name }}</div>
        <div class="supernatant" v-show="showSupernatant && isRecycle">
          <!-- 恢复 -->
          <img
            src="../../../../images/category/revert.png"
            @click.stop="revertImg"
            v-if="isRecycle"
            title="恢复"
            class="revert-img"
          />
          <div class="revert-text" v-if="isRecycle" @click.stop="revertImg">还原</div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="picture-material"
      :class="showSupernatant || isChecked ? 'picture-checked' : ''"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
      @click="handleClick"
    >
      <el-checkbox
        v-model="isChecked"
        class="check"
        v-show="showSupernatant || isChecked"
        :disabled="!selectable(data)"
        @change="change"
      ></el-checkbox>
      <div :class="['img-wrapper', { video: data.materialType === materialEnum.materialType.VIDEO }]">
        <img :src="getCover(data)" alt @click="selectImg" :draggable="false" />
      </div>
      <div class="material-name" @click="selectImg">{{ data.name }}</div>
      <div class="supernatant" v-if="!hideSupernatant" v-show="showSupernatant">
        <!-- 恢复 -->
        <img
          src="../../../../images/category/revert.png"
          @click.stop="revertImg"
          v-if="isRecycle"
          title="恢复"
          class="revert-img"
        />
        <div class="revert-text" v-if="isRecycle" @click.stop="revertImg">还原</div>
        <!-- 编辑 -->
        <img src="../../../../images/category/edit-icon.png" @click.stop="editorImg" v-if="isFolder && !isRecycle" />
        <!-- 移动 -->
        <el-popover
          v-if="!isFolder"
          placement="bottom-start"
          width="160"
          :visible-arrow="false"
          popper-class="custom-popper"
          v-model="visible"
          trigger="click"
        >
          <div style="padding: 10px 10px 0 10px">移动到：</div>
          <category-tree
            v-if="visible"
            width="160px"
            height="220px"
            as-selector
            :show-operation="false"
            :show-all="false"
            :source-material="data"
            @nodeClick="moveImg"
          ></category-tree>
          <img
            src="../../../../images/category/move-icon.png"
            style="margin-right: 13px"
            slot="reference"
            v-if="!isRecycle"
          />
        </el-popover>
        <!-- 查看 -->
        <img src="../../../../images/category/view-icon.png" @click.stop="viewImg" v-if="!isRecycle" />
        <!-- 删除 -->
        <img src="../../../../images/category/delete-icon.png" @click.stop="deleteImg" v-if="!isFolder && !isRecycle" />
      </div>
    </div>
  </div>
</template>

<script>
  import categoryTree from '../category-tree/index.vue';
  import materialEnum from '../material-type';
  import { getCover } from '@/mod-kangyang/src/utils';

  export default {
    components: {
      categoryTree,
    },
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
      idList: {
        type: Array,
        default() {
          return [];
        },
      },
      // 是否是回收站
      isRecycle: {
        type: Boolean,
        default: false,
      },
      // 是否隐藏悬浮窗
      hideSupernatant: {
        type: Boolean,
        default: false,
      },
      /**
       * 是否支持选中
       */
      selectable: {
        type: Function,
        default: () => true,
      },
    },
    data() {
      return {
        showSupernatant: false,
        isChecked: false,
        visible: false,
        materialEnum,
      };
    },
    computed: {
      isFolder() {
        return this.data.type === materialEnum.materialType.FOLDER;
      },
    },
    watch: {
      idList() {
        const index = this.idList.findIndex(item => item.id === this.data.id);
        this.isChecked = index >= 0;
      },
      data() {
        const index = this.idList.findIndex(item => item.id === this.data.id);
        this.isChecked = index >= 0;
      },
    },
    methods: {
      getCover,
      drag(e) {
        event.dataTransfer.setData('text', this.data.id);
        event.dataTransfer.setData('materialType', this.data.materialType);
      },
      drop(e) {
        event.preventDefault();
      },
      allowDrop(e) {
        const id = e.dataTransfer.getData('text');
        const materialType = e.dataTransfer.getData('materialType');
        if (id == this.data.id) {
          return;
        }
        this.$emit('moveImg', { id: id, materialType: Number(materialType) }, this.data.id);
      },

      change() {
        if (!this.selectable(this.data)) {
          return;
        }

        const selectImg = this.data;
        selectImg.isChecked = this.isChecked;
        this.$emit('selectImg', selectImg);
      },

      selectImg() {
        if (!this.selectable(this.data)) {
          return;
        }

        this.isChecked = !this.isChecked;
        const selectImg = this.data;
        selectImg.isChecked = this.isChecked;
        this.$emit('selectImg', selectImg);
      },

      deleteImg() {
        this.$emit('deleteImg', this.data);
      },

      moveImg(none) {
        this.visible = false;
        this.$emit('moveImg', this.data, none.id);
      },

      editorImg() {
        this.$emit('editorImg', this.data);
      },
      viewImg() {
        this.$emit('viewImg', this.data);
      },
      handleClick() {
        this.$emit('click', this.data);
      },
      handleGroup() {
        this.$emit('handleGroup', this.data);
      },
      revertImg() {
        this.$emit('revertImg', this.data);
      },
      mouseenter() {
        this.showSupernatant = true;
      },
      mouseleave() {
        this.showSupernatant = false;
      },
    },
  };
</script>

<style lang="less">
  .custom-popper {
    padding: 0 !important;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.05);
  }
</style>

<style lang="less" scoped>
  .picture-item {
    margin-right: 16px;
    margin-bottom: 24px;

    .folder-material.picture-checked {
      .folder-header {
        background: #1890ff;
      }

      .folder-content {
        border: 1px solid #1890ff;
      }
    }

    .folder-material {
      position: relative;

      .check {
        position: absolute;
        top: 15px;
        left: 6px;
      }

      .folder-header {
        width: 65px;
        height: 10px;
        background: #e6e9f0;
        border-radius: 4px 0 0 0;
        position: relative;
      }

      .folder-header::after {
        position: absolute;
        position: absolute;
        right: 0;
        content: '';
        width: 2px;
        height: 0;
        border-left: 10px solid transparent;
        border-top: 10px solid #fff;
      }

      .folder-content {
        box-sizing: border-box;
        width: 152px;
        height: 130px;
        background: #fff;
        border: 1px solid #e6e9f0;
        border-radius: 0 4px 4px 4px;
        cursor: pointer;

        .img-box {
          display: flex;
          flex-wrap: wrap;
          margin-top: 2px;

          .img-item {
            overflow: hidden;
          }

          img {
            margin-left: 5px;
            margin-top: 5px;
            width: 68px;
            height: 44px;
            display: block;
          }

          .none {
            margin-left: 5px;
            margin-top: 5px;
            width: 68px;
            height: 44px;
            background: #ebeef5;
          }
        }

        .material-name {
          margin-top: 5px;
          height: 22px;
          padding: 0 5px;
          text-align: center;
          color: #303133;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }

    .picture-material.picture-checked {
      border: 1px solid #1890ff;
    }

    .picture-material {
      position: relative;
      cursor: pointer;
      box-sizing: border-box;
      padding: 8px;
      width: 152px;
      height: 180px;
      background: #fff;
      border-radius: 2px;
      border: 1px solid #e6e9f0;

      img {
        border-radius: 2px;
        display: block;
        object-fit: scale-down;
      }

      .img-wrapper {
        width: 136px;
        height: 136px;
        position: relative;
      }

      .img-wrapper > img {
        width: 100%;
        height: 100%;
      }

      .img-wrapper.video::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        background-image: url('../../../../images/play.png');
        width: 30px;
        height: 30px;
        background-size: contain;
        transform: translate(-50%, -50%);
      }

      .material-name {
        margin-top: 5px;
        height: 22px;
        padding: 0 5px;
        text-align: center;
        color: #303133;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .check {
        position: absolute;
        top: 5px;
        left: 8px;
      }
    }

    .supernatant {
      width: 100%;
      height: 30px;
      line-height: 30px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
        background: transparent;
        margin-right: 13px;
      }

      img:last-child {
        margin-right: 0;
      }

      .revert-img {
        margin-right: 0;
      }

      .revert-text {
        margin-left: 5px;
        color: #fff;
      }
    }
  }
</style>
