<template>
  <div class="picture-item">
    <div
      class="folder-material"
      @dblclick="handleGroup"
      v-if="data.materialType===materialEnum.materialType.FOLDER"
      :class="showSupernatant||isChecked?'picture-checked':''"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
    >
      <!-- <el-checkbox v-model="isChecked" class="check" v-show="showSupernatant||isChecked"></el-checkbox> -->
      <div class="folder-header"></div>
      <div class="folder-content">
        <div class="img-box">
          <div class="img-item" v-for="(item,index) in 4" :key="index">
            <img
              v-if="data.materials[index]"
              :src="data.materials[index]?data.materials[index].localUrl:''"
              :draggable="false"
            />
            <div v-else class="none"></div>
          </div>
        </div>
        <div class="material-name">{{data.groupName}}</div>
      </div>
    </div>
    <div
      class="picture-material"
      v-else
      :class="showSupernatant||isChecked?'picture-checked':''"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
    >
      <el-checkbox
        v-model="isChecked"
        class="check"
        v-show="showSupernatant||isChecked"
        @change="change"
      ></el-checkbox>
      <img :src="data.localUrl||''" alt @click="selectImg" :draggable="false" />
      <div class="material-name" @click="selectImg">{{data.materialName}}</div>
    </div>
  </div>
</template>
<script>
import categoryTree from '../category-tree/index.vue';
import materialEnum from '../material-type';

export default {
  components: {
    categoryTree
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    idList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showSupernatant: false,
      isChecked: false,
      visible: false,
      materialEnum
    };
  },
  watch: {
    idList() {
      let index = this.idList.findIndex(item => item.id === this.data.id);
      this.isChecked = index >= 0;
    },
    data() {
      let index = this.idList.findIndex(item => item.id === this.data.id);
      this.isChecked = index >= 0;
    }
  },
  mounted() {},
  methods: {
    selectImg() {
      this.isChecked = !this.isChecked;
      let selectImg = this.data;
      selectImg.isChecked = this.isChecked;
      this.$emit('selectImg', selectImg);
    },
    change() {
      let selectImg = this.data;
      selectImg.isChecked = this.isChecked;
      this.$emit('selectImg', selectImg);
    },
    //双击文件夹
    handleGroup() {
      this.$emit('handleGroup', this.data);
    },
    mouseenter() {
      this.showSupernatant = true;
      this.$emit('mouseenter', this.data.id);
    },
    mouseleave() {
      this.showSupernatant = false;
    }
  }
};
</script>
<style lang="less" >
.custom-popper {
  padding: 0 !important;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.05);
}
</style>

<style lang="less" scoped>
.picture-item {
  /deep/ .el-checkbox__inner {
    border-radius: 1px;
    width: 16px;
    height: 16px;
  }
  /deep/ .el-checkbox__inner:after {
    border: 1px solid #fff;
    border-top: none;
    border-left: none;
    height: 8px;
    left: 4px;
    position: absolute;
    top: 1px;
    width: 4px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }
  margin-right: 16px;
  margin-bottom: 24px;
  .folder-material.picture-checked {
    .folder-header {
      background: #1890ff;
    }
    .folder-content {
      border: 1px solid #1890ff;
    }
  }

  .folder-material {
    position: relative;
    .check {
      position: absolute;
      top: 15px;
      left: 6px;
      width: 16px;
      height: 16px;
      border: 1px solid #dce1e6;
    }
    .folder-header {
      width: 65px;
      height: 10px;
      background: #e6e9f0;
      border-radius: 4px 0px 0px 0px;
      position: relative;
    }

    .folder-header::after {
      position: absolute;
      position: absolute;
      right: 0px;
      content: '';
      width: 2px;
      height: 0px;
      border-left: 10px solid transparent;
      border-top: 10px solid #fff;
    }

    .folder-content {
      box-sizing: border-box;
      width: 152px;
      height: 130px;
      background: #ffffff;
      border: 1px solid #e6e9f0;
      border-radius: 0px 4px 4px 4px;
      cursor: pointer;
      .img-box {
        display: flex;
        flex-wrap: wrap;
        margin-top: 2px;
        .img-item {
          overflow: hidden;
        }
        img {
          margin-left: 5px;
          margin-top: 5px;
          width: 68px;
          height: 44px;
          display: block;
        }
        .none {
          margin-left: 5px;
          margin-top: 5px;
          width: 68px;
          height: 44px;
          background: #ebeef5;
        }
      }
      .material-name {
        margin-top: 5px;
        height: 22px;
        padding: 0 5px;
        text-align: center;
        color: #303133;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .picture-material.picture-checked {
    border: 1px solid #1890ff;
  }
  .picture-material {
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    padding: 8px;
    width: 152px;
    height: 180px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #e6e9f0;
    img {
      width: 136px;
      height: 136px;
      border-radius: 2px;
      display: block;
      object-fit: scale-down;
    }
    .material-name {
      margin-top: 5px;
      height: 22px;
      padding: 0 5px;
      text-align: center;
      color: #303133;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .check {
      position: absolute;
      top: 5px;
      left: 8px;
    }
  }
  .supernatant {
    width: 100%;
    height: 30px;
    line-height: 30px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      background: transparent;
      margin-right: 13px;
    }
    img:last-child {
      margin-right: 0px;
    }
    .revert-img {
      margin-right: 0px;
    }
  }
}
</style>
