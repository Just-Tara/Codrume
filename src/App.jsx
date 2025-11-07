import { useState } from "react";
import Header from "./Component/Header";

function App(params) {
   const [isDark, setIsDark] = useState(true);
   return(
      <>
         <div className={`${isDark ? 'dark' : ''} h-screen flex flex-col`}>
             <Header/>
         </div>
      </>
   )
}
export default App;