import React from 'react';

export default function LoginForm() {

    return (
        <div className="container-fluid">

            <div className="col-md-4 offset-md-4">
                <div className="form-icon">
                    <img id='logo_form' src={`${process.env.PUBLIC_URL}/img/logoInCooker.JPG`} alt='logo' />
                </div>

                <div className="form-container">
                    <h3 className="title">Login</h3>

                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="label-form">login</label>
                            <input className="form-control" type="login" placeholder="login" required="required" />
                        </div>
                        <div className="form-group">
                            <label className="label-form">password</label>
                            <input className="form-control" type="password" placeholder="password" required="required" />
                        </div>
                        <button type="button" className="btn btn-default">Вход</button>
                    </form>

                </div>
            </div>

        </div>
    )
}
