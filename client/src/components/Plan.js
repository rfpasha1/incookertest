//  Компонента PLAN для одного (выбраного из списка Планов PlansList) Плана с кнопками "ВЫПОЛНИТЬ", "ИЗМЕНИТЬ", "ОТМЕНИТЬ"

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { PlataContext } from '../context/plataContext';
import Button from '../ul/button';
import { Link } from 'react-router-dom';  //Компонент, который использует Роутер для оптимизации загрузки
import { useData } from '../myHooks/useData';
import createPlan from '../myLib/createPlan';
import { useHttp } from '../myHooks/useHttp';
import Modal from './Modal/Modal';
import Header from './Header';
import MyOnePlanTest from './MyOnePlanTest'; //Визуализация выбраного Плана
// import analizOfPlans from '../myLib/analizOfPlans';

//******************************___________________________*****************************************\\

//  Создаем копию исходного Плана, в котором указываем новое количество всех Плат (newQ) для handler "Изменить План"
const createNewPlanForChange = (oldPlan) => {

    const newPlan = { ...oldPlan };
    newPlan.plats = [];
    oldPlan.plats.forEach((elem, index) => {
        newPlan.plats.push({ ...elem });
    });
    // console.log('newPlan: ', newPlan);
    return newPlan;
};

//******************************_____________PLAN______________*****************************************\\

