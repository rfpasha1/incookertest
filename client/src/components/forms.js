//Форма - Email и Пароль, с проверкой введенных данных

import React, { useContext, useState } from 'react';
import Button from '../ul/button';
import Inputs from '../ul/inputs';
import { useHttp } from '../myHooks/useHttp';
import { formValidate } from '../ul/formValidate';
import { setupMessageButton } from '../ul/modalWindow';
import { AuthContext } from '../context/authContext';

export default function Forms() {

    const authUser = useContext(AuthContext);
    const [user, setUser] = useState({ email: '', password: '' });
    const { request/* , error*/ } = useHttp();

    // const [dataError, setDataError] = useState(null);

    //Регистрация нового пользователя
    const registrHandler = async () => {

        const myForm = document.getElementById('myForm');
        let error = formValidate(myForm);  //Делаем проверку на правильность заполнения всех обязательных полей
        try {
            if (error !== 0) {
                setupMessageButton('ВНИМАНИЕ', 'Все обязательные поля должны быть правильно заполнены!');
            }
            const data = await request('/api/registration', 'POST', { ...user });
            console.log('registrHandler: ', data);
            setupMessageButton('РЕГИСТРАЦИЯ', data.message);
            // setUser({ email: '', password: '' });
        } catch (err) {

        }
    }

    //Аутентификация пользователя
    const loginHandler = async () => {

        const myForm = document.getElementById('myForm');
        let error = formValidate(myForm); //Делаем проверку на правильность заполнения всех обязательных полей
        try {
            if (error !== 0) {
                setupMessageButton('ВНИМАНИЕ', 'Все обязательные поля должны быть правильно заполнены!');
            }
            const data = await request('/api/login', 'POST', { ...user });
            setupMessageButton('АВТОРИЗАЦИЯ', `Приветствуем тебя ${data.login}`); //Модальное окно с приветствием пользователя при авторизации
            console.log('loginHandler:', data);
            //Сохраняем данные в localStorage
            authUser.getLogin(data.token, data.userId);
            console.log('АВТОРИЗАЦИЯ : userId ', authUser.userId);
        } catch (err) {

        }
    }

    return (
        <form id="myForm">

            <p>* - Обязательные для заполнения поля</p>

            <Inputs
                className='formInp _req _email'
                type='text'
                name='email'
                placeholder='email*'
                value={user.email}
                onChange={(e) => {
                    setUser({ ...user, email: e.target.value })
                }}
            />
            <Inputs
                className='formInp _req'
                type='password'
                name='password'
                placeholder='password*'
                value={user.password}
                onChange={(e) => {
                    setUser({ ...user, password: e.target.value })
                }}
            />

            <div>
                <Button value={'АВТОРИЗАЦИЯ'} onClick={loginHandler} />
                <Button value={'РЕГИСТРАЦИЯ'} onClick={registrHandler} />
            </div>

        </form>
    )
}
