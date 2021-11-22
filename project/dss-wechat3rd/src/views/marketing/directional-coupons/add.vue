place-holder="请输入活动名称"
<template>
  <div class="directional-coupons-add-container">
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/directional-cp' }">定向群发优惠券</el-breadcrumb-item>
      <el-breadcrumb-item>新建群发</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="directional-coupons-add" v-loading="loading">
      <div class="tip-box">
        <div class="tip">选定人群后主动推送优惠券，激活老会员。</div>
        <div style="color: #909399" class="tip">建议：在优惠券功能中创建一张优惠券，不放入领券中心，在此处调用。</div>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" class="add-form">
        <el-form-item prop="name" label="活动名称：" class="activity-name">
          <el-input size="mini" style="width: 200px" placeholder="请输入活动名称" v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item
          prop="currentGroupType"
          class="member-form-item"
          label="会员："
          :class="
            !addForm[addForm.currentGroupType] || addForm[addForm.currentGroupType].length === 0 ? 'large-margin' : ''
          "
        >
          <el-radio-group v-model="addForm.currentGroupType" class="member-group">
            <el-radio size="mini" :label="GroupTypeKey.ALL">全部 </el-radio>
            <el-radio :label="GroupTypeKey.LEVEL">指定等级</el-radio>
            <el-button
              style="top: 26px; left: 93px"
              class="group-button"
              size="mini"
              v-if="addForm.currentGroupType === GroupTypeKey.LEVEL"
              @click="handleSelectLevel()"
              >选择等级
            </el-button>
            <!-- <el-radio :label="GroupTypeKey.LABEL">指定商家标签</el-radio>
            <el-button size="mini"
                       v-if="addForm.currentGroupType === GroupTypeKey.LABEL"
                       @click="handleSelectLabel()">选择标签
            </el-button> -->
            <el-radio :label="GroupTypeKey.CROWD">指定人群包</el-radio>
            <el-button
              style="top: 58px; left: 94px"
              class="group-button"
              size="mini"
              v-if="addForm.currentGroupType === GroupTypeKey.CROWD"
              @click="handleSelectCrowd()"
              >选择人群包
            </el-button>
            <el-radio :label="GroupTypeKey.BIRTH">生日人群</el-radio>
            <el-button
              style="top: 89px; left: 79px"
              class="group-button"
              size="mini"
              v-if="addForm.currentGroupType === GroupTypeKey.BIRTH"
              @click="handleSelectBirth()"
              >选择月份
            </el-button>
            <el-radio :label="GroupTypeKey.PHONE">指定手机号</el-radio>
            <el-button
              class="group-button"
              style="top: 121px; left: 94px"
              size="mini"
              v-if="addForm.currentGroupType === GroupTypeKey.PHONE"
              @click="handleSelectThrong(GroupTypeKey.PHONE)"
              >批量导入手机号
            </el-button>
            <el-radio :label="GroupTypeKey.MEMBER_ID">指定会员id</el-radio>
            <el-button
              class="group-button"
              style="left: 93px; top: 153px"
              size="mini"
              v-if="addForm.currentGroupType === GroupTypeKey.MEMBER_ID"
              @click="handleSelectThrong(GroupTypeKey.MEMBER_ID)"
              >批量导入id
            </el-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          class="selected-group-form-item"
          v-if="
            addForm.currentGroupType !== GroupTypeKey.ALL &&
            FilterType[addForm.currentGroupType] < FilterType[GroupTypeKey.PHONE]
          "
        >
          <template v-if="addForm[addForm.currentGroupType] && addForm[addForm.currentGroupType].length">
            {{ SelectLabel[addForm.currentGroupType] }}：
            <el-tag
              class="group-tag"
              closable
              disable-transitions
              size="mini"
              v-for="group in addForm[addForm.currentGroupType]"
              :key="group.name"
              @close="handleDelGroup(group, addForm.currentGroupType)"
            >
              {{ group.name }}
            </el-tag>
          </template>
          <place-holder :height="30" :min-height="30" v-else></place-holder>
        </el-form-item>

        <el-form-item prop="couponInfoIdList">
          <span>优惠券：</span>
          <el-button @click="showCouponDialog = true" class="choose-coupon">选择优惠券 </el-button>
          <span class="choose-coupon-tip">*最多可添加5张优惠券</span>
        </el-form-item>

        <el-form-item v-if="addForm.couponInfoIdList && addForm.couponInfoIdList.length">
          <el-table :data="addForm.couponInfoIdList" class="wkt-table">
            <el-table-column label="优惠券名称">
              <template slot-scope="scope">
                <span class="ellipsis" :title="scope.row.name">{{ scope.row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column label="最低消费金额" prop="minimumFee">
              <template slot-scope="scope">
                <span>{{ scope.row.minimumFee | price }}</span>
              </template>
            </el-table-column>

            <el-table-column label="优惠面值" prop="discountFee">
              <template slot-scope="scope">
                <span v-if="scope.row.couponCategory === couponEnum.couponCategory.discount"
                  >{{ scope.row.discountFee | discount }}折</span
                >
                <span v-else>{{ scope.row.discountFee | price }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <a class="table-del-a" href="javascript:;" @click="handleDelCouponItem(scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item prop="sendSmsType" class="send-msg-form-item">
          <el-checkbox v-model="addForm.sendSmsType" style="color: #909399"
            >短信群发通知&nbsp;&nbsp;&nbsp;&nbsp;*建议配合短信通知，有效触达</el-checkbox
          >
        </el-form-item>
        <div class="bottom-button">
          <el-button @click="onGiveUp">取消</el-button>
          <el-button type="primary" @click="handleCommit('addForm')">群发</el-button>
        </div>
      </el-form>

      <coupon-select-dialog
        v-model="showCouponDialog"
        :limit="5"
        :selected-coupons="addForm.couponInfoIdList"
        @selected="onCouponsSelected"
      />

      <group-select-dialog
        v-model="showGroupDialog"
        :label="Label[addForm.currentGroupType]"
        :all-group="currentGroup"
        :selected-group="selectedGroup"
        @select="onGroupItemsSelected"
      >
      </group-select-dialog>

      <group-send-confirm-dialog
        v-model="showSendConfirmDialog"
        :label="Label[addForm.currentGroupType]"
        :confirm-data="confirmData"
        :selected-coupons="addForm.couponInfoIdList"
        :selected-group="addForm[addForm.currentGroupType]"
      >
      </group-send-confirm-dialog>

      <no-msg-dialog v-model="showNoMsgDialog"></no-msg-dialog>

      <crowd-pack-dialog ref="crowd-pack-dialog" v-model="addForm[addForm.currentGroupType]"> </crowd-pack-dialog>

      <!--批量导入-->
      <upload
        ref="manualUpload"
        :auto-upload="false"
        :visible.sync="showUploadDialog"
        :title="'批量导入'"
        :limit="1"
        :params="uploadParams"
        @upload-success="onUploadSuccess"
        :template-down-url="templateDownUrl"
        :upload-server-url="uploadServerUrl"
        :hint-submit="false"
        :template-desc="'您可以下载我们提供的模板，批量导入用户信息。'"
      >
      </upload>
    </div>
  </div>
</template>

<script>
  import Upload from '@/dss-common/components/upload/index.vue';
  import memberApi from '@/dss-wechat3rd/src/api/memberAPI.js';
  import marketingApi from '@/dss-wechat3rd/src/api/marketingAPI.js';

  import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index.vue';
  import GroupSelectDialog from './group-select-dialog.vue';
  import GroupSendConfirmDialog from './group-send-confirm-dialog.vue';
  import NoMsgDialog from './no-msg-dialog.vue';
  import CrowdPackDialog from '@/dss-wechat3rd/src/bz_components/crowd-pack-dialog/index.vue';

  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';

  import regexps from '@/dss-common/utils/regexps';

  import { FilterType, GroupTypeKey, Label, Month, SelectLabel, SendMsgType } from './enum.js';

  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
  import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';

  export default {
    name: 'AddDirectionalCoupons',
    components: {
      Upload,
      CouponSelectDialog,
      GroupSelectDialog,
      PlaceHolder,
      GroupSendConfirmDialog,
      NoMsgDialog,
      CrowdPackDialog,
    },
    mixins: [AdapterIfr.AdapterMixins],
    data() {
      const validateGroup = (rule, value, callback) => {
        if (value === GroupTypeKey.ALL || (this.addForm[value] && this.addForm[value].length)) {
          callback();
        } else if (value === GroupTypeKey.PHONE || value === GroupTypeKey.MEMBER_ID) {
          callback();
        } else {
          callback(new Error('请选择' + SelectLabel[value]));
        }
      };

      const validateCouponInfoList = (rule, value, callback) => {
        if (value && value.length) {
          callback();
        } else {
          callback(new Error('请至少选择一张优惠券'));
        }
      };
      return {
        couponEnum,
        GroupTypeKey,
        FilterType,
        SelectLabel,
        Label,
        // 上传的额外参数
        uploadParams: null,
        // 上传弹出框显隐
        showUploadDialog: false,
        showGroupDialog: false,
        showSendConfirmDialog: false,
        showNoMsgDialog: false,
        loading: false,
        showCouponDialog: false,
        levelList: [],
        // labelList: [],
        monthList: Month,
        thongList: [],
        isLabelAll: false,
        isMonthAll: false,
        isLevelAll: false,
        addForm: {
          name: null,
          filterType: FilterType[GroupTypeKey.ALL],
          currentGroupType: GroupTypeKey.ALL,
          [GroupTypeKey.LEVEL]: null,
          [GroupTypeKey.LABEL]: null,
          [GroupTypeKey.BIRTH]: [],
          [GroupTypeKey.CROWD]: [],
          couponInfoIdList: [],
          sendSmsType: false,
        },
        addRules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              pattern: regexps.simpleName.reg,
              message: regexps.simpleName.msg,
              trigger: 'blur',
            },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          ],
          currentGroupType: [{ validator: validateGroup, trigger: 'change' }],
          couponInfoIdList: [{ validator: validateCouponInfoList, trigger: 'change' }],
        },
        confirmData: {},
      };
    },
    computed: {
      // 模板下载链接
      templateDownUrl() {
        return '/wp/materials/template/download?fileName=batchSendImportTemplate';
      },
      // 文件上传链接

      uploadServerUrl() {
        return '/wp/coupon/batch/plan/upload/v2';
      },
      currentGroup() {
        switch (this.addForm.currentGroupType) {
          case GroupTypeKey.LEVEL:
            return this.levelList;
          case GroupTypeKey.LABEL:
            return this.labelList;
          case GroupTypeKey.BIRTH:
            return this.monthList;
          default:
            return [];
        }
      },
      selectedGroup() {
        return this.addForm[this.addForm.currentGroupType];
      },
      selectedMonthList: {
        get() {
          return this.getVal(GroupTypeKey.BIRTH);
        },
        set(val) {
          this.setVal(val, this.monthList, GroupTypeKey.BIRTH);
        },
      },
      selectedLabelList: {
        get() {
          return this.getVal(GroupTypeKey.LABEL);
        },
        set(val) {
          this.setVal(val, this.labelList, GroupTypeKey.LABEL);
        },
      },
      selectedLevelList: {
        get() {
          return this.getVal(GroupTypeKey.LEVEL);
        },
        set(val) {
          this.setVal(val, this.levelList, GroupTypeKey.LEVEL);
        },
      },
    },
    watch: {
      'addForm.currentGroupType': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.addForm.filterType = FilterType[newVal];
          }
        },
      },
      showUploadDialog(newVal) {
        this.adapterIfmMask(!!newVal);
      },
    },
    methods: {
      fetchMemberLevelList() {
        // 获取等级列表
        memberApi.getLevelSimplyList().then(res => {
          if (res.data && res.data.length) {
            this.levelList = res.data.map(item => {
              return { id: item.levelNumber, name: item.levelName };
            });
            console.log(res.data, '等级列表');
          } else {
            this.levelList = [];
          }
          if (this.addForm.currentGroupType === GroupTypeKey.LEVEL) {
            this.showGroupDialog = true;
          }
        });
      },
      // 标签列表查询
      // fetchLabelList() {
      //   const params = {
      //     pageSize: 1000, //每页条数
      //     pageNo: 1 //页数
      //   };
      //   memberApi.getMemberLabelList(params).then(res => {
      //     //标签列表
      //     if (res.data && res.data.length) {
      //       this.labelList = res.data.map(item => {
      //         return { id: item, name: item };
      //       });
      //     } else {
      //       this.labelList = [];
      //     }
      //     if (this.addForm.currentGroupType === GroupTypeKey.LABEL) {
      //       this.showGroupDialog = true;
      //     }
      //   });
      // },

      // 组装已选择的数据，显示在LABEL中，供compute属性使用
      setVal(val, allList, key) {
        if (val && val.length) {
          this.addForm[key] = val.map(id => {
            return allList.find(item => {
              return item.id === id;
            });
          });
        } else {
          this.addForm[key] = [];
        }
        switch (key) {
          case GroupTypeKey.LEVEL:
            if (this.addForm[key].length !== this.levelList.length) {
              this.isLevelAll = false;
            }
            break;
          case GroupTypeKey.LABEL:
            if (this.addForm[key].length !== this.labelList.length) {
              this.isLabelAll = false;
            }
            break;
          case GroupTypeKey.BIRTH:
            if (this.addForm[key].length !== this.monthList.length) {
              this.isMonthAll = false;
            }
            break;
        }
      },
      // 解析已选择的数据，在select选择框展示，供compute属性使用
      getVal(key) {
        const selectedList = this.addForm[key];
        if (selectedList && selectedList.length) {
          return this.addForm[key].map(item => {
            return item.id;
          });
        } else {
          return [];
        }
      },
      handleDelGroup(groupItem, currentGroupType) {
        this.addForm[currentGroupType].splice(this.addForm[currentGroupType].indexOf(groupItem), 1);
        // 主动除非表单进行验证
        this.$refs.addForm.validateField('currentGroupType');
      },
      handleDelCouponItem(couponItem) {
        this.addForm.couponInfoIdList.splice(this.addForm.couponInfoIdList.indexOf(couponItem), 1);
      },

      onCouponsSelected(coupons) {
        this.addForm.couponInfoIdList = coupons;
        this.$refs.addForm.validateField('couponInfoIdList');
      },

      onGroupItemsSelected(groups) {
        this.addForm[this.addForm.currentGroupType] = groups;
        // 主动除非表单进行验证
        this.$refs.addForm.validateField('currentGroupType');
      },
      needUploadFile() {
        return (
          this.addForm.currentGroupType === GroupTypeKey.PHONE ||
          this.addForm.currentGroupType === GroupTypeKey.MEMBER_ID
        );
      },
      handleCommit: function (formName = 'addForm') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.needUploadFile()) {
              this.assembleUplaodParams();
              const manuUplaod = this.$refs.manualUpload;
              if (manuUplaod) {
                manuUplaod.manualSubmit();
              } else {
                this.$message({
                  message: '没有文件被选择，请选择上传的文件',
                  type: 'warning',
                });
              }
            } else {
              const params = {};
              params.name = this.addForm.name;
              params.filterType = this.addForm.filterType;
              params.sendSmsType = this.addForm.sendSmsType ? SendMsgType.SEND : SendMsgType.NO;
              params.couponInfoIdList = this.joinIds(this.addForm.couponInfoIdList);
              params[this.addForm.currentGroupType] = this.joinIds(this.addForm[this.addForm.currentGroupType]);
              this.loading = true;
              marketingApi
                .addDirectionalCoupons(params)
                .done(
                  res => {
                    /* this.showSendConfirmDialog = true;
                this.confirmData = res.data || {}; */
                    this.$router.push('/marketing/directional-cp');
                  },
                  error => {
                    // 短信不足
                    if (error.code === 160000) {
                      this.showNoMsgDialog = true;
                    }
                  }
                )
                .always(() => {
                  this.loading = false;
                });
            }
          } else {
            return false;
          }
        });
      },
      joinIds(targetList) {
        if (targetList && targetList.length) {
          return targetList
            .map(item => {
              return item.id;
            })
            .join();
        } else {
          return null;
        }
      },
      handleSelectLevel() {
        if (!this.levelList || !this.levelList.length) {
          this.fetchMemberLevelList();
        } else {
          this.showGroupDialog = true;
        }
      },
      handleSelectCrowd() {
        this.$refs['crowd-pack-dialog'].show();
      },
      handleSelectBirth() {
        this.showGroupDialog = true;
      },
      // 批量导入手机号或ID
      handleSelectThrong(key) {
        this.showUploadDialog = true;
      },
      /**
       * 组装手机号或者会员id上传时的参数
       */
      assembleUplaodParams() {
        this.uploadParams = this.$plain(this.addForm);
        this.uploadParams.couponInfoIdList = this.joinIds(this.addForm.couponInfoIdList);
        this.uploadParams.sendSmsType = this.addForm.sendSmsType ? SendMsgType.SEND : SendMsgType.NO;
        // 防止传null字符串
        this.uploadParams[GroupTypeKey.LEVEL] = [];
      },
      // 上传成功后的回调
      onUploadSuccess(res) {
        if (!res.success) {
          this.$message.error(res.errorMessage);
          return;
        }
        this.$router.push('/marketing/directional-cp');
      },
      // 取消时返回上一页
      onGiveUp() {
        this.$router.back();
      },
    },
  };
