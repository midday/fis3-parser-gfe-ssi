var request = require('sync-request');

/**
 * 获取指定域名下的ssi内容并替换相应ssi标签
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象 [fis3/lib/file.js]
 * @param  {object} settings    插件配置属性
 * @return {string}             处理后的文件内容
 */
module.exports = function(content, file, settings) {
    var ssiDomain = settings.ssiDomain;
    var ssiTagRegExp = /<!--[ ]*#[ ]*([a-z]+)([ ]+([a-z]+)=("|')(.+?)("|'))*[ ]*-->/g;
    var ssiCacheDirPath = fis.project.getCachePath() + '/compile/ssi-cache/ssi-cache';

    content = content.replace(ssiTagRegExp, function(ssiTag) {
        var path = ssiTag.match(/("|')(.+?)("|')/gi)[0].replace(/"|'/g, '');
        var ssiUrl = ssiDomain + path;
        var ssiCacheFileName = ssiUrl.replace(/\/|:/g, '_');
        var ssiCacheFilePath = ssiCacheDirPath + '/' + ssiCacheFileName;
        fis.util.mkdir(ssiCacheDirPath);

        var ssiResponse;
        try {
            if (!fis.util.exists(ssiCacheFilePath)) {
                ssiResponse = request('GET', ssiUrl).getBody().toString();
                fis.util.write(ssiCacheFilePath, ssiResponse, 'utf-8');
            } else {
                ssiResponse = fis.util.read(ssiCacheFilePath);
            }
        } catch (e) {
            ssiResponse = ssiTag;
            fis.log.error('ssi语法有误或请求异常，ssi标签：' + ssiTag + ',ssi请求：' + ssiDomain + path + ',所在文件：' + file.subpath);
        }
        return ssiResponse;
    });

    return content;
};
