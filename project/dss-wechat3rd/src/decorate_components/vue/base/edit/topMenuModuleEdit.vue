<template>
  <div class="top-menu-edit" v-if="dataSource">
    <!-- <div class="com-title"><span>顶级菜单</span></div> -->
    <edit-header :data-source="dataSource" name="顶部菜单"></edit-header>

    <div class="com-body">
      <div class="com-row">
        <span class="com-column">背景颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.bgColor"
            :font-color.sync="dataSource.fontColor"
            :font-active-color.sync="dataSource.fontActiveColor"
            :color-model.sync="dataSource.colorModel"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div class="com-row color-row-input">
        <span class="com-column">文字颜色：</span>
        <span class="com-column">
          <div class="bg-input">
            <el-color-picker
              class="com-color-picker"
              v-model="dataSource.titleColor"
              show-alpha
              size="mini"
            ></el-color-picker>
            <el-input class="com-small-input" v-model="dataSource.titleColor" placeholder=""></el-input>
          </div>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">排列方式：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.alignType">
            <el-radio v-for="(item, index) in alignList" :label="item.value" :key="index" border>{{
              item.name
            }}</el-radio>
          </el-radio-group>
        </span>
        <span class="com-column align-type-tips"> 数量多时，建议选择居左，居左排列可左右滑动显示更多； </span>
      </div>

      <div class="top-menu-edit-container">
        <Container :group-name="'3'" :get-child-payload="getChildPayload" @drop="onDrop($event)" drag-class="drag">
          <Draggable v-for="(item, index) in dataSource.data" :key="index">
            <div class="top-menu-edit-item">
              <i class="com-close" @click="deteleItem(index)"></i>
              <el-input v-model="item.title" placeholder="">
                <template slot="prepend">名称</template>
              </el-input>
              <div style="margin-top: 5px">
                <top-menu-link-select :value="selectedOptions(index)" @change="x => choosePage(x, index)" />
              </div>
              <div
                style="margin-top: 5px"
                v-if="dataSource.data[index].linkType === 'unbox' && dataSource.data[index].linkPage === 'label'"
              >
                <el-select
                  v-if="itemLabels && itemLabels.length"
                  :multiple-limit="3"
                  v-model="dataSource.data[index].linkLabels"
                  multiple
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in itemLabels"
                    :key="index"
                    :label="item.categoryName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </Draggable>
        </Container>
      </div>

      <!-- <div class="add-menu-btn">
        <a class="dss-link"
           @click="addCategory">+添加分类</a>
      </div> -->

      <div class="bottom" @click="addCategory">
        <a class="dss-link" href="javascript:void(0);">+添加一个</a>
      </div>

      <div class="bottom" @click="addAllCategory">
        <a class="dss-link" href="javascript:void(0);">一键添加所有分类</a>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import linkSelect from '@/dss-wechat3rd/src/bz_components/linkSelect/index.vue';
  import linkSelectJs from '@/dss-wechat3rd/src/bz_components/linkSelect/index.js';
  import TopMenuLinkSelect from '@/dss-wechat3rd/src/components/top-menu-link-select';
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import './css/common.less';
  import './css/topMenuModuleEdit.less';
  import './css/select-detail.less';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import { queryItemLabelAll } from '@/dss-wechat3rd/src/api/item.js';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'TopMenuModuleEdit',
    mixins: [industryHelperMixin],
    props: {
      dataSource: { type: Object, default: null },
    },
    components: {
      linkSelect,
      colorSelect,
      Container,
      Draggable,
      TopMenuLinkSelect,
      EditHeader,
    },

    data() {
      return {
        linkSelectJs,
        linkReady: false,
        linkPages: [],
        editIndex: 0,
        options: [],
        itemLabels: [],
        alignList: [
          { value: 'left', name: '居左' },
          { value: 'center', name: '居中' },
        ],
      };
    },
    computed: {
      ...mapState({
        customPages: 'customPages',
        currentEditPageIndex: 'currentEditPageIndex',
        env: 'env',
      }),
    },
    async mounted() {
      const batchRequest = this.mGetLinkSelectBatchRequest(linkSelectJs);
      Promise.all(batchRequest).then(batchRes => {
        this.linkReady = batchRes.every(res => {
          return !!res;
        });
      });
      const labels = await queryItemLabelAll();
      this.itemLabels = labels;
    },

    methods: {
      selectedOptions(index) {
        const editItem = this.dataSource.data[index];
        if (editItem.linkPage) {
          const x = JSON.stringify({ id: editItem.linkPage, name: editItem.linkName });
          return [editItem.linkType, x];
        }
      },

      // 屏幕内组件库  内部的拖动
      onDrop(dropResult) {
        const { removedIndex, addedIndex, payload } = dropResult;
        this.dataSource.data.splice(removedIndex, 1);
        this.dataSource.data.splice(addedIndex, 0, payload);
        this.editIndex = addedIndex;
      },

      // 屏幕内组件库内部的拖动 返回具体组件
      getChildPayload(index) {
        return this.dataSource.data[index];
      },

      choosePage(val, editIndex) {
        const item = this.dataSource.data[editIndex];
        if (val && val.length > 1) {
          const page = JSON.parse(val[1]);
          item.linkName = page.name;
          item.linkPage = page.id;
          item.linkType = val[0];
        } else {
          item.linkName = '';
          item.linkPage = '';
          item.linkType = '';
        }
      },

      addCategory() {
        this.dataSource.data.push({
          title: '名称',
          linkType: '',
          linkPage: '',
          linkName: '',
          linkLabels: [],
        });
      },
      // 删除图片
      deteleItem(index) {
        this.dataSource.data.splice(index, 1);
      },

      // 删除图片对应链接
      deleteItemLinkPage(item) {
        item.linkPage = '';
        item.linkName = '';
        item.linkType = '';
      },

      addAllCategory() {
        // 1、获取所有的分类
        const arr = [...linkSelectJs.category, ...linkSelectJs.serverCategory];
        // 2、组件分类数据
        arr.forEach(element => {
          const obj = JSON.parse(element.value);
          let exit = false;
          this.dataSource.data.forEach(item => {
            // 去重  已经存在的不管
            if (item.linkPage === obj.id) {
              exit = true;
            }
          });
          if (!exit) {
            // 3、将数据推入数据源
            this.dataSource.data.push({
              linkName: obj.name,
              linkPage: obj.id,
              linkType: 'category',
              title: obj.name,
            });
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .align-type-tips {
    padding-left: 80px;
    font-size: 14px;
    font-weight: 400;
    color: #566980;
    text-align: left;
  }
</style>
