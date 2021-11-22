<template>
  <div class="goods-label-container">
    <!-- <ele-multi-cascader
      style="width: 177px; display: inline-block;"
      :options="options"
      v-model="labelIds"
      label-key="name"
      value-key="id"
      children-key="children"
      allowLoadChildren
      :loadChildrenMethod="loadChildrenMethod"
      @change="change"
    ></ele-multi-cascader> -->

    <el-popover
      placement="bottom"
      ref="popover"
      width="400"
      popper-class="goods-labels-popover"
      trigger="click"
      :disabled="isDisabledEdit"
      @show="popoverArrow = true"
      @hide="popoverArrow = false">
      <div class="content">
        <div class="category-container" v-loading="loading.list">
          <template v-if="options.length">
            <div class="category-item"
              :class="{'active': category.id === curCategoryId}"
              v-for="(category, index) in options"
              :key="category.id"
              @click="onHandlerLoadChildren(category, index)">
              {{category.name}}
            </div>
          </template>
          <div class="no-data" v-else>暂无数据</div>
        </div>
        <div class="label-container" v-loading="loading.label">
          <template v-if="labelList.length">
            <div class="label-item" v-for="item in labelList" :key="item.id">
              <el-checkbox
                class="cascader-checkbox"
                @click.native.stop
                v-model="item.checked"
                @change="checked => { checkedChange(item, checked) }"
              ></el-checkbox>
              {{item.name}}
            </div>
          </template>
          <div class="no-data" v-else>暂无数据</div>
        </div>
      </div>
      <div slot="reference" class="input-container">
        <el-tag
          v-for="tag in selectedLabels"
          :key="tag.id"
          size="mini"
          :closable="!isDisabledEdit"
          @close="remove(tag)">{{ tag.labelName }}</el-tag>

          <i :class="popoverArrow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="popover-custom-arrow"></i>
      </div>
    </el-popover>

    <el-button type="text" @click="addLabel">快速增加标签</el-button>

    <!-- 增加或修改标签的对话弹框 -->
    <label-edit-dialog
      v-if="showEditLabelPopup"
      :visible.sync="showEditLabelPopup"
      edit-title="增加标签"
      :label-edit-obj="labelEditObj"
      @refresh-data="getLabelClassifyList"
    >
    </label-edit-dialog>
  </div>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import LabelEditDialog from '@/dss-wechat3rd/src/bz_components/goods-label-dialog/index.vue';
// import EleMultiCascader from '@/dss-wechat3rd/src/components/ele-multi-cascader';

