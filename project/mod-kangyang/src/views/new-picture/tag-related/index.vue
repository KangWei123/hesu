<template>
  <div class="tag-related">
    <div class="tag">
      {{ tagValue }}
      <span class="count">{{ referenceTimes }}</span>
    </div>

    <div class="filter-box">
      <div class="left-operation">
        <el-checkbox v-model="checkedAll" @change="handleChange">全选</el-checkbox>
        <filter-tool :show-tag="false" @filter="filter"></filter-tool>
        <span class="delete-button" @click="handleDelete" v-show="idList.length">删除</span>
      </div>
      <div class="search-box">
        <el-input
          placeholder="搜索名称"
          v-model.trim="filterParams.keyword"
          clearable
          @keyup.enter.native="reLoad"
          @clear="reLoad"
        ></el-input>
        <el-button type="primary" @click="reLoad">搜索</el-button>
      </div>
    </div>

    <div class="picture-list" v-loading="loading">
      <div class="list-wrap" :style="listCenterStyle">
        <image-item
          v-for="(item, index) in tableData"
          :key="index"
          :data="item"
          :hide-supernatant="true"
          :id-list="idList"
          @selectImg="selectImg"
        >
        </image-item>
      </div>
      <div class="empty-box" v-if="!tableData || !tableData.length">
        <img src="../../../../images/category/empty-icon.png" alt />
        <div class="empty-text">这里还没有图片哦～</div>
      </div>
    </div>

    <!-- 页码 -->
    <el-pagination
      v-if="page.totalCount"
      :current-page.sync="page.pageNo"
      :page-size.sync="page.pageSize"
      :page-sizes="[9, 18, 27, 36, 45, 90]"
      :total="page.totalCount"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      layout="prev, pager, next, jumper, sizes, total"
    >
    </el-pagination>
  </div>
</template>

<script>
  import api from '../../../../api/new-materials';
  import filterTool from '../components/filter-tool';
  import imageItem from '../components/image-item';
  import materialEnum from '../components/material-type';

  export default {
    name: 'TagRelated',
    components: { filterTool, imageItem },
    data() {
      return {
        id: '',
        tagValue: '',
        referenceTimes: '',
        checkedAll: null,
        filterParams: {
          keyword: null,
        },
        page: {
          pageNo: 1,
          pageSize: 18,
          totalCount: 0,
        },
        loading: false,
        tableData: [],
        idList: [],
        listCenterStyle: {},
      };
    },
    mounted() {
      const query = this.$route.query;

      for (const key in query) {
        this[key] = query[key];
      }

      this.getPictureList();
      this.setListCenter();
    },
    methods: {
      filter(filterParams) {
        this.filterParams = { ...this.filterParams, ...filterParams };
        this.reLoad();
      },

      // 获取列表数据
      async getPictureList() {
        let params = {
          pageSize: this.page.pageSize,
          pageNo: this.page.pageNo,
          status: 1,
          tagIds: this.id,
        };

        params = { ...this.filterParams, ...params };

        this.loading = true;

        try {
          const { data, totalCount } = await api.materialList(params);

          this.tableData = data || [];
          this.page.totalCount = totalCount;
          this.referenceTimes = totalCount || '';
        } catch (e) {}

        this.loading = false;
      },

      onPageChange(val) {
        this.page.pageNo = val;
        this.getPictureList();
      },

      onSizeChange(val) {
        this.page.pageSize = val;
        this.page.pageNo = 1;
        this.getPictureList();
      },

      reLoad() {
        this.page.pageNo = 1;
        this.getPictureList();
      },

      handleChange() {
        if (this.checkedAll) {
          this.idList = JSON.parse(JSON.stringify(this.tableData));
        } else {
          this.idList = [];
        }
      },

      selectImg(data) {
        // 计算当前选中的值
        if (data.isChecked) {
          this.idList.push(data);
        } else {
          this.idList.splice(
            this.idList.findIndex(item => item.id === data.id),
            1
          );
        }
      },

      handleDelete() {
        if (!this.idList.length) {
          return this.$message.warning('请选择图片');
        }

        this.$confirm('删除文件会被放进回收站7天内可以在回收站还原', '是否确定删除所选文件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning',
          customClass: 'wkb-confirm',
        }).then(async () => {
          const idList = this.idList.map(item => {
            return {
              id: item.id,
              isFolder: item.materialType === materialEnum.materialType.FOLDER,
            };
          });

          await api.deleteMaterial(idList);
          this.idList = [];
          this.$message.success('删除成功');
          this.reLoad();
        });
      },

      // 动态设置图片列表居中
      setListCenter() {
        const itemWith = 176;
        const boxWith = window.innerWidth - 292;
        const listWidth = Math.floor(boxWith / itemWith) * itemWith;

        this.listCenterStyle = {
          width: listWidth + 'px',
          'margin-left': (boxWith - listWidth) / 2 + 8 + 'px',
        };
      },
    },
  };
</script>
<style lang="less" scoped>
  .tag-related {
    padding: 0 16px 30px;
  }

  .tag {
    margin: 24px 0;
    display: inline-block;
    text-align: center;
    padding: 0 24px;
    line-height: 34px;
    background: #1890ff;
    border-radius: 20px;
    font-family: PingFangSC, PingFangSC-Regular;
    color: #fff;

    .count {
      margin-left: 10px;
    }
  }

  .filter-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-box /deep/ .el-input__inner {
      width: 220px;
      height: 36px;
      background: #fff;
      border: 1px solid #dce1e6;
      border-right: none;
    }

    /deep/ .el-checkbox__inner {
      border: 1px solid #dce1e6;
    }

    .search-box {
      display: flex;
      justify-content: flex-start;

      /deep/ .el-button {
        height: 36px;
        line-height: 36px;
        border-radius: 0 2px 2px 0;
      }
    }

    /deep/ .el-checkbox__label {
      margin-left: 3px;
    }

    /deep/ .el-button--primary {
      border: none;
    }
  }

  .left-operation {
    display: flex;
  }

  .delete-button {
    box-sizing: border-box;
    margin-left: 10px;
    display: inline-block;
    cursor: pointer;
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
  //平铺

  .picture-list {
    margin-top: 16px;
    padding-top: 24px;
    border-top: 1px solid #ebeef5;

    /deep/ .picture-item {
      margin-right: 24px;
    }

    .list-wrap {
      display: flex;
      flex-wrap: wrap;
    }

    .empty-box {
      margin: 0 auto;
      width: 195px;
      height: 224px;
      text-align: center;

      img {
        margin-top: 30px;
        width: 107px;
        height: 116px;
      }

      .empty-text {
        margin-top: 20px;
        font-size: 14px;
        color: #757575;
        line-height: 20px;
      }
    }
  }
</style>
