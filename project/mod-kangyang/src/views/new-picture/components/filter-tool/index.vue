<template>
  <div class="filter-tool">
    <!-- 类型 -->
    <el-popover placement="bottom-start" width="368" :visible-arrow="false" popper-class="type-popper" trigger="click">
      <el-checkbox-group v-model="formatsList" @change="formatsChange">
        <div class="filter-type-box">
          <el-checkbox label="JPG">JPG</el-checkbox>
          <div class="tip">{{ formatObj['JPG'] || 0 }}</div>
        </div>
        <div class="filter-type-box">
          <el-checkbox label="PNG">PNG</el-checkbox>
          <div class="tip">{{ formatObj['PNG'] || 0 }}</div>
        </div>
        <div class="filter-type-box">
          <el-checkbox label="GIF">GIF</el-checkbox>
          <div class="tip">{{ formatObj['GIF'] || 0 }}</div>
        </div>
        <div class="filter-type-box">
          <el-checkbox label="BMP">BMP</el-checkbox>
          <div class="tip">{{ formatObj['BMP'] || 0 }}</div>
        </div>
        <div class="filter-type-box">
          <el-checkbox label="JPEG">JPEG</el-checkbox>
          <div class="tip">{{ formatObj['JPEG'] || 0 }}</div>
        </div>
      </el-checkbox-group>
      <div class="filter-item" @click="showFilter('isType')" slot="reference">
        <span>类型</span>
        <i class="el-icon-caret-top" v-if="form.isType"></i>
        <i class="el-icon-caret-bottom" v-else></i>
      </div>
    </el-popover>

    <!-- 时间 -->
    <el-popover placement="bottom-start" width="368" :visible-arrow="false" popper-class="time-popper" trigger="click">
      <el-checkbox-group v-model="timeType" @change="timeChange">
        <div class="filter-type-box" v-for="time in times" :key="time.id">
          <el-checkbox :label="time.code" v-if="time.code == 0">今日</el-checkbox>
          <el-checkbox :label="time.code" v-else-if="time.code == 1">昨日</el-checkbox>
          <el-checkbox :label="time.code" v-else>最近{{ time.code }}日</el-checkbox>
          <div class="tip">{{ time.count }}</div>
        </div>
        <div class="filter-type-box">
          <el-checkbox label="custom">自定义范围</el-checkbox>
          <div class="tip"></div>
        </div>
      </el-checkbox-group>
      <div class="filter-type-box">
        <el-date-picker
          @change="timeRangeChange"
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </div>
      <div class="filter-item" @click="showFilter('isTime')" slot="reference">
        <span>时间</span>
        <i class="el-icon-caret-top" v-if="form.isTime"></i>
        <i class="el-icon-caret-bottom" v-else></i>
      </div>
    </el-popover>

    <!-- 尺寸 -->
    <el-popover placement="bottom-start" width="368" :visible-arrow="false" popper-class="size-popper" trigger="click">
      <div class="filter-title">宽度（PX）</div>
      <div class="filter-input-box">
        <el-input
          type="number"
          placeholder="最小"
          class="filter-input"
          v-model="filterParms.minWidth"
          @input="sizeChange"
          width="140px"
        ></el-input>
        <div class="line"></div>
        <el-input
          type="number"
          placeholder="最大"
          class="filter-input"
          v-model="filterParms.maxWidth"
          @input="sizeChange"
          width="140px"
        ></el-input>
      </div>

      <div class="filter-title" style="margin-top: 16px">高度（PX）</div>

      <div class="filter-input-box">
        <el-input
          type="number"
          placeholder="最小"
          class="filter-input"
          v-model="filterParms.minHeight"
          @input="sizeChange"
          width="140px"
        ></el-input>
        <div class="line"></div>
        <el-input
          type="number"
          placeholder="最大"
          class="filter-input"
          v-model="filterParms.maxHeight"
          @input="sizeChange"
          width="140px"
        ></el-input>
      </div>
      <div class="filter-item" @click="showFilter('isSize')" slot="reference">
        <span>尺寸</span>
        <i class="el-icon-caret-top" v-if="form.isSize"></i>
        <i class="el-icon-caret-bottom" v-else></i>
      </div>
    </el-popover>
    <div class="button" @click="handleReset" v-show="showResetBtn">清除</div>
  </div>
</template>

