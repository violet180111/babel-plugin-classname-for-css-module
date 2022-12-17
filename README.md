# babel-plugin-classname-for-css-module

English | [简体中文](./README-zh_CN.md)

## ✨ Features

This plugin allows you to write string classnames **directly** in jsx, and then the classnames will **automatically adapt to** the css module.

#### As follow:

```jsx
import './style1.module.css';
import './style2.module.css';
import './style3.module.css' /* test1 */;
import './style4.module.css' /* test2 */;

function Test() {
  return;
  <>
    <div className="test"></div>
    <div className="test1 test2"></div>
    <div className="test1.a test2.b"></div>
    <div className={`${Math.random() > 0.5 ? 'a' : 'b'}`}></div>
    <div className={(function (a, b) {})('a', 'b')}></div>
    <div className={((a, b) => {})('a', 'b')}></div>
    <div className={fn('a', 'b')}></div>
    <div className={[].map(() => {})}></div>
    <div className={Math.random() > 0.5 ? 'a' : 'b'}></div>
    <div className={['a', 'b']}></div>
    <div className={(a = 'a')}></div>
    <div className={'a' + 'b'}></div>
    <div className={'a'}></div>
    <div className={function () {}}></div>
    <div className={() => {}}></div>
    <div className={class {}}></div>
    <div className={a}></div>
    <div className={this}></div>
  </>;
}
```

#### will be transform to:

```jsx
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
  _test2,
};
function Test() {
  return;
  <>
    <div className={_gcn('test', _sym)}></div>
    <div className={_gcn('test1 test2', _sym)}></div>
    <div className={_gcn('test1.a test2.b', _sym)}></div>
    <div className={_gcn(`${Math.random() > 0.5 ? 'a' : 'b'}`, _sym)}></div>
    <div className={_gcn((function (a, b) {})('a', 'b'), _sym)}></div>
    <div className={_gcn(((a, b) => {})('a', 'b'), _sym)}></div>
    <div className={_gcn(fn('a', 'b'), _sym)}></div>
    <div
      className={_gcn(
        [].map(() => {}),
        _sym,
      )}
    ></div>
    <div className={_gcn(Math.random() > 0.5 ? 'a' : 'b', _sym)}></div>
    <div className={_gcn(['a', 'b'], _sym)}></div>
    <div className={_gcn((a = 'a'), _sym)}></div>
    <div className={_gcn('a' + 'b', _sym)}></div>
    <div className={_gcn('a', _sym)}></div>
    <div className={_gcn(function () {}, _sym)}></div>
    <div className={_gcn(() => {}, _sym)}></div>
    <div className={_gcn(class {}, _sym)}></div>
    <div className={_gcn(a, _sym)}></div>
    <div className={_gcn(this, _sym)}></div>
  </>;
}
```

`_gcn` is a runtime method, so you don't need to explicitly import it. It will help you deal with class names that are only available at runtime, and if multiple stylesheets have been imported, it will also correctly help you deal with correspondence between class names.

#### like this:

```jsx
<div className="App test"></div>
```

#### will be transform to:

```jsx
<div className="_App_ahvyq_8 _test_ahvyq_46"></div>
```

## 📦 Install

```
npm i babel-plugin-classname-for-css-module -D
yarn add babel-plugin-classname-for-css-module -D
pnpm i babel-plugin-classname-for-css-module -D
```

## 🔨 Usage

- first you need to apply the plugin.

```json
// babel.config.js
{
  "plugins": ["babel-plugin-classname-for-css-module"]
}
```

- then you just need to include the css module in the js file where you want to use it.

```js
import './style.module.css';
```

- you can do this if you have multiple stylesheets to import. (note: the introduction of the CSS file specification must be XXX.module.(CSS |less|sass))

```jsx
import './style3.module.css';
import './style4.module.css';

<div className="style3.xxx style4.xxx"></div>;
```

- you can also use comments to decide which class names to import.

```jsx
import './style3.module.css' /* test1 */;
import './style4.module.css' /* test2 */;

<div className="test1.xxx test2.xxx"></div>;
```
