export default {
  user: {
    /**  验证是否登录  */
    checklogin: '/dsp/rest/checklogin.do',
    /**  退出登录接口  */
    logout: '/dsp/rest/logout.do'
  },
  /** 首页接口 */
  home: {
    /** 公告 */
    announcement: '/dsp/rest/index/getannouncelist.do',
    /** 广告统计 */
    statistic: '/dsp/rest/index/getdelivery.do',
    /** 广告效果统计数据 */
    effect: '/dsp/rest/index/static.do',
    /** 广告效果趋势数据 */
    effectTrend: '/dsp/rest/index/statics.do',
    /** 排行榜数据 */
    rank: '/dsp/rest/index/gettoplist.do'
  },
  /** 受众分析接口 */
  portrait: {
    list: '/dsp/rest/audience/statics.do'
  },
  /** 效果分析接口 */
  effect: {
    list: '/dsp/rest/effect/statics.do'
  },
  push: {
    /** 广告计划列表 */
    planList: '/dsp/rest/delivery/getplans.do',
    /** 单元列表 */
    unitList: '/dsp/rest/delivery/getunits.do',
    /** 添加计划 */
    addPlan: '/dsp/rest/delivery/addPlan.do',
    /** 广告详情 */
    getUnitDetail: '/dsp/rest/delivery/getUnitDetail.do',
    /** 删除广告单元 */
    removeUnit: '/dsp/rest/delivery/removeUnit.do',
    /** 删除广告计划 */
    removePlan: '/dsp/rest/delivery/removePlan.do',
    /** 修改广告计划状态： 投放开关 */
    modifyPlanStatus: '/dsp/rest/delivery/modifyPlanStatus.do',
    /** 修改广告单元状态： 投放开关 */
    modifyUnitStatus: '/dsp/rest/delivery/modifyUnitStatus.do',

    /** 获取广告受众定向标签列表 */
    getTagList: '/dsp/rest/delivery/getTag.do',
    /** 获取子级标签维度列表 */
    getSubTagList: '/dsp/rest/delivery/getTagValue.do',
    /** 编辑时，获取选中的标签维度列表 */
    getSavedTagValue: '/dsp/rest/delivery/getSavedTagValue.do',
    /** 模糊搜索标签列表 */
    searchTagValue: '/dsp/rest/delivery/searchTagValue.do',
    /** 上传广告图片 */
    uploadImage: '/dsp/rest/delivery/uploadImage.do',
    /** 获取广告规格 */
    getAdForm: '/dsp/rest/delivery/getAdForm.do',
    /** 获取取付费方式（推广目标） */
    getBidType: '/dsp/rest/delivery/getBidType.do',
    /** 获取广告形式 */
    getIdeaSlots: '/dsp/rest/delivery/getIdeaSlots.do',
    /** 新建广告单元接口 */
    addUnit: '/dsp/rest/delivery/addUnit.do',
    /** 查询uip标签人群数 */
    getUserCount: '/dsp/rest/delivery/getUserCount.do'
  },
  /** 数据 */
  data: {
    /** 广告计划列表 */
    planList: '/dsp/rest/delivery/getplanlist.do',
    /** 单元列表 */
    unitList: '/dsp/rest/delivery/getunits.do'
  },
  /** 人群包 */
  group: {
    // 人群列表
    list: '/dsp/rest/crowd/list.do',
    // 人群上传
    upload: '/dsp/rest/delivery/getplanlist.do',
    // 新建人群包
    add: '/dsp/rest/crowd/save.do',
    // 删除人群包
    delete: '/dsp/rest/crowd/remove.do'
  },
  /** 短信投放 */
  message: {
    // 短信列表
    list: '/dsp/rest/admsg/list.do',
    // 手机号上传
    upload: '/dsp/rest/admsg/upload.do',
    // 新建短信投放
    add: '/dsp/rest/admsg/add.do',
    // 删除短信投放
    delete: '/dsp/rest/admsg/delete.do',
    // 查看短信投放
    detail: '/dsp/rest/admsg/get.do',
    // 上传短信txt文件
    uploadAdMsg: '/dsp/rest/admsg/upload'
  },
  /**  【dmp平台】接入的接口  */
  dmp: {
    crowd_list: '/dmp/rest/crowd/list/crowds', // 查询人群列表，分页
    crowd_upload: '/dmp/rest/crowd/upload', // 人群导入
    crowd_list_upload: '/dmp/rest/crowd/save/crowds', // 人群批量导入
    crowd_get: '/dmp/rest/crowd/get/crowd', // 根据id查询人群详情
    analysis_overview: '/dmp/rest/crowd/analysis/crowd/userCount' // 人群条件预览, 查询预计覆盖目标人数
  }
};
