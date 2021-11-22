<template>
  <div class="form-edit-input" v-loading="loading.load">
    <div class="left-panel">
      <p class="left-title">基础组件</p>
      <dnd-container
        class="left-container"
        behaviour="copy"
        :get-child-payload="getLeftChildPayload"
        group-name="form-template"
      >
        <dnd-draggable class="left-widget" v-for="(widget, ind) in widgetData" :key="ind">
          <i class="left-icon" :style="{ backgroundImage: `url(${widget.icon})` }"></i>
          <span class="left-name">{{ widget.label }}</span>
        </dnd-draggable>
      </dnd-container>
    </div>
    <div class="screen-panel">
      <div class="screen">
        <span class="form-name">{{ form.name }}</span>
        <el-scrollbar :style="`height: 555px`">
          <div
            v-if="form.bannerVisible"
            @click="currentTab = 'style'"
            class="banner"
            :style="
              `background-image: url(${form.bannerUrl || defaultBanner}); height: ${(form.bannerHeight || 300) / 2}px`
            "
          ></div>
          <dnd-container
            class="screen-container"
            :get-child-payload="getScreenChildPayload"
            @drop="onDrop($event)"
            group-name="form-template"
          >
            <div style="line-height: 400px; text-align: center; color: #999" v-if="!form.widgetValue.length">
              拖拽组件到这里
            </div>
            <dnd-draggable class="screen-widget" v-for="(widget, ind) in form.widgetValue" :key="ind">
              <div
                :class="[
                  'widget-wrapper',
                  widget.type,
                  { active: widgetSelectIndex === ind },
                  { error: errorWidgetList.indexOf(ind) >= 0 }
                ]"
                @click="handleWidgetClick(ind)"
              >
                <widget-screen :widget="widget" />
                <i class="del" @click="deleteWidget(ind)" v-if="widgetSelectIndex === ind && !widget.remote"></i>
              </div>
            </dnd-draggable>
          </dnd-container>
        </el-scrollbar>
        <div class="store-info">
          <i class="store-icon"></i>
          <span class="store-label">服务门店：</span>
          <span class="store-name">{{ curStore ? curStore.name : '未选择门店' }}</span>
        </div>
        <div class="submit-bar">
          <div class="submit-btn">{{ form.btnText }}</div>
        </div>
      </div>
    </div>
    <div class="props-panel">
      <el-form label-width="95px" label-suffix="：" :rules="rules" :model="form" ref="elForm" style="height: 100%">
        <el-tabs v-model="currentTab" type="border-card" style="height: 100%">
          <!-- 表单样式 -->
          <el-tab-pane label="表单样式" name="style">
            <div class="form-wapper">
              <el-form-item label="表单名称" prop="name">
                <div style="display: flex">
                  <el-input :maxlength="20" style="width: 160px" v-model.trim="form.name"></el-input>
                  <span class="count-tip" :style="{ color: form.name.length > 20 ? 'red' : '#858C99' }">
                    {{ form.name.length }}/20
                  </span>
                </div>
              </el-form-item>

              <el-form-item label="表单头图" prop="bannerUrl">
                <div>
                  <el-radio v-model="form.bannerVisible" :label="true">显示</el-radio>
                  <el-radio v-model="form.bannerVisible" :label="false">隐藏</el-radio>
                  <banner-upload v-if="form.bannerVisible" v-model="form.bannerUrl" />
                </div>
              </el-form-item>

              <el-form-item label="高度" prop="bannerHeight">
                <div style="display: flex; align-items: center;">
                  <el-input-number
                    size="small"
                    :step="1"
                    :step-strictly="true"
                    :min="300"
                    style="width: 100px; height: 30px;"
                    controls-position="right"
                    v-model="form.bannerHeight"
                  />
                  <p class="tip" style="margin-left: 10px">宽度默认 750px</p>
                </div>
              </el-form-item>

              <el-form-item label="按钮名称" prop="btnText">
                <div class="btn-text" style="display: flex;">
                  <el-input :maxlength="6" style="width: 160px" v-model.trim="form.btnText"></el-input>
                  <span class="count-tip" :style="{ color: form.btnText.length > 6 ? 'red' : '#858C99' }">
                    {{ form.btnText.length }}/6
                  </span>
                </div>
              </el-form-item>
            </div>
          </el-tab-pane>

          <!-- 表单内容 -->
          <el-tab-pane label="表单内容" name="container">
            <div class="form-wapper">
              <!-- 表单说明 -->
              <template v-if="currentWidget && currentWidget.type === 'comment'">
                <el-form-item
                  :label="labelMap[currentWidget.type]"
                  :prop="`widgetValue[${widgetSelectIndex}].value`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入说明内容'
                    },
                    { max: 300, message: '说明内容过长' }
                  ]"
                >
                  <div style="display: flex">
                    <el-input
                      type="textarea"
                      style="width: 160px"
                      @blur="validate"
                      :maxlength="300"
                      :rows="5"
                      placeholder="请输入说明内容"
                      v-model="currentWidget.value"
                    ></el-input>
                    <span class="count-tip" :style="{ color: currentWidget.value.length > 300 ? 'red' : '#858C99' }">
                      {{ currentWidget.value.length }}/300
                    </span>
                  </div>
                </el-form-item>
              </template>

              <template v-else-if="currentWidget">
                <el-form-item
                  :label="labelMap[currentWidget.type]"
                  :prop="`widgetValue[${widgetSelectIndex}].label`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入标签名称'
                    },
                    { max: 5, message: '标签名称过长' }
                  ]"
                >
                  <div style="display: flex">
                    <el-input
                      style="width: 160px"
                      @blur="validate"
                      :maxlength="5"
                      placeholder="请输入标签名称"
                      v-model.trim="currentWidget.label"
                    ></el-input>
                    <span class="count-tip" :style="{ color: currentWidget.label.length > 5 ? 'red' : '#858C99' }">
                      {{ currentWidget.label.length }}/5
                    </span>
                  </div>
                </el-form-item>

                <template v-if="currentWidget.type === 'radio'">
                  <el-form-item
                    v-for="(item, ind) in currentWidget.options"
                    :key="ind"
                    :prop="`widgetValue[${widgetSelectIndex}].options[${ind}]`"
                    :rules="{
                      required: true,
                      message: '请输入选项'
                    }"
                  >
                    <div>
                      <el-input style="width: 160px" v-model="currentWidget.options[ind]" :maxlength="10" />
                      <a style="margin-left: 10px" @click="currentWidget.options.splice(ind, 1)" v-if="ind !== 0"
                        >删除</a
                      >
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <a @click="currentWidget.options.push('选项' + (currentWidget.options.length + 1))">+添加项</a>
                  </el-form-item>
                </template>

                <el-form-item aria-label="是否必填">
                  <el-radio v-model="currentWidget.required" :label="true">必填</el-radio>
                  <el-radio v-model="currentWidget.required" :label="false">非必填</el-radio>
                </el-form-item>

                <template v-if="currentWidget.type === 'date'">
                  <el-form-item label="可选时间">
                    <div class="date-limit" style="display: flex; flex-direction: column;">
                      <el-radio v-model="currentWidget.limit" :label="false">不限</el-radio>
                      <el-radio v-model="currentWidget.limit" :label="true">时间段</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item
                    :prop="`widgetValue[${widgetSelectIndex}].dateRange`"
                    v-if="currentWidget.limit"
                    :rules="{
                      required: currentWidget.limit,
                      message: '请选择时间段'
                    }"
                  >
                    <el-date-picker
                      style="width: 250px; margin-top: -10px;"
                      type="daterange"
                      v-model="currentWidget.dateRange"
                      format="yyyy/MM/dd"
                    ></el-date-picker>
                  </el-form-item>
                </template>
              </template>

              <!-- 没有选择组件的情况 -->
              <div class="empty-tip" v-else>
                请先选择组件
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Container, Draggable } from 'vue-smooth-dnd';
import BannerUpload from './banner-upload';
import widgetData from '../../widget-data';
import WidgetScreen from './widget-screen';
import defaultBanner from '../../assets/form-util-banner-default.png';
import { queryForm } from '../../api/form';

