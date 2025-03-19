//  Формируем в Модальном окне список Компонентов, количество на складе которых не хватает для выполнения Плана

import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from '../ul/button';

export default function LacksComponent({ arrLacks, myRes }) {

    const [modalActive, setModalActive] = useState(true); //Состояние для Модального Окна
    console.log('LacksComponent ', modalActive);

    if (arrLacks == null) {
        return;
    }
    const lacksProd = arrLacks.map((elem, index) => {
        return (
            <li key={'lacksProd' + index}>
                <span className='name_myReserveComp'>{elem.name}</span> - <span className='quantity_myReserveComp'>{+elem.lacks * -1} шт</span>
            </li>
        )
    });

    return (
        <div>
            <Modal active={modalActive} setActive={setModalActive} myRes={myRes}>
                <div className='h3_div_modal'>
                    <h3>НЕ ХВАТАЕТ СЛЕДЮУЩИХ КОМПОНЕНТОВ:</h3>
                </div>
                <div>
                    <ol className='ol_content_text'>
                        {lacksProd}
                    </ol>
                </div>
                <Button value={'OK'} onClick={() => {
                    setModalActive(false);
                    myRes(false);
                }} />
            </Modal>
        </div>
    );
}
