import { createContext } from "react";


const nullFunc = function () { };

export const PlataContext = createContext(
    {
        list: null, //Список Планов
        setList: nullFunc,
        platsList: null,  //Список Продуктов (Платы)
        setPlansList: nullFunc
    }
);