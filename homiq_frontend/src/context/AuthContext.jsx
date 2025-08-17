import { createContext, useEffect, useState } from "react";

// samjo ki AuthContext ek dabba hai aur usme jo bhi content hoga wo tum har component me use kr paoge bina prop drilling ke in each and evry child
export const AuthContext = createContext();

// ye ek wrapper component hai jo ham pure app ko cover krne k lie use krege 
export const AuthContextProvider = ({children}) => {

    // ye data har ek component me jana chahie - userInfo
    // lazy initialization way of using useState
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    });

    // jab bhi user data change hoga in login, logout to ye bhi update hoga aur iske through badme useffect se fir localStorage me sam changes sync hoge
    const updateUser = (data) => {
        setCurrentUser(data);
    }

    // jab bhi user chnage hoga to hame update kr dena hai 
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    // provider ke andar wale components ko currentUser ka data mil jaayega aur updateUser function ka bhi access mil jaega 
    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}