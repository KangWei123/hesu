<template>
  <div class="duration-select">
    <div v-for="(item, idx) of value" :key="item.id" style="margin-top: 20px">
      <el-form :ref="`form${idx}`" inline :model="item" :rules="rules">
        <el-form-item prop="startTime">
          <el-time-select
            v-model="item.startTime"
            format="HH:mm"
            style="width: 100px"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
              maxTime: item.endTime,
            }"
            @change="validatorTime(idx)"
          >
          </el-time-select>
          至
        </el-form-item>
        <el-form-item prop="endTime">
          <el-time-select
            v-model="item.endTime"
            style="width: 100px"
            format="HH:mm"
            :picker-options="{
              minTime: item.startTime,
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            @change="validatorTime(idx)"
          >
          </el-time-select>
        </el-form-item>

        <el-form-item prop="groupNum">
          <span style="margin-left: 10px">
            可预约
            <el-input
              v-model="item.groupNum"
              type="number"
              style="width: 100px"
              min="1"
              oninput="if(value<=0){value=1}"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="item.groupNum = Number(item.groupNum)"
            ></el-input>
            组
          </span>
        </el-form-item>

        <el-form-item prop="groupPeopleNum">
          <span style="margin-left: 10px">
            每组可参观人数
            <el-input
              v-model="item.groupPeopleNum"
              type="number"
              style="width: 100px"
              min="1"
              oninput="if(value<=0){value=1}"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @change="item.groupPeopleNum = Number(item.groupPeopleNum)"
            ></el-input>
            人
          </span>
        </el-form-item>

        <a class="link-action" style="margin-left: 10px" @click="handleRemove(idx)">删除时间段</a>
      </el-form>
    </div>
    <a class="link-action" style="padding-top: 10px; display: inline-block" @click="handleAdd">+ 新增时间段</a>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/index';

  export default {
    name: 'DurationSelect',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        rules: {
          endTime: [
            {
              required: true,
              message: ' ',
              trigger: 'blur',
            },
          ],
          startTime: [
            {
              required: true,
              message: '预约时间段不可为空',
              trigger: 'blur',
            },
          ],
          groupNum: [
            {
              required: true,
              message: '可预约组数不可为空',
              trigger: 'blur',
            },
          ],
          groupPeopleNum: [
            {
              required: true,
              message: '每组可探访人数不可为空',
              trigger: 'blur',
            },
          ],
        },
      };
    },

    methods: {
      handleAdd() {
        const clone = this.value.slice(0);
        clone.push({
          id: 'temp_' + Date.now(),
          startTime: null,
          endTime: null,
          groupPeopleNum: null,
          groupNum: null,
        });
        this.$emit('input', clone);
      },
      handleRemove(idx) {
        const clone = this.value.slice(0);
        clone.splice(idx, 1);
        this.$emit('input', clone);
      },

      /**
       * 判断是否存在相同时间段
       * @param {Number} index 索引
       */
      validatorTime(index) {
        const timeStack = new Map();
        const list = utils.copy(this.value);
        const item = list[index];
        list.forEach((val, idx) => {
          idx !== index && timeStack.set(val.startTime, val.endTime);
        });
        const target = timeStack.get(item.startTime);
        // 存在该时间，判断键值是否相同
        if (target && item.endTime === target) {
          // 命中
          item.endTime = '';
          this.$message.warning('该预约时间段已存在');
          this.$emit('input', list);
        }
      },
    },
  };
</script>

<style scoped lang="less">
  .duration-select /deep/ .el-input input[type='number'] {
    text-align: center;
  }

  .duration-select /deep/ input[type='number'] {
    -moz-appearance: textfield;
  }

  .duration-select /deep/ input[type='number']::-webkit-inner-spin-button,
  .duration-select /deep/ input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .link-action {
    color: #468bff;
  }
</style>
