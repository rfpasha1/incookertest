//  Получаем коллекуцию plans (список всех Планов) из БД

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  //Компонент, который использует Роутер для оптимизации загрузки
import { PlataContext } from '../context/plataContext';
import { useComponents2 } from '../myHooks/useComponents2';
import analizOfPlans from '../myLib/analizOfPlans';
import Loader from '../ul/Loader';
import Modal from './Modal/Modal';
import Button from '../ul/button';

export default function PlansList() {

    const [modalActive, setModalActive] = useState(false); //Состояние для Модального окна
    const [ready, setReady] = useState(false);  //Готовность получения всех данных
    const { componentsList, loading } = useComponents2();  //Список всех Компонентов с БД коллекция Сomponents
    const { list, platsList } = useContext(PlataContext);  //Список всех Планов (list) из коллекции Plans и всех Плат (platsList) из коллекции Products
    const [components, setComponents] = useState(null); //Состояние для получения всех Компонентов из БД 
    console.log('list_in_PlansList: ', list);
    console.log('___DATA__IN__PLANLIST__: ', platsList);

    useEffect(() => {
        let data = componentsList();
        data.then((arr) => {
            setComponents(arr);
            setReady(true);
        });
    }, [componentsList]);

    if (!ready || loading) {
        return (
            <Loader />
        )
    };

    console.log('COMPONENT__IN__PLANSLIST', components);

    // Получаем список Планов с анализом недостающих Комонентов 
    const { copyArrPlanListsLockal, componentTesting } = analizOfPlans(list, platsList, components);

    //  Контент для Модального окна (показываем список недостающих Компонентов)
    let lacksProd = [];
    if (componentTesting.result && !componentTesting.check) {
        lacksProd = componentTesting.result.map((elem, index) => {
            return (
                <li key={'lacksProd' + index}>
                    <span className='name_myReserveComp'>{elem.name}</span> - <span className='quantity_myReserveComp'>{+elem.lacks * -1} шт</span>
                </li>
            );
        });
    };

    // Для отображения данных используем локальный список Планов copyArrPlanListsLockal

    // Каждый элемент Плана указывает на компонет План для этого плана
    if (list && list.length === 0) {
        return (
            <div className="App">
                <div className='wrap_main_div in_center'>
                    <h2>СПИСОК ПЛАНОВ</h2>
                    <div className='plansList_div'>
                        <span className='text_planList'>На данный момент Планов нет!</span>
                    </div>
                </div>
            </div>
        );
    };

    // Сортируем список Планов по свойству date (по дате создания Плана)
    function compare(a, b) {
        let dataA = new Date(a.date);
        let dataB = new Date(b.date);
        return dataA - dataB;
    };
    list.sort(compare);

    const myPlansList = copyArrPlanListsLockal.map((elem, index) => {
        return (
            <div key={index} className={`plansList_links_div in_center ${(elem.postponedPlan) ? "postponed" : ""}`}>
                <Link to={`/PlansList/:${index}`}
                    state={(elem.postponedPlan) ? { myFlag: true } : { myFlag: false }}
                    className={`plansList_link ${(elem.postponedPlan) ? "postponedLink" : ""}`}
                >
                    {elem.name}
                </Link>
            </div>
        )
    });

    return (

        <div className="App">

            <div className='wrap_main_div in_center'>
                <h2>СПИСОК ПЛАНОВ</h2>
                <div className='plansList_div'>
                    {myPlansList}
                </div>
                {!componentTesting.check && <div>
                    <Button id='btn_home_page3' value={'НЕДОСТАЮЩИЕ КОМПОНЕНТЫ'} onClick={() => {
                        setModalActive(true);
                    }} />
                </div>
                }
            </div>

            <Modal active={modalActive} setActive={setModalActive} myRes={setModalActive} innerData={componentTesting}>
                <div className='h3_div_modal in_center'>
                    <h2>ДЛЯ ВЫПОЛНЕНИЯ ВСЕХ ПЛАНОВ</h2>
                    <h3>НЕ ХВАТАЕТ СЛЕДЮУЩИХ КОМПОНЕНТОВ:</h3>
                </div>
                {lacksProd && <div>
                    <ol className='ol_content_text'>
                        {lacksProd}
                    </ol>
                </div>
                }
                <Button value={'OK'} onClick={() => {
                    setModalActive(false);
                }} />
            </Modal>

        </div>
    );
};
