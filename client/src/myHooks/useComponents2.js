import { useCallback } from 'react';
import { useHttp } from './useHttp';

export function useComponents2() {

    const { loading, request } = useHttp();
    const componentsList = useCallback(async () => {
        try {
            let tmp = await request('/api/fullListComponents');
            //В списке Компонентов добавляем свойство reserve, если его нет
            tmp.forEach((elem) => {
                if (!elem.reserve) { elem.reserve = 0 }
            });
            console.log('DATA /api/fullListComponents2', tmp);
            return tmp;
        }
        catch (err) {
            console.log(err);
        }
    }, [request]);

    return { componentsList, loading };
};
