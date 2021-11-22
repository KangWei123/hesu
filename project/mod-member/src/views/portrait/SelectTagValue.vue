<template>
  <el-popover width="528" placement="top" v-model="show" @after-leave="onClose">
    <div class="modal-header">
      <span class="dialog-title">{{ title }}</span>
      <i class="el-icon-close title-icon" @click="onClose"></i>
    </div>
    <div class="modal-body">
      <!--搜索框-->
      <div
        class="label-search-con search-con"
        v-if="tagInfo && tagInfo.guiType !== 'INTERVAL' && tagInfo.guiType !== 'SORT'"
      >
        <el-input class="tag-filter" placeholder="请输入标签关键字" v-model.trim="tagKeyword" />
      </div>
      <div class="label-search-con search-con" v-if="tagInfo && tagInfo.guiType === 'SORT'">
        <el-input class="tag-filter" placeholder="请输入标签关键字" v-model.trim="cityKeyWord" />
      </div>
      <!-- 复选框 -->
      <div class="label-option-wrapper" v-loading="loading_select">
        <div class="label-option-head" v-if="tagInfo && tagInfo.guiType === 'CHECKBOX'">
          <p class="no-result" v-if="filterList.length === 0">暂无结果</p>
        </div>
        <div class="label-option-content">
          <!--省份和城市按照字母排序-->
          <el-checkbox-group
            :class="!cityKeyWord ? 'dialog-indent' : ''"
            v-if="tagInfo && tagInfo.guiType === 'SORT'"
            v-model="resultList"
          >
            <template v-for="(value, key) in filterList">
              <p class="pyfront" :key="key" v-if="!cityKeyWord">{{ key }}</p>
              <el-checkbox
                class="city-checkbox"
                :title="item.name.length > 15 ? item.name : ''"
                :code="item.code"
                :key="item.code"
                v-for="item in value"
                :label="item"
              >
                {{ item.name }}
                <span @click.prevent class="input-label-empty"></span>
              </el-checkbox>
            </template>
          </el-checkbox-group>

          <!--购买品类，选择式标签类型-->
          <el-select
            filterable
            v-model="resultList"
            value-key="name"
            v-else-if="tagInfo && tagInfo.guiType === 'DROPDOWN'"
            multiple
            placeholder="请选择"
          >
            <el-option v-for="item in filterList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>

          <!--新增区间范围标签类型-->
          <template v-else-if="tagInfo && tagInfo.guiType === 'INTERVAL'">
            <p>请输入需要筛选的区间</p>
            <div class="chooseRange">
              <el-input-number
                :min="0"
                :max="99999999"
                :precision="0"
                class="inner-class"
                placeholder="请输入内容"
                clearable
                v-model="startValue"
              ></el-input-number>
              <span class="input-number-divide">—</span>
              <el-input-number
                :min="minEnd"
                :max="99999999"
                :precision="0"
                class="inner-class"
                size="medium"
                placeholder="请输入内容"
                clearable
                v-model="endValue"
              ></el-input-number>
            </div>
          </template>

          <el-checkbox-group
            class="dialog-check"
            v-else-if="tagInfo && tagInfo.guiType === 'CHECKBOX'"
            v-model="resultList"
          >
            <el-checkbox
              class="full-checkbox"
              :title="item.name.length > 15 ? item.name : ''"
              :code="item.code"
              :key="item.code"
              v-for="item in filterList"
              :label="item"
            >
              {{ item.name }}
              <span @click.prevent class="input-label-empty"></span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 分页器 -->
      <div v-if="isShow == true && filterList.length > 0">
        <el-pagination
          :current-page.sync="pageParams.pageNo"
          :page-size="pageParams.pageSize"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :total="pageParams.totalCount"
          @current-change="onChangeIndex"
          @size-change="handleSizeChange"
          background
          class="pagination"
          layout="prev, pager, next, jumper, sizes, total"
          style="margin-top: 10px"
        ></el-pagination>
      </div>
    </div>
    <div class="pop-bottom">
      <button
        v-if="newList.length > 0 && filterList.length !== 0"
        class="cbutton circle"
        :title="chooseAll ? '取消全选' : '全选'"
        :class="{ active: chooseAll }"
        @click="chooseAllOperate"
      >
        {{ chooseAll ? '取消全选' : '全选' }}
      </button>
      <div class="right-btn-group">
        <el-button class="btn-cancle" @click="onClose">取 消</el-button>
        <el-button type="primary" class="btn-sure primary-btn" @click="onSubmit">确 定</el-button>
      </div>
    </div>
    <!-- slot -->
    <slot slot="reference"></slot>
  </el-popover>
</template>

