import { declare } from '@babel/helper-plugin-utils';
import pkg from '../package.json';
import type { NodePath } from '@babel/core';

export default declare(function classNameForCssModulePlugin(api) {
  api.assertVersion(7);

  const { types, template } = api;

  // 运行时的helper文件路径
  const runtimeUtilImportId = `${pkg.name}/runtime`;
  // 运行时导入的方法名
  const runtimeImportDefaultName = 'gcn';
  // 多个样式文件导入时，它们会被组合在一个"map"中，"map"的名字
  const styleMap = 'sym';
  // 匹配./xxx.module.(css|less|sass) => xxx.module
  const stylePathnameReg =
    /(?<=(?:\/))(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+(?=((?=\.(?:css|less|sass)$)))/;

  // 保存最后一个的ImportDeclaration 然后在其后面插入styleMap
  let lastImportNodePath: NodePath | null = null;

  return {
    name: 'babel-plugin-classname-for-css-module',
    visitor: {
      Program(path, state) {
        // 是否有样式文件导入的mark
        let isImportStyle = false;
        // 保存导入样式文件的对应的styleImportDefaultName和styleImportDefaultId
        let styles: Array<Array<string>> = [];

        path.traverse({
          ImportDeclaration(curPath) {
            lastImportNodePath = curPath;

            const pathname = curPath.node.source.value;
            const regExpMatchArray = pathname.match(stylePathnameReg);

            if (regExpMatchArray) {
              const [styleImportName, moduleSymbol] = regExpMatchArray[0].split('.');

              if (moduleSymbol === 'module') {
                // 有注释就取注释当作styleImportDefaultName 没有就取xxx.module.(css|less|sass) => xxx
                // 同时把注释去除
                const leadingCommentStyleImportName = curPath.node.source.trailingComments?.shift();
                const styleImportDefaultName = leadingCommentStyleImportName
                  ? leadingCommentStyleImportName.value.replace(/[\s\*]/g, '')
                  : styleImportName;
                const styleImportDefaultId = path.scope.generateUid(styleImportDefaultName);

                styles.push([styleImportDefaultName, styleImportDefaultId]);
                isImportStyle = true;

                curPath.replaceWith(
                  template.statement(`import ${styleImportDefaultId} from '${pathname}';`)(),
                );

                curPath.skip();
              }
            }
          },
        });

        if (isImportStyle) {
          const runtimeUtilImportDefaultName = path.scope.generateUid(runtimeImportDefaultName);

          state.set('runtimeUtilImportDefaultName', runtimeUtilImportDefaultName);

          // 注入运行时helper
          path.unshiftContainer(
            'body',
            template.statement(
              `import ${runtimeUtilImportDefaultName} from '${runtimeUtilImportId}'`,
            )(),
          );

          const styleMapId = path.scope.generateUid(styleMap);

          state.set('styleMapId', styleMapId);

          let styleExpressionCode = '';

          // 如果引入的样式文件超过一个则styleMap为对象形式，否则是数组形式
          if (styles.length > 1) {
            styleExpressionCode = `{${styles.reduce((acc, cur) => {
              const [styleImportDefaultName, styleImportDefaultId] = cur;

              return `${acc}${styleImportDefaultName}: '${styleImportDefaultId}', ${styleImportDefaultId},`;
            }, '')}}`;
          } else {
            const [_, styleImportDefaultId] = styles[0];

            styleExpressionCode = `[${styleImportDefaultId}]`;
          }

          // 在最后一个import后面插入styleMap
          (<NodePath>lastImportNodePath).insertAfter(
            types.variableDeclaration('const', [
              types.variableDeclarator(
                types.identifier(styleMapId),
                template.expression(styleExpressionCode)(),
              ),
            ]),
          );
        }
      },
      Expression(path, state) {
        const parentPath = path.findParent((p) => p.isJSXAttribute());

        if (!parentPath) return;

        if (parentPath.isJSXAttribute() && parentPath.node.name.name === 'className') {
          const styleStatement = `${state.get(
            'runtimeUtilImportDefaultName',
          )}(${path.getSource()}, ${state.get('styleMapId')})`;
          const styleExpression = template.expression(styleStatement)();

          if (path.parentPath.isJSXExpressionContainer()) {
            path.replaceWith(styleExpression);
          } else {
            // 处理<div className="test"></div>的情况 className不是被jsxExpressionContainer包裹的字符串
            path.replaceWith(types.jsxExpressionContainer(styleExpression));
          }

          path.skip();
        }
      },
    },
  };
});
