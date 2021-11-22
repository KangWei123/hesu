<template>
  <div class="mytag-container page-bg">
    <div class="base-header">
      我的标签
      <TipIcon :content="tip" title="我的标签"></TipIcon>
    </div>
    <div class="page-content">
      <!-- toolbar -->
      <div class="toolbar">
        <el-input
          @change="onSearch"
          @keypress.enter="onSearch"
          placeholder="请输入标签关键字"
          style="width: 180px"
          v-model.trim="searchVal"
        >
          <i @click="onSearch" class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
        <el-button :round="true" @click="onCreate" class="create" type="primary">新建标签</el-button>
      </div>
      <!-- tabs -->
      <el-tabs v-model="tabActiveName" @tab-click="handleClick">
        <el-tab-pane label="商家印象" name="merchantTag">
          <TagList
            :if-loading="impressionLoading"
            :page-index="impressionTablePage.index"
            :page-size="impressionTablePage.size"
            :page-total="impressionTablePage.total"
            :table-catagory-filter-options="tableCatagoryFilterOptions"
            :table-data="impressionTableData"
            :table-type="tabActiveName"
            @change="onChangeImpressionTablePage"
            @delete="onDeleteImpressionTag"
            @filter="onImpressionTagFilter"
            @page-size-change="onPageSizeChange"
          ></TagList>
        </el-tab-pane>
        <el-tab-pane label="条件标签" name="conditionTag">
          <TagList
            :if-loading="conditionLoading"
            :page-index="conditionTablePage.index"
            :page-size="conditionTablePage.size"
            :page-total="conditionTablePage.total"
            :table-data="conditionTableData"
            :table-type="tabActiveName"
            @change="onChangeConditionTablePage"
            @delete="onDeleteConditionTag"
            @page-size-change="onPageSizeChange"
          ></TagList>
        </el-tab-pane>
      </el-tabs>
      <!-- delete confirm -->
      <el-dialog :visible.sync="showDeleteConfirm" title="确定删除该标签吗？" width="30%">
        <span>删除以下含有该标签的人群包将失效，请谨慎操作</span>
        <div style="text-align: center; padding: 20px 5px">
          <el-tag :key="item.id" v-for="item in crowdPackage">{{ item.name }}</el-tag>
        </div>
        <span class="dialog-footer" slot="footer">
          <el-button @click="showDeleteConfirm = false">取 消</el-button>
          <el-button @click="onConfirmDeleteTag" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils';
  import api from '@/mod-member/src/api/new-dmp';
  import TipIcon from '@/mod-member/src/components/TipIcon';
  import TagList from './components/TagList';

  export default {
    name: 'MyTag',
    components: { TagList, TipIcon },
    watch: {
      tabActiveName() {
        this.searchVal = '';
        this.getData();
      },
      filterOptions(val) {
        this.categoryIds = val.join(',');
        this.getData();
      },
    },
    mounted() {
      const lastActiveTagName = this.$route.params.lastActiveTagName;
      this.tabActiveName = lastActiveTagName || 'merchantTag';
      this.getData();
      console.log('tag', 'qqq', lastActiveTagName, this.$route.params);
      console.log('tag', 'qqq', this.tabActiveName);
    },
    data() {
      return {
        tip: [
          {
            title: '我的标签',
            text: '管理商家自定义的标签，分为商家印象标签和条件标签2种',
          },
          {
            title: '商家印象',
            text:
              '商家可自定义标签名称和描述，在会员管理、导购系统、公众号粉丝管理，渠道二维码打标等场景选择商家标签对客户进行打标。',
          },
          {
            title: '条件标签',
            text: '商家可对客户的消费、充值、浏览等行为设置一定条件，满足该条件的用户自动打上该标签。',
          },
        ],
        searchVal: '',
        categoryIds: '',
        tabActiveName: 'merchantTag',
        // 标签类型 enum
        tableCatagoryFilterOptions: [],
        // 表格数据
        impressionTableData: [],
        impressionTablePage: {
          size: 10,
          index: 1,
          total: 0,
        },
        conditionTableData: [],
        conditionTablePage: {
          size: 10,
          index: 1,
          total: 0,
        },
        // 表格过滤
        filterOptions: [],
        // loading
        impressionLoading: false,
        conditionLoading: false,
        // delete
        crowdPackage: [],
        showDeleteConfirm: false,
        willDeleteTagId: '',
        willDeleteTagType: '',
        tabsName: '商家印象',
      };
    },
    methods: {
      handleClick(tab, event) {
        this.tabsName = tab.label;
        console.log(tab.label, event);
      },
      impressionTableDataAdaptor(data) {
        return data.map(item => ({
          ...item,
          type: '商家印象',
          category: (item.businessImpressionTagCategory || {}).name || '',
          categoryId: (item.businessImpressionTagCategory || {}).id || '',
        }));
      },
      conditionTableDataAdaptor(data) {
        console.log(data, 'data==');
        return data.map(item => ({
          ...item,
          type: '条件标签',
          name: item.labelName,
          id: item.id,
          memberCount: item.memberCount,
          condition: item.tagingCondition,
          timestamp: utils.timeFormat(item.updateTime, 'YYYY-MM-DD HH:mm:ss'),
        }));
      },
      // 恢复页码
      resetPage() {
        this.impressionTablePage.index = 1;
        this.conditionTablePage.index = 1;
      },
      // 获取组件数据
      getData() {
        const tabActiveName = this.tabActiveName;
        if (tabActiveName === 'merchantTag') {
          this.impressionLoading = true;
          api
            .getCategories({})
            .then(d => {
              this.tableCatagoryFilterOptions = d.data.map(item => ({
                text: item.name,
                value: item.id,
              }));
            })
            .catch(e => {
              this.tableCatagoryFilterOptions = [];
            });
          api
            .getImpressionTags({
              categoryIds: this.categoryIds,
              pageSize: this.impressionTablePage.size,
              pageNo: this.impressionTablePage.index,
              keyWord: this.searchVal,
            })
            .then(data => {
              this.impressionTablePage.total = data.totalCount;
              this.impressionTableData = this.impressionTableDataAdaptor(data.data);
            })
            .catch(e => {
              this.$message.error(e.errorMessage);
            })
            .finally(_ => {
              this.impressionLoading = false;
            });
        } else {
          this.conditionLoading = true;
          api
            .getAutoLabels({
              pageSize: this.conditionTablePage.size,
              pageNo: this.conditionTablePage.index,
              keyWord: this.searchVal,
            })
            .then(data => {
              this.conditionTablePage.total = data.totalCount;
              this.conditionTableData = this.conditionTableDataAdaptor(data.data);
            })
            .catch(e => {
              this.$message.error(e.errorMessage);
            })
            .finally(_ => {
              this.conditionLoading = false;
            });
        }
      },
      onSearch() {
        this.resetPage();
        this.getData();
      },
      onCreate() {
        console.log('tag', this.tabActiveName);
        this.$router.push({
          name: 'portraitNewTag',
          path: '/portrait/manage/myTag/new',
          params: { lastActiveTagName: this.tabActiveName },
          query: { tabsName: this.tabsName, flag: 'false' },
        });
      },
      onChangeImpressionTablePage(index) {
        this.impressionTablePage.index = index;
        this.getData();
      },
      onChangeConditionTablePage(index) {
        this.conditionTablePage.index = index;
        this.getData();
      },
      onImpressionTagFilter(idList) {
        this.filterOptions = idList;
      },
      // 确认删除标签
      onConfirmDeleteTag() {
        this.showDeleteConfirm = false;
        if (this.willDeleteTagType === 'impression') {
          api
            .deleteImpressionTagById({ tagId: this.willDeleteTagId })
            .then(d => {
              this.$message.success('删除商家印象标签成功');
            })
            .catch(e => {
              this.$message.error(e.errorMessage);
            })
            .finally(d => {
              this.getData();
            });
        } else {
          api
            .deleteConditionTagById({
              labelId: this.willDeleteTagId,
              appId: 288,
            })
            .then(d => {
              this.$message.success('删除条件标签成功');
            })
            .catch(e => {
              this.$message.error(e.errorMessage);
            })
            .finally(d => {
              this.getData();
            });
        }
      },
      // 删除标签
      onDeleteImpressionTag(id) {
        // * 查询标签下是否有人群包
        this.willDeleteTagId = id;
        this.willDeleteTagType = 'impression';
        const res = {
          packages: [
            { id: 1, name: '人群包1' },
            { id: 2, name: '人群包2' },
            { id: 3, name: '人群包3' },
          ],
        };
        // * 临时屏蔽人群包提醒
        res.packages = [];
        this.crowdPackage = res.packages;
        if (res.packages.length) {
          this.showDeleteConfirm = true;
        } else {
          this.$confirm('删除后不可恢复，确认删除吗？', '确定删除该标签吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              this.onConfirmDeleteTag();
            })
            .catch(() => {});
        }
      },
      onDeleteConditionTag(id) {
        this.willDeleteTagId = id;
        this.willDeleteTagType = 'condition';
        this.$confirm('删除后不可恢复，确认删除吗？', '确定删除该标签吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.onConfirmDeleteTag();
          })
          .catch(() => {});
      },
      // 每页显示数量切换
      onPageSizeChange(e) {
        this.impressionTablePage.size = e;
        this.conditionTablePage.size = e;
        this.getData();
      },
    },
  };
</script>

<style lang="less" scoped>
  .mytag-container {
    .toolbar {
      margin: 20px 20px 21px;
      overflow: hidden;
    }

    .create {
      line-height: 0px;
      float: right;
    }
  }

  // 人群包
  .crowd-wrapper {
    padding: 30px 20px;
  }

  // ! wkt 没有考虑到 filter-trigger 撑高的情况
  /deep/ .el-table__column-filter-trigger {
    line-height: 23px;
  }
</style>