<script>
  import './selectTagValue.less';
  import '../../style/main.less';

  import Vue from 'vue';
  const bus = new Vue();

  export default {
    props: {
      // visible: {
      //   type: Boolean,
      //   default: false
      // },
      tagInfo: {
        type: Object,
        default() {
          return {};
        },
      },
      defaultSelected: {
        type: Array,
        default() {
          return [];
        },
      },
      isShow: {
        type: Boolean,
        default() {
          return false;
        },
      },
      pageParams: {
        type: Object,
        default() {
          return {};
        },
      },
      loading_select: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    data() {
      return {
        tagKeyword: '',
        cityKeyWord: '',
        resultList: [],
        startValue: null,
        endValue: null,
        minEnd: 1,
        activeNewList: null,
        show: false,
        totalMemberCount: 0,
      };
    },
    computed: {
      // show: {
      //   get() {
      //     return this.visible
      //   },
      //   set(val) {
      //     this.$emit('update:visible', val)
      //   }
      // },
      title() {
        return (this.tagInfo && this.tagInfo.name) || '';
      },
      newList() {
        this.tagInfo && this.tagInfo.canUse;
        return (this.tagInfo && this.tagInfo.values) || [];
      },
      /* eslint-disable vue/no-side-effects-in-computed-properties */
      filterList() {
        // 过滤掉以字母开头为空的省份
        if (this.tagInfo && this.tagInfo.guiType === 'SORT') {
          if (!this.cityKeyWord) {
            this.activeNewList = Object.keys(this.newList)
              .filter(key => this.newList[key] && this.newList[key].length > 0)
              .reduce((obj, key) => {
                obj[key] = this.newList[key];
                return obj;
              }, {});
          } else {
            this.activeNewList = Object.keys(this.newList)
              .filter(key => this.newList[key] && this.newList[key].length > 0)
              .reduce((obj, key) => {
                obj[key] = this.newList[key].filter(item => {
                  return item.name.toLowerCase().includes(this.cityKeyWord.toLowerCase());
                });
                return obj;
              }, {});
            // 过滤查询结果为空的字母
            this.activeNewList = Object.values(this.activeNewList).filter(item => {
              return item.length > 0;
            });
            // console.log('搜索后的activeNewList',this.activeNewList)
          }
        } else {
          this.activeNewList = this.newList;
        }
        if (!this.tagKeyword) {
          return this.activeNewList;
        }
        let list = [];
        const lowerWord = this.tagKeyword.toLowerCase();
        list = this.activeNewList.filter(item => item.name.toLowerCase().indexOf(lowerWord) > -1);
        // console.log('list------>',list)

        return list;
      },
      chooseAll() {
        return this.filterList.length === this.resultList.length;
      },
    },
    watch: {
      pageParams(val) {
        console.log(val, 'val');
      },
      // 监听name变化调搜索的接口
      tagKeyword(val) {
        this.$emit('searchName', val);
        this.$emit('pageChange', this.pageParams);
      },
      cityKeyWord(val) {
        this.$emit('searchName', val);
        this.$emit('pageChange', this.pageParams);
      },
      visible(val) {
        // this.newList = (this.tagInfo && this.tagInfo.values) || []
        if (val) {
          // 重新点击-清空数据重新调对应接口数据
          const defaultValues = [];
          this.activeNewList = null;
          this.tagKeyword = '';
          this.resultList = defaultValues;
          console.log('resultList：' + this.resultList);
        }
      },
      startValue(val) {
        this.minEnd = +val;
        if (this.endValue < val) {
          this.endValue = val;
        }
      },
    },
    mounted() {
      bus.$on('clearAllTags', () => {
        console.log('clear all');
        this.resultList = [];
      });
      bus.$on('clearTagById', cdn => {
        const id = cdn.tag.id;
        if (id === this.tagInfo.id) {
          console.log('clear cdn by id: ', id);
          this.resultList = [];
        }
      });
    },
    methods: {
      chooseAllOperate() {
        // 全选点击后变为取消全选
        if (this.resultList.length === this.filterList.length) {
          this.resultList = [];
        } else {
          this.resultList = this.filterList;
        }
      },
      onClose() {
        this.show = false;
        this.cityKeyWord = ''; // 搜索词清空
        this.tagKeyword = '';

        // TODO:不能直接改变props
        // this.pageParams.pageNo = 1;
        // this.pageParams.pageSize = 10;
        // this.pageParams.totalCount = 0;
      },
      onSubmit() {
        if (this.startValue === undefined || this.endValue === undefined) {
          this.$message.error('请输入正确的金额数值，金额不能为空');
          return;
        }

        if (this.tagInfo && this.tagInfo.guiType === 'INTERVAL') {
          let nameString = '';
          nameString = `${this.startValue}~${this.endValue}`;
          // dimValue传取值范围，用于筛选
          const pre = {
            desc: nameString,
            dimValue: nameString,
            id: 4355,
            name: nameString,
          };
          this.resultList.push(pre);
        }
        console.log(this.tagInfo, '点击确定', this.resultList);
        this.$emit('add-condition', this.tagInfo, this.resultList);
        this.show = false;
      },
      // 页码更新
      onChangeIndex(index) {
        // this.pageParams.pageNo = index;
        this.$emit('pageChange', this.pageParams);
      },
      // 每页显示数量切换
      handleSizeChange(e) {
        // this.pageParams.pageNo = 1;
        // this.pageParams.pageSize = e;
        this.$emit('pageChange', this.pageParams);
      },
    },
  };
</script>

<style lang="less" scoped>
  .search-con {
    padding: 10px 0 20px 0;
  }

  .active {
    width: 120px;
  }

  .pyfront {
    font-size: 14px;
    position: relative;
    left: -28px;
    padding: 0;
    margin: 0;
    height: 0;
  }

  .no-result {
    padding-top: 20px;
  }

  .chooseRange {
    .inner-class {
      width: 40%;
    }
  }

  .input-number {
    width: 200px;
    height: 50px !important;
  }

  .dialog-check {
    text-indent: 0;

    .full-checkbox {
      width: 40%;
    }
  }

  .dialog-indent {
    text-indent: 20px;

    .city-checkbox {
      width: 47%;
    }
  }

  .pop-bottom {
    display: flex;
    justify-content: flex-start;

    .right-btn-group {
      display: flex;
      justify-content: flex-end;
      width: 90%;
    }
  }
  .loading {
    font-size: 17px;
    vertical-align: middle;
    margin-left: 50%;
  }
</style>
