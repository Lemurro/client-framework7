/**
 * Проверка интернета
 *
 * @version 01.02.2018
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */

var internet = (function () {
    //  .d88b.  d88888b d88888b db      d888888b d8b   db d88888b
    // .8P  Y8. 88'     88'     88        `88'   888o  88 88'
    // 88    88 88ooo   88ooo   88         88    88V8o 88 88ooooo
    // 88    88 88~~~   88~~~   88         88    88 V8o88 88~~~~~
    // `8b  d8' 88      88      88booo.   .88.   88  V888 88.
    //  `Y88P'  YP      YP      Y88888P Y888888P VP   V8P Y88888P
    //
    //

    /**
     * Отправка запроса
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function offline() {
        app.dialog.preloader('Пропал интернет,<br>надо вернуть.');
    }

    //  .d88b.  d8b   db db      d888888b d8b   db d88888b
    // .8P  Y8. 888o  88 88        `88'   888o  88 88'
    // 88    88 88V8o 88 88         88    88V8o 88 88ooooo
    // 88    88 88 V8o88 88         88    88 V8o88 88~~~~~
    // `8b  d8' 88  V888 88booo.   .88.   88  V888 88.
    //  `Y88P'  VP   V8P Y88888P Y888888P VP   V8P Y88888P
    //
    //

    /**
     * Отправка запроса
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function online() {
        app.dialog.close();
    }

    return {
        offline: offline,
        online : online
    };
})();