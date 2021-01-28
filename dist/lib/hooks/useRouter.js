import { useContext, useEffect, useState } from 'react';
import { RouterContext } from '../..';
const useForceUpdate = () => useState(0)[1];
export function useRouter(withUpdate = false) {
    const router = useContext(RouterContext);
    if (!router) {
        throw new Error('Use useRoute without context');
    }
    const forceUpdate = useForceUpdate();
    useEffect(() => {
        const fn = () => {
            if (withUpdate) {
                forceUpdate(Date.now());
            }
        };
        router.on('update', fn);
        return () => {
            router.off('update', fn);
        };
    }, []);
    return router;
}
