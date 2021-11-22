<template>
  <div class="graph-preview">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/marketing-graph/list' }">营销图文</el-breadcrumb-item>
      <el-breadcrumb-item>营销图文预览</el-breadcrumb-item>
    </el-breadcrumb>
    <preview-graph :title="title"
                   :updateTime="date"
                   :content="content"/>
  </div>
</template>

<script>
import PreviewGraph from '@/dss-wechat3rd/src/components/preview-page/index.vue';
export default {
  name: 'graph-add',
  components: {
    PreviewGraph
  },
  data() {
    return {
      title: '',
      date: 0,
      content: ''
    };
  },
  methods: {},
  mounted() {
    let previewInfo = localStorage.getItem('_market_graph_preview');
    let params = previewInfo ? JSON.parse(previewInfo) : {};
    this.title = params.title;
    this.date = params.date;
    this.content = params.content;
  },
  beforeDestroy() {
    localStorage.removeItem('_market_graph_preview');
  }
};
</script>

<style lang="less">
.graph-preview {
  padding-bottom: 30px;
}
</style>
