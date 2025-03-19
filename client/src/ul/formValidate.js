//Валидация полей формы на сторороне клиента

export function formValidate(form) {

    let error = 0;
    //Выбираем поля с обязательным заполнением (class="_req")
    let formReq = document.querySelectorAll('._req');
    // console.log('REQ: ', formReq);

    for (let i = 0; i < formReq.length; i++) {

        const input = formReq[i];
        input.classList.remove('_error');  //Убираем у поля input class="_error"
        //Проверяем поле e-mail с class="_email"
        if (input.classList.contains('_email')) {
            if (emailTest(input)) {
                //Если e-mail введен не верно, добавляем полю input class="_error"
                input.classList.add('_error');
                error++;
            }
        } else if (input.getAttribute("type") === "checkbox" && input.checked === false) { //Проверяем выбран ли checkbox
            //Если checkbox не отмечен, добавляем полю input class="_error"
            input.classList.add('_error');
            error++;
        } else {
            //Проверяем чтоб поля не были пустыми 
            if (input.value.trim() === '') {
                //Если поле input не заполнено, добавляем полю class="_error"
                input.classList.add('_error');
                error++;
            }
        }
    }

    return error;
}

//Проверка корректности e-mail
const emailTest = (input) => {
    return !/^([A-Za-z0-9_-]+\.)*[A-Za-z0-9_-]+@[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*\.[a-z]{2,6}$/.test(input.value);
}
/* 
//Проверка корректности URL
const urlTest = (input) => {
    return /^((https?|ftp)\:\/\/)?([a-z0-9]{1})((\.[a-z0-9-])|([a-z0-9-]))*\.([a-z]{2,6})(\/?)$/.test(input.value);
}

//Проверка корректности номера телефона
const phoneTest = (input) => {
    return /^\+\d{2}\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(input.value);
}
 */