<script>
  import './index.less';
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import regexps from '@/dss-common/utils/regexps';
  import dateUtil from '@/dss-common/utils/date';

  export default {
    props: {
      showTag: {
        type: Boolean,
        default: true,
      },
      groupId: {
        type: Number,
        default: 0,
      },
    },
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    data() {
      return {
        filterParms: {
          minWidth: null,
          maxWidth: null,
          minHeight: null,
          maxHeight: null,
          format: null, // 图片类型
          tagIds: null, // 标签
          startTime: null,
          endTime: null,
        },
        formats: {
          isJPG: false,
          isGIF: false,
          isPNG: false,
        },
        form: {
          isTag: false,
          isType: false,
          isTime: false,
          isSize: false,
        },
        tagList: [],
        checkedList: [],
        historyList: [],
        times: [],
        formatObj: {},
        timeType: [],
        formatsList: [],
        timeRange: [],
        keyword: '',
        showResetBtn: false,
      };
    },
    mounted() {
      this.filtersList();
    },
    computed: {
      showRecentlyTags() {
        return !this.isElderSpace;
      },
    },
    watch: {
      filterParms: {
        deep: true,
        handler(newVal, oldVal) {
          this.showResetBtn = !!Object.values(newVal).filter(item => item).length;
        },
      },
      // 切换文件夹时重新获取统计数据
      groupId() {
        this.filtersList();
      },
    },
    methods: {
      getTagList() {
        const params = {
          keyword: this.keyword,
          moduleType: this.moduleType,
        };
        elderSpaceApi
          .getTagListV2(params)
          .then(res => {
            const { noGroupList, groupList } = res.data || {};
            const tagList = groupList || [];

            tagList.unshift({
              id: 0,
              groupName: '未分组标签',
              materialTagList: noGroupList || [],
            });

            this.tagList = tagList.filter(item => item.materialTagList.length);
          })
          .always(res => {});
      },

      getHistoryList() {
        const params = {};
        elderSpaceApi
          .getHistoryList(params)
          .then(res => {
            this.historyList = res.data || [];
          })
          .always(res => {});
      },

      filtersList() {
        const params = {
          folderId: this.groupId,
        };
        this.formatObj = {};
        elderSpaceApi.filtersList(params).then(res => {
          if (res.data) {
            const { times, formats } = res.data;
            this.times = times || [];
            const formatTypeList = formats || [];

            formatTypeList.forEach(item => {
              const key = (item.code || '').toUpperCase();
              this.formatObj[key] = item.number;
            });
          }
        });
      },

      showFilter(key) {
        this.form[key] = !this.form[key];
      },

      // 选择标签
      handleChooseTag(id) {
        if (this.checkedList.includes(id)) {
          this.checkedList.splice(this.checkedList.indexOf(id), 1);
        } else {
          this.checkedList.push(id);
        }
        this.filterParms.tagIds = this.checkedList.join(',');
        this.$emit('filter', this.filterParms);
      },

      // 时间改变
      timeChange(times) {
        const item = times[times.length - 1];
        this.timeType = [item];
        if (item) {
          // 自定义
          if (item === 'custom') {
            return;
          } else if (item == 0) {
            // 今天
            const date = dateUtil.format(new Date(), 'YYYY-MM-DD');
            this.filterParms.startTime = new Date(date + ' 00:00:00').getTime();
            this.filterParms.endTime = new Date(date + ' 23:59:59').getTime();
          } else if (item == 1) {
            // 昨天
            const last = this.format(new Date(), 1);
            const date = dateUtil.format(last, 'YYYY-MM-DD');
            this.filterParms.startTime = new Date(date + ' 00:00:00').getTime();
            this.filterParms.endTime = new Date(date + ' 23:59:59').getTime();
          } else {
            this.filterParms.startTime = this.format(new Date(), Number(item));
            this.filterParms.endTime = this.format(new Date(), 0);
          }
        } else {
          this.filterParms.startTime = null;
          this.filterParms.endTime = null;
        }
        this.$emit('filter', this.filterParms);
      },

      // 获取当前时间的前后多少天
      format(date, day) {
        let nd = new Date(date);
        nd = nd.getTime();
        nd = nd - day * 24 * 60 * 60 * 1000;
        nd = new Date(nd).getTime();
        return nd;
      },

      // 文件类型改变
      formatsChange() {
        this.filterParms.format = this.formatsList.join(',');
        this.$emit('filter', this.filterParms);
      },

      // 尺寸改变
      sizeChange() {
        let flag = false;

        const sizes = ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
        for (const size of sizes) {
          const sizeValue = this.filterParms[size];
          if (!flag && sizeValue && !regexps.positiveInt.reg.test(sizeValue)) {
            this.$message.error(regexps.positiveInt.msg);
            flag = true;
            return flag;
          }
        }

        if (flag) {
          return false;
        }

        for (const size of sizes) {
          const value = this.filterParms[size];
          if (value) {
            this.filterParms[size] = +value;
          }
        }

        this.$emit('filter', this.filterParms);
      },

      timeRangeChange() {
        this.filterParms.startTime = new Date(this.timeRange[0]).getTime();
        this.filterParms.endTime = new Date(this.timeRange[1]).getTime();
        this.$emit('filter', this.filterParms);
      },

      hanbleTagShow(index) {
        const item = this.tagList[index];
        item.show = !item.show;

        this.$set(this.tagList, index, item);
      },

      reset() {
        this.filterParms = {
          minWidth: null,
          maxWidth: null,
          minHeight: null,
          maxHeight: null,
          format: null,
          tagIds: null,
          startTime: null,
          endTime: null,
        };
        this.timeRange = [];
        this.formatsList = [];
        this.timeType = [];
        this.checkedList = [];
        return this.filterParms;
      },

      handleReset() {
        this.reset();
        this.$emit('filter', this.filterParms);
      },
    },
  };
</script>

<style lang="less" scoped>
  .filter-tool {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    color: #303133;

    .filter-item {
      margin-right: 24px;
      line-height: 24px;
      cursor: pointer;

      i {
        font-size: 18px;
        color: #717378;
      }
    }

    .button {
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      width: 50px;
      height: 24px;
      line-height: 22px;
      background: #fff;
      border: 1px solid #dce1e6;
      border-radius: 2px;
      font-size: 12px;
      color: #717378;
    }

    .button:hover {
      border: 1px solid rgba(24, 144, 255, 1);
      color: rgba(24, 144, 255, 1);
    }
  }

  .tag-scrollbar {
    padding-top: 16px;

    /deep/ .el-scrollbar__wrap {
      max-height: 200px;
      padding-bottom: 20px;
      overflow-x: hidden;
    }
  }
</style>
