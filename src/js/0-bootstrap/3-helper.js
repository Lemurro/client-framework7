/**
 * Хелперы
 *
 * @version 01.02.2018
 * @author  Дмитрий Щербаков <atomcms@ya.ru>
 */

var helper = (function () {
    // .d8888. db   db  .d88b.  db   d8b   db d8888b.  .d88b.  d8888b. db    db d8888b.
    // 88'  YP 88   88 .8P  Y8. 88   I8I   88 88  `8D .8P  Y8. 88  `8D 88    88 88  `8D
    // `8bo.   88ooo88 88    88 88   I8I   88 88oodD' 88    88 88oodD' 88    88 88oodD'
    //   `Y8b. 88~~~88 88    88 Y8   I8I   88 88~~~   88    88 88~~~   88    88 88~~~
    // db   8D 88   88 `8b  d8' `8b d8'8b d8' 88      `8b  d8' 88      88b  d88 88
    // `8888Y' YP   YP  `Y88P'   `8b8' `8d8'  88       `Y88P'  88      ~Y8888P' 88
    //
    //

    /**
     * Покажем всплывающее окно
     *
     * @param title   string Заголовок окна
     * @param content string HTML-Содержимое
     *
     * @version 01.02.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function showPopup(title, content) {
        var popup = $$('#js-popup');

        popup.find('.popup__title').html(title);
        popup.find('.popup__content').html(content);

        app.popup.open(popup);
    }

    // .d8888. db   db  .d88b.  db   d8b   db  .o88b.  .d88b.  d8b   db d88888b d888888b d8888b. .88b  d88.
    // 88'  YP 88   88 .8P  Y8. 88   I8I   88 d8P  Y8 .8P  Y8. 888o  88 88'       `88'   88  `8D 88'YbdP`88
    // `8bo.   88ooo88 88    88 88   I8I   88 8P      88    88 88V8o 88 88ooo      88    88oobY' 88  88  88
    //   `Y8b. 88~~~88 88    88 Y8   I8I   88 8b      88    88 88 V8o88 88~~~      88    88`8b   88  88  88
    // db   8D 88   88 `8b  d8' `8b d8'8b d8' Y8b  d8 `8b  d8' 88  V888 88        .88.   88 `88. 88  88  88
    // `8888Y' YP   YP  `Y88P'   `8b8' `8d8'   `Y88P'  `Y88P'  VP   V8P YP      Y888888P 88   YD YP  YP  YP
    //
    //

    /**
     * Покажем подтверждение
     *
     * @param {string}   title              Заголовок
     * @param {string}   content            HTML-Содержимое
     * @param {string}   confirmButtonText  Текст кнопки "OK"
     * @param {string}   cancelButtonText   Текст кнопки "Cancel"
     * @param {function} callbackOpen       Функция при открытии формы
     * @param {function} callbackPreConfirm Функция перед вызовом callbackConfirm
     * @param {function} callbackConfirm    Функция при нажатии confirmButton
     * @param {function} callbackCancel     Функция при нажатии cancelButton
     *
     * @version 01.01.2018
     * @author  Дмитрий Щербаков <atomcms@ya.ru>
     */
    function showConfirm(title, content, confirmButtonText, cancelButtonText, callbackOpen, callbackPreConfirm, callbackConfirm, callbackCancel) {
        swal({
            title             : title,
            html              : content,
            type              : '',
            allowOutsideClick : false,
            showCancelButton  : true,
            confirmButtonColor: '#2196f3',
            confirmButtonText : confirmButtonText,
            cancelButtonText  : cancelButtonText,
            onOpen            : callbackOpen,
            preConfirm        : callbackPreConfirm
        }).then(function () {
            callbackConfirm();
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'close', and 'timer'
            if (dismiss !== '' && callbackCancel !== null) {
                callbackCancel();
            }
        });
    }

    return {
        showPopup  : showPopup,
        showConfirm: showConfirm
    };
})();