//  КОМПОНЕНТ, ВОЗВРАЩАЕТ ОДИН ВЫБРАНЫЙ ПЛАН ИЗ СПИСКА ПЛАНОВ
function Plan() {

    const { request } = useHttp();
    const [ans, setAns] = useState({ msg: '' });  // Ответ сервера
    const { data, plataList } = useData();  //Все Платы из БД с указанием Комплектующих
    const [newPlanPlatsValue, setNewPlanPlatsValue] = useState([]);  //Новое количество плат в откорректированом Плане
    const { list, setList } = useContext(PlataContext);  //Список всех Планов из БД
    const [modalActive, setModalActive] = useState(false); //Состояние для Модального окна
    const [message, setMessage] = useState('');  //Сообщение в Модальном окне
    const [btnArr, setBtnArr] = useState([]);  //Массив кнопок в Модальном окне
    const [modalActiveAlert, setModalActiveAlert] = useState(false);  //Состояние для Модального окна "ВЫБЕРИТЕ ХОТЯ БЫ ОДНУ ПЛАТУ"

    console.log('PLAN_PALN: list=', list);

    const { index } = useParams(); // Берем из адресной строки параметр index (индекс выбраного Плана в массиве всех Планов)
    const planIndex = parseInt(index.substring(1));  //Номер Плана в списке планов (Индекс)
    console.log('PLAN_PALN: planIndex=', planIndex);
    const location = useLocation();
    const { myFlag } = location.state;  // Получаем значение свойства myFlag из ссылки
    console.log('!!!!___myFlag___!!!!: ', myFlag);

    //  Отправляем запрос на списание Компонентов в выполненном Плане (кнопка "ВЫПОЛНИТЬ")
    //  myPath - путь запроса, activePlan - массив Плат и их количество для данного Плана, 
    //  planComponents - массив компонентов, в которых необходимо изменить количество и резезрв после выполения данного Плана
    const sendRequest = async (myPath, activePlan, planComponents) => {

        console.log('sendRequest: ', planComponents);
        console.log('sendRequest2: ', activePlan);

        // Создаем новый объект с двумя свойствами: plan и components (body для POST-запроса)
        const activeComponents = planComponents.map((elem) => {
            return {
                _id: elem._id,
                q: elem.quantity  //Количество Компонентов необходимое для выполнения данного Плана
            };
        });
        const dataForSend = {
            plan: activePlan,
            components: activeComponents
        };
        // console.log('dataForSend in sendRequest: ', dataForSend);

        // Отправляем POST-запрос на сервер для сохранения или удаления этих данных
        try {
            let tmp = await request(myPath, 'POST', dataForSend);
            console.log(`DATA ${myPath}: `, tmp);
            return tmp;
        }
        catch (err) {
            console.log(err);
            return 'ОШИБКА';
        }
    };

    // Функция для фиксации полного выполнения Плана или полной отмены Плана (myPlan). 
    // Список всех Компонентов и их количество для данного выбраного Плана (myPlan)
    const fullFildPlan = (myPlan) => {

        // Получаем список всех необходимых для выполнения Плана компонентов
        console.log('myPlan: ', myPlan.name);
        const planComponents = createPlan(myPlan.plats, data);
        if (planComponents) {
            console.log('planComponents in Plan: ', planComponents);
            return planComponents;
        } else {
            console.log('planComponents: Ошибка');
            return null;
        };
    };

    //  Отправляем запрос на создание и сохранения нового Плана, а также корректировку и перезапись старого Плана
    //  Корректируем старый План (myPlan), newQ - содержит новый откорректированый План
    const correctPlan = async (myPlan, newQ) => {

        console.log('Корректируем План');
        const newPlan = createNewPlanForChange(myPlan);
        // Меняем имя (name) и удаляем свойство _id для нового Плана (newPlan), перед отправкой на сервер
        let today = new Date();
        let myDay = today.getDate();
        myDay = (myDay > 9) ? myDay : '0' + myDay;
        let myMonth = today.getMonth() + 1;
        myMonth = (myMonth > 9) ? myMonth : '0' + myMonth;
        newPlan.name = newPlan.name + ' / ' + myDay + '.' + myMonth;
        delete newPlan._id;
        newPlan.plats.forEach((elem, index) => {
            elem.q = newQ[index];
        });
        console.log('NEW_PLAN IN correctPlan: ', newPlan);

        // Корректируем старый План для изменения его в БД
        const oldCorrectPlan = createNewPlanForChange(myPlan);
        oldCorrectPlan.plats.forEach((elem, index) => {
            elem.q = elem.q - newPlan.plats[index].q;
        });
        console.log('OLD_CORRECT_PLAN IN correctPlan: ', oldCorrectPlan);

        // Создаем новый объект (body для POST-запроса) с двумя свойствами: oldPlan и newPlan cо свйствами plan и components 
        const dataForSend = {
            oldPlan: oldCorrectPlan,
            newPlan: newPlan
        };
        // Отправляем POST-запрос на сервер для сохранения и изменеия данных
        try {
            let tmp = await request('/api/changePlan', 'POST', dataForSend);
            console.log(`DATA '/api/changePlan': `, tmp);
            return tmp;
        }
        catch (err) {
            console.log(err);
            return 'ОШИБКА'
        };
    };

    // Проверяем првильность заполнения полей input для разделения Плана (чтоб не было ситуации что все поля с 0, а было хоть одно поле заполнено)
    const checkInput = (selector) => {

        let flag = false; //Если все поля input будут равны 0, то flag будет false
        let allInputs = document.querySelectorAll(selector);
        for (let i = 0; i < allInputs.length; i++) {
            let tmp = +allInputs[i].value;
            if (tmp !== 0) {
                return flag = true;
            };
        };
        return flag;
    };

    // Обрабатываем событие выполнить План (handler на кнопке "ВЫПОЛНИТЬ")
    const fildPlan = async () => {

        let planComponents = fullFildPlan(list[planIndex]); //Список и количество всех Компонентов для выбраного Плана
        let res = await sendRequest('/api/fullFildPlan', list[planIndex], planComponents);
        setList(res);  //Обновляем список Планов
        setAns({ msg: 'План выполнен и сохранен в Архив!' });
    };

    // Обрабатываем событие отменить и удалить План (handler на кнопке "ОТМЕНИТЬ")
    const delPlan = async () => {

        let planComponents = fullFildPlan(list[planIndex]); //Список и количество всех Компонентов для выбраного Плана
        let res = await sendRequest('/api/fullCancelPlan', list[planIndex], planComponents);
        setList(res);  //Обновляем список Планов
        setAns({ msg: 'План отменен и удален!' });
    };

    // Обрабатываем событие изменть План (handler на кнопке "ИЗМЕНИТЬ")
    const changeMyPlan = async () => {

        let flag = checkInput('.inp_change_plan'); //Проверяем заполнения полей input
        if (flag) {
            let res = await correctPlan(list[planIndex], newPlanPlatsValue);
            setList(res);  //Обновляем список Планов
            setAns({ msg: 'План успешно разделен!' });
        } else {
            setModalActiveAlert(true);
        };
    };

    //  Обрабатываем событие Отложить План (handler на кнопке "ОТЛОЖИТЬ")
    const postponedPlan = async () => {

        let planComponents = fullFildPlan(list[planIndex]); //Список и количество всех Компонентов для выбраного Плана
        let res = await sendRequest('/api/putOffPlan', list[planIndex], planComponents);
        setList(res);  //Обновляем список Планов
        setAns({ msg: 'План отложен!' });
    };

    // Создаем кнопку. value - название кнопки, func - функция (handler) при клике на кнопку
    const Btn = ({ value, func }) => {

        return (
            <Button value={value} onClick={() => {
                setModalActive(false);
                func();
            }} />
        )
    };

    // Возвращаем коллекцию (необходимое количество) кнопок в Модальном окне. btnArr - массив кнопок
    const SetOfBtn = ({ btnArr }) => {

        const mySetButtons = btnArr.map((elem, index) => {
            return <Btn key={'setOfBtn' + index} className={'btn_mod_win myButton'} value={elem.value} func={elem.func} />
        });

        return (
            <div>
                {mySetButtons}
            </div>
        )
    };

    // Создаем контентную часть (children) Модальноего окна (текст и кнопки). 
    // msg - текст Модального окна, btnArr - массив кнопок
    const CreateMsg = ({ msg, btnArr }) => {

        return (
            <div className='modal__content_text'>
                <div className='h3_div_modal'>
                    <h2>ПОДТВЕРДИТЕ ДЕЙСТВИЕ</h2>
                </div>
                <div className='div_content_text_modal'>
                    {msg}
                </div>
                {(btnArr) ? <SetOfBtn btnArr={btnArr} /> : ''}
            </div>)
    };

    useEffect(() => {

        plataList();
        if (list[planIndex]) {
            const tmp = list[planIndex].plats.map((elem) => elem = 0); //Массив содержит столько элементов сколько Плат в Плане
            setNewPlanPlatsValue(tmp);
        } else {
            return;
        }
    }, [plataList, list, planIndex]);

    // Если плата в списке Плат отмечена как отложеная и содержит поле PostponedPlan, то при отображении Плана 
    // показываем кнопку "Удалить" и кнопку "Отложить". По кнопке "Отложить" переписываем план в коллекцию PostponedPlan
    // и удаляем соответствующий этому Плану резерв

    return (

        <div className="App">

            <div className='wrap_change_myPlan in_center'>
                {(ans.msg !== '') ?
                    (<div className='div_ans_server'>
                        <p>{ans.msg}</p>
                    </div>) :
                    list[planIndex] && (
                        <div>
                            <h3 className='h3__change_myPlan'>План:</h3>
                            <Header planName={list[planIndex].name} />
                            <MyOnePlanTest list={list} planIndex={planIndex} newPlan={newPlanPlatsValue} setNewPlan={setNewPlanPlatsValue} />

                            {!myFlag &&
                                <div className='in_center'>
                                    <Button className={'btn_change_myPlan myButton'} value={'ВЫПОЛНИТЬ'}
                                        onClick={async () => {
                                            setBtnArr([
                                                {
                                                    value: 'ВЫПОЛНИТЬ',
                                                    func: fildPlan
                                                },
                                                {
                                                    value: 'ОТМЕНА',
                                                    func: () => { }
                                                }
                                            ]);
                                            setMessage(`Выполнить и записать в архив выбранный План ${list[planIndex].name}?`);
                                            setModalActive(true);
                                        }}
                                    />

                                    {list[planIndex].name.indexOf('/') === -1 &&  //Показываем эту кнопку только в НЕ измененном Плане
                                        <Button className={'btn_change_myPlan myButton'} value={'ИЗМЕНИТЬ'}
                                            onClick={async () => {
                                                setBtnArr([
                                                    {
                                                        value: 'ИЗМЕНИИТЬ',
                                                        func: changeMyPlan
                                                    },
                                                    {
                                                        value: 'ОТМЕНА',
                                                        func: () => { }
                                                    }
                                                ]);
                                                setMessage(`Изменить выбранный План ${list[planIndex].name}?`);
                                                setModalActive(true);
                                            }}
                                        />
                                    }

                                    <Button className={'btn_change_myPlan myButton'} value={'ОТМЕНИТЬ'}
                                        onClick={async () => {
                                            setBtnArr([
                                                {
                                                    value: 'УДАЛИТЬ',
                                                    func: delPlan
                                                },
                                                {
                                                    value: 'ОТМЕНА',
                                                    func: () => { }
                                                }
                                            ]);
                                            setMessage(`Отменить и удалить выбранный План ${list[planIndex].name}?`);
                                            setModalActive(true);
                                        }}
                                    />
                                </div>
                            }
                            {myFlag &&
                                <div className='in_center'>
                                    <Button className={'btn_change_myPlan myButton'} value={'ОТЛОЖИТЬ'}
                                        onClick={async () => {
                                            setBtnArr([
                                                {
                                                    value: 'ОТЛОЖИТЬ',
                                                    func: postponedPlan
                                                },
                                                {
                                                    value: 'ОТМЕНА',
                                                    func: () => { }
                                                }
                                            ]);
                                            setMessage(`Отложить выбранный План ${list[planIndex].name}?`);
                                            setModalActive(true);
                                        }}
                                    />

                                    <Button className={'btn_change_myPlan myButton'} value={'УДАЛИТЬ'}
                                        onClick={async () => {
                                            setBtnArr([
                                                {
                                                    value: 'УДАЛИТЬ',
                                                    func: delPlan
                                                },
                                                {
                                                    value: 'ОТМЕНА',
                                                    func: () => { }
                                                }
                                            ]);
                                            setMessage(`Удалить выбранный План ${list[planIndex].name}?`);
                                            setModalActive(true);
                                        }}
                                    />
                                </div>

                            }
                        </div>
                    )
                }

                <div className='in_center'>
                    <Link to='/PlansList' className='linkButton'>ЗАКРЫТЬ</Link>
                </div>
            </div>

            <Modal active={modalActive} setActive={setModalActive} myRes={setModalActive}>
                <CreateMsg msg={message} btnArr={btnArr} />
            </Modal>

            <Modal active={modalActiveAlert} setActive={setModalActiveAlert} myRes={setModalActiveAlert} >
                <div className='h3_div_modal'>
                    <h3>ДЛЯ РАЗДЕЛЕНИЯ ПЛАНА ВЫБЕРИТЕ ХОТЯ БЫ ОДНУ ПЛАТУ</h3>
                </div>
                <div>
                    <Button value='ЗАКРЫТЬ' onClick={() => {
                        setModalActiveAlert(false);
                    }} />
                </div>
            </Modal>

        </div>
    );
};

export default Plan;