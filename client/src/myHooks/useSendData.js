import { useCallback } from 'react';
import { useHttp } from './useHttp';

export function useSendData(plan) {

    // let error = null;
    const { request } = useHttp();
    const reserveComponents = useCallback(async (data, error) => {
        try {
            let tmp = await request('/api/reserveComponents', 'POST', plan);
            console.log('DATA /api/reserveComponents: ', tmp);
            return tmp;
        }
        catch (err) {
            console.log(err);
            // error = err;
        }
    }, [request, plan]);
    return reserveComponents;
};
