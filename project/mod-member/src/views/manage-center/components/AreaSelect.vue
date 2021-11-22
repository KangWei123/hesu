<template>
  <div>
    <el-select
      v-model="provinceId"
      size="mini"
      placeholder="省"
      @change="handleChangeProvince"
      style="width: 95px"
      :disabled="disabled"
      :readonly="readonly"
      clearable
      filterable
    >
      <el-option v-for="item in provinces" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-select
      v-model="cityId"
      size="mini"
      placeholder="市"
      @change="handleChangeCity"
      style="width: 95px; margin-left: -6px"
      :disabled="disabled"
      :readonly="readonly"
      clearable
      filterable
    >
      <el-option v-for="item in citys" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <!-- <el-select
      v-model="districtId"
      size="mini"
      placeholder="区"
      @change="handleChangeDistrict"
      style="width: 120px;"
      :disabled="disabled"
      clearable
      filterable
    >
      <el-option v-for="item in districts" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select> -->
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/manage.js';

  export default {
    name: 'AreaSelect',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      initArea: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        provinces: [], // 省列表
        provinceId: null, //
        citys: [], // 市
        cityId: null,
        districts: [], // 区
        districtId: null,
      };
    },
    watch: {
      initArea(newVal, oldVal) {
        if (newVal && newVal.length) {
          this.provinceId = newVal[0];
          this.handleChangeProvince();
          this.cityId = newVal.length >= 2 && newVal[1];
          this.handleChangeCity();
          this.districtId = newVal.length >= 3 && newVal[2];
          this.handleChangeDistrict();
        }
      },
    },
    mounted() {
      this.fetchAreas();

      // 用于缓存省市区，避免多次查询
      this.cacheAreas = {};
    },
    methods: {
      // 查询省
      fetchAreas() {
        return api.region().done(({ data }) => {
          this.provinces = data;
        });
      },

      // 查询下级市区
      getAreaById(id) {
        return this.cacheAreas[id] || null;
      },

      // 选择省
      handleChangeProvince() {
        this.citys = [];
        this.cityId = null;
        this.districtId = null;
        this.districts = [];

        // 清空
        if (!this.provinceId) {
          // 清空
          this.$emit('clear', { district: '', city: '', province: '' });
          return;
        }

        // 传递 省级id
        this.$emit('change', { province: this.provinceId });

        // 从缓存中读取数据
        const citys = this.getAreaById(this.provinceId);
        if (citys) {
          this.citys = citys;
          return;
        }

        api.region(this.provinceId).done(({ data }) => {
          this.citys = data;
          this.cacheAreas[this.provinceId] = data;
        });
      },
      // 选择市
      handleChangeCity() {
        this.districtId = null;
        this.districts = [];

        // 清空
        if (!this.cityId) {
          // 清空
          this.$emit('clear', { district: '', city: '' });
          return;
        }

        // 传递 市级id
        this.$emit('change', { city: this.cityId });

        // 从缓存中读取数据
        const districts = this.getAreaById(this.cityId);
        if (districts) {
          this.districts = districts;
          return;
        }

        api.region(this.cityId).done(({ data }) => {
          this.districts = data;
          this.cacheAreas[this.cityId] = data;
        });
      },
      // 选择区
      handleChangeDistrict() {
        if (!this.districtId) {
          // 清空
          this.$emit('clear', { district: '' });
          return;
        }

        // 传递 区级id
        this.$emit('change', { district: this.districtId });
      },

      // 重置省市区选择框
      clear() {
        this.provinceId = null;
        this.handleChangeProvince();
      },
    },
    beforeDestroy() {
      this.cacheAreas = null;
    },
  };
</script>

<style></style>
