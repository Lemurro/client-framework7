/**
 * Главная страница
 *
 * @version 01.02.2018
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */
var home = (function () {
    /**
     * Инициализация
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function init() {
        app.dialog.alert('Главная страница загружена', 'Информация');
    }

    return {
        init: init
    };
})();