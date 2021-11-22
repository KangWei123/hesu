<template>
  <div class="second-category-explain">
    <div>{{breadcrumb}}</div>
    <div class="explain-form">
      <el-form ref="form" :model="skuTree" label-width="80px">
        <el-form-item label="了解更多">
          <el-select v-model="skuTree.moreInfoUrl" placeholder="请选择自定义页">
            <el-option
              v-for="(item, i) in customPages"
              :key="i"
              :label="item.name"
              :value="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" v-model="skuTree.moreInfoExplain"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/business-common/store.js';
import service from '@/dss-wechat3rd/src/api/index.js';

export default {
  name: 'second-category-explain',
  props: {
    breadcrumb: {
      type: String,
      default: ''
    },
    // 当前操作的分类
    skuTree: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      curTemplateId: 'sellerTemplateId',
      customPages: 'customPages'
    })
  },
  mounted() {
    this.getCustomPages();
  },
  methods: {
    // 获取所有的自定义页
    getCustomPages() {
      if (this.customPages && this.customPages.length) return;
      service
        .getCustomPages({
          sellerTemplateId: this.curTemplateId
        })
        .then(response => {
          if (response.success === true) {
            store.commit('set_customPages', response.data);
          }
        });
    }
  }
};
</script>