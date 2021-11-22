<template>
  <el-dialog
    width="546px"
    :model="formData"
    class="coupon-edit"
    :title="title"
    :visible.sync="editShow"
    :close-on-click-modal="false"
  >
    <el-form :model="formData" :rules="rules" label-width="126px" ref="$editForm">
      <el-form-item label="关联优惠券：" prop="couponList">
        <template v-if="!isEdit">
          <span class="select-link" :disabled="isEdit" @click="selectCoupon"> 选择优惠券 </span>
        </template>
        <template v-else>
          <span class="edit-coupon">{{ formData.couponList.map(item => item.name).join(',') }}</span>
        </template>
      </el-form-item>
      <div v-show="formData.couponList.length > 0 && !isEdit" class="coupon-list">
        <div class="list-top">
          <span>已选择</span>
          <span class="select-link" @click="formData.couponList = []">清空</span>
        </div>
        <div class="list">
          <el-tag
            class="list-tag"
            :key="item.id"
            effect="plain"
            closable
            @close="tagClose(index)"
            v-for="(item, index) in formData.couponList"
            >{{ item.name }}</el-tag
          >
        </div>
      </div>
      <el-form-item label="权限时间：" prop="rangeTime">
        <el-date-picker
          v-model="formData.rangeTime"
          type="daterange"
          clearable
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="发券额度：" prop="couponCount">
        <el-input-number
          class="w220 coupon-amount"
          v-if="!isEdit"
          v-model.number="formData.couponCount"
          :disabled="isEdit"
          :controls="false"
          placeholder="填“0”或不填，即无限制"
        />
        <span v-else>{{ formData.couponCount | isInfinite(initObj.adjustType, true) }}</span>
        <span v-if="!isEdit" class="couponNum">张</span>
      </el-form-item>
      <template v-if="isEdit">
        <el-form-item label="已用额度：">
          <span>{{ initObj.grantAmount || 0 }} 张</span>
        </el-form-item>
        <el-form-item label="剩余额度：">
          <span>{{ initObj.remainingQuantity | isInfinite(initObj.adjustType, true) }}</span>
          <span @click="creditBool = !creditBool" class="select-link">{{ creditBool ? '取消' : '修改' }}</span>
        </el-form-item>
        <el-form-item class="credit-handle" v-show="creditBool" prop="changeNumber">
          <div>
            <span class="credit-label">增减额度：</span>
            <el-input-number
              :min="-999999"
              :max="999999"
              class="change-number"
              v-model.number="formData.changeNumber"
            />
            <span class="couponNum">张</span>
            <el-tooltip effect="dark" placement="bottom-start">
              <template #content>
                <div>填写正数为增加，负数为扣减</div>
                <div>从无限制修改为有限制时，发券额度=已用额度+增加额度（该情况下不可填写负数）</div>
              </template>
              <i class="coupon-tip el-icon-warning"></i>
            </el-tooltip>
          </div>
          <div @click.stop.prevent="formData.radioBool = !formData.radioBool" class="credit-radio">
            <el-radio :value="formData.radioBool" :label="true">无额度上限</el-radio>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button :loading="loadingBtn" type="primary" @click="submit">确 认</el-button>
    </div>
    <!-- 选择优惠券 -->
    <coupon-dialog ref="$couponDialog" :coupon-select.sync="formData.couponList" />
  </el-dialog>
</template>

