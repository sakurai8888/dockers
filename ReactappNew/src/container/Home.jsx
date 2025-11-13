
import React,{useState , useRef, useEffect} from 'react'
import {HiMenu} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {Link, Route,Routes} from 'react-router-dom'
import {Sidebar,UerProfile} from '../components'
import Pins from './Pins'
import Animals from './Animals'
import Slugdemo from '../components/slugdemo'
import { client } from '../client'
import logo from '../assets/logo.png'
import { userQuery } from '../utils/data'
import MyNewPage from '../container/MyNewPage'
import { Testing } from '../components/slugdemo'


const Home = () => {
  const [ToggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const userInfo = localStorage.getItem('user') !=='undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
  const scrollRef = useRef(null)
  useEffect(() => {
    const query = userQuery(userInfo?.sub)
    client.fetch(query).then((data) => {
        setUser(data[0])
      })
  },[])

  useEffect(() => {
    scrollRef.current.scrollTo(0,0)  // Scroll to top of the page  d
  
  },[])

  
  console.log(user)

  return (
    <div className = "flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duraction-75 ease-out">
      <div className = "hidden md:flex h-screen flex-initial">
        <Sidebar user = {user && user}/>
        
      </div>
      <div className = "flex md:hidden flex-row">

        <div className = "p-2 w-full flex flex-row justify-between items-center shadow-md">
        <HiMenu fontSize={40} className ="cursor-pointer" onClick = {() => setToggleSidebar(true)} />
        <Link to = "/">
          <img src = {logo} alt = "logo" className = "w-28"/>
        </Link>
        
        <Link to={`user-profile/${user?._id}`}>
       {/*  {user?.userName}*/}
          <img src = {user?.image} alt = "logo" className = "w-28"/>
        </Link>

        </div>

        {ToggleSidebar && (
        <div className= "fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
          <div className = "absolute w-full flex justify-end items-center p-2">
            <AiFillCloseCircle fontSize={30} className="cursor-point" onClick={() => setToggleSidebar(false)} />
          </div>
          <Sidebar user = {user && user} closeToggle = {setToggleSidebar}/>  {/*  Desktop SideBar */}
        </div>
      )}
      </div>
      <div className ="pb-2 flex-1 h-screen overflow-y-scroll" ref = {scrollRef} >
        <Routes>
          <Route path = "user-profile/:userId" element={<UerProfile />}/>
          <Route path = "/category/Animals" element={<Animals />}/>
          <Route path = "/testslug/:id/:hash" element={<Slugdemo />}/>
          <Route path = "/mynewpage" element={<MyNewPage />}/>
          <Route path = "/*" element={<Pins user={user && user}/>}/>
        </Routes>

      </div>
    </div>
  )
}

export default Home