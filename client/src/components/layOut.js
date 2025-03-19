import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import NavBarInCooker from './NavBarInCooker';
import Loader from '../ul/Loader';
// import { useAuth } from '../myHooks/useAuth';
// import NavBar from './navBar';

export default function LayOut(props) {

    // const { token } = useAuth();
    // const isAuth = (token) ? true : false;
    // console.log('isAuth######', token);

    return (
        <div className='wrapper_all_page'>

            <div className='wrapper_main'>
                <div className='wrapper_navbar'>
                    {props.isAuth && <NavBarInCooker />}
                </div>

                <main>
                    <Suspense fallback={<Loader />}>
                        <Outlet />      {/* Определяем место для динамической части странички */}
                    </Suspense>
                </main>
            </div>

            <footer className='wrapper_footer'>

            </footer>

        </div>
    )
}
