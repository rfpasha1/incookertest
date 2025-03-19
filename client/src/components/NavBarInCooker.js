//  Навигационная панель для Главной страницы АДАПТИВНАЯ

import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BiMenu } from "react-icons/bi";
import { BiX } from "react-icons/bi";

function NavBarInCooker() {

    const [flag, setFlag] = useState(true);  //Состояние Иконки для бургер Меню

    //Добавляем навигационной панели (navBar) класс nav_active и меняем состояне иконки для бургер Меню
    const changeIcon = useCallback(() => {
        let navBar = document.querySelector('.nav_bar_incooker');
        navBar.classList.toggle('nav_active');
        setFlag(!flag);
    }, [flag]);

    return (
        <section className='section_logo_nav'>
            <a href='https://incooker.com' target="_blank" rel="noopener noreferrer" title='На сайт incooker' className='a_logo'>
                <img id='logo' src={`${process.env.PUBLIC_URL}/img/logoInCooker.JPG`} alt='logo' />
            </a>
            <nav className='nav_bar_incooker'>
                <ul className='ul_nav_bar_incooker'>
                    <li className='li_nav_bar_incooker' /* onClick={changeIcon} */>
                        <NavLink to='/homePage'>Главная</NavLink>
                    </li>

                    <li className='li_nav_bar_incooker' /* onClick={changeIcon} */>
                        <NavLink to='/PlansList'>Планы</NavLink>
                    </li>

                    <li className='li_nav_bar_incooker' /* onClick={changeIcon} */>
                        <NavLink to='/PostponedList'>Отложенные планы</NavLink>
                    </li>

                    <li className='li_nav_bar_incooker' /* onClick={changeIcon} */>
                        <NavLink to='/SaveDb' >Архивировать</NavLink>
                    </li>

                    <li className='li_nav_bar_incooker' /* onClick={changeIcon} */>
                        <NavLink to='/ArchiveFiles' >Выход</NavLink>
                    </li>

                    {/* <li className='li_nav_bar_incooker'>
                        <NavLink to='/LoginForm'>Форма</NavLink>
                    </li> */}

                </ul>
            </nav>
            <div className='icons_div'>
                {/*В зависимости от состояния flag паоказывыаем соответствующую иконку для бургер Меню */}
                {(flag) ?
                    (<BiMenu className='nav_bar_icon' onClick={changeIcon} />) :
                    (<BiX className='nav_bar_icon' onClick={changeIcon} />)};
            </div>
        </section>
    )
}

export default React.memo(NavBarInCooker);