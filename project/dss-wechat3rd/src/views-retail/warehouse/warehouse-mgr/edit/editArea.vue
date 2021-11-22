<template>
  <div class="warehouse-container-form">
    <el-form
      :model="warehouseForm"
      ref="warehouseForm"
      :rules="rules"
      v-loading="loading"
      class="warehouse-form"
      label-width="100px"
    >
      <el-form-item label="仓库类型:" prop="type">
        <el-select placeholder="请选择仓库类型" size="mini" v-model="warehouseForm.type" class="warehouse-input">
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="仓库名称:" prop="name">
        <el-input
          placeholder="请输入仓库名称"
          v-model.trim="warehouseForm.name"
          class="warehouse-input"
          :disabled="!!$route.query.id"
          size="mini"
        ></el-input>
      </el-form-item>

      <el-form-item label="仓库编码:" prop="code">
        <el-input
          placeholder="请输入仓库编码"
          v-model.trim="warehouseForm.code"
          :disabled="!!$route.query.id"
          class="warehouse-input"
          size="mini"
        ></el-input>
      </el-form-item>

      <el-form-item label="仓库联系人:" prop="contact">
        <el-input
          placeholder="请输入仓库联系人"
          v-model.trim="warehouseForm.contact"
          class="warehouse-input"
          size="mini"
        ></el-input>
      </el-form-item>

      <el-form-item label="联系电话:" prop="phone">
        <el-input
          placeholder="请输入联系电话"
          v-model.trim="warehouseForm.phone"
          class="warehouse-input"
          size="mini"
        ></el-input>
      </el-form-item>

      <el-form-item prop="area" class="required" label="仓库区域:">
        <el-cascader
          expand-trigger="hover"
          @active-item-change="handleItemChange"
          @change="handleChange"
          :options="areas"
          class="warehouse-input"
          placeholder="请选择所属区域"
          :props="{ label: 'name', value: 'id', children: 'childNode' }"
          v-model="warehouseForm.area"
          separator="-"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="详细地址:" prop="address">
        <el-autocomplete
          type="input"
          v-model.trim="warehouseForm.address"
          class="warehouse-input"
          size="mini"
          placeholder="请输入详细地址"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="onAdressSelect"
        ></el-autocomplete>
        <div class="warehouse-tips">注：客户退换货地址，请准确填写</div>
      </el-form-item>

      <el-form-item label="地图位置:" prop="latitude">
        <div class="dss-map-box">
          <div class="dss-map" id="id_for_map">地图初始化容器</div>

          <div class="dss-map-info">
            经度：<span v-text="warehouseForm.longitude"></span><br />
            纬度：<span v-text="warehouseForm.latitude"></span>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="覆盖区域:" v-if="warehouseForm.type === 20 && false" prop="warehouseCoverageDTOList">
        <el-button @click="selectprovince">选择省份</el-button>
        <div class="tag-box">
          <el-tag v-for="tag in warehouseCoverageDTOList" :key="tag.name" closable @close="handleDelProvince(tag)">
            {{ tag.name }}
          </el-tag>
          <div class="clear" @click="clearProvince()">清空</div>
        </div>
      </el-form-item>

      <el-form-item
        label="关联前置仓:"
        v-if="warehouseForm.type === 20"
        prop="warehouseTargetDTOList"
        class="warehouse-target"
      >
        <el-button @click="selectWarehouse">选择仓库</el-button>
        <a
          target="_blank"
          class="table-href"
          style="margin-left: 10px"
          href="/wkb.html#/warehouse/stock-mgr/list/add?type=10"
          >新增前置仓</a
        >
        <div class="tag-box">
          <el-tag v-for="tag in warehouseTargetDTOList" :key="tag.name" closable @close="handleDelGroup(tag)">
            {{ tag.name }}
          </el-tag>
          <div class="clear" @click="clearWarehouse()">清空</div>
        </div>
      </el-form-item>

      <div v-if="warehouseForm.type === 10">
        <el-form-item label="关联门店:" prop="warehouseTargetDTOList">
          <el-select
            placeholder="请选择门店"
            multiple
            filterable
            v-model="warehouseTargetDTOList"
            class="warehouse-input"
          >
            <el-option v-for="(item, index) in openStores" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <a target="_blank" class="table-href" href="/console.html">管理门店</a>
        </el-form-item>
      </div>

      <!-- <el-form-item> -->
      <!--  <el-button type="primary" @click="onSubmit('warehouseForm')">保存</el-button>
        <el-button @click="cancel()">取消</el-button>-->
      <!-- </el-form-item>  -->
    </el-form>

    <div class="bottom-button">
      <div class="button">
        <el-button type="primary" @click="onSubmit('warehouseForm')">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </div>

    <group-select-dialog
      v-model="showGroupDialog"
      :all-group="currentGroup"
      :label="dialogType ? '省份' : '仓库'"
      :selected-group="selectedGroup"
      @select="onGroupItemsSelected"
    ></group-select-dialog>
  </div>
