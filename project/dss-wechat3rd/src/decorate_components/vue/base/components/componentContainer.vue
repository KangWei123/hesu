<template>
  <container
    :id="uid"
    :class="['component-container', { showBorder }]"
    :style="style"
    :group-name="DROP_GROUP"
    :get-ghost-parent="handleGetGhostParent"
    :should-accept-drop="shouldAcceptDrop"
    :get-child-payload="getChildPayload"
    @drop="handleDrop"
  >
    <template v-if="dataSource && dataSource.children && dataSource.children.length">
      <!-- 下级组件 -->
      <draggable v-for="(item, index) in dataSource.children" :key="item.id + '_' + index">
        <div class="screen-x nested" @click.stop="handleFocusComponent(item)">
          <component class="field" :is="item.id" :item="item" :data-source.sync="item.config"></component>
          <div class="cover" :class="{ select: isEditing(item) }">
            <i v-show="canSave()" class="com-close" v-if="canEdit(item)" @click.stop="handleRemoveComponent(index)"></i>
          </div>
        </div>
      </draggable>
    </template>
    <template v-else>
      <div class="component-container__placeholder">请拖拽组件到这里</div>
    </template>
  </container>
</template>

<script>
  import { Container, Draggable } from 'vue-smooth-dnd';
  import { DROP_GROUP } from '../../../constants';
  import { handleDrop } from '../../../utils/drop-handle';

  let uid = 0;

  /**
   * 拖拽组件容器
   */
  export default {
    name: 'ComponentContainer',
    inject: ['isEditing', 'setEditing', 'canEdit', 'canSave'],
    props: {
      showBorder: {
        type: Boolean,
        default: true,
      },
      dataSource: {
        type: Object,
        default: () => ({ children: [] }),
      },
    },
    components: { Container, Draggable },
    data() {
      return {
        uid: `nested-${uid++}`,
        DROP_GROUP,
      };
    },
    computed: {
      style() {
        const mode = this.dataSource.bgMode;
        return {
          backgroundImage: this.dataSource.bg ? `url(${this.dataSource.bg})` : undefined,
          backgroundRepeat: mode === 'repeat' ? 'repeat' : 'no-repeat',
          backgroundSize: mode === 'fill' ? 'cover' : mode === 'contain' ? 'contain' : 'auto',
        };
      },
    },
    methods: {
      getChildPayload(index) {
        return this.dataSource.children[index];
      },
      shouldAcceptDrop(source, payload) {
        // 不允许嵌套分组
        if (payload && (payload.id === 'componentContainer' || payload.id === 'navigationContainer')) {
          return false;
        }

        return true;
      },
      handleDrop(evt) {
        console.log('container drop', evt);
        const item = handleDrop(evt, this.dataSource.children);
        if (item) {
          this.setEditing(item);
        }
      },
      handleGetGhostParent() {
        return document.getElementById('decoration-canvas');
      },
      handleFocusComponent(item) {
        this.setEditing(item);
      },
      handleRemoveComponent(idx) {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.children.splice(idx, 1);
      },
    },
  };
</script>

<style lang="scss">
  .component-container {
    $color: #e16914;
    $zidx: 20;

    &.showBorder::after {
      content: '';
      display: block;
      position: absolute;
      border: 1px dashed $color;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $zidx;
      pointer-events: none;
    }

    &.showBorder::before {
      content: '容器';
      position: absolute;
      cursor: move;
      top: 0;
      left: 0px;
      background-color: $color;
      color: white;
      padding: 1px 4px;
      font-size: 12px;
      z-index: $zidx + 1;
    }

    &__placeholder {
      height: 200px;
      text-align: center;
      line-height: 200px;
      color: gray;
    }

    // 避免被内部组件覆盖
    & + .cover > .com-close {
      z-index: $zidx !important;
    }
  }
</style>
