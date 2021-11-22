<template>
  <div :class="['widget-screen', { required: widget.required }]">
    <!-- 单行文本 -->
    <div class="widget" v-if="widget.type === 'text'">
      <span class="label">{{ widget.label }}</span>
      <span class="widget-placeholder">请输入{{ widget.label }}</span>
    </div>
    <!-- 多行文本 -->
    <div class="widget textarea-widget" v-else-if="widget.type === 'textarea'">
      <span class="label">{{ widget.label }}</span>
      <div class="widget-placeholder">
        请输入{{ widget.label }}
        <!-- <span class="tip">0/50</span> -->
      </div>
    </div>
    <!-- 单选框 -->
    <div class="widget radio-widget" v-else-if="widget.type === 'radio'">
      <span class="label">{{ widget.label }}</span>
      <div class="options">
        <span v-for="(o, ind) in widget.options || []" :key="ind" class="option">
          <i class="radio-box"></i><span>{{ o }}</span>
        </span>
      </div>
    </div>
    <!-- 日期 -->
    <div class="widget date-widget" v-else-if="widget.type === 'date'">
      <span class="label">{{ widget.label }}</span>
      <span class="widget-placeholder">请选择{{ widget.label }}</span>
    </div>
    <!-- 地址 -->
    <template v-else-if="widget.type === 'address'">
      <div class="widget address-widget">
        <span class="label">{{ widget.label }}</span>
        <span class="widget-placeholder">请选择{{ widget.label }}</span>
      </div>
      <div class="widget">
        <span class="label">详细地址</span>
        <span class="widget-placeholder">请输入详细地址</span>
      </div>
    </template>
    <!-- 性别 -->
    <div class="widget sex-widget" v-else-if="widget.type === 'sex'">
      <span class="label">{{ widget.label }}</span>
      <div class="sex-options">
        <div class="options"><i></i><span>男</span></div>
        <div class="options"><i></i><span>女</span></div>
      </div>
    </div>
    <!-- 邮箱 -->
    <div class="widget" v-else-if="widget.type === 'email'">
      <span class="label">{{ widget.label }}</span>
      <span class="widget-placeholder">请输入{{ widget.label }}</span>
    </div>
    <!-- 手机 -->
    <div class="widget" v-else-if="widget.type === 'phone'">
      <span class="label">{{ widget.label }}</span>
      <span class="widget-placeholder">请输入{{ widget.label }}</span>
    </div>
    <!-- 表单说明 -->
    <div class="widget comment-widget" v-else-if="widget.type === 'comment'">
      <pre>{{ (widget && widget.value) || '请输入说明内容' }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    widget: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.widget-screen {
  margin: 0 18px;
}
.widget {
  display: flex;
  align-items: flex-start;
  .label {
    display: block;
    width: 110px;
    height: 20px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .widget-placeholder {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.widget-screen {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 20px;
  padding: 16px 0;
}

.textarea-widget {
  display: block;
  .widget-placeholder {
    margin-top: 10px;
    height: 114px;
    border-bottom: 1px solid rgb(241, 241, 241);
    padding: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 20px;
    position: relative;
    box-shadow: 0px -1px 0px 0px rgba(238, 238, 238, 0.4);
    border: 1px solid rgba(241, 241, 241, 1);
    .tip {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
}

.sex-widget {
  .sex-options {
    display: flex;
    justify-content: space-between;
    width: 130px;
    .options {
      display: flex;
      &:first-child i {
        background-image: url(../../assets/sex-icon-1.png);
      }
      &:nth-child(2) i {
        background-image: url(../../assets/sex-icon-2.png);
      }
    }
    i {
      display: block;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      margin-right: 4px;
    }
  }
}

.date-widget {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    border-top: 1px solid rgb(168, 168, 168);
    border-right: 1px solid rgb(168, 168, 168);
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    right: 10px;
  }
}

.radio-widget {
  .options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 250px;
    .option {
      width: 13em;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      flex-shrink: 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 10px;
      span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:first-child {
        .radio-box {
          background-image: url(../../assets/radio-box.png);
        }
      }
      &:nth-child(n + 2) {
        margin-top: 15px;
      }
    }
  }

  .radio-box {
    display: block;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    background: rgba(238, 241, 244, 1);
    border-radius: 50%;
    margin-right: 8px;

    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
}

.address-widget {
  padding-bottom: 16px;
  border-bottom: 1px solid #f9f9f9;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    border-top: 1px solid rgb(168, 168, 168);
    border-right: 1px solid rgb(168, 168, 168);
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    right: 10px;
    margin-top: -8px;
  }
  & + .widget {
    padding-top: 16px;

    .widget-placeholder {
      display: block;
      height: 4em;
    }
  }
}

.comment-widget {
  display: flex;
  font-size: 14px;
  width: 100%;
  background: #f6f6f6;
  color: #999;
  line-height: 1.5;

  pre {
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.required {
  .widget:first-child {
    .label {
      position: relative;
      overflow: visible;
      &::after {
        content: '*';
        color: red;
        margin-left: 4px;
      }
    }
  }
}
</style>
