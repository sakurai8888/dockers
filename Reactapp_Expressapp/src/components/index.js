
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export {default as Sidebar} from './Sidebar'
export {default as Login} from './Login'
export {default as UerProfile} from './UserProfile'


const myfunc = () => {
  console.log('This is a function from a index.js export')
}


export default myfunc



// Declare a form 


const postAPI = (apidata) =>{
  const url = "http://localhost:3001/newtestapi/form";
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: apidata
    //body: JSON.stringify({ title: 'Fetch POST Request Example' })
};
fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => console.log(data.id) );


}




export const Form = () => {

  const schema  = yup.object().shape({
    fullName: yup.string().required(),
    email:yup.string().email().required(),
    age: yup.number().positive().integer().min(18).required(),
    password: yup.string().min(4).max(20).required(),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null]).required()

  })

  const {register,handleSubmit} = useForm();


  const onSubmit = (data) =>
  {
    console.log (data)
    //console.log(JSON.stringify(data))
    postAPI(JSON.stringify(data))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="Full Name...." {...register("fullName")}></input>
      <input type="text" placeholder='Email' {...register("email")}></input>
      <input type="text" placeholder='Age...'  {...register("age")}></input>
      <input type="password" placeholder='Password'  {...register("password")}></input>
      <input type="password" placeholder='Confirm Password' {...register("confirmPassword")}></input>
      <input type="submit" />
    </form>


  )


}



export const postReactFormAPI = (apidata) =>{
  let saveresponse = ''
  const url = "http://localhost:3001/newtestapi/form";
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: apidata
    //body: JSON.stringify({ title: 'Fetch POST Request Example' })
};
return fetch(url, requestOptions)
    .then(response =>response.text())           // Get text response , the message is customize at express backend function
    .then( (response) => {console.log(response)})  // ONLY console.log
    //.then(data => console.log(data.id) );

return saveresponse


}

