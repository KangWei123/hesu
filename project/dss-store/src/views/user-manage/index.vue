<template>
  <div class="passenger-flow-main">

    <!-- 到店客户标签 -->
    <div class=" dss-card">
      <card-title text="用户列表" border></card-title>
      <tag-table />
    </div>

    <!-- 用户占比 -->
    <!-- <div class="user-proportion dss-card">
      <card-title text="用户占比"></card-title>
      <camera-portrait-statistics />
    </div> -->
  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import storeApi from '@/dss-common/api/store';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import services from '@/dss-common/utils/services';
import url from '@/dss-common/utils/url';
import CardTitle from '../../components/card-title/index';
import TagTable from './tag-table';
import CameraPortraitStatistics from './camera-portrait-statistics.vue';

export default {
  name: 'userManage',
  components: {
    CardTitle,
    TagTable,
    CameraPortraitStatistics
  },

  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
.user-proportion {
  margin-top: 30px;
}

.passenger-flow-main {
  .dss-card {
    padding: 20px 0;
  }

  .card-title {
    padding: 0 20px 18px;
    border-bottom-color: #D7D7D7;
  }
}
</style>
