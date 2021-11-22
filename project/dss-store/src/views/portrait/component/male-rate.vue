<template>
  <div>
    <el-card v-loading="loading"
             style="height:455px">
      <div slot="header">
        <h2 class="dss_portrait_title">性别占比</h2>
      </div>
      <el-row class="dss_portrait_sex">
        <el-col :span="12"
                style="text-align:center">
          <img src="../../../asserts/images/boy.png"
               style="height:90px;margin-left: -10px" />
          <div class="item-num primary-color">
            {{rate(dataGender.male)}}<span class="rate-symbole">%</span>
          </div>
          <div>男性</div>
        </el-col>
        <el-col :span="12"
                r
                style="text-align:center">
          <img src="../../../asserts/images/girl.png"
               style="height:90px;margin-left: -10px" />
          <div class="item-num danger-color">
            {{rate(dataGender.female)}}<span class="rate-symbole">%</span>
          </div>
          <div>女性</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
