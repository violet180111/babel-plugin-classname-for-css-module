# babel-plugin-classname-for-css-module

## ✨ Features

This plugin allows you to write string classnames **directly** in jsx, and then the classnames will **automatically adapt to** the css module.

#### As follow:

```jsx
import './style.module.css';
function Test() {
  return;
  <>
    <div className="test"></div>
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

#### will be transform to

```jsx
import _getClassName from 'babel-plugin-classname-for-css-module/runtime';
import _style from './style.module.css';
function Test() {
  return;
  <>
    <div className={_getClassName('test', _style)}></div>
    <div className={_getClassName(`${Math.random() > 0.5 ? 'a' : 'b'}`, _style)}></div>
    <div className={_getClassName((function (a, b) {})('a', 'b'), _style)}></div>
    <div className={_getClassName(((a, b) => {})('a', 'b'), _style)}></div>
    <div className={_getClassName(fn('a', 'b'), _style)}></div>
    <div
      className={_getClassName(
        [].map(() => {}),
        _style,
      )}
    ></div>
    <div className={_getClassName(Math.random() > 0.5 ? 'a' : 'b', _style)}></div>
    <div className={_getClassName(['a', 'b'], _style)}></div>
    <div className={_getClassName((a = 'a'), _style)}></div>
    <div className={_getClassName('a' + 'b', _style)}></div>
    <div className={_getClassName('a', _style)}></div>
    <div className={_getClassName(function () {}, _style)}></div>
    <div className={_getClassName(() => {}, _style)}></div>
    <div className={_getClassName(class {}, _style)}></div>
    <div className={_getClassName(a, _style)}></div>
    <div className={_getClassName(this, _style)}></div>
  </>;
}
```

`_getClassName` is a runtime method that helps you handle the expression and also works if the expression returns more than one className

#### like this

```jsx
<div className="App test"></div>
```

#### will be transform to

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

```json
{
  "plugins": ["babel-plugin-classname-for-css-module"]
}
```



☑️ **Todo** :  This plugin currently only supports importing a single style file, but will support multiple style files in the future (because the 🐭🐭 has a final exam).
