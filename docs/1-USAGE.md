# AJAX-запросы на сервер
Для GET-запросов используйте
```
app.preloader.show();
app.request.get(pathServerAPI + 'path/to/model', {
    'param1': 'value1',
    'param2': 'value2'
}, function (result) {
    app.preloader.hide();

    if (result.hasOwnProperty('errors')) {
        bootstrap.showErrors(result.errors);
    } else {
        // Обработка данных полученных с сервера
    }
});
```
Для POST-запросов просто замените слово `get` на `post` в строке `app.request.get(...`

При каждом запросе на сервер отправляется заголовок `X-SESSION-ID` с текущим значением переменной `bootstrap.sessionID`

# CSS-классы
Дополнительные классы облегчающие вёрстку, которых нет во `Framework7`:
- **.font-100** - Размер шрифта `100px`, чтобы сделать иконку большой
- **.message-card** - Добавьте элементу `div`, чтобы выделить блок текста

# JS-хелперы
- Быстрый фасад для открытия `popup`:
  ```
  helper.showPopup(
      'Заголовок',
      '<p>Содержимое окна</p><p>Может содержать <strong>любой</strong> html-код</p>'
      );
  ```
  *этой командой можно открыть только одно окно, если необходимо открыть несколько окон каскадом, тогда воспользуйтесь документацией `Framework7`
- Для диалоговых окон подтверждения используется `SweetAlert2`, у него более расширенный функционал нежели у диалогов `Framework7`. Подготовлен быстрый фасад:
  ```
  helper.showConfirm(
      'Заголовок',
      '<p>Содержимое окна</p><p>Может содержать <strong>любой</strong> html-код</p>',
      'OK',
      'Отмена',
      function () {
          console.log('showConfirm.open');
      }, function () {
          console.log('showConfirm.preconfirm');
      }, function () {
          console.log('showConfirm.confirm');
      }, function () {
          console.log('showConfirm.cancel');
      });
  ```
- Встроенные во `Framework7` popover ужасные в режиме `Material Design`, поэтому создан фасад для использования диалога `alert` в качестве `popover`

  Для использования просто добавьте любому элементу класс `js-show-popover` и data-атрибут `data-popover` с содержимым для `popover` (можно использовать html)