export default {
  name: 'goods-label',
  components: {
    LabelEditDialog
    // EleMultiCascader
  },
  props: {
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    //用于请求标签列表的标签类型
    labelType: {
      type: [Number, String],
      default: 1
    },
    list: {
      type: [Number, String, Array],
      default: null
    },
    labelMappings: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: {
        list: false,
        label: false
      },
      labelList: [],
      labelClassify: [], //标签分类列表
      labelTypeId: '', //标签分类id
      // labelType: 1, //用于请求标签列表的标签类型
      labelEditObj: null, //用于传给标签dialog对话框子组件的标签对象
      showEditLabelPopup: false, //是否显示编辑标签弹框
      options: [],
      labelIds: [],
      popoverArrow: false,

      curCategoryId: null,
      selectedLabels: []
    };
  },
  mounted() {
    this.getLabelClassifyList().then(() => {
      if (this.options.length) {
        this.onHandlerLoadChildren(this.options[0], 0);
      }
    });
  },
  watch: {
    list: {
      immediate: true,
      handler() {
        this.labelIds = this.list;
      }
    },
    labelMappings: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.selectedLabels = this.labelMappings.map(item => ({ labelName: item.labelName, id: item.labelId }));
        });
      }
    }
  },
  methods: {
    //添加标签
    addLabel() {
      this.showEditLabelPopup = true;
      this.labelEditObj = {};
      this.labelEditObj.labelType = this.labelType;
    },
    // 查询标签分类列表
    getLabelClassifyList() {
      this.loading.list = true;
      const url = constants.Api.goods.label.cateList;
      let params = {
        pageNo: 0,
        pageSize: 0
      };
      return services
        .get(url, {
          params,
          action: '标签分类列表'
        })
        .then(res => {
          let data = res.data || [];
          data.unshift({ categoryName: '默认分类', id: '0' });
          this.labelClassify = data;
          this.options = data.map(item => ({ name: item.categoryName, id: item.id, loadChildren: false }));
        })
        .always(_ => {
          this.loading.list = false;
        });
    },
    // 标签列表查询
    apiList(labelTypeId) {
      this.loading.label = true;
      const params = {
        pageNo: 0,
        pageSize: 0,
        type: this.labelType,
        status: 1
      };
      if (labelTypeId) params.categoryId = labelTypeId;
      const url = constants.Api.goods.label.list;
      return services.get(url, {
        params,
        action: '标签列表'
      });
      // .done(res => {
      //   //标签列表
      //   this.labelList = (res.data || []).map(item => ({name: item.label, id: item.id, isLeaf: true}));
      // })
      // .catch(() => {
      //   this.labelList = [];
      // })
      // .always(() => {
      //   this.loading.label = false;
      // });
    },
    clickItem(cate) {
      this.labelTypeId = cate.id;
    },
    change(labelIds) {
      this.$emit('selectedLabelId', labelIds);
    },
    loadChildrenMethod(parentItem) {
      let labelTypeId = parentItem.id;
      // return this.apiList(labelTypeId);
      return this.apiList(labelTypeId)
        .then(() => {
          return new Promise((resolve, reject) => {
            resolve(this.labelList);
          });
        })
        .catch(() => {
          return new Promise((resolve, reject) => {
            reject([]);
          });
        });
    },
    onHandlerLoadChildren(category, index) {
      this.curCategoryId = category.id;
      if (!category.loadChildren) {
        this.apiList(category.id)
          .then(res => {
            //标签列表
            const labelList = (res.data || []).map(item => ({ name: item.label, id: item.id }));
            this.labelList = labelList;
            this.options[index].children = labelList;
            this.options[index].loadChildren = true;
            this.handleSelected(this.labelList);
          })
          .catch(() => {
            this.labelList = [];
            this.options[index].loadChildren = false;
          })
          .always(() => {
            this.loading.label = false;
          });
      } else {
        this.labelList = category.children || [];
        this.handleSelected(this.labelList);
      }
    },
    // 处理选中
    handleSelected(curLabelList) {
      if (this.selectedLabels.length) {
        this.selectedLabels.forEach(item => {
          curLabelList.forEach(label => {
            if (item.id === label.id) label.checked = true;
          });
        });
      }
    },
    // 移除标签
    remove(tag) {
      const index = this.selectedLabels.findIndex(label => label.id === tag.id);
      this.selectedLabels.splice(index, 1);
      this.change(this.selectedLabels.map(label => label.id));
    },
    checkedChange(item, checked) {
      if (checked) {
        this.selectedLabels.push({
          labelName: item.name,
          id: item.id
        });
        this.change(this.selectedLabels.map(label => label.id));
        return;
      }

      const index = this.selectedLabels.findIndex(label => label.id === item.id);
      this.selectedLabels.splice(index, 1);
      this.change(this.selectedLabels.map(label => label.id));
    }
  }
};
</script>

<style lang="less" scoped>
.goods-label-container {
  display: flex;
  align-items: center;

  & > span {
    display: flex;
  }
}

.input-container.el-popover__reference {
  display: inline-block;
  width: 167px;
  padding-right: 10px;
  min-height: 30px;
  border: 1px solid #DCDEE0;
  position: relative;

  .popover-custom-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #C0C4CC;
  }
}
</style>

<style lang="less">
.goods-labels-popover.el-popover {
  .content {
    display: flex;

    .category-container, .label-container {
      flex: 1;
      height: 200px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0;

      .no-data {
        width: 100%;
        height: 100%;
        line-height: 200px;
        text-align: center;
      }
    }

    .label-container {
      margin-left: 10px;
    }

    .category-container {
      border-right: 1px solid #DCDEE0;
    }

    .category-item, .label-item {
      padding: 4px 6px;
      height: 20px;
      line-height: 20px;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }

      &.active {
        color: #409eff;
      }
    }
  }
}
</style>