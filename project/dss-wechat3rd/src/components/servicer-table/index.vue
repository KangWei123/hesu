<template>
  <div class="logistics-servicer">
    <el-row class="ls-head">
      <el-col :span="5" class="tleft">
        服务商
      </el-col>
      <el-col :span="6">
        状态
      </el-col>
      <el-col :span="7">
        备注
      </el-col>
      <el-col :span="5">
        操作
      </el-col>
    </el-row>

    <div class="ls-content ls-mt10">
      <el-row class="ls-item" v-for="item in servicerList" :key="item.id">
        <el-col :span="5" class="tleft">
          {{ item.deliveryName }}
        </el-col>
        <el-col :span="6">
          <span v-if="item.status === 0">未{{ typeStr }}</span>

          <el-popover
            placement="top-start"
            width="200"
            v-if="item.status === 1"
            trigger="hover"
            :content="item.auditPeriod"
          >
            <a slot="reference" class="ls-primary">审核中</a>
          </el-popover>

          <span v-if="item.status === 2" :class="item.enable !== 0 ? 'ls-success' : ''">{{
            item.enable === 0 ? '已关闭' : '已开启'
          }}</span>

          <el-popover placement="top-start" width="200" v-if="item.status === 3" trigger="hover" :content="item.reason">
            <a slot="reference" class="ls-danger">{{ typeStr }}失败</a>
          </el-popover>
        </el-col>
        <el-col :span="7" class="tleft">
          {{ item.remark }}
        </el-col>
        <el-col :span="5">
          <a class="ls-primary" v-if="item.status === 0 || item.status === 3" @click="handleServicerOpen(item)"
            >申请{{ typeStr }}</a
          >

          <div @click="changeStatus(item)">
            <el-switch  v-if="item.status === 2"
                        v-model="item.enable"
                        :disabled="isOpenStatus"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#52C41A"
                        inactive-color="#B1B5BD"
                        @change="toggleServicer(item)">
            </el-switch>

            <span class="statusTip Show" v-if="item.enable">开启</span>
            <span class="statusTip hidden" v-else>关闭</span>
          </div>


          <!-- <a class="ls-primary" @click="toggleServicer(item)" v-if="item.status === 2 && item.enable === 0">开启服务</a>

          <a class="ls-primary" @click="toggleServicer(item)" v-if="item.status === 2 && item.enable === 1">关闭服务</a> -->
        </el-col>
      </el-row>
      <el-row class="ls-item ls-nothing" v-if="noServicer">
        没有更多数据了
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    servicerList: {
      type: Array,
      default() {
        return [];
      }
    },
    noServicer: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isOpenStatus: true
    };
  },

  methods: {
    toggleServicer(item) {
      this.$emit('toggleServicer', item);
      this.isOpenStatus = true;
    },
    handleServicerOpen(item) {
      this.$emit('handleServicerOpen', item);
    },
    changeStatus(item) {
      let { enable } = item;
      enable = enable === 0 ? 1 : 0;
      this.$confirm(`是否确认${enable === 0 ? '关闭' : '开启'}服务？`, `${enable === 0 ? '关闭' : '开启'}服务`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.isOpenStatus = false;
        this.toggleServicer(item);
      });
    }
  },

  computed: {
    typeStr() {
      return {
        'logistics-setting': '开通',
        express: '绑定'
      }[this.type];
    }
  }
};
</script>

<style lang="less" scoped>
.logistics-servicer {
  width: 60%;
  min-width: 800px;
  text-align: center;
  .ls-item {
    display: flex;
    align-items: center;
    height: 60px;
    // background: #f2f4f7;
    // border: 1px solid #dcdde0;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 10px;
    .el-col:nth-child(1) {
      padding-left: 20px;
      font-size: 16px;
    }
    .el-col:nth-child(3) {
      line-height: 26px;
      color: #888080;
    }
  }
  .ls-head {
    background: #f5f7fa;
    .el-col:nth-child(1) {
      padding-left: 10px;
    }
  }
  .tleft {
    text-align: left;
  }
  .ls-nothing {
    justify-content: center;
  }
  .ls-primary {
    color: #409eff;
  }
  .ls-danger {
    color: #f56c6c;
  }
  .ls-success {
    // color: #67c23a;
    color: @ui-font-color-black;
  }
  a {
    font-size: 14px;
  }
  .ls-mt10 {
    margin-top: 10px;
  }
}
</style>
