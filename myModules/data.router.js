//  Маршруты для работы с Базами Данных

const { Router } = require('express');
const { /* query, */ body, validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = Router();
const auth = require('./authMiddleware.js');
const objectId = require('mongodb').ObjectId;
const fromAllDbToJson = require('./fromAllDbToJson.js');
const fromAllJsonToDb = require('./fromAllJsonToDb.js');
const saveAndExit = require('./saveAndExit.js');

const COLLECTION = config.get('collection') || 'products';

//  Добавляем маршруты роутеру

//___________________**********_____*****_____ GET ЗАПРОСЫ _____*****_____**********____________________\\

//  Получаем список названий Плат из БД и отправляем клиенту (Коллекция - Products)
router.get('/fullList', async (req, res) => {

    console.log('/api/fullList');
    const myDb = req.app.locals.MyDb;
    try {
        await myDb.changeCollection('products');  //Коллекция products в БД incooker
        let products = await myDb.getDataFromFullCollection();
        //Если products пуст, то запускаем функцию fromJsonToDb для файлов products.json, components.json, plans.json
        // и повторяем обращение к коллекции products
        if (products.length === 0) {
            await fromAllJsonToDb(req);  // Обновляем БД из json файлов
            products = await myDb.getDataFromFullCollection();
        };
        res.send(products);
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ message: 'Коллекция products не найдена (/api/fullList)' }); //Ошибка при работе с БД
    };
});

//  Получаем список Компонентов из БД и отправляем клиенту (Коллекция - Components)
router.get('/fullListComponents', async (req, res) => {

    console.log('/api/fullListComponents');
    const myDb = req.app.locals.MyDb;
    try {
        await myDb.changeCollection('components');  //Коллекция components в БД incooker
        let elements = await myDb.getDataFromFullCollection();
        //Если elements пуст, то запускаем функцию fromJsonToDb для файлов products.json, components.json, plans.json
        // и повторяем обращение к коллекции components
        if (elements.length === 0) {
            await fromAllJsonToDb(req);  // Обновляем БД из json файлов
            elements = await myDb.changeCollection('components');
        };
        res.send(elements);
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ message: 'Коллекция components не найдена (/api/fullListComponents)' }); //Ошибка при работе с БД
    };
});

//  Получаем и показываем Планы из коллекции PLANS
//  Получаем список всех Планов из БД и отправляем клиенту (Коллекция - Plans)
router.get('/fullPlans', async (req, res) => {

    console.log('/api/fullPlans');
    const myDb = req.app.locals.MyDb;
    try {
        await myDb.changeCollection('plans');  //Коллекция plans в БД incooker
        const plans = await myDb.getDataFromFullCollection();
        res.send(plans);
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ message: 'Коллекция plans не найдена (/api/fullPlans)' }); //Ошибка при работе с БД
    };
});

//  Получаем и показываем Отложенные Планы из коллекции POSTPONEDPLANS
//  Получаем список всех Отложенных Планов из БД и отправляем клиенту (Коллекция - postponedPlans)
router.get('/fullListPostponedPlan', async (req, res) => {

    console.log('/api/fullListPostponedPlan');
    const myDb = req.app.locals.MyDb;
    try {
        await myDb.changeCollection('postponedPlans'); //Коллекция postponedPlans в БД incooker
        const postponedPlans = await myDb.getDataFromFullCollection();
        res.send(postponedPlans);
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ message: 'Коллекция postponedPlans не найдена (/api/postponedPlans)' }); //Ошибка при работе с БД
    };
});

//  Копируем файлы (ссылка "Архивировать") components.json, products.json, plans.json в архивную папку jsonArhive
router.get('/copyJsonFileInArhive', async (req, res) => {

    console.log('/api/copyJsonFileInArhive');
    try {
        await saveAndExit();  // Копируем файлы components.json, products.json, plans.json в архивную папку (jsonArhive)
        res.json({ message: 'OK' });
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ message: 'Ошибка при сохранении данных' }); //Ошибка при работе с БД
    };
});

//  При выходе из приложения (ссылка "Выход") записываем данные из коллекций components, products, plans 
//  в файлы components.json, products.json, plans.json
router.get('/saveDataBeforeExiting', async (req, res) => {

    console.log('/api/saveDataBeforeExiting');
    try {
        await fromAllDbToJson(); //  Записываем данные из Базы Данных в файлы json (коллекции: components, products, plans)
        res.json({ message: 'OK' });
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ message: 'Ошибка при сохранении данных' }); //Ошибка при работе с БД
    };
});

