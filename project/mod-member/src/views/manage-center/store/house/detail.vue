<template>
  <div class="body-wrapper">
    <PageHeader
      ><span style="cursor: pointer" @click="$router.push(`/manage/store/house-info`)"
        >小区线索/{{ ifEdit.title }}</span
      ></PageHeader
    >
    <div class="form-content">
      <el-form
        v-loading="loading.data"
        label-width="136px"
        label-position="right"
        :rules="rules"
        :model="form"
        ref="Form"
      >
        <el-form-item label="小区名称：" prop="name">
          <el-input style="width: 220px" placeholder="请输入小区名称" maxlength="15" v-model.trim="form.name" />
        </el-form-item>
        <el-form-item label="小区性质：" prop="estateNature">
          <el-select v-model="form.estateNature" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in estateNatureOption" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
          <!-- <el-input style="width: 220px" placeholder="请输入" v-model.trim="form.estateNature" /> -->
        </el-form-item>
        <el-form-item label="重要等级：" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in gradeOption" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
          <!-- <el-input style="width: 220px" placeholder="请输入" v-model.trim="form.grade" /> -->
        </el-form-item>
        <el-form-item label="房屋属性" prop="estateStage">
          <el-select v-model="form.estateStage" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in estateStageOption" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
          <!-- <el-input style="width: 220px" placeholder="请输入" v-model.trim="form.estateStage" /> -->
        </el-form-item>
        <el-form-item label="户数：" prop="houseCount">
          <el-input style="width: 220px" placeholder="请输入户数" v-model.trim="form.houseCount" />
        </el-form-item>
        <el-form-item label="栋数：" prop="blockCount">
          <el-input style="width: 220px" placeholder="请输入栋数" v-model.trim="form.blockCount" />
        </el-form-item>
        <el-form-item label="层数：" prop="floorCount">
          <el-input style="width: 220px" placeholder="请输入层数" v-model.trim="form.floorCount" />
        </el-form-item>
        <el-form-item label="交房日期：" prop="deliveryDate">
          <el-date-picker
            v-model="form.deliveryDate"
            style="width: 220px"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="主力户型：" prop="mainHouseType">
          <el-input style="width: 220px" placeholder="请输入" v-model.trim="form.mainHouseType" />
        </el-form-item>
        <el-form-item label="主力面积：" prop="mainHouseArea">
          <el-input style="width: 220px" placeholder="请输入" v-model.trim="form.mainHouseArea" />
        </el-form-item>
        <el-form-item label="小区区域：" prop="district">
          <el-select
            v-model="form.provinceId"
            size="mini"
            placeholder="省"
            @change="handleChangeProvince"
            style="width: 120px"
            clearable
          >
            <el-option v-for="item in provinces" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select
            v-model="form.cityId"
            size="mini"
            placeholder="市"
            @change="handleChangeCity"
            style="width: 120px"
            clearable
          >
            <el-option v-for="item in citys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select
            v-model="form.districtId"
            size="mini"
            placeholder="区"
            @change="handleChangeDistrict"
            style="width: 120px"
            clearable
          >
            <el-option v-for="item in districts" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小区地址：" prop="address">
          <el-input style="width: 220px" placeholder="请输入小区地址" v-model.trim="form.address" />
        </el-form-item>
        <el-form-item label="当前房价：" prop="housePrice">
          <el-input style="width: 100px" placeholder="请输入房价" v-model.trim="form.housePrice" /> 元 / ㎡
        </el-form-item>
        <el-button
          style="margin-left: 45px"
          class="btn-item"
          @click="onSubmit"
          :loading="loading.submit"
          size="mini"
          type="primary"
          >保存</el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
  import '../index.less';
  import utils from '@/dss-common/utils';
  import services from '@/dss-common/utils/services';
  import api from '@/mod-member/src/api/manage-store.js';
  import areaApi from '@/mod-member/src/api/manage';

  import PageHeader from '../components/page-header-tab/page-header';

  const estateNatureOption = ['商品房', '安置房', '单位集资房', '其他'];
  const gradeOption = ['A', 'B', 'C'];
  const estateStageOption = ['精品房', '毛坯房'];

  export default {
    components: {
      PageHeader,
    },
    data() {
      const checkNum = (rule, value, callback) => {
        const reg = /^[1-9]{1}[0-9]*$/;
        if (value && !reg.test(value)) {
          return callback('请正确输入（仅支持正整数）');
        } else {
          return callback();
        }
      };
      return {
        estateNatureOption,
        gradeOption,
        estateStageOption,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        },
        rules: {
          name: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
          houseCount: [{ validator: checkNum, trigger: 'blur' }],
          blockCount: [{ validator: checkNum, trigger: 'blur' }],
          floorCount: [{ validator: checkNum, trigger: 'blur' }],
          deliveryDate: [{ required: true, message: '请选择交房日期', trigger: 'blur' }],
          housePrice: [{ pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '请正确输入价格', trigger: 'blur' }],
        },
        form: {
          name: null,
          houseCount: null,
          blockCount: null,
          floorCount: null,
          deliveryDate: null,
          address: null,
          housePrice: null,
          estateNature: null,
          grade: null,
          estateStage: null,
          mainHouseArea: null,
          mainHouseType: null,
          provinceId: null,
          cityId: null,
          districtId: null,
          province: null,
          city: null,
          district: null,
        },

        loading: {
          submit: false,
          data: false,
        },
        showDialog: false,
        changeArea: false,

        // 门店区域
        provinces: [], // 省列表
        citys: [], // 市
        districts: [], // 区
        cacheAreas: {},
      };
    },
    computed: {
      ifEdit() {
        const { id, storeId, dealerId } = this.$route.query;
        let title = '';
        let action = '';
        if (!id) {
          action = 'add';
          title = '新增';
        } else {
          action = 'edit';
          title = '编辑';
        }
        return {
          id,
          title,
          action,
          storeId,
          dealerId,
        };
      },
    },
    methods: {
      onSubmit() {
        this.$refs.Form.validate(valid => {
          if (!valid) return false;
          this.doSubmit();
        });
      },
      doSubmit() {
        const {
          name,
          houseCount,
          blockCount,
          floorCount,
          deliveryDate,
          address,
          housePrice,
          estateNature,
          grade,
          estateStage,
          mainHouseArea,
          mainHouseType,
          district,
          city,
          province,
          provinceId,
          cityId,
          districtId,
        } = this.form;
        const url = this.ifEdit.action == 'add' ? api.estateCueAddUrl.url : api.estateUpdateAddUrl.url;
        this.loading.submit = true;
        const params = {
          name,
          houseCount,
          blockCount,
          floorCount,
          deliveryDate,
          address,
          housePrice,
          estateNature,
          cityId,
          city,
          province,
          district,
          provinceId,
          districtId,
          grade,
          estateStage,
          mainHouseArea,
          mainHouseType,
          storeId: this.ifEdit.storeId,
          dealerId: this.ifEdit.dealerId,
        };
        if (this.ifEdit.action == 'edit') {
          params.id = this.ifEdit.id;
        }
        services
          .json(url, params, { action: '保存小区' })
          .then(res => {
            this.$message({ type: 'success', message: '操作成功' });
            this.$router.push('/manage/store/house-info?edit=true');
          })
          .catch(err => {
            this.$message.error(err.message);
          })
          .always(() => {
            this.loading.submit = false;
          });
      },

      async initData() {
        try {
          this.loading.data = true;
          const { data } = await api.queryEstateDetail({ estateId: this.ifEdit.id });
          const {
            name,
            houseCount,
            blockCount,
            floorCount,
            deliveryDate,
            address,
            housePrice,
            estateNature,
            grade,
            estateStage,
            mainHouseArea,
            mainHouseType,
            provinceId,
            cityId,
            districtId,
          } = data;
          this.form.name = name || '';
          this.form.grade = this.gradeOption.indexOf(grade) === -1 ? '' : grade;
          this.form.address = address || '';
          this.form.houseCount = houseCount || '';
          this.form.blockCount = blockCount || '';
          this.form.floorCount = floorCount || '';
          this.form.housePrice = housePrice || '';
          this.form.estateStage = this.estateStageOption.indexOf(estateStage) === -1 ? '' : estateStage;
          this.form.deliveryDate = utils.timeFormat(deliveryDate, 'YYYY-MM-DD') || '';
          this.form.estateNature = this.estateNatureOption.indexOf(estateNature) === -1 ? '' : estateNature;
          this.form.mainHouseType = mainHouseType || '';
          this.form.mainHouseArea = mainHouseArea || '';
          this.form.provinceId = provinceId || '';
          this.form.cityId = cityId || '';
          this.form.districtId = districtId || '';
        } finally {
          this.loading.data = false;
        }
      },
      async fetchArea() {
        const { data } = await areaApi.region();
        this.provinces = data || [];
        if (this.form.provinceId) this.getCityList();
      },
      getCityList() {
        const citys = this.getAreaById(this.form.provinceId);
        if (citys) {
          this.citys = citys;
          return;
        }
        areaApi.region(this.form.provinceId).done(({ data }) => {
          this.citys = data;
          this.cacheAreas[this.form.provinceId] = data;
          if (this.form.cityId) this.getDistrictList();
        });
      },
      getDistrictList() {
        const districts = this.getAreaById(this.form.cityId);
        if (districts) {
          this.districts = districts;
          return;
        }
        areaApi.region(this.form.cityId).done(({ data }) => {
          this.districts = data;
          this.cacheAreas[this.form.cityId] = data;
        });
      },

      handleChangeProvince(val) {
        this.citys = [];
        this.districts = [];
        this.form.cityId = null;
        this.form.districtId = null;
        if (!this.form.provinceId) {
          ['city', 'district', 'province'].forEach(item => {
            this.form[item] = null;
          });
          return;
        }
        this.form.province = this.provinces.find(item => item.id == val).name;
        this.getCityList();
      },
      handleChangeCity(val) {
        this.form.districtId = null;
        this.districts = [];
        if (!this.form.cityId) {
          ['city', 'district'].forEach(item => {
            this.form[item] = null;
          });
          return;
        }
        this.form.city = this.citys.find(item => item.id == val).name;
        this.getDistrictList();
      },
      handleChangeDistrict(val) {
        if (!val) {
          this.form.district = null;
          return;
        }
        this.form.district = this.districts.find(item => item.id == val).name;
      },
      // 查询缓存下级市区
      getAreaById(id) {
        return this.cacheAreas[id] || null;
      },
    },
    async mounted() {
      if (this.ifEdit.action === 'edit') {
        await this.initData();
      }
      await this.fetchArea();
    },
    beforeDestroy() {
      this.cacheAreas = null;
    },
  };
</script>
<style lang="less" scoped>
  .form-content {
    padding: 20px;
  }
  .btn-item {
    width: 100px;
    border-radius: 15px;
    font-size: 12px;
  }
</style>
