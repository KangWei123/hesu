<template>
  <div class="storemgr-edit">
    <form-page-layout
      ref="form"
      class="org-form"
      :model="form"
      :rules="rules"
      label-width="130px"
      :auto-validate="false"
      :title-visible="false"
      @submit="clickSave"
    >
      <el-form-item label="项目名称" prop="prjName">
        <el-input type="input" v-model="form.prjName" placeholder="请输入项目名称"></el-input>
      </el-form-item>

      <el-form-item prop="parentDeptIds" label="上级组织">
        <el-cascader
          change-on-select
          @change="handleCascaderChange"
          :options="organizationTree"
          placeholder="选择组织"
          :props="{ value: 'deptId', label: 'name' }"
          v-model="form.parentDeptIds"
        ></el-cascader>
      </el-form-item>

      <el-form-item prop="area" label="项目所属地区">
        <el-cascader
          ref="cascader"
          expand-trigger="hover"
          @active-item-change="handleItemChange"
          @change="handleChange"
          :options="areas"
          placeholder="请选择项目区域"
          :props="{ label: 'name', value: 'id', children: 'childNode' }"
          v-model="form.area"
          separator="-"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-autocomplete
          type="input"
          v-model="form.address"
          class="w500"
          placeholder="请输入项目详细地址"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="onAdressSelect"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="地图位置" prop="province">
        <div class="dss-map" id="id_for_map">地图初始化容器</div>
        <div class="lat-box">
          <div>
            <span>经度：</span>
            <span class>{{ form.longitude }}</span>
          </div>
          <div>
            <span>纬度：</span>
            <span class>{{ form.latitude }}</span>
          </div>
        </div>
      </el-form-item>

      <template #footer>
        <form-button action="cancel" />
        <form-button :loading="submitting">保存</form-button>
      </template>
    </form-page-layout>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as storeApi from '@/mod-org/src/api/storeApi';
  import * as orApi from '@/mod-org/src/api/organizationFramework';
  import { projectApi } from '@/register/kangyang';
  import { Map } from '@/register/wechat3rd';
  import storeUser from '@/business-common/store_user';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';

  export default {
    mixins: [storeUser],
    components: { FormPageLayout, FormGroup, FormButton },
    data() {
      const areaRule = (rule, value, callback) => {
        if (value && value.length) {
          callback();
        } else {
          callback(new Error('请选择项目区域'));
        }
      };

      return {
        rules: {
          prjName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
          parentDeptIds: [{ required: true, message: '请选择组织', trigger: 'change' }],
          area: [{ validator: areaRule, required: true, trigger: 'change' }],
        },
        form: {
          id: undefined,
          prjName: '', // 名称
          area: [],
          address: '',
          provinceId: null, // 省份
          cityId: null, // 城市
          districtId: null, // 区
          province: null, // 省份
          city: null, // 城市
          district: null, // 区
          longitude: null, // 经度
          latitude: null, // 纬度
          dealerId: null, // 经销商id
          parentDeptId: '', // 组织id
          parentDeptIds: [],
        },
        isAdd: true,
        submitting: false,
        areas: [],
        organizationTree: [],
        latLng: {},
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
    },
    async mounted() {
      const { storeId, type, valueId } = this.$route.query || {};

      if (storeId) {
        this.isAdd = false;
      }

      if (storeId !== undefined) {
        this.form.storeId = storeId;
      }

      await this.getOrganizationTreeData(); // 请求部门架构
      if (!this.isAdd) {
        this.apiView();
      } else {
        this.init();
      }
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.form.area);
        this.filtration(this.form);
      });
    },
    methods: {
      assembleFormData() {
        const params = this.form;
        // 省市区
        params.provinceId = params.area[0];
        params.cityId = params.area[1];
        params.districtId = params.area[2];
      },

      // 点击保存
      async clickSave(e) {
        this.assembleFormData();

        const latLng = {
          lat: parseFloat(this.form.latitude),
          lng: parseFloat(this.form.longitude),
        };
        this.$refs.form.validate(valid => {
          if (valid) {
            const distance = this.GetDistance(latLng, this.latLng);
            if (distance > 10) {
              this.$confirm('经纬度距离详细地址已经大于10m，确认经纬度？', '确认经纬度', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                customClass: 'wkt-warning',
              }).then(() => {
                this.submmit();
              });
            } else {
              this.submmit();
            }
          } else {
            return false;
          }
        });
      },

      submmit() {
        if (this.form.id) {
          this.updateOrg();
        } else {
          this.addOrg();
        }
      },

      toPayload() {
        const { area, ...others } = this.form;
        const [selectedNode] = this.$refs.cascader.getCheckedNodes();
        const { pathLabels = [], data } = selectedNode || {};
        return {
          areaCode: data.code,
          areaName: pathLabels.join('/'),
          ...others,
        };
      },

      updateOrg() {
        this.submitting = true;
        const payload = this.toPayload();
        projectApi
          .update(payload)
          .then(res => {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.refresh_userInfo();
            this.colsed();
          })
          .always(() => {
            this.submitting = false;
          });
      },

      addOrg() {
        this.submitting = true;
        const payload = this.toPayload();
        projectApi
          .add(payload)
          .then(res => {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.refresh_userInfo();
            this.colsed();
          })
          .always(() => {
            this.submitting = false;
          });
      },

      GetDistance(latLng1, latLng2) {
        const radLat1 = (latLng1.lat * Math.PI) / 180.0;
        const radLat2 = (latLng2.lat * Math.PI) / 180.0;
        const a = radLat1 - radLat2;
        const b = (latLng1.lng * Math.PI) / 180.0 - (latLng2.lng * Math.PI) / 180.0;
        let s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
            )
          );
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10;
        return s;
      },

      // 获取已选的组织数据
      ifArrVal(arr, target, current = 'deptId') {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][current] === target) {
            return arr[i];
          }
          if (Array.isArray(arr[i].children)) {
            const result = this.ifArrVal(arr[i].children, target);
            if (result) {
              return result;
            }
          }
        }
      },
      // 查找所有上级/当前item
      findParents(arr, target, ifTarget) {
        let res;
        let parent;

        const dfs = (tmpArr, tmpTarget, path, tmpIfTarget = false) => {
          for (let i = 0; i < tmpArr.length; i++) {
            if (res) break;
            if (tmpArr[i].deptId === tmpTarget) {
              res = tmpArr[i];
              if (tmpIfTarget) {
                console.log(path.concat(tmpArr[i]));
                parent = path.concat(tmpArr[i]);
              } else {
                parent = path;
              }
              return;
            }
            if (Array.isArray(tmpArr[i].children)) {
              dfs(tmpArr[i].children, tmpTarget, path.concat(tmpArr[i]), tmpIfTarget);
            }
          }
        };
        dfs(arr, target, [], ifTarget);
        return { res, parent };
      },
      // 获取组织树
      async getOrganizationTreeData() {
        const params = {
          queryEmployee: false,
          queryStore: false,
          queryType: 2, // 查询列表，1 根据角色查询，2 全量查询
          showDeptApp: false, // 是否显示组织下的应用
        };
        await orApi.getOrganizationTree(params).then(res => {
          this.organizationTree = res.data || [];
        });
      },
      // 选择组织树
      handleCascaderChange(value) {
        const parentId = value[value.length - 1];
        this.form.parentDeptId = parentId;
        this.currentOrganization = this.ifArrVal(this.organizationTree, parentId);
        const { parent } = this.findParents(this.organizationTree, parentId, true);
        const isDealerType = (parent && parent.some(({ type }) => type === 2)) || false;
        this.form.mode = isDealerType ? 1 : 0;
      },

      init() {
        // 初始化地图
        Map.initMap({
          htmlId: 'id_for_map',
          onClickMap: this.onClickMap,
          onMapLocation: this.onMapLocation,
          installSearchInvoke: this.installSearchInvoke,
          onCityLocation: this.onCityLocation,
          Circle: this.Circle,
        });
      },

      Circle(callback) {
        this.doCircle = callback;
      },

      // 查询详情
      apiView() {
        storeApi
          .viewStore({ storeId: this.form.storeId })
          .then(res => {
            const hold = {
              businessDayOfWeek: 1,
              businessEndHour: 1,
              businessStartHour: 1,
              sourceDayOfWeek: 1,
            };
            if (res.data)
              for (const key in this.form) {
                if (!(key in hold)) {
                  if (key === 'prjName') {
                    this.form.prjName = res.data.name;
                  } else if (key === 'id') {
                    this.form.id = Number(res.data.outStoreId);
                  } else if (undefined !== res.data[key] && key !== 'area') {
                    this.form[key] = res.data[key];
                  }
                }
              }

            if (res.data.parentDeptId) {
              const { parent } = this.findParents(this.organizationTree, res.data.parentDeptId, true);
              this.form.parentDeptIds = [];
              if (!parent) {
                this.form.parentDeptIds = [res.data.parentDeptId];
              }
              parent &&
                parent.forEach(({ deptId }) => {
                  this.form.parentDeptIds.push(deptId);
                });
            }
            this.init();
            this.filtration(this.form);
          })
          .always(() => {
            this.loading = false;
          });
      },

      installSearchInvoke(callback) {
        this._searchInvoke = callback;
        this.getlatLng();
      },

      // 获取区域数据
      fetchAreas(id) {
        if (id) {
          const node = this.getNodeById(this.areas, id);
          if (!node || node.isloaded) {
            return;
          }
          return storeApi.queryRegion(id).done(({ data }) => {
            node.isloaded = true;
            node.childNode = this.addChildren(data);
          });
        }

        return storeApi.queryRegion().done(({ data }) => {
          this.areas = this.addChildren(data);
        });
      },
      // 获取路径初始化值
      fetchInitAreas(index, ids) {
        if (index >= ids.length || index >= 2) {
          // 超过数组和3级节点，不加载
          return;
        }
        const promise = this.fetchAreas(ids[index]);
        if (promise) {
          promise.done(() => {
            this.fetchInitAreas(index + 1, ids);
          });
        } else {
          this.fetchInitAreas(index + 1, ids);
        }
      },
      // 直辖市和特别行政区数据过滤
      filtration(data) {
        const { province, city, district } = data;
        const area = [province, city, district];
        if (province === '中国') {
          if (city === '北京市' || city === '天津市' || city === '上海市' || city === '重庆市') {
            area[0] = area[1].replace('市', '');
          } else {
            area.splice(0, 1);
          }
        }
        if (city === '澳门特别行政区' && (district === '凼仔' || district === '路凼城')) {
          area[1] = area[1].replace('凼', '氹');
          this.form.address = this.form.address.replace('凼', '氹');
          this.form.district = district.replace('凼', '氹');
        }
        this.form.province = area[0];
        this.form.city = area[1];
        this.form.district = area[2];

        this.fetchNameAreas(0, this.areas, area);
      },
      // 根据省市区名称渲染区域地址框数据
      fetchNameAreas(index, list, areaNames) {
        if (index >= areaNames.length - 1 || index >= this.limitLevel() - 1) {
          // 超过数组和3级节点，不加载
          this.form.area = this.getNameId(areaNames);
          return;
        }
        let current = list.find(item => item.name === areaNames[index]);
        if (current && current.childNode && current.childNode.length) {
          list = current.childNode;
          this.fetchNameAreas(index + 1, list, areaNames);
        } else {
          if (!current) {
            return;
          }
          this.fetchAreas(current.id).then(() => {
            current = list.find(item => item.name === areaNames[index]);
            this.fetchNameAreas(index + 1, current.childNode, areaNames);
          });
        }
      },

      getPath(areaIds) {
        let list = this.areas;
        const path = [];
        for (const areaId of areaIds) {
          const finded = list.find(a => a.id === areaId);
          if (!finded) {
            return path;
          }
          path.push(finded);
          list = finded.childNode;
        }
        return path;
      },

      // 初始化区域数据格式
      addChildren(nodes) {
        if (!nodes || nodes.length === 0) {
          return null;
        }
        for (const node of nodes) {
          if (!node.isLeaf && node.level < this.limitLevel()) {
            node.childNode = [];
          }
        }
        return nodes;
      },
      limitLevel() {
        // 地产只展示2级，到省市
        if (this.env.ESTATE) {
          return 2;
        } else {
          return 3;
        }
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

      handleItemChange(ids) {
        if (ids && ids.length) {
          this.fetchAreas(ids[ids.length - 1]);
        }
      },
      handleChange() {
        const areas = this.getPath(this.form.area || []);
        this.form.province = areas[0] ? areas[0].name : '';
        this.form.city = areas[1] ? areas[1].name : '';
        this.form.district = areas[2] ? areas[2].name : '';
        let address = '中国';
        areas.forEach(item => {
          if (item.name !== '北京' && item.name !== '天津' && item.name !== '上海' && item.name !== '重庆') {
            address += item.name;
          }
        });
        this.onLocationLatLng(address);
      },

      // 下拉框地址选择
      onAdressSelect(value) {
        this.form.address = value.address;
        this.latLng = value.latLng;
        Map.locationLatLng(value.latLng);
        Map.getCityLocation(value.latLng);
        this.doCircle(value.latLng, 0, true);
      },

      // 地址检索，获取多个地址信息
      querySearch(keyWord, callback) {
        const emptyArr = [];
        if (!!this._searchInvoke && keyWord) {
          const areas = this.getPath(this.form.area || []);
          let address = '';
          areas.forEach(item => {
            if (item.name !== '北京' && item.name !== '天津' && item.name !== '上海' && item.name !== '重庆') {
              address += item.name;
            }
          });
          this._searchInvoke(keyWord, address)
            .then(poi => {
              if (poi && poi.length) {
                this.addressList = poi;
                this.addressList.forEach(item => {
                  if (item.address) {
                    item.value = item.address + '—' + item.name;
                  }

                  item.id = item.latLng;
                });
                const temAddress = poi[0];
                // 当前地址的经纬度
                this.latLng = temAddress.latLng;
                Map.locationLatLng(temAddress.latLng);
                Map.getCityLocation(temAddress.latLng);
                this.doCircle(temAddress.latLng, 0, true);
                callback(this.addressList);
              }
            })
            .catch(() => {
              callback(emptyArr);
            });
        } else {
          callback(emptyArr);
        }
      },

      colsed() {
        const url = '/companyManage/org-center';
        this.$nextTick(() => {
          this.$router.push({
            path: url,
          });
        });
      },

      // 地址检索
      onLocationLatLng(address) {
        this._searchInvoke(address || this.form.address).then(poi => {
          if (poi) {
            const item = poi[0];
            Map.locationLatLng(item.latLng);
          }
        });
      },

      // 点击地图回调
      onClickMap(latitude, longitude) {
        this.form.latitude = latitude;
        this.form.longitude = longitude;
      },

      // 地图位置信息定为后回调
      onMapLocation(address, addressComponents) {
        const { city, district, province } = addressComponents;
        this.form.province = province;
        this.form.city = city;
        this.form.district = district;
        this.filtration(addressComponents);
      },

      // 根据省市区名称查询id
      getNameId(areaNames) {
        const areaIds = [];
        let list = this.areas;
        areaNames.forEach(name => {
          if (list) {
            const current = list.find(item => item.name === name);
            if (!current) {
              return areaIds;
            }
            areaIds.push(current.id);
            list = current.childNode;
          }
        });
        return areaIds;
      },

      // 获取省市区
      onCityLocation(addressComponents) {
        if (!this.form.province) {
          const { city, district, province } = addressComponents;
          this.form.province = province;
          this.form.city = city;
          this.form.district = district;
          this.filtration(addressComponents);
        }
      },

      // 初始化时利用画圆方法来设置地图中心位置
      setCenter() {
        const latLng = {
          lat: parseFloat(this.form.latitude),
          lng: parseFloat(this.form.longitude),
        };
        if (this.form.latitude && this.form.longitude) {
          Map.locationLatLng(latLng);
          this.doCircle(latLng, 0, true);
        }
      },

      // 获取地址经纬度
      getlatLng() {
        if (this._searchInvoke && this.form.address) {
          this._searchInvoke(this.form.address)
            .then(poi => {
              if (poi && poi.length) {
                const address = poi[0];
                // 当前地址的经纬度
                this.latLng = address.latLng;
                this.setCenter();
              }
            })
            .catch(() => {
              // 名称定位失败时，并且是编辑门店进入的场景，试用经纬度定位
              const { longitude, latitude } = this.form;
              if (!this.isAdd && !!longitude && !!latitude && !this.latLng.lat) {
                this.latLng = {
                  lat: parseFloat(this.form.latitude),
                  lng: parseFloat(this.form.longitude),
                };
                this.setCenter();
              }
            });
        }
      },
    },
  };
</script>

<style lang="less">
  .org-form {
    .el-input__inner {
      width: 320px;
      height: 30px;
    }

    .dss-map {
      width: 600px;
      height: 400px;
      font-size: 12px;
      display: inline-block;
    }
  }
</style>
