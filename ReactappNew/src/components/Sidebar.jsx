import {NavLink,Link} from 'react-router-dom';
import React,{useState , useRef, useEffect} from 'react'
import {RiHomeFill} from 'react-icons/ri';
import {IoIoArrowForward} from 'react-icons/io';
import logo from '../assets/logo.png'


const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize'
const categories = [
  { name: 'Animals'},
  { name: 'Wallpapers'},
  { name: 'Photography'},
  { name: 'Gaming'},{ name: 'Coding'}, { name: 'Other'}
]




const Sidebar = ({user,closeTaggle}) => {
  const [ToggleSidebar, setToggleSidebar] = useState(false)

  const handleCloseSidebar = () => {
    if(closeTaggle) closeTaggle(false);
    console.log(closeTaggle)
  }

  const closeSidebar =() =>
  {
    setToggleSidebar(false)
    console.log(ToggleSidebar)
    console.log(closeTaggle)
  }


  return (
    <div className = "flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className = "flex flex-col">
        <Link to="/" className = "flex px-5 gap-2 my-6 pt-1 w-190 items-center" onClick={closeSidebar}>
          <img src={logo} alt = "logo" className = "w-full"/>
        </Link>
        <div className = "flex flex-col gap-5">
          <NavLink to="/" className = {
            ({isActive}) => isActive ? isActiveStyle : isNotActiveStyle
          } 
          onClick = {() => setToggleSidebar(false)}
          
          >

            <RiHomeFill /> Home
          </NavLink>

          <h3 className ="mt-2 px-5 text-base 2xl:text-xl">Discover categories</h3>
          {   // This start generating the NavLink from the array 
            categories.slice(0,categories.length -1).map( (category) => (
              <NavLink
                 to = {`/category/${category.name}`}
                 className = {
                  ({isActive}) => isActive ? isActiveStyle : isNotActiveStyle
                } 
                //onClick={handleCloseSidebar}
                onClick = {() => setToggleSidebar(false)}
              >
                {category.name}
              </NavLink>
            )

          ) // This End the NavLink Generation 
          } 

            <NavLink
                 to = '/blankpage'
                 className = {
                  ({isActive}) => isActive ? isActiveStyle : isNotActiveStyle
                } 
                //onClick={handleCloseSidebar}
                onClick = {handleCloseSidebar}
              >
                BlankPage
              </NavLink>
              <NavLink
                 to = '/testingpage'
                 className = {
                  ({isActive}) => isActive ? isActiveStyle : isNotActiveStyle
                } 
                //onClick={handleCloseSidebar}
                onClick = {handleCloseSidebar}
              >
                testingpage
              </NavLink>

        </div>

      </div>

      {user && (
        <Link to={`user-profile/${user?._id}`}  className ="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3" >
          <img src = {user.image} className = "w-10 h-10 rounded-full" alt ="user-profile" />
          <p>{user.userName}</p>
        </Link>
      )}
    
    </div>
  )
}

export default Sidebar