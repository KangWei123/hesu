<template>
  <el-dialog title="同步电销列表" :visible.sync="open" :close-on-click-modal="false" width="500px" @close="handleClose">
    <div class="sync-telemark-container">
      <div class="sync-telemark-item">
        <span class="sync-telemark-label">同步电销功能</span>
        <el-switch v-model="isSync" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </div>
      <p class="sync-telemark-tips">
        说明：若
        <span style="color: #ff4949">新增客户</span
        >满足如下条件，将实时添加至电销列表；若客户多次来自同一渠道，则不会多次同步至电销。
      </p>
      <div class="sync-telemark-item">
        <span class="sync-telemark-label">指定线索属性：</span>
        <div class="sync-telemark-attr" ref="syncTelemarkAttr">
          <div class="sync-telemark-left">
            <i></i>
            <i></i>
            <i></i>
            <span>且</span>
          </div>
          <div class="sync-telemark-right">
            <el-select
              placeholder="请选择"
              size="mini"
              default-first-option
              v-model="sourceIds"
              clearable
              multiple
              filterable
              style="width: 250px"
              @change="handleChangeSource"
            >
              <el-option v-for="(item, index) in sourceList" :key="index" :label="item.name" :value="index"></el-option>
            </el-select>
            <br />
            <div style="padding-top: 50px">
              <ele-multi-cascader
                class="multi-cascader"
                :options="areaDataSource"
                multiple
                :select-children="false"
                :show-all-levels="true"
                expand-trigger="click"
                separator="-"
                @change="areasChange"
                clearable
                change-on-select
                append-to-body
                @active-item-change="handleItemChange"
                size="medium"
                parent-el=".multi-cascader"
                v-model="areas"
                :props="{
                  children: 'childNode',
                  label: 'name',
                  value: 'id',
                }"
              ></ele-multi-cascader>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="sync-telemark-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import EleMultiCascader from '@/mod-member/src/components/baseMultiCascader/src/main';
  import api from '@/mod-member/src/api/manage.js';
  const LOCAL_AREA_KEY = '__areaDataSource__';
  export default {
    name: 'SyncTelemarkDialog',
    components: {
      EleMultiCascader,
    },
    props: {
      doSearch: Function,
      visible: {
        type: Boolean,
        default: false,
      },
      sourceList: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    watch: {
      visible(val) {
        this.open = val;
        this.initTelesaleSyncSet();
      },

      sourceList(newVal) {
        if (!Array.isArray(newVal) || newVal.length === 0) return;
        this.initTelesaleSyncSet();
      },
    },
    data() {
      return {
        open: this.visible,
        isSync: true,
        sourceIds: [],

        areaDataSource: [],
        areas: [],
        outputs: {
          values: [],
          items: [],
        },
        submitLoading: false,
      };
    },
    mounted() {
      this.fetchAreas();
      this.currentAreaId = null;
      this.firstLoadTelesale = true;
      this.loadTelesaleSet = false;
    },
    methods: {
      // 弹窗显示前，先查询一下同步电销设置

      initTelesaleSyncSet() {
        if (!this.firstLoadTelesale) return;

        this.getTelesaleSyncSet();
        this.firstLoadTelesale = false;
      },

      // 查询电销同步设置
      getTelesaleSyncSet() {
        if (this.loadTelesaleSet) return;
        this.loadTelesaleSet = true;
        api
          .getTelesaleSyncSet()
          .then(({ data }) => {
            this.loadTelesaleSet = false;
            if (!data) return;
            const { isSync, syncSettingRule, id } = data;
            this.isSync = isSync || false;
            this.currentId = id;
            if (syncSettingRule) {
              const { sourceSet, customSourceSet, clientRegionList } = syncSettingRule;

              // 来源
              const sourceIds = [];
              const sourceList = this.sourceList;
              if (Array.isArray(sourceSet) || Array.isArray(customSourceSet)) {
                sourceList.map((item, index) => {
                  if (sourceSet.length > 0 && sourceSet.includes(item.id) && item.type == 0) {
                    sourceIds.push(index);
                  }

                  if (customSourceSet.length > 0 && customSourceSet.includes(item.id) && item.type == 1) {
                    sourceIds.push(index);
                  }
                });
              }

              // 区域
              if (Array.isArray(clientRegionList) && clientRegionList.length > 0) {
                try {
                  this.areas = JSON.parse(clientRegionList[0].provinceName);
                } catch (error) {
                  console.error(error);
                }
              }

              this.sourceIds = sourceIds;
            }
          })
          .catch(() => {
            this.loadTelesaleSet = false;
          });
      },
      reset() {
        this.open = false;
      },
      handleClose() {
        this.getTelesaleSyncSet();
        this.reset();
        this.saveAreas();
        this.$emit('close');
      },
      handleChangeSource(values) {},
      areasChange(values, items) {
        // if (Array.isArray(values) && values.length > 0) {
        //   this.fetchAreas(values[values.length - 1]);
        // }
        // this.outputs.values = values;
        // this.outputs.items = items;
      },
      // 获取区域数据
      fetchAreas(id) {
        if (id) {
          const node = this.getNodeById(this.areaDataSource, id);
          if (!node || node.isloaded) {
            return;
          }
          this.currentAreaId = id;
          const loading = this.$loading({
            lock: true,
            text: '加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.1)',
          });

          return api.region(id).done(({ data }) => {
            node.isloaded = true;
            node.childNode = this.addChildren(data);
            loading.close();
          });
        }

        // 第一次加载时，省市区数据本地已保存，则优先使用缓存数据
        try {
          let areas = window.localStorage.getItem(LOCAL_AREA_KEY);
          areas = JSON.parse(areas);
          if (Array.isArray(areas) && areas.length > 0) {
            this.areaDataSource = areas;
            return;
          }
        } catch (error) {
          console.error(error);
        }

        return api.region().done(({ data }) => {
          this.areaDataSource = this.addChildren(data);
        });
      },
      // 初始化区域数据格式
      addChildren(nodes) {
        if (!nodes || nodes.length === 0) {
          return null;
        }
        for (const node of nodes) {
          if (!node.isLeaf) {
            node.childNode = [];
          }
        }
        return nodes;
      },
      // 查询下级市区
      getNodeById(areas, id) {
        for (const area of areas) {
          if (area.id === id) {
            return area;
          }
          if (area.childNode && area.childNode.length) {
            const findedNode = this.getNodeById(area.childNode, id);
            if (findedNode) {
              return findedNode;
            }
          }
        }
      },
      handleClickItem(item) {
        // console.log(item);
        if (item && item.id) {
          this.fetchAreas(item.id);
        }
      },
      // 利用dfs，查找链条中的所有父级
      getParent(data, value, clientRegionList, citys, regions) {
        // 回溯的标记
        const _p = Symbol('parent');
        // 找到子节点
        let result;
        function _fn(arr, p) {
          for (let i = 0; i < arr.length; i++) {
            arr[i][_p] = p;
            if (arr[i].id === value) {
              result = arr[i];
              return;
            }
            !result && arr[i].childNode && _fn(arr[i].childNode, arr[i]);
          }
          if (result) return;
        }
        _fn(data, null);

        if (!result) return null;

        while (result) {
          // 区
          if (result.level == 3) {
            if (!regions[result.parentId]) {
              regions[result.parentId] = [];
            }

            regions[result.parentId].push({
              regionCode: result.id,
              regionName: result.name,
            });
          }

          // 市
          if (result.level == 2) {
            if (!citys[result.parentId]) {
              citys[result.parentId] = [];
            }

            if (!citys[result.parentId].some(item => item.cityCode == result.id)) {
              citys[result.parentId].push({
                cityCode: result.id,
                cityName: result.name,
              });
            }
          }

          // 省
          if (result.level == 1) {
            if (!clientRegionList.some(item => item.provinceCode == result.id)) {
              clientRegionList.push({
                provinceCode: result.id,
                provinceName: result.name,
              });
            }
          }

          result = result[_p];
        }
      },

      // 序列区域，传给后端
      parseClientRegionList() {
        const clientRegionList = [];

        // 省
        this.areas.map(item => {
          const provinceCode = item[0];
          if (!clientRegionList.some(item => item.provinceCode == provinceCode)) {
            clientRegionList.push({
              provinceCode,
              provinceName: '',
              // cityList: [],
            });
          }
        });

        // 市
        this.areas.map(item => {
          const provinceCode = item[0];
          const cityCode = item[1];
          if (cityCode === null || cityCode === undefined) return;
          const index = clientRegionList.findIndex(item => item.provinceCode === provinceCode);

          // 当前城市列表不存在时，初始化数据类型
          if (index !== -1 && !clientRegionList[index].cityList) {
            clientRegionList[index].cityList = [];
          }

          if (index !== -1 && !clientRegionList[index].cityList.some(item => item.cityCode == cityCode)) {
            clientRegionList[index].cityList.push({
              cityCode,
              cityName: '',
              // regionList: [],
            });
          }
        });

        // 区
        this.areas.map(item => {
          const provinceCode = item[0];
          const cityCode = item[1];
          const regionCode = item[2];
          if (cityCode === null || cityCode === undefined) return;
          if (regionCode === null || regionCode === undefined) return;

          // 先找出省的位置
          const index = clientRegionList.findIndex(item => item.provinceCode === provinceCode);

          if (index !== -1) {
            // 找出市的位置
            const cityIndex = clientRegionList[index].cityList.findIndex(item => item.cityCode === cityCode);

            // 当前区域列表不存在时，初始化数据类型
            if (cityIndex !== -1 && !clientRegionList[index].cityList[cityIndex].regionList) {
              clientRegionList[index].cityList[cityIndex].regionList = [];
            }

            // 判断是否存在， 存在则跳过
            if (
              cityIndex !== -1 &&
              !clientRegionList[index].cityList[cityIndex].regionList.some(item => item.regionCode == regionCode)
            ) {
              clientRegionList[index].cityList[cityIndex].regionList.push({
                regionCode,
                regionName: '',
              });
            }
          }
        });

        // 保存已选值，用于回选
        clientRegionList[0].provinceName = JSON.stringify(this.areas);

        return clientRegionList;
      },

      submit() {
        let flag = false;
        if (this.sourceIds.length === 0) {
          this.$message.error('请选择指定线索属性');
          return;
        } else {
          flag = true;
        }

        if (!flag && this.areas.length === 0) {
          this.$message.error('请选择指定线索属性');
          return;
        }
        const syncSettingRule = {
          sourceSet: [], // 系统源
          customSourceSet: [], // 自定义源
          clientRegionList: [],
        };
        if (this.sourceIds.length > 0) {
          this.sourceIds.map(item => {
            const currentSource = this.sourceList[item];

            if (currentSource.type == 0) {
              syncSettingRule.sourceSet.push(currentSource.id);
            }
            if (currentSource.type == 1) {
              syncSettingRule.customSourceSet.push(currentSource.id);
            }
          });
        }

        if (this.areas.length > 0) {
          syncSettingRule.clientRegionList = this.parseClientRegionList();
        }

        this.submitLoading = true;
        api
          .saveTelesaleSyncSet({
            isSync: this.isSync,
            id: this.currentId,
            syncSettingRule,
          })
          .then(({ data }) => {
            this.getTelesaleSyncSet();
            if (data) {
              this.$message.success('同步成功');
              this.handleClose();
              this.onFilter();
            }

            this.submitLoading = false;
          })
          .catch(() => {
            this.submitLoading = false;
          });
      },
      handleItemChange(currentIds) {
        const id = currentIds[currentIds.length - 1];
        if (currentIds && this.currentAreaId !== id) {
          this.fetchAreas(id);
        }
      },
      saveAreas() {
        // 缓存已加载的省市区数据
        window.localStorage.setItem(LOCAL_AREA_KEY, JSON.stringify(this.areaDataSource));
      },
    },
    beforeDestroy() {
      this.saveAreas();
    },
  };
</script>

<style lang="less" scoped>
  .sync-telemark-item {
    display: flex;
    // align-items: center;
    &:last-child {
      padding-bottom: 20px;
    }
  }
  .sync-telemark-label {
    padding-right: 10px;
  }
  .sync-telemark-tips {
    font-size: 12px;
    color: #888;
  }
  .sync-telemark-attr {
    flex: 1;
    display: flex;
    position: relative;

    .sync-telemark-left {
      width: 70px;
      position: relative;
      height: 100%;
      i {
        position: absolute;
        background-color: #aaa;
        z-index: 1;
        left: 16px;
        &:nth-of-type(1) {
          width: 2px;
          height: 100%;
        }
        &:nth-of-type(2) {
          height: 2px;
          width: 30px;
          top: 0;
        }
        &:nth-of-type(3) {
          height: 2px;
          width: 30px;
          bottom: 0;
        }
      }
      span {
        position: absolute;
        top: 47%;
        z-index: 2;
        transform: translateY(-50%);
        background-color: #256eff;
        font-size: 16px;
        padding: 8px;
        color: #fff;
      }
    }

    .sync-telemark-right {
      flex: 1;
    }
  }
  .sync-telemark-dialog-footer {
    text-align: right;
  }
  .multi-cascader {
    width: 250px;
  }
</style>
