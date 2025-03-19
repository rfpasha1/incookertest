//  Компонента возвращает список всех Плат с максимально возможным количеством производства
import React from 'react';

//  Находим нужный элемент в массиве Компонентов из Базы Данных (compArr)
//  compArr = components (все компоненты из коллекции components), element - один компонент в данной Плате
const getElementFromComponents = (element, compArr) => {

    if (compArr.length > 0 && element) {
        const myComponent = compArr.find((item) => item._id === element._id);
        return myComponent;
    } else {
        return;
    }
};

//  Делим найденый в БД компонент на количество компонента для данной Платы и возвращаем самое маленькое значение (result)
//  plataComponents - массив компонентов для производства данной Платы, compArr = components (все компоненты из коллекции components)
const testQuantity = (plataComponents, compArr) => {

    let resComp = [];
    resComp = plataComponents.map((elem) => {
        let tmp = getElementFromComponents(elem, compArr);
        let res = Math.floor(tmp.quantity / elem.quantity);
        return res;
    });
    // console.log('resComp!!!!____: ', resComp);
    let result = Math.min(...resComp);
    return result;
};

//  Компонента возвращает список всех Плат с максимально возможным количеством производства
//  listPlats - список всех Плат с маааивом необходимых Компонентов, compArr = components (все компоненты из коллекции components) 
export default function MaxProduction(compArr, listPlats) {

    let listMaxProd = [];
    if (listPlats) {
        listMaxProd = listPlats.map((elem, index) => {
            return (
                <div key={index + 'maxProd'} className='div_change_plan'>
                    Плата <span className='name_myReserveComp'>{elem.name}</span> - <span className='quantity_myReserveComp'>{testQuantity(elem.components, compArr)}</span> шт
                </div>
            )
        });
    } else {
        return;
    };

    return (
        <div>
            {listMaxProd}
        </div>
    )
};
