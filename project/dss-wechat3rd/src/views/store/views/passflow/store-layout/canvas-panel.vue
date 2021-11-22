<template>
  <div class="canvas-panel"
       @drop="onDrop"
       @dragover="onDragover"
       @click.self="onActivated(-1)"
       :style="{'pointer-events': isEdit ? '' : 'none','background':isEdit ?'':'#EEF3FF'}">
    <div class="internal-box"
         v-if="outside"></div>
    <VueDragResize v-for="(item, index) in layout"
                   @activated="onActivated(index)"
                   :key='index'
                   :isActive="index === curActivatedIndex"
                   parentLimitation
                   :isDraggable='isEdit'
                   :isResizable='isEdit'
                   :x="item.left"
                   :y="item.top"
                   :w="item.width"
                   :h="item.height"
                   :z="item.z"
                   v-on:resizing="newRect => resize(newRect, item)"
                   v-on:dragging="newRect => resize(newRect, item)">
      <div class="area-item"
           :class="isEdit?'store-camera':'area-show'"
           v-if="item.type === decorateType.shop|| item.type ===decorateType.outside|| item.type ===decorateType.cashier">

        <el-button class="edit-area rect-btn"
                   :class="isEdit?'store-enter-exit':'edit-show'"
                   @click="showCameraDialog(item, index)"
                   :style="{top: (item.height/2) + 'px',left: (item.width/2) + 'px'}">
          <img class="item-icon"
               :src="require(`@/dss-store/src/images/area/${isEdit ?'':'sw-'}${item.iconName}`)">
          <span class="item-text">{{item.areaName}}</span>
        </el-button>
      </div>
      <div class="area-item"
           :class="isEdit?'store-enter-exit':'area-show'"
           :style="{lineHeight: item.height + 'px'}"
           v-if="item.type === decorateType.enter_exit">
        <el-button class="edit-area rect-btn"
                   :class="isEdit?'store-enter-exit':'edit-show'"
                   @click="showCameraDialog(item)"
                   :style="{top: (item.height/2) + 'px',left: (item.width/2) + 'px'}">
          <img class="item-icon"
               :src="require(`@/dss-store/src/images/area/${isEdit ?'':'sw-'}${item.iconName}`)">
          <span class="item-text">{{item.areaName}}</span>
        </el-button>
      </div>
      <div class="area-item"
           :data-id="item.left"
           :class="isEdit?'store-decorate':'area-show'"
           :style="{lineHeight: item.height + 'px'}"
           v-if="item.type === decorateType.area">
        <img class="item-icon"
             :src="require(`@/dss-store/src/images/area/${isEdit ?'':'sw-'}${item.iconName}`)">
        <span class="item-text">{{item.areaName}}</span>
      </div>

      <div class="area-item"
           :data-id="item.left"
           :class="isEdit?'store-decorate':'area-show'"
           :style="{lineHeight: item.height + 'px'}"
           v-if="item.type === decorateType.custom">
        <div @click="showCustomDialog(item)"
             class="edit-custom rect-btn">
          <span class="item-text overflow"
                :style="{width: item.width + 'px'}">{{item.areaName}}</span>
        </div>
      </div>

      <span class="area-del-icon"
            :style="{left: (item.width - 20) + 'px'}"
            v-if="index === curActivatedIndex&&isEdit"
            @click="handleDelArea(curActivatedIndex)"></span>
    </VueDragResize>
    <el-dialog :title="editForm.type === floorEnum.decorateType.enter_exit ? '出入口设置' : '区域设置'"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="showDialog"
               @close="onDialogClose"
               width="500px">
      <el-form :model="editForm"
               label-width="90px"
               @submit.native.prevent>
        <el-form-item :label="editForm.type === floorEnum.decorateType.enter_exit ? '出入口名称' : '区域名称'">
          <el-input v-model.trim="editForm.areaName"
                    maxlength="20"
                    style="width: 195px"></el-input>
        </el-form-item>
        <el-form-item label="摄像头:"
                      v-if="editForm.type !== decorateType.custom">
          <el-select v-model="editForm.deviceId"
                     placeholder="请选择"
                     @change="deviceChange">
            <el-option v-for="item in deviceList"
                       :key="item.id"
                       :label="item.deviceName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           style="text-align: center">
        <el-button @click="onSave"
                   v-if="editForm.type !== decorateType.custom">确定</el-button>
        <el-button @click="onCustomSave"
                   v-else>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize';
import floorEnum from '../floor-enum.js';
import newStoreApi from '@/dss-store/src/api/index.js';

// 获取元素想对body的x距离
function getLeft(e) {
  let offset = e.offsetLeft;
  if (e.offsetParent != null) offset += getLeft(e.offsetParent);
  return offset;
}

