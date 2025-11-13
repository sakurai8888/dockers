import React from 'react'
import {Routes,Route,useNavigate} from 'react-router-dom'
import Login from './components/Login';
import Home from './container/Home';
import BlankPage from './container/BlankPage'
import Newsidebar from './components/newsidebar';
import BlankPage2 from './container/BlankPage2';
import Myform from './components/myform';
import Testingpage from './container/testingpage';

const App = () => {
  return (

    <div className='flex'>
      <Newsidebar/>
      <div className= 'bg-gray-900 h-screen w-screen items-center'>

    
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="blankpage" element={<BlankPage />} />
      <Route path="blankpage2" element={<BlankPage2 />} />
      <Route path="testingpage" element={<Testingpage />} />
      <Route path="myform" element={<Myform/>} />
      <Route path="/*" element={<Home />} />
    </Routes>
    </div>
    </div>  

  )
}


export default App