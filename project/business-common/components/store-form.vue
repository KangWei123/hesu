<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="100px"
    style="margin: 0; height: 100%"
    class="dss-form"
    v-loading="loading"
  >
    <el-form-item prop="logo" v-if="showLogo" class="head-info">
      <add-image @success="onLogoUploadSuccess">
        <i
          class="icon"
          v-if="form.logo"
          :style="!!form.logo ? 'background: transparent url(' + form.logo + ') no-repeat 0 0;' : ''"
        ></i>
        <img class="icon" v-else :src="require('@/dss-common/img/brand/logo-default.png')" />
        <a href="javascript:;" class="table-href upload-title">上传门店logo</a>
      </add-image>
    </el-form-item>

    <el-form-item :label="`${storeLabel}名称:`" v-if="showStoreName" prop="name">
      <el-input type="input" v-model="form.name" :placeholder="`请输入${storeLabel}名称`"></el-input>
    </el-form-item>

    <el-form-item label="营业时间:" v-if="showBusinessDayOfWeek" prop="businessDayOfWeek">
      <div>
        <!--天-->
        <el-select
          v-model="form.sourceDayOfWeek"
          multiple
          placeholder="请选择"
          @change="handleSelect"
          :class="[isAll ? 'hideTag' : '']"
        >
          <el-option v-for="(item, index) in DayValueMap" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <work-hour-picker
          :init-value="{ startTime: form.businessStartHour, endTime: form.businessEndHour }"
          :able-support-rest="false"
          is-division-region
          @change="onWorkHourChange"
        ></work-hour-picker>
      </div>
    </el-form-item>

    <el-form-item prop="parentDeptIds" label="上级组织">
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
        <el-radio :label="modeType.DIRECT">直营</el-radio>
        <el-radio :label="modeType.DEALER">经销</el-radio>
      </el-radio-group>
      <div class="delivery-tips">
        {{
          form.mode === modeType.DIRECT
            ? '直营模式下，门店的商品/订单/活动/支付由总部统筹运营与管理'
            : '经销商模式下，门店的商品/订单/活动/支付由经销商统筹运营与管理，订单入账经销商商户号'
        }}
      </div>
    </el-form-item>

    <el-form-item label="线下门店编号:" v-if="showOutStoreId" prop="outStoreId">
      <el-input type="input" v-model="form.outStoreId"></el-input>
    </el-form-item>

    <el-form-item prop="area" :label="areaLabel">
      <el-cascader
        expand-trigger="hover"
        @active-item-change="handleItemChange"
        @change="handleChange"
        :options="areas"
        placeholder="请选择省 / 市 / 区"
        :props="{ label: 'name', value: 'id', children: 'childNode' }"
        v-model="form.area"
        separator="-"
      ></el-cascader>
    </el-form-item>

    <el-form-item label="详细地址:" v-if="showDetailAddress" prop="address">
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

    <el-form-item label="地图位置:" v-show="showMap" prop="province">
      <div class="dss-map" id="id_for_map">地图初始化容器</div>
    </el-form-item>

    <el-form-item label="客服电话:" prop="tel">
      <el-input type="input" v-model="form.tel" placeholder="请输入客服电话:"></el-input>
    </el-form-item>

    <el-form-item :label="`${storeLabel}简介:`" prop="describe">
      <el-input type="textarea" :rows="9" class="w500" v-model="form.describe"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button :loading="submitting" type="primary" @click="clickSave">{{ btnText }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { mapState } from 'vuex';
  import WorkHourPicker from '@/dss-wechat3rd/src/components/WorkHourPicker/index.vue';
  import storeUser from '@/business-common/store_user.js';
  import api from '@/dss-wechat3rd/src/api';
  import storeApi from '@/dss-common/api/store';
  import regexps from '@/dss-common/utils/regexps';
  import DssMap from '@/dss-wechat3rd/src/components/Map/index';
  import AddImage from '@/dss-wechat3rd/src/components/materials/addImage.vue';
  import { toDecimalDays, toBinaryDays } from '@/business-common/utils/util';

  const SELECT_ALL_NUM = 7;

  export default {
    name: 'StoreForm',
    mixins: [storeUser],
    components: { AddImage, WorkHourPicker },
    data() {
      const businessDayOfWeekRule = (rule, value, callback) => {
        const { sourceDayOfWeek, businessStartHour, businessEndHour } = this.form;
        if (!sourceDayOfWeek.length) {
          callback(new Error('请选择营业日期'));
        } else if (businessStartHour === null) {
          callback(new Error('请选择营业开始时间'));
        } else if (businessEndHour === null) {
          callback(new Error('请选择营业结束时间'));
        } else if (businessEndHour - businessStartHour > 24) {
          callback(new Error('门店营业时间间隔不能大于24小时'));
        } else {
          callback();
        }
      };
      const areaRule = (rule, value, callback) => {
        if (value && value.length) {
          callback();
        } else {
          callback(new Error('请选择区域'));
        }
      };

      return {
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
          tel: [
            { required: true, message: '请输入客服电话', trigger: 'blur' },
            { pattern: regexps.servicePhone.reg, message: regexps.servicePhone.msg, trigger: 'blur' },
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
          describe: [
            {
              min: 1,
              max: 256,
              message: '长度在 1 到 256 个字符',
              trigger: 'blur',
            },
          ],
        },
        form: {
          id: undefined,
          logo: '', // 门店logo
          name: '', // 门店名称
          tel: '', // 客服电话
          businessStartHour: null, // 门店营业起始时间
          businessEndHour: null, // 门店营业结束时间
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
        },
        addressList: [],
        isAll: false,
        organizationTree: [],
        modeType: {
          DIRECT: 0, // 直营模式
          DEALER: 1, // 经销商模式
        },
        SELECT_ALL_NUM,
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
      await this.getOrganizationTreeData(); // 请求部门架构
      const { storeId, type } = this.$route.query || {};
      if (storeId) {
        this.isAdd = false;
      }

      if (storeId !== undefined) {
        this.form.id = storeId;
      }
      if (!this.isAdd) {
        this.apiView();
      } else {
        // 提取默认图
        this.form.logo = this.curApp.logo;
        this.init();
      }
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.form.area);
        this.filtration(this.form);
      });
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
        env: 'env',
        roleList: 'roleList',
      }),
      // 是否企业管理员
      isEnterpriseManager() {
        return !!this.roleList && this.roleList.split(',').indexOf('common_role_enterprise') !== -1;
      },
      showLogo() {
        return !this.env.ESTATE;
      },
      showStoreName() {
        return !this.env.ESTATE;
      },
      storeLabel() {
        return this.env.ESTATE ? '区域' : '门店';
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
      showDetailAddress() {
        return !this.env.ESTATE;
      },
      showMap() {
        return !this.env.ESTATE;
      },
    },
    methods: {
      init() {
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
        await storeApi.getOrganizationTree().then(res => {
          console.log(res, 'resssss');
          this.organizationTree = res.data || [];
        });
      },

      Circle(callback) {
        this.doCircle = callback;
        this.setCenter();
      },

      // 初始化时利用画圆方法来设置地图中心位置
      setCenter() {
        const latLng = {
          lat: parseFloat(this.form.latitude),
          lng: parseFloat(this.form.longitude),
        };
        if (this.form.latitude && this.form.longitude) {
          DssMap.locationLatLng(latLng);
          this.doCircle(latLng, 0, true);
        }
      },

      installSearchInvoke(callback) {
        this._searchInvoke = callback;
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

      // 下拉框地址选择
      onAdressSelect(value) {
        this.form.address = value.address;
        DssMap.locationLatLng(value.latLng);
        DssMap.getCityLocation(value.latLng);
        this.doCircle(value.latLng, 0, true);
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

          this._searchInvoke(address + keyWord)
            .then(poi => {
              if (poi && poi.length) {
                this.addressList = poi;
                this.addressList.forEach(item => {
                  if (item.address) {
                    item.value = item.address + '—' + item.name;
                  }

                  item.id = item.latLng;
                });
                const d = poi[0];
                DssMap.locationLatLng(d.latLng);
                DssMap.getCityLocation(d.latLng);
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

      // 地址检索
      onLocationLatLng(address) {
        this._searchInvoke(address || this.form.address).then(poi => {
          if (poi) {
            const item = poi[0];
            DssMap.locationLatLng(item.latLng);
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
        this.form.address = address;
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
        if (index >= areaNames.length - 1 || index >= 2) {
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
        api
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
                }
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
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 点击保存
      clickSave() {
        if (!this.createPower) {
          this.$message.error('当前品牌已有品牌门店，请前往使用！');

          // 通知父级组件，当前品牌已有品牌门店
          const timer = setTimeout(() => {
            clearTimeout(timer);
            this.$emit('alreadyStore');
          }, 3000);
          return;
        }
        this.assembleFormData();

        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.form.id) {
              this.updateStore();
            } else {
              this.addStore();
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
        api
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
        api
          .addStore(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.refresh_userInfo();
            // 仓库即门店，添加完新的门店后，需要更新仓库列表
            this.__updateWarehouse();
            this.$emit('colsed');
          })
          .always(() => {
            this.submitting = false;
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
  }

  .head-info {
    div {
      display: inline-block;
      text-align: center;
      width: 100px;

      .dss-link {
        color: @blue-color;
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
      color: @blue-color;
    }
  }

  .dss-form {
    width: 800px;
    margin: 0 auto;
    padding-top: 36px;

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
  }

  .delivery-tips {
    color: #999;
  }
</style>
