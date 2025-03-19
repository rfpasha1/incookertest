//  Компонент для сохранения json файлов в папку jsonArhive и перезаписи данных из Базы данных в json файлы

import { useCallback, useEffect, useState } from 'react';
import { useHttp } from '../myHooks/useHttp';
import { Link } from 'react-router-dom';  //Компонент, который использует Роутер для оптимизации загрузки
import Loader from '../ul/Loader';

export default function ArchiveFiles() {

    const { request } = useHttp();
    const [result, setResult] = useState(null);
    const [ready, setReady] = useState(false);  //Готовность получения всех данных

    const saveData = useCallback(async () => {
        try {
            let tmp = await request('/api/saveDataBeforeExiting');
            setResult(tmp);
            console.log('DATA /api/saveDataBeforeExiting', tmp);
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
        )
    };

    return (

        <div className="App" >

            {(result && ready) && <div className='wrap_change_myPlan in_center'>
                <h2 className='h2_planName'>ВЫХОД ВЫПОЛНЕН УСПЕШНО</h2>

                <div className='div_whith_padding'>
                    <h3 className='h3__change_myPlan'>ДАННЫЕ КОЛЛЕКЦИЙ СОХРАНЕНЫ</h3>
                    <h3 className='h3__change_myPlan'>В <span className='name_myReserveComp'>JSON</span> ФАЙЛЫ </h3>
                </div>

                <div className='in_center'>
                    <Link to='/' className={'linkButton'}>ОК</Link>
                </div>
            </div>}

        </div>
    );
};