//___________________**********_____*****_____ POST ЗАПРОСЫ _____*****_____**********____________________\\

//  Получаем План производства плат, бронируем в БД количество комплектующих для изготовления этого плана
//  Сохраняем План в коллекцию PLANS
router.post('/reserveComponents', async (req, res) => {

    console.log('/api/reserveComponents');
    const body = req.body;
    console.log('BODY: ', body);
    console.log('BODY.PLATS: ', body.plan.plats);
    console.log('BODY.COMPONENTS: ', body.components);

    const myDb = req.app.locals.MyDb;
    const result = { plan: {}, components: [], newPln: [] };
    try {
        await myDb.changeCollection('components');  //Коллекция components в БД incooker
        body.components.forEach(async (elem) => {   //Находим Компонент по id и меняем значение поля reserve
            const id = new objectId(elem._id);
            await myDb.updateDataOne({ _id: id }, { reserve: elem.reserve });
        });

        // Сохраняем новый План в коллекцию plans
        await myDb.changeCollection('plans');  //Коллекция plans в БД incooker
        result.plan = await myDb.saveOneDataToCollection(body.plan);  //Сохраняем План в коллекцию plans
        //Читаем измененную коллекцию plans, чтобы отправить новый список Планов клиенту
        result.newPln = await myDb.getDataFromFullCollection();
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ message: 'Коллекция данных не найдена (/api/reserveComponents)' }); //Ошибка при работе с БД
    } finally {
        console.log('plan: ', result.plan);
        res.send(result.newPln);
    }
});

//  Получаем выполненный План, удаляем План из списка планов (коллекция plans), списываем Компоненты из данного Плана
//  и записываем План в коллекцию archive
//  Поля quantity и reserve нужно уменьшить на значение поля q каждого Компонента, полученого от клиента
router.post('/fullFildPlan', async (req, res) => {

    console.log('/api/fullFildPlan');
    const body = req.body;
    console.log('BODY.PLAN: ', body.plan);
    console.log('BODY.COMPONENTS: ', body.components);

    const myDb = req.app.locals.MyDb;
    let newPln = null;
    try {
        //Удаляем План из коллекции plans и записываем выполненый План в коллекцию archive в БД incooker
        await myDb.changeCollection('plans');  //Коллекция plans в БД incooker
        const plnId = new objectId(body.plan._id);
        let pln = await myDb.deleteOneDocument({ _id: plnId });
        console.log('plan: ', pln);
        //Читаем измененную коллекцию plans, чтобы отправить новый список Планов клиенту
        newPln = await myDb.getDataFromFullCollection();
        await myDb.changeCollection('archive'); //Коллекция archive в БД incooker
        let arch = await myDb.saveOneDataToCollection(body.plan);  //Сохраняем План в коллекцию archive в БД incooker

        //Корректируем поля quantity и reserve Компонентов
        await myDb.changeCollection('components');  //Коллекция components в БД incooker
        body.components.forEach(async (elem) => {   //Находим Компонент по id и меняем значение поля reserve
            const id = new objectId(elem._id);
            let comp = await myDb.getOneDocument({ _id: id });    //Находим Компонент по id
            const newReserve = comp.reserve - parseInt(elem.q);   //Уменьшаем поле reserve на q
            const newQuantity = comp.quantity - parseInt(elem.q); //Уменьшаем поле quantity на q
            await myDb.updateDataOne({ _id: id }, {
                reserve: newReserve,
                quantity: newQuantity
            });
            console.log('Обновляем Компонент: ', comp);
        });
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ msg: 'Коллекция данных не найдена (/api/fullFildPlan)' }); //Ошибка при работе с БД
    } finally {
        res.send(newPln);
        // res.json({ msg: 'План выполнен!' });
    }
});

