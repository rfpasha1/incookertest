//  Извлекаем все Платы из списка Плат (PlansList), объеденяем их в один массив и подсчитываем количество каждой Платы в данном списке Плат

//  lockalPlansList - массив для локального списка Планов (PlanList) 
const mergeSimilarListItems = (lockalPlansList) => {

    // Для всех элементов локального массива Планов (lockalPlansList) удаляем свойство PostponedPlan
    const copyArrPlanLists = lockalPlansList.map(({ postponedPlan, ...rest }) => rest);

    // Из локального списка Планов (copyArrPlanLists) выбираем все Платы
    const allPlats = copyArrPlanLists.map((elem) => {
        let arrAllPlats = [];
        for (const plat of elem.plats) {
            arrAllPlats.push(plat);
        }
        return arrAllPlats;
    });
    // Объединяем массивы объектов в один массив (массив содержит все Платы из всех Планов в PlanList)
    const allPlatsInPlansList = allPlats.flat();

    // Объединяем все платы с одинаковым названием (name) и подсчитываем общее количество (q) необходимое для выполнения всех Планов
    let sumAllPlats = allPlatsInPlansList.reduce((acc, item) => {
        let oldItem = acc.find(oldItem => oldItem.name === item.name);
        if (oldItem) {
            oldItem.q = (+oldItem.q) + (+item.q);
        } else {
            acc.push(item)
        }
        return acc;
    }, []);

    return sumAllPlats;
}

export default mergeSimilarListItems;