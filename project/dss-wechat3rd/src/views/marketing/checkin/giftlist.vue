<template>
  <el-table
    :data="inList"
    class="wkt-table"
  >
    <el-table-column
      align="left"
      prop="continueSignedDay"
      :formatter="continueSignedDayFormat"
      label="连续签到天数"
    />
    <el-table-column align="left" prop="giftsType" :formatter="giftsTypeFormat" label="连签奖励" />
    <!--      <el-table-column align="center" prop="giftPhotoUrl" :formatter="giftPhotoUrlFormat" label="奖品图"/>-->

    <el-table-column v-if="canedit" label="操作" width="130">
      <template slot-scope="scope">
        <div>
          <a href="javascript:;" class="table-href" @click="edit(scope.$index)">编辑</a>
          <a href="javascript:;" class="table-href" @click="remove(scope.$index)">删除</a>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'giftList',
  props: {
    inList: {
      type: Array,
      require: true
    },
    canedit: {
      require: true,
      type: Boolean,
      default: false
    }
  },
  methods: {
    giftsTypeFormat(row) {
      if (row.giftsType === 1) {
        return row.couponName + '优惠券';
      } else if (row.giftsType === 0) {
        return '积分+' + row.points;
      } else {
        return '';
      }
    },
    continueSignedDayFormat(row) {
      return row.continueSignedDay + '天';
    },
    edit(index) {
      console.log('editindex', index);
      this.$emit('giftlistrowEdit', index);
    },
    remove(index) {
      console.log('removeindex', index);
      this.$emit('giftlistrowRemove', index);
    }
  }
};
</script>

<style type="less" scoped>
</style>
