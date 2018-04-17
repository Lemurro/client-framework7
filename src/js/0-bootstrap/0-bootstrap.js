/**
 * Загрузочный скрипт приложения
 *
 * @version 17.04.2018
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */

var app;
var $$;
var mainView;

window.onload = function () {
    if (modeCordova) {
        document.addEventListener('deviceready', bootstrap.init, false);
        document.addEventListener('offline', internet.offline, false);
        document.addEventListener('online', internet.online, false);
    } else {
        bootstrap.init();
    }
};

var bootstrap = (function () {
    /**
     * ИД сессии
     *
     * @type {string}
     */
    var sessionID = '';

    // d888888b d8b   db d888888b d888888b
    //   `88'   888o  88   `88'   `~~88~~'
    //    88    88V8o 88    88       88
    //    88    88 V8o88    88       88
    //   .88.   88  V888   .88.      88
    // Y888888P VP   V8P Y888888P    YP
    //
    //

    /**
     * Инициализация
     *
     * @version 17.04.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function init() {
        _bindJSerrors();

        app      = new Framework7(config.f7settings);
        $$       = Dom7;
        mainView = app.views.create('.view-main');

        $$('#js-api-version').text(config.versionAPI);

        bootstrap.showLoginScreen();

        app.request.setup({
            cache      : false,
            crossDomain: true,
            timeout    : 20000,
            beforeSend : function (xhr) {
                if (xhr.requestUrl.substr(0, pathServerAPI.length) === pathServerAPI) {
                    xhr.requestParameters.dataType = 'json';
                    xhr.setRequestHeader('X-SESSION-ID', bootstrap.sessionID);
                }
            },
            error      : function (xhr, status) {
                app.preloader.hide();

                var message = 'Неизвестная ошибка';

                switch (status) {
                    case 'timeout'    :
                        message = 'Время ожидания истекло';
                        break;

                    case 'parsererror':
                        message = 'Ошибка парсера';
                        break;

                    case 'abort'      :
                        message = 'Запрос был отменён';
                        break;

                    case 'error'      :
                        message = 'Произошла ошибка сервера';
                        break;
                }

                app.dialog.alert(message, 'Ошибка запроса');
            }
        });

        app.preloader.show();
        app.request.get(pathServerAPI, {}, function (result) {
            app.preloader.hide();

            if (result.hasOwnProperty('errors')) {
                bootstrap.showErrors(result.errors);
            } else {
                if (modeCordova && parseInt(result.data.version[device.platform.toLowerCase()], 10) > config.versionAPI) {
                    var popup = $$('#js-popup');

                    popup.find('.popup__title').html('&nbsp;');
                    popup.find('.popup__content').html(
                        '<div class="text-align-center">' +
                        '<h1><i class="icofont icofont-thumbs-up font-100"></i></h1>' +
                        '<h1>Ура, вышла новая версия приложения!</h1>' +
                        '<h3>Чтобы продолжить, обновите приложение из магазина.</h3>' +
                        '<p><a href="javascript:bootstrap.update();" class="button button-raised button-fill">Обновить</a></p>' +
                        '</div>'
                    );
                    popup.find('.close-popup').hide();

                    app.popup.open(popup);
                } else {
                    _bindShowPopover();
                    _bindPhoneMask();
                    _bindCodeMask();
                    _bindExternalLink();

                    localforage.getItem('sessionID', function (err, value) {
                        bootstrap.sessionID = value;

                        if (bootstrap.sessionID !== null) {
                            auth.check();
                        }
                    });
                }
            }
        });
    }

    // .d8888. db   db  .d88b.  db   d8b   db d88888b d8888b. d8888b.  .d88b.  d8888b. .d8888.
    // 88'  YP 88   88 .8P  Y8. 88   I8I   88 88'     88  `8D 88  `8D .8P  Y8. 88  `8D 88'  YP
    // `8bo.   88ooo88 88    88 88   I8I   88 88ooooo 88oobY' 88oobY' 88    88 88oobY' `8bo.
    //   `Y8b. 88~~~88 88    88 Y8   I8I   88 88~~~~~ 88`8b   88`8b   88    88 88`8b     `Y8b.
    // db   8D 88   88 `8b  d8' `8b d8'8b d8' 88.     88 `88. 88 `88. `8b  d8' 88 `88. db   8D
    // `8888Y' YP   YP  `Y88P'   `8b8' `8d8'  Y88888P 88   YD 88   YD  `Y88P'  88   YD `8888Y'
    //
    //

    /**
     * Отображение ошибок
     *
     * @param errors array Массив ошибок
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function showErrors(errors) {
        if (errors.length === 1 && errors[0].status === '401 Unauthorized') {
            bootstrap.showLoginScreen();
        } else {
            for (var i in errors) {
                var item  = errors[i];
                var title = '';

                switch (item.code) {
                    case 'danger':
                        title = 'Критическая ошибка';
                        break;

                    case 'warning':
                        title = 'Внимание!';
                        break;

                    case 'info':
                        title = 'Информация';
                        break;
                }

                app.dialog.alert(item.title, title);
            }
        }
    }

    // db    db d8888b. d8888b.  .d8b.  d888888b d88888b
    // 88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'
    // 88    88 88oodD' 88   88 88ooo88    88    88ooooo
    // 88    88 88~~~   88   88 88~~~88    88    88~~~~~
    // 88b  d88 88      88  .8D 88   88    88    88.
    // ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P
    //
    //

    /**
     * Запускаем обновление приложения
     *
     * @version 02.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function update() {
        if (modeCordova && config.market.hasOwnProperty(device.platform)) {
            window.open(config.market[device.platform], '_system');
            e.preventDefault();
        } else {
            app.dialog.alert('Здесь должна быть ссылка на магазин "' + device.platform + '"', 'Магазин');
        }

        return false;
    }

    // .d8888. db   db  .d88b.  db   d8b   db db       .d88b.   d888b  d888888b d8b   db .d8888.  .o88b. d8888b. d88888b d88888b d8b   db
    // 88'  YP 88   88 .8P  Y8. 88   I8I   88 88      .8P  Y8. 88' Y8b   `88'   888o  88 88'  YP d8P  Y8 88  `8D 88'     88'     888o  88
    // `8bo.   88ooo88 88    88 88   I8I   88 88      88    88 88         88    88V8o 88 `8bo.   8P      88oobY' 88ooooo 88ooooo 88V8o 88
    //   `Y8b. 88~~~88 88    88 Y8   I8I   88 88      88    88 88  ooo    88    88 V8o88   `Y8b. 8b      88`8b   88~~~~~ 88~~~~~ 88 V8o88
    // db   8D 88   88 `8b  d8' `8b d8'8b d8' 88booo. `8b  d8' 88. ~8~   .88.   88  V888 db   8D Y8b  d8 88 `88. 88.     88.     88  V888
    // `8888Y' YP   YP  `Y88P'   `8b8' `8d8'  Y88888P  `Y88P'   Y888P  Y888888P VP   V8P `8888Y'  `Y88P' 88   YD Y88888P Y88888P VP   V8P
    //
    //

    /**
     * Покажем форму входа
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function showLoginScreen() {
        $$('#js-login-screen .js-auth-form').hide();
        $$('#js-auth-' + config.auth.type + '-get-form').show();
        app.loginScreen.open('#js-login-screen');
    }

    //         d8888b. d888888b d8b   db d8888b.    d88b .d8888. d88888b d8888b. d8888b.  .d88b.  d8888b. .d8888.
    //         88  `8D   `88'   888o  88 88  `8D    `8P' 88'  YP 88'     88  `8D 88  `8D .8P  Y8. 88  `8D 88'  YP
    //         88oooY'    88    88V8o 88 88   88     88  `8bo.   88ooooo 88oobY' 88oobY' 88    88 88oobY' `8bo.
    //         88~~~b.    88    88 V8o88 88   88     88    `Y8b. 88~~~~~ 88`8b   88`8b   88    88 88`8b     `Y8b.
    //         88   8D   .88.   88  V888 88  .8D db. 88  db   8D 88.     88 `88. 88 `88. `8b  d8' 88 `88. db   8D
    // C88888D Y8888P' Y888888P VP   V8P Y8888D' Y8888P  `8888Y' Y88888P 88   YD 88   YD  `Y88P'  88   YD `8888Y'
    //
    //

    /**
     * Событие отправки javascript-ошибки при возникновении
     *
     * @version 17.04.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function _bindJSerrors() {
        /**
         * Отправка javascript-ошибки
         *
         * @param {string} msg
         * @param {string} file
         * @param {string} line
         * @param {string} col
         * @param {string} err
         *
         * @version 17.04.2018
         * @author  Дмитрий Щербаков <atomcms@ya.ru>
         */
        function sendError(msg, file, line, col, err) {
            var errString = 'JSON not found';
            if (window.JSON) {
                errString = JSON.stringify(err);
            }

            if (typeof(msg) === 'object') {
                file      = msg.filename;
                line      = msg.lineno;
                col       = msg.colno;
                errString = msg.error.stack;
                msg       = msg.message;
            }

            new Image().src = pathServerAPI + 'jserrors?msg=' + encodeURIComponent(msg) + '&file=' + encodeURIComponent(file) + '&line=' + encodeURIComponent(line) + '&col=' + encodeURIComponent(col) + '&err=' + encodeURIComponent(errString);
        }

        if (window.addEventListener) {
            window.addEventListener('error', sendError, false);
        } else if (window.attachEvent) {
            window.attachEvent('onerror', sendError);
        } else {
            window.onerror = sendError;
        }
    }

    //         d8888b. d888888b d8b   db d8888b. .d8888. db   db  .d88b.  db   d8b   db d8888b.  .d88b.  d8888b.  .d88b.  db    db d88888b d8888b.
    //         88  `8D   `88'   888o  88 88  `8D 88'  YP 88   88 .8P  Y8. 88   I8I   88 88  `8D .8P  Y8. 88  `8D .8P  Y8. 88    88 88'     88  `8D
    //         88oooY'    88    88V8o 88 88   88 `8bo.   88ooo88 88    88 88   I8I   88 88oodD' 88    88 88oodD' 88    88 Y8    8P 88ooooo 88oobY'
    //         88~~~b.    88    88 V8o88 88   88   `Y8b. 88~~~88 88    88 Y8   I8I   88 88~~~   88    88 88~~~   88    88 `8b  d8' 88~~~~~ 88`8b
    //         88   8D   .88.   88  V888 88  .8D db   8D 88   88 `8b  d8' `8b d8'8b d8' 88      `8b  d8' 88      `8b  d8'  `8bd8'  88.     88 `88.
    // C88888D Y8888P' Y888888P VP   V8P Y8888D' `8888Y' YP   YP  `Y88P'   `8b8' `8d8'  88       `Y88P'  88       `Y88P'     YP    Y88888P 88   YD
    //
    //

    /**
     * Покажем popover
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function _bindShowPopover() {
        $$('body').on('click', '.js-show-popover', function () {
            app.dialog.alert($$(this).attr('data-popover'), '');
        });
    }

    //         d8888b. d888888b d8b   db d8888b. d8888b. db   db  .d88b.  d8b   db d88888b .88b  d88.  .d8b.  .d8888. db   dD
    //         88  `8D   `88'   888o  88 88  `8D 88  `8D 88   88 .8P  Y8. 888o  88 88'     88'YbdP`88 d8' `8b 88'  YP 88 ,8P'
    //         88oooY'    88    88V8o 88 88   88 88oodD' 88ooo88 88    88 88V8o 88 88ooooo 88  88  88 88ooo88 `8bo.   88,8P
    //         88~~~b.    88    88 V8o88 88   88 88~~~   88~~~88 88    88 88 V8o88 88~~~~~ 88  88  88 88~~~88   `Y8b. 88`8b
    //         88   8D   .88.   88  V888 88  .8D 88      88   88 `8b  d8' 88  V888 88.     88  88  88 88   88 db   8D 88 `88.
    // C88888D Y8888P' Y888888P VP   V8P Y8888D' 88      YP   YP  `Y88P'  VP   V8P Y88888P YP  YP  YP YP   YP `8888Y' YP   YD
    //
    //

    /**
     * Создадим маску для телефона
     *
     * @version 01.01.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function _bindPhoneMask() {
        $$('.js-phone-mask').each(function () {
            var element = $$(this);

            Inputmask({
                'mask': '+7 (999) 999-99-99'
            }).mask(element);
        });
    }

    //         d8888b. d888888b d8b   db d8888b.  .o88b.  .d88b.  d8888b. d88888b .88b  d88.  .d8b.  .d8888. db   dD
    //         88  `8D   `88'   888o  88 88  `8D d8P  Y8 .8P  Y8. 88  `8D 88'     88'YbdP`88 d8' `8b 88'  YP 88 ,8P'
    //         88oooY'    88    88V8o 88 88   88 8P      88    88 88   88 88ooooo 88  88  88 88ooo88 `8bo.   88,8P
    //         88~~~b.    88    88 V8o88 88   88 8b      88    88 88   88 88~~~~~ 88  88  88 88~~~88   `Y8b. 88`8b
    //         88   8D   .88.   88  V888 88  .8D Y8b  d8 `8b  d8' 88  .8D 88.     88  88  88 88   88 db   8D 88 `88.
    // C88888D Y8888P' Y888888P VP   V8P Y8888D'  `Y88P'  `Y88P'  Y8888D' Y88888P YP  YP  YP YP   YP `8888Y' YP   YD
    //
    //

    /**
     * Создадим маску для кода авторизации
     *
     * @version 01.01.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function _bindCodeMask() {
        $$('.js-code-mask').each(function () {
            var element = $$(this);

            Inputmask({
                'mask': '9999'
            }).mask(element);
        });
    }

    //         d8888b. d888888b d8b   db d8888b. d88888b db    db d888888b d88888b d8888b. d8b   db  .d8b.  db      db      d888888b d8b   db db   dD
    //         88  `8D   `88'   888o  88 88  `8D 88'     `8b  d8' `~~88~~' 88'     88  `8D 888o  88 d8' `8b 88      88        `88'   888o  88 88 ,8P'
    //         88oooY'    88    88V8o 88 88   88 88ooooo  `8bd8'     88    88ooooo 88oobY' 88V8o 88 88ooo88 88      88         88    88V8o 88 88,8P
    //         88~~~b.    88    88 V8o88 88   88 88~~~~~  .dPYb.     88    88~~~~~ 88`8b   88 V8o88 88~~~88 88      88         88    88 V8o88 88`8b
    //         88   8D   .88.   88  V888 88  .8D 88.     .8P  Y8.    88    88.     88 `88. 88  V888 88   88 88booo. 88booo.   .88.   88  V888 88 `88.
    // C88888D Y8888P' Y888888P VP   V8P Y8888D' Y88888P YP    YP    YP    Y88888P 88   YD VP   V8P YP   YP Y88888P Y88888P Y888888P VP   V8P YP   YD
    //
    //

    /**
     * Внешние ссылки откроем в браузере
     *
     * @version 01.01.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function _bindExternalLink() {
        $$(document).on('click', 'a[target="_blank"]', function (e) {
            window.open($$(this).attr('href'), '_system');
            e.preventDefault();

            return false;
        });
    }

    return {
        sessionID      : sessionID,
        init           : init,
        showErrors     : showErrors,
        update         : update,
        showLoginScreen: showLoginScreen
    };
})();