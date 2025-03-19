import { useCallback, useState } from 'react';
import { useHttp } from './useHttp';

export function useComponents() {

    const { loading, request } = useHttp();
    const [components, setComponents] = useState(null);
    const componentsList = useCallback(async () => {
        try {
            let tmp = await request('/api/fullListComponents');
            //В списке Компонентов добавляем свойство reserve, если его нет
            tmp.forEach((elem) => {
                if (!elem.reserve) { elem.reserve = 0 }
            });
            setComponents(tmp);
            console.log('DATA /api/fullListComponents', tmp);
        }
        catch (err) {
            console.log(err);
        }
    }, [request]);
    return { components, componentsList, setComponents, loading };
};