</template>

<script>
  import groupSelectDialog from '@/dss-wechat3rd/src/bz_components/group-select-dialog/index';
  import wpBaseApi from '@/business-common/wp-base-api';
  import storeApi from '@/dss-common/api/store';
  import storeUser from '@/business-common/store_user';
  // import AreaPicker from '@/dss-wechat3rd/src/components/area-picker/index.vue';
  import warehouseApi from '@/dss-wechat3rd/src/api/retail/warehouseApi';
  import regexps from '@/dss-common/utils/regexps';
  import { mapState } from 'vuex';
  import DssMap from '@/dss-wechat3rd/src/components/Map/index';

  const LogisticsEnum = {
    UNEXPRESS: 0, // 不支持快递
    DSGEXPRESS: 8, // 指定配送区域
    NO: 0, // 不支持同城
    RADIUS: 1, // 按服务半径
    CONTRACT: 4, // 根据签约同城配送方运力分配
  };
  export default {
    name: 'EditArea',
    mixins: [storeUser],
    components: { groupSelectDialog },
    data() {
      const checkCode = (rule, value, callback) => {
        if (/[\u4E00-\u9FA5]/g.test(value) && !this.isEdit) {
          return callback(new Error('仓库编码不能包含汉字'));
        } else {
          return callback();
        }
      };

      return {
        LogisticsEnum,
        showGroupDialog: false,
        loading: false,
        express: LogisticsEnum.UNEXPRESS,
        typeList: [
          { name: '区域仓', id: 20 },
          { name: '前置仓', id: 10 },
        ],
        distribution: 0,
        warehouseForm: {
          type: null,
          area: [],
          name: '',
          contact: '',
          code: '',
          phone: '',
          address: '',
          radius: 1,
          latitude: null,
          longitude: null,
        },
        isFirst: false, // 修改的时候第一次进来地图根据经纬度显示，不根据详细地址搜索
        warehouseTargetDTOList: [],
        warehouseCoverageDTOList: [],
        currentGroup: [],
        selectedGroup: [],
        privionsList: [],
        areas: [],
        dialogType: 0, // 弹框类型仓库为0，省份为1
        rules: {
          type: [{ required: true, message: '请选择仓库类型', trigger: 'blur' }],
          address: [
            { required: true, message: '请输入仓库地址', trigger: 'blur' },
            { max: 60, message: '最大长度60个字符', trigger: 'blur' },
          ],
          area: [{ required: true, message: '请选择仓库所属区域', trigger: 'blur' }],
          code: [
            { required: true, message: '请输入仓库编码', trigger: 'blur' },
            { validator: checkCode, trigger: 'blur' },
          ],
          name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
          latitude: [{ required: true, message: '请选择地图位置', trigger: 'change' }],
          radius: [
            { required: true, message: '请输入服务半径', trigger: 'blur' },
            { pattern: /^[1-9]\d{0,2}(\.\d{1,2})?$|1000$/, message: '1-1000之间的数字,保留两位小数', trigger: 'blur' },
          ],
          // warehouseCoverageDTOList: [{ validator: checkDTOList, trigger: 'change' }],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { pattern: regexps.tel.reg, message: regexps.tel.msg, trigger: 'blur' },
          ],
          contact: [
            { required: true, message: '请输入仓库联系人', trigger: 'blur' },
            { max: 20, message: '最大长度20个字符', trigger: 'blur' },
          ],
        },
        latLng: {},
        isEdit: false,
      };
    },

    computed: {
      ...mapState({
        storeList: 'storeList',
      }),
      openStores() {
        return this.storeList.filter(item => {
          return item.isOpen === '1';
        });
      },
    },
    props: {
      type: {
        type: Number,
        default: null,
      },
    },
    watch: {
      'warehouseForm.type': {
        handler: function (newVal, oldVal) {
          if (oldVal) {
            this.warehouseTargetDTOList = [];
          }
        },
      },
      distribution(newVal, oldVal) {
        if (newVal === LogisticsEnum.RADIUS) {
          this.initMap();
        }
      },
    },
    mounted() {
      if (!this.$route.query.id) {
        this.initMap();
      } else {
        this.isEdit = true;
        this.getDetail();
      }
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.warehouseForm.area);
        this.filtration(this.warehouseForm);
      });
      // 剔除总店
      this.storeList.concat().forEach((element, index) => {
        if (!element.id) {
          this.storeList.splice(index, 1);
        }
      });
    },

    methods: {
      onGroupItemsSelected(groups) {
        if (this.dialogType === 0) {
          this.warehouseTargetDTOList = groups;
        } else {
          this.warehouseCoverageDTOList = groups;
          this.$refs.warehouseForm.validateField('warehouseCoverageDTOList');
        }
      },
      initMap() {
        // 初始化地图
        DssMap.initMap({
          htmlId: 'id_for_map',
          onClickMap: this.onClickMap,
          onMapLocation: this.onMapLocation,
          installSearchInvoke: this.installSearchInvoke,
          onCityLocation: this.onCityLocation,
          Circle: this.Circle,
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

      // 获取区域数据
      fetchAreas(id) {
        if (id) {
          const node = this.getNodeById(this.areas, id);
          if (!node || node.isloaded) {
            return false;
          }
          return storeApi.queryRegion(id).done(({ data }) => {
            node.isloaded = true;
            node.childNode = this.addChildren(data);
          });
        }

        return storeApi.queryRegion().done(({ data }) => {
          this.areas = this.addChildren(data);
          // this.areas =  this.fitlerEmptyChildren(data) || [];
        });
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

      // 获取路径初始化值
      fetchInitAreas(index, ids) {
        if (index >= ids.length || index >= 2) {
          // 超过数组和3级节点，不加载
          return false;
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

      Circle(callback) {
        this.doCircle = callback;
        this.setCenter();
      },

      // 初始化时利用画圆方法来设置地图中心位置
      setCenter() {
        const latLng = {
          lat: parseFloat(this.warehouseForm.latitude),
          lng: parseFloat(this.warehouseForm.longitude),
        };
        if (this.warehouseForm.latitude && this.warehouseForm.longitude) {
          DssMap.locationLatLng(latLng);
          this.doCircle(latLng, 0, true);
        }
      },

      // 地址检索
      onLocationLatLng(address) {
        this._searchInvoke(address || this.warehouseForm.address).then(poi => {
          if (poi) {
            const item = poi[0];
            DssMap.locationLatLng(item.latLng);
          }
        });
      },

      installSearchInvoke(callback) {
        this._searchInvoke = callback;
        this.getlatLng();
      },

      // 获取省市区
      onCityLocation(addressComponents) {
        if (!this.warehouseForm.province) {
          const { city, district, province } = addressComponents;
          this.warehouseForm.province = province;
          this.warehouseForm.city = city;
          this.warehouseForm.district = district;
          this.filtration(addressComponents);
        }
      },

      // 下拉框地址选择
      onAdressSelect(value) {
        this.warehouseForm.address = value.address;
        DssMap.locationLatLng(value.latLng);
        DssMap.getCityLocation(value.latLng);
        this.doCircle(value.latLng, 0, true);
        this.latLng = value.latLng;
      },

      // 获取地址经纬度
      getlatLng() {
        if (this._searchInvoke && this.warehouseForm.address) {
          this._searchInvoke(this.warehouseForm.address).then(poi => {
            if (poi && poi.length) {
              const address = poi[0];
              // 当前地址的经纬度
              this.latLng = address.latLng;
              this.setCenter();
            }
          });
        }
      },

      // 地址检索，获取多个地址信息
      querySearch(keyWord, callback) {
        if (!!this._searchInvoke && keyWord) {
          const areas = this.getPath(this.warehouseForm.area || []);
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
                address = poi[0];
                // 当前地址的经纬度
                this.latLng = address.latLng;
                DssMap.locationLatLng(address.latLng);
                DssMap.getCityLocation(address.latLng);
                callback(this.addressList);
              }
            })
            .catch(() => {
              callback(new Error());
            });
        } else {
          callback(new Error());
        }
      },

      locationLCircle() {
        const latLng = {
          lat: parseFloat(this.warehouseForm.latitude),
          lng: parseFloat(this.warehouseForm.longitude),
        };
        if (this.warehouseForm.latitude && this.warehouseForm.longitude) {
          this.doCircle(latLng, 0, true);
          DssMap.locationLatLng(latLng);
        }
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

      // 选择仓库
      selectWarehouse() {
        this.isLoading = true;
        const param = { pageNo: 1, pageSize: 1000, status: 1, type: 10 };
        wpBaseApi
          .queryList(param)
          .then(rs => {
            this.currentGroup = rs.data || [];
            this.selectedGroup = this.warehouseTargetDTOList;
            this.showGroupDialog = true;
            this.dialogType = 0;
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.isLoading = false;
          });
      },

      handleDelGroup(tag) {
        this.warehouseTargetDTOList.splice(this.warehouseTargetDTOList.indexOf(tag), 1);
      },

      handleDelProvince(tag) {
        this.warehouseCoverageDTOList.splice(this.warehouseCoverageDTOList.indexOf(tag), 1);
      },

      clearWarehouse() {
        this.warehouseTargetDTOList = [];
      },

      clearProvince() {
        this.warehouseCoverageDTOList = [];
      },

      // 点击地图回调
      onClickMap(latitude, longitude) {
        this.warehouseForm.latitude = latitude;
        this.warehouseForm.longitude = longitude;
      },

      // 地图位置信息定为后回调
      onMapLocation(address, addressComponents) {
        // this.warehouseForm.address = address;
        // const { city, district, province } = addressComponents;
        // this.warehouseForm.province = province;
        // this.warehouseForm.city = city;
        // this.warehouseForm.district = district;
        // this.filtration(addressComponents);
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
          this.warehouseForm.address = this.warehouseForm.address.replace('凼', '氹');
          this.warehouseForm.district = district.replace('凼', '氹');
        }
        this.warehouseForm.province = area[0];
        this.warehouseForm.city = area[1];
        this.warehouseForm.district = area[2];

        this.fetchNameAreas(0, this.areas, area);
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

      // 根据省市区名称渲染区域地址框数据
      fetchNameAreas(index, list, areaNames) {
        if (index >= areaNames.length - 1 || index >= 2) {
          // 超过数组和3级节点，不加载
          this.warehouseForm.area = this.getNameId(areaNames);
          return false;
        }
        let current = list.find(item => item.name === areaNames[index]);
        if (current && current.childNode && current.childNode.length) {
          list = current.childNode;
          this.fetchNameAreas(index + 1, list, areaNames);
        } else {
          if (!current) {
            return false;
          }
          this.fetchAreas(current.id).then(() => {
            current = list.find(item => item.name === areaNames[index]);
            this.fetchNameAreas(index + 1, current.childNode, areaNames);
          });
        }
      },

      handleItemChange(ids) {
        if (ids && ids.length) {
          this.fetchAreas(ids[ids.length - 1]);
        }
      },

      handleChange() {
        const areas = this.getPath(this.warehouseForm.area || []);
        this.warehouseForm.province = areas[0] ? areas[0].name : '';
        this.warehouseForm.city = areas[1] ? areas[1].name : '';
        this.warehouseForm.district = areas[2] ? areas[2].name : '';
        let address = '中国';
        areas.forEach(item => {
          if (item.name !== '北京' && item.name !== '天津' && item.name !== '上海' && item.name !== '重庆') {
            address += item.name;
          }
        });
        this.onLocationLatLng(address);
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
      getDetail() {
        warehouseApi
          .select({ id: this.$route.query.id })
          .then(rs => {
            const detail = rs.data;

            this.isFirst = true;
            this.warehouseForm = detail;
            detail.warehouseTargetDTOList = detail.warehouseTargetDTOList || [];
            detail.warehouseCoverageDTOList = detail.warehouseCoverageDTOList || [];

            this.warehouseTargetDTOList = detail.warehouseTargetDTOList.map(item => {
              item = {
                id: item.targetId,
                name: item.targetName,
              };
              if (this.warehouseForm.type === 10) {
                item = item.id;
              }
              return item;
            });

            if (this.warehouseForm.type === 10) {
              this.getTag(detail.tag);
            }
            if (detail.warehouseCoverageDTOList[0] && detail.warehouseCoverageDTOList[0].provinceId === 0) {
              this.warehouseCoverageDTOList = this.privionsList;
            } else {
              this.warehouseCoverageDTOList = detail.warehouseCoverageDTOList.map(item => {
                item = {
                  id: item.provinceId,
                  name: item.province,
                };
                return item;
              });
            }
            const areas = [];
            if (detail.provinceId) {
              areas.push(detail.provinceId);
              if (detail.cityId) {
                areas.push(detail.cityId);
                if (detail.districtId) {
                  areas.push(detail.districtId);
                }
              }
            }
            this.warehouseForm.area = areas;
            this.initMap();
            this.filtration(detail);
          })
          .catch(err => {
            console.error(err);
          });
      },

      // &操作
      getTag(tag) {
        if ((tag & LogisticsEnum.DSGEXPRESS) === LogisticsEnum.DSGEXPRESS) {
          this.express = LogisticsEnum.DSGEXPRESS;
        }
        if ((tag & LogisticsEnum.CONTRACT) === LogisticsEnum.CONTRACT) {
          this.distribution = LogisticsEnum.CONTRACT;
        } else {
          if ((tag & LogisticsEnum.RADIUS) === LogisticsEnum.RADIUS) {
            this.distribution = LogisticsEnum.RADIUS;
          } else {
            this.distribution = LogisticsEnum.NO;
          }
        }
      },

      onSubmit(refName) {
        this.$refs[refName].validate().then(valid => {
          if (!valid) {
            return false;
          }

          const latLng = {
            lat: parseFloat(this.warehouseForm.latitude),
            lng: parseFloat(this.warehouseForm.longitude),
          };
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
        });
      },

      submmit() {
        this.warehouseForm.provinceId = this.warehouseForm.area[0];
        this.warehouseForm.cityId = this.warehouseForm.area[1];
        this.warehouseForm.districtId = this.warehouseForm.area[2];

        const params = { ...this.warehouseForm };

        params.warehouseTargetDTOList = this.warehouseTargetDTOList.map(item => {
          if (this.warehouseForm.type === 10) {
            item = this.storeList.find(store => store.id === item);
            if (item) {
              item.type = 20; // 关联门店类型20
            }
          }
          // 关联前置仓类型为10
          if (item) {
            item = {
              targetId: item.id,
              targetName: item.name,
              targetType: item.type || 10,
            };
          }
          return item;
        });

        if (this.warehouseCoverageDTOList.length === 34) {
          params.warehouseCoverageDTOList = [{ provinceId: 0, province: '全国' }];
        } else {
          params.warehouseCoverageDTOList = this.warehouseCoverageDTOList.map(item => {
            item = {
              provinceId: item.id,
              province: item.name,
            };
            return item;
          });
        }
        console.log('params==>', params);
        // return false
        if (this.$route.query.id) {
          this.update(params);
        } else {
          warehouseApi
            .add(params)
            .then(rs => {
              // 更新仓库列表
              this.__updateWarehouse();
              this.$router.push({
                path: '/warehouse/stock-mgr/list',
              });
            })
            .catch(err => {
              console.error(err);
            });
        }
      },
      update(params) {
        this.loading = true;

        warehouseApi
          .update(params)
          .then(res => {
            this.$router.push({
              path: '/warehouse/stock-mgr/list',
            });
            // 更新仓库列表
            this.__updateWarehouse();
          })
          .always(() => {
            this.loading = false;
          });
      },

      cancel() {
        this.$router.push({
          path: '/warehouse/stock-mgr/list',
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  @import '~@/dss-common/style/wkt-constants.less';
  // .warehouse-container-form:after {
  //   content: '';
  //   height: 60px;
  //   display: block;
  // }

  .warehouse-container {
    background: #fff;
    margin-bottom: 20px;
  }

  .warehouse-form {
    margin-bottom: 20px;

    .warehouse-input {
      width: 366px;
    }

    .warehouse-tips {
      color: @light-black-color;
    }

    .warehouse-save {
      padding: 7px 40px;
      border-radius: 15px;
    }

    .dss-map {
      width: 800px;
      height: 400px;
      font-size: 12px;
    }

    .tag-box {
      border: 1px solid #dcdfe6;
      padding: 10px;
      width: 600px;
      overflow: hidden;
      min-height: 200px;
      margin-top: 10px;
      position: relative;
      padding-bottom: 20px;

      .clear {
        color: #3879fb;
        font-size: 12px;
        display: inline-block;
        position: absolute;
        bottom: -5px;
        right: 10px;
        cursor: pointer;
      }

      .el-tag {
        margin-right: 10px;
      }
    }
  }

  .dss-map-box {
    display: flex;

    .dss-map-info {
      margin-left: 30px;
    }
  }

  .button {
    // width: 400px;
    // margin-left: 33%;

    button {
      margin-right: 0;
    }
  }
</style>
