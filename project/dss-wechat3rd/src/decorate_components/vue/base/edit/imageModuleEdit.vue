<template>
  <div class="wd-image-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="图片"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource" v-if="!dataSource.isMineCenter"></size>
      <div class="com-row" style="position: relative">
        <span class="com-column input-title">图片高度：</span>
        <span class="com-column">
          <el-input-number
            style="width: 160px"
            class="com-input com-input-number"
            :min="10"
            :max="1500"
            controls-position="right"
            type="number"
            v-model="imgHeight"
          />
        </span>
        <div style="color: #858c99; font-size: 12px; font-weight: 400; padding-left: 80px; padding-top: 2px">
          建议高度300
        </div>
        <span class="height-px">px</span>
      </div>

      <!--已存在图片的预览-->
      <div class="image-container image-container-preview">
        <dnd-container class="images-draggable" group-name="images-draggable" @drop="onDrop($event)">
          <dnd-draggable v-for="(item, index) in dataSource.data" :key="index">
            <div class="img-preview1" style="margin: 20px 0">
              <i class="com-close" @click="deteleImage(item)"></i>

              <div class="nav-row">
                <!-- <span class="nav-column">图片：</span> -->
                <div class="nav-column">
                  <div
                    class="img"
                    :style="{ 'background-image': 'url(' + item.src + ')' }"
                    @click="editImage(index)"
                  ></div>
                </div>
              </div>

              <div class="link-container">
                <div class="nav-row" style="margin-top: -5px">
                  <span class="nav-column link-title">链接：</span>
                  <div class="nav-column info">
                    <div v-if="!item.linkPage">
                      <!-- <el-cascader
                        expand-trigger="hover"
                        :options="linkPages"
                        @change="e => handleChange(e, item)"
                      ></el-cascader> -->
                      <select-link :link-pages="linkPages" @confirm="e => handleChange(e, item)"></select-link>
                    </div>
                    <div v-else class="link-page">
                      <div class="link-page-name">{{ item.linkName }}</div>
                      <div class="delete" @click="deleteItemLinkPage(item)"></div>
                    </div>
                  </div>
                </div>

                <!-- <div class="nav-row"> -->
                <div class="nav-row" v-if="item.linkType && item.linkId">
                  <span class="nav-column">{{ item.tips }}：</span>
                  <div class="nav-column">
                    <template v-if="!!item.detailUrl">
                      <div
                        class="detail-image"
                        :style="{ background: 'transparent url(' + item.detailUrl + ') no-repeat center / cover' }"
                      >
                        <div class="delete" @click="deleteDetail(item)"></div>
                      </div>
                    </template>
                    <template v-else-if="!!item.detailText">
                      <div class="link-detail-text">
                        <div>{{ item.detailText }}</div>
                        <div class="delete" @click="deleteDetail(item)"></div>
                      </div>
                    </template>
                    <div class="dss-link1" v-else @click="chooseDetail(item.linkId, index)">选择{{ item.tips }}</div>
                  </div>
                </div>
                <!-- 腾讯珊瑚url -->
                <div class="nav-row" v-if="item.linkPage === 'coral-url'">
                  <span class="nav-column link-title">url：</span>
                  <span class="nav-column">
                    <el-input v-model="item.linkId" style="width: 150px" placeholder="腾讯珊瑚url" />
                  </span>
                </div>
                <!-- 24好玩游戏url -->
                <div class="nav-row" v-if="item.linkPage === '24haowan-url'">
                  <span class="nav-column link-title">url：</span>
                  <span class="nav-column">
                    <el-input v-model="item.linkId" style="width: 150px" placeholder="游戏url" />
                  </span>
                </div>

                <!--图片轮播图时间设定-->
                <div class="timer-limit" v-if="item.timerLimit && timerLimitShow">
                  <el-checkbox v-model="item.timerLimit.showTimeLimit">自定义展示时间</el-checkbox>
                  <div v-if="item.timerLimit.showTimeLimit" style="margin-top: 10px">
                    <el-checkbox v-model="item.timerLimit.dateLimit">日期</el-checkbox>
                    <div style="margin-top: 5px">
                      <el-date-picker
                        v-model="item.timerLimit.dateRange.start"
                        size="mini"
                        align="right"
                        type="date"
                        unlink-panels
                        :clearable="false"
                        class="date-pick"
                        placeholder="请选择"
                        :disabled="!item.timerLimit.dateLimit"
                        :picker-options="datePickerOptions"
                      ></el-date-picker>
                      <span class="until">至</span>
                      <el-date-picker
                        v-model="item.timerLimit.dateRange.end"
                        size="mini"
                        align="right"
                        type="date"
                        unlink-panels
                        :clearable="false"
                        class="date-pick"
                        placeholder="请选择"
                        :disabled="!item.timerLimit.dateLimit"
                        :picker-options="datePickerOptions"
                      ></el-date-picker>
                    </div>
                    <div class="duration-box" v-for="(duration, durIndex) in item.timerLimit.durations" :key="durIndex">
                      <i class="com-close" v-if="durIndex !== 0" @click="handleDelDuration(index, durIndex)"></i>
                      <el-checkbox v-model="duration.weekLimit">周日~周六</el-checkbox>
                      <el-select
                        v-model="duration.weeks"
                        size="mini"
                        multiple
                        collapse-tags
                        :disabled="!duration.weekLimit"
                        style="margin-top: 5px"
                        placeholder="请选择"
                      >
                        <el-option
                          class="select-option"
                          v-for="week in weekOptions"
                          :key="week.value"
                          :label="week.label"
                          :value="week.value"
                        ></el-option>
                      </el-select>
                      <el-checkbox v-model="duration.timeLimit" style="margin-top: 10px">限制时间</el-checkbox>
                      <div style="margin-top: 5px" v-for="(timeItem, timeIndex) in duration.timeList" :key="timeIndex">
                        <el-time-picker
                          size="mini"
                          class="time-pick"
                          arrow-control
                          :clearable="false"
                          :disabled="!duration.timeLimit"
                          v-model="timeItem.timeRange.start"
                          placeholder="请选择"
                        ></el-time-picker>
                        <span class="until">至</span>
                        <el-time-picker
                          size="mini"
                          arrow-control
                          :clearable="false"
                          :disabled="!duration.timeLimit"
                          class="time-pick"
                          v-model="timeItem.timeRange.end"
                          placeholder="请选择"
                        ></el-time-picker>
                        <i class="time-del-icon" v-if="timeIndex !== 0" @click="handleDelTime(duration, timeIndex)"></i>
                      </div>
                      <div class="add-week-limit-box" style="margin-right: 40px">
                        <span @click="handleAddTime(duration)" class="add-btn">+增加</span>
                      </div>
                    </div>
                    <div class="add-week-limit-box">
                      <span @click="handleAddDuration(index)" class="add-btn">+增加</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dnd-draggable>
        </dnd-container>
      </div>

      <div class="com-row">
        <span class="com-column">上传图片：</span>
        <span class="com-column">
          <div class="theme-img">
            <div class="add-img" @click="addImage">
              <i class="el-icon-plus"></i>
            </div>
            <div class="theme-img-operate">
              <div class="operate-box">
                <a class="label-color">添加图片</a>
              </div>
              <span style="font-size: 12px" class="label-color"
                >建议尺寸{{ dataSource.isMineCenter ? 690 : 750 }}*300</span
              >
            </div>
          </div>
        </span>
      </div>
    </div>
    <!--点击上传图片-->
    <!-- <div class="one-row-upload">
      <a class="dss-link" @click="addImage">+添加图片</a>
      <div>建议尺寸{{ dataSource.isMineCenter ? 690 : 750 }}*300</div>
    </div> -->

    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :limit="10"
      :multiple="isAdd"
      :visible.sync="visibleUpload"
    />

    <select-dialog
      v-model="detailDialog"
      @choosed="onChooseGoods"
      :enable-multiple="false"
      :goods-type="detailType"
      :is-area-manger="isAreaManger"
      :show-label="showLabel"
      :filter-list="filterList"
      :title="'选择' + detailType.label"
    ></select-dialog>
  </div>
