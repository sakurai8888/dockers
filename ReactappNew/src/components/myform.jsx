import React from 'react'
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { postReactFormAPI } from '../components'
import { array, date, number, string } from 'yup'
import {useEffect} from 'react'

// css variable 

let renderCount = 0

let FormValues = {
  username: '',
  email: '',
  channel: '',
  social: {
    twitter: '',
    facebook: ''
  },
  phoneNumbers: array,
  phNumbers: {
    number: array 
  },
  age: number,
  dob: date
};

const Myform = () => {
{/*  Using hardcode values
  const form = useForm({
    defaultValues: {
      username: "batman2",
      email: "",
      channel:""
    }
  });
*/}

  const form = useForm({
    defaultValues: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/2")
      const responsedata = await response.json()
      console.log(response.status)
      return {
        username: "Sakurai",
        email: responsedata.email,
        channel: "defaultChannel",
        social : {
          twitter: "defaultTwitter",
          facebook: "defaultfacebook",
          microsoft:"defaultMicrosoft"
        },
        phoneNumbers: [],
        phNumbers:[ {number :""}],
        age: 0,
        dob: "1984-02-09"   // yyyy-mm-dd
      }
  
    }
  });
  

  const { register, control, handleSubmit, formState, watch ,getValues,setValue} = form;
  const { errors } = formState;

  const {fields, append, remove} = useFieldArray({
    name: 'phNumbers',
    control
  })



  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted', data)
    const myapiresponse = postReactFormAPI(JSON.stringify(data))
    console.log(myapiresponse)
  }


  const onError = (errors: FieldErrors<FormValues>) =>{
    console.log("Form errors", errors)

  }

  const handleGetValues = ()  => {
    console.log("Get values", getValues("social"))

  }

  const handleSetValues = ()  => {
    setValue("username","",{shouldDirty: true, shouldTouch: true, shouldValidate: true})

  }

  renderCount++

  const watchUsername = watch("username")


  // This will make the console LOG every key-in action of the form. 
  useEffect( () => {
    const subscription = watch ( (value2) => {
      console.log(value2)
    }

    )
    return () => subscription.unsubscribe();
  }, [watch]

  )


  return (
    <div className='bg-gray-900 flex flex-col h-screen items-center pl-5 pt-10 font-serif text-xl text-green-100'>
      <h1 className="align-middle text-white items-center">MyForm ({renderCount / 2})</h1>
      <h2 className='text-yellow-100'>watch value : {watchUsername}</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        {/* UserName */}
        <div className='pt-10 border-white items-center'>
          <label htmlFor='uername'>Username  :</label>
          <input className='my-input' type='text' id='username'  {...register("username", { required: "Username is required!!!" })} />     {/* my-input is defined at the index.css */}
        </div>
        <p className='input-error'>{errors.username?.message} </p>

        {/* Email */}
        <div className='pt-10'>
          <label htmlFor='email'>E-mail  :</label>
          <input className='my-input' type='email' id='email'  
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&*+/+?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "Invalid email format"
            },
            validate: {
              notAdmin: (emailValue22) => {
                {/*  emailValue can be another customer variable */ }
                return (
                  emailValue22 !== "admin@example.com" || "Enter a different email address"
                )
              },
              notBlackListed: (emailValue33) => {
                return !emailValue33.endsWith("baddomain.com") || "This domain is not supported"
              }

            }
          }
          )
          } />
        </div>
        <p className='input-error'>{errors.email?.message} </p>


        {/* Channel */}
        <div className='pt-10'>
          <label htmlFor='channel'>Channel  :</label>
          <input className='my-input' type='text' id='channel'  {...register("channel", { required: "Channel is required" })} />
        </div>
        <p className='input-error'>{errors.channel?.message} </p>




         {/* htmlFor , id  can be another name for ..register(social.facebook )     register(social.facebook) must align to the same structure of the FormValues*/}
        <div className='pt-10'>
          <label htmlFor='twitter'>Twitter  :</label>
          <input className='my-input' type='text' id='twitter'  {...register("social.twitter",{disabled:watch("channel") ==="" }, { required: "Twitter is required" })} />
        </div>

        <div className='pt-10'>
          <label htmlFor='facebook_anothername'>Facebook  :</label>
          <input className='my-input' type='text' id='facebook_anothername2'  {...register("social.facebook", { required: "Facebook is required" })} />
        </div>

        <div className='pt-10'>
          <label htmlFor='microsoft_'>Microsoft  :</label>
          <input className='my-input' type='text' id='microsoft__'  {...register("social.microsoft", { required: "microsoft account is required" })} />
        </div>


           {/* Phone Numbers with hardcode number of fields */} 
        <div className='pt-10'>
          <label htmlFor='primary-phone'>Primary Phone Number  :</label>
          <input className='my-input' type='text' id='primary-phone'  {...register("phoneNumbers.0", { required: "Primary Phone Number is required" })} />
        </div>

        <div className='pt-10'>
          <label htmlFor='secondary-phone'>Secondary Phone Number  :</label>
          <input className='my-input' type='text' id='secondary-phone'  {...register("phoneNumbers.1", { required: "Secondary Phone Number is required" })} />
        </div>

         {/* Phone Numbers array with Add and remove button */} 
        <div className='pt-10'>
          <label>List of phone numbers:</label>
          <div className='pt-5'>
            {
              fields.map( (field,index) => {
                return (
                <div className = "form-control,pt-10" key =  {field.id}>
                  <input className='my-input' type="text" {...register(`phNumbers.${index}.number`)} />
                {
                  index > 0 && (
                    <button type="button" onClick={ () => remove(index)}>Remove</button>
                  )
                }
                </div>
                )
              }

              )
            }
            <button type="button" onClick={ () => append({ number: ""})}>Add phone number</button>
          </div>


        </div>
        
        {/* AGE */}
        <div className='pt-10'>
          <label htmlFor='age'>Age  :</label>
          <input className='my-input' type='number' id='age'  {...register("age", { valueAsNumber:true, required: "Age is required" })} />
        </div>
        <p className='input-error'>{errors.age?.message} </p>
        
        {/* Date of birth */}
        <div className='pt-10'>
          <label htmlFor='dob'>Date of birth  :</label>
          <input className='my-input' type='date' id='dob'  {...register("dob", { valueAsDate:true, required: "Date of birth is required" })} />
        </div>
        <p className='input-error'>{errors.dob?.message} </p>


        {/* Submit Button */}
        <div className='pt-10 items-center  align-middle'>
          <button>Submit</button>
          <button type="button" onClick={handleGetValues}>Get Values</button>

          <button type="button" onClick={handleSetValues}>Set Values</button>
        </div>


        <DevTool control={control} />
      </form>
    </div>
  )
}

export default Myform