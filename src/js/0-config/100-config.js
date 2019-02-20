/**
 * Переопределение настроек
 *
 * @version 20.02.2019
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */

// Переопределение настроек приложения
config.overrideSettings = {
    versionAPI   : 1,
    authType     : 'email',
    pageAfterAuth: '/home',
    marketiOS    : 'https://itunes.apple.com/us/app/lemurro/id0000000000?l=ru&ls=1&mt=8',
    marketAndroid: 'market://details?id=ru.bestion.lemurro',
    onLoad       : function (data) {
        var template = Template7.compile($$('#js-tpl-user__info').html());

        $$('#js-user_info').html(template(data));
    }
};

// Переопределение настроек framework7
config.overrideF7Settings = {
    id     : 'ru.bestion.lemurro',
    name   : 'Lemurro',
    version: '0.1.0',
    routes : [
        {
            path: '/about',
            url : './pages/about.html'
        }, {
            path: '/home',
            url : './pages/home.html'
        }
    ]
};