//  Получаем отмененный План, удаляем План из списка планов (коллекция plans), списываем Компоненты из данного Плана
//  Поле quantity оставляем без изменений
//  Поле reserve уменьшаем на значение поля q каждого Компонента, полученого от клиента
router.post('/fullCancelPlan', async (req, res) => {

    console.log('/api/fullCancelPlan');
    const body = req.body;
    console.log('BODY.PLAN: ', body.plan);
    console.log('BODY.COMPONENTS: ', body.components);

    const myDb = req.app.locals.MyDb;
    let newPln = null;
    try {
        //Удаляем План из коллекции plans в БД incooker
        await myDb.changeCollection('plans');  //Коллекция plans в БД incooker
        const plnId = new objectId(body.plan._id);
        let pln = await myDb.deleteOneDocument({ _id: plnId });
        console.log('plan: ', pln);
        //Читаем измененную коллекцию plans, чтобы отправить новый список Планов клиенту
        newPln = await myDb.getDataFromFullCollection();

        //Корректируем поля reserve Компонентов в коллекции components
        await myDb.changeCollection('components');  //Коллекция components в БД incooker
        body.components.forEach(async (elem) => {   //Находим Компонент по id и меняем значение поля reserve
            const id = new objectId(elem._id);
            let comp = await myDb.getOneDocument({ _id: id });  //Находим Компонент по id
            const newReserve = comp.reserve - parseInt(elem.q); //Уменьшаем поле reserve на q
            await myDb.updateDataOne({ _id: id }, {
                reserve: newReserve,
            });
            console.log('Обновляем Компонент: ', comp);
        });
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ msg: 'Коллекция данных не найдена (/api/fullCancelPlan)' }); //Ошибка при работе с БД
    } finally {
        res.send(newPln);
    }
});

//  Получаем откорректированный основной (старый) План и новый План. Новый План записываем в БД, с которым будем работать (выполнять или отменять)
//  Реальный План после выполнения может отличаться от сохранненого в БД, поэтому с брони будем снимать все, что было
//  запланировано и сохранено в БД, а списывать количество будем по реально изготовленным или отмененным Платам
router.post('/changePlan', async (req, res) => {

    console.log('/api/changePlan');
    const body = req.body;
    console.log('BODY.OLDPLAN.PLAN: ', body.oldPlan);
    console.log('BODY.OLDPLAN.COMPONENTS: ', body.oldPlan.plats);
    console.log('BODY.NEWPLAN.PLAN: ', body.newPlan);
    console.log('BODY.NEWPLAN.COMPONENTS: ', body.newPlan.plats);

    const myDb = req.app.locals.MyDb;
    let newPln = null;
    try {
        // Изменяем и перезаписывем основной План из коллекции plans в БД incooker
        await myDb.changeCollection('plans');  //Коллекция plans в БД incooker
        const plnId = new objectId(body.oldPlan._id);
        const correctOldPlan = await myDb.updateDataOne({ _id: plnId }, { plats: body.oldPlan.plats });
        console.log('Откорректированый План: ', correctOldPlan);

        // Записываем новый План в БД коллекцию plans
        const plan = await myDb.saveOneDataToCollection(body.newPlan);
        console.log('Новый План: ', plan);
        //Читаем измененную коллекцию plans, чтобы отправить новый список Планов клиенту
        newPln = await myDb.getDataFromFullCollection();
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ msg: 'Коллекция данных не найдена (/api/changePlan)' }); //Ошибка при работе с БД
    } finally {
        res.send(newPln);
    }
});

//  Получаем План который необходимо отложить, удаляем План из списка планов (коллекция plans),
//  списываем Компоненты из данного Плана и сохраняем данный План в коллекции Отложеных Планов (коллекция postponedPlans)
//  Поле quantity оставляем без изменений
//  Поле reserve уменьшаем на значение поля q каждого Компонента, полученого от клиента
router.post('/putOffPlan', async (req, res) => {

    console.log('/api/putOffPlan');
    const body = req.body;
    console.log('BODY IN /putOffPlan: ', body);
    console.log('BODY.PLAN: ', body.plan);
    console.log('BODY.COMPONENTS: ', body.components);

    const myDb = req.app.locals.MyDb;
    let newPln = null;
    try {
        //Удаляем План из коллекции plans в БД incooker
        await myDb.changeCollection('plans');  //Коллекция plans в БД incooker
        const plnId = new objectId(body.plan._id);
        let pln = await myDb.deleteOneDocument({ _id: plnId });
        console.log('plan: ', pln);
        //Читаем измененную коллекцию plans, чтобы отправить новый список Планов клиенту
        newPln = await myDb.getDataFromFullCollection();
        //Записываем План в коллекцию Отложенных Планов (коллекция postponedPlans)
        await myDb.changeCollection('postponedPlans'); //Коллекция postponedPlans в БД incooker
        delete body.plan._id;  //Удаляем свойство _id из body, чтоб назначить новое _id при сохраннении в коллекции postponedPlans
        let poastponedPlan = await myDb.saveOneDataToCollection(body.plan);  //Сохраняем План в коллекцию postponedPlans в БД incooker
        console.log('Отложенный План - poastponedPlan: ', poastponedPlan);

        //Корректируем поля reserve Компонентов в коллекции components
        await myDb.changeCollection('components');  //Коллекция components в БД incooker
        body.components.forEach(async (elem) => {   //Находим Компонент по id и меняем значение поля reserve
            const id = new objectId(elem._id);
            let comp = await myDb.getOneDocument({ _id: id });  //Находим Компонент по id
            const newReserve = comp.reserve - parseInt(elem.q); //Уменьшаем поле reserve на q
            await myDb.updateDataOne({ _id: id }, {
                reserve: newReserve,
            });
            console.log('Обновляем Компонент: ', comp);
        });
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ msg: 'Коллекция данных не найдена (/api/fullCancelPlan)' }); //Ошибка при работе с БД
    } finally {
        res.send(newPln);
    }
});

