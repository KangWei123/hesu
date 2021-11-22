<template>
  <div>
    <form-page-layout
      ref="form"
      class="store-form"
      :model="form"
      :rules="rules"
      label-width="120px"
      :auto-validate="false"
      :title-visible="false"
      @submit="clickSave"
    >
      <el-form-item prop="logo" v-if="showLogo" class="head-info">
        <add-image @success="onLogoUploadSuccess">
          <i
            class="icon"
            v-if="form.logo"
            :style="!!form.logo ? 'background: transparent url(' + form.logo + ') no-repeat 0 0;' : ''"
          ></i>
          <img class="icon" v-else :src="require('../images/logo-default.png')" />
          <a href="javascript:;" class="table-href upload-title">{{ `上传${storeLabel}logo` }}</a>
        </add-image>
      </el-form-item>

      <el-form-item :label="`${storeLabel}名称`" v-if="showStoreName" prop="name">
        <el-input type="input" v-model="form.name" :placeholder="`请输入${storeLabel}名称`"></el-input>
      </el-form-item>

      <el-form-item :label="`${storeLabel}简称`" v-if="showAbbreviation">
        <el-input type="input" v-model="form.abbreviation" :placeholder="`请输入${storeLabel}简称`"></el-input>
        <div class="delivery-tips">此名称可用于小程序端对客户展示，若未填则默认选用{{ storeLabel }}名称</div>
      </el-form-item>

      <el-form-item label="营业时间" v-if="showBusinessDayOfWeek" prop="businessDayOfWeek">
        <div>
          <!--天-->
          <el-select
            v-model="form.sourceDayOfWeek"
            multiple
            placeholder="请选择天"
            @change="handleSelect"
            :class="[isAll ? 'hideTag' : '']"
          >
            <el-option
              v-for="(item, index) in DayValueMap"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <work-hour-picker
            :init-value="{ startTime: form.businessStartHour, endTime: form.businessEndHour }"
            :able-support-rest="false"
            is-division-region
            @change="onWorkHourChange"
          ></work-hour-picker>
        </div>
      </el-form-item>

      <el-form-item :label="`${storeLabel}编号`" v-if="showOutStoreId" prop="outStoreId">
        <el-input type="input" v-model="form.outStoreId"></el-input>
      </el-form-item>

      <el-form-item prop="parentDeptIds" label="上级组织" v-if="!isStoreKeeper">
        <el-cascader
          change-on-select
          @change="handleCascaderChange"
          :options="organizationTree"
          :placeholder="'选择组织'"
          :props="{ value: 'deptId', label: 'name' }"
          v-model="form.parentDeptIds"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="选择模式">
        <el-radio-group v-model="form.mode" :disabled="true">
          <el-radio :label="dealerEnum.modeType.DIRECT">直营</el-radio>
          <el-radio :label="dealerEnum.modeType.DEALER">经销</el-radio>
        </el-radio-group>
        <div class="delivery-tips">
          {{
            form.mode === dealerEnum.modeType.DIRECT
              ? '直营模式下，门店的商品/订单/活动/支付由总部统筹运营与管理'
              : '经销商模式下，门店的商品/订单/活动/支付由经销商统筹运营与管理，订单入账经销商商户号'
          }}
        </div>
      </el-form-item>

      <!-- scrm业态的账号创建门店时，不添加物流方式 -->
      <el-form-item label="物流方式" prop="deliveryTypes" v-if="!isScrmIndustry">
        <div style="height: 35px">
          <el-checkbox-group v-model="deliveryTypes">
            <el-checkbox v-for="item in deliveryList" :key="item.value" :label="item.value" :disabled="item.disabled"
              >{{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="delivery-tips">
          {{ storeLabel }}物流方式遵循品牌设置范围，如都不在品牌设置范围内，将默认品牌设置
        </div>
      </el-form-item>

      <el-form-item prop="area" :label="`${storeLabel}区域`">
        <el-cascader
          expand-trigger="hover"
          @active-item-change="handleItemChange"
          @change="handleChange"
          :options="areas"
          :placeholder="areaPlaceHolder"
          :props="{ label: 'name', value: 'id', children: 'childNode' }"
          v-model="form.area"
          separator="-"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" v-if="showDetailAddress" prop="address">
        <el-autocomplete
          type="input"
          v-model="form.address"
          class="w500"
          placeholder="请填写详细地址，方便会员查找"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="onAdressSelect"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="地图位置" v-show="showMap" prop="province">
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

      <el-form-item label="客服电话" prop="tel">
        <el-input type="input" v-model="form.tel" placeholder="请输入客服电话:"></el-input>
      </el-form-item>

      <el-form-item :label="`${storeLabel}简介`" prop="describe">
        <el-input type="textarea" :rows="9" class="w500" v-model="form.describe"></el-input>
      </el-form-item>

      <template #footer>
        <form-button action="cancel" />
        <form-button>{{ btnText }}</form-button>
      </template>
    </form-page-layout>
    <!-- <dealer-dialog :show-dialog.sync="showDialog" @single-choosed="onChooseStockProduct"></dealer-dialog> -->
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import dealerDialog from '@/mod-console/src/components/dealer-dialog/index';
  import WorkHourPicker from '@/mod-console/src/components/WorkHourPicker/index.vue';
  import SelectTree from '@/mod-console/src/components/tree-select';
  import storeUser from '@/business-common/store_user';
  import * as storeApi from '@/mod-console/src/api/storeApi';
  import { sharedLoginApi } from '@/mod-console/ref/api';
  import * as orApi from '@/mod-console/src/api/organizationFramework';
  import regexps from '@/dss-common/utils/regexps';
  import { Map, AddImage, industryHelperMixin } from '@/register/wechat3rd';
  import { toDecimalDays, toBinaryDays } from '@/dss-common/utils/date-format';
  import { DELIVERY_TYPES } from '@/mod-console/src/constants/delivery-way';
  import dealerEnum from '@/mod-console/src/constants/dealerEnum';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';

  const SELECT_ALL_NUM = 7;
  export default {
    name: 'StoreForm',
    mixins: [storeUser, industryHelperMixin],
    components: { AddImage, WorkHourPicker, SelectTree, dealerDialog, FormPageLayout, FormGroup, FormButton },
    data() {
      const businessDayOfWeekRule = (rule, value, callback) => {
        const { sourceDayOfWeek, businessStartHour, businessEndHour } = this.form;
        // console.log('businessDayOfWeekRule', sourceDayOfWeek, businessStartHour, businessEndHour);
        if (!sourceDayOfWeek.length) {
          callback('请选择营业日期');
        } else if (businessStartHour === null) {
          callback('请选择营业开始时间');
        } else if (businessEndHour === null) {
          callback('请选择营业结束时间');
        } else if (businessEndHour - businessStartHour > 24) {
          callback('门店营业时间间隔不能大于24小时');
        } else {
          callback();
        }
      };
      const areaRule = (rule, value, callback) => {
        if (value && value.length) {
          callback();
        } else {
          callback('请选择区域');
        }
      };

      const checkDeliveryTypes = (rule, value, callback) => {
        if (!this.deliveryTypes.length) {
          callback('物流方式至少勾选一项');
        }
        callback();
      };

      const checkMode = (rule, value, callback) => {
        if (this.form.mode === dealerEnum.modeType.DEALER && !this.form.dealerId) {
          callback('请选择经销商');
        }
        callback();
      };

      return {
        isClearable: true, // 可清空（可选）
        isAccordion: true,
        valueId: null,
        data: [],
        props: {
          value: 'id',
          label: 'name',
          children: 'children',
        },
        isAdd: true,
        searchKeyWord: '',
        loading: false,
        submitting: false,
        areas: [],
        DayValueMap: [
          { label: '全选', value: 7 },
          { label: '周日', value: 0 },
          { label: '周一', value: 1 },
          { label: '周二', value: 2 },
          { label: '周三', value: 3 },
          { label: '周四', value: 4 },
          { label: '周五', value: 5 },
          { label: '周六', value: 6 },
        ],
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          /* relevanceDeptId: [{ required: true, message: '请选择归属部门', trigger: 'change' }], */
          tel: [
            { required: true, message: '请输入客服电话', trigger: 'blur' },
            {
              pattern: /(^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[013,5-8]|18[0-9]|19[0-9])[0-9]{8})|([0-9]{3,4}-[0-9]{7,8})$)|(^400-[016789]\d{2}-\d{4}$)|(^400[016789]\d{6}$)/,
              message: regexps.servicePhone.msg,
              trigger: 'blur',
            },
          ],
          outStoreId: [
            {
              min: 1,
              max: 30,
              message: '长度在 1 到 30 个字符',
              trigger: 'blur',
            },
          ],
          businessDayOfWeek: [{ validator: businessDayOfWeekRule, required: true, trigger: 'blur' }],
          parentDeptIds: [{ required: true, message: '请选择组织', trigger: 'change' }],
          area: [{ validator: areaRule, required: true, trigger: 'change' }],
          address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
          province: [{ required: true, message: '请选择地图位置', trigger: 'blur' }],
          deliveryTypes: [{ required: true, trigger: 'change', validator: checkDeliveryTypes }],
          dealerId: [{ trigger: 'blur', validator: checkMode }],
        },
        form: {
          relevanceDeptId: '', // 关联部门Id
          id: undefined,
          logo: '', // 门店logo
          name: '', // 门店名称
          abbreviation: '', // 门店简称
          tel: '', // 客服电话
          businessStartHour: 0, // 门店营业起始时间
          businessEndHour: 0.5, // 门店营业结束时间
          businessDayOfWeek: null, // 门店营业星期（按位 天一二三四五六）
          sourceDayOfWeek: '',
          area: [],
          outStoreId: '',
          address: '',
          provinceId: null, // 省份
          cityId: null, // 城市
          districtId: null, // 区
          province: null, // 省份
          city: null, // 城市
          district: null, // 区
          longitude: null, // 经度
          latitude: null, // 纬度
          describe: null, // 门店介绍
          type: 0, // 0:门店,1:商圈
          mode: dealerEnum.modeType.DIRECT, // 模式
          dealerId: null, // 经销商id
          parentDeptId: '', // 组织id
          parentDeptIds: [],
        },
        latLng: {},
        addressList: [],
        isAll: false,
        SELECT_ALL_NUM,
        deliveryList: [],
        deliveryTypes: [],
        // showDialog: false,
        dealerEnum, // 经销商的枚举
        dealerObj: null, // 选中的经销商
        organizationTree: [],
      };
    },

    props: {
      btnText: {
        type: String,
        default: '保存',
      },
      createPower: {
        type: Boolean,
        default: true,
      },
    },

    filters: {
      empty(val) {
        if (!val) {
          return '- -';
        }
        return val;
      },
    },

    async mounted() {
      const { storeId, type, valueId } = this.$route.query || {};

      if (storeId) {
        this.isAdd = false;
      }
      await this.getOrganizationTreeData(); // 请求部门架构

      if (storeId !== undefined) {
        this.form.id = storeId;
      }
      if (!this.isAdd) {
        this.apiView();
      } else {
        // 提取默认图
        this.form.logo = this.curApp.logo;
        this.init();
        this.queryAppConfig(appConfig => {
          this.computedDeliveryList(appConfig);
        });
      }
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.form.area);
        this.filtration(this.form);
      });
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
        curApp: 'curApp',
        env: 'env',
        appFeatures: 'appFeatures',
        roleList: 'roleList',
      }),
      // 是否企业管理员
      isEnterpriseManager() {
        return !!this.roleList && this.roleList.split(',').indexOf('common_role_enterprise') !== -1;
      },
      isStoreKeeper() {
        return (
          !!this.roleList &&
          (this.roleList.split(',').includes('common_role_storeKeeper') ||
            this.roleList.split(',').includes('common_role_operator'))
        );
      },
      showLogo() {
        return !this.env.ESTATE;
      },
      showStoreName() {
        return !this.env.ESTATE;
      },
      showAbbreviation() {
        return !this.env.ESTATE;
      },
      storeLabel() {
        // return this.env.ESTATE ? '区域' : '门店';
        if (this.appFeatures && this.appFeatures.indexOf('zhongjun') > -1) {
          return '商场';
        } else {
          return this.env.ESTATE ? '区域' : '门店';
        }
      },
      showBusinessDayOfWeek() {
        return !this.env.ESTATE;
      },
      showOutStoreId() {
        return !this.env.ESTATE;
      },
      areaLabel() {
        return this.env.ESTATE ? '区域名称:' : '门店区域:';
      },
      areaPlaceHolder() {
        return this.env.ESTATE ? '请选择区域' : '请选择省 / 市 / 区';
      },
      showDetailAddress() {
        return !this.env.ESTATE;
      },
      showMap() {
        return !this.env.ESTATE;
      },
    },
    methods: {
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

        const dfs = (arr, target, path, ifTarget = false) => {
          for (let i = 0; i < arr.length; i++) {
            if (res) break;
            if (arr[i].deptId === target) {
              res = arr[i];
              if (ifTarget) {
                console.log(path.concat(arr[i]));
                parent = path.concat(arr[i]);
              } else {
                parent = path;
              }
              return;
            }
            if (Array.isArray(arr[i].children)) {
              dfs(arr[i].children, target, path.concat(arr[i]), ifTarget);
            }
          }
        };
        dfs(arr, target, [], ifTarget);
        return { res, parent };
      },
      // 选择组织树
      handleCascaderChange(value) {
        const parentId = value[value.length - 1];
        this.form.parentDeptId = parentId;
        this.currentOrganization = this.ifArrVal(this.organizationTree, parentId);
        const { res, parent } = this.findParents(this.organizationTree, parentId, true);
        const isDealerType = (parent && parent.some(({ type }) => type == 2)) || false;
        this.form.mode = isDealerType ? 1 : 0;
      },
      // 获取组织树
      async getOrganizationTreeData() {
        await orApi.getOrganizationTree().then(res => {
          this.organizationTree = res.data || [];
        });
      },
      changeTreeName(data) {
        return data.map(item => {
          if (item) {
            const menu = item;
            menu.label = menu.name;
            if (item.children) {
              this.changeTreeName(item.children);
            }
            return menu;
          }
        });
      },
      // 将门店类型的部门删除
      deleteStore(data) {
        if (data) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].storeId) {
              data.splice(i, 1);
              i = i - 1; // 满足条件时不要跳过下一个元素
            }
            if (data[i] && data[i].children) {
              this.deleteStore(data[i].children);
            }
          }
        }
      },
      getValue(value) {
        this.valueId = value;
        this.form.relevanceDeptId = value;
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

      installSearchInvoke(callback) {
        this._searchInvoke = callback;
        this.getlatLng();
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

      // 输入框地址改变
      latLngChange() {
        const latLng = {
          lat: parseFloat(this.form.latitude),
          lng: parseFloat(this.form.longitude),
        };
        if (this.form.latitude && this.form.longitude) {
          Map.locationLatLng(latLng);
          this.doCircle(latLng, 0, true);
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

      // 下拉框地址选择
      onAdressSelect(value) {
        this.form.address = value.address;
        this.latLng = value.latLng;
        Map.locationLatLng(value.latLng);
        Map.getCityLocation(value.latLng);
        this.doCircle(value.latLng, 0, true);
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

      // 地址检索，获取多个地址信息
      querySearch(keyWord, callback) {
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
                const address = poi[0];
                // 当前地址的经纬度
                this.latLng = address.latLng;
                Map.locationLatLng(address.latLng);
                Map.getCityLocation(address.latLng);
                this.doCircle(address.latLng, 0, true);
                console.log(Map);
                callback(this.addressList);
              }
            })
            .catch(() => {
              callback([]);
            });
        } else {
          callback([]);
        }
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
      // 图片上传成功
      onLogoUploadSuccess(url) {
        this.form.logo = url;
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
        if (city == '澳门特别行政区' && (district === '凼仔' || district === '路凼城')) {
          area[1] = area[1].replace('凼', '氹');
          this.form.address = this.form.address.replace('凼', '氹');
          this.form.district = district.replace('凼', '氹');
        }
        this.form.province = area[0];
        this.form.city = area[1];
        this.form.district = area[2];

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

      // 接收开始结束时间变化
      onWorkHourChange(opt) {
        this.form.businessStartHour = opt.startTime;
        this.form.businessEndHour = opt.endTime;
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

      // 查询详情
      apiView() {
        storeApi
          .viewStore({ storeId: this.form.id })
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
                  if (undefined !== res.data[key]) {
                    this.form[key] = res.data[key];
                  }
                  if (key === 'mode') {
                    this.form[key] = res.data[key] || 0;
                  }
                }
              }

            // 经销商信息
            this.dealerObj = {
              dealerId: res.data.dealerId,
              dealerName: res.data.dealerName,
            };

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
            this.$nextTick(() => {
              // 不要用强制res.data['businessStartHour']可能为null,undefined,也不能用if(res.data['businessStartHour']),res.data['businessStartHour']可能为0
              if (res.data.businessStartHour != null) {
                this.form.businessStartHour = res.data.businessStartHour;
              }
              if (res.data.businessEndHour != null) {
                this.form.businessEndHour = res.data.businessEndHour;
              }
              if (res.data.businessDayOfWeek) {
                const days = [];
                toDecimalDays(res.data.businessDayOfWeek).forEach((bool, index) => {
                  if (bool) {
                    days.push(index);
                  }
                });
                this.form.sourceDayOfWeek = days;

                if (days.length === SELECT_ALL_NUM) {
                  this.form.sourceDayOfWeek.unshift(SELECT_ALL_NUM);
                  this.isAll = true;
                }
              }
            });
            // 定为
            this.init();
            this.filtration(this.form);

            this.queryAppConfig(appConfig => {
              this.computedDeliveryList(appConfig, res.data);
            });
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 点击保存
      async clickSave(e) {
        if (!this.createPower) {
          this.$message.error('当前品牌已有品牌门店，请前往使用！');
          return;
        }
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

      assembleFormData() {
        const params = this.form;
        if (!this.showStoreName) {
          params.name = params.city;
        }
        if (!this.showDetailAddress) {
          params.address = '.';
        }
        // 营业时间
        if (!this.showBusinessDayOfWeek) {
          params.businessStartHour = 0;
          params.businessEndHour = 24;
          params.businessDayOfWeek = 127;
          params.sourceDayOfWeek = [0, 1, 2, 3, 4, 5, 6];
        }
        // 省市区
        params.provinceId = params.area[0];
        params.cityId = params.area[1];
        params.districtId = params.area[2];
        // 物流方式
        const { expressFb, intraCityFb, selfPickUpFb } = this.convertDeliveryParams();

        params.expressFb = expressFb;
        params.intraCityFb = intraCityFb;
        params.selfPickUpFb = selfPickUpFb;
      },

      submmit() {
        // 检验品牌物流设置是否已过期
        this.queryAppConfig(() => {
          if (this.form.id) {
            this.updateStore();
          } else {
            this.addStore();
          }
        }, 1);
      },

      filterSubmitForm(params) {
        const { sourceDayOfWeek, businessStartHour, businessEndHour } = this.form;
        const days = [0, 0, 0, 0, 0, 0, 0];

        if (sourceDayOfWeek.includes(SELECT_ALL_NUM)) {
          sourceDayOfWeek.shift(SELECT_ALL_NUM);
        }

        sourceDayOfWeek.forEach(num => {
          days[num] = 1;
        });
        params.businessStartHour = businessStartHour;
        params.businessEndHour = businessEndHour;
        params.businessDayOfWeek = toBinaryDays(days);
      },

      updateStore() {
        this.submitting = true;
        const params = { ...this.form };
        this.filterSubmitForm(params);
        storeApi
          .updateStore(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.refresh_userInfo();
            this.$emit('colsed');
          })
          .always(() => {
            this.submitting = false;
          });
      },

      addStore() {
        this.submitting = true;
        const params = { ...this.form };
        this.filterSubmitForm(params);
        storeApi
          .addStore(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.refresh_userInfo();
            // 仓库即门店，添加完新的门店后，需要更新仓库列表
            this.__updateWarehouse();
            // 刷新门店列表
            this.refresh_storeList();
            this.$emit('colsed');
          })
          .always(() => {
            this.submitting = false;
          });
      },
      refresh_storeList() {
        sharedLoginApi.getUserInfo().then(res => {
          this.$store.commit('set_userInfo', res.data);
        });
      },
      handleSelect(value) {
        const allDays = [];

        if (this.isAll) {
          // 取消全选
          if (!value.includes(SELECT_ALL_NUM) && this.DayValueMap.length - 1 === value.length) {
            this.form.sourceDayOfWeek = [];
            this.isAll = false;
          }

          // 任意选择取消全选
          if (value.includes(SELECT_ALL_NUM) && this.DayValueMap.length - 1 === value.length) {
            value.shift();
            this.form.sourceDayOfWeek = value;
            this.isAll = false;
          }
        } else {
          // 选择全选
          if (value.includes(SELECT_ALL_NUM)) {
            this.DayValueMap.forEach(item => {
              allDays.push(item.value);
            });
            this.form.sourceDayOfWeek = allDays;
            this.isAll = true;
          }
          // 全部勾选的时候，默认全选
          if (!value.includes(SELECT_ALL_NUM) && value.length === this.DayValueMap.length - 1) {
            value.unshift(SELECT_ALL_NUM);
            this.form.sourceDayOfWeek = value;
            this.isAll = true;
          }
        }
      },

      reDeliveryList(appConfig, callback) {
        const { supportLocal, supportExpress, supportPickUp } = appConfig;

        // 品牌已禁止，但门店勾选了
        if (
          (!supportLocal && this.deliveryTypes.includes(DELIVERY_TYPES.CITY_DELIVERY.value)) ||
          (!supportExpress && this.deliveryTypes.includes(DELIVERY_TYPES.EXPRESS.value)) ||
          (!supportPickUp && this.deliveryTypes.includes(DELIVERY_TYPES.SELF_DELIVERY.value))
        ) {
          this.$message({
            message: `品牌物流设置已改变，请重新设置${this.storeLabel}物流方式`,
            type: 'warning',
          });

          this.deliveryTypes = [];
          this.computedDeliveryList(appConfig);
          return false;
        }
        callback();
      },

      queryAppConfig(callback, reset) {
        if ([0, 1].includes(this.curApp.supportLocal) && !reset) {
          callback(this.curApp);

          return false;
        }

        storeApi.queryAppConfig({}).then(res => {
          if (reset) {
            this.reDeliveryList(res.data, callback);
          } else {
            callback(res.data);
          }
        });
      },

      convertDeliveryParams() {
        const params = {};
        const deliveryTypes = this.deliveryTypes;

        this.deliveryList.forEach(item => {
          if (item.value === DELIVERY_TYPES.CITY_DELIVERY.value) {
            params.intraCityFb = deliveryTypes.includes(item.value) || item.disabled ? 0 : 1;
          } else if (item.value === DELIVERY_TYPES.EXPRESS.value) {
            params.expressFb = deliveryTypes.includes(item.value) || item.disabled ? 0 : 1;
          } else {
            params.selfPickUpFb = deliveryTypes.includes(item.value) || item.disabled ? 0 : 1;
          }
        });

        return params;
      },
      // 设置物流方式项
      computedDeliveryList(appConfig, params) {
        const deliveryList = [];
        const deliveryTypes = [];
        const { supportLocal, supportExpress, supportPickUp } = appConfig;

        for (const key in DELIVERY_TYPES) {
          const item = { ...DELIVERY_TYPES[key] };
          let disabled;

          if (key === 'CITY_DELIVERY') {
            disabled = !supportLocal;
            params && !disabled && !params.intraCityFb && deliveryTypes.push(item.value);
          } else if (key === 'EXPRESS') {
            disabled = !supportExpress;
            params && !disabled && !params.expressFb && deliveryTypes.push(item.value);
          } else {
            disabled = !supportPickUp;
            params && !disabled && !params.selfPickUpFb && deliveryTypes.push(item.value);
          }

          item.disabled = disabled;
          deliveryList.push(item);
          if (this.isAdd && !disabled) {
            deliveryTypes.push(item.value);
          }
        }

        this.deliveryList = deliveryList;
        if (params || this.isAdd) {
          this.deliveryTypes = deliveryTypes;
        }
      },

      // handleDealer() {
      //   this.showDialog = true;
      // },

      // 选择经销商
      onChooseStockProduct(row) {
        this.dealerObj = row;
        this.form.dealerId = row.id;
        this.$refs.form.validateField('dealerId');
      },

      deleteDealer() {
        this.dealerObj = null;
        this.form.dealerId = null;
      },
    },
  };
