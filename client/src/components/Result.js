//  Компонент проверяет на наличие и достаточное количество комплектующих для резервирования Плана 
//  В зависимости от проверки возвращает: компоннту ReserveComponents - если всех комплектующих хватает или компоненту 
//  LacksComponent - если не хватает каких-либо компонентов

import React, { useEffect, useState } from 'react';
import { useComponents } from '../myHooks/useComponents';
import LacksComponent from './LacksComponent';
import ReserveComponents from './ReserveComponents';

//  Находим нужный элемент в массиве Компонентов
const getElementFromComponents = (elem, compArray) => {

    if (compArray.length > 0 && elem) {
        const myComponent = compArray.find((item) => item.name === elem.name);
        return myComponent;
    } else {
        return;
    };
};

//  Проверяем наличие на складе и хватает ли количества на складе для данного Компонента чтоб выполнить План
const testPlan = (plan, compArray) => {

    let check = true;  //Если каких либо компонентов не достаточно check будет false
    let res = [];      //Все компоненты из Плана с указанием количествана складе и количеством дальнейшего резерва
    //Если компонентов на складе не достаточно, добавляем поле lacks, с указанием количества, сколько компонентов не хватает
    res = plan.map((elem) => {
        //Находим elem в массиве компонентов
        let tmp = getElementFromComponents(elem, compArray);
        let lacks = (tmp) ? (+tmp.quantity) - (+tmp.reserve) - (+elem.quantity) : undefined; //Если компонента в БД нет, lacks = undefined
        if (tmp) {
            tmp.lacks = lacks;
            elem.reserve = tmp.reserve
        };
        if (lacks < 0) {
            check = false;
        };
        return tmp;
    });

    return { check: check, result: res };
};

//  Список недостающих элементов
const listOfLacks = (arr) => {

    let res = arr.filter((elem) => elem.lacks === undefined || elem.lacks <= 0);
    return res;
};

//  Рендерим в зависимости от полученых данных: либо массив с нехватающими Компонентами, либо копку "Поставить в Резерв" 
export default function Result({ myRes, plataLi, planComponents, changePlan }) {

    const { components, componentsList } = useComponents();
    const [lacksElement, setLacksElement] = useState(null);  //Массив Компонентов, количество на складе которых не достаточно для выполнения Плана 

    useEffect(() => {
        componentsList();
    }, [componentsList]);

    useEffect(() => {
        let tmp = null;
        if (components) {
            tmp = testPlan(planComponents, components);
            console.log('tmp in Result: ', tmp);
            if (!tmp.check) {
                setLacksElement(listOfLacks(tmp.result));
                changePlan([]);
            }
        };
    }, [components, planComponents, changePlan]);

    if (lacksElement === null) {  //Если всех компонентов хватает для выполнения Плана
        return (
            <div>
                <ReserveComponents plataLi={plataLi} planComponents={planComponents} myRes={myRes} />
            </div>
        );
    };

    return (  //Если есть Компоненты, количество которых на складе не достаточно для выпонения Плана
        <div>
            <LacksComponent arrLacks={lacksElement} myRes={myRes} />
        </div>
    );
};
