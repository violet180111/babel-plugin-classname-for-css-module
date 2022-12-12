import { declare } from '@babel/helper-plugin-utils';
import pkg from '../package.json';
import type { NodePath, PluginPass } from '@babel/core';

export default declare(function classNameForCssModulePlugin(api) {
  api.assertVersion(7);

  const runtimeUtilImportId = `${pkg.name}/runtime`;
  const runtimeImportDefaultName = 'getClassName';
  const stylePathnameReg =
    /(?<=(?:\/))(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+(?=((?=\.(?:css|less|sass)$)))/;

  return {
    name: 'babel-plugin-classname-for-css-module',
    visitor: {
      Program(path, state) {
        path.traverse({
          ImportDeclaration(curPath) {
            const pathname = curPath.node.source.value;
            const regExpMatchArray = pathname.match(stylePathnameReg);

            if (regExpMatchArray) {
              const [styles, moduleSymbol] = regExpMatchArray[0].split('.');

              if (moduleSymbol === 'module') {
                if (pathname === runtimeUtilImportId) {
                  state.set('runtimeUtilImportId', runtimeUtilImportId);
                }

                const styleImportDefaultName = path.scope.generateUid(styles);

                state.set('styleImportDefaultName', styleImportDefaultName);
                state.set('isImportStyle', true);

                curPath.replaceWith(
                  api.template.statement(`import ${styleImportDefaultName} from '${pathname}'`)(),
                );

                curPath.skip();
              }
            }
          },
        });

        if (state.get('isImportStyle') && !state.get('runtimeUtilImportId')) {
          const runtimeUtilImportDefaultName = path.scope.generateUid(runtimeImportDefaultName);

          state.set('runtimeUtilImportDefaultName', runtimeUtilImportDefaultName);

          path.unshiftContainer(
            'body',
            api.template.statement(
              `import ${runtimeUtilImportDefaultName} from '${runtimeUtilImportId}'`,
            )(),
          );
        }
      },
      StringLiteral(path, state) {
        const parentPath = path.findParent((p) => p.isJSXAttribute());
        // @ts-ignore
        if (path.skipTransform || !parentPath) return;

        if (path.parentPath.isJSXAttribute() && path.parentPath.node.name.name === 'className') {
          const styleStatement = `${state.get(
            'runtimeUtilImportDefaultName',
          )}(${path.getSource()}, ${state.get('styleImportDefaultName')})`;
          const styleExpression = api.template.expression(styleStatement)();

          if (path.parentPath.isJSXExpressionContainer()) {
            path.replaceWith(styleExpression);
          } else {
            path.replaceWith(api.types.jsxExpressionContainer(styleExpression));
          }

          // @ts-ignore
          path.skipTransform = true;
          path.skip();
        }
      },
      Expression(path: NodePath, state: PluginPass) {
        const parentPath = path.findParent((p) => p.isJSXAttribute());
        // @ts-ignore
        if (path.skipTransform || !parentPath) return;

        if (parentPath.isJSXAttribute() && parentPath.node.name.name === 'className') {
          const styleStatement = `${state.get(
            'runtimeUtilImportDefaultName',
          )}(${path.getSource()}, ${state.get('styleImportDefaultName')})`;
          const styleExpression = api.template.expression(styleStatement)();

          path.replaceWith(styleExpression);
          // @ts-ignore
          path.skipTransform = true;
          path.skip();
        }
      },
    },
  };
});
