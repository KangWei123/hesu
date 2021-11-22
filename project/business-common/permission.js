/**
 * 创建判断权限函数
 * @param {Array<any>} permissionMenu - 后端返回的权限菜单树
 * @return {Object}
 * isHavePermission - 当前path是否有权限
 * currentIndex - 当前path所在菜单树的下标
 * currentPath - 当前path - 通过window截取hash值
 */
function handleCurrentPathPermission(permissionMenu) {
  const currentPath = window.location.hash.slice(1);

  const index = permissionMenu.findIndex(
    item =>
      (item.url && currentPath.includes(item.url)) ||
      (item.childMenu &&
        item.childMenu.some(
          sItem =>
            (sItem.url && currentPath.includes(sItem.url)) ||
            (sItem.childMenu && sItem.childMenu.some(tItem => tItem.url && currentPath.includes(tItem.url)))
        ))
  );

  let isHavePermission = false;

  if (index !== -1) {
    isHavePermission = true;
  }

  return { isHavePermission: isHavePermission, currentIndex: index, currentPath: currentPath };
}

/**
 * 创建返回路由url函数
 * @param {Array<any>} permissionMenu - 后端返回的权限菜单树
 * @param {Number} index - 菜单树的下标
 * @return {String} url - 返回URL
 */
function filterRoute(permissionMenu, index = 0, isReturnSecondRoute = false) {
  const isHaveSecondRoute =
    permissionMenu[index].childMenu && permissionMenu[index].childMenu.some(item => item.isMenu === 1);

  // 判断是否有子路由
  if (isHaveSecondRoute && !isReturnSecondRoute) {
    const sRoute = permissionMenu[index].childMenu[0];
    // 判断三级路由
    const isHaveThirdRoute = sRoute.childMenu && sRoute.childMenu.some(item => item.isMenu === 1);

    if (isHaveThirdRoute) {
      return sRoute.childMenu[0].url;
    }

    return sRoute.url;
  }

  return permissionMenu[index].url;
}

export { handleCurrentPathPermission, filterRoute };
