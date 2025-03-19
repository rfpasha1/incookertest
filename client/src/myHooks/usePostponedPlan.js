import { useCallback } from 'react';
import { useHttp } from './useHttp';

export function usePostponedPlan() {

    const { loading, request } = useHttp();
    const postponedPlanList = useCallback(async () => {
        try {
            let tmp = await request('/api/fullListPostponedPlan');
            console.log('DATA /api/fullListPostponedPlan', tmp);
            return tmp;
        }
        catch (err) {
            console.log(err);
        }
    }, [request]);

    return { postponedPlanList, loading };
};