// 获取相对body的y距离
function getTop(e) {
  let offset = e.offsetTop;
  if (e.offsetParent != null) offset += getTop(e.offsetParent);
  return offset;
}

export default {
  name: 'canvas-panel',
  components: {
    VueDragResize
  },
  props: {
    floorItem: {
      type: Object,
      default: {}
    },
    /**
     * obj properties
     * left 距离左边的位置
     * top 距离顶部的位置
     * width 宽度
     * height 高度
     * type 区域类型：人脸区域、出入口
     * areaName 区域名称
     * deviceId 摄像头id
     * */
    layout: {
      type: Array,
      default: []
    },
    deviceList: {
      type: Array,
      default: []
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    outside: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      floorEnum,
      decorateType: floorEnum.decorateType,
      curActivatedIndex: -1,
      showDialog: false,
      curEditItem: null,
      curEditIndex: null,
      deviceId: null,
      editForm: {
        type: null,
        areaName: null,
        deviceId: null
      }
    };
  },

  watch: {
    //监听保存旧值
    'editForm.deviceId'(newVal, oldVal) {
      this.deviceId = oldVal;
    }
  },

  computed: {
    // 在使用有说明

    compatibleScale() {
      return 1;
    }
  },
  methods: {
    deviceChange(newval, oldVal) {
      let device = null;
      this.deviceList.forEach(item => {
        if (item.id === newval) {
          device = item;
        }
      });
      if (device && device.areaId && this.curEditItem.id !== device.areaId) {
        this.$confirm('该设备已绑定到' + device.areaName + '，是否强制替换。', '绑定设备', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning'
        })
          .then(() => {})
          .catch(() => {
            this.editForm.deviceId = this.deviceId;
          });
      }
    },

    onActivated(index) {
      this.curActivatedIndex = index;
    },

    showCustomDialog(item) {
      this.curEditItem = item;
      this.editForm = item;
      this.showDialog = true;
    },

    showCameraDialog(item, index) {
      if (!this.isEdit) {
        return;
      }
      if (item && item.type !== floorEnum.decorateType.area) {
        this.curEditIndex = index;
        this.curEditItem = item;
        this.editForm.deviceId = item.deviceId || null;
        this.editForm.id = item.id || null;
        this.editForm.areaName = item.areaName;
        this.editForm.type = item.type;
        if (item.id) {
          this.$emit('loading');
          newStoreApi
            .areaDetail({
              storeAreaId: item.id
            })
            .then(res => {
              if (res.data && res.data.storeAreaDeviceList && res.data.storeAreaDeviceList.length) {
                item.deviceId = res.data.storeAreaDeviceList[0].id || null;
                this.editForm.deviceId = res.data.storeAreaDeviceList[0].id || null;
              } else {
                item.deviceId = null;
                this.editForm.deviceId = null;
              }
              this.showDialog = true;
            })
            .always(() => {
              this.$emit('done');
            });
        } else {
          this.showDialog = true;
        }
      }
    },
    onDialogClose() {
      if (!this.curEditItem.id && this.curEditItem.type !== floorEnum.decorateType.custom) {
        this.layout.splice(this.curEditIndex, 1);
      }
      this.curActivatedIndex = -1;
    },

    onCustomSave() {
      if (!this.editForm.areaName) {
        this.$message('请输入区域名称');
        return;
      }
      this.curEditItem.areaName = this.editForm.areaName;
      this.showDialog = false;
      this.$emit('success');
    },

    onSave() {
      if (!this.editForm.areaName) {
        this.$message('请输入区域名称');
        return;
      }
      if (!this.editForm.deviceId) {
        this.$message('请选择摄像头');
        return;
      }
      if (this.curEditItem.id) {
        this.$emit('loading');
        newStoreApi
          .areaUpdate({
            id: this.curEditItem.id,
            name: this.editForm.areaName,
            deviceIds: this.editForm.deviceId
          })
          .then(res => {
            if (res.data) {
              this.curEditItem.areaName = this.editForm.areaName;
              this.curEditItem.deviceId = this.editForm.deviceId;
              this.showDialog = false;
            }
            this.$emit('success');
          })
          .always(() => {
            this.$emit('done');
          });
      } else {
        this.curEditItem.areaName = this.editForm.areaName;
        this.curEditItem.deviceId = this.editForm.deviceId;
        this.$emit('loading');
        newStoreApi
          .areaAdd({
            type: this.curEditItem.type,
            name: this.curEditItem.areaName,
            floorId: this.floorItem.id,
            deviceIds: this.curEditItem.deviceId
          })
          .then(res => {
            if (res.data) {
              this.curEditItem.id = res.data;
              this.showDialog = false;
              this.$emit('success');
            }
          })
          .always(() => {
            this.$emit('done');
          });
      }
    },
    handleDelArea(delIndex) {
      this.$emit('loading');
      const curItem = this.layout[delIndex];
      if (curItem.id) {
        newStoreApi
          .areaDelete({
            areaId: curItem.id
          })
          .then(res => {
            if (res.data) {
              this.curActivatedIndex = -1;
              this.curEditItem = null;
              this.layout.splice(delIndex, 1);
              this.$emit('success');
            }
          })
          .always(() => {
            this.$emit('done');
          });
      } else {
        this.curActivatedIndex = -1;
        this.curEditItem = null;
        this.layout.splice(delIndex, 1);
        this.$emit('success');
      }
    },
    resize(newRect, item) {
      console.log(newRect.left, item.left);
      item.width = newRect.width;
      item.height = newRect.height;
      item.top = newRect.top;
      item.left = newRect.left;
    },
    /**
     * 允许拖拽
     */
    onDragover(ev) {
      ev.preventDefault();
    },
    onDrop(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      const data = ev.dataTransfer;
      if (data.getData('tag') === 'canvas-panel') {
        // 获取当前节点（$el = div.canvas-panel）相对body位置
        const panelTop = getTop(this.$el);
        const panelLeft = getLeft(this.$el);

        // 获取拖放到目标相对body位置
        const targetTop = getTop(ev.target);
        const targetLeft = getLeft(ev.target);
        // 计算相对节点（$el = div.canvas-panel）的距离
        // layerX在谷歌和火狐有区别，火狐是带有缩放的距离，谷歌是实际距离，所以乘以compatibleScale
        let x = (targetLeft - panelLeft + ev.offsetX) * this.compatibleScale;
        let y = (targetTop - panelTop + ev.offsetY) * this.compatibleScale;
        const decorate = ev.dataTransfer.getData('decorate');
        const decorateObj = JSON.parse(decorate);
        const isArea = decorateObj.type === floorEnum.decorateType.area;
        const isEnterExit = decorateObj.type === floorEnum.decorateType.enter_exit;
        const isCustom = decorateObj.type === floorEnum.decorateType.custom;
        const isOutside = decorateObj.type === floorEnum.decorateType.outside;
        let width = 100;
        let height = 100;
        if (isArea || isEnterExit) {
          width = 70;
          height = 70;
        }
        if (isCustom) {
          width = 90;
          height = 90;
        }
        //获取容器高度
        let clientHeight = this.$el.clientHeight;
        //获取容器宽度
        let clientWidth = this.$el.clientWidth;
        //如果拖动组件到容器边框上，自动放入容器
        if (clientHeight && clientWidth) {
          if (x + width > clientWidth) {
            x = clientWidth - width;
          }
          if (y + height > clientHeight) {
            y = clientHeight - height;
          }
        }
        if (!this.outside && isOutside) {
          return this.$message({ message: '未开启店外不能设置店外设备！', type: 'warning' });
        }
        console.log('dcs', x, y);

        const newItem = {
          left: x,
          top: y,
          z: isArea ? 2 : 1,
          width: width,
          height: height,
          type: decorateObj.type,
          areaName: decorateObj.areaName,
          iconName: decorateObj.iconName
        };
        this.layout.push(newItem);
        this.curActivatedIndex = this.layout.length - 1;
        if (!isArea) {
          this.showCameraDialog(newItem, this.curActivatedIndex);
        }
      }
    }
  }
};
</script>

