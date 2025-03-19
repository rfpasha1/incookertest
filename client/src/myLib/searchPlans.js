//  Находим все Планы, в которые входят Платы, у которых есть недостающие Компоненты. Возвращаем массив _id этих Планов

//  arr1 - Массив имен Плат, в котрых есть недостающие Компоненты
//  arr2 - Массив всех Планов из БД Plans
const saerchPlans = (arr1, arr2) => {

    //Формируем массив с _id Планов, в которых есть Платы с недостающими Комопнентами 
    //и количество таких Плат в Плане должно быть больше 0
    const resultPlns = arr2.map((elem) => {
        let myTmp = null;
        for (const plat of elem.plats) {
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] === plat.name && plat.q > 0) {
                    myTmp = elem._id;
                };
            };
        };

        return myTmp;
    });

    //Убираем пустые элелементы или элементы со значением null
    const resultPlns2 = resultPlns.filter((elem) => { return elem !== '' && elem != null });
    return resultPlns2;
};

export default saerchPlans;