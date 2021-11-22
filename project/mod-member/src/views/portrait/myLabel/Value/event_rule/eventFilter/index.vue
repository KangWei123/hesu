<template>
  <li>
    <!-- 一级选择 -->
    <el-select v-model="filterParam">
      <el-option
        v-for="option in filterParamOptions"
        :key="option.paramCode"
        :label="option.paramName"
        :value="option.paramCode"
      />
    </el-select>
    <!-- 二级选择 -->
    <el-select v-model="operator">
      <el-option
        v-for="option in operatorOptions"
        :key="option.filterCode"
        :label="option.filterName"
        :value="option.filterCode"
      />
    </el-select>
    <!-- 值 -->
    <template v-if="filterParamOptions">
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
    <!-- 删除按钮 -->
    <i class="remove" @click="$emit('remove')" v-if="!$route.query.id"></i>
  </li>
</template>
<script src="./index.js"></script>
<style scoped src="./index.css" />