// Получаем Отложенный План и удаляем его из списка Отложенных Планов (из коллекции postponedPlans) 
router.post('/deletePostponedPlan', async (req, res) => {

    console.log('/api/deletePostponedPlan');
    const body = req.body;

    const myDb = req.app.locals.MyDb;
    let newPln = null;
    try {
        await myDb.changeCollection('postponedPlans'); //Коллекция postponedPlans в БД incooker
        const plnId = new objectId(body._id);
        let pln = await myDb.deleteOneDocument({ _id: plnId });
        console.log('plan: ', pln);
        //Читаем измененную коллекцию postponedPlans, чтобы отправить новый список Планов клиенту
        newPln = await myDb.getDataFromFullCollection();
    } catch (err) {
        console.log('ERR: ', err);
        res.sendStatus(500).json({ msg: 'Коллекция данных не найдена (/api/deletePostponedPlan)' }); //Ошибка при работе с БД
    } finally {
        res.send(newPln);
    }
});

//___________________**********_____*****_____ DELETE ЗАПРОСЫ _____*****_____**********____________________\\

//ДОБАВЛЯЕМ НОВОГО ПОЛЬЗОВАТЕЛЯ В БД
router.post('/addData',
    [
        body('name').trim().notEmpty().isLength({ min: 3, max: 10 }).escape(),
        body('age').trim().notEmpty().isNumeric().isLength({ min: 1, max: 2 }).escape()
    ],
    async (req, res) => {

        const result = validationResult(req); //Получаем результат валидации
        //Извлекаем объект из body
        if (!req.body) {
            res.sendStatus(400);
        } else {
            //Проверяем результ валидации
            if (!result.isEmpty()) {
                const tmp = result.array();
                return res.send(tmp);
            }
            const newUser = {
                name: req.body.name,
                age: req.body.age
            }
            console.log('ROUTER.ADDDATA: ', newUser);
            const myDb = req.app.locals.MyDb;
            let user = null;
            try {
                tmp = await myDb.getOneDocument(newUser);
                console.log('TMP: ', tmp);
                if (tmp) {
                    console.log('Пользователь существует');
                    return res.json({ message: 'Такой пользователь уже существует' });
                }
                user = await myDb.saveOneDataToCollection(newUser);
                res.send(user);
            } catch (error) {
                console.log(error);
                res.sendStatus(500); //Ошибка при работе с БД
            }
        }
    });

//РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ
router.post('/registration',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({ min: 6, max: 9 })
    ],
    async (req, res) => {

        const result = validationResult(req); //Получаем результат валидации
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
                message: 'Некорректные данные при регистрации'
            });
        }
        //Записываем нового пользователя в Базу Данных
        const { email, password } = req.body;
        console.log('ROUTER.REGISTRATION: ', email);
        const myDb = req.app.locals.MyDb;
        try {
            await myDb.changeCollection(COLLECTION); //Коллекция info в БД turists
            tmp = await myDb.getOneDocument({ email }); //Проверяем незарегистрирован ли этот email
            console.log('TMP: ', tmp);
            if (tmp) {
                console.log('Пользователь существует');
                return res.json({ message: 'Такой пользователь уже существует' });
            }
            //Записываем пользователя в Базу Данных
            //Хешируем пароль с помощью библиотеки bcrypt
            const newPassword = await bcrypt.hash(password, 11);
            user = await myDb.saveOneDataToCollection({ email, password: newPassword });
            res.status(201).json({ message: 'Поздравляем! Пользователь зарегистрирован' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Регистрация не завершилась' }); //Ошибка при работе с БД
        }
    });

