/**
 *
 * @author trumpli<周奎>
 */
import wpBaseApi from '@/business-common/wp-base-api.js';
import services from '@/dss-common/utils/services';
import Axios from 'axios';
const WpSchema = wpBaseApi.WpSchema;
const McSchema = wpBaseApi.McSchema;

export default {
  // 上传素材
  upload(params) {
    const formData = new FormData();
    params.fileList.forEach((item, index) => {
      formData.append('files', item.raw);
    });
    if (params.tagIds) {
      formData.append('tagIds', params.tagIds);
    }
    formData.append('folderId', params.folderId);
    return new Promise((resolve, reject) => {
      Axios.post(`${WpSchema}/material/v2/upload`, formData, { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
          const result = res.data;
          if (res && res.status === 200 && res.data.success) {
            resolve(result);
          } else {
            reject('上传文件失败:' + result.errorMessage);
          }
        })
        .catch(error => {
          reject('上传文件失败:' + error);
        });
    });
  },

  /**
   * 增加文件夹
   * @param params
   *
   */
  addFolder(params) {
    return services.post(WpSchema + '/material/folder/v2/add', params, {
      action: '增加文件夹',
    });
  },

  /**
   * 删除文件
   */
  deleteFolder(params) {
    return services.post(WpSchema + '/material/recycle_bin/recycle', params, {
      action: '删除文件夹',
    });
  },

  /**
   * 修改文件夹
   */
  updateFolder(params) {
    return services.post(WpSchema + '/material/folder/v2/update', params, {
      action: '修改文件夹',
    });
  },

  /**
   * 查询文件夹列表
   */
  queryTree(params) {
    return services.get(McSchema + '/material/folder/v2/queryTree', {
      action: '查询文件夹列表',
      params,
    });
  },

  /**
   * 恢复文件
   */
  revertFolder(params) {
    return services.post(WpSchema + '/material/recycle_bin/restore', params, {
      action: '恢复文件',
    });
  },

  /**
   * 查询重复文件信息
   */
  duplicate(params) {
    return services.get(WpSchema + '/material/recycle_bin/duplicate/folder', {
      action: '查询重复文件信息',
      params,
    });
  },

  /**
   * 查询素材列表
   */
  materialList(params) {
    return services.get(McSchema + '/material/v2/list', {
      action: '查询素材列表',
      params,
    });
  },

  /**
   * 更新素材
   */
  updateMaterial(params) {
    return services.json(WpSchema + '/material/v2//update', params, {
      action: '更新素材',
    });
  },

  /**
   * 批量删除素材
   */
  deleteMaterial(params) {
    return services.json(WpSchema + '/material/recycle_bin/recycle/batch', params, {
      action: '批量删除素材',
    });
  },

  /**
   * 获取素材详情
   */
  get_statistics_info(params) {
    return services.get(WpSchema + '/material/v2/get_statistics_info', {
      action: '获取素材详情',
      params,
    });
  },

  /**
   * 移动素材
   */
  moveMaterial(params, groupId) {
    return services.json(WpSchema + `/material/v2/move/${groupId}`, params, {
      action: '移动素材',
    });
  },

  /**
   * 新增标签
   */
  addTag(params) {
    return services.json(`${WpSchema}/material_tag/add_tag`, params, { action: '新增标签' });
  },
  /**
   * 删除标签
   */
  deleteTag(params) {
    return services.post(`${WpSchema}/material_tag/delete_tag`, params, { action: '删除标签' });
  },

  /**
   * 获取搜索信息
   */
  filters_list(params) {
    return services.get(WpSchema + '/material/v2/filters_list', { action: '获取搜索信息', params });
  },

  /**
   * 最近使用
   */
  getHistoryList(params) {
    return services.get(McSchema + '/material_tag/recently_used', { action: '获取最近使用标签列表', params });
  },

  /**
   * 标签列表
   */
  getTagList(params) {
    return services.get(WpSchema + '/material_tag/list_tag', { action: '获取标签列表', params });
  },

  /**
   * 标签列表
   */
  getTagListV2(params) {
    return services.get(McSchema + '/material_tag/list_tag_with_group', { action: '获取标签列表', params });
  },

  /**
   * 移动标签至群组
   */
  moveTagToGroup(params) {
    return services.post(`${WpSchema}/material_tag/move_to_group`, params, { action: '移动标签至群组' });
  },
  /**
   * 将标签从群组中移除
   */
  removeTagFromGroup(params) {
    return services.post(`${WpSchema}/material_tag/remove_from_group`, params, { action: '移除标签' });
  },
  /**
   * 更新标签
   */
  updateTag(params) {
    return services.json(`${WpSchema}/material_tag/update_tag`, params, { action: '更新标签' });
  },
  /**
   * 创建标签分组
   */
  addGroupOfTag(params) {
    return services.json(`${WpSchema}/material_tag_group/add_group`, params, { action: '新增群组' });
  },
  /**
   * 删除标签分组
   */
  deleteGroupOfTag(params) {
    return services.post(`${WpSchema}/material_tag_group/delete_group`, params, { action: '删除群组' });
  },
  /**
   * 获取标签群组
   */
  getGroupList(params) {
    return services.get(WpSchema + '/material_tag_group/list_group', { action: '获取标签群组', params });
  },
  /**
   * 获取标签群组
   */
  getGroupListWithTags(params) {
    return services.get(WpSchema + '/material_tag_group/list_group_with_tags', { action: '获取标签群组', params });
  },
  /**
   * 更新标签分组
   */
  updateGroupOfTag(params) {
    return services.json(`${WpSchema}/material_tag_group/update_group`, params, { action: '更新群组' });
  },
};
