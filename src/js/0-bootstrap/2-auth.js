/**
 * Проверка сессии при запуске приложения
 *
 * @version 22.03.2018
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */

var auth = (function () {
    /**
     * ИД таймера
     *
     * @type {int|null}
     *
     * @private
     */
    _timerID = null;

    //  .o88b. db   db d88888b  .o88b. db   dD
    // d8P  Y8 88   88 88'     d8P  Y8 88 ,8P'
    // 8P      88ooo88 88ooooo 8P      88,8P
    // 8b      88~~~88 88~~~~~ 8b      88`8b
    // Y8b  d8 88   88 88.     Y8b  d8 88 `88.
    //  `Y88P' YP   YP Y88888P  `Y88P' YP   YD
    //
    //

    /**
     * Отправка запроса
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function check() {
        app.preloader.show();
        app.request.get(pathServerAPI + 'auth/check', {}, function (result) {
            app.preloader.hide();

            if (result.hasOwnProperty('errors')) {
                localforage.clear();
                bootstrap.sessionID = '';
            } else {
                app.loginScreen.close('#js-login-screen');
                app.router.navigate(config.auth.pageAfter);
            }
        });
    }

    //  d888b  d88888b d888888b  .o88b.  .d88b.  d8888b. d88888b
    // 88' Y8b 88'     `~~88~~' d8P  Y8 .8P  Y8. 88  `8D 88'
    // 88      88ooooo    88    8P      88    88 88   88 88ooooo
    // 88  ooo 88~~~~~    88    8b      88    88 88   88 88~~~~~
    // 88. ~8~ 88.        88    Y8b  d8 `8b  d8' 88  .8D 88.
    //  Y888P  Y88888P    YP     `Y88P'  `Y88P'  Y8888D' Y88888P
    //
    //

    /**
     * Отправка запроса
     *
     * @version 22.03.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function getCode() {
        app.preloader.show();
        app.request.get(pathServerAPI + 'auth/code', {
            'auth_id': $$('#js-auth-' + config.auth.type + '-get-form').find('input[name="auth_id"]').val()
        }, function (result) {
            app.preloader.hide();

            if (result.hasOwnProperty('errors')) {
                bootstrap.showErrors(result.errors);
            } else {
                var formCode = $$('#js-auth-' + config.auth.type + '-check-form');

                formCode.find('.js-timer').show();
                formCode.find('.js-timer__count').text('60');
                formCode.find('.js-resend').hide();

                _runTimer();

                $$('#js-auth-' + config.auth.type + '-get-form').hide();
                formCode.show();
            }
        });
    }

    //  .o88b. db   db d88888b  .o88b. db   dD  .o88b.  .d88b.  d8888b. d88888b
    // d8P  Y8 88   88 88'     d8P  Y8 88 ,8P' d8P  Y8 .8P  Y8. 88  `8D 88'
    // 8P      88ooo88 88ooooo 8P      88,8P   8P      88    88 88   88 88ooooo
    // 8b      88~~~88 88~~~~~ 8b      88`8b   8b      88    88 88   88 88~~~~~
    // Y8b  d8 88   88 88.     Y8b  d8 88 `88. Y8b  d8 `8b  d8' 88  .8D 88.
    //  `Y88P' YP   YP Y88888P  `Y88P' YP   YD  `Y88P'  `Y88P'  Y8888D' Y88888P
    //
    //

    /**
     * Отправка запроса
     *
     * @version 22.03.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function checkCode() {
        var deviceInfo = {
            uuid        : 'q1w2e3r4t5y6u7i8o9p0',
            platform    : 'TestOS',
            version     : '1.0',
            manufacturer: 'Samsung',
            model       : 'Galaxy S8'
        };

        if (modeCordova) {
            deviceInfo = {
                uuid        : device.uuid,
                platform    : device.platform,
                version     : device.version,
                manufacturer: device.manufacturer,
                model       : device.model
            };
        }

        app.preloader.show();
        app.request.post(pathServerAPI + 'auth/code', {
            'auth_id'    : $$('#js-auth-' + config.auth.type + '-get-form').find('input[name="auth_id"]').val(),
            'auth_code'  : $$('#js-auth-' + config.auth.type + '-check-form').find('input[name="auth_code"]').val(),
            'device_info': deviceInfo
        }, function (result) {
            app.preloader.hide();

            if (result.hasOwnProperty('errors')) {
                bootstrap.showErrors(result.errors);
            } else {
                localforage.setItem('sessionID', result.data.session, function () {
                    Deferred.next(function () {
                        bootstrap.sessionID = result.data.session;
                    }).next(function () {
                        app.loginScreen.close('#js-login-screen');
                        app.router.navigate(config.auth.pageAfter);
                    });
                });
            }
        });
    }

    //         d8888b. db    db d8b   db d888888b d888888b .88b  d88. d88888b d8888b.
    //         88  `8D 88    88 888o  88 `~~88~~'   `88'   88'YbdP`88 88'     88  `8D
    //         88oobY' 88    88 88V8o 88    88       88    88  88  88 88ooooo 88oobY'
    //         88`8b   88    88 88 V8o88    88       88    88  88  88 88~~~~~ 88`8b
    //         88 `88. 88b  d88 88  V888    88      .88.   88  88  88 88.     88 `88.
    // C88888D 88   YD ~Y8888P' VP   V8P    YP    Y888888P YP  YP  YP Y88888P 88   YD
    //
    //

    /**
     * Запуск таймера
     *
     * @version 01.01.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function _runTimer() {
        if (_timerID !== null) {
            clearInterval(_timerID);
        }

        _timerID = setInterval(function () {
            var formCode  = $$('#js-auth-' + config.auth.type + '-check-form');
            var elemTimer = formCode.find('.js-timer__count');
            var count     = parseInt(elemTimer.text(), 10);

            if (count > 0) {
                elemTimer.text(--count);
            } else {
                clearInterval(_timerID);
                formCode.find('.js-timer').hide();
                formCode.find('.js-resend').show();
            }
        }, 1000);
    }

    return {
        check    : check,
        getCode  : getCode,
        checkCode: checkCode
    };
})();