//  Компонент ONEPOSTPONEDPLAN для одного Плана из списка Оложенных Планов postponedPlansList

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePostponedPlan } from '../myHooks/usePostponedPlan';
import { Link } from 'react-router-dom';  //Компонент, который использует Роутер для оптимизации загрузки
import { useHttp } from '../myHooks/useHttp';
import Loader from '../ul/Loader';
import Header from './Header';
import Button from '../ul/button';
import Modal from './Modal/Modal';

export default function OnePostoponedPlan() {

    const { request } = useHttp();
    const { postponedPlanList, loading } = usePostponedPlan();  //Получаем список Отложенных Планов из БД коллекции postponedPlans
    const [ready, setReady] = useState(false);  //Готовность получения всех данных
    const [postponedPlansList, setPostponedPlansList] = useState(null);  //Состояние списка Отложенных Планов
    const [modalActive, setModalActive] = useState(false); //Состояние для Модального окна
    const [ans, setAns] = useState({ msg: '' });  // Ответ сервера

    // Берем из адресной строки параметр index (индекс выбраного Отложенного Плана в массиве всех Отложенных Планов)
    const { index } = useParams();
    const planIndex = parseInt(index.substring(1));  //Номер Плана в списке планов (Индекс)
    console.log('ONE_POSTPONED_PLAN: planIndex=', planIndex);

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

    //  Отправляем запрос на удаление выбранного Отложеного Плана (кнопка "УДАЛИТЬ" в Модальном окне)
    const sendRequest = async (myPath) => {

        console.log('sendRequest_in_ONE_POSTPONED_PLAN');
        try {
            let tmp = await request(myPath, 'POST', postponedPlansList[planIndex]);
            console.log(`DATA ${myPath}: `, tmp);
            return tmp;
        }
        catch (err) {
            console.log(err);
            return 'ОШИБКА';
        }
    };

    // Обрабатываем событие удалить Отложенный План (handler на кнопке "УДАЛИТЬ" в Модальном окне)
    const delPostponedPlan = async () => {

        let res = await sendRequest('/api/deletePostponedPlan');
        setPostponedPlansList(res); //Обновляем список Отложенных Планов
        setAns({ msg: `Отложенный План ${postponedPlansList[planIndex].name} удален!` });
    };

    let myOnePostponedPlan = [];
    if (postponedPlansList && postponedPlansList.length !== 0) {

        myOnePostponedPlan = postponedPlansList[planIndex].plats.map((elem, index) => {
            return (
                <div key={index} className='div_change_plan'>
                    Плата: <span className='name_myReserveComp'>{elem.name}</span> - <span className='quantity_myReserveComp'>{elem.q}</span> шт
                </div>
            )
        });
    };

    return (

        <div className="App">
            <div className='wrap_change_myPlan in_center'>
                {(ans.msg !== '') ?
                    (<div className='div_ans_server'>
                        <p>{ans.msg}</p>
                    </div>) :
                    postponedPlansList[planIndex] && (
                        <div>
                            <div>
                                <h3 className='h3__change_myPlan'>Отложенный План:</h3>
                            </div>

                            <div className='in_center'>
                                <Header planName={postponedPlansList[planIndex].name} />
                                {myOnePostponedPlan}
                            </div>

                            <div className='in_center'>
                                <Button className={'btn_change_myPlan myButton'} value={'УДАЛИТЬ'}
                                    onClick={async () => {
                                        console.log(`Удалить выбранный Отложенный План ${postponedPlansList[planIndex].name}?`);
                                        setModalActive(true);
                                    }} />
                            </div>

                        </div>
                    )
                }
                <Link to='/PostponedList' className='linkButton'>ЗАКРЫТЬ</Link>
            </div>

            {postponedPlansList[planIndex] && (
                <Modal active={modalActive} setActive={setModalActive} myRes={setModalActive}>

                    <div className='h3_div_modal in_center'>
                        <h2>Удалить выбранный Отложенный План <span style={{ color: 'red' }}>{postponedPlansList[planIndex].name}</span>?</h2>
                    </div>

                    <div className='in_center'>
                        <Button value={'УДАЛИТЬ'} className={'btn_change_myPlan myButton'} onClick={() => {
                            delPostponedPlan();
                            setModalActive(false);
                        }} />
                        <Button value={'ОТМЕНА'} className={'btn_change_myPlan myButton'} onClick={() => {
                            setModalActive(false);
                        }} />
                    </div>

                </Modal>
            )}
        </div>
    );
};
