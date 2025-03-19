//Сохраняем и удаляем данные о регистрации пользователя

import { useState, useCallback, useEffect } from "react";
const storageName = 'mernUserData2';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);
    //Создаем функцию, которая запоминает регистрационные данные в localStorage
    const getLogin = useCallback((jwtToken, id) => {
        setToken(jwtToken);
        setUserId(id);
        localStorage.setItem(storageName, JSON.stringify({
            userId: id,
            token: jwtToken
        })
        );
        // const data = JSON.parse(localStorage.getItem(storageName));
        // console.log('getLogin: ', userId);
        // if (data && data.token) {
        //     getLogin(data.token, data.userId);
        //     setReady(true);
        // }
    }, []); //useCallback используется для защиты от рекурсивного вызова при повторном рендеринге

    //Создаем функцию, которая удаляет регистрационные данные в localStorage
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName);
        console.log('localStorage: ', localStorage.getItem(storageName));
    }, []);

    //Используем хук useEffect, который будет запускаться при каждом вызове функции login
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        console.log('useEffect: ', data);
        if (data && data.token) {
            getLogin(data.token, data.userId);
            console.log('useEffect2: ', data);
        }
        setReady(true);
    }, [getLogin, logout]);

    return { getLogin, logout, token, userId, ready };
}