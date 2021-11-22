// @ts-check
import Vue from 'vue';
/**
 *
 * @param {{ addedIndex?: number, payload: any, removedIndex: number  }} evt drop 事件对象
 * @param {any[]} bindings 绑定的列表
 */
export function handleDrop(evt, bindings) {
  const { addedIndex, removedIndex, payload } = evt;
  if (addedIndex === removedIndex || payload == null) {
    // 没有变动
    return null;
  }

  if (addedIndex != null) {
    if (removedIndex != null) {
      // 移位，交换位置
      const temp = bindings[removedIndex];
      bindings.splice(removedIndex, 1);
      bindings.splice(addedIndex, 0, temp);
    } else {
      // 新增
      bindings.splice(addedIndex, 0, payload);
    }
    return payload;
  } else if (removedIndex != null) {
    // 移除
    bindings.splice(removedIndex, 1);
  }

  return null;
}
