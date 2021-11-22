//模板仓库，组件模板的配置信息和支持的组件列表
//不同的组件有不同的配置文件，生成组件配置的方法名与组件名一致。
const ComponentName = {
  WD_TEXT: 'WdText',
  WD_GOODS: 'WdGoods',
};

export default {
  ComponentConfig: {
    [ComponentName.WD_GOODS]() {
      return {
        name: ComponentName.WD_GOODS,
        prop: {
          name: '商品名',
          desc: '商品描述信息',
          icon: 'https://openfile.meizu.com/group1/M00/05/F1/Cgbj0VtqgnWADjmlAAipoSE4bZM493.png680x680.jpg',
        }
      };
    },
    [ComponentName.WD_TEXT]() {
      return {
        name: ComponentName.WD_TEXT,
        prop: {
          text: 'dddddddddd',
          color: '#000000',
          bgColor: '#ffff00',
          textAlign: 'left',//center left right
          fontSize: 'middle'//large middle small
        }
      };
    },
    [ComponentName.WD_PAGE]() {
      return {
        name: ComponentName.WD_PAGE,
        prop: {
          text: '页面标题',
        }
      };
    }
  },
  ComponentList: [
    {
      name: ComponentName.WD_GOODS,
      dragShow: true,
      title: '商品',
      class: 'icon-goods'
    },
    {
      name: ComponentName.WD_TEXT,
      dragShow: true,
      title: '文字',
      class: 'icon-txt'
    }
  ]
};
