var local = (function(){

    var setData = function(key,obj){
        var values = JSON.stringify(obj);
        localStorage.setItem(key,values);
    }

    var getData = function(key){
        if(localStorage.getItem(key) != null){
        return JSON.parse(localStorage.getItem(key));
        }else{
            return false;
        }
    }

    return {set:setData,get:getData}
})();

function addNew()
{
  var workoutData = local.get("workouts");
  if (!workoutData)
  {
    workoutData = [];
  }
  
  var workoutSteps = [];
  workoutSteps.push({name:"step 1",repetitions:5,unit:"s",id:1});
  workoutSteps.push({name:"step 2",repetitions:9,unit:"r",id:2});
  
  workoutData.push({name:"new workout" + new Date().getSeconds(),id:getId(),steps:workoutSteps});
  local.set("workouts", workoutData);
  
  refresh();
}

function renderWorkout(workout)
{
  var itemsList = document.getElementById("items-list");
  var newItem = document.createElement("div");
  newItem.className = "centered-box";
  newItem.id = "workout-id-" + workout.id;
  itemsList.append(newItem);
  
  
  var buttonsDiv = document.createElement("div");
  buttonsDiv.className = "edit-buttons top-right";
  newItem.append(buttonsDiv);
  
  var startButton = document.createElement("button");
  startButton.innerText = "start";
  startButton.onclick = function() { startWorkout(workout.id); };
  buttonsDiv.append(startButton);

  var editButton = document.createElement("button");
  editButton.innerText = "edit";
  editButton.onclick = function() { editWorkout(workout.id); };
  buttonsDiv.append(editButton);
  
  var deleteButton = document.createElement("button");
  deleteButton.innerText = "delete";
  deleteButton.className = "cancel";
  deleteButton.onclick = function() { deleteWorkout(workout.id); };
  buttonsDiv.append(deleteButton);


  var title = document.createElement("div");
  title.className = "box-title";
  title.innerText = workout.name;
  newItem.append(title);
  
  
  for(const step of workout.steps)
  {
    var stepPreview = document.createElement("div");
    stepPreview.className = "workout-step"; 
    stepPreview.innerText = step.name;
    newItem.append(stepPreview);
  }
}

function editWorkout(workoutId){
  document.getElementById("editor-overlay").style.display = "block";
  var workoutData = local.get("workouts");
  if (workoutData)
  {
    var workout = workoutData.find(item => item.id == workoutId);
    document.getElementById("editor-title").value = workout.name;
    document.getElementById("editor-id").value = workout.id;
    
    var stepContainer = document.getElementById("editor-steps");
    stepContainer.innerHTML = "";
    for(const step of workout.steps)
    {
      var stepEditor = stepTemplate(step.name, step.repetitions, step.unit, step.id);
      stepContainer.append(stepEditor);
    }
  }
}

function saveEditor() {
  var name = document.getElementById("editor-title").value;
  var id = document.getElementById("editor-id").value;
    
  var stepsElement = document.getElementById("editor-steps");
  var stepEditors = stepsElement.getElementsByClassName("editor-step");
  var newSteps = [];
  var stepId = 0;
  for(const stepEditor of stepEditors)
  {
    var stepName = stepEditor.querySelector('input[name="name"]').value;
    var stepRepetitions = parseInt(stepEditor.querySelector('input[name="repetitions"]').value);
    var stepUnit = stepEditor.querySelector('select[name="unit"]').value;
    newSteps.push({name:stepName,repetitions:stepRepetitions,unit:stepUnit,id:stepId});
    stepId++;
  }
  
  var workoutData = local.get("workouts");
  if (workoutData)
  {
    var workout = workoutData.find(item => item.id == id);
    workout.name = name;
    workout.steps = newSteps;
  }
  local.set("workouts", workoutData);
  
  closeEditor();
  refresh();
}

function closeEditor()
{
  document.getElementById("editor-overlay").style.display = "none";
}

function deleteWorkout(workoutId){
  var workoutData = local.get("workouts");
  if (workoutData)
  {
    workoutData = workoutData.filter(item => item.id != workoutId)
  }
  local.set("workouts", workoutData);
  
  refresh();
}

function refresh(){
  document.getElementById("items-list").innerHTML = "";
  
  var workoutData = local.get("workouts");
  if (workoutData)
  {
    for (const workout of workoutData){
      renderWorkout(workout);
    }
  }
}

