//  Поиск Плат, в которые входят недостающие Компоненты

//  Получаем список имен Плат, в которых есть недостающие Компоненты (комплектующие) 
//  arr1 - Массив всех Компонентов (комплектующих) из БД Components, которых не хватает для выполнения всех Планов
//  arr2 - массив всех Плат из БД Plats с массивом всех Компонентов, необходимых для изготовления платы
const searchForMissing = (arr1, arr2) => {

    const tmp = arr1.map(elem => elem.name);  //Формируем массив с именами недостающих Компонентов

    const result = arr2.map((elem) => {  //Формируем массив с именами Плат, в которых есть недостающие Комопненты
        let myTmp = null;
        for (const comp of elem.components) {
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i] === comp.name) {
                    myTmp = elem.name;
                };
            };
        };
        return myTmp;
    });

    //Убираем пустые элелементы или элементы со значением null
    const result2 = result.filter((elem) => { return elem !== '' && elem != null });
    console.log('Платы с недостающими компонентами:', result2);

    return result2;
};

export default searchForMissing;