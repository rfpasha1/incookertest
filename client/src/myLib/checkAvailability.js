//  Проверяем наличие Компонентов на складе (в коллекции Components) для полного выполнения всех Планов в списке Планов (PlanList)

//  Находим нужный элемент в массиве Компонентов
const getElementFromComponents = (elem, compArray) => {

    if (compArray.length > 0 && elem) {
        const myComponent = compArray.find((item) => item.name === elem.name);
        return myComponent;
    } else {
        return null;
    };
};

//  Проверяем наличие на складе и хватает ли количества на складе для данного Компонента чтоб выполнить План
const testComponent = (plan, compArray) => {

    console.log('testComponent');
    let check = true;  //Если каких либо компонентов не достаточно check будет false
    let res = [];      //Все компоненты из Плана с указанием количества на складе и количеством дальнейшего резерва
    //Если компонентов на складе не достаточно, добавляем поле lacks, с указанием количества, сколько компонентов не хватает
    res = plan.map((elem) => {
        //Находим elem в массиве компонентов
        let tmp = getElementFromComponents(elem, compArray); //Элемент из БД Components
        let lacks = (tmp) ? (+tmp.quantity) - (+elem.quantity) : undefined; //Если компонента в БД нет, lacks = undefined
        // console.log(tmp.name, ' TMP.QUANTITY=== ', tmp.quantity, 'ELEM.QUANTITY=== ', elem.quantity);
        if (tmp) {
            tmp.lacks = lacks;
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

    let res = arr.filter((elem) => elem.lacks === undefined || elem.lacks < 0);
    return res;
};

//  Проверяем хватает ли нужных нам Компонентов на складе (в коллекции Components)
const checkAvailability = (planComponents, compArray) => {

    let tmp = null;
    if (compArray) {
        tmp = testComponent(planComponents, compArray);
        // Если каких-то Компонентов не хватает, то возвращаем check=false и записываем их в массив missingComponents.result
        if (!tmp.check) {
            const missingComponents = {}
            missingComponents.check = tmp.check;
            missingComponents.result = listOfLacks(tmp.result);
            return missingComponents;
        }
    };
    // Если всех Компонентов хвватает, то возвращаем check=true и пустой массив missingComponents.result
    return { check: tmp.check, result: [] };
};

export default checkAvailability;