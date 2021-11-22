<template>
  <el-dialog :visible.sync="mShowDialog" title="升级礼包" width="80%">
    <el-form label-width="auto" style="text-align: left" label-suffix="：">
      <el-form-item label="当前等级">
        <el-input :value="data.levelName" disabled style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="升级礼包" style="margin-bottom: 0">
        <el-checkbox v-model="isScore">积分</el-checkbox>
        <el-form-item label="获取积分" v-if="isScore" style="display: inline-block; margin-left: 50px">
          <el-input type="number" min="0" v-model="score" style="width: 96px" size="mini"></el-input>
          <span>&nbsp;分</span>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="isCoupons" style="margin-right: 34px">优惠券</el-checkbox>
        <el-link v-show="isCoupons" @click="visible = true" :underline="false" :disabled="!isCoupons">
          选择优惠券
        </el-link>
      </el-form-item>
      <el-form-item label-width="1" v-if="isCoupons">
        <c-table has-count @delete="onDelete" :list="coupons" :selected-ids="selectArr"></c-table>
      </el-form-item>
    </el-form>

    <select-dialog
      v-model="visible"
      :selected-coupons="coupons"
      @select="coupons = $event"
      :app-id="globalAppId"
    ></select-dialog>

    <template #footer>
      <div style="text-align: right">
        <el-button @click="mShowDialog = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import CTable from '../components/upgrade-gifts-coupons/table.vue';
  import SelectDialog from '../components/upgrade-gifts-coupons/select-dialog.vue';
  import DialogMixin from '@/dss-common/mixins/dialog-mixin';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import { formatUpgradeGifts, getScoreAndCoupons, validateCount, event } from '../utils';
  import couponEnum from '@/mod-member/src/enum/couponEnum';
  import { SET_COUNT_DIRTY } from '../components/upgrade-gifts-coupons/count-input.vue';

  export default {
    mixins: [DialogMixin],
    components: { CTable, SelectDialog },
    props: {
      level: { type: Number, default: -1 },
    },
    data() {
      return {
        score: 0,
        coupons: [],
        isScore: false,
        isCoupons: false,
        visible: false,
        data: {},
      };
    },
    watch: {
      mShowDialog(value) {
        value && this.getData();
      },
    },
    computed: {
      selectArr() {
        return this.coupons.map(v => v.couponId);
      },
    },
    methods: {
      async getData() {
        const { data } = await memberApi.levelManager.levelDetail({ id: this.level });
        const { upgradeGifts } = (this.data = data);

        const { score, coupons } = getScoreAndCoupons(upgradeGifts?.[0]?.gifts || []);
        this.score = score;
        this.coupons = coupons;

        this.isScore = score > 0;
        this.isCoupons = !!coupons.length;
      },
      onDelete(index) {
        this.coupons.splice(index, 1);
      },
      async onSubmit() {
        event.$emit(SET_COUNT_DIRTY, true);

        if (this.isCoupons) {
          const statusDesc = couponEnum.getStatusDesc();
          for (const coupon of this.coupons) {
            if (!validateCount(coupon)) {
              return;
            }

            if (coupon.status !== couponEnum.status.VALID) {
              return this.$message.error(`存在${statusDesc[coupon.status]}的优惠券: [${coupon.name}]`);
            }
          }
        }
        if (this.isScore && (this.score < 0 || this.score > 999999)) {
          this.$message.error(`请正确填写积分数 0 ~ 999999`);
          return;
        }

        const upgradeGifts = formatUpgradeGifts(
          {
            [this.globalAppId]: {
              score: this.isScore ? this.score : 0,
              coupons: this.isCoupons ? this.coupons : [],
            },
          },
          [{ id: this.globalAppId }]
        );
        await memberApi.levelManager.updateLevel({ ...this.data, upgradeGifts });

        this.mShowDialog = false;
        this.$message.success('保存成功');
      },
    },
  };
</script>
