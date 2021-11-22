<template>
  <el-dialog class="report-dialog export-dialog" :visible.sync="show" :show-close="false" :close-on-click-modal="false">
    <div ref="exportDiv" class="export">
      <div class="export-title">
        雪松集团数字化门店周报&nbsp;&nbsp;
        <span v-if="week">({{week}})</span>
      </div>
      <week-panel :portrait-data="portraitData" :passflow-data="passflowData" :global-passflow-data="globalPassflowData" v-if="show"></week-panel>
    </div>
    <span slot="footer" class="dialog-footer" style="backgroud: #f1f4f7">
      <el-button class="btn-cancle" @click="show = false">取 消</el-button>
      <el-button type="primary" class="btn-sure" @click="exportPdf">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import html2canvas from 'html2canvas';
import WeekPanel from './WeekPanel';
import event from '@/dss-common/utils/event';

import * as JsPDF from 'jspdf';

export default {
  components: {
    WeekPanel
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    week: {
      type: String,
      defautl: ''
    },
    portraitData: {
      type: Array,
      default() {
        return [];
      }
    },
    passflowData: {
      type: Array,
      default() {
        return [];
      }
    },
    globalPassflowData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showList: []
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        setTimeout(() => {
          event.trigger('resize');
        }, 100);
      }
    }
  },
  methods: {
    exportPdf() {
      Vue.nextTick(() => {
        const rate = 3.77;
        const w = this.$refs.exportDiv.offsetWidth;
        const h = this.$refs.exportDiv.offsetHeight;

        var imgCanvas = document.createElement("canvas"); // 创建一个canvas节点
        var scale = 4; // 定义任意放大倍数 支持小数
        imgCanvas.width = w * scale; // 定义canvas 宽度 * 缩放
        imgCanvas.height = h * scale; // 定义canvas高度 *缩放
        imgCanvas.style.width = w + "px";
        imgCanvas.style.height = h + "px";
        imgCanvas.getContext("2d").scale(scale, scale); // 获取context,设置scale

        html2canvas(this.$refs.exportDiv, {
          backgroundColor: '#f1f4f7',
          imageTimeout: 30000,
          logging: false,
          canvas: imgCanvas, // 自定义 canvas
          allowTaint: true
        }).then(canvas => {
          // 关闭抗锯齿
          const context = canvas.getContext('2d');
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          const pageData = canvas.toDataURL('image/png', 1.0);
          var alias = Math.random().toString(35);
          const maxLength = Math.max(canvas.width, canvas.height);
          var pdf = new JsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [canvas.width / rate, maxLength / rate]
          });
          pdf.addImage(pageData, 0, 0, canvas.width / rate, canvas.height / rate, 'JPEG', alias, 'SLOW');
          pdf.save('数字化门店周报.pdf');
          this.show = false;
        });
      });
    }
  }
};
</script>

<style lang="less">
.report-dialog.export-dialog {
  .el-dialog {
    width: 1280px;
    max-width: none !important;

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 0;
      background: #f1f4f7;
    }
  }

  .el-dialog__footer {
    background: #f1f4f7;
  }
}

.el-col-card {
  .el-card {
    background: #fff;
  }
  border-radius: 4px;
}

.export {
  width: 1280px;
  padding: 30px 60px 40px 60px;
  box-sizing: border-box;
  background: #f1f4f7;

  .el-card {
    margin-bottom: 0px !important;
  }
}

.export-title {
  font-size: 22px;
  color: #2c3641;
  text-align: center;
  font-weight: bold;

  span {
    color: #858c99;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
