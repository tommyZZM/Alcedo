# Alcedo
A Simple TypeScript HTML5 Game FrameWork For Test!

# Useage

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
},["dom","net","beta-pixi"]);
```

compile lib file

```terminal
gulp alcedo
```

Remember! Testing is the future, and the future starts with you