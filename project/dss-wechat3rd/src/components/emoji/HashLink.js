/**
 * Created by a123 on 2019/4/29.
 * @author trumpli<李志伟>
 */

function each(list, callback) {
  for (let i = 0, j = list.length; i < j; i++) {
    callback(list[i]);
  }
}

function hookStr(str, deep, hook, node) {
  let c = str.substr(0, deep);
  if (c === str) {
    hook[c] = node;
  } else {
    return !hook[c] ? (hook[c] = { ___: 1 }) : hook[c];
  }
}

function deepStr(str, hook, node) {
  let theHook = hook;
  for (let i = 1, j = str.length; i <= j; i++) {
    theHook = hookStr(str, i, theHook, node);
  }
}

export default {
  root: {},

  source(list, key, node) {
    this.root = { ___: 1 };
    each(list, item => {
      deepStr(item[key], this.root, item[node]);
    });
  },

  searchOne(str, start, inc, hook, replaceKey) {
    let rep = str.substr(start, inc);
    //返回匹配的深度
    if (!hook[rep]) {
      return {
        inc,
        rep
      };
    }

    //匹配到了
    if (!hook[rep].___) {
      return {
        inc,
        rep: hook[rep][replaceKey]
      };
    }

    //递归匹配
    return this.searchOne(str, start, inc + 1, hook[rep], replaceKey);
  },
  search(str, replaceKey) {
    let result = [];
    for (let i = 0, j = str.length; i < j; ) {
      let tmp = this.searchOne(str, i, 1, this.root, replaceKey);
      result.push(tmp.rep);
      i += tmp.inc;
    }
    return result.join('');
  }
};
