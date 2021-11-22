// @ts-check

/**
 * 自定义 ESLint 规则
 */

const MOD_PREFIX = 'mod-';
const PAGE_PREFIX = 'dss-';

function create(context) {
  const filename = context.getFilename();

  // 只针对 mod/dss- 目录下的文件, 其他的暂时不约束
  const sourceRegexpUnderProject = /project.*\/?((mod|dss)-[a-zA-Z0-9\-_]+)\/?/;
  const sourceRegexp = /\/?((mod|dss)-[a-zA-Z0-9\-_]+)\/?/;

  const moduleMatched = filename.match(sourceRegexpUnderProject);
  if (moduleMatched == null) {
    return {};
  }

  const target = moduleMatched[1];
  // 当前模块
  const currentModule = target.startsWith(MOD_PREFIX) ? target : null;

  function checkSource(node, source) {
    if ((node == null || node.source == null) && source == null) {
      return;
    }

    const importSource = (node.source || source).value;
    const matched = importSource.match(sourceRegexp);
    const loc = node.source ? node.source.loc : source ? source.loc : null;

    if (matched) {
      const name = matched[1];

      if (currentModule && name.startsWith(PAGE_PREFIX) && name !== 'dss-common') {
        // TODO: 旧页面现在不管
        // 业务模块不能导入除了 dss-common 之外的页面
        // 只允许导入 dss-common
        context.report({
          node,
          loc,
          message: '不允许导入除 dss-common 之外的其他页面模块',
        });
      }

      if (name.startsWith(MOD_PREFIX) && name !== currentModule) {
        // 不允许直接导入其他业务模块
        context.report({
          node,
          message: `不允许直接导入其他业务模块, 请通过 @/register/${name.slice(4)} 引用该模块的公开API`,
          loc,
        });
      }
    }
  }

  return {
    ImportDeclaration(node) {
      checkSource(node);
    },
    ExportAllDeclaration(node) {
      checkSource(node);
    },
    ExportNamedDeclaration(node) {
      checkSource(node);
    },
    ImportExpression(node) {
      checkSource(node);
    },
    CallExpression(node) {
      if (
        ((node.callee.type === 'Identifier' && (node.callee.name === 'require' || node.callee.name === 'import')) ||
          node.callee.type === 'Import') &&
        node.arguments.length &&
        node.arguments[0].type === 'Literal'
      ) {
        checkSource(node, node.arguments[0]);
      }
    },
  };
}

module.exports = {
  'no-cross-import': {
    meta: {
      type: 'problem',
      docs: {
        description: '限制业务模块直接导入其他业务模块或页面代码',
        category: 'wakedata',
        recommended: true,
      },
    },
    create,
  },
};
