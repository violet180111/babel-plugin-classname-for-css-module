import _getClassName from 'babel-plugin-classname-for-css-module/runtime';
import _style from './style.module.css';
function Test() {
  return;
  <>
    <div className={_getClassName('test', _style)}></div>
    <div className={_getClassName('test1 test2', _style)}></div>
    <div className={_getClassName(`${Math.random() > .5 ? 'a' : 'b'}`, _style)}></div>
    <div className={_getClassName(function (a, b) {}('a', 'b'), _style)}></div>
    <div className={_getClassName(((a, b) => {})('a', 'b'), _style)}></div>
    <div className={_getClassName(fn('a', 'b'), _style)}></div>
    <div className={_getClassName([].map(() => {}), _style)}></div>
    <div className={_getClassName(Math.random() > .5 ? 'a' : 'b', _style)}></div>
    <div className={_getClassName(['a', 'b'], _style)}></div>
    <div className={_getClassName(a = 'a', _style)}></div>
    <div className={_getClassName('a' + 'b', _style)}></div>
    <div className={_getClassName('a', _style)}></div>
    <div className={_getClassName(function () {}, _style)}></div>
    <div className={_getClassName(() => {}, _style)}></div>
    <div className={_getClassName(class {}, _style)}></div>
    <div className={_getClassName(a, _style)}></div>
    <div className={_getClassName(this, _style)}></div>
  </>;
}