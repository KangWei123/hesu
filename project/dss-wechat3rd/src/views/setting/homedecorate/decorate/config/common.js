import cdnResConfig from '@/business-common/utils/cdnResConfig';

export default [
  {
    type: '基础组件',
    components: [
      {
        id: 'cardsModule',
        name: '卡片导航',
        config: {
          mode: 'name', // or name
          style: {
            gap: 8,
            radius: 4,
            marginUp: -16,
            marginDown: 0,
            marginLeftRight: 8,
          },
          cardWidth: 440,
          cardHeight: 134,
          showModule: true,
          moduleNameAlign: 'left',
          list: [
            {
              name: '卡片名称',
              logo: '',
              link: [],
              list: [
                {
                  name: '功能名称',
                  logo: cdnResConfig.decorate.modulePlh,
                  link: [],
                },
                {
                  name: '功能名称',
                  logo: cdnResConfig.decorate.modulePlh,
                  link: [],
                },
                {
                  name: '功能名称',
                  logo: cdnResConfig.decorate.modulePlh,
                  link: [],
                },
              ],
            },
          ],
        },
      },
      {
        id: 'dialogModule',
        name: '悬浮框',
        config: {
          shopGuide: 1,
          shopGuideList: [],
          cardStyle: 3,
          showRules: 1,
          shoppingGuide: false,
          wechatMsg: true,
          collapseImage: '',
          expandImage: '',
          isLock: false,
        },
      },
      {
        id: 'VRModule',
        name: 'VR展示',
        config: {
          componentsPadding: 10,
          radius: 2,
          marginUp: 5,
          marginDown: 5,
          marginLeftRight: 0,
          data: [],
          exampleData: [],
          showNav: true,
          bgMode: 'default', // 背景颜色的选择方式
          backgroundColor: '#FFFFFF',
          textNavSource: {
            componentsPadding: 10,
            fontSize: '16px',
            title: 'VR展示',
            titleMode: 'default', // 文字颜色的选择方式
            titleColor: 'rgba(55,58,68,1)',
            subTitle: '更多',
            showMore: '1',
            linkPage: 'sub-packages/marketing-package/pages/vr-list/index',
            customJump: '1',
          },
          isLock: false,
        },
      },
    ],
  },
  {
    type: '营销组件',
    components: [
      // {
      //   id: 'campaignModule',
      //   name: '预约活动',
      //   config: {
      //     // 圆角效果
      //     radius: 10,
      //     // 上下间距
      //     marginUpDown: 5,
      //     // 左右间距
      //     marginLeftRight: 0,
      //     // 显示导航栏
      //     showNav: true,
      //     // 显示标题
      //     showTitle: true,
      //     // 存放活动 id
      //     list: [],
      //     isLock: false,
      //     showType: 1,
      //     // 导航设置
      //     textNavSource: {
      //       componentsPadding: 10,
      //       radius: 0,
      //       marginUpDown: 5,
      //       marginLeftRight: 0,
      //       fontSize: '16px',
      //       bgColor: '#FFFFFF',
      //       bgMode: 'default', // 背景颜色的选择方式
      //       textMode: 'default', // 文字颜色的选择方式
      //       isLock: false,
      //       title: '活动推荐',
      //       subTitle: '查看更多',
      //       titleColor: 'rgba(55,58,68,1)',
      //       subTitleColor: 'rgba(162,162,164,1)',
      //       linkPage: 'sub-packages/marketing-package/pages/activity-module/activity-list/index',
      //       linkName: '活动列表',
      //       showMore: 1,
      //     },
      //   },
      // },
    ],
  },
  {
    type: '容器组件',
    components: [
      {
        id: 'componentContainer',
        // 可拖拽分组
        name: '容器',
        config: {
          // 背景图片
          bg: null,
          // 背景图片展示模式
          bgMode: 'fill',
          // 下级组件
          children: [],
        },
      },
      {
        id: 'navigationContainer',
        name: '导航容器',
        config: {
          style: {
            gap: 5,
            radius: 4,
            marginUp: 8,
            marginDown: 0,
            marginLeftRight: 8,
          },
          activeIndex: 0,
          list: [
            {
              logo: '',
              name: '导航标题',
              children: [],
            },
          ],
        },
      },
    ],
  },
];
