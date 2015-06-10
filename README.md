Alcedo
--------------
A Simple TypeScript HTML5 Game FrameWork For Test!

Alcedo(翠鸟)一个简单的TypeScript HTML5 游戏开发框架

## Core
core模块,提供一套单例\业务核心的工厂机制,基于标准TypeScript编译,可以搭配任何框架使用

dom模块,提供简单的Dom操作和选择方法。

## Test
canvas-test模块,实现了一个简单的Canvas渲染机制,包括显示列表机制,以及常用显示对象(MovieClip、Particle等),主要用于个人学习

Demo见:http://tommyzzm.github.io/ColorJet/

async-test模块,异步请求与资源加载模块,加载机制与Egret RES模块类似

pixi-test模块,测试学习Pixi渲染器

Useage
----------
install gulp and alcedo

```terminal
npm install gulp --save
npm install alcedo --save
```

then in gulpfile.js

```javascript
alcedo.alcedoSourceCode("alcedo",{
    outdir:"./out",
    outfile:"alcedo.js",
    watch:false
},["dom","async-test"]);//list of module name..
```

compile lib file

```terminal
gulp alcedo
```

Remember! Testing is the future, and the future starts with you