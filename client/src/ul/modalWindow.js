/* eslint-disable no-multi-str */
//функция формирует и удаляет модальное окно
function setupMessageButton(title, body) {
    let messageElem = createMessage(title, body);
    document.body.appendChild(messageElem);
    offScroll();
    addCloseOnClick(messageElem);
};

//создаем div с модальным окном 
function createMessage(title, body) {
    let container = document.createElement('div');
    container.innerHTML = '<div class="modal"> \
      <div class="my-message" id="error"> \
        <div class="my-message-title">' + title + '</div> \
        <div class="my-message-body">' + body + '</div> \
        <input id="btnMess" class="my-message-ok" type="button" value="OK"/> \
      </div>\
    </div >';

    return container.firstChild;
};

//функция которая удаляет div с этим модальным окном  
//при клике на кнопку в модальном окне или при клике вне модального окна
function addCloseOnClick(messageElem) {
    if (messageElem) {
        let input = messageElem.getElementsByTagName('INPUT')[0];
        input.addEventListener('click', function () {
            messageElem.parentNode.removeChild(messageElem);
            onScroll();
        });
        document.querySelector('.modal').addEventListener('click', function (e) {
            if (!e.target.closest('.my-message') && !e.target.closest('#myButt')) {
                messageElem.parentNode.removeChild(messageElem);
                onScroll();
            };
        });
    };
};

//функция, которая блокирует scroll 
function offScroll() {
    const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px';
    /* //если есть на странице фиксированные элементы
    if (lockPadding.length > 0) {
        for (let i = 0; i < lockPadding.length; i++) {
            const el = lockPadding[i];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    */
    document.querySelector('body').style.paddingRight = lockPaddingValue;
    document.querySelector('body').style.overflow = 'hidden';
};

//функция, которая разблокирует scroll 
function onScroll() {
    /* //если есть на странице фиксированные элементы
    if (lockPadding.length > 0) {
        for (let i = 0; i < lockPadding.length; i++) {
            const el = lockPadding[i];
            el.style.paddingRight = '0px';
        }
    }
    */
    document.querySelector('body').style.paddingRight = '0px';
    document.querySelector('body').style.overflow = 'auto';
};