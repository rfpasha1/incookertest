//  Получаем коллекуцию postponedPlansList (список всех Отложенных Планов) из БД

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  //Компонент, который использует Роутер для оптимизации загрузки
import { usePostponedPlan } from '../myHooks/usePostponedPlan';
import Loader from '../ul/Loader';


export default function PostponedList() {

    const { postponedPlanList, loading } = usePostponedPlan();  //Получаем список Отложенных Планов из БД коллекции postponedPlans
    const [ready, setReady] = useState(false);  //Готовность получения всех данных
    const [postponedPlansList, setPostponedPlansList] = useState(null);

    useEffect(() => {

        let data = postponedPlanList();
        data.then((arr) => {
            setPostponedPlansList(arr);
            setReady(true);
        });
    }, [postponedPlanList]);

    if (!ready || loading) {
        return (
            <Loader />
        )
    };

    if (postponedPlansList && postponedPlansList.length === 0) {
        return (
            <div className="App">
                <div className='wrap_main_div postponed in_center'>
                    <h2>СПИСОК ПЛАНОВ</h2>
                    <div className='plansList_div'>
                        <span className='text_planList'>На данный момент Отложенных Планов нет!</span>
                    </div>
                </div>
            </div>
        );
    };

    const listOfPostponedPlans = postponedPlansList.map((elem, index) => {
        return (
            <div key={index} className={`plansList_links_div in_center postponed_plans }`}>
                <Link to={`/PostponedList/:${index}`} className={`plansList_link postponed_plans_link`}>
                    {elem.name}
                </Link>
            </div>
        )
    });

    return (

        <div className="App">
            <div className='wrap_main_div postponed in_center'>
                <h2>СПИСОК ОТЛОЖЕННЫХ ПЛАНОВ</h2>
                <div className='plansList_div'>
                    {listOfPostponedPlans}
                </div>
            </div>
        </div>
    )
};
