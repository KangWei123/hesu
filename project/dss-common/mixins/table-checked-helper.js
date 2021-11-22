/**
 * 列表/表格item选中帮助类
 * 提供全选、单独选择、切换分页时记录之前所有选中的item。
 * 引用方式：
 * import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
 * mixins: [tableCheckedHelperMixin],
 * 1.未使用el-table作为列表承载容器的话，请参考订单列表dss-wechat3rd/src/views/order/order-list/order-list-table
 *    1.1 当前pageList变更时，调用如下方法,可通过watch的形式监听列表变化，也可通过其他任何一种形式:
 *    watch: {
        orderList(newVal, oldVal) {
          this._setPageListChecked(this.orderList, unionKeys);
          this._checkIndeterminateChecked(this.orderList);
          this._checkAllSelected(this.orderList);
        }
      }
      1.2 全选状态的checkbox状态发生变化时，调用如下方法：
      onAllCheckedChanged(checked) {
          this._togglePageListChecked(this.orderList, checked);
          this._checkIndeterminateChecked(this.orderList);
          this._updateTotalList(this.orderList, unionKeys);
      }
      1.3 单个item选中状态发生变化时
      onItemCheckedChanged(checked, orderItem) {
          this._checkAllSelected(this.orderList);
          this._checkIndeterminateChecked(this.orderList);
          this._updateTotalList([orderItem], unionKeys);
      }
      1.4 全选和半选中状态如下方法设置：
       <el-checkbox class="order-check"
       :indeterminate="_isIndeterminate"
       v-model="_allChecked"
       @change="onAllCheckedChanged">

       </el-checkbox>
      1.5 每个item的checkbox如下设置：
     <el-checkbox class="order-check"
     v-model="item.checked"
     @change="checked => onItemCheckedChanged(checked, item)">
     </el-checkbox>
      1.6 执行完操作后如果需要情况选中状态，调用如下方法：
     this.mResetCheckedData();
     this.mTogglePageListChecked(this.pageList, false);
 2. table的selection形式，这种形式使用相对简单，可参考上下架组件使用dss-wechat3rd/src/components/goods/ShelfGoodsListTable.vue
    2.1 每次请求数据之前，调用该方法，原因是在当前页改变状态时不会触发mTotalCheckedList,因此请求数据之前需要主动触发一次计算全部选择的列表：
    this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
    2.2 请求数据成功后，调用该方法：
    this.mBuildMultipleTableSelection(this.goodsList, 'multipleTable', unionKeys);
    2.3 执行操作时需要再次调用2.1中的方法，原因是当前页操作选中状态时，不会主动触发计算，因此在最终调用时触发一次即可
    2.4 执行操作时，将mTotalCheckedList作为全部选择的参数即可
    2.5 执行操作后，如果需要清除之前已选中的状态，只需要调用：
    this.mResetCheckedData();
    this.multipleSelection = [];
    this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

 */

