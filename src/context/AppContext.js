import { createContext, useState, useContext, useMemo } from 'react';

export default AppContext = createContext({
    curUsername: "",
    setCurUsername: () =>{},
    token: "",
    setToken: () => {}
});