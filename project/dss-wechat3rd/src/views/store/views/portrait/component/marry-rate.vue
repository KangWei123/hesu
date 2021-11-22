<template>
  <div>
    <el-card v-loading="loading"
             style="height:455px">
      <div slot="header">
        <h2 class="dss_portrait_title">婚恋人群占比</h2>
      </div>

      <el-row>
        <el-col :span="24">
          <chart :svg="true"
                 :options="dataMarital.options"
                 height="241px"></chart>
        </el-col>
        <el-col :span="24">
          <div class="dss_portrait_people"
               style="text-align:center">
            <div class="people-item"
                 style="margin-right:12px;">
              <div class="item-num primary-color">
                {{rate(dataMarital.married)}}<span class="rate-symbole">%</span>
              </div>
              <div>婚恋人士</div>
              <span class="item-point "
                    style="background: #487CED"></span>
            </div>
            <div class="people-item"
                 style="margin-left:12px">
              <div class="item-num danger-color">
                {{rate(dataMarital.unmarried)}}<span class="rate-symbole">%</span>
              </div>
              <div>单身人士</div>
              <span class="item-point"
                    style="background: #FF5C56"></span>
            </div>
          </div>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>
r
