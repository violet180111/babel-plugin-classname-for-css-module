import _gcn from 'babel-plugin-classname-for-css-module/runtime';
import _style from './style1.module.css';
import _style2 from './style2.module.css';
import _test from './style3.module.css';
import _test2 from './style4.module.css';
const _sym = {
  style1: '_style',
  _style,
  style2: '_style2',
  _style2,
  test1: '_test',
  _test,
  test2: '_test2',
  _test2
};
function Test() {
  return;
  <>
      <div className={_gcn('test', _sym)}></div>
      <div className={_gcn('test1 test2', _sym)}></div>
      <div className={_gcn('test1.a test2.b', _sym)}></div>
      <div className={_gcn(`${Math.random() > .5 ? 'a' : 'b'}`, _sym)}></div>
      <div className={_gcn(function (a, b) {}('a', 'b'), _sym)}></div>
      <div className={_gcn(((a, b) => {})('a', 'b'), _sym)}></div>
      <div className={_gcn(fn('a', 'b'), _sym)}></div>
      <div className={_gcn([].map(() => {}), _sym)}></div>
      <div className={_gcn(Math.random() > .5 ? 'a' : 'b', _sym)}></div>
      <div className={_gcn(['a', 'b'], _sym)}></div>
      <div className={_gcn(a = 'a', _sym)}></div>
      <div className={_gcn('a' + 'b', _sym)}></div>
      <div className={_gcn('a', _sym)}></div>
      <div className={_gcn(function () {}, _sym)}></div>
      <div className={_gcn(() => {}, _sym)}></div>
      <div className={_gcn(class {}, _sym)}></div>
      <div className={_gcn(a, _sym)}></div>
      <div className={_gcn(this, _sym)}></div>
    </>;
}