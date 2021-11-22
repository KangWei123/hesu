<template>
  <div class="store-floor">
    <div class="floor-label">楼层</div>
    <el-button class="is-plain add-floor-btn"
               @click="showEditDialog()">+新增楼层</el-button>
    <div v-for="(item,index) in storeFloors"
         :class="curFloorLayoutItem&& curFloorLayoutItem.id === item.id ? 'floor-item-selected':''"
         class="floor-item">
      <div class="floor-name ellipsis"
           @click="showFloorLayout(item)">
        F{{item.floorValue}}-{{item.name}}
      </div>
      <img class="ic-opt"
           src="@/dss-store/src/images/ic-edit.png"
           @click="showEditDialog(item)">
      <img class="ic-opt"
           src="@/dss-store/src/images/ic-del.png"
           @click="handleDelItem(item, index)">
    </div>
    <el-dialog title="楼层设置"
               :visible.sync="showDialog"
               v-if='showDialog'
               width="500px">
      <el-form :model="editForm"
               label-width="80px">
        <el-form-item label="楼层名称:">
          <el-input v-model.trim="editForm.name"
                    maxlength="20"
                    style="width: 195px"></el-input>
        </el-form-item>
        <el-form-item label="楼层数:">
          <el-select v-model="editForm.floorValue"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :disabled="item.disabled"
                       :value="item.value">
            </el-option>
          </el-select>
          <span class="outside-text">包含店外</span>
          <el-checkbox v-model="editForm.containsOutdoor"></el-checkbox>
        </el-form-item>
        <el-form-item label="楼层样式:">
          <el-radio-group v-model="editForm.floorShape"
                          :disabled="!!editForm.id">
            <span class="floor-style">
              <span class="shape"></span>
              <el-radio :label="floorEnum.floorShape.rectangle">
                <span>长方形</span>
              </el-radio>
            </span>
            <span class="floor-style">
              <span class="shape rect"></span>
              <el-radio :label="floorEnum.floorShape.rect">
                <span>正方形</span>
              </el-radio>
            </span>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer"
           style="text-align: center">
        <el-button @click="onSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import newStoreApi from '@/dss-store/src/api/index.js';
import floorEnum from '../floor-enum.js';

