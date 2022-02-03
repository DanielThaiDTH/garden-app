import { createContext, useState, useContext, useMemo } from 'react';
import Account from "./Account";

export default AppContext = createContext({
    curUsername: "",
    setCurUsername: () =>{},
    token: "",
    setToken: () => {},
    account: new Account(),
    setAccount: () => {},
    location: null,
    setLocation: () => {}
});