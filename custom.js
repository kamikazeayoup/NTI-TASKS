(function(){
'use strict';
var taskList;
var lastId = 0 ;
var removeIcon;
var updateIcon;
var taskWrapper = document.getElementById("task_wrapper");
var btnsave = document.getElementById("save_task")

//initialization click save. 
function init(){
    if ((!(window.localStorage.getItem('taskList')))){
        taskList = JSON.parse(window.localStorage.getItem('taskList'));
    }
    else {
    taskList = [];
    }
    btnsave.addEventListener('click' , saveTask);
    showList();
}


//save task after click save
function saveTask(event){
    var task = {
        taskId: lastId,
        taskDes: document.getElementById("task_des").value,
        taskState: document.getElementById("task_state").value
    };
    taskList.push(task);
    syncTask();
    addToTaskList(task);
    syncEvents();
    lastId++;
}

//show all added notes
function showList(){
    if (!taskList.length){
        getLastTaskId();
        for (var item in taskList){
            var task = taskList[item];
            addToTaskList(task);
        }
        syncEvents();

    }
}

//add all notes
function addToTaskList(task){
    //initialize the type of each one
    var updateIcon = document.createElement('span');
    var removeIcon = document.createElement('span');
    var element = document.createElement('li');

    //set the icon and title and class name for remove
    removeIcon.innerHTML = "X";
    removeIcon.setAttribute("title" , "remove");
    removeIcon.className = "remove_item clickeable";
    //set the icon and title and class name for update
    updateIcon.innerHTML = "U";
    updateIcon.className = "update_icon clickeable";
    updateIcon.setAttribute("title" , "Update");

    // use element to store the li and push it in taskwrapper
    element.appendChild(removeIcon);
    element.appendChild(updateIcon);
    element.setAttribute("id" , task.taskId);
    element.innerHTML+=task.taskDes;
    taskWrapper.appendChild(element);

}

//remove task 
function removeTask(event){

    var taskToRemove = event.currentTarget.parentNode;
    var taskId = taskToRemove.id;
    taskWrapper.removeChild(taskToRemove);
    taskList.forEach( function(value , i){
        if (value.taskId == taskId){
            taskList.splice(i, 1);
        }
        
    });

    syncTask();
}
//update tasks
function updateTask(event){
    var taskTag = event.currentTarget.parentNode;
    var taskId = taskTag.id;
    var taskToUpdate = findTask(taskId).task;
    var pos = findTask(taskId).pos;
    if (!!taskToUpdate){
        var des = prompt("Description" , taskToUpdate.taskDes);
        var state = prompt ("State" , taskToUpdate.taskState);
        taskToUpdate.taskDes = des;
        taskToUpdate.taskState = state;
        taskList[pos] = taskToUpdate;
        taskTag.lastChild.textContent = taskToUpdate.taskDes;
        syncTask();
    }

}

function getLastTaskId(){
    var lastTask = taskList[taskList.length - 1];
    lastId = lastTask.taskId + 1;
}


// set item in Local storage 
function syncTask(){
    window.localStorage.setItem('taskList' , JSON.stringify(taskList))
    taskList = JSON.parse(window.localStorage.getItem('taskList'))
}

function syncEvents(){
    updateIcon = document.getElementsByClassName("update_icon")
    removeIcon = document.getElementsByClassName("remove_item")

    if (!!removeIcon.length){
        for (var i = 0 ; i < removeIcon.length ; i++){
            removeIcon[i].addEventListener('click' , removeTask);
        }
    }
    if (!!updateIcon.length){
        for (var i = 0 ; i < updateIcon.length ; i++){
            updateIcon[i].addEventListener('click' , updateTask);
        }
    }
}

function findTask(id){
    var response = {
        task: '',
        pos: 0
    };
    taskList.forEach(function(value , i){
        if (value.taskId == id){
        response.task = value
        response.pos = i
        }
    });
    return response;
}

init();



})();