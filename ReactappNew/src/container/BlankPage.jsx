import React ,{useEffect,useRef,useState} from 'react'
import myfunc from '../components';
import {Form}  from '../components';
import { postAPI } from '../components';
import Newsidebar from '../components/newsidebar';

function BlankPage() {


  //postAPI()
    myfunc ()
    let myarray = ['hardcodeArrayItem1','hardcodeArrayItem2','hardcodeArrayItem3']
    //let myhtml = ''
    let htmllist = [];
    let flexlist = [];
    

    const myRef = useRef(null)

    const myflexRef = useRef(null)

    myarray.forEach ((each) =>{
      console.log(each)
      //document.getElementById('div2').innerHTML += `<h1>${each}</h1>`
      htmllist.push(<h1>{each}</h1>)
      flexlist.push(<div class='flex'><h1>{each}</h1></div>)

    } )

    useEffect(() => {
      let myinput2 = document.getElementById("inputId01")
      let myflexid = document.getElementById("myflexid")
      let outputflex = ''
      if (myinput2) {
        myinput2.addEventListener("keydown", (e) => {
          console.log(e)
          const charCode = e.keyCode;
          if (charCode < 48 || (charCode > 57 && charCode < 65) || (charCode > 90 && charCode < 97) || charCode > 122) {
            
          } else {
            outputflex += e.key
          }
         

          myflexid.innerText = outputflex
        })
      }


      console.log("myflex..", myflexRef.current);
      console.log(myflexRef.current)
    });


    const handlekeydown = (e) => {
      console.log(e.keyCode)
    }

    


    const url = "http://localhost:3001/newtestapi";

    const [apidata, setData] = useState([]);
    
    const fetchInfo = () => {
      return fetch(url)
        .then((res) => res.json())
        .then((dat) => setData(dat))
    }
  
    useEffect(() => {
      fetchInfo();
  
    }, []);

    //console.log(apidata.data)

    let mydataapi = apidata.data
    console.log(mydataapi)
/*


    let mydata = apidata.data;
    
    console.log(typeof(mydata))
    console.log(mydata[0].name)
*/


    let apilist = [];
    mydataapi?.forEach ( (eachname) => {             // need to add mydataapi?.            to avoid undefined after backend api data refresh 
      console.log(eachname.name)
      apilist.push(<div class='flex'><h1>{eachname.name}</h1></div>)
    })


  console.log(htmllist)

  const [showflag,setshow] = useState(false)

  console.log(showflag)


  const divhtmlcode = <div>from function</div>


  // Add file to local system 
 






  return (

   
    <div id = 'div2'>{htmllist}
      <div>
        <input ref = {myRef} type="text" placeholder="Please input" onKeyDown={(e) => {handlekeydown(e)}}/>
      </div>
      <div>
        <input id="inputId01" type="text" size="80" placeholder="Type the input Here will appear in the below DIV"/>
      </div>
     
      <div className='divfont ext-justify' id = "myflexid"></div>


      <div className='container flex'>
      {flexlist}
      </div>
      <div className='container'>
        <div className='flex'>Flex Item 1 </div>
        <div className='flex'>Flex Item 2 </div>
        <div className='flex'>Flex Item 3 </div>
        <div className='flex'>Flex Item 4 </div>
      </div>
  

    
  

    <div>
    <button
        onClick={() => {
          setshow(!showflag);
        }}>
        Toggle with setState
      </button>
    </div>
    <div className = "flex-column">
      {showflag && <div>showing</div>}
      {showflag && <div>showing2</div>}
      {showflag && divhtmlcode}
    </div>
    <div>
      {apilist}
    </div>
      
    <div>
      <Form />
      
    </div>


   




    </div>

  )
}

export default BlankPage