<template>
  <div class="goods-add-container">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/estate/goods-mgr/building/list' }" replace>楼盘列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加楼盘</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="goods-form" v-if="showForm" :model="form" :rules="rules" ref="form" label-width="120px">
      <!-- 第1部分填写楼盘基本信息部分 -->
      <div>
        <span class="goods-icon">1</span>
        <h3 class="goods-title">楼盘基本信息</h3>
      </div>

      <!-- 标题 -->
      <el-form-item label="楼盘名称：" class="goods-label" prop="itemDetailDTO.wxItem.name">
        <el-input
          placeholder="请输入楼盘名称"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.name"
        ></el-input>
      </el-form-item>

      <el-form-item label="副标题：" class="goods-label" prop="itemDetailDTO.wxItem.subName">
        <el-input
          placeholder="请输入副标题"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.subName"
        ></el-input>
      </el-form-item>

      <!--楼盘区域-->
      <el-form-item label="楼盘区域：" class="goods-label" prop="itemDetailDTO.wxItem.store">
        <load-more-select
          :url="storeApiUrl"
          v-model="form.itemDetailDTO.wxItem.store"
          value-key="id"
          class=" primary-inputHeight"
          label-key="name"
          filterable
        >
        </load-more-select>
      </el-form-item>

      <el-form-item prop="itemDetailDTO.wxItem.area" class="goods-label" label="楼盘地址：">
        <el-cascader
          expand-trigger="hover"
          @active-item-change="handleItemChange"
          @change="handleChange"
          class="primary-inputHeight"
          :options="areas"
          placeholder="请选择省 / 市 / 区"
          :props="{ label: 'name', value: 'id', children: 'childNode' }"
          v-model="form.itemDetailDTO.wxItem.area"
          separator="-"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="详细地址：" class="goods-label" prop="itemDetailDTO.wxItem.address">
        <el-autocomplete
          type="input"
          v-model="form.itemDetailDTO.wxItem.address"
          class="goods-w366 primary-inputHeight"
          placeholder="请填写详细地址，方便会员查找"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="onAdressSelect"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="地图位置：" prop="itemDetailDTO.wxItem.province">
        <div class="dss-map" id="id_for_map">地图初始化容器</div>
        <div class="map-latitude">
          <div>
            <span>经度：</span>
            <span>{{ form.itemDetailDTO.wxItem.latitude }}</span>
          </div>
          <div>
            <span> 纬度：</span>
            <span>{{ form.itemDetailDTO.wxItem.longitude }}</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="开盘时间：" class="goods-label" prop="itemDetailDTO.wxItem.openTime">
        <el-date-picker
          v-model="form.itemDetailDTO.wxItem.openTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开盘时间"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="楼盘标签：" class="goods-label">
        <goods-label-select
          :select-label-id="form.itemDetailDTO.wxItem.labelIds"
          :label-type="labelType"
          ref="labelCascader"
          multiple
          class=" primary-inputHeight"
          @selectedLabelId="selectedLabelId"
        />
        <el-button type="text" round @click="addLabelPopup()">快速增加标签</el-button>
      </el-form-item>

      <el-form-item label="建筑面积：" class="goods-label" prop="itemDetailDTO.wxItem.buildArea">
        <el-input
          style="width:220px"
          placeholder="请输入建筑面积"
          maxlength="80"
          class=" primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.buildArea"
        ></el-input>
        <span class="goods-unit">/m<sup>2</sup></span>
      </el-form-item>
      <el-form-item label="产品类型：" class="goods-label" prop="itemDetailDTO.wxItem.estateType">
        <el-input
          placeholder="请输入产品类型"
          maxlength="80"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.estateType"
        ></el-input>
      </el-form-item>
      <el-form-item label="开发商：" class="goods-label" prop="itemDetailDTO.wxItem.developers">
        <el-input
          placeholder="请输入开发商"
          maxlength="80"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.developers"
        ></el-input>
      </el-form-item>
      <el-form-item label="售楼电话：" class="goods-label" prop="itemDetailDTO.wxItem.salesCall">
        <el-input
          placeholder="请输入售楼电话"
          maxlength="80"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.salesCall"
        ></el-input>
      </el-form-item>
      <el-form-item label="容积率：" class="goods-label" prop="itemDetailDTO.wxItem.volumeRatio">
        <el-input
          placeholder="请输入容积率"
          maxlength="80"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.volumeRatio"
        ></el-input>
      </el-form-item>
      <el-form-item label="绿化率：" class="goods-label" prop="itemDetailDTO.wxItem.greenRatio">
        <el-input
          placeholder="请输入绿化率"
          maxlength="80"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.greenRatio"
        ></el-input>
      </el-form-item>
      <el-form-item label="预售许可证：" class="goods-label" prop="itemDetailDTO.wxItem.fyszd">
        <el-input
          placeholder="请输入预售许可证"
          maxlength="80"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.fyszd"
        ></el-input>
      </el-form-item>
      <el-form-item label="楼盘简介：" class="goods-label" prop="itemDetailDTO.wxItem.profiles">
        <div class="goods-w366 profiles">
          <el-input
            placeholder="请输入楼盘简介"
            type="textarea"
            :rows="5"
            :maxlength="100"
            class="goods-w366 primary-inputHeight"
            v-model="form.itemDetailDTO.wxItem.profiles"
          >
          </el-input>
          <span class="profiles-tips">{{ profilesRemnantCount }} / 100</span>
        </div>
      </el-form-item>

      <!--图片-->
      <el-form-item :label="goodsTypeEnum.estate.label + '图片：'" class="goods-label" prop="itemDetailDTO.materialsId">
        <choose-images
          v-model="form.itemDetailDTO.materialsId[index]"
          :is-disabled-edit="isDisabledEdit"
          :height="176"
          style="margin-right: 10px;"
          @input="onImageAdd(index)"
          @delete="onDeleteImg(index)"
          :multiple="form.itemDetailDTO.materialsId[index].id === 0"
          v-for="(item, index) in form.itemDetailDTO.materialsId"
          :key="index"
          :limit="limit"
          :disable="goodsImgCountLimit(index)"
        />
        <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">
          建议尺寸750*750，建议图片小于2M
        </div>
      </el-form-item>

      <!-- VR展示 -->
      <el-form-item label="VR展示：" class="goods-label" prop="itemDetailDTO.wxItem.vrUrl">
        <el-input
          placeholder="请输入VR链接"
          class="goods-w366 primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.vrUrl"
        ></el-input>
      </el-form-item>

      <!-- 楼盘描述 -->
      <el-form-item label="项目亮点：" class="goods-label">
        <w-editor :dataSource="form.itemDetailDTO.wxItem"></w-editor>
      </el-form-item>

      <!-- 第1部分填写楼盘基本信息部分 -->
      <div>
        <span class="goods-icon">2</span>
        <h3 class="goods-title">楼盘价格</h3>
      </div>
      <el-form-item label="楼盘均价：" class="goods-label" prop="itemDetailDTO.wxItem.averagePrice">
        <el-input
          placeholder="请输入价格"
          class="goods-price primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.averagePrice"
        ></el-input>
        <span class="goods-unit">元</span>
      </el-form-item>
      <el-form-item label="认筹金：" class="goods-label" prop="itemDetailDTO.wxItem.recognitionOfGold">
        <el-input
          placeholder="请输入标价"
          class="goods-price primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.recognitionOfGold"
        ></el-input>
        <span class="goods-unit">元</span>
      </el-form-item>

      <el-form-item label="苑区：" class="goods-label" prop="itemDetailDTO.wxItem.rangeDTOList">
        <el-button @click="handleAddGardens" :disabled="isEdit">添加苑区</el-button>
      </el-form-item>
      <el-form-item
        class="goods-label"
        v-if="form.itemDetailDTO.wxItem.rangeDTOList && form.itemDetailDTO.wxItem.rangeDTOList.length"
      >
        <el-tree
          class="garden-tree"
          :props="{ children: 'rangeDTOList', label: 'name' }"
          :data="form.itemDetailDTO.wxItem.rangeDTOList"
          :expand-on-click-node="false"
          :default-expand-all="isEdit ? false : true"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="isRoom(node)" class="room-label room-num">{{ data.name }}</span>
            <el-input
              v-model="data.name"
              :disabled="isEdit"
              v-else
              :placeholder="`请输入${nodeLabel(node)}名称`"
            ></el-input>
            <span class="room-box">
              <span v-if="data.rooms" class="room-label" v-for="(room, index) in data.rooms" :key="index">{{
                room
              }}</span>
            </span>
            <span class="node-option">
              <el-button
                type="text"
                size="mini"
                :disabled="isEdit"
                v-if="showAppendLabel(node)"
                @click="() => appendNode(node, data)"
              >
                {{ appendLabel(node) }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isEdit"
                v-if="showDeleteLabel(node)"
                @click="() => removeNode(node)"
                >删除</el-button
              >
            </span>
          </div>
        </el-tree>
      </el-form-item>

      <!-- 第1部分填写楼盘基本信息部分 -->
      <div>
        <span class="goods-icon">3</span>
        <h3 class="goods-title">置业顾问</h3>
      </div>

      <el-form-item label="置业顾问：" class="goods-label" prop="itemDetailDTO.wxItem.staffList">
        <el-button size="mini" @click="showStaffDialog = true" class="choose-coupon">选择置业顾问 </el-button>
      </el-form-item>
      <el-form-item v-if="form.itemDetailDTO.wxItem.staffList && form.itemDetailDTO.wxItem.staffList.length">
        <el-table :data="form.itemDetailDTO.wxItem.staffList" style="width: 600px" class="wkt-table">
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <span class="ellipsis" :title="scope.row.name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="账号" prop="phone">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <a class="table-delete" href="javascript:;" @click="handleDelStaffItem(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div class="bottom-button">
        <el-button type="primary" class="goods-save" @click="onSubmit('form')">保存</el-button>
      </div>
    </el-form>

    <staff-select-dialog
      v-model="showStaffDialog"
      label="选择置业顾问"
      @selected="onStaffChoosed"
      :selected-staffs="form.itemDetailDTO.wxItem.staffList"
    >
    </staff-select-dialog>

    <!-- 增加或修改标签的对话弹框 -->
    <goods-label-dialog
      v-if="showEditLabelPopup"
      :visible.sync="showEditLabelPopup"
      :edit-title="editTitle"
      :label-edit-obj="labelEditObj"
      @refresh-data="refreshData"
    ></goods-label-dialog>

    <el-dialog title="添加房间" :visible.sync="showAddRoom" v-if="curNodeData">
      <el-form :model="curNodeData">
        <el-form-item label="楼层数" label-width="100px">
          <el-input v-model="curNodeData.storeyNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="楼层房间数" label-width="100px">
          <el-input v-model="curNodeData.roomNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddRoom = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRoom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import '@/dss-wechat3rd/src/components/goods/css/GoodsEditForm.less';
import utils from '@/dss-common/utils/index.js';
import moneyUtil from '@/dss-common/utils/money';
import constants from '@/dss-wechat3rd/src/constants/index';
import regex from '@/dss-wechat3rd/src/constants/regex';
import tag1Enum from '@/dss-wechat3rd/src/constants/Tag1Enum';
import services from '@/dss-common/utils/services';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';

import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

import GoodManageBread from '@/dss-wechat3rd/src/components/goods/GoodsManageBread';
import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
import AttributePriceTable from '@/dss-wechat3rd/src/components/goods/SkuInfoTable';

import MultiGoodsAttribute from '@/dss-wechat3rd/src/components/goods/GoodsAttribute/index.vue';
import GoodsLabelSelect from '@/dss-wechat3rd/src/bz_components/goods-label-select/index.vue';
import goodsClassfiyAdd from '@/dss-wechat3rd/src/bz_components/goods-classfiy-dialog/add.vue';
import goodsLabelDialog from '@/dss-wechat3rd/src/bz_components/goods-label-dialog/index.vue';
import TplAreaTable from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-area-table.vue';
import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';

import LoadMoreSelect from '@/dss-wechat3rd/src/components/load-more-select/index.vue';
import AreaPicker from '@/dss-wechat3rd/src/components/area-picker/index.vue';
import DssMap from '@/dss-wechat3rd/src/components/Map/index';
import StaffSelectDialog from '@/dss-wechat3rd/src/bz_components/staff-select-dialog/index.vue';

import { mapState } from 'vuex';
import storeApi from '@/dss-common/api/store';

const GARDEN_TYPE = {
  garden: 1,
  building: 2,
  unit: 3,
  room: 4
};

export default {
  name: 'AddProduct',
  mixins: [appFeaturesMixin],
  components: {
    MultiGoodsAttribute,
    GoodManageBread,
    GoodsCategoryCascader,
    AttributePriceTable,
    ChooseImages,
    WEditor,
    GoodsLabelSelect,
    goodsClassfiyAdd,
    goodsLabelDialog,
    TplAreaTable,
    LoadMoreSelect,
    AreaPicker,
    StaffSelectDialog
  },

  props: {
    // 是否不允许编辑敏感信息
    isDisabledEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const checkRangeDTOList = (rule, value, callback) => {
      function parseNode(node) {
        let typeDesc = '';
        if (node.type === GARDEN_TYPE.garden) {
          typeDesc = '苑区';
        } else if (node.type === GARDEN_TYPE.building) {
          typeDesc = '楼栋';
        } else if (node.type === GARDEN_TYPE.unit) {
          typeDesc = '单元';
        }
        if (!node.name) {
          throw Error('请输入' + typeDesc + '名称');
        } else if (!node.name || node.name.length > 10) {
          throw Error('请输入10个字符以内的' + typeDesc + '名称');
        } else {
          if (node.rangeDTOList && node.rangeDTOList.length) {
            node.rangeDTOList.forEach(child => {
              parseNode(child);
            });
          }
        }
      }

      try {
        value.forEach(item => {
          parseNode(item);
        });
      } catch (errMsg) {
        return callback(errMsg);
      }

      if (!value || value.length < 1) {
        return callback('请添加苑区');
      } else {
        return callback();
      }
    };

    const checkStaffList = (rule, value, callback) => {
      if (value && value.length) {
        return callback();
      } else {
        return callback('请选择置业顾问');
      }
    };
    return {
      GARDEN_TYPE,
      showStaffDialog: false, //置业顾问弹窗
      curNodeData: null,
      showAddRoom: false,
      areas: [],
      storeApiUrl: constants.Api.store.storeList,
      pickerStartTime: {
        disabledDate: time => {
          let yesterDay = new Date();
          yesterDay.setTime(yesterDay.getTime() - 3600 * 1000);
          return time.getTime() < yesterDay;
        }
      },
      limit: 5,
      tag1Enum,
      goodsTypeEnum,
      isEdit: false,
      showForm: false,
      showEditLabelPopup: false, //是否显示编辑标签弹框
      editTitle: '', //编辑标签弹框标题
      labelEditObj: {}, //用于传给子组件的新增的标签对象

      form: {
        itemDetailDTO: {
          wxItem: {
            type: goodsTypeEnum.estate.value,
            name: '',
            subName: '',
            store: null,
            area: [],
            provinceId: null, //省份
            cityId: null, //城市
            districtId: null, //区
            province: null, //省份
            city: null, //城市
            district: null, //区
            longitude: null, //经度
            latitude: null, //纬度
            address: '', // 详细地址
            openTime: '', //开盘时间
            labelIds: [], //楼盘标签
            buildArea: '', // 建筑面积
            estateType: '',
            developers: '', // 开发商
            salesCall: '', // 售楼电话
            volumeRatio: '', // 容积率
            greenRatio: '', // 绿化率
            fyszd: '', // 预售许可证
            profiles: '', // 楼盘简介
            averagePrice: '', // 楼盘均价
            recognitionOfGold: '', // 认筹金
            salePrice: '', //售价，由于售价是必填，所以需要把均价同时写入售价
            labelPrice: '', //标价，由于标价是必填，所以需要把均价同时写入标价
            rangeDTOList: [], // 苑区列表
            staffList: [] //置业顾问
          },
          materialsId: [],
          materialUrls: []
        },
        multiAttrParentOptions: [],
        disableAddSkuTree: { disable: false }
      },

      // form表单校验规则
      rules: {
        itemDetailDTO: {
          materialsId: [
            {
              required: true,
              validator: regex.goods.checkGoodsMaterialsId,
              trigger: 'change'
            }
          ],
          wxItem: {
            name: [
              { required: true, message: '请输入楼盘名称', trigger: ['blur', 'change'] },
              {
                min: 1,
                max: 80,
                message: '长度在 1 到 80 个字符',
                trigger: ['blur', 'change']
              }
            ],
            subName: [
              {
                min: 1,
                max: 80,
                message: '长度在 1 到 80 个字符',
                trigger: ['blur', 'change']
              }
            ],
            store: [{ required: true, message: '请选择楼盘所属区域', trigger: 'change' }],
            area: [{ required: true, message: '请选择楼盘地址', trigger: 'change' }],
            address: [{ required: true, message: '请输入详细地址地址', trigger: ['blur', 'change'] }],
            openTime: [{ required: true, message: '请输入开盘时间', trigger: 'change' }],
            fyszd: [{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: ['blur', 'change'] }],
            averagePrice: [
              {
                required: true,
                validator: regex.checkPrice('请输入楼盘均价', true),
                trigger: ['blur', 'change']
              }
            ],
            recognitionOfGold: [
              {
                required: true,
                validator: regex.checkPrice('请输入认筹金', true),
                trigger: ['blur', 'change']
              }
            ],
            rangeDTOList: [
              {
                required: true,
                validator: checkRangeDTOList.bind(this),
                trigger: ['blur', 'change']
              }
            ],
            staffList: [
              {
                required: true,
                validator: checkStaffList,
                trigger: 'change'
              }
            ]
          }
        }
      }
    };
  },

  computed: {
    maxLength() {
      if (this.isXiCha) {
        this.limit = 15;
        return 15;
      } else {
        this.limit = 5;
        return 5;
      }
    },
    goodsImgCountLimit() {
      return function(index) {
        if (this.isXiCha) {
          return index < 15;
        } else {
          return index < 5;
        }
      };
    },
    activityList() {
      const item = this.form.itemDetailDTO.wxItem;
      const preSell = item.preSell;
      const group = item.pt;
      const cutPrice = item.bargain;
      const seckill = item.seckill;
      const integralItem = item.integralItem;

      if (preSell || group || cutPrice || seckill || integralItem) {
        return true;
      }
      return false;
    },
    ...mapState({
      env: 'env'
    }),
    appendLabel() {
      return node => {
        switch (node.data.type) {
          case GARDEN_TYPE.garden:
            return '添加楼栋';
          case GARDEN_TYPE.building:
            return '添加单元';
          case GARDEN_TYPE.unit:
            return '添加房间';
          default:
            return '';
        }
      };
    },
    nodeLabel() {
      return node => {
        switch (node.data.type) {
          case GARDEN_TYPE.garden:
            return '苑区';
          case GARDEN_TYPE.building:
            return '楼栋';
          case GARDEN_TYPE.unit:
            return '单元';
          default:
            return '';
        }
      };
    },
    showAppendLabel() {
      return node => {
        switch (node.data.type) {
          case GARDEN_TYPE.garden:
          case GARDEN_TYPE.building:
          case GARDEN_TYPE.unit:
            return true;
          default:
            return false;
        }
      };
    },
    showDeleteLabel() {
      return node => {
        switch (node.data.type) {
          case GARDEN_TYPE.garden:
          case GARDEN_TYPE.building:
          case GARDEN_TYPE.unit:
            return true;
          default:
            return false;
        }
      };
    },
    isRoom() {
      return node => {
        return node.data.type === GARDEN_TYPE.room;
      };
    },
    profilesRemnantCount() {
      const profiles = this.form.itemDetailDTO.wxItem.profiles;
      const length = profiles ? profiles.length : 0;
      return 100 - length;
    }
  },

  // 监听器
  watch: {
    // 监听苑区列表的变化实时校验苑区列表输入的参数是否正确
    'form.itemDetailDTO.wxItem.rangeDTOList': {
      deep: true,
      handler() {
        this.$refs.form.validateField('itemDetailDTO.wxItem.rangeDTOList');
      }
    }
  },

  mounted() {
    this.isEdit = !!this.$route.query.itemNo;
    if (this.$route.query.itemNo) {
      this.getGoodsDetail();
    } else {
      this.initGoodsMaterials();
      this.showForm = true;
      this.initMap();
      this.initAddressArea();
    }

    //获取连接上的标签类型
    const labelType = parseInt(this.$route.query.labelType);
    if (labelType || labelType === 0) {
      this.labelType = labelType; //将获取到的类型传给标签select下拉子组件
      this.labelEditObj.labelType = labelType; //将获取到的类型传给标签标签dialog对话框子组件
    }
  },
  methods: {
    initAddressArea() {
      this.fetchAreas().done(() => {
        this.fetchInitAreas(0, this.form.itemDetailDTO.wxItem.area);
        this.filtration(this.form);
      });
    },
    handleItemChange(ids) {
      if (ids && ids.length) {
        this.fetchAreas(ids[ids.length - 1]);
      }
    },

    handleChange() {
      const areas = this.getPath(this.form.itemDetailDTO.wxItem.area || []);
      this.form.itemDetailDTO.wxItem.province = areas[0] ? areas[0].name : '';
      this.form.itemDetailDTO.wxItem.city = areas[1] ? areas[1].name : '';
      this.form.itemDetailDTO.wxItem.district = areas[2] ? areas[2].name : '';
      let address = '中国';
      areas.forEach(item => {
        if (item.name !== '北京' && item.name !== '天津' && item.name !== '上海' && item.name !== '重庆') {
          address += item.name;
        }
      });
      this.onLocationLatLng(address);
    },

    initMap() {
      //初始化地图
      DssMap.initMap({
        htmlId: 'id_for_map',
        onClickMap: this.onClickMap,
        onMapLocation: this.onMapLocation,
        installSearchInvoke: this.installSearchInvoke,
        onCityLocation: this.onCityLocation,
        Circle: this.Circle
      });
    },

    Circle(callback) {
      this.doCircle = callback;
      this.setCenter();
    },

    //初始化时利用画圆方法来设置地图中心位置
    setCenter() {
      let latLng = {
        lat: parseFloat(this.form.itemDetailDTO.wxItem.latitude),
        lng: parseFloat(this.form.itemDetailDTO.wxItem.longitude)
      };
      if (this.form.itemDetailDTO.wxItem.latitude && this.form.itemDetailDTO.wxItem.longitude) {
        DssMap.locationLatLng(latLng);
        this.doCircle(latLng, 0, true);
      }
    },

    installSearchInvoke(callback) {
      this._searchInvoke = callback;
    },

    //获取省市区
    onCityLocation(addressComponents) {
      if (!this.form.itemDetailDTO.wxItem.province) {
        const { city, district, province } = addressComponents;
        this.form.itemDetailDTO.wxItem.province = province;
        this.form.itemDetailDTO.wxItem.city = city;
        this.form.itemDetailDTO.wxItem.district = district;
        this.filtration(addressComponents);
      }
    },

    //下拉框地址选择
    onAdressSelect(value) {
      this.form.address = value.address;
      DssMap.locationLatLng(value.latLng);
      DssMap.getCityLocation(value.latLng);
      this.doCircle(value.latLng, 0, true);
    },

    //地址检索，获取多个地址信息
    querySearch(keyWord, callback) {
      if (!!this._searchInvoke && keyWord) {
        const areas = this.getPath(this.form.itemDetailDTO.wxItem.area || []);
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
              let address = poi[0];
              DssMap.locationLatLng(address.latLng);
              DssMap.getCityLocation(address.latLng);
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

    //地址检索
    onLocationLatLng(address) {
      this._searchInvoke(address || this.form.address).then(poi => {
        if (!!poi) {
          let item = poi[0];
          DssMap.locationLatLng(item.latLng);
        }
      });
    },

    //点击地图回调
    onClickMap(latitude, longitude) {
      this.form.itemDetailDTO.wxItem.latitude = latitude;
      this.form.itemDetailDTO.wxItem.longitude = longitude;
    },

    //地图位置信息定为后回调
    onMapLocation(address, addressComponents) {
      this.form.address = address;
      const { city, district, province } = addressComponents;
      this.form.itemDetailDTO.wxItem.province = province;
      this.form.itemDetailDTO.wxItem.city = city;
      this.form.itemDetailDTO.wxItem.district = district;
      this.filtration(addressComponents);
    },
    //直辖市和特别行政区数据过滤
    filtration(data) {
      const { province, city, district } = data;
      let area = [province, city, district];
      if (province === '中国') {
        if (city === '北京市' || city === '天津市' || city === '上海市' || city === '重庆市') {
          area[0] = area[1].replace('市', '');
        } else {
          area.splice(0, 1);
        }
      }
      if (city == '澳门特别行政区' && (district === '凼仔' || district === '路凼城')) {
        area[1] = area[1].replace('凼', '氹');
        this.form.itemDetailDTO.wxItem.address = this.form.address.replace('凼', '氹');
        this.form.itemDetailDTO.wxItem.district = district.replace('凼', '氹');
      }
      this.form.itemDetailDTO.wxItem.province = area[0];
      this.form.itemDetailDTO.wxItem.city = area[1];
      this.form.itemDetailDTO.wxItem.district = area[2];

      this.fetchNameAreas(0, this.areas, area);
    },
    //根据省市区名称渲染区域地址框数据
    fetchNameAreas(index, list, areaNames) {
      if (index >= areaNames.length - 1 || index >= 2) {
        // 超过数组和3级节点，不加载
        this.form.itemDetailDTO.wxItem.area = this.getNameId(areaNames);
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
    //根据省市区名称查询id
    getNameId(areaNames) {
      let areaIds = [];
      let list = this.areas;
      areaNames.forEach(name => {
        if (list) {
          let current = list.find(item => item.name === name);
          if (!current) {
            return areaIds;
          }
          areaIds.push(current.id);
          list = current.childNode;
        }
      });
      return areaIds;
    },
    //初始化区域数据格式
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

    //获取区域数据
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

    //查询下级市区
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

    // 获取楼盘详情
    getGoodsDetail() {
      const params = {
        itemNo: this.$route.query.itemNo,
        status: 1
      };
      services
        .get(constants.Api.goods.detail, {
          params,
          action: '楼盘详情'
        })
        .done(res => {
          this.showForm = true;
          this.convertMoneyUnit(res.data, true);
          //结构只能解构一层，多一层的要多结构一次
          if (res.data && res.data.wxItem) {
            res.data.wxItem = { ...this.form.itemDetailDTO.wxItem, ...res.data.wxItem };
            const { rangeDTOList, staffList } = res.data.wxItem;
            const { provinceId, cityId, districtId } = res.data.wxItem;
            res.data.wxItem.area = [provinceId, cityId, districtId];
            res.data.wxItem.rangeDTOList = rangeDTOList || [];
            res.data.wxItem.staffList = staffList || [];
            if (res.data.wxItem.storeId) {
              res.data.wxItem.store = {
                id: res.data.wxItem.storeId,
                name: res.data.wxItem.storeName
              };
            }

            // 开盘时间数据格式转化
            if (res.data.wxItem.openingTime) {
              res.data.wxItem.openTime = utils.date.format(
                new Date(res.data.wxItem.openingTime),
                'YYYY-MM-DD HH:mm:ss'
              );
            }

            if (res.data.wxItem.labelIds) {
              res.data.wxItem.labelIds = res.data.wxItem.labelIds.split(',').map(id => {
                return parseInt(id);
              });
            } else {
              res.data.wxItem.labelIds = [];
            }
            this.parseGardenRangeList(res.data.wxItem.rangeDTOList);
          }
          this.form.itemDetailDTO = { ...this.form.itemDetailDTO, ...res.data };

          this.initGoodsMaterials();

          this.initMap();
          this.initAddressArea();
        });
    },
    /**
     * 解析楼盘苑区数据，添加房间号
     */
    parseGardenRangeList(rangeDTOList) {
      if (rangeDTOList && rangeDTOList.length) {
        rangeDTOList.forEach(range => {
          if (range.rangeDTOList) {
            this.parseGardenRangeList(range.rangeDTOList);
          } else if (range.type === GARDEN_TYPE.unit) {
            this.assembleRooms(range.storeyNum, range.roomNum, range);
          }
        });
      }
    },

    /**
     * 钱的单位转换 ,服务端返回的为分， 交互展示的为元
     * @param itemDetailDTO
     * @param isFromServer 是否转换服务端返回的数据，否则转换页面提交服务的数据
     */
    convertMoneyUnit(itemDetailDTO, isFromServer) {
      if (!itemDetailDTO) {
        return;
      }
      //转换函数
      let convert = isFromServer
        ? v => {
            return moneyUtil.convertHundredMoneyUnit(v, true);
          }
        : v => {
            return moneyUtil.convertHundredMoneyUnit(v, false);
          };
      //salePrice:售价 , freight: 运费
      if (!!itemDetailDTO.wxItem) {
        itemDetailDTO.wxItem.averagePrice = convert(itemDetailDTO.wxItem.averagePrice);
        itemDetailDTO.wxItem.recognitionOfGold = convert(itemDetailDTO.wxItem.recognitionOfGold);
        //把认筹金同时写入售价和标价，因为后端这两个字段做了强校验
        itemDetailDTO.wxItem.salePrice = itemDetailDTO.wxItem.recognitionOfGold;
        itemDetailDTO.wxItem.labelPrice = itemDetailDTO.wxItem.recognitionOfGold;
      }
    },

    getLimit() {
      this.limit = this.maxLength - this.form.itemDetailDTO.materialsId.length + 1;
    },

    // 添加楼盘图片
    onImageAdd(index) {
      //多选返回的是图片数组，遍历数组
      if (index === this.form.itemDetailDTO.materialsId.length - 1) {
        const deletedUrl = this.form.itemDetailDTO.materialsId.splice(index, 1);
        deletedUrl[0].forEach(item => {
          if (this.form.itemDetailDTO.materialsId.length < 5) {
            this.form.itemDetailDTO.materialsId.push(item);
          }
        });
        index = this.form.itemDetailDTO.materialsId.length - 1;
      } else {
        this.form.itemDetailDTO.materialUrls[index] = this.form.itemDetailDTO.materialsId[index].imgUrl;
      }
      this.addWaitUploadImage(this.form.itemDetailDTO.materialsId, this.form.itemDetailDTO.materialUrls, index);
      this.getLimit();
    },
    // 更新图片列表
    addWaitUploadImage(materialsId, materialUrls, index) {
      if (utils.isUndefined(index) || index === materialsId.length - 1) {
        materialUrls.push('');
        materialsId.push({
          id: 0,
          imgUrl: ''
        });
      }
    },

    // 删除图片
    onDeleteImg(index) {
      this.form.itemDetailDTO.materialsId.splice(index, 1);
      this.form.itemDetailDTO.materialUrls.splice(index, 1);
      this.getLimit();
    },

    //初始化 楼盘图片素材
    initGoodsMaterials() {
      let materialsId = this.form.itemDetailDTO.materialsId ? this.form.itemDetailDTO.materialsId : [];
      let newUrls = [];
      let materialUrls = this.form.itemDetailDTO.materialUrls;

      if (materialUrls && materialUrls.length) {
        materialUrls.forEach((imgUrl, index) => {
          if (!!imgUrl) {
            materialsId[index] = {
              id: materialsId[index],
              imgUrl: imgUrl
            };
            newUrls.push(imgUrl);
          }
        });
        materialUrls = newUrls;
      }

      this.addWaitUploadImage(materialsId, materialUrls);
      this.getLimit();
      this.form.itemDetailDTO.materialsId = materialsId;
      this.form.itemDetailDTO.materialUrls = materialUrls;
    },

    handleAddGardens() {
      this.form.itemDetailDTO.wxItem.rangeDTOList.push({
        type: GARDEN_TYPE.garden,
        name: ''
      });
    },

    appendNode(node, data) {
      let msgType = null;
      const newChild = { name: '', rangeDTOList: [] };
      switch (data.type) {
        case GARDEN_TYPE.garden:
          newChild.type = GARDEN_TYPE.building;
          msgType = '苑区';
          break;
        case GARDEN_TYPE.building:
          newChild.type = GARDEN_TYPE.unit;
          newChild.storeyNum = '';
          newChild.roomNum = '';
          msgType = '楼栋';
          break;
        case GARDEN_TYPE.unit:
          newChild.type = GARDEN_TYPE.room;
          this.curNodeData = data;
          this.showAddRoom = true;
          msgType = '单元';
          return;
      }

      // 判断是否允许添加下一项
      if (!data.name) {
        return this.$message.error('请输入' + msgType + '名称');
      } else if (data.name.length > 10) {
        return this.$message.error('请输入10个字符以内的' + msgType + '名称');
      }

      if (!data.rangeDTOList) {
        this.$set(data, 'rangeDTOList', []);
      }
      data.rangeDTOList.push(newChild);
    },
    handleAddRoom() {
      const { storeyNum, roomNum } = this.curNodeData;
      this.assembleRooms(storeyNum, roomNum, this.curNodeData);
      this.showAddRoom = false;
    },
    assembleRooms(storeyNum, roomNum, data) {
      if (!data.rangeDTOList) {
        this.$set(data, 'rangeDTOList', []);
      } else {
        data.rangeDTOList = [];
      }
      for (let storey = 1; storey <= parseInt(storeyNum); storey++) {
        const storeyObj = {
          name: storey + '层',
          rooms: [],
          type: GARDEN_TYPE.room
        };
        for (let room = 1; room <= parseInt(roomNum); room++) {
          if (room < 10) {
            storeyObj.rooms.push(`${storey}0${room}`);
          } else {
            storeyObj.rooms.push(`${storey}${room}`);
          }
        }
        data.rangeDTOList.push(storeyObj);
      }
    },

    removeNode(node) {
      const parent = node.parent;
      const children = parent.data.rangeDTOList || parent.data;
      const childNodes = parent.childNodes;
      const childIndex = childNodes.findIndex(child => child.id === node.id);
      children.splice(childIndex, 1);
      this.$refs.form.validateField('itemDetailDTO.wxItem.rangeDTOList');
    },

    onStaffChoosed(staffList) {
      this.form.itemDetailDTO.wxItem.staffList = staffList;
      this.$refs.form.validateField('itemDetailDTO.wxItem.staffList');
    },
    handleDelStaffItem(couponItem) {
      this.form.itemDetailDTO.wxItem.staffList.splice(this.form.itemDetailDTO.wxItem.staffList.indexOf(couponItem), 1);
      this.$refs.form.validateField('itemDetailDTO.wxItem.staffList');
    },

    // 保存楼盘
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.$plain(this.form.itemDetailDTO);
          const materialsId = params.materialsId.slice();
          delete params.materialsId;

          //门店
          params.wxItem.storeId = params.wxItem.store.id;
          params.wxItem.storeName = params.wxItem.store.name;
          delete params.wxItem.store;

          // 将开盘时间转化为毫秒值传给服务端保存
          params.wxItem.openingTime = new Date(params.wxItem.openTime).getTime();
          delete params.wxItem.openTime;

          //标签id
          if (params.wxItem.labelIds && params.wxItem.labelIds.length) {
            params.wxItem.labelIds = params.wxItem.labelIds.join(',');
          } else {
            params.wxItem.labelIds = '';
          }

          //materialsId 使用 id填充 && materialUrls 去空
          materialsId.forEach(item => {
            if (item && item.id && params.materialUrls.indexOf(item.imgUrl) === -1) {
              params.materialUrls.push(item.imgUrl);
            }
          });
          params.materialUrls = params.materialUrls.filter(url => {
            return !!url;
          });

          const url = this.$route.query.itemNo ? constants.Api.goods.update : constants.Api.goods.add;
          this.convertMoneyUnit(params, false);

          //省市区id
          params.wxItem.provinceId = params.wxItem.area[0];
          params.wxItem.cityId = params.wxItem.area[1];
          params.wxItem.districtId = params.wxItem.area[2];
          delete params.wxItem.area;

          services
            .post(url, params, {
              headers: {
                'Content-Type': 'application/json'
              },
              transformRequest: function(data, config, test) {
                return JSON.stringify(data);
              },
              action: '添加楼盘'
            })
            .done(res => {
              this.$router.back();
            });
        } else {
          return false;
        }
      });
    },

    //选中的标签
    selectedLabelId(labelIds) {
      this.form.itemDetailDTO.wxItem.labelIds = labelIds;
    },

    //打开快速增加标签弹窗
    addLabelPopup() {
      this.showEditLabelPopup = true;
      this.editTitle = '快速增加标签';
    },

    //监控子组件发射回来的方法，以便于新增标签之后刷新数据
    refreshData(data) {
      //将获取到的选中的标签对象赋值
      this.form.itemDetailDTO.wxItem.labelIds.push(data.labelId);
      this.$refs.labelCascader.labelList(); //父组件通知标签列表组件刷新数据
    }
  }
};
</script>

<style lang="less">
.goods-add-container {
  .dss-map {
    width: 600px;
    height: 400px;
    font-size: 12px;
  }

  .profiles {
    position: relative;
  }
  .profiles-tips {
    position: absolute;
    bottom: 0;
    right: 10px;
  }

  .map-latitude {
    position: absolute;
    top: 0;
    left: 625px;
    text-align: left;
    width: 200px;
  }

  .garden-tree {
    width: 600px;
    border-bottom: 1px solid #dcdee0;

    .custom-tree-node {
      position: relative;
      width: 100%;
      .room-box {
        display: inline-block;
        width: calc(100% - 70px);
        white-space: initial;
        margin-left: 60px;
      }

      .el-input {
        width: auto;

        .el-input__inner {
          width: 200px;
          height: 22px;
          line-height: 22px;
          border: none;
          cursor: pointer;
        }

        .el-input__inner:hover {
          background: #e4e4e4;
        }

        .el-input__inner:focus {
          border: 1px solid #256eff;
          background: #ffffff;
          cursor: auto;
        }
      }

      .room-num {
        position: absolute;
        margin: auto 0;
        top: 0;
        bottom: 0;
        height: 22px;
        line-height: 22px;
      }
      .room-label {
        display: inline-block;
        width: 60px;
        text-align: center;
      }
    }

    .node-option {
      position: absolute;
      right: 10px;
    }

    .el-tree-node__content {
      border-left: 1px solid #dcdee0;
      border-right: 1px solid #dcdee0;
      height: fit-content;
    }
  }
}
</style>
