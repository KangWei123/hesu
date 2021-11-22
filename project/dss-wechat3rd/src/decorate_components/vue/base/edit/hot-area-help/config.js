/**
 * Created by a123 on 2020/4/4.
 * @author trumpli<李志伟>
 */
export const HotAreaData = [];

//热区最小有效高宽
const MiniRange = 30;

//构建-
function buildHotShape(props) {
  return {
    width: props.width,
    height: props.height,
    top: props.top,
    left: props.left
  };
}

//初始化热区
export function initHotAreaData(data) {
  HotAreaData.length = 0;
  data.forEach(item => {
    HotAreaData.push({
      ...item
    });
  });
}

//添加一个热区
export function addHotArea(props) {
  HotAreaData.push({
    id: +new Date(),
    name: '',
    shape: buildHotShape(props)
  });
}

//删除一个热区
export function removeTheHotArea(index) {
  return HotAreaData.splice(index, 1)[0];
}

//删除最后一个热区
function removeLastHotArea() {
  return removeTheHotArea(HotAreaData.length - 1);
}

//更新最后一个热区布局属性
export function updateLastHotAreaLayout(props) {
  const item = { ...removeTheHotArea(HotAreaData.length - 1) };
  item.shape = buildHotShape(props);
  HotAreaData.push(item);
}

//尝试保存最后一个热区进入稳定状态
export function tryToMarkLastHotAreaComplete(props) {
  //需要满足最小高宽
  if (!(props.width >= MiniRange && props.height >= MiniRange)) removeLastHotArea();
  else {
    const item = { ...removeLastHotArea() };
    item.selected = true;
    HotAreaData.push(item);
    return true;
  }
}
