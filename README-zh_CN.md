# babel-plugin-classname-for-css-module

[English](./README.md) | 简体中文

## ✨ 特性

这个插件允许你在 jsx 中 **直接** 编写字符串类名，然后这些类名将 **自动适应** css module。

#### 如下:

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

#### 将会被转换为:

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

`_gcn `是一个运行时方法，所以你不需要显式地导入它。它将帮助你处理在运行时才能得到的类名，并且如果有多个样式文件被引入，它也能正确地帮助你处理类名之间的对应关系。

#### 如下:

```jsx
<div className="App test"></div>
```

#### 将会被转换为:

```jsx
<div className="_App_ahvyq_8 _test_ahvyq_46"></div>
```

## 📦 安装

```
npm i babel-plugin-classname-for-css-module -D
yarn add babel-plugin-classname-for-css-module -D
pnpm i babel-plugin-classname-for-css-module -D
```

## 🔨 用法

- 首先你需要应用这个插件

```json
// babel.config.js
{
  "plugins": ["babel-plugin-classname-for-css-module"]
}
```

- 然后你只需要在你想要使用它的 js 文件中引入 css module (注意：引入的 css 文件名规范一定要是 xxx.module.(css|less|sass))

```js
import './style.module.css';
```

- 如果要导入多个样式表，可以这样做

```jsx
import './style3.module.css';
import './style4.module.css';

<div className="style3.xxx style4.xxx"></div>;
```

- 你还可以通过注释决定导入的类名

```jsx
import './style3.module.css' /* test1 */;
import './style4.module.css' /* test2 */;

<div className="test1.xxx test2.xxx"></div>;
```
