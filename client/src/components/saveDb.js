//  Компонент используется для сохранения БД в json файлы (при клике на ссылку "Обновить Данные")

import { useCallback, useEffect, useState } from 'react';
import { useHttp } from '../myHooks/useHttp';
import { Link } from 'react-router-dom';  //Компонент, который использует Роутер для оптимизации загрузки
import Loader from '../ul/Loader';

export default function SaveDb() {

    const { request } = useHttp();
    const [result, setResult] = useState(null);
    const [ready, setReady] = useState(false);  //Готовность получения всех данных

    const saveData = useCallback(async () => {
        try {
            let tmp = await request('/api/copyJsonFileInArhive');
            setResult(tmp);
            console.log('DATA /api/copyJsonFileInArhive', tmp);
        }
        catch (err) {
            console.log(err);
        }
    }, [request]);

    useEffect(() => {
        saveData();
        setReady(true);
    }, [saveData]);

    if ((!ready) || (!result)) {
        return (
            <Loader />
        );
    };

    return (

        <div className="App" >

            {(result && ready) && <div className='wrap_change_myPlan in_center'>
                <h2 className='h2_planName'>ДАННЫЕ АРХИВИРОВАНЫ</h2>

                <div className='div_whith_padding'>
                    <h3 className='h3__change_myPlan'>ДАННЫЕ УСПЕШНО СКОПИРОВАНЫ</h3>
                    <h3 className='h3__change_myPlan'> В ПАПКУ <span className='name_myReserveComp'>"jsonArhive"</span></h3>
                </div>

                <div className='in_center'>
                    <Link to='/' className={'linkButton'}>ОК</Link>
                </div>
            </div>}

        </div>
    );
};