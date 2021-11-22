import MemberInfoColumn from './member-info-column.vue';
import MemberStatusColumn from './member-status-column.vue';
import MemberChannelColumn from './member-channel-column.vue';
import MemberTimeColumn from './member-time-column.vue';
import MemberLevelColumn from './member-level-column.vue';
export default {
  default: [
    {
      label: '会员一账通ID',
      prop: 'uniqueAccountId',
      width: '150',
    },
    {
      label: '会员信息',
      width: '200',
      component: MemberInfoColumn,
    },
    {
      label: '会员等级',
      component: MemberLevelColumn,
    },
    {
      label: '来源应用',
      prop: 'appName',
    },
    {
      label: '来源渠道',
      prop: 'channelName',
      component: MemberChannelColumn,
    },
    {
      label: '注册时间',
      width: '200',
      component: MemberTimeColumn,
    },
    {
      label: '会员状态',
      component: MemberStatusColumn,
    },
  ],
};
