<template>
  <div>
    <el-card v-loading="loading"
             style="height:455px">
      <div slot="header">
        <h2 class="dss_portrait_title">年龄占比</h2>
      </div>
      <chart :options="dataAge.options"
             height="321px"
             v-if="dataAge.data.length"></chart>
      <div v-else>
        暂无数据
      </div>
    </el-card>
  </div>
</template>