<script>
  import couponDialog from './coupon-dialog.vue';
  import regexps from '@/dss-common/utils/regexps';
  import { insertCouponAuth, editCouponAuth } from '@/dss-wechat3rd/src/api/account-coupon';
  import utils from '@/dss-common/utils';
  import dateFormat from '@/dss-common/utils/date';
  import { adjustType } from '@/dss-wechat3rd/src/view-business/enum';

  const resetForm = () => ({
    couponList: [],
    rangeTime: null,
    couponCount: undefined,
    changeNumber: 0,
    radioBool: false,
  });

  export default {
    name: 'EditDialog',
    components: {
      couponDialog,
    },
    data() {
      return {
        editShow: false,
        formData: resetForm(),
        initObj: {},
        creditBool: false,
        rules: {
          couponList: [
            {
              required: true,
              validator: (rule, value, cb) => {
                if (this.formData.couponList.length <= 0) {
                  cb(new Error('请选择优惠券'));
                } else {
                  cb();
                }
              },
              trigger: 'change',
            },
          ],
          rangeTime: [
            {
              required: true,
              message: '请选择权限时间',
              trigger: 'change',
            },
          ],
          couponCount: [
            {
              validator: (rule, value, cb) => {
                const flag = regexps.littleeIntZeroNum.reg.test(value);
                if (this.isEdit) {
                  cb();
                } else if (flag) {
                  cb();
                } else if (!flag && utils.isNumber(value)) {
                  cb(new Error(regexps.littleeIntZeroNum.msg));
                } else {
                  cb();
                }
              },
              trigger: 'change',
            },
          ],
        },
        loadingBtn: false,
        isEdit: false,
      };
    },
    filters: {
      isInfinite(val, type, unitFlag = false) {
        return type === adjustType.infinite ? '无上限' : val + `${unitFlag ? ' 张' : ''}`;
      },
    },
    watch: {
      'formData.changeNumber'(nv) {
        if (nv) {
          this.formData.radioBool = false;
        }
      },
      'formData.radioBool'(nv) {
        if (nv) {
          this.$refs.$editForm.clearValidate('changeNumber');
        }
      },
      'formData.couponList'() {
        this.$refs.$editForm && this.$refs.$editForm.clearValidate('couponList');
      },
      editShow(nv) {
        if (!nv) {
          this.clearData();
        }
      },
    },
    computed: {
      title() {
        return `${this.isEdit ? '编辑' : '新增'}发券权限`;
      },
    },
    methods: {
      clearData() {
        setTimeout(() => {
          this.creditBool = false;
          // 防止初始的form数据是编辑的导致重置不了数据
          this.formData = resetForm();
          this.$nextTick(() => {
            this.$refs.$editForm.clearValidate();
          });
        }, 120);
      },
      tagClose(index) {
        this.formData.couponList.splice(index, 1);
      },
      initData(row) {
        this.initObj = row;
        this.formData.couponList = [{ id: row.couponId, name: row.couponName, couponCategory: row.couponCategory }];
        this.formData.rangeTime = [new Date(row.beginTime), new Date(row.endTime)];
        if (row.adjustType === adjustType.infinite) {
          this.creditBool = true;
          this.formData.radioBool = true;
        } else {
          this.formData.couponCount = row.quantity || 0;
          this.formData.remainingQuantity = row.remainingQuantity || 0;
        }
      },
      selectCoupon() {
        this.$refs.$couponDialog.changeIds(this.formData.couponList.map(item => item.id));
        this.$refs.$couponDialog.show();
      },
      async submitEdit(params) {
        // id为列表中一条数据的id
        params.id = this.initObj.id;
        params.adjustType = this.formData.radioBool ? adjustType.infinite : adjustType.unInfinite;
        if (params.adjustType === adjustType.unInfinite && this.formData.changeNumber) {
          params.quantity = this.formData.changeNumber;
        }
        await editCouponAuth(params);
      },
      async submitInsert(params) {
        // id为accountId
        const { id } = this.$route.query;
        const { couponList, couponCount } = this.formData;
        params.accountId = id;
        params.couponList = couponList.map(item => ({
          couponId: item.id,
          couponName: item.name,
          couponCategory: item.couponCategory,
        }));
        params.quantity = couponCount;
        await insertCouponAuth(params);
        // 新增后选择优惠券列表需要刷新
        this.$refs.$couponDialog.searchTable();
      },
      submit() {
        this.$refs.$editForm.validate(async valid => {
          if (valid) {
            this.loadingBtn = true;
            const { rangeTime } = this.formData;
            const params = {};
            if (rangeTime) {
              const [beginTime, endTime] = rangeTime;
              params.beginTime = dateFormat.format(new Date(beginTime));
              params.endTime = dateFormat.format(new Date(endTime));
            }
            try {
              if (this.isEdit) {
                await this.submitEdit(params);
              } else {
                await this.submitInsert(params);
              }
              // 调接口成功后才刷新列表和关掉弹窗
              this.$emit('change-list');
              this.close();
            } catch {
              // 调接口失败不关闭弹窗只把加载按钮关掉
              this.loadingBtn = false;
            }
          }
        });
      },
      show(row) {
        this.editShow = true;
        if (row) {
          this.isEdit = true;
          this.initData(row);
        } else {
          // 之前是编辑状态得改回新增状态
          this.isEdit && (this.isEdit = false);
        }
      },
      close() {
        // 如果关掉窗口加载按钮是true就改成false
        this.loadingBtn && (this.loadingBtn = false);
        this.editShow = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .coupon-edit {
    /deep/ .el-dialog__body {
      text-align: left;
    }

    /deep/ .el-tag--plain {
      border: 1px solid #eaeff5;
      color: #717378;
      border-radius: 18px;
      padding: 0 20px;
    }

    /deep/ .el-tag--plain .el-tag__close {
      background: #b1b5bd;
      color: white;
    }

    .coupon-amount /deep/ .el-input__inner {
      text-align: left;
    }

    .select-link {
      color: #2196f3;
      margin-left: 8px;
      cursor: pointer;
    }

    .edit-coupon {
      font-size: 14px;
      color: #101010;
    }

    .select-btn.is-disabled {
      background-color: #f0f2f5;
      color: #a1a4ab;
      border-color: #dce1e6;
    }

    .couponNum {
      margin-left: 8px;
    }

    .coupon-list {
      width: 440px;
      padding: 16px 14px;
      margin: auto;
      margin-bottom: 20px;
      padding-left: 0;
      border: 1px solid #eaeff5;
      border-radius: 4px;

      .list-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 14px;

        span {
          line-height: 0;
        }
      }

      .list {
        .list-tag {
          margin-left: 14px;
          margin-top: 10px;
        }
      }
    }

    .credit-btn {
      margin-left: 20px;
    }

    .credit-handle {
      margin-top: 10px;

      .coupon-tip {
        font-size: 16px;
        margin-left: 10px;
        color: #409eff;
      }

      /deep/ .el-radio {
        margin-right: 0;
      }

      .credit-label {
        width: 70px;
        font-size: 14px;
        color: #717378;
      }

      .credit-tip {
        margin-left: 70px;
        font-size: 12px;
        color: #717378;
      }

      .change-number {
        width: 140px;
      }

      .credit-radio {
        display: inline-block;
        margin-top: 10px;

        /deep/ .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
          box-shadow: none;
        }
      }
    }

    .middle-ftn {
      vertical-align: middle;
    }
  }
</style>
