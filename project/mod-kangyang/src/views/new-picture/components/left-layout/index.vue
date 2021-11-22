<template>
  <div class="left-layout">
    <category-tree
      height="calc(100vh - 155px)"
      @nodeClick="handleNodeClick"
      ref="tree"
      :default-key="defaultKey"
      :show-operation="false"
    ></category-tree>
  </div>
</template>

<script>
  import categoryTree from '../category-tree/index.vue';

  export default {
    name: 'LeftLayout',
    components: { categoryTree },
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    props: {
      defaultKey: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        currentPath: '/materials/picture/list',
      };
    },
    computed: {
      isPicture() {
        return this.isElderSpace || this.$route.path.includes(this.currentPath);
      },
    },
    methods: {
      refresh() {
        this.$refs.tree.queryTree();
      },

      handleNodeClick(node) {
        if (this.isPicture) {
          this.$emit('nodeClick', node);
        } else {
          this.$router.push({
            path: this.currentPath,
            query: {
              id: node.id,
            },
          });
        }
      },
    },
  };
</script>
