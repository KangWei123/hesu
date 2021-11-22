/**
使用方式， 传入参数主要是 props 里面的属性，详细使用见 atv-analysis/index.vue
<wkb-bar :custom-option="barCustomOption"
         :url="apiUrl"
         :query-params="queryParams">
</wkb-bar>
*/

<template>
  <div class="da-block wkb-bar"
       v-loading="loading">
    <span class="da-block-title title">{{title}}</span>

    <chart :options="options"
           height="300px"
           v-if="data && data.length">
    </chart>

    <place-holder v-else
                  :height="300" />
  </div>
</template>

<script>
import Chart from '@/dss-common/components/ChartEmpty';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import services from '@/dss-common/utils/services';
import { bar } from '../assembler/index.js';

export default {
  name: 'WkbBar',

  components: {
    Chart,
    PlaceHolder
  },

  props: {
    // 标题
    title: {
      type: String,
      default() {
        return '';
      }
    },

    // 业务自定义 option
    customOption: {
      type: Object,
      default() {
        return null;
      }
    },

    // 查询数据接口地址
    url: {
      type: String,
      default() {
        return '';
      }
    },

    // 接口参数
    queryParams: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  data() {
    return {
      loading: false,
      data: null,
      options: null
    };
  },

  watch: {
    queryParams: {
      deep: true,
      handler() {
        console.log('wkb-bar, queryParams ---->');
        this.apiGetData();
      }
    }
  },

  mounted() {
    // 获取网络数据
    this.apiGetData();
  },

  methods: {
    apiGetData() {
      console.log('-------------->', this.url);
      if (!this.url) {
        return;
      }
      this.loading = true;
      let params = {
        ...this.queryParams
      };

      services
        .get(this.url, {
          params,
          action: '获取趋势柱状图数据'
        })
        .then(res => {
          console.log('wkb-bar, apiGetData------->', res);
          this.data = res.data || [];
          this.options = this.options = bar.assembleBarXOptions(
            this.data,
            this.customOption.keys[0],
            this.customOption.keys[1],
            this.customOption.keys[2],
            null,
            this.customOption.sortedLegend
          );
          this.options.series.forEach(item => {
            item.stack = this.customOption.sortedLegend[0].label;
          });
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
.wkb-bar {
  // width: 100%;
  position: relative;
  vertical-align: top;

  .title {
    position: absolute;
  }
}

@media screen and (max-width: 1280px) {
  .wkb-bar {
    .title {
      position: relative;
    }
  }
}
</style>