function announce(text)
{
  var speech = new SpeechSynthesisUtterance();
  speech.lang = "en";
  speech.text = text;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

function stepTemplate(name,repetitions,unit,id)
{
  var element = document.createElement("div");
  element.className = "editor-step";
  element.dataset.id = id;
  element.innerHTML = `<input type="text" value="${name}" name="name" size="15" />
                       <input type="number" value="${repetitions}" name="repetitions" />
                       <select name="unit">
                        <option value="s" ${unit == "s" ? "selected" : ""}>seconds</option>
                        <option value="r" ${unit == "r" ? "selected" : ""}>repetitions</option>
                       </select>
                       <button onclick="deleteStep(${id})" class="black">X</button>`;
  return element;
}

function closeWorkoutOverlay()
{
  announce("workout completed!")
  document.getElementById("workout-overlay").style.display = "none";
}

function startWorkout(id)
{
  var workout = loadWorkout(id);
  
  if (workout)
  {
    document.getElementById("workout-overlay").style.display = "flex";
    startNextStep(workout.steps);
  }
}

function addStepToEditor()
{
  var stepContainer = document.getElementById("editor-steps");
  var stepEditor = stepTemplate("new step", 10, "s", getId());
  stepContainer.append(stepEditor);
}

function deleteStep(id)
{
  var stepContainer = document.getElementById("editor-steps");
  var editorStep = stepContainer.querySelector(`div[data-id='${id}']`)
  stepContainer.removeChild(editorStep);
}

function getId()
{
  var id = Date.now();
  return id;
}

function loadWorkout(id)
{
  var workoutData = local.get("workouts");
  if (workoutData)
  {
    return workoutData.find(item => item.id == id);
  }

  return undefined;
}

var interval;
var timeout;

function startNextStep(steps)
{
  clearInterval(interval);
  clearTimeout(timeout);

  if (Array.isArray(steps) && steps.length > 0)
  {
    // Deep copy of array
    steps = JSON.parse(JSON.stringify(steps));

    var nextStep = steps.shift();

    document.getElementById("repetition-data").innerText = nextStep.repetitions;
    document.getElementById("repetition-unit").innerText = nextStep.unit == "r" ? "" : nextStep.unit;
    document.getElementById("exercise-data").innerText = nextStep.name;

    var unitToSpeak = nextStep.unit == "r" ? "" : "seconds of ";
    var textToSpeak = nextStep.repetitions + " " + unitToSpeak + nextStep.name;

    announce(textToSpeak);

    if (nextStep.unit == "s")
    {
      timeout = setTimeout(startTimer, 4000, nextStep.repetitions, steps)
    }

    document.getElementById("exercise-next-step").onclick = function() { 
      startNextStep(steps);
    }
  }
  else
  {
    closeWorkoutOverlay();
  }
}

function startTimer(timeLeft, steps)
{
  // Deep copy of array
  steps = JSON.parse(JSON.stringify(steps));

  announce("go!");

  interval = setInterval( function() {
    timeLeft-=1;
    document.getElementById("repetition-data").innerText = timeLeft;
    if (timeLeft <= 0)
    {
      startNextStep(steps);
    }
  }, 1000);
}

refresh();

if ('wakeLock' in navigator) {
  navigator.wakeLock.request('screen');
}
else{
  var video = document.createElement('video');
  video.setAttribute('loop', '');
  video.setAttribute('style', 'position: fixed;');

  function addSourceToVideo(element, type, dataURI) {
      var source = document.createElement('source');
      source.src = dataURI;
      source.type = 'video/' + type;
      element.appendChild(source);
  }

  var base64 = function(mimeType, base64) {
      return 'data:' + mimeType + ';base64,' + base64;
  };

  addSourceToVideo(video,'webm', base64('video/webm', 'GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAAH8xFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEwTbuMU6uEHFO7a1OsggfT7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEUq17GDD0JATYCNTGF2ZjU2LjMwLjEwMFdBjUxhdmY1Ni4zMC4xMDBzpJCV3'));
  addSourceToVideo(video, 'mp4', base64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));

  document.body.appendChild(video);

  var playFn = function() {
      video.play();
      document.body.removeEventListener('touchend', playFn);
  };
  document.body.addEventListener('touchend', playFn);
}