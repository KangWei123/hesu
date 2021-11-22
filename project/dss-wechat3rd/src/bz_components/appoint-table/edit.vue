<template>
  <el-form label-width="120px" style="margin:0;padding:0;" class="dss-form">
    <el-form-item label="预约门店">
      <span>{{form.storeName}}</span>
    </el-form-item>
    <el-form-item label="预约时间">
        <el-date-picker
          v-model="form.scheduledDay"
          align="right"
          type="date"
          :picker-options="datePickerOptions"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-select
          style="margin-top: 10px;"
          v-model="form.scheduledHour"
          :picker-options="timeOptions"
          placeholder="选择时间">
        </el-time-select>
    </el-form-item>
    <el-form-item label="预约服务">
      <span>{{form.itemName}}</span>
    </el-form-item>
    <el-form-item label="技师">
      <span>{{form.technicianName || '未指定'}}</span>
    </el-form-item>
    <el-form-item label="备注">
      <div style="width:300px;height:75px;">{{form.orderMessage}}</div>
    </el-form-item>
  </el-form>
</template>
<style>



</style>
<script>
  import saeApi from '@/dss-wechat3rd/src/api/scheduledAndEmployeeMgr';

  export default {
    props: {
      //预约对象
      appoint: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        form: {
          orderNo: '',
          itemName: '',
          orderMessage: '',
          scheduledDay: '',
          scheduledHour: '',
          technicianId: '',
          technicianName: ''
        },

        // 日期范围限制
        datePickerOptions: {
          disabledDate(time) {
            return time < Date.now() - 1 * 24 * 60 * 60 * 1000; //减去一天的时间代表可以选择同一天;
          }
        },

        // 时间范围限制
        timeOptions: {
          start: '00:00',
          step: '00:30',
          end: '24:00'
        }
      };
    },
    mounted() {
      const { id, orderMessage, storeName, itemName, technicianName, technicianId, scheduledTime } = this.appoint;

      this.form.orderMessage = orderMessage;
      this.form.technicianName = technicianName;
      this.form.technicianId = technicianId;
      this.form.itemName = itemName;
      this.form.orderNo = id;
      this.form.storeName = storeName;

      if (scheduledTime) {
        let array = scheduledTime.split(' ');
        this.form.scheduledDay = new Date(array[0]);
        this.form.scheduledHour = array[1].split('-')[0];
      }
    },
    methods: {
      cancel() {
        this.$emit('cancel');
      },
      to2Num(n) {
        return n > 10 ? '0' + n : n;
      },
      getEmployee() {
        saeApi.getEmployeeList();
      },
      //保存预约
      collect() {
        const { scheduledDay, scheduledHour, technicianId } = this.form;
        let scheduledTime;
        //更新日期
        if (!!scheduledHour && !!scheduledDay) {
          scheduledTime = new Date(scheduledDay.getTime());
          let hourMin = scheduledHour.split(':');
          scheduledTime.setHours(hourMin[0] - 0);
          scheduledTime.setMinutes(hourMin[1] - 0);
        } else {
          this.$message({ message: '预约时间无效', type: 'warning' });
          return;
        }
        return {
          orderNoStr: this.form.orderNo,
          scheduledTime: scheduledTime.toString(),
          technicianId: technicianId
        };
      }
    }
  };
</script>
