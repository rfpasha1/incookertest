// !!!!  Формируем список всех уникальных комплектующих (createPlan), необходимый для составления плана (производство всех Плат в данном Плане)

//  Формируем массив из комплектующих нужных Плат в плане
//  plata - список Плат с указанием необходимого количества (q)
//  plataList - список всех Плат из БД коллекция Products с указанием всех комплектующих
const getElements = (plata, plataList) => {

    //Получаем комплектующие для платы из списка Плат (plataList)
    let necessaryСomponents = [];
    plataList.forEach((elem) => {
        if (elem._id === plata._id) {
            //Умножаем количество комплектующих на количество Плат в плане
            elem.components.forEach((item) => {
                item['quantity'] *= +plata.q;
                necessaryСomponents.push(item);
            });
            return;
        }
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
const createPlan = (plan, plataList) => {

    console.log('createPlan', plan);
    let elements = [];
    //Из plan выбираем Платы для которых количество отлично от 0
    const p0 = plan.filter((elem) => elem.q > 0);
    if (p0.length === 0) {
        return [];
    };
    //Для всех таких Плат выбираем комплектующие из plataList
    const p1 = p0.map((elem) => {
        return getElements(elem, plataList);
    });
    //Подсчитываем необходимое количество одинаковых комплектующих
    const p2 = p1.flat();  //Объединяем массивы объектов в один иассив
    // console.log('Длина массива: ', p2.length);
    elements = summationOfComponents(p2);
    //Возвращаем полученый массив уникальных комплектующих
    return elements;
};

export default createPlan;