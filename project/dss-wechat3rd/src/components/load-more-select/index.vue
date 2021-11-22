<template>
  <el-select
    v-model="selectedData"
    :filterable="filterable"
    :multiple="multiple"
    :allow-create="allowCreate"
    :clearable="clearable"
    placeholder="请选择"
  >
    <el-option v-for="item in finalOptions" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]">
    </el-option>
    <el-option v-if="hasMore" :value="undefined">
      <div @click.stop="handleLoadMore($event)">加载更多</div>
    </el-option>
  </el-select>
</template>

<script>
  /**
   * 支持加载更多的下拉选择框
   */
  import services from '@/dss-common/utils/services.js';

  export default {
    name: 'Index',
    props: {
      url: {
        type: String,
        default: '',
      },
      params: {
        type: Object,
        default: function () {
          return null;
        },
      },
      pageSize: {
        type: Number,
        default: 10,
      },
      valueKey: {
        type: String,
        default: 'value',
      },
      labelKey: {
        type: String,
        default: 'label',
      },
      filterable: {
        type: Boolean,
        default: false,
      },
      allowCreate: {
        type: Boolean,
        default: false,
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      clearable: {
        type: Boolean,
        default: false,
      },
      value: {
        type: [Object, Array],
        default: function () {
          return null;
        },
      },
    },
    data() {
      return {
        pageNo: 1,
        options: [],
        originSelectedData: null,
        hasMore: false,
      };
    },
    computed: {
      selectedData: {
        get() {
          const value = this.value;
          if (this.multiple) {
            return (
              value &&
              value.map(item => {
                return item[this.valueKey];
              })
            );
          } else {
            return value && value[this.valueKey];
          }
        },
        set(val) {
          const options = this.options;
          let data = null;
          if (this.multiple) {
            data = [];
            options.forEach(item => {
              if (val.indexOf(item[this.valueKey]) !== -1) {
                data.push(item);
              }
            });
          } else {
            data = options.find(item => {
              return item[this.valueKey] === val;
            });
          }

          this.$emit('input', this.$plain(data));
        },
      },
      finalOptions() {
        if (this.multiple) {
          return [...this.options, ...(this.originSelectedData || [])];
        } else {
          if (this.originSelectedData) {
            return [this.originSelectedData, ...this.options];
          } else {
            return [...this.options];
          }
        }
      },
    },

    mounted() {
      this.originSelectedData = this.$plain(this.value);
      this.loadData();
    },
    methods: {
      handleLoadMore(event) {
        this.loadData();
      },
      loadData() {
        const { url, params, pageSize, pageNo } = this;
        const reqParams = { ...params, pageSize, pageNo };
        services
          .arrayGet(url, {
            params: reqParams,
          })
          .done(res => {
            const newData = res.data || [];
            if (newData.length) {
              this.filterOldData(newData);
            }
            this.options = this.options.concat(res.data || []);
            this.pageNo++;
            this.hasMore = !(this.options.length && this.options.length >= res.totalCount);
          });
      },
      filterOldData(newData) {
        if (this.multiple) {
          if (this.originSelectedData && this.originSelectedData.length) {
            this.originSelectedData = this.originSelectedData.filter(item => {
              const findItem = newData.find(newItem => {
                return newItem[this.valueKey] === item[this.valueKey];
              });
              return !findItem;
            });
          }
        } else {
          if (this.originSelectedData) {
            const findItem = newData.find(newItem => {
              return newItem[this.valueKey] === this.originSelectedData[this.valueKey];
            });
            if (findItem) {
              this.originSelectedData = null;
            }
          }
        }
      },
    },
  };
</script>

<style scoped></style>
