import React ,{useEffect,useRef,useState} from 'react'
import myfunc from '../components';
import {Form}  from '../components';
import { postAPI } from '../components';
import Newsidebar from '../components/newsidebar';

function testingpage() {


let myvar = 'this is a variable'

  return (
        <h1>This is a new testing page {myvar}</h1>
  )
}
export default testingpage