//  Функция визуализирует выбраный План из списка планов
//  Каждый элемент Плана указывает на компонент План для выбраного плана

import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from '../ul/button';

//  list-список всех Планов, planIndex-Индекс в массиве выбраного Плана
//  newPlan-количество каждой Платы в выбраном Плане, setNewPlan-для изменения состояния newPlan
export default function MyOnePlanTest({ list, planIndex, newPlan, setNewPlan }) {

    const [modalActiveAlert, setModalActiveAlert] = useState(false);  //Состояние для Модального окна "ВВЕДИТЕ ПРАВИЛЬНОЕ ЗНАЧЕНИЕ"

    if (list.length <= planIndex) {
        return <div></div>
    } else {
        let myPlan = list[planIndex].plats.map((elem, index) => {
            return (
                <div key={index} className='div_change_plan'>
                    Плата: <span className='name_myReserveComp'>{elem.name}</span> - <span className='quantity_myReserveComp'>{elem.q}</span> шт
                    <input
                        type='number'
                        id={'new_q_in_paln_' + index}
                        className='inp_change_plan'
                        min={0} max={elem.q} required
                        value={newPlan[index] ? newPlan[index] : 0}
                        onChange={(e) => {
                            //Проверяем введеное значение количество произведенных Плат
                            if (parseInt(elem.q) < parseInt(e.target.value)) {
                                setModalActiveAlert(true);
                                return;
                            };
                            const a = [...newPlan];
                            a[index] = parseInt(e.target.value);
                            setNewPlan(a);
                        }}
                    />
                </div>)
        });

        return (
            <div>
                {myPlan}
                <div>
                    <Modal active={modalActiveAlert} setActive={setModalActiveAlert} myRes={setModalActiveAlert} >
                        <div className='h3_div_modal'>
                            <h3>ВВЕДИТЕ ПРАВИЛЬНОЕ ЗНАЧЕНИЕ</h3>
                        </div>
                        <div>
                            <Button value='ЗАКРЫТЬ' onClick={() => {
                                setModalActiveAlert(false);
                            }} />
                        </div>
                    </Modal>
                </div>
            </div>
        );
    };
}