export default {
  name: 'store-floor',
  data() {
    return {
      floorEnum,
      showDialog: false,
      storeFloors: [],
      curFloorLayoutItem: null,
      curEditItem: null,
      options: [
        // {
        //   value: 0,
        //   label: '店外',
        //   disabled: false
        // },
        {
          value: 1,
          label: '1',
          disabled: false
        },
        {
          value: 2,
          label: '2',
          disabled: false
        },
        {
          value: 3,
          label: '3',
          disabled: false
        },
        {
          value: 4,
          label: '4',
          disabled: false
        },
        {
          value: 5,
          label: '5',
          disabled: false
        },
        {
          value: 6,
          label: '6',
          disabled: false
        },
        {
          value: 7,
          label: '7',
          disabled: false
        },
        {
          value: 8,
          label: '8',
          disabled: false
        },
        {
          value: 9,
          label: '9',
          disabled: false
        },
        {
          value: 10,
          label: '10',
          disabled: false
        }
      ],
      editForm: {
        name: null,
        id: null,
        floorValue: null,
        floorShape: null,
        containsOutdoor: false
      }
    };
  },
  mounted() {
    this.listFloors(false);
  },
  methods: {
    listFloors(isNew, currentFloor) {
      this.$emit('loading');
      newStoreApi
        .floorList({
          pageNo: 1,
          pageSize: 100
        })
        .then(res => {
          if (res.data) {
            this.storeFloors = res.data || [];
            if (this.storeFloors.length) {
              this.options.forEach(floor => {
                floor.disabled = !!this.storeFloors.find(item => {
                  return item.floorValue === floor.value;
                });
              });
              if (isNew) {
                this.curFloorLayoutItem = this.storeFloors[currentFloor - 1];
              } else if (this.curFloorLayoutItem) {
                this.curFloorLayoutItem =
                  this.storeFloors.find(item => {
                    return item.id === this.curFloorLayoutItem.id;
                  }) || this.storeFloors[0];
              } else {
                this.curFloorLayoutItem = this.storeFloors[0];
              }
              this.$emit('floor', this.curFloorLayoutItem);
            }
          }
        })
        .always(res => {
          this.$emit('done');
        });
    },
    showEditDialog(item) {
      if (item) {
        this.curEditItem = item;
        this.editForm = { ...item };
      } else {
        this.editForm = {
          name: null,
          id: null,
          floorValue: null,
          floorShape: floorEnum.floorShape.rectangle
        };
      }
      this.showDialog = true;
    },
    handleDelItem(item, index) {
      this.$confirm('确定删除楼层?', '删除楼层', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.$emit('loading');
          return newStoreApi.floorDelete({
            floorId: item.id
          });
        })
        .then(res => {
          if (res.data) {
            this.storeFloors.splice(index, 1);
            this.options.forEach(floor => {
              floor.disabled = !!this.storeFloors.find(item => {
                return item.floorValue === floor.value;
              });
            });
            if (item.id === this.curFloorLayoutItem.id) {
              if (this.storeFloors.length) {
                this.curFloorLayoutItem = this.storeFloors[0];
              } else {
                this.curFloorLayoutItem = null;
              }
              this.$emit('floor', this.curFloorLayoutItem);
            }
          }
        })
        .catch(() => {
          console.log('取消删除楼层');
        })
        .always(() => {
          this.$emit('done');
        });
    },
    showFloorLayout(item) {
      if (item) {
        this.curFloorLayoutItem = item;
        this.$emit('floor', this.curFloorLayoutItem);
      }
    },
    onSave() {
      this.$emit('loading');
      const params = {
        name: this.editForm.name,
        floorValue: this.editForm.floorValue,
        floorShape: this.editForm.floorShape,
        containsOutdoor: this.editForm.containsOutdoor
      };
      if (!this.editForm.name) {
        this.$emit('done');
        return this.$message({
          message: '请输入楼层名称',
          type: 'error'
        });
      }
      if (!this.editForm.floorValue) {
        this.$emit('done');
        return this.$message({
          message: '请选择楼层',
          type: 'error'
        });
      }

      if (this.editForm.id) {
        params.id = this.editForm.id;
        newStoreApi
          .floorUpdate(params)
          .then(res => {
            this.showDialog = false;
            this.listFloors(false);
          })
          .always(() => {
            this.$emit('done');
          });
      } else {
        newStoreApi
          .floorAdd(params)
          .then(res => {
            this.showDialog = false;
            this.listFloors(true, this.editForm.floorValue);
          })
          .always(() => {
            this.$emit('done');
          });
      }
    },
    onCancel() {
      this.showDialog = false;
    }
  }
};
</script>

<style lang="less">
.store-floor {
  width: 160px;
  height: 100%;
  background: #f5f7fa;
  padding: 20px 10px;
  box-sizing: border-box;
  font-size: 0;
  margin-right: 10px;

  .floor-label {
    color: @black-color;
    font-size: @standard-font;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    margin-bottom: 10px;
    overflow: auto;
  }

  .add-floor-btn {
    width: 140px;
    margin-bottom: 10px;
  }

  .floor-item {
    height: 34px;
    width: 140px;
    line-height: 34px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(221, 228, 239, 1);
    padding-left: 10px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    font-size: 0;

    .floor-name {
      display: inline-block;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @black-color;
      vertical-align: top;
      width: 90px;
    }

    .ic-opt {
      width: 14px;
      height: 14px;
      padding-top: 10px;
    }

    .ic-opt + .ic-opt {
      margin-left: 6px;
    }
  }

  .floor-item-selected {
    color: #256eff;
    background: rgba(208, 224, 255, 1);
    border: 1px solid rgba(37, 110, 255, 1);
  }

  .el-radio {
    margin-right: 0;
    margin-top: 8px;
  }

  .floor-style {
    display: inline-block;
    text-align: center;
  }

  .floor-style + .floor-style {
    margin-left: 20px;
  }

  .shape {
    display: block;
    width: 146px;
    height: 90px;
    background: rgba(255, 255, 255, 1);
    border: 4px solid rgba(215, 217, 219, 1);
    box-sizing: border-box;

    &.rect {
      width: 90px;
    }
  }
  .outside-text {
    margin-left: 10px;
    color: rgba(168, 168, 168, 1);
  }
}
.wkt-body .el-checkbox__inner {
  border-radius: 100%;
}
</style>
