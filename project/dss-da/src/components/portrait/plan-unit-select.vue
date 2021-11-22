<template>
    <el-cascader class="dsp-round" size="small"
        v-model="curValue"
        :options="options"
        @active-item-change="onSelectPlan"
    ></el-cascader>
</template>

<script>
import api from './common/api';
import service from '@/dss-common/utils/services';

export default {
  props: {
    value: {
      // type: Number,
      // default: 0
    }
  },
  data() {
    return {
      options: []
    };
  },
  computed: {
    curValue: {
      get() {
        if (this.value == null) {
          return [];
        }

        const plan = this.options.find(item => {
          const unit = item.children.find(_item => _item.value === this.value);
          return !!unit;
        });

        return plan ? [plan.value, this.value] : [];
      },
      set(value) {
        this.$emit('input', value[1]);
      }
    }
  },
  created() {
    this.fetchPlans();
  },
  methods: {
    onSelectPlan(params) {
      this.fetchUnits(params[0]);
    },
    fetchPlans() {
      /*const params = {
                url: api.data.planList,
                cache: true,
                fromCache: true
            };*/
      // 这个方法要支持缓存
      return service
        .get(api.data.planList, {
          action: '获取计划列表数据'
        })
        .then(result => {
          this.options = result.value.map(item => {
            return {
              label: item.planName,
              value: item.planId,
              children: []
            };
          });

          // 如果路由没有传递单元ID
          const pid = Number(this.$route.query.pid),
            uid = Number(this.$route.query.uid);
          if (!uid && !pid) {
            // 默认选中第一个计划第一个单元
            if (this.options[0] && this.options[0].value) {
              this.fetchUnits(this.options[0].value).then(() => {
                if (this.options[0].children[0]) {
                  this.curValue = [this.options[0].value, this.options[0].children[0].value];
                }
              });
            }
          } else {
            this.fetchUnits(pid).then(() => {
              this.curValue = [pid, uid];
            });
          }
        });
    },
    fetchUnits(planId) {
      /*const params = {
                url: api.data.unitList,
                cache: true,
                fromCache: true,
                data: {
                    planId
                }
            };*/
      // 这里的数据也要支持缓存
      return service
        .get(api.data.unitList, {
          action: '获取投放单元列表',
          params: {
            planId
          }
        })
        .then(result => {
          const curPlan = this.options.find(item => item.value === planId);
          curPlan.children = result.value.list.map(item => {
            return {
              label: item.unit_name,
              value: item.unit_id
            };
          });
        });
    }
  }
};
</script>
