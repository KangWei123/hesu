<template>
  <div class="qrcode"
       element-loading-text="更新中..."
       v-loading="loading.update">
    <iframe height="0"
            ref="ifr"
            src="about:blank"
            style="display:none;"
            width="0"></iframe>

    <div class="qrcode-filter">
      <el-form class="wkt-opt-label-container"
               inline>
        <el-form-item>
          <el-select clearable
                     placeholder="选择状态"
                     size="mini"
                     v-model="keyword.status">
            <el-option :key="item.value"
                       :label="item.label"
                       :value="item.value"
                       v-for="item in options"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input clearable
                    placeholder="请输入关键词"
                    size="mini"
                    style="width:250px"
                    v-model.trim="keyword.qrName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearch"
                     class="search-btn"
                     size="mini"
                     type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="qrcode-box">
        <el-button @click="onAdd"
                   round
                   size="mini"
                   style="float: right;"
                   type="primary">新建二维码</el-button>
      </div>
    </div>
    <div class="qrcode-list">
      <el-table :data="tableData"
                class="wkt-table"
                style="width: 100%"
                v-loading="loading.list||deleteLoading">
        <el-table-column align="center"
                         label="二维码名称"
                         prop="qrName" />
        <el-table-column :formatter="timeFormatter"
                         align="center"
                         label="创建时间"
                         prop="createTime" />
        <el-table-column :formatter="qrTypeFormatter"
                         align="center"
                         label="二维码类型"
                         prop="qrType" />
        <el-table-column :show-overflow-tooltip="true"
                         align="center"
                         label="粉丝标签"
                         prop="tagStr" />
        <el-table-column align="center"
                         label="关注次数"
                         prop="qrTotal" />
        <el-table-column :formatter="statusFormatter"
                         align="center"
                         label="状态"
                         prop="status" />
        <el-table-column :width="190"
                         align="center"
                         label="操作"
                         prop="id">
          <div slot-scope="scope">
            <div v-if="scope.row.status === 1">
              <el-button @click="onEditor(scope.row)"
                         class="operation"
                         type="text">编辑</el-button>
              <!-- <el-tooltip placement="bottom">
                <div slot="content">
                  <img class="qrcode-list-tooltip-img"
                       :src="scope.row.qrCodeUrl"
                       alt>
              </div>-->
              <!--<a @click="downloadIamge(scope.row.qrCodeUrl,scope.row.qrName)" href="javascript:void(0);">下载</a>-->
              <!-- <a :href="scope.row.qrCodeUrl"
                   :download="scope.row.qrName"
                   target="_blank">下载</a>
              </el-tooltip>-->
              <el-button @click="onDownload(scope.row)"
                         class="operation"
                         type="text">下载</el-button>
              <el-button :disabled="!scope.row.status"
                         @click="onDisabled(scope.row)"
                         class="operation"
                         type="text">停用</el-button>
            </div>
            <div v-else>
              <a class="disabled-qrcode"
                 type="text">已停用</a>
            </div>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page.pageNo"
                     :page-size="page.pageSize"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     :total="totalCount"
                     @current-change="onPageChange"
                     @size-change="onSizeChange"
                     layout="prev, pager, next, jumper, sizes, total"></el-pagination>
      <edit ref="edit" />
      <download :downloadList="downloadList"
                ref="download" />
    </div>
  </div>
</template>

