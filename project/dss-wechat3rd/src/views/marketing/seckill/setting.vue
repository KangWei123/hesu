<template>
  <div v-loading="isLoading"
       class="activity-setting wkb-market-setting">
    <div class="setting">
      <el-form label-width="180px"
               :disabled="!isEnterManger"
               ref="elForm"
               :model="form"
               :rules="rules"
               class="setting-from"
               size="mini">
        <div>
          <div class="title">秒杀规则</div>
          <el-form-item label="规则名称："
                        prop="title">
            <el-input v-model="form.title"
                      placeholder="请输入规则名称"
                      @blur="removeSpace('title')"></el-input>
          </el-form-item>

          <el-form-item label="规则说明："
                        prop="content" class="setting-content-tip">
            <el-input v-model="form.content"
                      type="textarea"
                      maxlength="200"
                      :rows="6"
                      placeholder="请输入规则说明，长度在200个字符内"></el-input>
            <span class="form-item-tip">{{ form.content.length }}/200</span>
          </el-form-item>

          <div class="title">
            <div>海报设置</div>
            <div class="poster-preview-box-new">
              <div class="poster-preview">
                <div class="phone-head"></div>
                <img class="poster-img"
                     src="../../../images/marketing/bg-poster-preview-new.png" />
                <div class="nick-header-box"
                     v-if="form.posterType === posterTypeEnum.classify.value">
                  <div class="nick-header">
                    <img class="nick-img"
                         src="../../../../../dss-common/img/avatar-default.jpg" />
                    <div class="nick-name">王安筠向你推荐</div>
                    <div class="poster-content">{{form.posterContent || '物美价廉的好货，赶紧来秒杀吧！'}}</div>
                  </div>
                </div>
                <img class="customer-header"
                     :src="form.posterLogo.imgUrl"
                     v-if="form.posterType === posterTypeEnum.custom.value" />
                <div class="poster-label">秒杀价</div>
                <!-- <div class="label-price">活动结束价: ￥300</div> -->
              </div>
            </div>
          </div>
          <el-form-item label="样式设置："
                        prop="posterContent">
            <el-radio v-model="form.posterType"
                      style="display: block;margin-top: 6px;margin-bottom: 10px;"
                      :label="posterTypeEnum.classify.value">{{posterTypeEnum.classify.label}}</el-radio>
            <el-input v-model="form.posterContent"
                      placeholder="请输入文案内容"
                      maxlength="15"
                      @blur="removeSpace('posterContent')"></el-input>
            <div class="img-notes">默认文案：物美价廉的好货，赶紧来秒杀吧！(最长15个字符)</div>
          </el-form-item>
          <el-form-item prop="posterLogo">
            <el-radio v-model="form.posterType"
                      style="display: block;margin-bottom: 10px;"
                      :label="posterTypeEnum.custom.value">{{posterTypeEnum.custom.label}}</el-radio>
            <image-selector :canReset="false"
                            v-model="form.posterLogo"
                            @delete="onDeleteImg" />
            <div class="img-notes">建议尺寸：513x90，图片不大于1M</div>
          </el-form-item>
        </div>

        <div>
          <div class="title">限购设置</div>
          <el-form-item label="全品牌限购数量："
                        prop="seckillLimitType">
            <el-radio-group v-model="form.seckillLimitType"
                            style="margin-top: 6px;">
              <el-radio :label="0">无限制</el-radio>
              <el-radio :label="1">
                <div class="radio-item">
                  <span style="line-height: 28px;margin-right:10px;">每人</span>
                  <el-date-picker style="width:340px;margin-right:10px;"
                                  v-model="form.dateRange"
                                  type="datetimerange"
                                  :picker-options="options"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  align="right">
                  </el-date-picker>
                  <div class="input-box">可参与秒杀商品
                    <el-input style="width:80px;"
                              class="middle-width"
                              :disabled="form.seckillLimitType !== 1"
                              v-model="form.seckillLimitTimes" /> 个</div>
                </div>
              </el-radio>

              <el-radio :label="2">
                <div class="radio-item">
                  <span style="line-height: 28px;margin-right:10px;">每人</span>
                  <el-input style="width:80px;margin-right:10px;"
                            class="middle-width"
                            :disabled="form.seckillLimitType !== 2"
                            v-model="form.dayPeriod" />

                  <div class="input-box">天内，只允许参与
                    <el-input style="width:80px;margin-left:10px;"
                              class="middle-width"
                              :disabled="form.seckillLimitType !== 2"
                              v-model="form.seckillLimitActivityTimes" /> 场秒杀活动</div>
                </div>
              </el-radio>

              <!-- todo 暂时不上 -->
              <!-- <el-radio :label="2">
                <div class="radio-item">
                  <div class="input-box">全品牌最多可购买秒杀商品
                    <el-input style="width:80px;"
                              class="middle-width"
                              v-model="form.seckillLimitTImes" /> 个</div>
                </div>
              </el-radio> -->
            </el-radio-group>
          </el-form-item>
        </div>

        <div>
          <div class="title">营销设置</div>
          <el-form-item label="秒杀订单使用运费券："
                        prop="useLogisticsCoupon">
            <el-switch v-model="form.useLogisticsCoupon"
                       @change="hanleSwitch"
                       :active-value="1"
                       :inactive-value="0"
                       active-text="允许"
                       inactive-text="禁止"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="秒杀订单自动释放库存："
                        prop="seckillOrderTime">
            <div class="wrapper">
              <div class="input-box">秒杀订单下单后
                <el-input style="width:80px;margin-left:10px;"
                          class="middle-width"
                          v-model.trim="form.seckillOrderTime" /> 分钟后未支付，自动取消订单</div>
            </div>
          </el-form-item>
        </div>

        <div class="bottom-button">
          <el-button @click="onSave"
                     type="primary">保存</el-button>
        </div>
      </el-form>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import '../marketing.less';
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import posterTypeEnum from '@/dss-wechat3rd/src/constants/poster-type-enum.js';
import regexps from '@/dss-common/utils/regexps.js';
import seckillApi from '@/dss-wechat3rd/src/api/seckill.js';
import utilDate from '@/dss-common/utils/date.js';

