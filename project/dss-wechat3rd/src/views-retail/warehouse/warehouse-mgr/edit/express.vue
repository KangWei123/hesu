<template>
  <div class="warehouse-container">
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/warehouse/stock-mgr/list' }" replace>
        仓库管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        配送方式
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warehouse">
      <el-form
        :model="expressForm"
        ref="expressForm"
        :rules="rules"
        v-loading="loading"
        class="warehouse-form"
        label-width="100px"
      >
        <el-form-item label="仓库名称:" style="margin:0">
          <span v-text="name"></span>
        </el-form-item>

        <el-form-item label="仓库类型:" style="margin:0">
          <span v-text="type"></span>
        </el-form-item>

        <el-form-item label="仓库地址（取货地址）:" label-width="183px">
          <span v-text="address"></span>
          &nbsp;&nbsp;
          <a class="dss-link" href="javascript:;" @click="handleEdit">修改</a>
        </el-form-item>

        <el-form-item label="配送方式:">
          <el-checkbox-group v-model="expressType">
            <el-checkbox :label="EXPRESS_TYPES.EXPRESS.label" :disabled="!supportExpress" name="type"></el-checkbox>
            <el-checkbox :label="EXPRESS_TYPES.CITY_DELIVERY.label" :disabled="!supportLocal" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <template v-if="whichExpress('EXPRESS')">
          <el-form-item label="快递设置" class="express-title" style="font-weight: bold;"> </el-form-item>

          <el-form-item label="服务范围:" prop="warehouseCoverageDTOList">
            <el-button @click="selectprovince">选择省份</el-button>
            <div class="tag-box">
              <el-tag v-for="tag in warehouseCoverageDTOList" :key="tag.id" closable @close="handleDelProvince(tag)">
                {{ tag.name }}
              </el-tag>
              <div class="clear" @click="clearProvince()">清空</div>
            </div>
          </el-form-item>

          <div class="bottom-button">
            <el-button type="primary" @click="onSubmit('expressForm')">保存</el-button>
          </div>
        </template>
      </el-form>

      <el-form
        :model="warehouseForm"
        ref="warehouseForm"
        :rules="rules2"
        v-loading="loading"
        class="warehouse-form"
        label-width="100px"
      >
        <template v-if="whichExpress('CITY_DELIVERY')">
          <el-form-item label="同城设置" class="express-title"> </el-form-item>

          <el-form-item label="业务类型" prop="buzId">
            <el-select v-model="warehouseForm.buzId" placeholder="请选择业务类型">
              <el-option v-for="item in businessTypes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-popover placement="right" width="921" trigger="hover">
              <expressTable />
              <a href="javascript:;" class="question-alert" slot="reference">
                <i class="el-icon-question"></i>
              </a>
            </el-popover>

            <div class="warehouse-tips">配送费根据业务类型计算，请谨慎选择</div>
          </el-form-item>

          <el-form-item label="配送服务商：" prop="serviceIdList">
            <servicer-table
              :servicerList="servicerList"
              @handleServicerOpen="handleServicerOpen"
              @toggleServicer="toggleServicer"
              :type="'express'"
              :noServicer="noServicer"
            />
          </el-form-item>

          <el-form-item label="收费标准:">
            <el-radio-group v-model="warehouseForm.feeType">
              <el-radio :label="1">按区域收费</el-radio>
              <el-radio :label="2">按距离收费</el-radio>
            </el-radio-group>
            <div class="warehouse-tips">注：服务半径不可超过5km</div>
          </el-form-item>

          <div class="warehouse-map">
            <el-form-item label="地图位置:">
              <div class="dss-map" id="id_for_map">地图初始化容器</div>
            </el-form-item>

            <div class="charging-ratio" :class="warehouseForm.feeType === 2 ? 'c-width' : ''">
              <el-form-item label="服务半径:" prop="radius" class="is-no-asterisk" label-width="80px">
                <el-input
                  v-model.trim="warehouseForm.radius"
                  size="mini"
                  @input="radiusChange"
                  style="width:100px;"
                ></el-input>

                <span>km</span>
              </el-form-item>

              <el-form-item label="起送费:" prop="startFee" class="is-no-asterisk" label-width="70px">
                <el-input size="mini" v-model.trim="warehouseForm.startFee" style="width:100px;"></el-input>
                <span>元</span>
              </el-form-item>

              <el-form-item label="配送费:" prop="distanceModel" label-width="70px">
                <template v-if="warehouseForm.feeType === 1">
                  <div class="is-no-asterisk">
                    <el-input size="mini" style="width:100px;" v-model.trim="warehouseForm.areaModel.fixedFee"></el-input>
                    <span>元</span>
                  </div>
                </template>

                <template v-else>
                  <div class="distance-fee">
                    <el-input
                      size="mini"
                      v-model.trim="warehouseForm.distanceModel.innerDistance"
                      style="width:40px;margin-right:5px;"
                    ></el-input
                    >km内

                    <el-input
                      size="mini"
                      v-model.trim="warehouseForm.distanceModel.innerFee"
                      style="width:40px;margin-right:5px;"
                    ></el-input
                    >元
                    <div style="height: 10px;"></div>
                    每超出
                    <el-input
                      size="mini"
                      v-model.trim="warehouseForm.distanceModel.extraDistance"
                      style="width:40px;margin-right:5px;"
                    ></el-input
                    >km

                    <el-input
                      size="mini"
                      v-model.trim="warehouseForm.distanceModel.extraFee"
                      style="width:40px;margin-right:5px;"
                    ></el-input
                    >元
                  </div>
                </template>
              </el-form-item>
            </div>
          </div>
          <!-- <el-form-item> -->
            
            <!-- <el-button @click="cancel()">取消</el-button> -->
          <!-- </el-form-item> -->
          <div class="bottom-button">
            <el-button type="primary" @click="onSubmit('warehouseForm')">保存</el-button>
          </div>
        </template>
      </el-form>
      <group-select-dialog
        v-model="showGroupDialog"
        :all-group="currentGroup"
        :label="dialogType ? '省份' : '仓库'"
        :selected-group="selectedGroup"
        @select="onGroupItemsSelected"
      ></group-select-dialog>
    </div>
  </div>
