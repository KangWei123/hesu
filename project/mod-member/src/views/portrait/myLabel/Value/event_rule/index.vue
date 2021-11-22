<template>
  <li>
    <div class="field">
      在
      <el-select v-model="timeParams" :allow-create="allowCreate" filterable @change="onDayRangeChanged">
        <el-option v-for="item in timeTypes" :key="item" :label="item + '天'" :value="item" /> </el-select
      >内，发生
      <el-select v-model="field" :loading="!fieldOptions">
        <el-option v-for="option in fieldOptions" :key="option.event" :label="option.eventName" :value="option.event" />
      </el-select>
      <span @click="addFilter" v-if="!$route.query.id && fieldOptions && eventFilters">+添加过滤条件</span>
      <i class="remove" @click="$emit('remove')" v-if="!$route.query.id"></i>
    </div>
    <div class="filters" v-if="fieldOptions && eventFilters">
      <var
        :content="['或', '且'][eventFilter.relation]"
        @click="changeRelation"
        v-if="eventFilter.subFilters.length > 1"
      ></var>
      <ol>
        <event-filter
          v-for="(item, index) in eventFilter.subFilters"
          :key="item.key"
          :item="item"
          @remove="eventFilter.subFilters.splice(index, 1)"
        />
      </ol>
    </div>
    <div class="measure">
      <!-- 一级选择 -->
      <el-cascader
        :options="measureOptions"
        :props="{ value: 'paramCode', label: 'paramName', children: 'measures' }"
        v-model="measure"
      ></el-cascader>
      <!-- 二级选择 -->
      <el-select v-model="operator" :loading="!fieldOptions">
        <el-option
          v-for="option in operatorOptions"
          :key="option.filterCode"
          :label="option.filterName"
          :value="option.filterCode"
        />
      </el-select>
      <!-- 值 -->
      <template v-if="fieldOptions">
        <el-input v-model="params" :type="paramsWidget.type" v-if="paramsWidget.dom === 'el-input'" />
        <el-date-picker v-model="params" :type="paramsWidget.type" v-else-if="paramsWidget.dom === 'el-date-picker'" />
        <el-select v-model="params" :loading="!paramsWidget.options" v-else-if="paramsWidget.dom === 'el-select'">
          <el-option
            v-for="option in paramsWidget.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <template v-else-if="paramsWidget.dom === 2">
          <el-input v-model="params[0]" :type="paramsWidget.type" />
          <span>-</span>
          <el-input v-model="params[1]" :type="paramsWidget.type" />
        </template>
      </template>
    </div>
  </li>
</template>
<script src="./index.js"></script>
<style scoped src="./index.css" />