const regexpsInteger = /^[1-9]\d*$/;

export default {
  components: {
    ImageSelector
  },
  data() {
    // 自定义海报校验
    const checkPosterLogo = (rule, value, callback) => {
      if (this.form.posterType === posterTypeEnum.custom.value && (!value || !value.imgUrl)) {
        return callback('请选择自定义海报图片');
      }
      return callback();
    };

    const checkSeckillOrderTime = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      if (!regexpsInteger.test(value) || value > 300 || value == 0) {
        return callback('时间设置必须是1到300之间的正整数');
      }
      return callback();
    };

    // 全品牌限购数量校验
    const checkSeckillLimitType = (rule, value, callback) => {
      const seckillLimitType = this.form.seckillLimitType;
      const dateRange = this.form.dateRange || [];
      const seckillLimitTimes = this.form.seckillLimitTimes || null;
      if (!seckillLimitType && seckillLimitType !== 0) {
        return callback('请选择全品牌限购数量类型');
      } else if (seckillLimitType === 1) {
        if (!dateRange || dateRange.length < 1) {
          return callback('请选择全品牌限购数量周期');
        } else if (!regexpsInteger.test(seckillLimitTimes)) {
          return callback('请输入正整数的每人可参与秒杀商品数量，并且开头不能为0');
        }
      } else if (seckillLimitType === 2) {
        if (!regexpsInteger.test(this.form.seckillLimitActivityTimes) || !regexpsInteger.test(this.form.dayPeriod)) {
          return callback('请输入正整数，并且开头不能为0');
        }
      }
      return callback();
    };

    return {
      posterTypeEnum,
      isLoading: false,
      isCreate: false, // 是否为创建规则

      form: {
        title: '',
        content: '',
        posterType: posterTypeEnum.classify.value,
        posterContent: '',
        posterLogo: {
          id: '',
          imgUrl: ''
        },
        seckillLimitType: 0, // 限购类型设置 0：无限制；1：时间段内限购;2距当前x天内允许参加x次秒杀活动
        dateRange: [],
        seckillLimitTimes: '',
        dayPeriod: null,
        seckillLimitActivityTimes: '',
        dayCycleActivityTimes: null,
        useLogisticsCoupon: 0,
        seckillOrderTime: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题' },
          { max: 20, message: '长度在20个字符内', trigger: 'blur' },
          { pattern: regexps.name.reg, message: regexps.name.msg, trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入说明' },
          { max: 200, message: '长度在200个字符内', trigger: 'blur' }
        ],
        posterLogo: [{ validator: checkPosterLogo.bind(this), trigger: ['blur', 'change'] }],
        seckillLimitType: [{ validator: checkSeckillLimitType, trigger: ['blur', 'change'] }],
        seckillOrderTime: [{ validator: checkSeckillOrderTime, trigger: ['blur', 'change'] }]
      },

      options: {
        shortcuts: [
          {
            text: '未来一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },

  watch: {
    // 监听海报样式设置类型变更
    'form.posterType'(newVal, oldVal) {
      // 手动触发自定义海报验证
      this.$refs.elForm.validateField('posterLogo');
    },
    // 监听自定义海报链接变更
    'form.posterLogo': {
      deep: true,
      handler(newVal, oldVal) {
        // 手动触发自定义海报验证
        this.$refs.elForm.validateField('posterLogo');
      }
    }
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.selectSeckillSetting(); // 获取秒杀活动列表
    });
  },

  methods: {
    onDeleteImg() {
      this.form.posterLogo = {
        id: '',
        imgUrl: ''
      };
    },
    /**
     * 查询秒杀规则
     */
    selectSeckillSetting() {
      this.isLoading = true;
      seckillApi
        .selectSeckillSetting()
        .done(res => {
          if (res.data) {
            this.setFormData(res.data);
          }
          if (!this.form.title) {
            this.isCreate = true;
          }
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    setFormData(data) {
      for (const key in this.form) {
        if (key === 'dateRange') {
          if (data.seckillLimitStartTime && data.seckillLimitEndTime) {
            this.form.dateRange = [new Date(data.seckillLimitStartTime), new Date(data.seckillLimitEndTime)];
          }
          continue;
        }
        if (key === 'seckillLimitType') {
          this.form.seckillLimitType = data.seckillLimitType || 0;
        }

        this.form[key] = data[key];
      }

      this.form.useLogisticsCoupon = data.useLogisticsCoupon || 0;
      if (data.notPayCancelSecond) {
        this.form.seckillOrderTime = data.notPayCancelSecond / 60;
      }
      this.form.posterType = data.posterType || posterTypeEnum.classify.value;
      this.form.posterContent = data.posterContent;
      this.form.posterLogo = {
        id: '',
        imgUrl: data.posterLogo
      };
      if (this.form.seckillLimitType === 2) {
        let dayCycleActivityTimes = this.form.dayCycleActivityTimes.split('/');
        this.form.dayPeriod = dayCycleActivityTimes[0];
        this.form.seckillLimitActivityTimes = dayCycleActivityTimes[1];
      }
    },

    //去除等级名称输入框的前后空格
    removeSpace() {
      this.form.title = this.form.title.replace(/(^\s*)|(\s*$)/g, '');
    },

    hanleSwitch() {},

    /**
     * 保存秒杀秒杀规则
     */
    onSave() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.save(); // 执行秒杀秒杀规则保存接口
      });
    },

    /**
     * 执行秒杀秒杀规则保存接口
     */
    save() {
      this.isLoading = true;
      const params = { ...this.form };
      if (this.form.posterLogo) {
        const posterLogo = this.form.posterLogo.imgUrl;
        delete params.posterLogo;
        params.posterLogo = posterLogo;
      }
      // 处理设置时间
      if (params.seckillLimitType === 1) {
        const timemat = 'YYYY-MM-DD HH:mm:ss';
        params.seckillLimitStartTime = utilDate.format(params.dateRange[0], timemat);
        params.seckillLimitEndTime = utilDate.format(params.dateRange[1], timemat);
        delete params.dateRange;
      } else if (params.seckillLimitType === 2) {
        delete params.seckillLimitTimes;
        delete params.dayPeriod;
        delete params.seckillLimitActivityTimes;
        params.dayCycleActivityTimes = this.form.dayPeriod + '/' + this.form.seckillLimitActivityTimes;
      } else {
        delete params.seckillLimitTimes;
      }

      if (params.seckillOrderTime) {
        params.notPayCancelSecond = params.seckillOrderTime * 60;
        delete params.seckillOrderTime;
      }

      const requestURL = this.isCreate ? 'createSeckillSetting' : 'updateSeckillSetting';

      seckillApi[requestURL](params)
        .done(res => {
          this.$message.success('保存成功');
        })
        .always(() => {
          this.isLoading = false;
        });
    },
    //去除等级名称输入框的前后空格
    removeSpace(key) {
      this.form[key] = this.form[key] ? this.form[key].replace(/(^\s*)|(\s*$)/g, '') : '';
    }
  },

  computed: {
    ...mapState({ roleList: 'roleList' }),
    //key管/企业管理员享有相同权限
    isEnterManger() {
      return (
        !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
        !!~this.roleList.split(',').indexOf('common_role_admin')
      );
    }
  }
};
</script>

<style lang="less">
.activity-setting {
  .setting {
    background: white;
    padding: 22px 33px;
  }

  .setting-from {
    max-width: 505px;
  }

  .setting-img {
    .avatar {
      width: 440px;
      height: 153px;
    }
  }

  .title {
    font-weight: bold;
    color: rgba(49, 52, 59, 1);
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 21px;
  }

  .radio-item {
    display: flex;
    flex-direction: row;
  }

  .el-radio {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }

  .wrapper {
    width: 380px;
  }
  .setting-content-tip {
    .el-form-item__content {
      position: relative;
      .form-item-tip {
        position: absolute;
        bottom: -5px;
        right: -53px;
      }
    }
  }
}
</style>