</template>
<script>
import groupSelectDialog from '@/dss-wechat3rd/src/bz_components/group-select-dialog/index.vue';
import storeApi from '@/dss-common/api/store';
import storeUser from '@/business-common/store_user.js';
import AreaPicker from '@/dss-wechat3rd/src/components/area-picker/index.vue';
import warehouseApi from '@/dss-wechat3rd/src/api/retail/warehouseApi.js';
import DssMap from '@/dss-wechat3rd/src/components/Map/index';
import expressTable from './express-table';
import { EXPRESS_TYPES, BUSINESSTYPES } from '@/dss-wechat3rd/src/constants/warehouseEnum';
import WorkHourPicker from '@/dss-wechat3rd/src/components/WorkHourPicker/index.vue';
import { mapState } from 'vuex';
import regex from '@/dss-wechat3rd/src/utils/regexps';
import servicerTable from '@/dss-wechat3rd/src/components/servicer-table';
import moneyUtil from '@/dss-common/utils/money';

regex.littleNum.msg = '0~999.99的数字，保留两位小数';

export default {
  name: 'editArea',
  mixins: [storeUser],
  components: { groupSelectDialog, AreaPicker, expressTable, WorkHourPicker, servicerTable },
  data() {
    let checkDTOList = (rule, value, callback) => {
      if (this.whichExpress('EXPRESS') && !this.warehouseCoverageDTOList.length) {
        return callback('请选择服务范围');
      } else {
        return callback();
      }
    };

    let checkDeliveryCost = (rule, value, callback) => {
      let content = [];

      if (this.warehouseForm.feeType === 1) {
        content = ['fixedFee'];
      } else {
        content = Object.keys(this.warehouseForm.distanceModel);
      }

      for (let i = 0; i < content.length; i++) {
        let key = content[i];

        if (['radius', 'startFee'].indexOf(key) !== -1) {
          continue;
        }
        let val;
        if (this.warehouseForm.feeType === 1) {
          val = this.warehouseForm.areaModel[key];
          if (val && !isNaN(val)) {
            this.warehouseForm.areaModel[key] = val = Number(val);
          }
        } else {
          val = this.warehouseForm.distanceModel[key];
          if (val && !isNaN(val)) {
            this.warehouseForm.distanceModel[key] = val = Number(val);
          }
        }

        if (val === '') {
          return callback('请输入配送费');
          break;
        } else if (!regex.littleNum.reg.test(val)) {
          return callback(regex.littleNum.msg);
          break;
        }
        if (['innerDistance', 'extraDistance'].includes(key)) {
          if (Number(val) > Number(this.warehouseForm.radius)) {
            return callback('配送距离不能大于服务半径');
          } else if (Number(val) === 0) {
            return callback('配送距离不能为0');
            break;
          }
        }
      }
      return callback();
    };

    let checkRadius = (rule, value, callback) => {
      if (!isNaN(value)) {
        this.warehouseForm.radius = value = Number(value);
      }

      if (!/^[1-5]{1}(\.[0-9]{1,2})?$/.test(value)) {
        return callback('1-5之间的数字,保留两位小数');
      }
      if (value > 5) {
        return callback('服务半径不可超过5km');
      }
      return callback();
    };

    let checkStartFee = (rule, value, callback) => {
      if (!isNaN(value)) {
        this.warehouseForm.startFee = value = Number(value);
      }

      if (!regex.littleNum.reg.test(value)) {
        return callback(regex.littleNum.msg);
      }
      return callback();
    };

    return {
      showGroupDialog: false,
      loading: false,
      name: '',
      address: '',
      type: '',
      expressType: [],
      expressForm: {},
      warehouseForm: {
        serviceId: 1,
        serviceIdList: [],
        buzId: '',
        feeType: 1,
        radius: 1,
        startFee: '',
        areaModel: {
          type: 1,
          startFee: '',
          fixedFee: '',
          circleAreaModel: {
            lng: '',
            lat: '',
            radius: 1
          }
        },
        distanceModel: {
          radius: 1,
          startFee: '',
          innerDistance: '',
          innerFee: '',
          extraDistance: '',
          extraFee: ''
        },
        latitude: null,
        longitude: null
      },
      isFirst: false, //修改的时候第一次进来地图根据经纬度显示，不根据详细地址搜索
      warehouseTargetDTOList: [],
      warehouseCoverageDTOList: [],
      currentGroup: [],
      selectedGroup: [],
      privionsList: [],
      areas: [],
      dialogType: 0, //弹框类型仓库为0，省份为1
      rules: { warehouseCoverageDTOList: [{ validator: checkDTOList, trigger: 'change' }] },
      rules2: {
        buzId: [{ required: true, message: '请选择选择业务类型', trigger: 'change' }],
        radius: [
          { required: true, message: '请输入服务半径', trigger: 'blur' },
          { validator: checkRadius, trigger: 'blur' }
        ],
        startFee: [
          { required: true, message: '请输入起送费', trigger: 'blur' },
          { validator: checkStartFee, trigger: 'blur' }
        ],
        distanceModel: [{ validator: checkDeliveryCost, trigger: 'blur' }]
      },
      EXPRESS_TYPES: EXPRESS_TYPES, // 物流设定
      businessTypes: BUSINESSTYPES,
      supportLocal: true,
      supportPickUp: true,
      supportExpress: true,
      servicerList: [],
      noServicer: false
    };
  },

  computed: {
    whichExpress() {
      return type => {
        return this.expressType.indexOf(this.EXPRESS_TYPES[type].label) !== -1;
      };
    },
    ...mapState({
      curApp: 'curApp'
    })
  },
  watch: {
    expressType: {
      handler: function(newVal, oldVal) {
        if (this.whichExpress('CITY_DELIVERY')) {
          this.initMap();
        }
        if (newVal.length !== oldVal.length) {
          let label = newVal.concat(oldVal).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
          })[0];
          this.setExpressType(label);
        }
      }
    },
    'warehouseForm.radius'() {
      if (this.warehouseForm.feeType === 2 && this.warehouseForm.distanceModel.innerFee !== '') {
        this.$refs.warehouseForm.validateField('distanceModel');
      }
    },
    'warehouseForm.feeType'() {
      if (this.warehouseForm.distanceModel.innerFee !== '') {
        this.$refs.warehouseForm.validateField('distanceModel');
      }
    }
  },
  mounted() {
    storeApi.queryRegion().done(({ data }) => {
      this.privionsList = data;
      this.getDetail();
    });

    this.supportLocal = this.curApp.supportLocal ? true : false;
    this.supportExpress = this.curApp.supportExpress ? true : false;
    this.queryServicer();
  },

  methods: {
    onGroupItemsSelected(groups) {
      this.warehouseCoverageDTOList = groups;
      this.$refs.expressForm.validateField('warehouseCoverageDTOList');
    },
    initMap() {
      //初始化地图
      DssMap.initMap({
        htmlId: 'id_for_map',
        onClickMap: this.onClickMap, // 位置在创建仓库时确定
        onMapLocation: this.onMapLocation,
        installSearchInvoke: this.installSearchInvoke,
        Circle: this.Circle,
        fixedMarker: true
      });
    },

    Circle(callback) {
      this.doCircle = callback;
      this.radiusChange();
    },

    installSearchInvoke(callback) {
      this._searchInvoke = callback;
    },
    radiusChange() {
      if (!this.warehouseForm.radius || isNaN(this.warehouseForm.radius)) return;
      this.locationLCircle();
    },

    onLocationLatLng() {
      if (!!this._searchInvoke && !!this.address) {
        this._searchInvoke(this.address)
          .then(poi => {
            if (!!poi) {
              let item = poi[0];
              DssMap.locationLatLng(item.latLng);
              this.warehouseForm.latitude = item.latLng.lat;
              this.warehouseForm.longitude = item.latLng.lng;
            }
          })
          .finally(() => {
            this.locationLCircle();
          });
      }
    },

    locationLCircle() {
      let latLng = {
        lat: parseFloat(this.warehouseForm.latitude),
        lng: parseFloat(this.warehouseForm.longitude)
      };

      if (this.warehouseForm.latitude && this.warehouseForm.longitude) {
        this.doCircle(latLng, this.warehouseForm.radius * 1000, true);
        DssMap.locationLatLng(latLng);
      }
    },

    //点击地图回调
    onClickMap(latitude, longitude) {
      return false;
      this.warehouseForm.latitude = latitude;
      this.warehouseForm.longitude = longitude;
      this.doCircle({ lat: latitude, lng: longitude }, this.warehouseForm.radius * 1000);
      this.$refs.warehouseForm.validateField('latitude');
    },

    onMapLocation(address, addressComponents) {},

    //选择省份
    selectprovince() {
      this.currentGroup = this.privionsList;
      this.selectedGroup = this.warehouseCoverageDTOList;
      this.showGroupDialog = true;
      this.dialogType = 1;
    },

    handleDelProvince(tag) {
      this.warehouseCoverageDTOList.splice(this.warehouseCoverageDTOList.indexOf(tag), 1);
    },

    clearProvince() {
      this.warehouseCoverageDTOList = [];
    },

    getDetail() {
      warehouseApi
        .select({ id: this.$route.query.id })
        .then(rs => {
          let detail = rs.data;

          this.isFirst = true;
          let { name, province, city, district, address } = detail;

          this.name = name;
          this.address = province + city + district + address;
          this.warehouseForm.latitude = detail.latitude;
          this.warehouseForm.longitude = detail.longitude;

          let flag = detail.tag & (1 << 3),
            flag2 = detail.tag & (1 << 5),
            flag3 = detail.tag & (1 << 6);

          if (detail.type === 20) {
            this.supportLocal = false;
            this.supportPickUp = false;
            this.type = '区域仓';
          } else {
            this.type = '前置仓';
          }

          // 支持快递
          if (flag === 1 << 3 && this.supportExpress) {
            this.expressType.push(this.EXPRESS_TYPES.EXPRESS.label);
          }

          // 支持同城
          if (flag2 === 1 << 5 && this.supportLocal) {
            this.expressType.push(this.EXPRESS_TYPES.CITY_DELIVERY.label);
          }

          // 支持自提
          if (flag3 === 1 << 6 && this.supportPickUp) {
            this.expressType.push(this.EXPRESS_TYPES.SELF_DELIVERY.label);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {});

      // 快递配置详情
      warehouseApi
        .express_query({ warehouseId: this.$route.query.id })
        .then(rs => {
          let detail = rs.data;

          if (detail && detail[0]) {
            detail[0].expressAreas = detail[0].expressAreas || [];

            if (detail[0].expressAreas[0] && detail[0].expressAreas[0].provinceId === 0) {
              this.warehouseCoverageDTOList = this.privionsList;
            } else {
              this.warehouseCoverageDTOList = detail[0].expressAreas.map(item => {
                item = {
                  id: item.provinceId,
                  name: item.province
                };
                return item;
              });
            }
          }
        })
        .catch(err => {
          console.error(err);
        });

      // 同城配送详情
      if (!this.curApp.supportLocal) {
        return;
      }
      warehouseApi.local_query({ warehouseId: this.$route.query.id }).then(rs => {
        if (rs.data) {
          let detail = rs.data;

          if (!detail) {
            return;
          }

          let { buzId, feeType, areaModel = '{}', distanceModel = '{}' } = detail;

          this.warehouseForm.buzId = buzId;
          this.warehouseForm.feeType = feeType;

          this.warehouseForm.areaModel = JSON.parse(areaModel);
          this.warehouseForm.distanceModel = JSON.parse(distanceModel);

          this.warehouseForm.areaModel.fixedFee = moneyUtil.convertHundredMoneyUnit(
            this.warehouseForm.areaModel.fixedFee,
            true
          );
          this.warehouseForm.areaModel.startFee = moneyUtil.convertHundredMoneyUnit(
            this.warehouseForm.areaModel.startFee,
            true
          );

          this.warehouseForm.distanceModel.startFee = moneyUtil.convertHundredMoneyUnit(
            this.warehouseForm.distanceModel.startFee,
            true
          );
          this.warehouseForm.distanceModel.innerFee = moneyUtil.convertHundredMoneyUnit(
            this.warehouseForm.distanceModel.innerFee,
            true
          );
          this.warehouseForm.distanceModel.extraFee = moneyUtil.convertHundredMoneyUnit(
            this.warehouseForm.distanceModel.extraFee,
            true
          );

          if (feeType === 1) {
            this.warehouseForm.radius = this.warehouseForm.areaModel.circleAreaModel
              ? this.warehouseForm.areaModel.circleAreaModel.radius || 1
              : 1;
            this.warehouseForm.startFee = this.warehouseForm.areaModel.startFee;
          } else {
            this.warehouseForm.radius = this.warehouseForm.distanceModel.radius || 1;
            this.warehouseForm.startFee = this.warehouseForm.distanceModel.startFee;
          }
        }
      });
    },

    onSubmit(refName) {
      console.log(this.warehouseForm);
      this.$refs[refName].validate().then(valid => {
        if (!valid) {
          return;
        }
        if (refName === 'expressForm') {
          let warehouseCoverageDTOList;

          if (this.warehouseCoverageDTOList.length === 34) {
            warehouseCoverageDTOList = [{ provinceId: 0, province: '全国' }];
          } else {
            warehouseCoverageDTOList = this.warehouseCoverageDTOList.map(item => {
              item = {
                provinceId: item.id,
                province: item.name
              };
              return item;
            });
          }
          warehouseApi
            .express_update({ warehouseId: this.$route.query.id, expressAreas: warehouseCoverageDTOList })
            .then(rs => {
              if (rs.success) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
              }
            })
            .catch(err => {
              console.error(err);
            });
          return false;
        }

        let params = this.$plain(this.warehouseForm);

        // 删除 serviceIdList
        delete params.serviceIdList;
        params.warehouseId = this.$route.query.id;

        params.startFee = moneyUtil.convertHundredMoneyUnit(params.startFee, false);
        params.areaModel.fixedFee = moneyUtil.convertHundredMoneyUnit(params.areaModel.fixedFee, false);

        params.distanceModel.innerFee = moneyUtil.convertHundredMoneyUnit(params.distanceModel.innerFee, false);
        params.distanceModel.extraFee = moneyUtil.convertHundredMoneyUnit(params.distanceModel.extraFee, false);
        // 处理 areaModel
        let areaModel = { fixedFee: params.areaModel.fixedFee, startFee: params.startFee, type: 1 };
        areaModel.circleAreaModel = {
          lat: Number(params.latitude),
          lng: Number(params.longitude),
          radius: Number(params.radius)
        };
        params.areaModel = JSON.stringify(areaModel);

        // 处理 distanceModel
        params.distanceModel.radius = params.radius;
        params.distanceModel.startFee = params.startFee;
        for (let key in params.distanceModel) {
          params.distanceModel[key] = Number(params.distanceModel[key]);
        }

        params.distanceModel = JSON.stringify(params.distanceModel);

        warehouseApi
          .local_update(params)
          .then(rs => {
            if (rs.success) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },

    cancel() {
      this.$router.push({
        path: '/warehouse/stock-mgr/list'
      });
    },

    handleEdit() {
      this.$router.push({
        path: '/warehouse/stock-mgr/list/add',
        query: { id: this.$route.query.id }
      });
    },

    // 绑定仓库至服务商
    handleServicerOpen({ deliveryType }) {
      if (!this.warehouseForm.buzId) {
        this.$refs.warehouseForm.validateField('buzId');
        return false;
      }

      this.$confirm('我们将会在3个工作日内完成审核', '绑定服务商', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        warehouseApi
          .bind({
            warehouseId: this.$route.query.id,
            serviceId: deliveryType,
            buzId: this.warehouseForm.buzId
          })
          .then(rs => {
            if (rs.success) {
              this.queryServicer();
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },

    toggleServicer({ warehouseId, deliveryType, enable }) {
      enable = enable === 0 ? 1 : 0;

      this.$confirm(`是否确认${enable === 0 ? '关闭' : '开启'}服务？`, `${enable === 0 ? '关闭' : '开启'}服务`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        warehouseApi
          .toggle({
            warehouseId,
            deliveryType,
            enable
          })
          .then(res => {
            if (res.data) {
              this.queryServicer();
            }
          });
      });
    },

    queryServicer() {
      warehouseApi.support({ warehouseId: this.$route.query.id }).then(res => {
        if (!res.data || !res.data.length) {
          this.noServicer = true;
          return;
        }
        this.servicerList = res.data;
      });
    },

    setExpressType(label) {
      let state = this.expressType.indexOf(label) === -1 ? 0 : 1,
        type;

      switch (label) {
        case EXPRESS_TYPES.SELF_DELIVERY.label:
          type = 1;
          break;
        case EXPRESS_TYPES.EXPRESS.label:
          type = 2;
          break;
        case EXPRESS_TYPES.CITY_DELIVERY.label:
          type = 3;
          break;
      }

      warehouseApi
        .switch({ warehouseId: this.$route.query.id, type: type, state: state })
        .then(rs => {
          if (rs.success) {
            console.log(`${label}设置成功`);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import '~@/dss-common/style/wkt-constants.less';
 @header: 48px; //头部高度
  @scroll: 17px; //滚动条高度
  @footerHeight: 44px; //footer高度
  @titleHeight: 58px; //标题高度
.warehouse-container {
  min-height: calc(100vh - @header - @footerHeight - @titleHeight - 10px);
}
.warehouse-form {
  margin-bottom: 20px;
  .el-tag {
    margin-right: 10px;
    min-width: 80px;
  }
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
  }

  /deep/ .el-form-item .el-form-item__error{
    margin-left: 0;
  }

  .distance-fee{
   /deep/ .el-input__inner{
      padding: 0;
      text-align: center;
    }
  }
}
.question-alert {
  display: inline-block;
  vertical-align: top;
  line-height: normal;
  margin: -10px 0 0 5px;
  color: #000;
  font-size: 20px;
}
.warehouse-map {
  position: relative;
  .charging-ratio {
    position: absolute;
    left: 164px;
    top: 15px;
    z-index: 150;
    padding: 10px 10px 0 0;
    width: 205px;
    background: #fff;
    &.c-width {
      width: 255px;
      padding-right: 0;
    }
    .is-no-asterisk {
      /deep/ .el-input--mini .el-input__inner {
        width: 100px;
      }
    }
    .distance-fee {
       /deep/ .el-input--mini .el-input__inner {
        width: 40px;
      }
    }
  }
}
.logistics-servicer {
  width: 800px;
}
.express-title{
  /deep/ .el-form-item__label{
    font-weight: bold;
    font-size: 16px;
    margin-top: 15px;
  }
}
</style>
