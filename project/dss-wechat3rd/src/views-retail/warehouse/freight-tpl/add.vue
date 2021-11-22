<template>
  <div class="freight-add-container" v-loading="loading">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/logistics-setting' }">运费模板</el-breadcrumb-item>
      <el-breadcrumb-item>{{ !!tplId ? '编辑模板' : '新建模板' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="tplForm" :rules="rules" ref="tplForm" label-width="100px" class="tpl-form">
      <el-form-item label="模板名称:" prop="name">
        <el-input v-model="tplForm.name" size="mini" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="模板类型:" prop="type">
        <el-radio-group v-model="tplForm.type">
          <el-radio :label="tplEnum.type.buyerBear">买家承担运费</el-radio>
          <el-radio :label="tplEnum.type.freeShipping">卖家包邮</el-radio>
          <el-radio :label="tplEnum.type.freightCollect">运费到付</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计费方式:" prop="valuationModel" v-if="tplForm.type === tplEnum.type.buyerBear">
        <el-radio-group v-model="tplForm.valuationModel" @change="handleValidateArea">
          <el-radio :label="tplEnum.valuationWay.number">按件数</el-radio>
          <el-radio :label="tplEnum.valuationWay.weight">按重量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="适用区域:" prop="freightTemplateAreaDTOList" v-if="tplForm.type === tplEnum.type.buyerBear">
        <el-button @click="handleAddNewArea">
          新增区域
        </el-button>
        <div class="default-tpl">
          <span class="label">默认运费:</span>
          <div class="item">
            <div class="title">首件({{ tplForm.valuationModel ? 'kg' : '个' }})</div>
            <el-input size="mini" v-model="tplForm.defaultFirst" @change="handleValidateArea"></el-input>
          </div>

          <div class="item">
            <div class="title">运费(元)</div>
            <el-input size="mini" v-model="tplForm.defaultFirstFreight" @change="handleValidateArea"></el-input>
          </div>
          <div class="item">
            <div class="title">续件({{ tplForm.valuationModel ? 'kg' : '个' }})</div>
            <el-input size="mini" v-model="tplForm.defaultContinues" @change="handleValidateArea"></el-input>
          </div>
          <div class="item">
            <div class="title">续费(元)</div>
            <el-input size="mini" v-model="tplForm.defaultContinueFreight" @change="handleValidateArea"></el-input>
          </div>
          <div class="freight-tip" style="margin-left: 57px">除指定区域外，其余地区运费采用“默认运费”</div>
        </div>
        <div class="freight-tip" v-if="tplForm.type === tplEnum.type.freeShipping">
          除指定区域外，其余地区运费采用“卖家包邮”
        </div>
        <el-table
          class="wkt-table"
          style="margin-left: -80px"
          :data="tplForm.freightTemplateAreaDTOList"
          v-if="tplForm.freightTemplateAreaDTOList.length"
        >
          <el-table-column label="区域">
            <template slot-scope="scope">
              <span class="area-contents">{{ computeAreaTitle(scope.row) }}</span>
              <div>
                <a href="javascript:;" class="table-href" @click="handleEditArea(scope.$index)">编辑</a>
                <a href="javascript:;" class="table-href" @click="handleRemoveArea(scope.$index)">删除</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="tplForm.valuationModel ? '首件(kg)' : '首件(个)'" width="120" align="center">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.first" @change="handleValidateArea"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="运费(元)" width="120" align="center">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.firstFreight" @change="handleValidateArea"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="tplForm.valuationModel ? '续件(kg)' : '续件(个)'" width="120" align="center">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.continues" @change="handleValidateArea"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="续费(元)" width="120" align="center">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.continueFreight" @change="handleValidateArea"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item class="default-tpl-item">
        <el-checkbox label="设为默认模板" v-model="tplForm.default"></el-checkbox>
      </el-form-item>

    </el-form>

    <div class="bottom-button">
      <div class="button-center">
        <el-button class="option-btn" type="primary" @click="submitForm('tplForm')">保存</el-button>
        <el-button class="option-btn" @click="cancelEdit">取消</el-button>
      </div>
    </div>
    <area-select-dialog
      v-model="showAreaSelectDialog"
      :selected-areas="
        tplForm.freightTemplateAreaDTOList[curEditAreaItemIndex]
          ? tplForm.freightTemplateAreaDTOList[curEditAreaItemIndex].regionDTOS
          : []
      "
      @choosed="onAreasChoosed"
    >
    </area-select-dialog>
  </div>
</template>

<script>
import regexps from '@/dss-common/utils/regexps.js';
import floatNumUtil from '@/dss-common/utils/float-num.js';
import wxFreightTplApi from '@/dss-wechat3rd/src/api/wx-freight-tpl-api.js';
import AreaSelectDialog from '@/dss-wechat3rd/src/bz_components/area-select-dialog/index.vue';
import tplEnum from './tpl-enum.js';

export default {
  name: 'add-freight',
  components: {
    AreaSelectDialog
  },
  data() {
    const areaValidator = (rule, value, callback) => {
      const freightTemplateAreaDTOList = this.tplForm.freightTemplateAreaDTOList;
      const toggleReg = this.tplForm.valuationModel ? regexps.littleNum : regexps.littleIntNum;
      const errorArea =
        freightTemplateAreaDTOList &&
        freightTemplateAreaDTOList.find(tpl => {
          return (
            !tpl.first ||
            // tpl.firstFreight ||
            !tpl.continues ||
            // !tpl.continueFreight ||
            !toggleReg.reg.test(tpl.first) ||
            !regexps.littleNum.reg.test(tpl.firstFreight) ||
            !toggleReg.reg.test(tpl.continues) ||
            !regexps.littleNum.reg.test(tpl.continueFreight)
          );
        });
      //买家承担运费需要检测默认运费的正则；卖家包邮则无需检测默认运费
      if (
        !!errorArea ||
        ((!this.tplForm.defaultFirst ||
          !toggleReg.reg.test(this.tplForm.defaultFirst) ||
          // !this.tplForm.defaultFirstFreight ||
          !regexps.littleNum.reg.test(this.tplForm.defaultFirstFreight) ||
          !this.tplForm.defaultContinues ||
          !toggleReg.reg.test(this.tplForm.defaultContinues) ||
          // !this.tplForm.defaultContinueFreight ||
          !regexps.littleNum.reg.test(this.tplForm.defaultContinueFreight)) &&
          this.tplForm.type === tplEnum.type.buyerBear)
      ) {
        if (this.tplForm.valuationModel) {
          callback(Error('请输入正确的数值，重量、运费' + regexps.littleNum.msg));
        } else {
          callback(Error('请输入正确的数值，件数' + regexps.littleIntNum.msg + '；运费' + regexps.littleNum.msg));
        }
      } else {
        callback();
      }
    };
    return {
      tplEnum,
      loading: false,
      showAreaSelectDialog: false,
      tplId: this.$route.query.tplId,
      editable: true, // 是否可以编辑，默认可以编辑，当是编辑模板信息，且接口请求失败时，设置为不可编辑
      curEditAreaItemIndex: 0,
      tplForm: {
        name: null,
        type: 0,
        valuationModel: 0,
        freightTemplateAreaDTOList: [],
        default: false,
        defaultFirst: null,
        defaultFirstFreight: null,
        defaultContinues: null,
        defaultContinueFreight: null
      },
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        type: [{ required: true }],
        valuationModel: [{ required: true }],
        freightTemplateAreaDTOList: [{ required: true, validator: areaValidator.bind(this), trigger: 'change' }]
      }
    };
  },
  computed: {
    computeAreaTitle() {
      return function(item) {
        return item.regionDTOS
          .map(region => {
            return region.regionName;
          })
          .join(';');
      };
    }
  },
  mounted() {
    if (this.tplId) {
      this.fetchTplDetail();
    }
  },
  methods: {
    fetchTplDetail() {
      this.loading = true;
      const params = {
        templateId: this.tplId
      };
      wxFreightTplApi
        .getTplDetail(params)
        .done(
          res => {
            this.tplForm = res.data;

            // 服务端数据转换成客户端数据展示；kg 处除以1000， 元 除以100
            if (this.tplForm.valuationModel) {
              this.tplForm.defaultFirst = floatNumUtil.floatDiv(this.tplForm.defaultFirst, 1000);
              this.tplForm.defaultContinues = floatNumUtil.floatDiv(this.tplForm.defaultContinues, 1000);
            }
            this.tplForm.defaultFirstFreight = floatNumUtil.floatDiv(this.tplForm.defaultFirstFreight, 100);
            this.tplForm.defaultContinueFreight = floatNumUtil.floatDiv(this.tplForm.defaultContinueFreight, 100);
            if (!this.tplForm.freightTemplateAreaDTOList) {
              this.tplForm.freightTemplateAreaDTOList = [];
            }
            this.tplForm.freightTemplateAreaDTOList.forEach(tplArea => {
              if (this.tplForm.valuationModel) {
                tplArea.first = floatNumUtil.floatDiv(tplArea.first, 1000);
                tplArea.continues = floatNumUtil.floatDiv(tplArea.continues, 1000);
              }
              tplArea.firstFreight = floatNumUtil.floatDiv(tplArea.firstFreight, 100);
              tplArea.continueFreight = floatNumUtil.floatDiv(tplArea.continueFreight, 100);
            });
          },
          error => {
            this.editable = false;
          }
        )
        .always(() => {
          this.loading = false;
        });
    },
    handleAddNewArea() {
      this.curEditAreaItemIndex = this.tplForm.freightTemplateAreaDTOList.length;
      this.showAreaSelectDialog = true;
    },
    handleEditArea(index) {
      this.curEditAreaItemIndex = index;
      this.showAreaSelectDialog = true;
    },
    handleRemoveArea(index) {
      this.tplForm.freightTemplateAreaDTOList.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          const params = this.$plain(this.tplForm);
          const valuationModel = params.valuationModel;
          if (valuationModel) {
            params.defaultFirst *= 1000;
            params.defaultContinues *= 1000;
          }
          params.defaultFirstFreight *= 100;
          params.defaultContinueFreight *= 100;

          params.freightTemplateAreaDTOList.forEach(tplArea => {
            if (valuationModel) {
              tplArea.first *= 1000;
              tplArea.continues *= 1000;
            }
            tplArea.firstFreight *= 100;
            tplArea.continueFreight *= 100;
          });
          //更新或者新增运费模板
          const addOrUpdateRequest = this.tplId
            ? wxFreightTplApi.updateFreightTpl(params)
            : wxFreightTplApi.addFreightTpl(params);
          addOrUpdateRequest
            .done(res => {
              if (res.success) {
                this.$router.replace('/warehouse/logistics-setting');
              }
            })
            .always(() => {
              this.loading = false;
            });
        }
      });
    },
    cancelEdit() {
      this.$router.back();
    },
    onAreasChoosed(choosedAreas) {
      const freightTemplateAreaDTOList = this.tplForm.freightTemplateAreaDTOList;
      if (this.curEditAreaItemIndex === freightTemplateAreaDTOList.length) {
        this.$set(this.tplForm.freightTemplateAreaDTOList, this.curEditAreaItemIndex, {
          first: null,
          firstFreight: null,
          continues: null,
          continueFreight: null,
          regionDTOS: null
        });
      }
      freightTemplateAreaDTOList[this.curEditAreaItemIndex].regionDTOS = choosedAreas;
    },
    handleValidateArea() {
      this.$refs.tplForm.validateField('freightTemplateAreaDTOList');
    }
  }
};
</script>

<style lang="less">
@header: 48px; //头部高度
@scroll: 17px; //滚动条高度
@footerHeight: 44px; //footer高度
@titleHeight: 58px; //标题高度
.freight-add-container {
  background: #fff;
  margin-bottom: 35px;
  min-height: calc(100vh - @header - @footerHeight - @titleHeight - 10px);
  .button-center {
    button {
      margin-right: 0px;
    }
  }
  .wkt-table {
    .el-input--mini .el-input__inner {
      width: 96px !important;
    }
  }
  .tpl-form {
    padding-top: 20px;
  }

  .default-tpl-item {
    .el-form-item__content {
      margin-left: 20px !important;
    }
  }

  .default-tpl {
    margin-top: 20px;

    .item {
      display: inline-block;
      width: 100px;
    }

    .label {
      margin-top: 20px;
    }

    .title,
    .label {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 17px;
      text-align: center;
    }
  }

  .freight-tip {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 17px;
  }

  .area-contents {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 17px;
  }

  .area-option-btn {
    cursor: pointer;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(46, 141, 255, 1);
    line-height: 17px;
  }

  .area-option-btn + .area-option-btn {
    margin-left: 20px;
  }
}
</style>
