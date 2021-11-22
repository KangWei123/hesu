<template>
  <div
    class="dmp-tags"
    :class="{ tagScroll: chooseGroup, selecting: ifSelectedCdn }"
    ref="dmpTagsWrapperRef"
    v-loading="loading"
  >
    <ul class="tag-group-list" id="lock-con">
      <li
        v-for="(item, index) in filterTags"
        :key="item.code"
        class="tag-group-item"
        :class="{ 'list-border': index !== filterTags.length - 1 }"
      >
        <div class="tag-group-name position-rel">
          {{ item.name }}
          <span>{{ (item.tags && item.tags.length) || 0 }}</span>
        </div>
        <div class="tag-content">
          <ul class="tag-list">
            <li v-for="label in item.tags" :key="label.id" class="tag-item" :ref="'tag' + label.code">
              <el-tooltip effect="dark" :content="label.desc" placement="bottom">
                <template v-if="item.code === 'merchant'">
                  <select-tag-value
                    v-if="showSelectLabel && label.guiType == 'CHECKBOX'"
                    ref="tagSelector"
                    :default-selected="defaultValues"
                    :tag-info="selectedTag"
                    @add-condition="addCondition"
                    :is-show="isShow"
                    @pageChange="pageChange"
                    :page-params="pageParams"
                    @searchName="searchName"
                    :loading_select="loading_select"
                  >
                    <span
                      @click="getLabelData($event, label)"
                      :class="{
                        'tag-item__active': defaultLabel.indexOf(label.id || label.labelCode) !== -1,
                      }"
                      >{{ label.name }}</span
                    >
                  </select-tag-value>
                  <!--我的标签-->
                  <span
                    v-if="!chooseGroup || label.canUse"
                    @click="onMerchantLabel(label)"
                    :class="{
                      'tag-item__active': defaultLabel.indexOf(label.id) !== -1,
                    }"
                    >{{ label.name }}</span
                  >
                  <span v-else @click="onDisabledLabel(label)" class="disabled">{{ label.name }}</span>
                </template>
                <template v-else>
                  <!--基本属性等其他标签-->
                  <!-- popover -->
                  <select-tag-value
                    v-if="showSelectLabel"
                    ref="tagSelector"
                    :default-selected="defaultValues"
                    :tag-info="selectedTag"
                    @add-condition="addCondition"
                    :is-show="isShow"
                    @pageChange="pageChange"
                    :page-params.sync="pageParams"
                    @searchName="searchName"
                    :loading_select="loading_select"
                  >
                    <span
                      @click="getLabelData($event, label)"
                      :class="{
                        'tag-item__active': defaultLabel.indexOf(label.code) !== -1,
                      }"
                      >{{ label.name }}</span
                    >
                  </select-tag-value>
                  <!-- 客户洞察不需要展示 popover -->
                  <span
                    v-else
                    @click="getLabelData($event, label)"
                    :class="{
                      'tag-item__active': defaultLabel.indexOf(label.code) !== -1,
                    }"
                    >{{ label.name }}</span
                  >
                </template>
              </el-tooltip>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';
  import helper from '@/mod-member/src/mixins/helper';
  import SelectTagValue from './SelectTagValue';
  import '../../style/main.less';

  export default {
    props: {
      keyWord: {
        type: String,
        default: '',
      },
      // 是否允许选择标签
      chooseTag: {
        type: Boolean,
        default: false,
      },
      defaultLabel: {
        type: Array,
        default() {
          return [];
        },
      },
      showSelectLabel: {
        type: Boolean,
        default: false,
      },
      // 是否超过最大限制
      chooseLabel: {
        type: Boolean,
        default: false,
      },
      max: {
        type: Number,
        default: 10,
      },
      // 是否允许选择我的标签
      chooseGroup: {
        type: Boolean,
        default: true,
      },
      // 是否选择了至少一个 tag
      ifSelectedCdn: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // keyWord:'',
        selectedTypeIndex: 0,
        tags: [],
        loading: false,
        filterTags: [],
        defaultValues: [], // 选中的标签值
        selectedTag: null,
        dialog: {
          select: false,
        },
        conditions: [],
        top: '0',
        left: '0',
        tabList: [],
        // 触发分页的标志
        isPage: 0,
        isShow: false,
        pageParams: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
        },
        tagCode: '',
        guiType: '',
        pageNo: 1,
        pageSize: 10,
        tagValues: [],
        seekName: null,
        loading_select: false,
        nameCode: '',
      };
    },
    components: {
      SelectTagValue,
    },
    watch: {
      defaultLabel: {
        deep: true,
        handler() {},
      },
    },
    computed: {
      tagsCount() {
        let count = 0;
        for (const groupTag of this.filterTags) {
          if (!groupTag.tags || !groupTag.tags.length) {
            continue;
          }
          count += groupTag.tags.length;
        }
        return count;
      },
    },
    mounted() {
      const throttle = (func, wait = 50) => {
        let lastTime = 0;
        return function (...args) {
          const now = +new Date();
          if (now - lastTime > wait) {
            lastTime = now;
            func.apply(this, args);
          }
        };
      };
      // 处理 tab 焦点问题
      const dmpTagsWrapperRef = this.$refs.dmpTagsWrapperRef;
      // * 在选择或滚动 tags list 的时候发出信号，避免因滚动导致 this.activeTab 改变而触发计算 scrollTop
      dmpTagsWrapperRef.addEventListener('mouseover', () => {
        this.$emit('about-to-scroll', false);
      });
      dmpTagsWrapperRef.addEventListener(
        'scroll',
        throttle(e => {
          const scrollTop = e.target.scrollTop;
          console.log('scroll event trigger');
          this.$emit('scroll-tag-wrapper', {
            ref: dmpTagsWrapperRef,
            val: scrollTop,
          });
        }, 100)
      );

      this.loading = true;
      api
        .getTagTree()
        .done(res => {
          const tags = res.data || [];

          const baseIndex = tags.findIndex(item => {
            return item.code === 'base';
          });
          if (baseIndex > -1) {
            const index = tags[baseIndex].tags.findIndex(item => {
              return item.name === '职业';
            });
            // 删除基本属性里的职业标签
            tags[baseIndex].tags.splice(index, 1);
          }

          const tagMap = {};
          const result = [];
          tags.forEach(tag => {
            // 去重
            if (!tagMap[tag.code]) {
              result.push(tag);
            }
            tagMap[tag.code] = 1;
          });
          this.tags = result;
          const allList = [];
          for (const groupTag of this.tags) {
            // if (!groupTag.tagList || !groupTag.tagList.length) {
            //   continue
            // }
            const childTags = [];
            // 允许选取自定义标签才加入dimensionList数据
            if (groupTag.code === 'merchant' && this.chooseGroup) {
              const newGroup = groupTag.dimensionList;
              newGroup.forEach(item => {
                childTags.push(item);
              });
              // 新建自定义条件标签的展示
              groupTag.tagList.forEach(item => {
                childTags.push(item);
              });
            } else {
              // 不是自定义标签->加入tag数据
              if (groupTag.code !== 'merchant' && this.chooseGroup) {
                groupTag.tagList.forEach(item => {
                  childTags.push(item);
                });
              } else if (!this.chooseGroup) {
                groupTag.tagList.forEach(item => {
                  // 过滤近一个月支付金额汇总和历史支付金额汇总
                  if (item.code !== 'month_order_fee' && item.code !== 'total_order_fee') {
                    childTags.push(item);
                  }
                });
              }
            }
            if (childTags.length) {
              allList.push({
                code: groupTag.code,
                name: groupTag.name,
                tags: childTags,
              });
            }
          }
          if (!this.chooseGroup) {
            this.filterTags = allList.filter(item => {
              return item.code !== 'merchant';
            });
          } else {
            this.filterTags = allList;
          }
          allList.forEach(item => {
            this.tabList.push(item.name);
          });
          this.$emit('get-tab', this.tabList);
        })
        .always(() => {
          this.loading = false;
        });
    },
    methods: {
      // 重新將Condition赋值回来避免丢失
      returnCondition(val) {
        this.conditions = val;
      },
      // 标签查找
      searchTags() {
        if (!this.keyWord) {
          const allList = [];

          for (const groupTag of this.tags) {
            if (!groupTag.tagList || !groupTag.tagList.length) {
              continue;
            }
            const childTags = [];
            // 自定义标签处理
            if (groupTag.code === 'merchant' && this.chooseGroup) {
              for (const tag of groupTag.dimensionList) {
                childTags.push(tag);
              }
              for (const tag of groupTag.tagList) {
                childTags.push(tag);
              }
            } else {
              if (groupTag.code !== 'merchant') {
                for (const tag of groupTag.tagList) {
                  childTags.push(tag);
                }
              }
            }
            if (childTags.length) {
              allList.push({
                code: groupTag.code,
                name: groupTag.name,
                tags: childTags,
              });
            }
          }
          this.filterTags = allList;
          return;
        }
        const lowerKeyword = this.keyWord.toLowerCase();
        const list = [];
        this.filterTags = [];
        for (const groupTag of this.tags) {
          if (!groupTag.tagList || !groupTag.tagList.length) {
            continue;
          }
          const childTags = [];
          if (groupTag.code === 'merchant' && this.chooseGroup) {
            for (const tag of groupTag.dimensionList) {
              if (tag.name.toLowerCase().indexOf(lowerKeyword) > -1) {
                childTags.push(tag);
              }
            }
            for (const tag of groupTag.tagList) {
              if (tag.name.toLowerCase().indexOf(lowerKeyword) > -1) {
                childTags.push(tag);
              }
            }
          } else {
            if (groupTag.code !== 'merchant') {
              for (const tag of groupTag.tagList) {
                if (tag.name.toLowerCase().indexOf(lowerKeyword) > -1) {
                  childTags.push(tag);
                }
              }
            }
          }
          if (childTags.length) {
            list.push({
              code: groupTag.code,
              name: groupTag.name,
              tags: childTags,
            });
          }
        }
        this.filterTags = list;
        console.log('filterTags---------->', this.filterTags);
      },
      getLabelData(e, tag) {
        console.log(tag, 'tag参数');
        console.log(tag.code, 'tag参数');
        // this.dialog.select=false
        // 标签个数超过最大限制->不可点击
        if (this.conditions.length >= this.max) {
          this.$message(`最多选择${this.max}个标签`);
          this.dialog.select = false;
          return;
        }
        this.selectedTag = null; // 每次点击基础标签-标签内容清空，重新调对应标签接口数据
        if (this.chooseTag) {
          this.selectedTag = tag;
          if (this.showSelectLabel) {
            this.dialog.select = true;
          } else {
            this.$emit('tag-choose', tag);
          }
          return;
        }
        // if (tag.values && tag.values.length) {
        //   this.selectedTag = tag
        //   if (this.showSelectLabel) {
        //     this.dialog.select = true
        //   } else {
        //     this.$emit('tag-choose', tag)
        //   }
        //   return
        // }
        // 判断新建标签和自定义的参数取维度
        if (tag.labelCode) {
          this.tagCode = tag.labelCode;
        } else {
          this.tagCode = tag.code;
        }
        // 判断新建条件标签取纬度值
        this.guiType = tag.guiType;
        tag.values = [];
        this.loading_select = true;
        // 判断会员等级、最近一次购买单品、最近一次购买品类进行分页
        if (tag.desc == '会员等级' || tag.desc == '最近一次购买单品' || tag.desc == '最近一次购买品类') {
          this.isPage = 1;
          this.isShow = true;
          const params = {
            tagCode: this.tagCode,
            guiType: this.guiType,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            isPaging: this.isPage,
            name: this.seekName,
          };
          api
            .getTags(params)
            .then(res => {
              this.tagValues = res.data || [];
              tag.values = this.tagValues;
              this.pageParams.pageNo = res.pageNo;
              this.pageParams.pageSize = res.pageSize;
              this.pageParams.totalCount = res.totalCount;
              this.selectedTag = tag; // 默认标签填充
              if (this.showSelectLabel) {
                this.dialog.select = true;
              } else {
                this.$emit('tag-choose', tag);
              }
            })
            .finally(() => {
              this.loading_select = false;
            });
        } else {
          this.isShow = false;
          const params = {
            tagCode: this.tagCode,
            guiType: this.guiType,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            isPaging: 0,
            name: this.seekName,
          };
          // 首次打开该标签->调接口获得标签数据
          api
            .getTags(params)
            .then(res => {
              this.tagValues = res.data || [];
              tag.values = this.tagValues;
              this.pageParams.pageNo = res.pageNo;
              this.pageParams.pageSize = res.pageSize;
              this.pageParams.totalCount = res.totalCount;
              this.selectedTag = tag; // 默认标签填充
              if (this.showSelectLabel) {
                this.dialog.select = true;
              } else {
                this.$emit('tag-choose', tag);
              }
            })
            .finally(() => {
              this.loading_select = false;
            });
        }
      },
      getTagsList() {
        this.loading_select = true;
        // 首次打开该标签->调接口获得标签数据
        const params = {
          tagCode: this.tagCode,
          guiType: this.guiType,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          isPaging: this.isPage,
          name: this.seekName,
        };
        api
          .getTags(params)
          .then(res => {
            this.selectedTag.values = res.data;
            const canUse = this.selectedTag.canUse;
            this.selectedTag.canUse = 'asdf';
            this.selectedTag.canUse = canUse;
            this.pageParams.pageNo = res.pageNo;
            this.pageParams.pageSize = res.pageSize;
            this.pageParams.totalCount = res.totalCount;
          })
          .finally(() => {
            this.loading_select = false;
          });
      },
      // 处理自定义标签
      onMerchantLabel(tag) {
        if (!this.chooseGroup) {
          this.$emit('group-choose', tag);
        } else {
          // 标签个数超过最大限制->不可点击
          if (this.conditions.length >= this.max) {
            this.$message(`最多选择${this.max}个标签`);
            this.dialog.select = false;
            return;
          }
          this.selectedTag = tag; // 默认标签填充
          const finded = this.conditions.find(item => item.strValue === tag.name);
          console.log(finded, 'finded');
          if (finded) {
            // continue
            return;
          } else {
            // 首次打开自定义标签->点击选中
            this.conditions.push({
              id: helper.newId(),
              type: 'group',
              tag: tag,
              values: {
                name: tag.name,
                dimValue: tag.name,
              },
              strValue: tag.name,
            });
          }
          if (this.conditions >= this.max) {
            this.$emit('group-choose', tag, []); // 超过最大限制，下一次已选中标签清空
            return;
          }
          console.log('conditions--------->', this.conditions);
          this.$emit('group-choose', tag, this.conditions);
        }
      },
      onDisabledLabel() {
        this.$message({
          message: '新建"我的标签"请于次日进行人群画像分析',
          type: 'warning',
        });
      },
      onClear() {
        this.conditions = [];
        this.defaultValues = [];
      },
      // 添加选择的标签值
      addCondition(tagInfo, resultList) {
        if (!resultList || resultList.length === 0) {
          return;
        }
        let strValue = '';
        const values = resultList.map(item => {
          strValue += `、${item.name}`;
          return {
            name: item.name,
            dimValue: item.dimValue,
          };
        });
        strValue = strValue.replace('、', '');
        // 基本属性选择过做修改操作
        const baseCondition = this.conditions.filter(item => {
          return item.tagCode !== 'label_value';
        });
        // 处理新建标签的值添加是相同
        let nameStr = '';
        tagInfo.values.forEach(val => {
          nameStr = val.name;
        });
        const finded = baseCondition.find(item => item.tag.code === tagInfo.code && item.strValue === nameStr);
        if (finded) {
          finded.values = values;
          finded.strValue = strValue;
          return;
        }
        // 基本属性没有选择过做新增操作
        if (baseCondition) {
          const lastElement = this.conditions.slice(-1);
          this.conditions.push({
            id: helper.newId(),
            type: 'tag',
            tag: tagInfo,
            values: values,
            strValue: strValue,
            guiType: tagInfo.guiType,
          });
        }

        if (this.conditions >= this.max) {
          this.$emit('tag-choose', tagInfo, []); // 超过最大限制，下一次已选中标签清空
          return;
        }
        this.$emit('tag-choose', tagInfo, this.conditions);
      },
      // 分页时间触发
      pageChange(val) {
        if (this.isShow == true && (this.pageSize != val.pageSize || this.pageNo != val.pageNo)) {
          this.pageSize = val.pageSize;
          this.pageNo = val.pageNo;
          this.getTagsList();
        }
      },
      // search 模糊搜索
      searchName(val) {
        this.pageParams.pageNo = 1;
        this.seekName = val;
        this.getTagsList();
      },
    },
  };
