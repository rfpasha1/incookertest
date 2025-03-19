//Хук используется для обработки http запросов
import { useState, useCallback } from 'react';

export const useHttp = () => {
    //Определяем состояния для отслеживания процесса загрузки и возникновения ошибок
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Создаем http запрос
    const request = useCallback(async (
        url,
        method = 'GET',
        body = null,
        headers = {}
    ) => {
        //Начинаем загрузку
        setLoading(true);
        // console.log('USEHTTP: ', JSON.stringify(body));
        let response = null;
        let data = null;
        try {
            if (body) {
                body = JSON.stringify(body);
                headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };
            };
            console.log('useHttp url: ', url);
            response = await fetch(url, { method, headers, body });
            // console.log('response in useHttp = ', response);
            data = await response.json();
            if (!response.ok) {
                if (data.message) {
                    console.log('MESSAGE: ', data.message);
                }
                throw new Error(data.message || 'Что-то пошло не так!!!');
            }
            setLoading(false);
            return data;
        } catch (err) {
            console.log('Ошибка в useHttp: ', response.status);
            if (response.status >= 500) {
                err.message = 'Сервер отклонил запрос';
            }
            setLoading(false);
            setError(err.message);
            throw err;
        }
    }, []);
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return { loading, request, error, clearError };
}