export default {
  props: {
    editId: {
      type: [String, Number]
    }
  },
  components: {
    'dnd-container': Container,
    'dnd-draggable': Draggable,
    BannerUpload,
    WidgetScreen
  },

  data() {
    const labelMap = widgetData.reduce((map, item) => ({ ...map, [item.type]: item.label }), {});

    return {
      widgetData,
      defaultBanner,
      labelMap,
      form: {
        name: '预约表单',
        btnText: '提交表单',
        bannerVisible: true,
        bannerUrl: '',
        bannerHeight: 300,
        widgetValue: []
      },
      rules: {
        name: [{ required: true, message: '请输入表单名称' }],
        btnText: [{ required: true, message: '请输入按钮名称' }],
        bannerHeight: [{ required: true, message: '请输入头图高度' }]
      },
      widgetSelectIndex: -1,
      showChooseImageDialog: false,
      errorWidgetList: [],
      loading: {
        load: false
      },
      currentTab: 'style'
    };
  },

  methods: {
    uuid() {
      return (+Math.random()
        .toString()
        .slice(2)).toString(16);
    },

    getLeftChildPayload(ind) {
      const widget = { ...this.widgetData[ind], uuid: this.uuid() };
      delete widget.icon;
      return widget;
    },

    getScreenChildPayload(ind) {
      return { ...this.form.widgetValue[ind] };
    },

    onDrop(dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult;

      // 拖动
      if (typeof removedIndex === 'number' && typeof addedIndex === 'number') {
        const dropInd = this.errorWidgetList.indexOf(removedIndex);
        if (dropInd >= 0) {
          this.errorWidgetList.splice(dropInd, dropInd + 1);
          this.errorWidgetList.push(addedIndex);
        }
      }

      const _value = [...this.form.widgetValue];
      if (typeof removedIndex === 'number') {
        _value.splice(removedIndex, 1);
      }
      if (typeof addedIndex === 'number') {
        _value.splice(addedIndex, 0, payload);
        this.widgetSelectIndex = addedIndex;
      }
      this.form.widgetValue = _value;
    },

    deleteWidget(ind) {
      this.form.widgetValue.splice(ind, 1);
      this.widgetSelectIndex = ind - 1;
    },

    // 填充校验
    validate() {
      return new Promise(resolve => {
        this.$refs.elForm.validate(valid => {
          if (!valid || !this.form.widgetValue.length) {
            resolve(false);
          }

          this.errorWidgetList = [];
          this.form.widgetValue.forEach((item, ind) => {
            if (!item.label) {
              this.errorWidgetList.push(ind);
            } else if (item.type === 'radio' && item.options.some(o => !o)) {
              this.errorWidgetList.push(ind);
            } else if (item.type === 'date' && item.limit && (!item.dateRange || !item.dateRange.length)) {
              this.errorWidgetList.push(ind);
            }

            if (item.type === 'comment' && !item.value) {
              this.errorWidgetList.push(ind);
            }
          });

          resolve(!this.errorWidgetList.length);
        });
      });
    },

    // 提供给父组件获取表单值
    getWidgetValue() {
      return this.form;
    },

    handleWidgetClick(ind) {
      this.widgetSelectIndex = ind;
      this.currentTab = 'container';
    }
  },

  computed: {
    ...mapState({
      curStore: 'curStore'
    }),
    currentWidget() {
      const val = this.form.widgetValue[this.widgetSelectIndex];
      if (!val) {
        return null;
      }
      if (!val.label) {
        this.$set(val, 'label', '');
      }
      if (!val.required) {
        this.$set(val, 'required', false);
      }
      if (val.type === 'radio' && !val.options) {
        this.$set(val, 'options', ['选项1']);
      }
      if (val.type === 'date' && !val.limit && !val.dateRange) {
        this.$set(val, 'limit', false);
        this.$set(val, 'dateRange', null);
      }
      if (val.type === 'comment' && !val.value) {
        this.$set(val, 'value', '');
      }

      return this.form.widgetValue[this.widgetSelectIndex];
    }
  },

  async mounted() {
    if (this.editId) {
      try {
        this.loading.load = true;
        const res = await queryForm({ formId: this.editId });
        this.form.name = res.data.name;
        this.form.bannerUrl = res.data.avatar;
        this.form.bannerHeight = res.data.avatarHeight || 300;
        this.form.bannerVisible = !res.data.hideAvatar;
        this.form.btnText = res.data.buttonName;
        this.form.widgetValue = JSON.parse(res.data.formBody || '[]').map(item => ({
          ...item,
          options: item.options && item.options.map(o => o.label),
          // 已经保存的组件不允许删除，只允许修改
          remote: true
        }));
      } catch (e) {
        this.$message({ type: 'error', message: e.message });
        this.$emit('errorLoad');
      } finally {
        this.loading.load = false;
        this.$emit('load');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.hr {
  height: 1px;
  margin: 26px 0;
  background: rgba(221, 227, 236, 1);
}

.form-edit-input {
  display: flex;
}

.left-panel {
  width: 260px;
  padding: 10px 20px;
  flex-shrink: 0;

  .left-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin: 0;
    margin-bottom: 10px;
  }
  .left-container {
    display: flex;
    flex-wrap: wrap;
  }

  .left-widget {
    width: 75px;
    height: 75px;
    flex-shrink: 0;
    margin: 1px;
    box-shadow: 0 0 0 1px rgba(234, 236, 241, 1);
    margin-left: 0;
    margin-top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #ffffff;

    .left-name {
      font-size: 12px;
      font-weight: 400;
      color: rgba(133, 140, 153, 1);
      line-height: 17px;
    }
  }
}

.screen-panel {
  width: 525px;
  background: rgb(242, 244, 247);
  flex-shrink: 0;
  &::v-deep {
    .el-scrollbar__wrap {
      overflow: hidden;
      overflow-y: scroll;
      height: 100%;
    }
  }
}

.screen {
  width: 375px;
  height: 700px;
  margin: 65px auto;
  position: relative;
  padding-top: 64px;
  background-size: 100% auto;
  background-position: top center;
  background-repeat: no-repeat;
  background-image: url(../../assets/frame-header.png);
  overflow: hidden;
  overflow-x: visible;

  .form-name {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 32px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 12em;
    text-align: center;
  }
}

.screen-container {
  min-height: 400px;
  width: 375px;
  background: rgb(249, 249, 249);
}

.props-panel {
  width: 400px;
  border-right: 1px solid rgb(234, 236, 241);
  flex-shrink: 0;

  .props-title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 60px;
    margin: 0 20px;
    border-bottom: 1px solid rgb(221, 227, 236);
  }

  .form-wapper {
    padding: 10px 20px;

    /deep/ .el-input__inner {
      height: 30px;
    }
  }
}

.left-widget {
  display: flex;
  flex-direction: column;
}

.count-tip {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #858c99;
  line-height: 17px;
  margin-left: 10px;
  line-height: 30px;
}

.left-icon {
  display: block;
  width: 30px;
  height: 30px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: 4px;
}

.store-info {
  height: 60px;
  line-height: 60px;
  position: absolute;
  left: 0;
  right: 0;
  background: #ffffff;
  bottom: 75px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .store-icon {
    display: block;
    height: 20px;
    width: 20px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(../../assets/icon-store.png);
    margin-left: 15px;
  }
  .store-label,
  .store-name {
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    color: rgba(51, 55, 62, 1);
    line-height: 21px;
  }
  .store-label {
    font-weight: 600;
    margin-left: 4px;
  }
}

.submit-bar {
  position: absolute;
  height: 75px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
}

.submit-btn {
  width: 291px;
  height: 47px;
  background: rgba(243, 95, 40, 1);
  border-radius: 5px;
  line-height: 47px;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}

.screen-widget:last-child {
  .widget-wrapper::v-deep .widget-screen {
    border-bottom: 1px solid #f9f9f9;
  }
}

.widget-wrapper {
  cursor: pointer;
  background: #ffffff;
  border-radius: 4px;
  margin: 1px;
  outline: 2px solid #fff;
  position: relative;

  &.comment {
    background: #f6f6f6;
  }

  &::v-deep .widget-screen {
    border-bottom: 1px solid #f9f9f9;
  }

  &.active {
    outline: 1px solid #3878fb;
    &::after,
    &::before {
      content: '';
      display: block;
      width: 7px;
      height: 7px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(56, 120, 251, 1);
      border-radius: 50%;
      position: absolute;
    }
    &::before {
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &::after {
      right: 0;
      top: 50%;
      transform: translate(50%, -50%);
    }
  }
  &.error {
    outline: 1px solid red;
    &::after,
    &::before {
      border-color: red;
    }
    .del {
      border-color: red;
      &::after,
      &::before {
        background: red;
      }
    }
  }
  .del {
    position: absolute;
    width: 17px;
    height: 17px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(56, 120, 251, 1);
    border-radius: 50%;
    top: 5px;
    right: 5px;
    cursor: pointer;
    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 1px;
      background: rgba(56, 120, 251, 1);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}

.banner {
  margin-bottom: 5px;
  height: 120px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.date-limit {
  &::v-deep {
    .el-radio {
      line-height: 30px;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}

.tip {
  font-size: 12px;
  font-weight: 400;
  color: #858c99;
  line-height: 17px;
}

.empty-tip {
  color: #999;
  line-height: 400px;
  text-align: center;
}
</style>
