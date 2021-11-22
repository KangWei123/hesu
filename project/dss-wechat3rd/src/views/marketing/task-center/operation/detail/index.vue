<template>
  <div>
    <PageHeader v-if="$route.query.typeId==='3'"><router-link style="color:#333" to><span  @click="$router.back()">任务记录</span></router-link>/拼团列表</PageHeader>
    <PageHeader v-if="$route.query.typeId==='4'"><router-link style="color:#333" to><span  @click="$router.back()">任务记录</span></router-link>/秒杀列表</PageHeader>
    <PageHeader v-if="$route.query.typeId==='5'"><router-link style="color:#333" to><span  @click="$router.back()">任务记录</span></router-link>/砍价列表</PageHeader>
    <div style="height:60px;background:#F5F7FA"></div>
    <CutPrice  v-if="$route.query.typeId==='5'" style="margin-top:20px"></CutPrice>
    <SecKill v-if="$route.query.typeId==='4'"  style="margin-top:20px"></SecKill>
    <Grouplist  v-if="$route.query.typeId==='3'" style="margin-top:20px"></Grouplist>
  </div>
</template>

<script>
import PageHeader from '../../components/page-header-tab/page-header';
import CutPrice from './components/cutPrice/list';
import Grouplist from './components/group/index';
import SecKill from './components/seckill/index';
export default {
  name: 'TaskDetail',
  components: {
    PageHeader,
    CutPrice,
    Grouplist,
    SecKill
  },
  watch: {},
  created() {},
  data() {
    return {};
  }
};
</script>

<style scoped lang='less'>
</style>
