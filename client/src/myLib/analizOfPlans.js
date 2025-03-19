//  Проверяем наличие и достаточность Компонентов для выполнения всех Планов из списка Планов (PlansList)

import mergeSimilarListItems from './mergeSimilarListItems';
import createComponent from './createComponent';
import checkAvailability from './checkAvailability';
import searchForMissing from './searchForMissing';
import saerchPlans from './searchPlans';
import addProperty from './addProperty';

const analizOfPlans = (list, platsList, components) => {

    // Объявляем массив для локального списка Планов 
    let copyArrPlanListsLockal = structuredClone(list);

    // Из локального списка Планов (copyArrPlanLists) выбираем все Платы
    const allPlatsInPlansList = mergeSimilarListItems(copyArrPlanListsLockal);
    // console.log('____allPlatsInPlansList______: ', allPlatsInPlansList);

    // Выбираем все Комлектующие и их необходимое количество из всех Плат в списке Планов
    const necessaryComponents = createComponent(allPlatsInPlansList, platsList);
    // console.log('____--necessaryComponents--______: ', necessaryComponents);

    // Делаем проверку на достаточное наличие Комлектующих на складе, если недостаточно комплектующих
    // показываем их список в Модальном окне и определяем в какие Платы входят эти Комплектующие, получем список Имен этих Плат
    // Если в План входит плата из списка, выделяем этот план цветом и добавляем свойство PostponedPlan,
    // изменения списка list нужно выполнить с помощью функции setList

    const componentTesting = checkAvailability(necessaryComponents, components);
    // console.log('********componentTesting******: ', componentTesting);

    //  Получаем список имен Плат, в которых есть недостающие Компоненты (комплектующие) 
    const listNameBoards = searchForMissing(componentTesting.result, platsList);
    // console.log('AA__listNameBoards__AA: ', listNameBoards);

    // Получаем список _id Планов, в которые входят Платы с недостающими Компонентами (массив listNamePlats)
    const listIdPlans = saerchPlans(listNameBoards, list);
    // console.log('BB__listNamePlans__BB: ', listIdPlans);

    // В локальном массиве copyArrPlanListsLockal добавяем Планам, 
    // в которых есть Платы с недостающими Компонентами, свойство postponedPlan
    copyArrPlanListsLockal = addProperty(listIdPlans, copyArrPlanListsLockal);
    // console.log('CC__copyArrPlanListsLockal__CC: ', copyArrPlanListsLockal);

    return { copyArrPlanListsLockal, componentTesting };
};

export default analizOfPlans;