//  Формируем в Модальном окне список всех компонентов необходимых для выполнения плана, а также две кнопки "В РЕЗЕРВ" и "ОТМЕНА" 

import React, { useContext, useState } from 'react';
import Modal from './Modal/Modal';
import Button from '../ul/button';
import { useHttp } from '../myHooks/useHttp';
import { PlataContext } from '../context/plataContext';

export default function ReserveComponents({ plataLi, planComponents, myRes }) {

    const { request } = useHttp();
    const { setList } = useContext(PlataContext); //Из Context выбираем функцию, для изменения состояния Списка Планов
    const [modalActive, setModalActive] = useState(true); //Состояние для Модального Окна
    console.log('ReserveComponents ', modalActive);

    //  Отправляем запрос на резервирование данных и сохранение Плана по клику на кноку "В РЕЗЕРВ":
    //  activePlan - массив Плат и их количество для данного Плана;
    //  planComponents - массив компонентов, необходимых поставить в резерв для выполения данного Плана;
    //  reserveComponents - ответ, полученый с сервера
    const sendReserve = async (activePlan, planComponents) => {

        console.log('sendReserve: ', planComponents);
        console.log('sendReserve2: ', activePlan);

        //Создаем новый объект с двумя свойствами: plan и components
        const activeComponents = planComponents.map((elem) => {
            return {
                _id: elem._id,
                reserve: elem.reserve + elem.quantity
            }
        });

        // Генерируем Имя Плана 
        let today = new Date();
        let myDay = today.getDate();
        myDay = (myDay > 9) ? myDay : '0' + myDay;
        let myMonth = today.getMonth() + 1;
        myMonth = (myMonth > 9) ? myMonth : '0' + myMonth;
        let myHours = today.getHours();
        myHours = (myHours > 9) ? myHours : '0' + myHours;
        let myMinutes = today.getMinutes();
        myMinutes = (myMinutes > 9) ? myMinutes : '0' + myMinutes;
        let planName = myDay + '.' + myMonth + '.' + today.getFullYear() + ' ' + myHours + ':' + myMinutes;
        // Добавляем дату Запланирования Плана
        const dataForSend = {
            plan: {
                name: planName,
                date: today.toString(),
                plats: activePlan
            },
            components: activeComponents
        }

        // Отправляем POST-запрос на сервер для сохранения этих данных
        try {
            let tmp = await request('/api/reserveComponents', 'POST', dataForSend);
            console.log('DATA /api/reserveComponents: ', tmp);
            return tmp;
        }
        catch (err) {
            console.log(err);
        }
    };

    if (planComponents === null || planComponents.length === 0) {
        return;
    }
    const myReserveComp = planComponents.map((elem, index) => {
        return (
            <li key={'myReserveComp' + index}>
                <span className='name_myReserveComp'>Name: {elem.name}</span>, <span className='id_myReserveComp'>id: {elem._id}</span> - <span className='quantity_myReserveComp'>{elem.quantity} шт</span>
            </li>
        )
    });

    return (

        <Modal active={modalActive} setActive={setModalActive} myRes={myRes}>
            <div className='h3_div_modal'>
                <h3>ПОСТАВИТЬ В РЕЗЕРВ СЛЕДЮУЩИЕ КОМПОНЕНТЫ:</h3>
            </div>
            <div className='div_ol_content_text'>
                <ol className='ol_content_text'>
                    {myReserveComp}
                </ol>
            </div>
            <div>
                <Button value='В РЕЗЕРВ' onClick={async () => {
                    setModalActive(false);
                    let data = await sendReserve(plataLi, planComponents);
                    console.log('ДОБАВИЛИ НОВЫЙ ПЛАН: ', data);
                    setList(data);
                    myRes(false);
                }
                } />
                <Button value='ОТМЕНА' onClick={() => {
                    setModalActive(false);
                    myRes(false);
                }} />
            </div>
        </Modal>
    )
}
