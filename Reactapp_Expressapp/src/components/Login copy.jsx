import React from 'react'
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin2 } from '@react-oauth/google';


const Login = () => {

  const responseGoogle = (response) => {
    console.log(response)

  }


  return (
    
    <div className = "flex justify-start items-center flex-col h-screen">Login
    <GoogleOAuthProvider clientId="68984013892-e3o5t1nt3rojofq5odbhbh4t6vu7gbqj.apps.googleusercontent.com"></GoogleOAuthProvider>
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
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={ (renderProps) => (
                <button 
                  type="button" 
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick = {renderProps.onClick}
                  disabled = {renderProps.disabled}
                  >

                  <FcGoogle className="mr-4 " /> Sign in with Button   

                </button>
              )

              }

              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"

            />

          </div>

          <div className="shadow-2x1">Another button</div>
          <GoogleLogin2
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>

         


        </div>
     
      </div>
    

    </div>

  )
}

export default Login