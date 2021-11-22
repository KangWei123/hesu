<template>
  <div class="materials-dialog materials-video-audio">
    <el-dialog title="选择图文" width="935px" :visible="dialogVisible" @close="clickCancel">
      <!-- search graphic -->
      <div class="material-dialog-head">
        <el-input placeholder="输入图文标题搜索" size="mini" style="width:250px" v-model="search"></el-input>
        <el-button type="primary" size="mini" class="dialog-search-material" @click="searchMaterial">搜索</el-button>
        <!-- <el-button type="primary" size="mini" class="dialog-add-material" @click="newMaterail">新建图文</el-button> -->
      </div>

      <!-- graphic list -->
      <div class="material-article-list" v-loading="loading">
        <article-card
          style="margin: 0 10px 10px 0;"
          v-for="(item, index) in formatDataList"
          :key="index"
          :articleItem="item.articleList"
          :isActive="item.isActive"
          @click.native="selectChange(index)"
        />
        <div v-if="!dataList || !dataList.length" style="text-align:center;height: 150px;padding-top:100px">
          暂无数据
        </div>
      </div>

      <!-- pagination -->
      <div style="text-align: center" v-if="!!dataList && !!dataList.length">
        <el-pagination
          layout="prev, pager, next, jumper, sizes, total"
          :total="pageParams.totalCount"
          :page-size="pageParams.pageSize"
          :page-sizes="[pageParams.pageSize]"
          :current-page="pageParams.pageNo"
          @current-change="onPageChange"
          class="materail-dialog-pagination"
        ></el-pagination>
      </div>

      <!-- footer -->
      <span slot="footer" class="dialog-footer">
        <el-button style="width:90px" size="mini" @click="clickCancel">取 消</el-button>
        <el-button style="width:90px" size="mini" type="primary" @click="clickSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import './index.less';
import articleCard from './article-card.vue';
import mApi from '../materials.js';

export default {
  components: { articleCard },
  props: {
    isMass: {
      type: Boolean,
      default: false
    },
    isSelfMotion: {
      type: Boolean,
      default: false
    },
    ifMulti: {
      // 是否可多选
      type: Boolean,
      default: false
    },
    // 多选最大数量
    limit: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      dialogVisible: true,
      // multi select
      selectedList: [],
      selectedContentList: [],
      // single select
      curSelected: '',
      oldSelected: '',
      selectedContent: {},

      search: '',
      dataList: [],
      formatDataList: null,
      //列表分页查询
      pageParams: {
        totalCount: 0,
        pageNo: 1,
        pageSize: 10,
        loading: false
      },
      loading: false
    };
  },
  watch: {
    dataList(newVal) {
      if (!newVal.length) return;
      let list = [];
      newVal.forEach((item, index) => {
        list.push({
          articleList: item,
          isActive: false
        });
      });
      this.formatDataList = list;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.dataList = [];
      this.pageParams.totalCount = this.dataList.length;
      this.loading = true;
      mApi
        .getGraphicList({
          title: this.search,
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          statusFlag: 0 // 只查询有效未删除的图文
        })
        .then(res => {
          console.log('article list: ', res);
          this.dataList = res.data || [];
          this.pageParams.totalCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getData();
    },
    searchMaterial() {
      this.pageParams.pageNo = 1;
      this.getData();
    },
    // newMaterail() {
    //   let path = this.isMass ? '/wechatoa/oa/materials/addGraphic?isMass=1' : '/wechatoa/oa/materials/addGraphic';
    //   let url = location.protocol + '//' + location.host + '/dsp.html#' + path;
    //   window.open(url, '_blank');
    // },
    clickSure() {
      // max limit
      if (this.selectedList.length > this.limit) {
        this.$message.error('不可选择超过 ' + this.limit + ' 个图文');
        return false;
      }
      if (this.ifMulti) {
        let _dataList = this.dataList;
        let _selectedList = this.selectedList;
        let _result = this.dataList.filter((item, index) => {
          if (this.selectedList.includes(index)) {
            return true;
          }
        });
        this.selectedContentList = _result;
        this.$emit('picked', this.selectedContentList);
      } else {
        if (Object.keys(this.selectedContent).length == 0) return;
        this.formatDataList[this.curSelected].isActive = false;
        this.$emit('picked', [this.selectedContent]);
      }
    },
    clickCancel() {
      this.$emit('cancel');
    },
    selectChange(selectedIndex) {
      if (this.ifMulti) {
        let _index = this.selectedList.indexOf(selectedIndex);
        let _item = this.formatDataList[selectedIndex];
        if (this.selectedList.includes(selectedIndex)) {
          let itemIndex = this.selectedList.indexOf(selectedIndex);
          let _arr = JSON.parse(JSON.stringify(this.selectedList));
          _arr.splice(itemIndex, 1);
          this.selectedList = _arr;
          _item.isActive = false;
        } else {
          this.selectedList.push(selectedIndex);
          _item.isActive = true;
        }
      } else {
        let curIndex = selectedIndex;
        if (curIndex === this.curSelected) return;
        this.oldSelected = this.curSelected;
        this.curSelected = curIndex;
        if (this.formatDataList[this.oldSelected]) {
          this.formatDataList[this.oldSelected].isActive = false;
        }
        this.formatDataList[this.curSelected].isActive = true;
        this.selectedContent = this.dataList[this.curSelected];
      }
    }
  }
};
</script>

<style scoped>
.material-article-list {
  margin: 30px 20px;
  max-height: 400px;
  overflow-y: auto;
}
.materail-dialog-pagination {
  text-align: center;
}
</style>
