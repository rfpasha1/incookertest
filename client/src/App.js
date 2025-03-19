import React, { useCallback, useState, useEffect } from 'react';
import './App.css';
import { PlataContext } from './context/plataContext';
import UseRoutes from './components/routes';
import { useHttp } from './myHooks/useHttp';
import { BrowserRouter } from 'react-router-dom';
// import Author from './components/Author/Author.js';
// import { useAuth } from './myHooks/useAuth';
// import AuthElement from './components/authElement';
// import NewMessage from './components/newMessage';
// import NavBar from './components/navBar';
// import Button from './ul/button';
// import Validator from './components/validator';
// import Forms from './components/forms';
// import UserPage from './components/userPage';
// import TextMessages from './components/textMessages';


function App() {

    console.log('APPPP!!!!!');
    // const { getLogin, logout, token, userId, ready } = useAuth();
    const isAuth = true/* !!token */; //Преобразуем token к бинарному виду, если он есть - значение будет true
    // const { loading, request, error, clearError } = useHttp;
    const routes = UseRoutes(isAuth);

    const { request } = useHttp();
    const [planList, setPlanList] = useState([]);   //Состояние для списка Планов из БД (коллекция  Plans) 
    const [platsList, setPlatsList] = useState([]);

    const getPlans = useCallback(async (data, error) => {
        try {
            let tmp = await request('/api/fullPlans');
            console.log('DATA /api/fullPlans: ', tmp);
            setPlanList(tmp);
        }
        catch (err) {
            console.log('App.js planList: ', err);
            error = err;
        }
    }, [request]);

    const getPlataList = useCallback(async (data, error) => {
        try {
            let tmp = await request('/api/fullList');
            console.log('DATA /api/fullList: ', tmp);
            setPlatsList(tmp);
        }
        catch (err) {
            console.log('App.js platsList: ', err);
            error = err;
        }
    }, [request]);

    useEffect(() => {
        getPlataList(); //Если список Плат будет пуст, это значит что БД пустая
        getPlans();
    }, [getPlans, getPlataList]);

    return (
        <PlataContext.Provider value={{ list: planList, setList: setPlanList, platsList: platsList }}>
            <BrowserRouter>
                {routes}
            </BrowserRouter>
            {/* <Author view={'authorName'} /> Передаем в пропсах нужный класс и от этого получает нужную визуализацию */}
        </PlataContext.Provider>
    );
}

export default App;
