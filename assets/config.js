/**
 * Настройки
 *
 * @version 02.02.2018
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */
var config = (function () {
    /**
     * Настройки для Framework7
     *
     * @type {object}
     */
    var f7settings = {
        id     : 'ru.bestion.lemurro',
        name   : 'Lemurro',
        version: '0.1.0',
        theme  : 'md',
        root   : '#app',
        panel  : {
            swipe: 'both'
        },
        touch  : {
            fastClicks: false
        },
        on     : {
            pageInit: function () {
                app.panel.close();
            }
        },
        routes : [
            {
                path: '/about',
                url : './pages/about.html'

            }, {
                path: '/home',
                url : './pages/home.html',
                on  : {
                    pageInit: function (event, page) {
                        home.init();
                    }
                }
            }
        ]
    };

    /**
     * Версия API
     *
     * @type {int}
     */
    var versionAPI = 1;

    /**
     * Настройки аутентификации
     *
     * type - Вид аутентификации
     *        email: по электронной почте (код через email)
     *        phone: по номеру телефона (код через смс)
     *
     * pageAfter - Страница после успешной аутентификации
     *
     * @type {object}
     */
    var auth = {
        type     : 'email',
        pageAfter: '/home'
    };

    /**
     * Ссылки на магазины для окна с обновлением приложения
     *
     * @type {object}
     */
    var market = {
        iOS    : 'https://itunes.apple.com/us/app/lemurro/id0000000000?l=ru&ls=1&mt=8',
        Android: 'market://details?id=ru.bestion.lemurro'
    };

    return {
        f7settings: f7settings,
        versionAPI: versionAPI,
        auth      : auth,
        market    : market
    };
})();