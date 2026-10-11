var cl=console.log;
const Base_url="https://xhrcrud-default-rtdb.firebaseio.com"
const Todo_url=`${Base_url}/Todo1.json`

const Form=document.getElementById("Form")
const spinner=document.getElementById("spinner")
const todoContainer=document.getElementById("todoContainer")
const todoName=document.getElementById("todoName")
const Description=document.getElementById("Description")
const addTodoBtn=document.getElementById("addTodoBtn")
const updateTodoBtn=document.getElementById("updateTodoBtn")

// localstorage
state={
    TodoArr:[],
    Edit_Id:null,
}

// Snakbar
function Snakbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500,
    
    })
}

// spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}


// templating
function Rendering(arr){
let result=``;
arr.forEach(ele => {
     result+=`<li class="list-group-item mb-3" id=${ele.id}>
                                <div class="card-header">
                                
                                    <strong>${ele.todoName}</strong>
                                    </div>
                                    <div class="card-body">
                                    <p>${ele.Description}</p>

                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <i  onclick="OnEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i  onclick="OnRemoveData(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div>
                            </li>`
    
});
todoContainer.innerHTML=result;


}
   

// read
async function ReadData(){
    Handlespinner();
    try{
        let res= await fetch(Todo_url,{
            metthod:"GET",
            body:null,
            headers:{
                
                "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }
        })
        let data= await res.json();
        for(const key in data){
            data[key].id=key
        state.TodoArr.unshift(data[key]);
            Rendering(state.TodoArr)
        }
    }catch (err){
        cl(err)
    }finally{
        Handlespinner();
    }

}
ReadData();


// craete
async function CreateData(eve){
    Handlespinner();
    eve.preventDefault();
   try{
     let obj={
        todoName:todoName.value,
        Description:Description.value
    }
    let res= await fetch(Todo_url,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
        }
    })
    let data= await res.json();
    let li=document.createElement("li");
    li.id=data.name
        obj.id = data.name;

    state.TodoArr.unshift(obj);
    li.className="list-group-item mb-3"
    li.innerHTML=`<div class="card-header">
                                
                                    <strong>${obj.todoName}</strong>
                                    </div>
                                    <div class="card-body">
                                    <p>${obj.Description}</p>

                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <i onclick="OnEdit(this)"  class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="OnRemoveData(this)"class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div>
    `
    todoContainer.append(li);
    Snakbar("New Data Created","success")
    Form.reset();
   }catch(err){
    cl(err)
   }finally{
    Handlespinner();
   }
}


// edit

async function OnEdit(eve){
    let Edit_id=eve.closest("li").id;
    state.Edit_Id=Edit_id
    let Edit_obj=state.TodoArr.find(t=>t.id===Edit_id)
    todoName.value=Edit_obj.todoName,
    Description.value=Edit_obj.Description
    addTodoBtn.classList.add("d-none")
    updateTodoBtn.classList.remove("d-none")
}

// update
async function UpdateList(eve){
    Handlespinner();
    let Update_id=state.Edit_Id;
    try{
        let update_obj={
             todoName:todoName.value,
        Description:Description.value,
        id:Update_id
    
        }
        let Update_url=`${Base_url}/Todo1/${Update_id}.json`
        let res= await fetch(Update_url,{
            method:"PATCH",
            body:JSON.stringify(update_obj),
            headers:{
                "content-Type":"application/json",
                "Authorization":"TOKEN JWT FROM  LS"
        
            }
        });
        let data= await res.json();
        let index= state.TodoArr.findIndex(t=>t.id===Update_id)
        state.TodoArr[index]=update_obj;
        let li=document.getElementById(Update_id);
        li.querySelector("strong").innerText=data.todoName
        li.querySelector("p").innerText=data.Description;
        addTodoBtn.classList.remove("d-none")
    updateTodoBtn.classList.add("d-none")
                        Snakbar("Todo Updated","success")
                        Form.reset();

}catch(err){
    cl(err)
}finally{
    Handlespinner();
}

}

// Delete
async function OnRemoveData(eve){

    let Remove_id=eve.closest("li").id;
    let result =await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
});
  if (result.isConfirmed){
    Handlespinner();
    try{
        let Remove_url=`${Base_url}/Todo1/${Remove_id}.json`
        let res= await fetch(Remove_url,{
            method:"DELETE",
            body:null,
            headers:{
                "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }

        })
        let data=res.json();
        let index=state.TodoArr.findIndex(t=>t.id===Remove_id);
        state.TodoArr.splice(index,1);
        eve.closest("li").remove();
                Snakbar("Item Removed!","success")


    }catch(err){
        cl(err)

    }finally{
        Handlespinner();
    }
  }

}



Form.addEventListener("submit",CreateData)
updateTodoBtn.addEventListener("click",UpdateList);