</script>

<style lang="less">
  .el-form-item {
    margin-bottom: 20px;

    .w500 {
      width: 600px;

      .el-input__inner {
        width: 600px;
      }
    }

    .w110 {
      width: 180px;

      .el-input__inner {
        width: 180px;
      }
    }

    .lat-box {
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
    }
  }

  .head-info {
    div {
      display: inline-block;
      text-align: center;
      width: 100px;

      .dss-link {
        color: #256eff;
      }
    }

    .icon {
      width: 48px;
      height: 48px;
      border-radius: 100%;
      margin: 0 auto;
      display: block;
      background: gray;
      background-size: cover !important;
    }

    .upload-title {
      color: #256eff;
    }
  }

  .store-form {
    .wot-item {
      display: inline-block;
      margin-top: 0;

      .el-select,
      .el-input,
      .el-input__inner {
        width: 100px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        text-align: center;
      }
    }

    .dss-map {
      width: 600px;
      height: 400px;
      font-size: 12px;
      display: inline-block;
    }

    .el-input__inner {
      width: 320px;
      height: 30px;
    }

    .dss-small-select {
      width: 133px;
      height: 30px;

      .el-input__inner {
        width: 134px;
        height: 30px;
      }

      .el-select__tags {
        max-width: 110px !important;
        top: 65%;
      }
    }

    .el-select--mini {
      width: 100px;
      height: 30px;

      .el-input__prefix {
        display: none;
      }

      .el-input__inner {
        width: 100px;
        height: 30px;
        padding-left: 10px;
        text-align: left;
      }
    }

    .dss-btn-primary {
      width: 120px;
      background: rgba(56, 121, 251, 1);
      border-radius: 15px;
    }

    .hideTag {
      .el-select__tags .el-tag {
        &:first-child {
          display: none;
        }
      }
    }

    .dealer-box {
      display: inline-block;
      border: 1px solid #dcdee0;
      padding: 0 20px;
      min-width: 300px;
      height: 30px;
      line-height: 30px;

      a {
        float: right;
        margin-left: 50px;
        color: rgb(37, 110, 255);
      }
    }
  }

  .delivery-tips {
    color: #999;
  }
</style>
