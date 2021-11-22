<template>
  <div class="template-msg">
    <div class="tp-msg-body">
      <div class="theme">小程序订阅消息设置</div>

      <div
        v-for="(group, index) in dataSource"
        v-if="group.msgTitleType !== 4 && group.msgTitleType !== 6 && group.msgTitleType !== 7"
        :key="index"
        class="block"
      >
        <div class="b-name">
          <i class="b-icon"></i>
          <span>{{ group.msgTitleTypeName }}</span>
        </div>

        <div v-for="(item, index1) in group.msgDTOS" :key="index1" class="b-radio">
          <div class="b-radio-label">
            <span>{{ item.msgTypeName }}</span>
            <i class="b-ask" @click="onTipClick(item)"></i>
          </div>

          <div class="b-radio-group">
            <el-radio-group v-model="item.onOff" @change="change(item)">
              <el-radio :label="1">开</el-radio>
              <el-radio :label="0">关</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="b-notice" v-if="group.msgTitleType === 3 || group.msgTitleType === 4">
          <span>*活动还差1小时结束时提醒会员</span>
        </div>
      </div>
    </div>

    <el-dialog title="模板消息格式" :visible="dialogVisible" width="557px" :before-close="onHideTip">
      <div class="msg-container">
        <div class="title">
          {{ templateMsgTitle }}
        </div>

        <div class="time">
          2018年5月
        </div>

        <div class="item-list" v-for="(item, index) in itemList" :key="index">
          <span class="key"> {{ item.key }}</span>
          <span class="value">{{ item.value }} </span>
        </div>

        <div class="op-bottom">
          <span class="">进入小程序查看</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import marketingAPI from '@/dss-wechat3rd/src/api/marketingAPI';
import templateMsgConst from '@/dss-wechat3rd/src/constants/TemplateMsgConst.js';
import './index.less';

export default {
  data() {
    return {
      dataSource: [],

      dialogVisible: false,
      templateMsgTitle: null,
      itemList: []
    };
  },

  mounted() {
    marketingAPI
      .getTempMessageConfig()
      .then(res => {
        console.log('m res', res);
        if (res.success === true) {
          this.dataSource = res.data || [];
        }
      })
      .catch(err => {
        console.log('message', err);
      });
  },

  methods: {
    onHideTip() {
      this.dialogVisible = false;
    },

    onTipClick(item) {
      this.dialogVisible = true;
      console.log('item ->', JSON.stringify(item));
      this.itemList = templateMsgConst.findMsgByType(item.msgType);
      this.templateMsgTitle = item.msgTypeName;
    },

    change(val) {
      let pramas = {
        id: val.id,
        onOff: val.onOff
      };
      marketingAPI.changeTempMessage(pramas).then(res => {
        console.log(res);
        if (res.success === true) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        } else {
          this.$message.error('修改失败');
          val.onOff = !val.onOff;
        }
      });
    }
  }
};
</script>
