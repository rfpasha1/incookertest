import { useCallback, useState } from 'react';
import { useHttp } from './useHttp';

export function useData() {

    // let error = null;
    const { request, error } = useHttp();
    const [data, setData] = useState(null); //Список всех Плат из БД
    const [plataLi, setPlataLi] = useState(null); //Список Плат с указанием количества для Плана
    const plataList = useCallback(async (data, error) => {
        try {
            let tmp = await request('/api/fullList');
            console.log('DATA /api/fullList: ', tmp);
            const plan = tmp.map((elem) => {
                return {
                    name: elem.name,
                    _id: elem._id,
                    q: 0  //Количество плат по плану
                }
            });
            // console.log('PLAN: ', plan);
            setPlataLi(plan);
            setData(tmp);
        }
        catch (err) {
            if (err) {
                console.log(err);
                err.message += ' Ошибка при чтении списка Плат';
                console.log(err);
            };
        };
    }, [request]);
    return { data, error, plataList, plataLi, setPlataLi };
};
