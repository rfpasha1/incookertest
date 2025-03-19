// Домашняя страница приложения со списком всех Плат которые есть в БД (коллекция PRODUCTS)

import React, { useEffect, useState } from 'react';
import Button from '../ul/button';
import { useData } from '../myHooks/useData';
import Inputs from '../ul/inputs';
import createPlan from '../myLib/createPlan';
import Result from './Result';
import Modal from './Modal/Modal';
import { useComponents } from '../myHooks/useComponents';
import MaxProduction from './MaxProduction/MaxProduction';
import Loader from '../ul/Loader';

export default function HomePage() {

    const [plan, setPlan] = useState([]); //Состояние общего Плана
    const [res, setRes] = useState(false);
    const [ready, setReady] = useState(false);  //Готовность получения всех данных
    const [activePlan, setActivePlan] = useState([]);  //Список плат в Плане с указанием количества для сохранения в БД
    const { data, plataList, plataLi, setPlataLi } = useData();
    const { components, componentsList } = useComponents(); //Список всех Компонентов с коллекции components
    const [modalActive, setModalActive] = useState(false); //Состояние для Модального Окна кнопки "АНАЛИЗИРОВАТЬ"
    const [modalActiveAlert, setModalActiveAlert] = useState(false);  //Состояние для Модального окна для ввода в input

    if (plataLi) {
        console.log('DATA in HomePage: ', plataLi);  //plataLi - массив всех Плат с количеством для Плана (по умолчанию колличество 0)
    } else {
        console.log('Массив всех Плат с количеством для Плана НЕ ПРОЧИТАН!');
    };
    if (data) {
        console.log('____##__data: ', data);  //data - массив Плат с перечнем и необходимым количеством комплектующих (массив components)
    } else {
        console.log('Массив Плат с перечнем и необходимым количеством комплектующих НЕ ПРОЧИТАН!');
    };

    useEffect(() => {
        plataList();
        componentsList();
        setReady(true);
    }, [plataList, componentsList]);

    if (components === null) {
        console.log('Нет components');
        return;
    };
    if (data === null) {
        console.log('Нет data');
        return;
    };

    if (plataLi === null) {
        console.log('Нет plataLi');
        return;
    };

    // Функция (handler) на кнопку 'ЗАПЛАНИРОВАТЬ'
    const handlerButton = () => {

        setPlan(createPlan(plataLi, data));
        console.log('handlerButton: ', plataLi);
        const p0 = plataLi.filter((elem) => elem.q > 0); //Сохраняем текущий План со списком Плат и их количеством
        setActivePlan(p0);
        console.log('В ПЛАН ВОШЛО: ', p0);
        setRes(true);
    };

    const changeQ = (ind, value) => {
        let tmp = [...plataLi];
        tmp[ind].q = +value;
        setPlataLi(tmp);
    };

    // Сортируем массив Плат (plataLi или data) свойству name
    const sortedPlataLi = (plataLi) => {

        return plataLi.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    };

    const myProduct = sortedPlataLi(plataLi).map((item, index) => {
        return (
            <li key={item._id + '_List'}>
                <Inputs type='number' className='input_myProduct' value={item.q}
                    onChange={(e) => {
                        if (parseInt(e.target.value) < 0) {  //Проверяем правильность ввода количества Плат
                            setModalActiveAlert(true);
                            return;
                        };
                        changeQ(index, e.target.value);
                    }}
                />

                {/* <img src="/img/board_icon_64.png" alt='plata' className='img_products_list' /> */}
                <span className='name_myProduct_li'>
                    {/* <img src="/img/board_icon_64.png" alt='plata' className='img_products_list' /> */}
                    {item.name}
                </span>
            </li>
        )
    });

    if (!ready) {
        return (
            <Loader />
        )
    };

    return (
        <div className="App">
            {(plataLi && data && components && ready) && <div className='wrap_main_div in_center'>

                <h2>ПЛАТЫ</h2>
                <div className='wrap_ul_myProduct'>
                    <ul className='ul_myProduct'>
                        {myProduct}
                    </ul>
                </div>

                <div className='div_btn_home_page'>
                    <Button id='btn_home_page' value='ЗАПЛАНИРОВАТЬ' onClick={handlerButton} />
                    <Button id='btn_home_page2' value='АНАЛИЗИРОВАТЬ' onClick={() => {
                        setModalActive(true);
                    }} />
                </div>
            </div>}

            {(res) ? <Result myRes={setRes} plataLi={activePlan} planComponents={plan} changePlan={setPlan} /> : <div />}

            <div> {/* Модальное окно для кнопки "АНАЛИЗИРОВАТЬ" */}
                <Modal active={modalActive} setActive={setModalActive} myRes={setModalActive}>
                    <div className='h3_div_modal'>
                        <h2 className='h2_planName'>МАКСИМАЛЬНОЕ КОЛИЧЕСТВО ПЛАТ</h2>
                    </div>
                    {MaxProduction(components, sortedPlataLi(data))}
                    <div>
                        <Button className={'btn_change_myPlan myButton'} value='ЗАКРЫТЬ' onClick={() => {
                            setModalActive(false);
                        }} />
                    </div>
                </Modal>
            </div>

            <div>  {/* Модальное окно для валидного ввода количества в input */}
                <Modal active={modalActiveAlert} setActive={setModalActiveAlert} myRes={setModalActiveAlert} >
                    <div className='h3_div_modal'>
                        <h3>ВВЕДИТЕ ПРАВИЛЬНОЕ ЗНАЧЕНИЕ</h3>
                    </div>
                    <div>
                        <Button className={'btn_change_myPlan myButton'} value='ЗАКРЫТЬ' onClick={() => {
                            setModalActiveAlert(false);
                        }} />
                    </div>
                </Modal>
            </div>

        </div>
    );
};
