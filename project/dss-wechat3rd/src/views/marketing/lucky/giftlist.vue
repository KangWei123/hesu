<template>
  <div>
    <el-table
      :data="inList"
      style="width: 100%"
      class="wkt-table"
    >
      <!--
       form1: {
              // 奖品名称
              giftName: '',
              // 奖品种类
              giftType: null,
              // 中奖率
              winningRate: null,
              // 序号
              giftIndex: null,
              // 礼物url
              giftPhotoUrl: '',
              //  积分
              giftPoints: null,
              //优惠券id
              couponId: 0,
              //礼券名
              couponName: '',
              //  发放数量
              amountGifts: null,
              //  剩余数量
              remainGifts: 0
            },
      -->
      <el-table-column align="center" prop="giftName" label="名称"/>
      <el-table-column align="center" prop="giftType" :formatter="giftTypeFomat" label="奖品类型"/>
<!--      <el-table-column align="center" prop="giftPhotoUrl" :formatter="giftPhotoUrlFormat" label="奖品图"/>-->
      <el-table-column align="center" label="奖品图">
        <template slot-scope="scope">
          <img class="gift-img" :src="scope.row.giftPhotoUrl" />

        </template>
      </el-table-column>
      <el-table-column align="center" prop="amountGifts" label="发放数量"/>
      <el-table-column align="center" prop="winningRate" :formatter="winningRateFormat" label="中奖率(%)"/>
      <el-table-column align="center" prop="giftIndex" label="转盘位置"/>
      <el-table-column v-if="canedit" label="操作"
                       min-width="120">
        <template slot-scope="scope">
          <div>
            <a href="javascript:;"
               class="table-href"
               @click="edit(scope.$index)">编辑</a>
            <a href="javascript:;"
               class="table-href"
               @click="remove(scope.$index)">删除</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'GiftList',
    mounted() {},
    props: {
      inList: {
        default: []
      },
      canedit: {
        require: true,
        type: Boolean,
        default: false
      }
    },
    watch: {
      inList(oldVal, newVaL) {
        //this.setData({})
      }
    },
    data() {
      return {};
    },
    methods: {
      giftTypeFomat(row) {
        if (row.giftType == '1') return '优惠券';
        return '积分';
      },
      winningRateFormat(row) {
        return row.winningRate + '%';
      },

      edit(index) {
        console.log('edit row ', index);
        this.$emit('edit', index);
      },
      remove(index) {
        console.log('remove row ', index);
        this.$emit('remove', index);
      }
    }
};
</script>

<style>
  .gift-img{
    width: 41px;
    height: 37px;
  }
</style>