<script>
import tableMixin from './tableMixin.js';
import qrCodeApi from '@/dss-wechat3rd/src/api/qrCode.js';
import utils from '@/dss-common/utils/index';
import edit from './edit.vue';
import download from './download.vue';
export default {
  mixins: [tableMixin],
  components: {
    edit,
    download
  },
  data() {
    let downloadUrl = location.protocol + '//' + location.host + qrCodeApi.download;
    return {
      // 停用全渠道二维码时的 loading 状态
      deleteLoading: false,
      keyword: {
        status: '',
        qrName: ''
      },
      downloadUrl,
      downloadList: [],
      typeName: '二维码',
      api: qrCodeApi,
      options: [
        {
          value: null,
          label: '全部状态'
        },
        {
          value: 1,
          label: '生效中'
        },
        {
          value: 0,
          label: '已停用'
        }
      ]
    };
  },
  methods: {
    //
    // downloadIamge(imgsrc, name) {//下载图片地址和图片名
    //   let image = new Image();
    //   imgsrc = 'https://cn.bing.com/th?id=OIP.2cQeGIZ9csQOQIjiU4ptRAHaEp&pid=Api&rs=1&p=0';
    //   // 解决跨域 Canvas 污染问题
    //   image.setAttribute("crossOrigin", "anonymous");
    //   image.onload = function() {
    //     let canvas = document.createElement("canvas");
    //     canvas.width = image.width;
    //     canvas.height = image.height;
    //     let context = canvas.getContext("2d");
    //     context.drawImage(image, 0, 0, image.width, image.height);
    //     let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    //     let a = document.createElement("a"); // 生成一个a元素
    //     let event = new MouseEvent("click"); // 创建一个单击事件
    //     a.download = name || "photo"; // 设置图片名称
    //     a.href = url; // 将生成的URL设置为a.href属性
    //     a.dispatchEvent(event); // 触发a的单击事件
    //   };
    //   image.src = imgsrc;
    // },
    //
    //
    onAdd() {
      this.$router.push('/marketing/qrCode/add');
    },
    onDownload(e) {
      const list = [];
      if (e.qrCodeUrl && e.qrCodeUrl.length) {
        e.qrCodeUrl.forEach((item, index) => {
          list.push({
            width: item.qrCodeSize && item.qrCodeSize.replace(/二维码尺寸/g, ''),
            qrCodeUrl: item.qrCodeUrl,
            qrName: e.qrName
          });
        });
      } else if (e.qrCodeUrl) {
        list.push({
          width: '7cm',
          qrCodeUrl: e.qrCodeUrl.qrCodeUrl,
          qrName: e.qrName
        });
      }
      this.downloadList = list;
      this.$refs.download && this.$refs.download.show(e);
    },
    onEditor(e) {
      if (e.miniProgramInfo) {
        this.$refs.edit && this.$refs.edit.show(e);
      } else {
        this.$router.push({
          path: '/marketing/qrCode/add',
          query: { id: e.id }
        });
      }
    },
    statusFormatter(row, column, cellValue, index) {
      return cellValue ? '生效中' : '已停用';
    },
    qrTypeFormatter(row, column, cellValue, index) {
      return row.qrType == 1 ? '公众号二维码' : row.qrType == 2 ? '小程序二维码' : '未知';
    },
    timeFormatter(row, column, cellValue, index) {
      return utils.timeFormat(cellValue);
    },
    formatTableData(data) {
      return data.map(item => {
        item.qrCodeUrl = item.qrSceneStr && JSON.parse(item.qrSceneStr);
        if (!item.tagStr) {
          item.tagStr = (item.categoryTagDTOList || []).reduce((preVal, curVal) => {
            const categoryName = curVal.categoryName;
            return preVal + (curVal.tagDTOList || []).map(item => categoryName + ': ' + item.tag).join('，') + ', ';
          }, '');
        }
        item.tagStr = item.tagStr || '无';
        return item;
      });
    },
    onDisabled(row) {
      let { status, id } = row;
      this.$confirm('该操作无法撤销，确定停用该二维码吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true;
          qrCodeApi
            .updated({
              ...row,
              status: 0
            })
            .done(res => {
              this.deleteLoading = false;
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              let index = this.tableData.findIndex(item => item.id === id);
              this.tableData[index].status = 0;
            });
        })
        .catch(() => {
          console.log('取消停用');
        });
    }
  }
};
</script>

<style lang="less">
.qrcode {
  padding: 0 20px;
  .qrcode-list {
    padding: 20px 0;
    background: white;
    border-radius: 4px;
  }
  .qrcode-filter {
    position: relative;
    .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
    .qrcode-box {
      position: absolute;
      top: 30px;
      right: 20px;
    }
  }

  .el-table .disabled-qrcode {
    color: #ccc;
    cursor: no-drop;
  }
  .el-table .disabled-qrcode:hover {
    color: #ccc;
    cursor: no-drop;
  }
}
.qrcode-list-tooltip-img {
  width: 150px;
}

.el-button.operation {
  padding: 0 5px;
}
</style>
