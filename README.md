# fis3-parser-gfe-ssi
fis3-parser-gfe-ssi


## INSTALL

```bash
npm install [-g] fis3-parser-gfe-ssi
```

## USE

```js
fis.match('/html/**.{html,ftl}', {
    parser: fis.plugin('gfe-ssi', {
        ssiDomain: 'http://www.gome.com.cn'//需要拉取ssi内容的指定域名
    })
});
```