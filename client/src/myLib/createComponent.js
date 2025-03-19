//  Формируем массив из комплектующих всех Плат в плане
//  plata - список Плат с указанием необходимого количества (q)
//  plataList - список всех Плат из БД коллекция Products с указанием всех комплектующих
const getElements = (plata, plataList) => {

    //Получаем комплектующие для платы из списка Плат (plataList)
    let necessaryСomponents = [];
    plataList.forEach((elem) => {
        if (elem._id === plata._id) {  //Находим необходимую Плату в списке Плат
            //Умножаем количество комплектующих на количество Плат в плане
            elem.components.forEach((item) => {
                let tmp = {};
                for (let x in item) {
                    tmp[x] = item[x];
                }
                tmp = { ...item };
                tmp.quantity = (+item.quantity) * (+plata.q);
                necessaryСomponents.push(tmp);
            });
            return;
        };
    });
    //Возвращаем массив, в котором каждый элемент есть массив, содержащий все необходимые комплектующие одной Платы Плана.
    //Весь массив necessaryСomponents содержит все компоненты для всех плат Плана (массив массивов). 
    return necessaryСomponents;
};

//  Подсчитываем необходимое количество одинаковых комплектующих и возвращаем массив уникальных (неповторяющихся) компонентов,
//  с указанием необходимого количества для всего Плана
const summationOfComponents = (arrComponents) => {

    let result = [arrComponents[0]];
    for (let i = 1; i < arrComponents.length; i++) {
        //Находим индекс повторяющего элемента в масиве result
        let ind = result.findIndex((elem) => elem.name === arrComponents[i].name);
        //Если индекс не найден, то добавляем весь элемент, если индекс найден то суммируем значение свойства quantity
        if (ind === -1) {
            result.push(arrComponents[i]);
        } else {
            result[ind].quantity += +arrComponents[i].quantity;
        }
    }
    return result;
}

//  Формируем список уникальных комплектующих, необходимый для составления плана
//  plan - список Плат в Плане с указанием необходимого количества (q)
//  plataList - список всех Плат из БД коллекция Products с указанием всех комплектующих
const createComponent = (plan, plataList) => {

    console.log('createComponents', plan);
    let elements = [];
    //Для всех Плат выбираем комплектующие из plataList
    const p1 = plan.map((elem) => {
        return getElements(elem, plataList);
    });
    //Подсчитываем необходимое количество одинаковых комплектующих
    const p2 = p1.flat();  //Объединяем массивы объектов в один иассив
    // console.log('Длина массива: ', p2.length);
    elements = summationOfComponents(p2);
    //Возвращаем полученый массив уникальных комплектующих
    return elements;
};

export default createComponent;