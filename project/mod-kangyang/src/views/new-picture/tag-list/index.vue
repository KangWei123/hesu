<template>
  <div class="picture-content">
    <left-layout v-if="!isElderSpace" />

    <div class="right-layout" ref="rightLayout" @click="clearState">
      <div class="head-operate">
        <div>
          <el-button icon="el-icon-plus" type="primary" @click="addTag">新增标签</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="addGroup">新增群组</el-button>
        </div>
        <div class="search-box">
          <el-input
            placeholder="搜索标签"
            clearable
            v-model.trim="keyword"
            @keyup.enter.native="getTagList"
            @clear="getTagList"
          ></el-input>
          <el-button type="primary" @click="getTagList">搜索</el-button>
        </div>
      </div>

      <div v-loading="loading">
        <!-- 未分组标签 -->
        <div class="tag-group">
          <h3 class="group-title">
            未分组标签
            <el-checkbox v-model="checkedAllUG" @change="checkboxOfAllUGChange">全选</el-checkbox>
            <button class="delete-btn" v-if="hasCheckedTag" @click="deleteTag(0)" style="left: 165px">删除</button>
          </h3>
          <el-scrollbar class="ungrouped-scrollbar" ref="ungroupedListScrollbar">
            <dnd-container class="tag-list" behaviour="copy" group-name="tag-draggable" :get-child-payload="getTag">
              <dnd-draggable v-for="(tag, index) in ungroupedList" :key="tag.id">
                <div
                  class="tag"
                  :class="{ active: activeIndex === `a-${index}`, 'el-icon-check': tag.checked }"
                  @click.stop="handleChooseTag($event, 0, index)"
                >
                  {{ tag.tagValue }}
                  <span class="count" v-if="tag.referenceTimes">{{ tag.referenceTimes }}</span>
                </div>
              </dnd-draggable>
            </dnd-container>
          </el-scrollbar>
        </div>

        <!-- 标签群组 -->
        <div :style="`opacity:${showGroup ? 1 : 0}`">
          <div class="tag-group border-none">
            <h3 class="group-title">
              标签群组
              <el-checkbox v-model="checkedAllGroup" @change="checkboxOfAllGroupChange">全选</el-checkbox>
              <button class="delete-btn" v-if="hasCheckedTagOfGroups" @click="deleteGroupOrTag(0)">删除</button>
            </h3>
          </div>
          <el-scrollbar
            class="group-scrollbar"
            ref="groupListScrollbar"
            :wrap-style="`max-height: calc(100vh - ${scrollbarHeight}px;`"
          >
            <dnd-container
              @drop="onDrop($event, topIndex)"
              group-name="tag-draggable"
              class="tag-group pt0"
              v-for="(item, topIndex) in groupList"
              :key="item.id"
            >
              <div class="group-name" :style="topIndex === 0 ? 'margin-top:0;' : ''">
                <el-checkbox v-model="item.checked" @change="checkboxOfGroupChange(topIndex)">{{
                  item.groupName
                }}</el-checkbox>
                <div class="group-operate">
                  <a href="javascript:" @click="editName(0, topIndex)"></a>
                  <a href="javascript:" @click="deleteGroupOrTag(1, topIndex)"></a>
                </div>
              </div>
              <div class="group-wrap" :style="`${!showMoreBtn[topIndex] ? 'padding-right: 0;height:auto;' : ''}`">
                <ul class="tag-list" ref="groupList">
                  <li v-for="(tag, index) in item.materialTagList" :key="tag.id">
                    <div
                      class="tag"
                      :class="{ active: activeIndex === `${topIndex}-${index}`, 'el-icon-check': tag.checked }"
                      @click.stop="handleChooseTag($event, 1, topIndex, index)"
                    >
                      {{ tag.tagValue }}
                      <span class="count" v-if="tag.referenceTimes">{{ tag.referenceTimes }}</span>
                    </div>
                  </li>
                </ul>

                <div class="more-btn tag" v-if="showMoreBtn[topIndex]" @click="setMoreBtn(topIndex)">
                  <i class="el-icon-arrow-down"></i>
                </div>
              </div>
            </dnd-container>
          </el-scrollbar>
        </div>
      </div>

      <!-- 悬浮操作层 -->
      <operations
        :location-style="tagLocation"
        :group-list="groupList"
        v-show="showOperations"
        @handleOperate="handleOperate"
        :active-index="activeIndex"
      ></operations>
    </div>

    <!-- 新增标签对话框 -->
    <simple-form
      :visible.sync="showAddTagPopup"
      v-if="showAddTagPopup"
      :title="`${isAdd ? '新增' : '编辑'}标签`"
      :default-value="isAdd ? '' : defaultValue"
      label="标签名称："
      placeholder="请输入标签名称"
      @handleSubmit="handleAddTag"
      :byte="10"
      :loading="dialogLoading"
    ></simple-form>

    <!-- 新增群组对话框 -->
    <simple-form
      :visible.sync="showAddGroupPopup"
      v-if="showAddGroupPopup"
      :title="`${isAdd ? '新增' : '编辑'}群组`"
      :default-value="isAdd ? '' : defaultValue"
      label="群组名称："
      placeholder="请输入群组名称"
      @handleSubmit="handleAddGroup"
      :byte="10"
      :loading="dialogLoading"
    ></simple-form>
  </div>