<style lang="less">
.canvas-panel {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .internal-box {
    width: 75%;
    height: 75%;
    border: 7px solid #d9e6ff;
    box-sizing: border-box;
    margin: 0 auto;
    margin-top: 70px;
    z-index: -1;
  }
  .el-button {
    border: none;
  }
  .area-del-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 8px;
    cursor: pointer;
    background: url('../../../images/ic-area-del.png') no-repeat;
    background-size: 100%;
  }

  .edit-area {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, -50%);
  }

  .edit-custom {
    position: relative;
    height: 20px;
    width: 100%;
    cursor: pointer;
  }

  .area-item {
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    line-height: 70px;
    text-align: center;
  }

  .store-camera {
    z-index: 1000;
    border: 1px solid #e4edff;
  }

  .store-enter-exit {
    border: 1px solid #e4edff;
  }

  .store-decorate {
    background: #e4edff;
    color: rgba(37, 110, 255, 1);
  }

  .edit-show {
    color: #709ff7;
    background: transparent;
  }

  .area-show {
    border: 2px dashed rgba(197, 211, 242, 1);
    color: #709ff7;
  }

  .item-text {
    vertical-align: middle;
  }

  .overflow {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    line-height: 16px;
  }

  .item-icon {
    width: 17px;
    height: 17px;
    vertical-align: middle;
  }
}
</style>
