/**
* 商品标签(跨分类多选)
 */
<template>
  <div>
    <multi-cascader
      :showLoadingIndicator="false"
      separator=":"
      show-all-levels
      :selectChildren="true"
      childrenKey="sub"
      :allowLoadChildren="true"
      labelKey="title"
      :loadChildrenMethod="tagLoadChildrenMethod"
      :panelWidth="'auto'"
      valueKey="id"
      v-model="tags"
      :options="tagList"
      selectWidth="178px"
      size="mini"
    />
    <el-button type="text" round @click="addLabelPopup()">快速增加标签</el-button>
  </div>
</template>

<script>
import MultiCascader from '../multiCascader/index';
import memberApi from '@/dss-wechat3rd/src/api/memberAPI';

export default {
  name: 'goods-tags',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MultiCascader
  },
  data() {
    return {
      tagList: [
        { title: '默认分类', type: 'main', id: '1', childCount: 14 },
        { title: '医药', type: 'main', id: '43', childCount: 1 },
        { title: '新客户-深圳店', type: 'main', id: '42', childCount: 0 },
        { title: '我我我我我我我我我我', type: 'main', id: '41', childCount: 1 },
        { title: '测试分类', type: 'main', id: '40', childCount: 1 },
        { title: '123', type: 'main', id: '32', childCount: 1 },
        { title: '厉害', type: 'main', id: '31', childCount: 4 },
        { title: '测试分类2', type: 'main', id: '30', childCount: 0 },
        { title: '测试商家印象标签分类', type: 'main', id: '29', childCount: 1 },
        { title: '好好', type: 'main', id: '2', childCount: 1 }
      ]
    };
  },
  computed: {
    tags: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
      }
    }
  },
  mounted() {
    this.fetchTagSategory();
  },
  methods: {
    // 获取标签分类
    fetchTagSategory() {
      // todo
    },
    // 获取分类下标签
    tagLoadChildrenMethod(data) {
      // todo......
      // return [{"title":"方法","id":52,"subId":52,"type":"sub","sub":null,"indeterminate":false,parent: {"title":"默认分类","type":"main","id":"1","childCount":14,"indeterminate":false,"checked":false,"hasCheckedChild":false,"loading":false},"checked":false,"hasCheckedChild":false}]
      return memberApi.getTagByCategory({ categoryId: 1 }).done(res => {
        return (res.data || []).map(item => {
          const childMax = data.title.length > 8 ? 8 : 10;
          let title = item.name || '';
          title = title.length > 10 ? title.slice(0, childMax) + '...' : title;
          return {
            title,
            id: item.id,
            subId: item.id,
            type: 'sub',
            sub: null
          };
        });
      });
    },
    addLabelPopup() {}
  }
};
</script>