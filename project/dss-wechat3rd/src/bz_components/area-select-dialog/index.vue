<template>
  <el-dialog :visible.sync="showDialog" title="选择区域" class="area-select-dialog" v-loading="loading">
    <div class="area-title">
      <span>省份</span>
      <span style="margin-left: 183px">城市</span>
    </div>
    <div class="area-content">
      <div class="area-box">
        <div class="area-item"
             @click.self="clickProvinceItem(index)"
             :style="{cursor: 'pointer', background: item.selected?'rgba(240,240,240,1)':'white'}"
             v-for="(item, index) in areas">
          <span @click.self="clickProvinceItem(index)">{{item.name}}</span>
          <el-checkbox class="area-check" v-model="item.isChecked" @change="e => onProvinceCheckedChanged(e, index)"></el-checkbox>
        </div>
      </div>
      <div class="area-box" v-if="curClickedProvinceIndex !== -1 && areas[this.curClickedProvinceIndex].cities">
        <div class="area-item"
             v-for="item in areas[this.curClickedProvinceIndex].cities">
          <span>{{item.name}}</span>
          <el-checkbox class="area-check" v-model="item.isChecked"
                       @change="onCityCheckedChanged"></el-checkbox>
        </div>
      </div>
    </div>
    <div slot="footer" style="text-align: center; padding: 20px 0 10px">
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import storeApi from '@/dss-common/api/store';

  export default {
    name: 'area-select-dialog',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      selectedAreas: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    data() {
      return {
        loading: false,
        showDialog: false,
        areas: [], //各个区域列表
        curClickedProvinceIndex: -1 //当前选择的省份
      };
    },
    watch: {
      value(newVal, oldVal) {
        this.showDialog = newVal;
      },
      showDialog: function(newVal, oldVal) {
        this.$emit('input', newVal);
        if (newVal && !this.areas.length) {
          this.fetchAreas();
        } else if (newVal) {
          this.curClickedProvinceIndex = -1;
          this.computeProvinceChecked();
        }
      }
    },
    methods: {
      /**
       * 获取区域列表，省份或者城市
       * @param province 当前省份，当不穿传省份时，加载省份列表，传省份时，加载该省份下的城市列表
       * @param changeCityCheckedState 是否根据省份checked状态改变城市列表的checked状态，在省份checkbox改变状态时，需要传true，其他情况传false
       */
      fetchAreas(province, changeCityCheckedState) {
        if (!province) {
          this.loading = true;
        }
        storeApi
          .queryRegion(province ? province.id : 0)
          .done(res => {
            //如果没有省份id，则是请求省份列表
            if (province) {
              //设置该省份下的城市列表
              const cities = res.data || [];
              cities.forEach(item => {
                this.$set(item, 'isChecked', false);
              });
              this.$set(province, 'cities', res.data || []);
              //计算城市选中情况
              this.computeCityChecked(province, changeCityCheckedState);
            } else {
              this.areas = res.data || [];
              this.areas.forEach(item => {
                this.$set(item, 'isChecked', false);
                this.$set(item, 'selected', false);
              });
              //计算省份选中情况
              this.computeProvinceChecked();
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
      /**
       * 新增、编辑区域第一次进来时，需要计算各个省份的选中情况
       * 根据上次编辑的情况，判断省份是否选中
       */
      computeProvinceChecked() {
        this.areas.forEach(province => {
          const selectedProvince =
            this.selectedAreas &&
            this.selectedAreas.find(item => {
              return province.id === item.regionId;
            });
          province.isChecked = !!selectedProvince;
          province.selected = false;
          if (province.cities && !province.isChecked) {
            province.cities.forEach(city => {
              const selectedCity =
                this.selectedAreas &&
                this.selectedAreas.find(item => {
                  return city.id === item.regionId;
                });
              city.isChecked = !!selectedCity;
            });
          }
        });
      },
      /**
       * 新增、编辑区域第一次进来时，需要计算各个城市的选中情况
       * 如果检测状态来源于省份checkbox变化，则根据省份是否选中批量处理城市选中情况
       * 如果不是来源于省份checkbox选中情况，则根据之前编辑的情况判断选中状态
       * @param curProvince 当前省份，只计算该省份下的city选中情况
       * @param changeCheckedSate 是否根据省份选中状态，批量处理城市选中状态
       */
      computeCityChecked(curProvince, changeCheckedSate) {
        curProvince.cities &&
          curProvince.cities.forEach(city => {
            const selectedCity =
              this.selectedAreas &&
              this.selectedAreas.find(item => {
                return city.id === item.regionId;
              });
            if (changeCheckedSate) {
              city.isChecked = curProvince.isChecked;
            } else {
              city.isChecked = !!selectedCity;
            }
          });
      },
      clickProvinceItem(curIndex) {
        if (curIndex !== this.curClickedProvinceIndex) {
          if (this.curClickedProvinceIndex !== -1) {
            this.$set(this.areas[this.curClickedProvinceIndex], 'selected', false);
          }
          this.$set(this.areas[curIndex], 'selected', true);
          this.curClickedProvinceIndex = curIndex;
          if (!this.areas[curIndex].cities || !this.areas[curIndex].cities.length) {
            this.fetchAreas(this.areas[curIndex], false);
          }
        }
      },
      onProvinceCheckedChanged(checked, index) {
        const cities = this.areas[index].cities;
        if (cities && cities.length) {
          cities.forEach(item => {
            item.isChecked = checked;
          });
        } else {
          this.fetchAreas(this.areas[index], true);
        }
      },
      onCityCheckedChanged(checked) {
        //根据子状态判断是否为全选
        let checkedCount = 0;
        const cities = this.areas[this.curClickedProvinceIndex].cities;
        cities.forEach(item => {
          if (item.isChecked) {
            checkedCount++;
          }
        });
        this.$set(this.areas[this.curClickedProvinceIndex], 'isChecked', checkedCount === cities.length);
      },
      handleOk() {
        const choosedAreas = [];
        const lastChoosedAreas = this.$plain(this.selectedAreas);
        this.areas.forEach(provinceItem => {
          const index = lastChoosedAreas.findIndex(item => {
            return item.regionId === provinceItem.id;
          });
          if (index !== -1) {
            lastChoosedAreas.splice(index, 1);
          }
          if (provinceItem.cities && provinceItem.cities.length) {
            provinceItem.cities.forEach(cityItem => {
              const cityIndex = lastChoosedAreas.findIndex(item => {
                return item.regionId === cityItem.id;
              });
              console.log('index', cityIndex);
              if (cityIndex !== -1) {
                lastChoosedAreas.splice(cityIndex, 1);
              }
            });
          }
          if (provinceItem.isChecked) {
            const tplItem = {
              regionId: provinceItem.id,
              regionName: provinceItem.name
            };
            choosedAreas.push(tplItem);
          } else if (provinceItem.cities && provinceItem.cities.length) {
            provinceItem.cities.forEach(cityItem => {
              if (cityItem.isChecked) {
                const tplItem = {
                  regionId: cityItem.id,
                  regionName: cityItem.name
                };
                choosedAreas.push(tplItem);
              }
            });
          }
        });
        const finalChoosedAreas = lastChoosedAreas.concat(choosedAreas);
        if (finalChoosedAreas.length) {
          this.showDialog = false;
          this.$emit('choosed', finalChoosedAreas);
        } else {
          this.$message.error('请至少选择一个区域');
        }
      }
    }
  };
</script>

<style lang="less">
  .area-select-dialog {
    .el-dialog {
      width: 480px;
      height: 507px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 25px 0px rgba(179, 179, 179, 0.5);
      position: relative;

      .el-dialog__header {
        padding: 0 0 0 20px;
        height: 61px;
        background: rgba(244, 244, 244, 1);
        box-sizing: border-box;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 61px;
      }

      .el-dialog__body {
        padding: 0 0;
        text-align: left;
      }

      .area-title {
        margin: 0 64px 0 15px;
        height: 30px;
        box-sizing: border-box;
        border-bottom: 1px solid #EEEEEE;
        font-size: 14px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
      }

      .area-content {
        padding: 10px 15px 3px;
        height: 332px;
        box-sizing: border-box;

        .area-box {
          width: 192px;
          overflow-y: auto;
          display: inline-block;
          height: 319px;
          box-sizing: border-box;
        }

        .area-box + .area-box {
          margin-left: 41px;
        }

        .area-item {
          position: relative;
          width: 168px;
          height: 30px;
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 30px;
          box-sizing: border-box;
          padding-left: 5px;

          .area-check {
            position: absolute;
            right: 5px;
          }
        }
      }

      .area-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 80px;
        background: rgba(244, 244, 244, 1);
        text-align: center;

        .ok-btn {
          margin-top: 23px;
        }
      }
    }
  }
</style>
