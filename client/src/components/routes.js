import React from 'react';
import { lazy } from 'react';
import { Routes, Route/* , useParams */ } from 'react-router-dom';
import LayOut from './layOut';

const HomePage = lazy(() => import('./homePage'));  //Компонент загрузится, только если к нему будет обращение
const Err = lazy(() => import('./error'));  //Компонент загрузится, только если к нему будет обращение
const PlansList = lazy(() => import('./PlansList'));  //Компонент загрузится, только если к нему будет обращение
const Plan = lazy(() => import('./Plan'));  //Компонент загрузится, только если к нему будет обращение
const PostponedList = lazy(() => import('./postponedList'));  //Компонент загрузится, только если к нему будет обращение
const OnePostoponedPlan = lazy(() => import('./OnePostoponedPlan'));  //Компонент загрузится, только если к нему будет обращение
const SaveDb = lazy(() => import('./saveDb'));  //Компонент загрузится, только если к нему будет обращение
const ArchiveFiles = lazy(() => import('./ArchiveFiles'));  //Компонент загрузится, только если к нему будет обращение
const LoginForm = lazy(() => import('./LoginForm'));  //Компонент загрузится, только если к нему будет обращение

export default function UseRoutes(isAuth) {

    console.log('ROUTES!!!: ', isAuth);
    // const param = useParams();
    // let id = param.id
    // console.log('IDIDIDID: ', id);

    if (!!isAuth) {

        return (
            <div>
                <Routes>
                    <Route path='/' element={<LayOut isAuth={!!isAuth} />} >

                        <Route index element={<HomePage />} />
                        <Route path='/homePage' element={<HomePage />} />
                        <Route path='/PlansList' element={<PlansList />} />
                        <Route path='/PlansList/:index' element={<Plan /* lastPage={'/PlanList'} */ />} />
                        <Route path='/PostponedList' element={<PostponedList />} />
                        <Route path='/PostponedList/:index' element={<OnePostoponedPlan /* lastPage={'/PlanList'} */ />} />
                        <Route path='/SaveDb' element={<SaveDb />} />
                        <Route path='/ArchiveFiles' element={<ArchiveFiles />} />
                        <Route path='/LoginForm' element={<LoginForm />} />
                        <Route path='*' element={<Err />} />

                    </Route>
                </Routes>
            </div>
        )
    };

    return (
        <div>
            <Routes>
                <Route path='/' element={<LayOut isAuth={!!isAuth} />} >

                    <Route index element={<HomePage />} />
                    <Route path='*' element={<HomePage />} />

                </Route>
            </Routes>
        </div>
    )
};