</template>

<script>
  import leftLayout from '../components/left-layout/index.vue';
  import simpleForm from '../components/simple-form-dialog/index.vue';
  import operations from './components/operations.vue';
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import { Container, Draggable } from 'vue-smooth-dnd';

  export default {
    name: 'UngroupedList',
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    components: {
      leftLayout,
      simpleForm,
      operations,
      'dnd-container': Container,
      'dnd-draggable': Draggable,
    },
    data() {
      return {
        // 对话框
        isAdd: true,
        showAddTagPopup: false,
        showAddGroupPopup: false,
        defaultValue: '',
        dialogLoading: false,
        showOperations: false,

        keyword: '',
        loading: false,
        checkedAllUG: false,
        ungroupedList: [],
        groupList: [],
        activeTag: null,
        activeGroup: null,
        activeIndex: '',
        checkedAllGroup: false,
        showGroup: false,
        showMoreBtn: [],
        tagLocation: {
          top: 0,
          left: 0,
        },
        scrollbarHeight: 368,
      };
    },
    mounted() {
      this.getTagList();

      this.$nextTick(() => {
        this.handleTagListScroll();
      });
    },
    computed: {
      // 检测未分组是否有选择的，并重置全选状态
      hasCheckedTag() {
        const checkedList = this.ungroupedList.filter(item => item.checked);

        if (checkedList.length && checkedList.length === this.ungroupedList.length) {
          this.checkedAllUG = true;
        } else {
          this.checkedAllUG = false;
        }

        return !!checkedList.length;
      },
      // 检测标签群组是否有选择的，并重置全选状态
      hasCheckedTagOfGroups() {
        let tagCount = 0;
        let checkedList = [];

        this.groupList.forEach(group => {
          const arr = [];
          const len = group.materialTagList.length;

          tagCount += len;
          group.materialTagList.forEach(item => {
            if (item.checked) {
              arr.push(item);
            }
          });

          if (len && arr.length === len && !group.checked) {
            group.checked = true;
          } else if (arr.length !== len && group.checked) {
            group.checked = false;
          }
          checkedList = checkedList.concat(arr);
        });

        if (tagCount && checkedList.length === tagCount) {
          this.checkedAllGroup = true;
        } else {
          this.checkedAllGroup = false;
        }

        return !!checkedList.length;
      },
    },
    methods: {
      // 获取列表
      async getTagList() {
        this.loading = true;
        this.checkedAllGroup = false;

        try {
          const { data } = await elderSpaceApi.getTagListV2({
            keyword: this.keyword,
            moduleType: this.moduleType,
          });
          const noGroupList = data ? data.noGroupList : [];
          const groupList = data ? data.groupList : [];

          this.ungroupedList = noGroupList || [];
          this.groupList = groupList || [];
          this.$nextTick(() => {
            this.setMoreBtn();
          });
        } catch (e) {}

        this.loading = false;
      },

      // 新增标签
      addTag() {
        this.showAddTagPopup = true;
        this.isAdd = true;
      },

      async handleAddTag(value) {
        this.dialogLoading = true;
        const params = {
          id: this.isAdd ? null : this.activeTag.id,
          tagValue: value,
          moduleType: this.moduleType,
        };
        const action = this.isAdd ? elderSpaceApi.addTag : elderSpaceApi.updateTag;

        try {
          const { data } = await action(params);

          if (data) {
            this.showAddTagPopup = false;
            this.resetActive();
            this.getTagList();
          }
        } catch (e) {
          console.error(e);
        }

        this.dialogLoading = false;
      },

      // 新增群组
      addGroup() {
        this.showAddGroupPopup = true;
        this.isAdd = true;
      },

      async handleAddGroup(value) {
        this.dialogLoading = true;
        const params = {
          id: this.isAdd ? null : this.activeGroup.id,
          groupName: value,
          moduleType: this.moduleType,
        };
        const action = this.isAdd ? elderSpaceApi.addGroupOfTag : elderSpaceApi.updateGroupOfTag;

        try {
          const { data } = await action(params);

          if (data) {
            this.showAddGroupPopup = false;
            this.resetActive();
            this.getTagList();
          }
        } catch (e) {
          console.error(e);
        }

        this.dialogLoading = false;
      },

      // 删除标签
      deleteTag(flag) {
        let tagValue = '';
        let deleteList = [];

        if (flag === 0) {
          // 批量删除
          deleteList = this.ungroupedList.filter(item => item.checked);

          if (deleteList.length === this.ungroupedList.length) {
            tagValue = '所有未分组标签';
          } else {
            tagValue = deleteList
              .reduce((total, item, index) => total + (index < 2 ? `,${item.tagValue}` : index === 2 ? '...' : ''), '')
              .slice(1);
          }
        } else {
          // 单个删除
          tagValue = this.activeTag.tagValue;
        }

        this.$confirm('标签删除后不会恢复', `是否确认删除标签【${tagValue}】`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning',
          customClass: 'wkb-confirm wkb-confirm-v2',
        }).then(async () => {
          const ids = [deleteList, [this.activeTag]][flag].reduce((total, item) => total.push(item.id) && total, []);

          const { data } = await elderSpaceApi.deleteTag({
            tagIdList: ids.toString(),
            moduleType: this.moduleType,
          });

          if (data) {
            this.resetActive();
            this.getTagList();
          }
        });
      },

      /**
       * 删除群组或标签
       * 群组右侧为删除群组；全选为清空所有群组标签
       */
      deleteGroupOrTag(flag, index) {
        const groupList = this.groupList;

        if ([0, 2].includes(flag)) {
          const action = async () => {
            let ids;

            if (!flag) {
              ids = groupList.reduce((total, group) => {
                group.materialTagList.forEach(item => {
                  item.checked && total.push(item.id);
                });

                return total;
              }, []);
            } else {
              ids = [this.activeTag.id];
            }

            const { data } = await elderSpaceApi.removeTagFromGroup({
              tagIdList: ids.toString(),
              moduleType: this.moduleType,
            });

            if (data) {
              this.resetActive();
              this.getTagList();
            }
          };

          if (flag === 0) {
            this.$confirm('', '是否确认从群组移除选中的标签', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true,
              type: 'warning',
              customClass: 'wkb-confirm wkb-confirm-v2',
            }).then(() => {
              action();
            });
          } else {
            action();
          }
        } else {
          const group = groupList[index];

          this.$confirm('', `是否确认删除群组【${group.groupName}】`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'warning',
            customClass: 'wkb-confirm wkb-confirm-v2',
          }).then(async () => {
            const { data } = await elderSpaceApi.deleteGroupOfTag({
              groupId: group.id,
              moduleType: this.moduleType,
            });

            if (data) {
              this.resetActive();
              this.getTagList();
            }
          });
        }
      },

      // 选择标签
      chooseTag(flag, val) {
        const activeIndex = this.activeIndex.split('-');

        if (flag === 0) {
          this.ungroupedList.map((item, index) => {
            if (val !== undefined) {
              item.checked = val;
            } else if (activeIndex[1] == index) {
              item.checked = true;
            }
            return item;
          });
          this.ungroupedList.splice(this.ungroupedList.length + 1);
        } else {
          this.groupList.map((group, topIndx) => {
            if (val !== undefined) {
              group.checked = val;
            }
            group.materialTagList = group.materialTagList.map((item, index) => {
              if (val !== undefined) {
                item.checked = val;
              } else if (topIndx == activeIndex[0] && index == activeIndex[1]) {
                item.checked = true;
              }
              return item;
            });
            return group;
          });

          this.groupList.splice(this.groupList.length + 1);
        }
        this.resetActive();
      },

      // 全选未分组标签
      checkboxOfAllUGChange(val) {
        this.chooseTag(0, val);
      },

      // 全选所有群组
      checkboxOfAllGroupChange(val) {
        this.chooseTag(1, val);
      },

      // 全选群组
      checkboxOfGroupChange(index) {
        const checked = this.groupList[index].checked;

        this.groupList.map((group, index2) => {
          if (index === index2) {
            group.materialTagList = group.materialTagList.map(item => {
              item.checked = checked;
              return item;
            });
          }
          return group;
        });

        this.groupList.splice(this.groupList.length + 1);
        this.resetActive();
      },

      // 选中单个标签
      handleChooseTag(e, flag, topIndex, index) {
        if (flag === 0) {
          // 未分组标签
          const ungroupedList = this.ungroupedList;
          const tag = ungroupedList[topIndex];

          if (tag.active) {
            return false;
          } else if (tag.checked) {
            tag.checked = false;
            return ungroupedList.splice(ungroupedList.length + 1);
          }

          this.activeIndex = `a-${topIndex}`;
          this.activeTag = tag;
        } else {
          // 标签群组
          const groupList = this.groupList;
          const tag = groupList[topIndex].materialTagList[index];

          if (tag.active) {
            return false;
          } else if (tag.checked) {
            tag.checked = false;
            return groupList.splice(groupList.length + 1);
          }

          this.activeIndex = `${topIndex}-${index}`;
          this.activeTag = tag;
        }
        // 更正悬浮窗位置
        this.$nextTick(() => {
          const layoutLocation = this.$refs.rightLayout.getBoundingClientRect();
          const tagLocation = document.querySelector('.tag.active').getBoundingClientRect();

          this.tagLocation = {
            top: tagLocation.top - layoutLocation.top + 40 + 'px',
            left: tagLocation.left - layoutLocation.left + 'px',
          };
          this.showOperations = true;
        });
      },

      resetActive() {
        this.activeIndex = '';
        this.showOperations = false;
      },

      // 编辑群组/标签名
      editName(flag, index) {
        if (flag === 0) {
          this.activeGroup = this.groupList[index];
          this.defaultValue = this.activeGroup.groupName;
          this.showAddGroupPopup = true;
        } else {
          this.defaultValue = this.activeTag.tagValue;
          this.showAddTagPopup = true;
        }
        this.isAdd = false;
      },

      // 处理悬浮层操作
      handleOperate(flag, groupId) {
        const activeTag = this.activeTag;
        const activeIndex = this.activeIndex;
        const strategies = {
          viewMat() {
            this.$router.push({
              path: '/materials/picture/tag-related',
              query: {
                id: activeTag.id,
                tagValue: activeTag.tagValue,
                referenceTimes: activeTag.referenceTimes || '',
              },
            });
          },
          async addToGroup() {
            const { data } = await elderSpaceApi.moveTagToGroup({
              groupId,
              tagIdList: activeTag.id,
              moduleType: this.moduleType,
            });

            if (data) {
              this.resetActive();
              this.getTagList();
            }
          },
          remove() {
            this.deleteGroupOrTag(2);
          },
          choose() {
            this.chooseTag(Number(!activeIndex.includes('a')));
          },
          edit() {
            this.editName(1);
          },
          delete() {
            this.deleteTag(1);
          },
        };

        strategies[flag].call(this);
      },

      // 计算标签群组是否超出一行
      setMoreBtn(index) {
        let showMoreBtn;

        if (isNaN(index)) {
          showMoreBtn = [];
          this.groupList.forEach((_, groupIndex) => {
            const elHeight = this.$refs.groupList[groupIndex].offsetHeight;
            showMoreBtn[groupIndex] = elHeight > 52;
          });
          this.showGroup = true;

          // 动态设置标签群组高度，保持页面一屏展示
          this.scrollbarHeight = 316 + this.$refs.ungroupedListScrollbar.wrap.offsetHeight;
        } else {
          showMoreBtn = [...this.showMoreBtn];
          showMoreBtn[index] = false;
        }
        this.showMoreBtn = showMoreBtn;
      },

      // 重置状态
      clearState() {
        this.resetActive();
      },

      handleTagListScroll() {
        const self = this;
        this.$refs.ungroupedListScrollbar.wrap.addEventListener('scroll', () => {
          if (this.activeIndex && this.activeIndex.includes('a')) {
            self.resetActive();
          }
        });

        this.$refs.groupListScrollbar.wrap.addEventListener('scroll', () => {
          if (this.activeIndex && !this.activeIndex.includes('a')) {
            self.resetActive();
          }
        });
      },

      // 拖拽标签
      getTag(index) {
        return this.ungroupedList[index];
      },

      onDrop(dropResult, index) {
        if (dropResult && dropResult.addedIndex) {
          this.activeTag = dropResult.payload;
          this.handleOperate('addToGroup', this.groupList[index].id);
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .ungrouped-scrollbar {
    margin-top: 17px;
    padding-bottom: 8px;

    /deep/ .el-scrollbar__wrap {
      margin-bottom: 0 !important;
      max-height: 156px;
      overflow-x: hidden;
    }
  }

  .group-scrollbar {
    margin-top: 14px;

    /deep/ .el-scrollbar__wrap {
      margin-bottom: 0 !important;
      overflow-x: hidden;
    }
  }

  .picture-content {
    display: flex;
    color: #303133;

    .right-layout {
      position: relative;
      flex: auto;
      padding: 25px 16px;
      border-left: 1px solid #ebeef5;
    }

    .head-operate {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;

      > div {
        display: flex;
      }

      /deep/ .el-button {
        border-radius: 2px;
      }

      .search-box {
        /deep/ .el-button {
          border-radius: 0 2px 2px 0;
        }
      }

      /deep/ .el-button--primary {
        border: none;
      }

      /deep/ .el-input__inner {
        width: 220px;
        border-right: none;
        border-radius: 2px 0 0 2px;
      }
    }
  }

  .tag-group {
    padding: 24px 0 0;
    border-bottom: 1px solid #ebeef5;

    .group-title {
      position: relative;
      font-size: 16px;
      line-height: 22px;
    }

    /deep/ .el-checkbox {
      margin-left: 10px;
    }

    /deep/ .el-checkbox__label {
      margin-left: 4px;
    }

    .tag-list {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;

      .count {
        margin-left: 10px;
      }
    }

    .tag {
      position: relative;
      margin: 0 16px 16px 0;
      text-align: center;
      padding: 0 24px;
      line-height: 34px;
      background: #fff;
      border: 1px solid #ebeef5;
      border-radius: 20px;
      font-family: PingFangSC, PingFangSC-Regular;
      cursor: pointer;
      color: #717378;

      &::before {
        position: absolute;
        left: 7px;
        top: 11px;
        font-size: 16px;
        line-height: normal;
      }
    }

    .el-icon-check,
    .active {
      background: #1890ff;
      color: #fff;
      border-color: #1890ff;
    }

    .el-icon-check {
      padding: 0 20px 0 28px;
    }

    .group-name {
      display: flex;
      justify-content: space-between;
      margin: 14px 0 12px;

      /deep/ .el-checkbox__label {
        font-size: 16px;
      }
    }

    .group-operate {
      display: flex;
      align-items: center;

      > a {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        background-image: url(../../../../images/materials/picture/blue-edit.svg);
        background-size: 100% 100%;

        &:nth-child(2) {
          background-image: url(../../../../images/materials/picture/blue-delete.svg);
        }
      }
    }

    .group-wrap {
      position: relative;
      padding-right: 64px;
      margin-bottom: 8px;
      height: 52px;
      overflow: hidden;

      .more-btn {
        position: absolute;
        right: 0;
        top: 0;
        padding: 0;
        width: 64px;
      }
    }
  }

  .pt0 {
    padding-top: 0;
  }

  .delete-btn {
    position: absolute;
    left: 152px;
    top: 0;
    width: 50px;
    height: 24px;
    background: #fff;
    border: 1px solid #dce1e6;
    border-radius: 2px;
    font-size: 12px;
    color: #717378;
    cursor: pointer;
  }

  .border-none {
    border: none;
  }

  .tag-group {
    .group-name,
    .group-wrap {
      transform: none !important;
    }
  }
</style>
