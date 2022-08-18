import {
    onGetTasks, 
    deleteTask, 
    getTask, 
  } from "./firebase.js";
  
  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");

  let editStatus = false;
  let id = "";
  
  window.addEventListener("load", async (e) => {
  
    //처음 로드되면 실행
    onGetTasks((querySnapshot) => {
      tasksContainer.innerHTML = "";
      
      //doc에 있는 목록 가져오기
      querySnapshot.forEach((doc) => {
        const task = doc.data();
  
        tasksContainer.innerHTML += `
          <div class="card card-body mt-2 border-primary">
            <h3 class="h5">${task.rosteryName}</h3>
            <p>${task.location}</p>
            <image src="${task.imageUrl}" class="thumbnail"></image>
          <div>
            <button class="btn btn-primary btn-delete" data-id="${doc.id}">
              🗑 Delete
            </button>
            <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
              🖉 Edit
            </button>
          </div>
        </div>`;
      });
  
      //삭제버튼
      const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async ({ target: { dataset } }) => {
          var ret = confirm('삭제하시겠습니까?')
          if (ret){
            try {
              await deleteTask(dataset.id);
              alert('삭제완료');
            } catch (error) {
              console.log(error);
            }
          } 
        })
      );
  
      //수정버튼
      const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          try {
            const doc = await getTask(e.target.dataset.id);
            const task = doc.data();
            taskForm["task-rosteryName"].value = task.rosteryName;
            taskForm["task-location"].value = task.location;
            
            editStatus = true;
            id = doc.id;
            taskForm["btn-task-form"].innerText = "Update";
            taskForm["btn-cancel-form"].style = "display";
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  });
  