</template>

<script>
  // import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import navParamsAssember from '../../../utils/nav-params-assember';
  import size from './size.vue';
  import './css/common.less';
  import './css/imageModuleEdit.less';
  import './css/select-detail.less';
  import { mapState } from 'vuex';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import EditHeader from './edit-header.vue';
  import SelectLink from '@/dss-wechat3rd/src/components/select-link/index.vue';
  import FilterDataMixin from '../../../mixins/filter-data-mixin';

  const datePickerOptions = {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        },
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
        },
      },
      {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
        },
      },
    ],
  };

  const weekOptions = [
    { label: '周日', value: 0 },
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
  ];

  export default {
    name: 'ImageModuleEdit',
    mixins: [FilterDataMixin],
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      MaterialsImage,
      selectDialog,
      size,
      'dnd-container': Container,
      'dnd-draggable': Draggable,
      EditHeader,
      SelectLink,
    },

    data() {
      return {
        datePickerOptions,
        weekOptions,
        linkPages: [],
        imgHeight: 0,

        visibleUpload: false,
        detailDialog: false,
        detailType: goodsTypeEnum.product,
        editIndex: 0,

        timerLimitShow: false, // 图片轮播图时间设定显示

        showLabel: false,
        filterList: [
          {
            type: 'select', // 选择器类型
            label: '活动类型',
          },
        ],
        imgIndex: 0,
        isAdd: true,
      };
    },

    computed: {
      ...mapState({
        customPages: 'customPages',
        linkedPages: 'linkedPages',
        appFeatures: 'appFeatures',
        roleList: 'roleList',
        curApp: 'curApp',
      }),
      // 区域管理员
      isAreaManger() {
        return (
          (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
            !!~this.roleList.split(',').indexOf('common_role_dealer_manager')) &&
          !!this.curApp.canCustomDecorate
        );
      },
    },

    mounted() {
      navParamsAssember.initLinkPages.bind(this)(true);
      // 判断是否要显示图片轮播图时间设定
      if (this.appFeatures) {
        if (this.appFeatures.indexOf('baijia') === 0) {
          this.timerLimitShow = true;
        }
      }
      this.imgHeight = this.dataSource.height;
    },

    watch: {
      imgHeight(newVal) {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.height = newVal;
      },
    },

    methods: {
      initDuration() {
        return {
          weekLimit: true,
          weeks: [],
          timeLimit: true,
          timeList: [this.initTimeRange()],
        };
      },
      initTimeRange() {
        return { timeRange: { start: '', end: '' } };
      },
      handleAddDuration(dataIndex) {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data[dataIndex].timerLimit.durations.push(this.initDuration());
      },
      handleDelDuration(dataIndex, durIndex) {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data[dataIndex].timerLimit.durations.splice(durIndex, 1);
      },
      handleAddTime(duration) {
        duration.timeList.push(this.initTimeRange());
      },
      handleDelTime(duration, timeIndex) {
        duration.timeList.splice(timeIndex, 1);
      },
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(images) {
        if (this.isAdd) {
          const objs = [];

          images.forEach(item => {
            const obj = {
              src: item.imgUrl,
              linkPage: '',
              linkName: '',
              linkType: 0,
              timerLimit: {
                showTimeLimit: false,
                dateLimit: false,
                dateRange: { start: '', end: '' },
                durations: [this.initDuration()],
              },
            };
            objs.push(obj);
          });
          // eslint-disable-next-line vue/no-mutating-props
          this.dataSource.data = this.dataSource.data.concat(objs);
        } else {
          const index = this.imgIndex;
          const item = this.dataSource.data[index];

          item.src = images.imgUrl;
          this.$set(this.dataSource.data, index, item);
        }
        this.visibleUpload = false;
      },

      addImage() {
        this.isAdd = true;
        this.visibleUpload = true;
      },

      editImage(index) {
        this.imgIndex = index;
        this.isAdd = false;
        this.visibleUpload = true;
      },

      handleChange(choosedVals, item) {
        if (!choosedVals || !choosedVals.length) return;
        navParamsAssember.handleChangeLinkPage.bind(this)(choosedVals, item);
      },
      // 删除图片对应链接
      deleteItemLinkPage(item) {
        item.linkPage = '';
        item.linkName = '';
        this.$set(item, 'detailUrl', null);
        this.$set(item, 'detailText', null);
        this.$set(item, 'detailId', null);
        this.$set(item, 'linkType', null);
      },

      // 点击选择图片对应的详情
      chooseDetail(id, index) {
        this.detailType = goodsTypeEnum[id];
        this.editIndex = index;
        this.detailDialog = true;

        switch (this.detailType.type) {
          case 'haggle':
            this.filterList[0].paramName = 'createStoreId';
            this.filterList[0].selectOptions = [
              { label: '品牌活动', value: 0 },
              { label: '门店活动', value: 1 },
            ];
            break;
          case 'seckill':
          case 'group':
            this.filterList[0].paramName = 'activityLevel';
            this.filterList[0].selectOptions = [
              { label: '品牌活动', value: 1 },
              { label: '门店活动', value: 10 },
            ];
            break;
          case 'merchant':
            this.filterList = [
              {
                type: 'input',
                paramName: 'name',
                label: '关键字',
                showFormLabel: true,
              },
              {
                type: 'select',
                paramName: 'merchantStoreId',
                label: '项目：',
                showFormLabel: true,
                selectOptions: this.storeOptions,
              },
              {
                type: 'select',
                paramName: 'tenantCategoryId',
                label: '经营类目',
                showFormLabel: true,
                selectOptions: this.categoryOptions,
              },
            ];
            break;
        }
      },

      // 图片选择对应的详情
      onChooseGoods(val) {
        navParamsAssember.getNavLinkParams.bind(this)(this.dataSource.data[this.editIndex], val);
      },

      // 删除图片对应的详情
      deleteDetail(item) {
        item.detailId = '';
        item.detailUrl = '';
        item.detailText = '';
        this.detailDialog = false;
      },

      // 删除图片
      deteleImage(val) {
        this.dataSource.data.slice().forEach((item, index) => {
          if (val == item) {
            // eslint-disable-next-line vue/no-mutating-props
            this.dataSource.data.splice(index, 1);
          }
        });
      },

      // 拖拽图片
      onDrop(dropResult) {
        const { removedIndex, addedIndex } = dropResult;

        // 不需要处理的情况
        if (!removedIndex && !addedIndex) {
          return false;
        }

        // eslint-disable-next-line vue/no-mutating-props
        const addImage = this.dataSource.data.splice(removedIndex, 1)[0];

        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data.splice(addedIndex, 0, addImage);
      },
    },
  };
</script>

<style lang="less" scoped>
  .images-draggable {
    .img-preview1 {
      margin: 0;
      cursor: move;
    }

    .img {
      cursor: pointer;
    }
  }
</style>
