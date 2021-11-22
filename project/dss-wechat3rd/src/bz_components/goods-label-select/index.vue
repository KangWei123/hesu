<template>
  <el-select v-model="labelId" :multiple="multiple" placeholder="请选择" @change="handleChange">
    <el-option
      v-for="item in labelOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>
<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';

export default {
  data() {
    return {
      labelId: null,
      labelOptions: []
    };
  },
  props: {
    //父组件传过来的选中的标签对象
    labelSelectedObj: {
      type: Object,
      default: function() {
        return null;
      }
    },
    selectLabelId: {
      type: [Number, String, Array],
      default: null
    },
    labelType: {
      type: Number,
      default: 0
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    selectLabelId(newVal) {
      if (newVal) {
        this.labelId = newVal;
      }
    }
  },

  methods: {
    // 标签列表查询
    labelList() {
      const params = {
        type: this.labelType,
        status: 1
      };
      const url = constants.Api.goods.label.list;
      services
        .get(url, {
          params,
          action: '标签列表'
        })
        .done(res => {
          if (res.data && res.data.length) {
            this.labelOptions.length = 0; //将标签下来的options对象清空，以免快速增加标签的时候没有刷新标签列表对象
            this.labelOptions = res.data.map(label => {
              return { value: label.id, label: label.label };
            });
            this.labelId = this.selectLabelId;
            var temp = [];
            for (const selectId in this.selectLabelId) {
              var isExist = false;
              for (const obj in this.labelOptions) {
                if (obj.id === selectId) isExist = true;
              }
              if (isExist) {
                temp.push(selectId);
              }
            }
            this.labelId = temp;
          } else {
            this.labelOptions.push({ value: '-1', label: '暂无标签', disabled: true });
          }
          if (this.selectLabelId) this.labelId = this.selectLabelId;
        });
    },

    //选中改变标签
    handleChange(value) {
      this.$emit('selectedLabelId', value);
    }
  },
  mounted() {
    // 标签列表查询
    this.labelList();
  }
};
</script>
