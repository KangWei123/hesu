<template>
  <div>
    <el-tooltip class="item" effect="dark" content="双击修改" placement="top-start">
      <div class="content-num" @dblclick="changeInput" v-show="!isShowInput">{{ rowRank }}</div>
    </el-tooltip>
    <el-input
      v-if="isShowInput"
      :ref="`input${storeId}`"
      v-model.trim="rankVal"
      size="mini"
      placeholder="限制8个字"
      maxlength="8"
      @blur="save"
    ></el-input>
  </div>
</template>

<script>
  import merchantApi from '@/dss-wechat3rd/src/api/merchant';

  export default {
    props: {
      storeId: {
        type: Number,
        default: null,
      },
      rowRank: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        isShowInput: false,
        rankVal: null,
      };
    },
    watch: {
      isShowInput(newVal, oldVal) {
        if (newVal) {
          this.rankVal = this.rowRank;
        } else {
          this.rankVal = null;
        }
      },
    },
    methods: {
      changeInput() {
        this.isShowInput = true;
        this.toInputFocus();
      },
      // input失去焦点时候作判断
      leaveInputFocus() {
        console.log(this.rankVal);
        if (this.rankVal !== '' && typeof this.rankVal === 'number') {
          this.save();
        } else {
          this.toInputFocus();
        }
      },
      save() {
        this.isShowInput = false;
        if (this.rankVal === this.rowRank) return;
        const params = {
          storeId: this.storeId,
          seq: this.rankVal,
        };
        merchantApi
          .businessSort(params)
          .done(res => {
            if (res.success) {
              this.$message.success('保存成功');
              this.$emit('refresh');
            } else {
              this.$message.error('保存失败');
            }
          })
          .always(() => {});
      },
      // 获取input焦点
      toInputFocus() {
        this.$nextTick(() => {
          this.$refs[`input${this.storeId}`].$refs.input.focus();
        });
      },
    },
  };
</script>
