import React from 'react';
import Forms from './forms';

export default function AuthElement() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>MERN FORM</h1>
                {<div>
                    <Forms />
                </div>}
            </header>
        </div>
    )
}