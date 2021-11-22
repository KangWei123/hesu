<template>
  <el-dialog
    class="rule-set-dialog"
    title="规则设置"
    ref="ruleDialog"
    :before-close="beforeClose"
    :visible.sync="showRuleDialog"
    width="35%"
  >
    <el-form class="rule-form" v-if="showRuleDialog">
      <h6>数据范围</h6>
      <el-radio style="display: block; padding: 21px 0 36px 0">按筛选条件</el-radio>
      <div class="filter-rules" v-if="distributeRule">
        <div class="filter-rule-item" v-for="(conditionRule, index) in distributeRule.conditionRuleList" :key="index">
          <el-select v-model="conditionRule.fieldName">
            <el-option
              v-for="fieldName in fieldNames"
              :key="fieldName.value"
              :label="fieldName.label"
              :value="fieldName.value"
              :disabled="fieldName.disabled"
            />
          </el-select>
          <el-select @change="funcTypeChange(index)" v-model="conditionRule.funcType">
            <el-option
              v-for="funcType in funcTypes[index]"
              :key="funcType.value"
              :label="funcType.label"
              :value="funcType.value"
            />
          </el-select>
          <template v-if="fieldValues[index]">
            <el-cascader
              ref="regionSelect"
              v-if="fieldValues[index].type === 'cascader'"
              @active-item-change="handleItemChange"
              @change="onFilterDistrict(conditionRule, index)"
              :options="district"
              placeholder="请选择省 / 市 / 区"
              :props="{ label: 'name', value: 'id', children: 'childNode' }"
              v-model="conditionRule.fieldValueParse"
              clearable
            />
            <el-date-picker
              v-else-if="fieldValues[index].type === 'date'"
              v-model="conditionRule.fieldValueParse"
              :type="fieldValues[index].range ? 'daterange' : 'date'"
              placeholder="选择日期时间"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-input
              v-else
              :type="fieldValues[index].tel ? 'number' : 'text'"
              v-model.trim="conditionRule.fieldValueParse"
              :maxlength="fieldValues[index].tel ? 11 : undefined"
            />
          </template>
          <i
            class="el-icon-delete delete"
            v-if="distributeRule.conditionRuleList.length > 1"
            @click="distributeRule.conditionRuleList.splice(index, 1)"
          />
        </div>
        <div class="filter-rule-item-last" v-if="distributeRule.conditionRuleList.length < 5">
          <i class="el-icon-circle-plus-outline add" @click="onAddRule" />
        </div>
      </div>
      <p class="sub-nav-title">筛选条件可为空，不选择</p>
      <h6>分配范围设置</h6>
      <el-form-item label-width="100px" label="选择导购:">
        <el-select
          multiple
          size="mini"
          default-first-option
          value-key="id"
          @visible-change="$emit('employees')"
          v-model="distributeRule.employeeIdsArr"
          placeholder="请选择"
        >
          <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item.id + ''" />
        </el-select>
      </el-form-item>
      <div class="btn-group">
        <el-button class="btn" type="primary" @click="ok">确定</el-button>
        <el-button class="btn cancel-btn" @click="$emit('close')">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script src="./rule-set-dialog.js"></script>
<style lang="less" scoped src="./rule-set-dialog.less" />
