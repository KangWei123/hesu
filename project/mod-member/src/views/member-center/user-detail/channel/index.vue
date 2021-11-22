<template>
  <div class="channels">
    <div class="graphs">
      <chart v-if="idMap" class="chart" :options="idMap" height="500px"></chart>
      <chart v-if="appMap" class="chart" :options="appMap" height="500px"></chart>
    </div>
    <div class="table">
      <fat-table :fetch-handler="handleFetch" hide-on-single-page :default-page-size="1000">
        <el-table-column label="应用" v-slot="{ row }">
          {{ getAppName(row) }}
        </el-table-column>
        <el-table-column label="渠道" prop="channel" />
        <el-table-column label="渠道名称" prop="channelName" />
        <!-- <el-table-column label="渠道ID" prop="channelAccount" />
        <el-table-column label="ID类型" prop="accountType">
          <template slot-scope="scope"> {{ AccountType[scope.row.accountType] }}</template>
        </el-table-column> -->
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="最近登录时间" prop="lastLoginTime" />
      </fat-table>
    </div>
    <!-- <industries /> -->
  </div>
</template>

<script>
  import uniqBy from 'lodash/uniqBy';
  import Chart from '@/dss-common/components/Chart';
  import { fallback } from '@/dss-common/utils/promise';
  import { circlizeImage } from '@/dss-common/utils/image';
  import { FatTable } from '@/dss-common/components/list-page';
  import api from '@/mod-member/src/api/memberAPI';
  import { getAppName } from '@/mod-member/src/utils';
  import { ChannelType } from '@/mod-member/src/enum';

  import FALLBACK_IMAGE from './image-broken.png';
  import { materialUrlReplace } from '@/business-common/utils/image';

  const AccountType = ['', '手机号', 'unionID', 'openID'];

  export default {
    name: 'Channels',
    props: {
      info: {
        type: Object,
        default: () => ({}),
      },
    },
    components: {
      Chart,
      FatTable,
    },
    data() {
      return {
        AccountType,
        userImage: '',
        idMapData: [],
        appMapData: [],
      };
    },
    computed: {
      // 会员 ID 图谱
      idMap() {
        return this.getChartModel('会员 ID 图谱', this.idMapData);
      },
      // 会员应用图谱
      appMap() {
        return this.getChartModel('会员应用图谱', this.appMapData);
      },
    },
    methods: {
      getAppName,
      async handleFetch({ pagination: { currentPage: pageNo, pageSize } }) {
        const idMap = await api.memberCenter.getChannelMap({ uniqueAccountId: this.info.uniqueAccountId });
        const { data, totalCount } = await api.memberCenter.getLoginRecords({
          pageNo,
          pageSize,
          uniqueAccountId: this.info.uniqueAccountId,
        });

        const memberIdVOList = idMap.data && idMap.data.memberIdVOList;
        const memberAppVOList = uniqBy(
          data.map(i => ({ name: i.appName, imgUrl: i.appLogo })),
          i => i.name
        );

        this.initialMapData(memberIdVOList, memberAppVOList);

        const filterd = data.filter(i => {
          return (
            i.channelType !== ChannelType.Import &&
            i.channelType !== ChannelType.AdminCreate &&
            i.channelType !== ChannelType.OpenAPIImport
          );
        });

        return {
          list: filterd,
          total: totalCount,
        };
      },
      async initialMapData(memberIdVOList, memberAppVOList) {
        const fallbackImage = await circlizeImage(FALLBACK_IMAGE);

        // 用户头像
        this.userImage = await fallback(
          circlizeImage(materialUrlReplace(this.info.avatarImgUrl), {
            borderWidth: 12,
          }),
          fallbackImage
        );

        const mapper = i => {
          return new Promise(res => {
            if (i.imgUrl) {
              fallback(circlizeImage(materialUrlReplace(i.imgUrl)), fallbackImage).then(image =>
                res({
                  name: i.name,
                  image,
                })
              );
            } else {
              res({
                name: i.name,
                image: fallbackImage,
              });
            }
          });
        };

        const idMapData = await Promise.all((memberIdVOList || []).map(mapper));
        const appMapData = await Promise.all((memberAppVOList || []).map(mapper));

        // 一起设置
        this.idMapData = idMapData;
        this.appMapData = appMapData;
      },

      /**
       * 图标数据模型
       */
      getChartModel(title, mapData) {
        if (!this.userImage || mapData.length === 0) {
          return null;
        }

        // 图片圆角处理
        const center = {
          name: 'center',
          symbol: `image://${this.userImage}`,
          symbolSize: 80,
          label: {
            show: false,
          },
          itemStyle: {
            borderWidth: 10,
            borderColor: '#000',
            borderType: 'solid',
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            shadowBlur: 10,
          },
        };
        const data = mapData.map(i => ({
          name: i.name,
          symbol: `image://${i.image}`,
          symbolSize: 56,
        }));
        const links = data.map(i => ({
          source: 'center',
          target: i.name,
        }));

        return {
          title: {
            text: title,
            left: 'center',
          },
          series: [
            {
              type: 'graph',
              // 力引导布局
              layout: 'force',
              force: {
                repulsion: 1000, // 节点之间的斥力因子
                edgeLength: 90,
              },
              label: {
                show: true,
                color: '#303133',
                position: 'bottom',
                distance: 5,
              },
              lineStyle: {
                color: '#C6D0D9',
              },
              itemStyle: {},
              // 节点
              data: [
                // 用户为中心
                center,

                // 其他元素
                ...data,
              ],
              links,
            },
          ],
        };
      },
    },
  };
</script>

<style lang="less" scoped>
  .graphs {
    display: flex;
    padding: 50px 0;

    & > .chart {
      flex: 1;
    }
  }
</style>