const DEFAULT_CHECKED_KEY = 'checked';
export default {
  data: function() {
    return {
      mIsIndeterminate: false, //当前列表选中状态是否在中间状态：有选中的，也有未选中的
      mAllChecked: false, //当前页面是否全部都被选中
      mTotalCheckedList: [] //所有被选中的列表list
    };
  },
  created() {
    this.mResetCheckedData();
  },
  methods: {
    mResetCheckedData() {
      this.mIsIndeterminate = false;
      this.mAllChecked = false;
      this.mTotalCheckedList = [];
    },
    /**
     * 改变列表的选中状态
     * @param pageList 当前页面的列表
     * @param checkKey 选中状态的key
     * @param checked 是否选中
     */
    mTogglePageListChecked(pageList, checked, checkKey = DEFAULT_CHECKED_KEY) {
      if (pageList && pageList.length) {
        pageList.forEach(item => {
          item[checkKey] = checked;
        });
      }
    },
    /**
     * 检查当前页列表是否全部选中
     * @param pageList 列表，空或者长度为0直接返回false
     * @param checkKey 检查的key，默认'checked'
     * @return {boolean} true:全部选中；false:未全部选中
     */
    mCheckAllSelected(pageList, checkKey = DEFAULT_CHECKED_KEY) {
      if (pageList && checkKey) {
        const nonCheckedItem = pageList.find(item => {
          return !item[checkKey];
        });
        this.mAllChecked = !nonCheckedItem;
      }
    },

    /**
     * 检查当前页列表选中状态是否在中间状态：有选中的，有未选中的
     * @param pageList 列表，空或者长度为0直接返回false
     * @param checkKey 检查的key，默认'checked'
     * @return {boolean} true:全部选中；false:未全部选中
     */
    mCheckIndeterminateChecked(pageList, checkKey = DEFAULT_CHECKED_KEY) {
      if (pageList) {
        /*判断选中的状态*/
        let checkedLength = 0;
        pageList.forEach(order => {
          if (order.checked) {
            checkedLength += 1;
          }
        });
        this.mIsIndeterminate = checkedLength > 0 && checkedLength < pageList.length;
      }
    },
    /**
     * 根据缓存的所有选择的列表去更新当前页列表选中情况
     * @param totalList
     * @param pageList
     * @param unionKeys
     * @param checkKey, 默认是'checked'
     * @return boolean 返回当前页是否全部选中。true：选中；false：未选中
     */
    mSetPageListChecked(pageList, unionKeys, checkKey = DEFAULT_CHECKED_KEY) {
      if (pageList && checkKey) {
        pageList.forEach(targetItem => {
          const specItem = this.mTotalCheckedList.find(totalItem => {
            return (
              totalItem[checkKey] &&
              this.mBuildUnionId(totalItem, unionKeys) === this.mBuildUnionId(targetItem, unionKeys)
            );
          });
          if (specItem) {
            targetItem[checkKey] = true;
          }
        });
      }
      return this.mCheckAllSelected(pageList, checkKey);
    },

    /**
     * 更新已选择的列表中的数据，将之前选中后来不选中的删除，将之前未选中的后来选中的加入
     * @param changedList 变更选中状态的列表
     * @param unionKeys 统一标识key集合
     * @param checkKey 选中状态的key, 默认是'checked'
     */
    mUpdateTotalList(changedList, unionKeys, checkKey = DEFAULT_CHECKED_KEY) {
      if (changedList && checkKey && unionKeys && unionKeys.length) {
        changedList.forEach(changedItem => {
          const specIndex = this.mTotalCheckedList.findIndex(totalItem => {
            return this.mBuildUnionId(totalItem, unionKeys) === this.mBuildUnionId(changedItem, unionKeys);
          });
          if (changedItem[checkKey]) {
            if (specIndex === -1) {
              this.mTotalCheckedList.push(changedItem);
            }
          } else {
            if (specIndex !== -1) {
              this.mTotalCheckedList.splice(specIndex, 1);
            }
          }
        });
      }
    },

    /**
     * 根据unionKeys构建targetItem的unionId
     * @param targetItem 目标item
     * @param unionKeys 数组，唯一id标识，可能有多个key
     */
    mBuildUnionId(targetItem, unionKeys) {
      if (targetItem && unionKeys && unionKeys.length) {
        let unionId = '';
        unionKeys.forEach(key => {
          unionId += '-' + targetItem[key] + '-';
        });
        return unionId;
      } else {
        return '--';
      }
    },

    /**
     * 延迟构建pageList的选中状态,必须设置延迟状态，否则会多调用一次handleSelectionChange的回调，导致选中状态不对
     * 因为table的checkbox选中状态是由multipleTable自己维护的，选中的item会存入multipleSelection中，因此需要重新构建pageList的选中状态
     * @param pageList 当前页item列表
     * @param tableRefsName 多选table ref name
     * @param unionKeys
     * @param callback timeout执行完毕后，回调函数。
     */
    mBuildMultipleTableSelection(pageList, tableRefsName, unionKeys, callback) {
      setTimeout(() => {
        if (pageList && this.mTotalCheckedList && this.$refs[tableRefsName]) {
          this.$refs[tableRefsName].clearSelection();
          pageList.forEach(pageItem => {
            const specItem = this.mTotalCheckedList.find(totalItem => {
              return this.mBuildUnionId(pageItem, unionKeys) === this.mBuildUnionId(totalItem, unionKeys);
            });
            if (!!specItem) {
              this.$refs[tableRefsName].toggleRowSelection(pageItem, true);
            }
          });
        }
        if (callback && typeof callback === 'function') {
          callback();
        }
      }, 0);
    },
    /**
     * 根据table多选的状态来计算所有已选的list
     * @param pageList 当前页list
     * @param curMultipleSelection 当前页选中的list
     * @param unionKeys
     */
    mUpdateTotalListBySelection(pageList, curMultipleSelection, unionKeys) {
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.mTotalCheckedList.length <= 0) {
        this.mTotalCheckedList = curMultipleSelection;
        return;
      }

      //最新选中的列表，全部加入到mTotalCheckedList中去
      curMultipleSelection.forEach(newSelectedItem => {
        const specPageItem = this.mTotalCheckedList.find(totalItem => {
          return this.mBuildUnionId(newSelectedItem, unionKeys) === this.mBuildUnionId(totalItem, unionKeys);
        });
        if (!specPageItem) {
          this.mTotalCheckedList.push(newSelectedItem);
        }
      });

      //不在最新选中列表中的item，如果之前在mTotalCheckedList，则需要清除
      pageList.forEach(pageItem => {
        const specNewSelectedItem = curMultipleSelection.find(newSelectedItem => {
          return this.mBuildUnionId(newSelectedItem, unionKeys) === this.mBuildUnionId(pageItem, unionKeys);
        });
        if (!specNewSelectedItem) {
          const removeIndex = this.mTotalCheckedList.findIndex(totalItem => {
            return this.mBuildUnionId(totalItem, unionKeys) === this.mBuildUnionId(pageItem, unionKeys);
          });
          if (removeIndex !== -1) {
            this.mTotalCheckedList.splice(removeIndex, 1);
          }
        }
      });
    }
  }
};