//АУТЕНТИФИКАЦИЯ (АВТОРИЗАЦИЯ) ЗАРЕГИСТРИРОВАННОГО ПОЛЬЗОВАТЕЛЯ
router.post('/login',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({ min: 6, max: 9 })
    ],
    async (req, res) => {

        const result = validationResult(req); //Получаем результат валидации
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
                message: 'Некорректные данные при входе в систему'
            });
        }
        //Считываем данные пользователя из Базы Данных
        const { email, password } = req.body;
        console.log('ROUTER.LOGIN: ', email);
        const myDb = req.app.locals.MyDb;
        let user = null;
        try {
            await myDb.changeCollection(COLLECTION); //Коллекция info в БД turists
            tmp = await myDb.getOneDocument({ email }); //Проверяем незарегистрирован ли этот email
            console.log('TMP: ', tmp);
            if (!tmp) {
                console.log('Пользователь не найден');
                return res.status(400).json({ message: 'Такой пользователь не найден' });
            }
            //Проверяем правильность пароля
            //Сравниваем введеный пароль и считаный из Базы Данных с помощью библиотеки bcrypt
            const isMatch = await bcrypt.compare(password, tmp.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }
            //Формируем токен с помощью библиотеки jsonwebtoken
            const SECRETKEY = config.get('tokenKey');
            const token = jwt.sign(
                {
                    id: tmp._id
                },
                SECRETKEY,
                {
                    expiresIn: '1h'
                }
            )
            res.status(201).json({ token, userId: tmp._id, login: tmp.email, message: `Hello user: ${tmp.email}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Аутентификация не прошла' }); //Ошибка при работе с БД
        }
    });

//ОТПРАВКА СООБЩЕНИЯ
router.post('/sendMessage', auth,
    [
        check('message', 'Сообщение пустое').trim().notEmpty().escape()
    ],
    async (req, res) => {

        console.log('!!!!!!!', req.body);
        const result = validationResult(req); //Получаем результат валидации
        if (!req.body) {
            res.sendStatus(400);
        } else {
            //Проверяем результ валидации
            if (!result.isEmpty()) {
                const tmp = result.array();
                return res.send(tmp);
            }
            const myDb = req.app.locals.MyDb;
            try {

                await myDb.changeCollection('messages'); //Коллекция messages в БД turists
                console.log('!!!! ', myDb.collectionName);
                const msg = await myDb.saveOneDataToCollection(req.body);
                console.log('MSG ', msg);
                res.status(201).json(msg);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Сообщение не прошло' });
            }
        }

    });

//PUT запросы
//ИЗМЕНЯЕМ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ В БД
router.put('/changeData',
    [
        body('name').trim().notEmpty().isLength({ min: 3, max: 10 }).escape(),
        body('age').trim().notEmpty().isNumeric().isLength({ min: 1, max: 2 }).escape()
    ],
    async (req, res) => {

        const result = validationResult(req); //Получаем результат валидации
        //Извлекаем объект из body
        if (!req.body) {
            res.sendStatus(400);
        } else {
            //Проверяем результ валидации
            if (!result.isEmpty()) {
                const tmp = result.array();
                return res.send(tmp);
            }
            const changeUser = {
                name: req.body.name,
                age: req.body.age
            }
            if (req.body.frends) {
                newUserData.frends = req.body.frends;
            }
            console.log('ROUTER.CHANGEDATA: ', changeUser);
            const myDb = req.app.locals.MyDb;
            let user = null;
            try {
                user = await myDb.updateDataOne({ name: req.body.name }, changeUser);
                res.send(user);
            } catch (error) {
                console.log(error);
                res.sendStatus(500); //Ошибка при работе с БД
            }
        }
    });

//DELETE запросы
//УДАЛЯЕМ ПОЛЬЗОВАТЕЛЯ ИЗ БД
router.delete('/deleteData', async (req, res) => {

    console.log('ROUTER.DELETEDATA: ');
    const myDb = req.app.locals.MyDb;
    try {
        const user = await myDb.deleteOneDocument({ name: 'Hamlet' });
        res.send(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500); //Ошибка при работе с БД
    }

});

module.exports = router;