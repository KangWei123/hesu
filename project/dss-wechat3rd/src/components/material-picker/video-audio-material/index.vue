<template>
  <div class="materials-dialog materials-video-audio">
    <el-dialog :title="'选择' + typeText" :visible.sync="dialogVisible" width="700px" @close="clickCancel">
      <div class="material-dialog-head">
        <!-- 搜索 -->
        <el-input
          v-model="search"
          :placeholder="'输入文件名搜索' + typeText"
          style="width:250px"
        ></el-input>
        <el-button type="primary" class="dialog-search-material" @click="searchMaterial">搜索</el-button>
      </div>

      <template>
        <el-table
          v-if="multiple"
          v-loading="pageParams.loading"
          class="materials-dialog-table"
          style="width:650px; "
          :show-header="false"
          :data="dataList"
          @selection-change="handleSelectionChange"
          @close="clickCancel"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column width="310" prop="materialName" label="名称"></el-table-column>
          <el-table-column align="center" width="100" class-name="stress-font">
            <div slot-scope="scope" :data-type="scope">
              <img
                class="voice-icon"
                src="./video.png"
                style="cursor:pointer; width:18px; height:18px;"
                @click="showVideoPlayer(scope.row)"
              />
            </div>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        </el-table>

        <el-radio-group v-else v-model="selectedName">
          <el-table
            v-loading="pageParams.loading"
            class="materials-dialog-table"
            style="width:650px; "
            :show-header="false"
            :data="dataList"
            @row-click="selectChange"
            @close="clickCancel"
          >
            <el-table-column width="350">
              <template slot-scope="scope">
                <el-radio :label="scope.row.id">{{ scope.row.materialName }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center" width="100" class-name="stress-font">
              <div slot-scope="scope" :data-type="scope">
                <img
                  class="voice-icon"
                  src="./video.png"
                  style="cursor:pointer; width:18px; height:18px;"
                  @click="showVideoPlayer(scope.row)"
                />
              </div>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
          </el-table>
        </el-radio-group>
      </template>
      <div style="text-align: center" v-if="!!dataList && !!dataList.length">
        <el-pagination
          layout="prev, pager, next, jumper, sizes, total"
          :total="pageParams.totalCount"
          :page-size="pageParams.pageSize"
          :page-sizes="[pageParams.pageSize]"
          :current-page="pageParams.pageNo"
          @current-change="onPageChange"
          class="material-dialog-pagination"
        ></el-pagination>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button style="width:90px" size="mini" @click="clickCancel">取 消</el-button>
        <el-button style="width:90px" size="mini" type="primary" @click="clickSure">确 定</el-button>
      </span>
    </el-dialog>

    <VideoPlayer
      v-if="showVideo && currentVideoPlayer.url"
      :value="currentVideoPlayer.value"
      :url="currentVideoPlayer.url"
      :originalName="currentVideoPlayer.originalName"
      @closeVideo="closeVideoPlayer"
    />
  </div>
</template>

<script>
import mApi from '../materials.js';
import config from '../MaterialsConfig.js';
import './index.less';
import VideoPlayer from '../../video-player/index';

export default {
  components: { VideoPlayer },
  props: {
    //是否视频，否则音频
    isVideo: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: '',
      dialogVisible: true,
      selectedName: '',
      selectedContent: {},
      typeText: '',
      dataList: [],
      //列表分页查询
      pageParams: {
        totalCount: 0,
        pageNo: 1,
        pageSize: 8,
        loading: false
      },
      showVideo: false,
      currentVideoPlayer: {
        value: 0,
        url: '',
        originalName: ''
      }
    };
  },
  mounted() {
    this.fetchData();
    this.typeText = this.isVideo ? '视频' : '语音';
  },
  methods: {
    fetchData() {
      this.pageParams.loading = true;
      mApi
        .list({
          materialType: this.isVideo ? config.FILE_TYPES.VIDEO : config.FILE_TYPES.VOICE,
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          title: this.search,
          materialName: this.search
        })
        .then(res => {
          this.dataList = res.data || [];
          this.pageParams.totalCount = res.totalCount;
        })
        .always(() => {
          this.pageParams.loading = false;
        });
    },
    searchMaterial() {
      this.pageParams.pageNo = 1;
      this.fetchData();
    },

    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.fetchData();
    },
    clickCancel() {
      this.$emit('cancel');
    },
    clickSure() {
      if (Object.keys(this.selectedContent).length == 0) return;
      this.$emit('picked', this.selectedContent);
    },
    selectChange(row) {
      this.selectedContent = this.dataList.filter(item => {
        return item.id == row.id;
      })[0];
      this.selectedName = row.originalName;
    },
    handleSelectionChange(val) {
      this.selectedContent = val;
    },
    // player
    showVideoPlayer(video) {
      this.currentVideoPlayer = {
        value: video.id,
        url: video.localUrl,
        originalName: video.originalName
      };
      this.showVideo = true;
    },
    closeVideoPlayer() {
      this.showVideo = false;
    }
  }
};
</script>

<style lang="less">
.el-dialog__title {
  line-height: 40px;
}
.add-video-material {
  display: inline-block;
  float: right;
  .el-button.is-round {
    border-radius: 5px;
    width: 90px;
  }
}
</style>
