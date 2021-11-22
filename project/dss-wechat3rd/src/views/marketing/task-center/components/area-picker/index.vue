<template>
  <el-cascader expand-trigger="hover"
    @active-item-change="handleItemChange"
    :options="areas"
    size="mini"
    class="warehouse-input"
    placeholder="请选择所属区域"
    :props="{label:'name', value: 'id', children: 'childNode'}"
    v-model="myArea"
    @change="handleChange"
    separator="-"></el-cascader>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/task-center.js';

export default {
  props: {
    //选中的值
    area: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  watch: {
    area: {
      immediate: true,
      handler(newVal, oldVal) {
        this.myArea = newVal;
        this.fetchInitAreas(0, this.myArea);
      }
    }
  },

  data() {
    return {
      areas: [],
      myArea: []
    };
  },

  mounted() {
    this.fetchAreas().done(() => {
      this.fetchInitAreas(0, this.myArea);
    });
  },
  methods: {
    handleItemChange(ids) {
      if (ids && ids.length) {
        this.fetchAreas(ids[ids.length - 1]);
      }
    },

    handleChange() {
      const areas = this.getPath(this.myArea || []);
      this.$emit('choose', areas, this.myArea);
    },

    fetchAreas(id) {
      if (id) {
        const node = this.getNodeById(this.areas, id);
        if (!node || node.isloaded) {
          return;
        }
        return api.queryRegion(id).done(({ data }) => {
          node.isloaded = true;
          node.childNode = this.addChildren(data);
        });
      }

      return api.queryRegion().done(({ data }) => {
        this.areas = this.addChildren(data);
      });
    },

    addChildren(nodes) {
      if (!nodes || nodes.length === 0) {
        return null;
      }
      for (const node of nodes) {
        if (!node.isLeaf) {
          node.childNode = [];
        }
      }
      return nodes;
    },

    getNodeById(areas, id) {
      for (const area of areas) {
        if (area.id === id) {
          return area;
        }
        if (area.childNode && area.childNode.length) {
          const findedNode = this.getNodeById(area.childNode, id);
          if (findedNode) {
            return findedNode;
          }
        }
      }
    },

    // 获取路径初始化值
    fetchInitAreas(index, ids) {
      if (index >= ids.length || index >= 2) {
        // 超过数组和3级节点，不加载
        return;
      }

      const promise = this.fetchAreas(ids[index]);
      if (promise) {
        promise.done(() => {
          this.fetchInitAreas(index + 1, ids);
        });
      } else {
        this.fetchInitAreas(index + 1, ids);
      }
    },

    getPath(areaIds) {
      let list = this.areas;
      const path = [];
      for (const areaId of areaIds) {
        const finded = list.find(a => a.id === areaId);
        if (!finded) {
          return path;
        }
        path.push(finded);
        list = finded.childNode;
      }
      return path;
    }
  }
};
</script>
<style>
</style>
