<template>
  <div class="com-row fixed-column">
    <span class="com-column">
      <el-radio-group v-model="chooseModel" @change="changeBgColor">
        <el-radio v-for="(item, index) in bgList" :label="item.value" :key="index" :border="showBorder">{{
          item.name
        }}</el-radio>
      </el-radio-group>
    </span>
    <template v-if="chooseModel == 'custom'">
      <div class="com-row" style="margin-top: 10px">
        <span class="com-column">
          <div class="bg-input font-input">
            <el-color-picker class="com-color-picker" v-model="chooseColor" show-alpha size="mini"></el-color-picker>
            <el-input class="com-small-input" v-model="chooseColor" placeholder=""></el-input>
          </div>
        </span>
      </div>
    </template>
  </div>
</template>
<script>
  import { mapState } from 'vuex';

  export default {
    name: 'ColorSelect',
    model: {
      prop: 'selectColor',
    },
    props: {
      defaultColor: {
        type: String,
        default: 'rgba(255, 187, 59, 1)',
      },

      defaultFontColor: {
        type: String,
        default: 'rgba(255, 255, 255, 1)',
      },

      defaultActiveFontColor: {
        type: String,
        default: 'rgba(255, 255, 255, 1)',
      },

      selectColor: {
        type: String,
        default: null,
      },

      colorModel: {
        type: String,
        default: null,
      },

      fontColor: {
        type: String,
        default: null,
      },

      fontActiveColor: {
        type: String,
        default: null,
      },
      defaultLabel: {
        type: Array,
        default: null,
      },
      showBorder: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        customBgColor: '',
        bgList: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
      };
    },

    mounted() {
      if (this.defaultLabel) {
        this.bgList = this.defaultLabel;
      }
    },

    computed: {
      ...mapState({ curApp: 'curApp' }),
      chooseModel: {
        get() {
          return this.colorModel;
        },
        set(val) {
          this.$emit('update:fontColor', this.defaultFontColor);
          this.$emit('update:fontActiveColor', this.defaultActiveFontColor);
          this.$emit('update:colorModel', val);
        },
      },
      chooseColor: {
        get() {
          return this.selectColor;
        },
        set(val) {
          this.$emit('input', val);
        },
      },

      cFontColor: {
        get() {
          return this.fontColor;
        },
        set(val) {
          this.$emit('update:fontColor', val);
        },
      },
      cFontActiveColor: {
        get() {
          return this.fontActiveColor;
        },
        set(val) {
          this.$emit('update:fontActiveColor', val);
        },
      },
    },

    methods: {
      changeBgColor(val) {
        if (val === 'default') {
          this.customBgColor = this.chooseColor;
          this.chooseColor = this.defaultColor;
        } else {
          this.chooseColor = this.customBgColor ? this.customBgColor : this.defaultColor;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .fixed-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 0;

    &.com-row .com-column:first-child {
      width: 100%;
    }
  }

  .com-row {
    .font-input {
      width: 245px;
      display: flex;
    }

    .el-color-picker--mini {
      margin-right: 10px;
      border: 4px solid #d0d5d9;
      border-radius: 4px;
    }

    .el-color-picker--mini,
    /deep/.el-color-picker--mini .el-color-picker__trigger {
      width: 62px;
      height: 22px;
    }
  }
</style>
