import { declare } from '@babel/helper-plugin-utils';
import pkg from '../package.json';
import type { NodePath, PluginPass } from '@babel/core';

export default declare(function classNameForCssModulePlugin(api) {
  api.assertVersion(7);

  const { types, template } = api;

  const runtimeUtilImportId = `${pkg.name}/runtime`;
  const runtimeImportDefaultName = 'gcn';
  const styleMap = 'sym';
  const stylePathnameReg =
    /(?<=(?:\/))(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+(?=((?=\.(?:css|less|sass)$)))/;

  let lastImportNodePath: NodePath | null = null;

  return {
    name: 'babel-plugin-classname-for-css-module',
    visitor: {
      Program(path, state) {
        let isImportStyle = false;
        let styles: Array<Array<string>> = [];

        path.traverse({
          ImportDeclaration(curPath) {
            lastImportNodePath = curPath;

            const pathname = curPath.node.source.value;
            const regExpMatchArray = pathname.match(stylePathnameReg);

            if (regExpMatchArray) {
              const [styleImportName, moduleSymbol] = regExpMatchArray[0].split('.');

              if (moduleSymbol === 'module') {
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

          path.unshiftContainer(
            'body',
            template.statement(
              `import ${runtimeUtilImportDefaultName} from '${runtimeUtilImportId}'`,
            )(),
          );

          const styleMapId = path.scope.generateUid(styleMap);

          state.set('styleMapId', styleMapId);

          let styleExpressionCode = '';

          if (styles.length > 1) {
            styleExpressionCode = `{${styles.reduce((acc, cur) => {
              const [styleImportDefaultName, styleImportDefaultId] = cur;

              return `${acc}${styleImportDefaultName}: '${styleImportDefaultId}', ${styleImportDefaultId},`;
            }, '')}}`;
          } else {
            const [_, styleImportDefaultId] = styles[0];

            styleExpressionCode = `[${styleImportDefaultId}]`;
          }

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
      StringLiteral(path, state) {
        const parentPath = path.findParent((p) => p.isJSXAttribute());

        if (!parentPath) return;

        if (path.parentPath.isJSXAttribute() && path.parentPath.node.name.name === 'className') {
          const styleStatement = `${state.get(
            'runtimeUtilImportDefaultName',
          )}(${path.getSource()}, ${state.get('styleMapId')})`;
          const styleExpression = template.expression(styleStatement)();

          if (path.parentPath.isJSXExpressionContainer()) {
            path.replaceWith(styleExpression);
          } else {
            path.replaceWith(types.jsxExpressionContainer(styleExpression));
          }

          path.skip();
        }
      },
      Expression(path: NodePath, state: PluginPass) {
        const parentPath = path.findParent((p) => p.isJSXAttribute());

        if (!parentPath) return;

        if (parentPath.isJSXAttribute() && parentPath.node.name.name === 'className') {
          const styleStatement = `${state.get(
            'runtimeUtilImportDefaultName',
          )}(${path.getSource()}, ${state.get('styleMapId')})`;
          const styleExpression = template.expression(styleStatement)();

          path.replaceWith(styleExpression);
          path.skip();
        }
      },
    },
  };
});
