//  Добавяем Планам, в которых есть Платы с недостающими Компонентами, свойство postponedPlan

//  arr1 - Массив _id Планов, в которых есть Платы с недостающими Компонентами
//  arr2 - Локальный массив Планов (lockalPlansList), куда будем добавлять каждому Плану (с _id из arr1) свойство PostponedPlan
const addProperty = (arr1, arr2) => {

    arr2.forEach((elem) => {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] === elem._id) {
                elem.postponedPlan = true;
            };
        };
    });

    return arr2;
};

export default addProperty;