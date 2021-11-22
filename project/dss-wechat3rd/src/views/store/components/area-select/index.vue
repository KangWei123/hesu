<template>
  <el-cascader :options="list" :props="props" :expand-trigger="expandTrigger" :placeholder="placeholder" :show-all-levels="showAllLevels" v-model="selectedOptions"
    @change="handleChange">
  </el-cascader>
</template>

<script>
  export default {
    props: {
      value: '',
      label: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default() {
          return [];
        }
      },
      level: {
        type: Number,
        default: -1
      },
      props: {
        type: Object,
        default() {
          return {
            label: 'name',
            children: 'childNode',
            value: 'id'
          };
        }
      },
      showAllLevels : {
        type: Boolean,
        default: false
      },
      expandTrigger: {
        type: String,
        default: 'hover',
      },
      placeholder: {
        type: String,
        default: '请选择'
      }
    },
    data() {
      return {
        selectedOptions: []
      };
    },
    computed: {
      list() {
        if(this.level === -1) {
          return this.options;
        }
        let index = 1;
        return this.getChildren(this.options, 0) || [];
      }
    },
    watch: {
      value(value) {
        this.setValue();
        //this.$emit('update:label', label)
      },
      selectedOptions(val) {
        let value = '', label = '';

        if(val && val.length) {
          const len = val.length;
          for(let i= 0;i<3;i++) {
            value += `-${i< len ? val[i] : 'NA'}`
          }

          // 查找label路径
          let nodes = this.list;
          for(const id of this.selectedOptions) {
            const findedNode = nodes.find(n => n.id === id);
            if(findedNode) {
              label += '-' + findedNode.name;
              if(findedNode.childNode && findedNode.childNode.length) {
                nodes = findedNode.childNode
              }else {
                break;
              }
            }else {
              break;
            }

          }
        }
        this.$emit('input', value.replace('-', ''))
        this.$emit('update:label', label.replace('-', ''))
      }
    },
    mounted () {
      if(this.value) {
        this.setValue();
      }
    },
    methods: {
      handleChange() {

      },
      setValue() {
        const value = this.value;
        if(!value && this.selectedOptions.length) {
          this.selectedOptions = [];
        }else {
          const ids = (value+'').split('-');
          let selection = [];
          for(const id of ids) {
            if(id && id !== 'NA') {
              selection.push(parseInt(id));
            }
          }
          this.selectedOptions = selection;
        }
      },
      getPathById(id) {
        let path = [];
        this.find(this.list, id, path);
        return path.reverse();
      },
      find(list, id, path) {
        for(let item of list) {
          if(item.id === id) {
            path.push(item);
            return true;
          }

          if(item.childNode && item.childNode.length) {
            if(this.find(item.childNode, id, path)) {
              path.push(item);
              return true;
            }
          }
        }
        return false;
      },
      getChildren(nodes, index) {
        if(this.level <= index || !nodes || nodes.length === 0) {
          return;
        }

        let objs = [];
        for(let node of nodes) {
          const obj = {name: node.name, id: node.id}
          let result = this.getChildren(node.childNode, index+1)
          // 节点有子节点，push进去。节点的指定级别之后没有子节点，不影响，push进去
          if(result && result.length || (index+ 1) === this.level) {
            objs.push(obj);
            obj.childNode = result
          }

        }
        return objs;
      }
    }
  }
</script>
