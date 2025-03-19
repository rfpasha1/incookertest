//Маршруты для валидации Данных

const { Router } = require('express');
const { query, body, validationResult } = require('express-validator');
const router = Router();

//Добавляем маршруты роутеру

//GET запросы
//Проверяем объект query GET запроса
router.get('/query', query('login').trim().notEmpty().isLength({ min: 3, max: 18 }).escape(), (req, res) => {

    console.log('/validator/query');
    //Получаем результат валидации
    const result = validationResult(req);
    //Проверяем результ валидации
    if (result.isEmpty()) {
        return res.send([{ 'login': req.query.login }]);
    }
    const tmp = result.array();
    // const message = [];
    // if (tmp[0].msg = 'Invalid value') {
    //     message.push({ msg: 'login не должен быть пустым' });
    // }
    res.send(tmp);
});

//POST запросы
//Добавляем нового пользователя в БД
router.post('/body',
    [
        body('email').isEmail().escape(),
        body('password').notEmpty()
    ],
    (req, res) => {

        console.log('/validator/body');
        const result = validationResult(req);
        //Извлекаем объект из body
        if (result.isEmpty()) {
            const newUser = [{
                email: req.body.email,
                password: req.body.password
            }]

            return res.send(newUser);
        }
        const tmp = result.array();
        return res.send(tmp);
    });

//PUT запросы
//Изменяем данные пользователя в БД
router.put('/changeData', async (req, res) => {

    //Извлекаем объект из body
    if (!req.body) {
        res.sendStatus(400);
    } else {
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
            /* const myUser = {
                name: 'Hamlet',
                age: 55
            } */
            user = await myDb.updateDataOne({ name: req.body.name }, changeUser);
            res.send(user);
        } catch (error) {
            console.log(error);
            res.sendStatus(500); //Ошибка при работе с БД
        }
    }
});

//DELETE запросы
//Удаляем пользователя с БД
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