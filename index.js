var request = require('sync-request');

/**
 * ��ȡָ�������µ�ssi���ݲ��滻��Ӧssi��ǩ
 * @param  {string} content     �ļ�����
 * @param  {File}   file        fis �� File ���� [fis3/lib/file.js]
 * @param  {object} settings    �����������
 * @return {string}             �������ļ�����
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
            fis.log.error('ssi�﷨����������쳣��ssi��ǩ��' + ssiTag + ',ssi����' + ssiDomain + path + ',�����ļ���' + file.subpath);
        }
        return ssiResponse;
    });

    return content;
};