</script>
<style lang="less">
  .tag-item {
    float: left;
    margin: 0 25px 10px 0;
    font-size: 13px;
    font-family: 'Montserrat-Bold';
    font-weight: 600;
    color: #545454;
    width: 20%;
    position: relative;

    .tag-item__active {
      color: #256eff;
      background: #ebf2ff;
      border: 1px solid #ebf2ff;
    }

    .disabled {
      background: #f4f4f5;
      color: #bcbec2;
    }

    & > span {
      border-radius: 19px;
      padding: 0 14px;
      height: 28px !important;
      line-height: 28px !important;
      color: #999999;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      background: #f5f7fa;
      float: left;
      border: 1px solid #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
      white-space: nowrap;
      max-width: 100%;
      outline: 0;
      cursor: pointer;

      &:hover {
        background: #f2f3f5;
        border: 1px solid #ccc;
        color: #000;
      }

      &:active {
        background: #ebf2ff;
        color: #256eff;
        border: 1px solid #ebf2ff;
      }

      &.tag-item__active {
        background: #ebf2ff;
        color: #256eff;
        border: 1px solid #ebf2ff;
      }
    }
  }

  /* 标签激活项 */
  .dmp-tags .tag-content .tag-list .tag-item span.tag-item__active {
    background: #ebf2ff !important;
    color: #256eff !important;
    border: 1px solid #ebf2ff !important;
  }

  // // 已经选择至少一个标签
  // .dmp-tags.selecting {
  //   // height: calc(100vh - 340px);
  //   height: 500px;
  // }
  .dmp-tags {
    // height: calc(100vh - 340px);
    height: calc(100vh - 195px - 150px - 52px);
  }
</style>
