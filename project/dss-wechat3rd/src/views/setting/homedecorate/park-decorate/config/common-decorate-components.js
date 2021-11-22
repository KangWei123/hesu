import cdnResConfig from '@/business-common/utils/cdnResConfig';
// 零售行业的组件配置
function getComponents() {
  const components = [];
  const componentsList = [
    {
      type: '基础组件',
      components: [
        {
          id: 'posterModule',
          name: '海报',
          config: {
            margin: 0,
            radius: 0,
            marginUp: 5,
            marginDown: 5,
            marginLeftRight: 0,
            data: [],
            exampleData: [],
            isLock: false,
          },
        },
        {
          id: 'imageModule',
          name: '轮播图',
          config: {
            margin: 0,
            radius: 0,
            marginUp: 5,
            marginDown: 5,
            marginLeftRight: 0,
            height: 240,
            data: [],
            exampleData: [],
            isLock: false,
          },
        },
        {
          id: 'titleModule',
          name: '标题',
          config: {
            componentsPadding: 10,
            radius: 0,
            marginUp: 5,
            marginDown: 5,
            marginLeftRight: 0,
            margin: 5,
            textAlign: 'left',
            title: '标题',
            backgroundColor: '#FFFFFF',
            titleColor: 'rgba(55,58,68,1)',
            bgMode: 'default', // 背景颜色的选择方式
            titleMode: 'default', // 文字颜色的选择方式
            isLock: false,
          },
        },
        {
          id: 'magicModule',
          name: '魔方',
          config: {
            componentsPadding: 10,
            name: '1row3',
            margin: 10,
            radius: 0,
            marginUp: 5,
            marginDown: 5,
            marginLeftRight: 10,
            data: [
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '0%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '33.33%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '66.66%',
                src: '',
                linkPage: '',
                linkName: '',
              },
            ],
            exampleData: [
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '0%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '33.33%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '66.66%',
                src: '',
                linkPage: '',
                linkName: '',
              },
            ],
            isLock: false,
          },
        },
        {
          id: 'textNavModule',
          name: '文本导航',
          config: {
            componentsPadding: 10,
            radius: 0,
            marginUp: 5,
            marginDown: 5,
            marginLeftRight: 0,
            fontSize: '16px',
            title: '标题名称',
            subTitle: '更多',
            titleColor: 'rgba(55,58,68,1)',
            subTitleColor: 'rgba(162,162,164,1)',
            bgColor: '#FFFFFF',
            linkPage: '',
            linkName: '',
            showMore: '1',
            bgMode: 'default', // 背景颜色的选择方式
            textMode: 'default', // 文字颜色的选择方式
            isLock: false,
          },
        },
        {
          id: 'navigationModule',
          name: '导航图标',
          config: {
            rowNum: 4,
            circularCorner: 0,
            marginUp: 10,
            marginDown: 0,
            marginLeftRight: 0,
            radius: 0,
            list: [],
            backgroundColor: 'rgba(255,255,255,1)',
            bgMode: 'default', // 背景颜色的选择方式
            titleColor: 'rgba(51, 51, 51, 1)',
            titleMode: 'default', // 文字颜色的选择方式
            isLock: false,
          },
        },
        {
          id: 'topMenuModule',
          name: '顶部菜单',
          config: {
            componentsPadding: 10,
            bgColor: 'rgba(255,187,59,1)',
            titleColor: 'rgba(255, 255, 255, 1)',
            colorModel: 'default',
            alignType: 'left',
            data: [
              {
                title: '推荐',
                linkType: '',
                linkPage: '',
                linkName: '',
              },
              {
                title: '推荐1',
                linkType: '',
                linkPage: '',
                linkName: '',
              },
              {
                title: '推荐2',
                linkType: '',
                linkPage: '',
                linkName: '',
              },
            ],
            isLock: false,
          },
        },
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

  componentsList.forEach(item => {
    components.push(item);
  });

  return components;
}

export default {
  components: getComponents,
};
