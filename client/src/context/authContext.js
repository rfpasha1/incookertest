import { createContext } from "react";

function nullF() { };

export const AuthContext = createContext(
    {
        token: null,
        userId: null,
        getLogin: nullF,
        logout: nullF,
        isAuth: false
    }
);