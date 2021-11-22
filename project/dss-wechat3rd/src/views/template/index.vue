<template>
  <div>
    <div style="padding-bottom: 20px">
      <el-button @click="onGeneratePage">
        生成页面
      </el-button>
    </div>
    <div class="tpl-container">
      <div class="drag-container">
        <draggable class="app-aside-drag" :options="dragOption" @end="onAsideDragEnd">
          <div class="app-aside-list"
               v-for="component in dragComponents"
               :type="component.name"
               :componentName="component.name"
               :key="component.name">
            <div class="aside-item-body">
              <i class="aside-item-ele"></i>
              <span class="aside-item-ele">{{ component.title }}</span>
            </div>
          </div>
        </draggable>
      </div>
      <div class="tpl-h5-container app-phone">
        <div style="cursor: pointer"
             @click="onComponentEditorClick(-1)"
             :class="{ active: editIndex === -1 }">
          <WdPage :prop="h5Config.page.prop">

          </WdPage>
        </div>

        <draggable class="app-phone-body app-sort"
                   v-model="h5Config.components"
                   :options="sortOption"
                   @sort="onComponentSort"
                   @add="onComponentAdd">
          <div class="widget-border widget-editor"
               v-for="(component, index) in h5Config.components"
               :key="index"
               v-if="component.prop"
               :class="{ active: index === editIndex }"
               @click="onComponentEditorClick(index)"
               style="cursor: pointer">
            <component class="component"
                       :is="component.name"
                       :prop="component.prop">
            </component>
            <el-popover width="160" ref="popover">
              <p>您确定要删除这行内容吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" size="mini" @click="$refs.popover[index].doClose()">取消
                </el-button>
                <el-button type="danger" size="mini" @click="onComponentDeleteClick(index)">确定</el-button>
              </div>
              <i class="el-icon-delete component-delete"
                 @click.stop
                 slot="reference">
              </i>
            </el-popover>
          </div>
        </draggable>

      </div>

      <div class="edit-container">
        <component v-if="currentItem"
                   :is="currentItem.name + 'Editor'"
                   :prop="currentItem.prop">

        </component>
      </div>
    </div>
  </div>

</template>

<script>
  import service from '@/dss-common/utils/services';

  import './common.css';
  import TemplateRepository from './TemplateRepository';
  import WdTextEditor from '../../../../dss-store-produce/src/common/components/editors/WdTextEditor';
  import WdGoodsEditor from '../../../../dss-store-produce/src/common/components/editors/WdGoodsEditor';
  import WdPageEditor from '../../../../dss-store-produce/src/common/components/editors/WdPageEditor';
  import WdText from '../../../../dss-store-produce/src/common/components/WdText';
  import WdGoods from '../../../../dss-store-produce/src/common/components/WdGoods';
  import WdPage from '../../../../dss-store-produce/src/common/components/WdPage';

  import Draggable from 'vuedraggable';

  export default {
    name: 'index',
    components: {
      Draggable,
      WdText,
      WdTextEditor,
      WdGoods,
      WdGoodsEditor,
      WdPage,
      WdPageEditor
    },
    data() {
      return {
        h5Config: {
          page: {
            name: 'WdPage',
            prop: {
              title: '我的第一个模板页面'
            }
          },
          components: []
        },
        dragComponents: TemplateRepository.ComponentList,
        dragOption: {
          group: {
            name: 'components', //这个很重要，其他的与之能产生关联的拖拽框就靠这name 一定要一致
            pull: 'clone',
            put: false
          },
          sort: false //默然为true。这里我们只需要他拖拽，无需能拖动排序
        },
        sortOption: {
          group: {
            name: 'components', //前面说的name,在这里就起了作用，不一样，是不能放入的
            pull: true,
            put: true
          },
          sort: true,
          animation: 300 //给了个动画，看起来舒服些
        },
        editIndex: -1
      };
    },
    computed: {
      currentItem() {
        return this.editIndex !== -1 ? this.h5Config.components[this.editIndex] : this.h5Config.page;
      }
    },
    methods: {
      /**
       * 拖拽完成之后的回调
       */
      onAsideDragEnd(res) {},

      /**
       * 组件重新排序
       */
      onComponentSort(res) {
        //组件排序时的回调，由于Draggable绑定了v-model，因此这里不需要处理数据
      },

      /**
       * 组件添加进来
       * @param res
       */
      onComponentAdd(res) {
        //拖拽后添加到模板的组件名
        //拖拽的最外层需要加上:componentName，这样才能找到componentName字段的值，可以任意定义该字段，只需要保持一致即可。
        const cloneComponentName = res.clone.attributes.componentName.value;
        //将相应的组件的配置信息添加到模板配置里
        this.h5Config.components.push(TemplateRepository.ComponentConfig[cloneComponentName]());
        this.editIndex = this.h5Config.components.length - 1;
      },

      /**
       * 生成页面
       */
      onGeneratePage() {
        const params = {
          config: JSON.stringify(this.h5Config),
          name: this.h5Config.page.prop.title
        };
        service
          .post('/wp/h5Template/add', params, {
            action: '生成模板'
          })
          .done(res => {
            console.log(JSON.stringify(res));
          });
      },

      onComponentEditorClick(index) {
        this.editIndex = index;
        console.log('onComponentEditorClick: ' + this.editIndex);
      },

      onComponentDeleteClick(index) {
        this.$refs.popover[index].doClose();
        this.h5Config.components.splice(index, 1);
        this.editIndex = this.h5Config.components.length - 1;
      }
    }
  };
</script>

<style lang="less">
  .tpl-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 1000px;

    .tpl-component-container {

      .el-col {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .tpl-h5-container {
      .el-popper[x-placement^=right] {
        margin-left: 50px;
      }
      .widget-editor {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .component {
        flex: 1;
      }
      .component-delete {
        margin-left: 10px;
      }
    }

    .edit-container {
      width: 400px;

    }
  }


</style>
