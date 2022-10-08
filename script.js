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

function addDefaultThings()
{
  var workoutData = local.get("workouts");
  if (!workoutData)
  {
    workoutData = [];

    // -day1----------------------------------------
    var workoutSteps = [];
    addStepToWorkout(workoutSteps, "Incline pushups"      , 15, "r",  1);
    addStepToWorkout(workoutSteps, "Pushups"              , 15, "r",  2);
    addStepToWorkout(workoutSteps, "Military press"       , 20, "r",  3);
    addStepToWorkout(workoutSteps, "Plank"                , 30, "s",  4);
    addStepToWorkout(workoutSteps, "Floor flys"           , 20, "r",  5);
    addStepToWorkout(workoutSteps, "Wide bench press"     , 20, "r",  6);
    addStepToWorkout(workoutSteps, "Closed bench press"   , 15, "r",  7);
    addStepToWorkout(workoutSteps, "Overhead press"       , 15, "r",  8);
    addStepToWorkout(workoutSteps, "Dumbell press outs"   , 15, "r",  9);
    addStepToWorkout(workoutSteps, "Lateral raises"       , 15, "r", 10);
    addStepToWorkout(workoutSteps, "Triceps dips"         , 20, "r", 11);
    
    workoutData.push({name:"Day 1 - Push",id:1001,steps:workoutSteps});

    // -day2----------------------------------------
    workoutSteps = [];
    addStepToWorkout(workoutSteps, "Romainian deadlift"   , 10, "r", 1);
    addStepToWorkout(workoutSteps, "Dumbell rows"         , 15, "r", 2);
    addStepToWorkout(workoutSteps, "Drag curls"           , 15, "r", 3);
    addStepToWorkout(workoutSteps, "Pullups"              , 10, "r", 4);
    addStepToWorkout(workoutSteps, "Wide bicep curls"     , 10, "r", 5);
    addStepToWorkout(workoutSteps, "Russian twist"        , 30, "s", 6);
    addStepToWorkout(workoutSteps, "Hammer curls"         , 15, "r", 7);
    addStepToWorkout(workoutSteps, "Butterfly reverse"    , 15, "r", 8);
    addStepToWorkout(workoutSteps, "W raises"             , 15, "r", 9);
    
    workoutData.push({name:"Day 2 - Pull",id:1002,steps:workoutSteps});

    // -day3----------------------------------------
    workoutSteps = [];
    addStepToWorkout(workoutSteps, "One legged squats"      , 20, "r", 1);
    addStepToWorkout(workoutSteps, "Side squats"            , 20, "r", 2);
    addStepToWorkout(workoutSteps, "Low side squats"        , 10, "r", 3);
    addStepToWorkout(workoutSteps, "Wide squats"            , 15, "r", 4);
    addStepToWorkout(workoutSteps, "Plank hip thrusts"      , 20, "r", 5);
    addStepToWorkout(workoutSteps, "One legged hip thrusts" , 10, "r", 6);
    addStepToWorkout(workoutSteps, "Calve raises"           , 40, "r", 7);
    addStepToWorkout(workoutSteps, "Mountain climbers"      , 50, "s", 8);
    
    workoutData.push({name:"Day 3 - Legs",id:1003,steps:workoutSteps});

    // -stretch-------------------------------------
    workoutSteps = [];
    addStepToWorkout(workoutSteps, "Abdomen stretching"     , 30, "s",  1);
    addStepToWorkout(workoutSteps, "Frontal thigh stretch"  , 30, "s",  2);
    addStepToWorkout(workoutSteps, "Frontal thigh stretch"  , 30, "s",  3);
    addStepToWorkout(workoutSteps, "Chest stretching"       , 20, "s",  4);
    addStepToWorkout(workoutSteps, "Chest stretching"       , 20, "s",  5);
    addStepToWorkout(workoutSteps, "Lying thigh stretch"    , 30, "s",  6);
    addStepToWorkout(workoutSteps, "Lying thigh stretch"    , 30, "s",  7);
    addStepToWorkout(workoutSteps, "Wrist stretching"       , 30, "s",  8);
    addStepToWorkout(workoutSteps, "Inner thigh stretching" , 30, "s",  9);
    addStepToWorkout(workoutSteps, "Inner thigh stretching" , 30, "s", 10);
    addStepToWorkout(workoutSteps, "Leg stretching"         , 30, "s", 11);
    addStepToWorkout(workoutSteps, "Leg stretching"         , 30, "s", 12);

    workoutData.push({name:"Stretching",id:1004,steps:workoutSteps});

    local.set("workouts", workoutData);
    
    refresh();
  }  
}

function addStepToWorkout(workoutSteps, n, rep, u, i)
{
  workoutSteps.push({name:n,repetitions:rep,unit:u,id:i});
}

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
  
  workoutData.push({name:"new workout",id:getId(),steps:workoutSteps});
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
  editButton.dataset.editMode='edit';
  editButton.onclick = function() { editWorkout(workout.id); };
  buttonsDiv.append(editButton);
  
  var deleteButton = document.createElement("button");
  deleteButton.innerText = "delete";
  deleteButton.dataset.editMode='edit';
  deleteButton.className = "cancel";
  deleteButton.onclick = function() { deleteWorkout(workout.id); };
  buttonsDiv.append(deleteButton);


  var title = document.createElement("div");
  title.className = "box-title";
  title.innerText = workout.name;
  newItem.append(title);

  // Each exercise step is only listed once on the overview screen
  var uniqueNames = new Set();

  for(const step of workout.steps)
  {
    if (uniqueNames.has(step.name)){
      continue;
    }
    else{
      uniqueNames.add(step.name);
    }

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
  element.innerHTML = `<input type="number" value="${repetitions}" name="repetitions" />
                       <select name="unit">
                        <option value="s" ${unit == "s" ? "selected" : ""}>sec</option>
                        <option value="r" ${unit == "r" ? "selected" : ""}>rep</option>
                       </select>
                       <input type="text" value="${name}" name="name" />                       
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

function editMode(modeName)
{
  hide(document.querySelectorAll(`[data-edit-mode='edit']`));
  hide(document.querySelectorAll(`[data-edit-mode='non-edit']`));

  show(document.querySelectorAll(`[data-edit-mode='${modeName}']`));
}

function hide(elements) {
  for(const ele of elements)
  {
    ele.style.display = 'none';
  }
}

function show(elements) {
  for(const ele of elements)
  {
    ele.style.display = '';
  }
}

addDefaultThings();
refresh();
editMode('non-edit');

if ('wakeLock' in navigator) {
  navigator.wakeLock.request('screen');
}
else{
  var video = document.createElement('video');
  video.setAttribute('title', 'videotitle');
  video.setAttribute('playsinline', '');
  video.setAttribute('src', 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQAD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');
  video.addEventListener('timeupdate', function (e) {
    if (video.currentTime > 0.5) {
      video.currentTime = Math.random()
    }
  });

  document.body.appendChild(video);

  var playFn = function() {
      video.play();
      document.body.removeEventListener('click', playFn);
  };
  document.body.addEventListener('click', playFn);
}