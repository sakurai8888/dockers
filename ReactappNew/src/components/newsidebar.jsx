import React, { useState ,useRef,useEffect} from 'react'
import logo from '../assets/roundarrow.png'
import logo2 from '../assets/roundarrow2.jpg'
import sitelogo from '../assets/favicon.png'
import { NavLink } from 'react-router-dom'
import {Routes,Route,useNavigate} from 'react-router-dom'
import { client } from '../client'
import { userQuery } from '../utils/data'
import image01 from '../assets/menuicon/01.png'

const Newsidebar = () => {

  const [open,setOpen] = useState(true)
  const [user, setUser] = useState(null)
  const userInfo = localStorage.getItem('user') !=='undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
  const scrollRef = useRef(null)
  useEffect(() => {
    const query = userQuery(userInfo?.sub)
    client.fetch(query).then((data) => {
        setUser(data[0])
      })
  },[])


  const [menuAcitive,setmenuAcitive] = useState(false)

  const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
  const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize'

  const  menu01 = document.getElementById('menu01') 
  const  menu02 = document.getElementById('menu02') 


  const arrayMenuIcon = [menu01,menu02]




  const changeMenuActive = (e) => {
    
    const  menuid = document.getElementById(e.target.id) 
    
    const disablearrayManuIcon = arrayMenuIcon.filter( icon => {
      return (icon != menuid)
    })
    


    setmenuAcitive(!menuAcitive)
    if (menuAcitive) {
      menuid.className=isActiveStyle
      
    } else {
      menuid.className=isNotActiveStyle
      
    }

    disablearrayManuIcon.map( (disableIcon) =>{
      disableIcon.className=isNotActiveStyle
    }) 


   

    
  }
 


  const genSideMenu= ()=>{
    return (
      <div className = "flex flex-col">
        <div className="flex pt-10 row-auto">
          <NavLink to="/blankpage" className = {({isActive}) => isActive ? isActiveStyle : isNotActiveStyle}> <img src={image01} alt='01'/>Link1</NavLink>
        </div>
        <div className="flex pt-10">
        <NavLink to="/blankpage2" className = {({isActive}) => isActive ? isActiveStyle : isNotActiveStyle}> <img src={image01} alt='01'/>Link2</NavLink>
        </div>
        <div className="flex pt-10">
        <NavLink to="/myform" className = {({isActive}) => isActive ? isActiveStyle : isNotActiveStyle}> <img src={image01} alt='01'/>myform</NavLink>
        </div>
      </div>
      
    )
  }

  const myhtml= genSideMenu()


  return (
    <div className="flex">
      <div className = {`${open ? "w-72" : "w-20"} h-screen p-5 pt-8 bg-dark-purple relative duration-300`}>
      <img 
        src = {logo} 
        alt = "logo" 
        className = {`w-5  cursor-pointer -right-3 top-9 border-dark-purple absolute rounded-full ${!open && "rotate-180"}`}
        onClick = {() => setOpen(!open)}/>
      <div className = "flex gap-x-4 items-center">
        <img src={sitelogo} alt = "SiteLogo" className = {`w-10 cursor-pointer duration-500`}/>
        <h1 className = {`text-white origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Designer</h1>
      </div>
      <div>
        <NavLink to={user?._id}>{user?.userName}</NavLink>
      </div>

      {myhtml}

  
     

     

      </div>

      

     

 
   
    </div>
  )
}

export default Newsidebar