</script>

<style lang="less">
  @header: 48px; //头部高度
  @scroll: 17px; //滚动条高度
  @footerHeight: 44px; //footer高度
  @titleHeight: 58px; //标题高度

  .directional-coupons-add-container {
    background: #fff;
    min-height: calc(100vh - @header - @footerHeight - @titleHeight - 45px);
    // margin-bottom: 20px;
  }

  .directional-coupons-add {
    padding: 0 20px 20px;

    .tip-box {
      margin: 20px 0 10px;
      background: rgba(46, 141, 255, 0.06);
      border: 1px solid @border-color;
      padding: 15px 22px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @black-color;

      .tip + .tip {
        margin-top: 10px;
      }
    }

    .add-form {
      margin-top: 20px;

      .activity-name {
        .el-form-item__content {
          display: inline-block;
        }
      }

      .member-form-item {
      }

      .large-margin {
        margin-bottom: 0;
      }

      .selected-group-form-item {
        padding: 15px 22px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(235, 235, 235, 1);

        .group-tag {
          border-color: #dce1e6;
          background-color: #fff;
          color: #333;
          height: 24px;
          line-height: 22px;
        }

        .el-tag__close,
        .el-tag__close:hover {
          color: #fff;
          background-color: #000;
          opacity: 0.5;
        }

        .el-tag__close::before {
          margin-left: 2px;
        }
      }

      .choose-btn {
        margin: 0 15px;
      }

      .member-group {
        width: 9%;
        margin-top: 13px;
        position: relative;

        .group-button {
          position: absolute;
          color: #2e8dff;
          border: none;
          font-size: 14px;
        }

        .group-button:hover {
          background: #fff;
        }

        .el-radio {
          margin-bottom: 15px;
        }

        .el-radio + .el-button {
          margin-right: 20px;
        }
      }

      .group-tag {
        margin-right: 10px;
      }

      .choose-coupon {
        margin-right: 20px;
        border: 1px solid @ui-function-color-link;

        span {
          color: @ui-function-color-link;
        }
      }

      .choose-coupon-tip {
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #909399;
        line-height: 20px;
        margin-left: 59px;
        margin-top: 7px;
        display: block;
      }
    }
  }
</style>
