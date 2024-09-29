import { createContext, useState } from "react";

 export const themeMode = createContext({
    currentTheme: "",
    setCurrentTheme: () => { },
    theme: {
        light: {
            dataTheme: ""
        },
        dark: {
            dataTheme: ""
        }
    }
})

export default function ThemeProvider ( {children}){
    const [currentTheme, setCurrentTheme] = useState("light")

    return (
        <themeMode.Provider value={{
            currentTheme,
            setCurrentTheme,
            theme: {
                light: {
                    dataTheme: "light"
                },
                dark: {
                    dataTheme: "dark"
                }
            }
        }}>
            {children}
        </themeMode.Provider>
    )
}