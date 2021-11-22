<template>
  <div class="album">
    <el-button type="text" @click="handleAdd">添加相册</el-button>
    <container v-if="value && value.length" class="album__list" @drop="handleDrop">
      <draggable v-for="(item, index) of value" :key="item.id" class="album__item" drag-handle-selector=".el-icon-rank">
        <div class="album__item-wrapper">
          <i class="el-icon-rank"></i>
          <el-input
            class="album__input"
            placeholder="请输入相册名称"
            :value="item.name"
            @input="handleInput(index, $event)"
          ></el-input>
          <div class="album__actions">
            <el-button type="text" @click="handleEdit(item)">编辑相册</el-button>
            <el-button type="text" @click="handleRemove(index)">删除相册</el-button>
          </div>
        </div>
      </draggable>
    </container>

    <el-dialog
      v-if="editing"
      center
      :title="editing.name || '编辑相册'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div class="album-select">
        <div class="album-select__images">
          <choose-images
            v-for="(item, index) of editing.urls"
            :key="item"
            :value="{ id: index, imgUrl: item }"
            class="album-select__img"
            :multiple="false"
            :limit="1"
            @input="handleImageUpdate(index, $event)"
            @delete="handleImageRemove(index)"
          >
            <template #actions>
              <span v-if="index !== 0" class="upload-desc" @click="handleSetCover(index)">置顶</span>
            </template>
          </choose-images>

          <choose-images
            :width="88"
            :height="88"
            class="album-select__img"
            multiple
            :limit="100"
            style="margin-right: 10px"
            @input="handleImageAdd"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import uniq from 'lodash/uniq';
  import emitter from 'element-ui/lib/mixins/emitter';
  import { ChooseImages } from '@/register/wechat3rd';
  import { Container, Draggable } from 'vue-smooth-dnd';

  let uid = 0;

  /**
   * 相册
   */
  export default {
    name: 'AlbumSelect',
    components: {
      ChooseImages,
      Container,
      Draggable,
    },
    mixins: [emitter],
    props: {
      value: {
        /**
         * id: number
         * name: string
         * urls: string[]
         */
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        dialogVisible: false,
        editing: null,
      };
    },
    methods: {
      handleEdit(item) {
        this.editing = this.$plain(item);
        this.dialogVisible = true;
      },
      /**
       * @param {number} index
       * @param {Array<{imgUrl: string}>} evt
       */
      handleImageUpdate(index, evt) {
        const urls = [...this.editing.urls];
        urls[index] = Array.isArray(evt) ? evt[0].imgUrl : evt.imgUrl;
        this.editing.urls = uniq(urls);
      },
      /**
       * @param {Array<{imgUrl: string}>} evt
       */
      handleImageAdd(evt) {
        const urls = [...this.editing.urls];
        urls.push(...evt.map(i => i.imgUrl));

        this.editing.urls = uniq(urls);
      },
      /**
       * @param {number} index
       */
      handleImageRemove(index) {
        this.editing.urls.splice(index, 1);
      },

      handleSetCover(index) {
        const img = this.editing.urls.splice(index, 1);
        this.editing.urls = img.concat(this.editing.urls);
      },

      handleInput(index, evt) {
        const value = [...this.value];
        value[index] = { ...value[index], name: evt };
        this.updateValue(value);
      },

      handleAdd() {
        const value = [...this.value];
        value.push({
          id: `temp-${uid++}`,
          name: '',
          urls: [],
        });
        this.updateValue(value);
      },

      /**
       * 拖拽排序
       */
      handleDrop(evt) {
        const { removedIndex, addedIndex } = evt;
        const value = [...this.value];
        const temp = value[removedIndex];
        value[removedIndex] = value[addedIndex];
        value[addedIndex] = temp;

        this.updateValue(value);
      },
      handleConfirm() {
        const value = [...this.value];
        const idx = value.findIndex(i => i.id === this.editing.id);
        value.splice(idx, 1, this.editing);
        this.dialogVisible = false;
        this.editing = null;
        this.updateValue(value);
      },
      handleRemove(index) {
        const value = [...this.value];
        value.splice(index, 1);
        this.updateValue(value);
      },
      updateValue(value) {
        this.$emit('input', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
    },
  };
</script>

<style lang="less" scoped>
  .album__list {
    padding: 10px;
    padding-bottom: 0;
    border: 1px solid #dcdee0;
    width: 490px;
  }

  .album__item-wrapper {
    display: flex;
    align-items: center;
  }

  .album__item {
    margin-bottom: 10px;
  }

  .album__input {
    width: 220px;
  }

  .album__actions {
    margin-left: 10px;
  }

  .album__actions > .el-button {
    padding: 0 0;
  }

  .album__item-wrapper .el-icon-rank {
    font-size: 20px;
    color: gray;
    margin-right: 10px;
  }

  .album-select {
    height: 325px;
    overflow-y: auto;
  }

  .album-select__img {
    width: 88px !important;
    height: 88px !important;
    line-height: 88px !important;
    margin-top: 10px !important;
    margin-right: 10px !important;
  }

  .album-select__img /deep/ .avatar {
    max-height: 88px;
    max-width: 88px;
  }
</style>
