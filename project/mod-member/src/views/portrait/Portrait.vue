<template>
  <div class="portrait">
    <div
      class="portrait-bread"
      v-if="
        !$route.path.includes('manage/group') &&
        !$route.path.includes('manage/overview') &&
        !$route.path.includes('manage/overview')
      "
    >
      <span @click="$router.push('/portrait/manage/all')" :class="$route.path.includes('all') ? 'active' : ''"
        >全部标签</span
      >
      <span @click="$router.push('/portrait/manage/myTag')" :class="$route.path.includes('myTag') ? 'active' : ''"
        >我的标签</span
      >
    </div>
    <div v-if="$route.path.includes('all')">
      <div class="page-content">
        <div class="tag-count-content">
          <el-input
            class="input"
            placeholder="请输入你需要的标签"
            @blur="callportraittagsSearch"
            @keyup.enter.native="callportraittagsSearch"
            v-model.trim="keyword"
          />
          <el-button type="primary" @click="callportraittagsSearch">搜索</el-button>
        </div>
        <div class="portrait-page-warpper">
          <!-- tab bar -->
          <div class="tab-pane">
            <a
              class="tab-item"
              :class="selectedTab === item ? 'active' : ''"
              v-for="(item, index) in tabList"
              :key="index"
              @click="chooseTab($event, item)"
              >{{ item }}</a
            >
          </div>
          <portrait-tags
            ref="portraitTagsWrapperRef"
            :show-select-label="true"
            :choose-label="chooseTags"
            :max="MAX"
            :key-word="keyword"
            :class="{ shadow: showShadow }"
            :default-label="defaultLabel"
            :if-selected-cdn="!!conditions.length"
            @get-tab="getTab"
            @group-choose="groupChoose"
            @tag-choose="tagChoose"
            @scroll-tag-wrapper="onScrollTagWrapper"
            @about-to-scroll="onAboutToScroll"
          ></portrait-tags>
        </div>
      </div>
      <!-- 已选条件 -->
      <div v-if="conditions.length > 0" class="portrait-condition-container">
        <div class="portrait-condition-wrapper">
          <div class="portrait-condition-text" :class="{ 'portrait-condition-text__disabled': defalutCondEditable }">
            <p class="center-index">
              <img src="../../images/icon/filter.png" class="portrait-svg" />
              <span>已选条件</span>
            </p>
            <button class="cbutton clear-btn light" @click="onClear" :disabled="conditions.length === 0">
              <i class="fa fa-trash-o light-icon" aria-hidden="true"></i>
              清空
            </button>
          </div>
          <div class="portrait-bar-list">
            <div class="action-bar" v-for="(cdn, index) in conditions" :key="index">
              <template v-if="cdn.type === 'brackets'">
                <span class="title" :title="cdn.tag.name">{{ cdn.tag.name }}</span>
                <el-button
                  type="danger"
                  @click="onDelCdn(cdn)"
                  class="btn-delete"
                  icon="el-icon-close"
                  circle
                ></el-button>
              </template>
              <template v-else>
                <span class="title" :title="cdn.tag.name">{{ cdn.tag.name }}：</span>
                <span class="value" :title="cdn.strValue">{{ cdn.strValue }}</span>
                <el-button
                  type="danger"
                  @click="onDelCdn(cdn)"
                  class="btn-delete"
                  icon="el-icon-close"
                  circle
                ></el-button>
              </template>
            </div>
          </div>
        </div>
        <div class="portrait-condition-btns">
          <el-button type="primary" size="mini" round @click="gotoHxfx">画像分析</el-button>
        </div>
      </div>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import './portrait.less';
  import PortraitTags from './PortraitTags';
  // import myLabel from './myLabel';
  import helper from '@/mod-member/src/mixins/helper';
  // import '../../css/dmp.less';
  import Vue from 'vue';
  const bus = new Vue();

  export default {
    components: {
      PortraitTags,
      // myLabel,
    },
    data() {
      return {
        area: [],
        tagKeyword: '',
        defalutCondEditable: false,
        selectedTag: null,
        dialog: {
          select: false,
        },
        groupInfo: null,
        conditions: [],
        keyword: '',
        defaultValues: [], // 选中的标签值
        defaultLabel: [], // 选中的标签
        showShadow: false,
        primaryBtnText: '增加条件',
        tabList: [],
        selectedTab: '',
        labelCount: 0,
        MAX: 50,
        chooseTags: true,
        // tags list 列表 如果是 scroll 状态则不处理 scroll event trigger
        scrolling: false,
      };
    },
    computed: {
      valueConditions() {
        return this.conditions.filter(cdn => cdn.type !== 'symbol');
      },
    },
    watch: {
      conditions: {
        deep: true,
        handler() {
          this.defaultLabel = []; // 标签清空->默认标签清空
          // if (this.conditions.length > this.MAX) {
          //   return
          // }
          if (typeof this.conditions === 'string') {
            this.conditions = JSON.parse(this.conditions);
          }
          // else {
          //   this.conditions = this.conditions;
          // }
          this.conditions.forEach(item => {
            if (item.type === 'tag') {
              this.defaultLabel.push(item.tag.code, item.tag.labelCode);
            }
            // 自定义标签
            else if (item.type === 'group') {
              this.defaultLabel.push(item.tag.id);
            }
          });
        },
      },
      $route(val, oldVal) {
        this.$nextTick(() => {
          if (this.$refs.portraitTagsWrapperRef) {
            this.$refs.portraitTagsWrapperRef.returnCondition(this.conditions);
          }
        });
        // console.log('val',val,oldVal)
        if (val.name === 'allTag' && oldVal.name === 'portraitSave') {
          this.conditions = [];
          this.defaultLabel = [];
        }
      },
    },
    created() {
      const { cdns, groupInfo = null, area = [] } = this.$route.params;
      // 来源于画像分析的返回选择标签
      if (this.$route.params.conditions) {
        this.conditions = this.$route.params.conditions;
      }
      if (cdns) {
        this.conditions = cdns;
      } else {
        this.conditions = [];
      }
      // groupInfo在人群编辑时会以参数传递过来
      this.groupInfo = groupInfo;
      this.area = area;
    },
    mounted() {
      console.log(this.conditions, '我的标签.conditions');
      this.selectedTab = '我的标签';
    },
    methods: {
      // about to scroll
      onAboutToScroll() {
        this.scrolling = false;
      },
      // scrollTop
      onScrollTagWrapper({ ref: elem, val: currentScrollTop }) {
        // 比较获取滚动事件当前 tab
        const offsetTopArr = this.computeTabsWrapperOffsetTop(elem, currentScrollTop);
        let matchedIndex;
        offsetTopArr.forEach((item, index) => {
          if (item <= currentScrollTop) {
            matchedIndex = index;
          }
        });
        if (!this.scrolling) {
          this.selectedTab = this.tabList[matchedIndex];
        }
      },
      // 计算 tab 所在的 offsetTop
      computeTabsWrapperOffsetTop(elem, scrollTop) {
        const tagsElem = elem.querySelectorAll('.tag-group-item');
        const offsetTopArr = Array.from(tagsElem).map(item => item.offsetTop);
        return offsetTopArr;
      },
      chooseTab(event, selectedTab) {
        this.scrolling = true;
        const portraitTagsWrapperRef = this.$refs.portraitTagsWrapperRef.$el;
        this.selectedTab = selectedTab;
        // 找到点击tab所在的index
        const index = this.tabList.findIndex(item => {
          return item === selectedTab;
        });
        portraitTagsWrapperRef.children[0].children[index].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      },
      // 跳转画像分析
      gotoHxfx() {
        const strCdn = JSON.stringify(helper.formatCondition(this.conditions)); // 条件标签转为后端可识别的格式
        this.$router.push({
          name: 'portraitOverview',
          params: {
            stores: JSON.stringify(helper.areasToString(this.area)),
            strCdn: strCdn,
            cdns: this.conditions,
            area: this.area,
            groupInfo: this.groupInfo,
          },
        });
        localStorage.setItem('strCdn', strCdn);
        localStorage.setItem('conditions', JSON.stringify(this.conditions));
      },
      callportraittagsSearch() {
        this.$refs.portraitTagsWrapperRef.searchTags();
      },
      searchTags() {
        this.keyword = this.tagKeyword;
      },
      // 我的标签页选择的标签操作
      tagChoose(tagInfo, conditions) {
        this.selectedTag = tagInfo; // 弹窗展示的内容
        this.defaultValues = [];
        // 该标签是否已选
        const finded = this.conditions.find(cdn => cdn.tag.code === tagInfo.code);
        if (finded) {
          this.defaultValues = finded.values;
        }
        if (conditions) {
          this.conditions = conditions;
        }
      },
      // 自定义标签选择
      groupChoose(tagInfo, conditions) {
        if (this.conditions.length > this.MAX) {
          this.$message(`最多选择${this.MAX}个标签`);
          return;
        }
        if (conditions) {
          this.conditions = conditions;
        }
      },
      // 清空标签
      onClear() {
        this.$refs.portraitTagsWrapperRef.onClear();
        this.conditions = [];
        this.chooseTags = true; // 开启选择开关
        bus.$emit('clearAllTags');
      },
      // 删除某个标签
      onDelCdn(cdn) {
        const index = this.conditions.findIndex(item => item.id === cdn.id);
        this.conditions.splice(index, 1);
        this.chooseTags = true; // 开启选择开关
        // bus.$emit('clearTagById', cdn)
      },
      // 从基本属性获取tab列表
      getTab(item) {
        this.tabList = item;
      },
      filtrateCondition() {
        const strCdn = JSON.stringify(helper.formatCondition(this.conditions));
        this.$router.push({
          name: 'portraitOverview',
          params: {
            stores: JSON.stringify(helper.areasToString(this.area)),
            strCdn: strCdn,
            cdns: this.conditions,
            area: this.area,
            groupInfo: this.groupInfo,
          },
        });
      },
      formatParam() {
        const cdns = this.conditions.map(cdn => {
          console.log(cdn, 'cdn');
          if (cdn.type === 'group') {
            return {
              crowdId: cdn.value,
            };
          }
          return {
            tagCode: cdn.tag.code,
            dimVals: cdn.values.map(v => v.dimValue),
          };
        });
        return cdns;
      },
    },
  };
</script>
