// Login Page for google 


import React from 'react'
//import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import {client} from '../client';


const Login = () => {
  
  const navigate = useNavigate();

  const myGoogleclientId = "68984013892-e3o5t1nt3rojofq5odbhbh4t6vu7gbqj.apps.googleusercontent.com"
  const GetResponseGoogleSuccess = (credentialResponse) => {
    //console.log(response)
    //console.log(credentialResponse.credential)
    //console.log(credentialResponse.clientId)
    //console.log(jwtDecode(response.credenti))
    //console.log(jwtDecode(credentialResponse.credential))

    const decodedjwt = jwtDecode(credentialResponse.credential)
    console.log(decodedjwt)
    localStorage.setItem('user',JSON.stringify(decodedjwt))

    const { name ,sub, picture}  = decodedjwt

    const doc = {
      _id: sub,
      _type:'user',
      userName: name,
      image: picture
    }


    console.log(doc)

    // if successful login , Redirect back to the home page 
    client.createIfNotExists(doc).then( () => {
      navigate('/' , {replace : true })
    }

    )

  }

  const GetResponseGoogleFailure = (credentialResponse) => {
    //console.log(response)
    //console.log(credentialResponse.credential)
    //console.log(credentialResponse.clientId)
    //console.log(jwtDecode(response.credenti))
    //console.log(jwtDecode(credentialResponse.credential))
    console.log(credentialResponse)

  }


 


  return (
    
    <div className = "flex justify-start items-center flex-col h-screen">Login
    
      <div className = "relative w-full h-full">
        <video 
          src = {shareVideo}
          type="video/mp4"
          loopcontrol={false}
          loop
          muted
          autoPlay 
          className = "object-cover w-full h-full"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          
          <div className = "p-5" >
            <img src={logo} width ="130px" alt="logo" />
          </div>
          <div className="shadow-2x1">
          </div>

          <div className="shadow-2x1">
          <GoogleOAuthProvider clientId={myGoogleclientId}>     
           <GoogleLogin
            onSuccess={GetResponseGoogleSuccess}
            onError={GetResponseGoogleFailure}
            type = 'standard'
            text = 'signin_with'
            />
          </GoogleOAuthProvider>
          
          </div>
          
         
    
     
         


        </div>
     
      </div>
    

    </div>

  )
}

export default Login