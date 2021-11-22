<template>
  <div v-loading="isLoading"
       class="pintuan-activity-setting">
    <div class="setting">
      <el-form label-width="100px"
               ref="elForm"
               :model="form"
               :rules="rules"
               class="setting-from"
               size="mini">
        <div class="title">规则设置</div>
        <el-form-item label="规则名称："
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="规则说明："
                      prop="desc">
          <el-input v-model="form.desc"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入说明"></el-input>
        </el-form-item>
        <div class="title">领取设置
          <span>（优先判断会员等级限领数量，再判断赠品限领数量）</span>
        </div>

        <el-form-item label=""
                      prop="none">

          <div class="head-box">
            <div class="td">会员等级</div>
            <div class="td long-td">限领周期</div>
            <div class="td">
              <span style="color: #F56C6C;">*</span> 限领数量(0表示不限制)</div>
          </div>

          <div v-for="(item,index) in form.giftRuleLevelDTOS"
               :key="index"
               class="body-box">
            <div class="td">{{item.levelName}}</div>
            <div class="td long-td">
              <el-select v-model="item.limitPeriod"
                         size="mini"
                         style="width:120px"
                         clearable>
                <el-option v-for="(it,i) in limitList"
                           :key="i"
                           :label="it.name"
                           :value="it.value"></el-option>
              </el-select>
              <el-date-picker v-model="form.giftRuleLevelDTOS[index].dateRange"
                              v-if="item.limitPeriod === limitEnum.custom"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"></el-date-picker>
            </div>
            <div class="td">
              <el-input v-model="item.limitCount"
                        style="width:120px"
                        placeholder="限领数量"></el-input>
            </div>

          </div>
        </el-form-item>

      </el-form>

    </div>
    <div class="bottom-button">
      <el-button @click="onSave"
                     type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
const limitEnum = {
  day: 1,
  week: 2,
  month: 3,
  custom: 4
};
let limitList = [
  { name: '每日', value: limitEnum.day },
  { name: '每周', value: limitEnum.week },
  { name: '每月', value: limitEnum.month },
  { name: '自定义时间', value: limitEnum.custom }
];

export default {
  components: {
    ImageSelector
  },
  data() {
    const checkValidate = (rule, value, callback) => {
      let msg = null;
      let bust = regexps.intWithZero;
      this.form.giftRuleLevelDTOS.forEach(item => {
        if (!bust.reg.test(item.limitCount)) {
          msg = bust.msg;
        } else if (!item.limitPeriod) {
          msg = '请选择限领周期';
        } else if (item.limitPeriod === limitEnum.custom && !item.dateRange) {
          msg = '请选择限领日期';
        }
      });
      if (msg) {
        return callback(msg);
      }
      return callback();
    };

    return {
      form: {
        name: '',
        desc: '',
        dateRangeList: [null, null, null, null],
        giftRuleLevelDTOS: []
      },
      LevelSimplyList: [],
      limitEnum,
      limitList,
      rules: {
        name: [
          {
            required: true,
            message: '请输入标题'
          },
          {
            max: 20,
            message: '长度在20个字符内',
            trigger: 'blur'
          },
          {
            pattern: regexps.name.reg,
            message: regexps.name.msg,
            trigger: 'blur'
          }
        ],
        desc: [
          {
            required: true,
            message: '请输入说明'
          },
          {
            max: 200,
            message: '长度在200个字符内',
            trigger: 'blur'
          }
        ],
        none: [{ validator: checkValidate, trigger: 'change' }]
      },
      isLoading: false
    };
  },
  mounted() {
    this.getMember();
  },
  methods: {
    onSave() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.save();
      });
    },

    getMember() {
      giftApi
        .getLevelSimplyList()
        .done(res => {
          this.LevelSimplyList = res.data;
          this.fetchData();
        })
        .always(() => {});
    },

    save() {
      this.isLoading = true;
      const params = this.$plain(this.form);
      params.giftRuleLevelDTOS.forEach(giftRule => {
        if (giftRule.limitPeriod === limitEnum.custom) {
          giftRule.startTime = new Date(giftRule.dateRange[0]).getTime();
          giftRule.endTime = new Date(giftRule.dateRange[1]).getTime();
          delete giftRule.dateRange;
        } else {
          delete giftRule.dateRange;
        }
        giftRule.limitCount = parseInt(giftRule.limitCount);
      });
      this.isLoading = true;
      giftApi
        .setGiftRule(params)
        .done(res => {
          if (res.data) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    fetchData() {
      this.isLoading = true;
      giftApi
        .getGiftRule()
        .done(res => {
          if (res.data) {
            this.form = res.data;
            let ruleslist = [];
            this.LevelSimplyList.forEach(item => {
              let rule = this.form.giftRuleLevelDTOS.find(gift => item.id === gift.levelId);
              if (rule) {
                rule.levelName = item.levelName;
                if (rule.limitPeriod === limitEnum.custom) {
                  //对象赋值
                  this.$set(rule, 'dateRange', [new Date(rule.startTime), new Date(rule.endTime)]);
                  // rule.dateRange = [new Date(rule.startTime), new Date(rule.endTime)];
                  delete rule.startTime;
                  delete rule.endTime;
                }
                ruleslist.push(rule);
              } else {
                ruleslist.push({
                  levelId: item.id,
                  levelName: item.levelName,
                  limitPeriod: limitEnum.day,
                  limitCount: 0
                });
              }
            });
            this.form.giftRuleLevelDTOS = ruleslist;
            console.log(ruleslist);
          } else {
            this.LevelSimplyList.forEach(item => {
              this.form.giftRuleLevelDTOS.push({
                levelId: item.id,
                levelName: item.levelName,
                limitPeriod: 1,
                limitCount: null
              });
            });
          }
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    //去除等级名称输入框的前后空格
    removeSpace(key) {
      this.form[key] = this.form[key].replace(/(^\s*)|(\s*$)/g, '');
    }
  }
};
</script>

<style lang="less">
.pintuan-activity-setting {
  margin-bottom: 30px;
  background: #fff;
  .setting {
    background: white;
    padding: 10px 20px;
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
    margin-left: 12px;
  }
  .head-box {
    width: 1000px;
    font-size: 0px;
    .td {
      display: inline-block;
      width: 260px;
      font-size: 14px;
    }
    .long-td {
      width: 430px;
    }
  }

  .body-box {
    width: 1000px;
    font-size: 0px;
    .td {
      display: inline-block;
      width: 260px;
      font-size: 14px;
      padding: 10px 0;
    }
    .long-td {
      width: 430px;
    }
  }
}
</style>
