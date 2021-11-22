<template>
  <div>
    <!-- <div class="com-title"><span>专题活动</span></div> -->
    <edit-header :data-source="dataSource" name="专题活动"></edit-header>

    <div class="com-body">
      <div class="com-row">
        <span class="com-column title">选择活动：</span>
        <span class="com-column">
          <div class="theme-img" v-if="!dataSource.activityId">
            <div class="add-img" @click="showDialog = true">
              <i class="el-icon-plus"></i>
            </div>
            <div class="theme-img-operate">
              <span style="font-size: 12px" class="label-color">请选择活动</span>
            </div>
          </div>

          <!-- <span class="com-upload-button"
                @click="showDialog=true"
                v-if="!dataSource.activityId"></span> -->
          <div v-else class="topicName-button">
            <div class="delete" @click="deleteActivity"></div>
            <img class="topic-img" :src="dataSource.data.topicImgUrl" alt="" />
            <span>{{ dataSource.data.topicName }}</span>
          </div>
        </span>
      </div>
      <decorate-size :data-source="dataSource"></decorate-size>
      <div class="com-row com-show-type">
        <span class="com-column">主题图片：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showPoster" class="decorate-radio">
            <el-radio :label="true" border>显示</el-radio>
            <el-radio :label="false" border>不显示</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="com-row com-show-type">
        <span class="com-column">显示方式：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.display" class="decorate-radio">
            <el-radio label="vertical" border>列表</el-radio>
            <el-radio label="horizon" border>滑动</el-radio>
            <el-radio label="oneRowOne" border>大图</el-radio>
            <el-radio label="oneRowTwo" border>1行2个</el-radio>
            <el-radio label="oneRowThree" border>1行3个</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="com-row" v-if="dataSource.display">
        <span class="com-column input-title">显示数量：</span>
        <span class="nav-column">
          <!-- <el-input class="com-input"
                    v-model="dataSource.limitNum"
                    placeholder=""></el-input> -->

          <el-input-number
            style="width: 160px"
            class="com-input com-input-number"
            :min="1"
            v-model="dataSource.limitNum"
            type="number"
            placeholder
          ></el-input-number>
        </span>
      </div>
      <div class="com-row" v-else>
        <span class="com-column input-title">显示数量：</span>
        <span class="nav-column">
          <el-input-number
            style="width: 160px"
            disabled=""
            class="com-input com-input-number"
            :min="1"
            type="number"
            placeholder
          ></el-input-number>
          <!-- <el-input class="com-input"
                    disabled=""
                    placeholder=""></el-input> -->
        </span>
      </div>
    </div>
    <select-dialog v-model="showDialog" @choosed="onChooseGoods" :enable-multiple="false" :goods-type="type">
    </select-dialog>
  </div>
</template>

<script>
  import './css/common.less';
  import commonEdit from './commonEdit.vue';
  import service from '@/dss-wechat3rd/src/api/activity.js';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import DecorateSize from './size.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import { mapState } from 'vuex';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'ActivityModule',
    components: {
      commonEdit,
      DecorateSize,
      selectDialog,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        showDialog: false,
        type: goodsTypeEnum.activity,
      };
    },
    computed: {
      limitNum() {
        return this.dataSource.limitNum;
      },
      display() {
        return this.dataSource.display;
      },
    },
    watch: {
      display: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (this.dataSource.display === 'horizon' && this.dataSource.activityId) {
            service.supplier
              .topic_with_items({
                topicId: this.dataSource.activityId,
                itemCount: this.dataSource.limitNum > 3 ? this.dataSource.limitNum : 3,
              })
              .then(res => {
                // this.dataSource.data = res.data;
                if (res.data && res.data.wxItemList && res.data.wxItemList.length) {
                  res.data.wxItemList = utils.saveAvailableFields(res.data.wxItemList, fields.activity);
                }
                this.dataSource.data = res.data;
              });
          } else {
            if (this.dataSource.activityId) {
              this.getData();
            }
          }
        },
      },
      limitNum: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (this.dataSource.activityId && this.dataSource.limitNum) {
            this.getData();
          }
        },
      },
    },
    methods: {
      onChooseGoods(choosedGoods) {
        // 删除不需要的字段
        this.dataSource.activityId = choosedGoods.topicId;
        this.getData();
      },
      getData() {
        service.supplier
          .topic_with_items({
            topicId: this.dataSource.activityId,
            itemCount: this.dataSource.limitNum,
          })
          .then(res => {
            if (res.data && res.data.wxItemList && res.data.wxItemList.length) {
              res.data.wxItemList = utils.saveAvailableFields(res.data.wxItemList, fields.activity);
            }
            this.dataSource.data = res.data;
            console.log('this.dataSource.data', this.dataSource.data);
          });
      },

      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },
      deleteActivity() {
        this.dataSource.activityId = '';
        this.dataSource.data = {};
      },
    },
  };
</script>
<style lang="less" scoped>
  .com-row {
    .title {
      // width: 100px;
    }
  }

  .topicName-button {
    // border: 1px solid #2e8dffaf;
    // border-radius: 3px;
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    position: relative;
    color: #33373e;
    font-size: 12px;

    .delete {
      position: absolute;
      top: -5px;
      right: 0;
      height: 10px;
      width: 10px;
      background: transparent url(../images/close.png) no-repeat 0 0;
      background-size: cover;
      cursor: pointer;
    }

    .topic-img {
      width: 190px;
      height: 53px;
      margin-bottom: 5px;
    }
  }
</style>
