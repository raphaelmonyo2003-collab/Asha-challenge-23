function updateProgress(sliderId, circleId, numberId){

    const slider = document.getElementById(sliderId);
    const circle = document.getElementById(circleId);
    const number = document.getElementById(numberId);

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    function setProgress(value){

        const offset = circumference - (value / 100) * circumference;

        circle.style.strokeDashoffset = offset;

        number.innerHTML = value + "%";

        localStorage.setItem(sliderId, value);
    }

    const saved = localStorage.getItem(sliderId);

    if(saved){
        slider.value = saved;
        setProgress(saved);
    }else{
        setProgress(slider.value);
    }

    slider.addEventListener("input", () => {
        setProgress(slider.value);
    });

}

updateProgress("slider1","circle1","number1");
updateProgress("slider2","circle2","number2");
updateProgress("slider3","circle3","number3");
updateProgress("slider4","circle4","number4");
/* GOAL NOTEBOOK */

const goalInput = document.getElementById("goalText");
const goalList = document.getElementById("goalList");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals(){
    localStorage.setItem("goals", JSON.stringify(goals));
}

function renderGoals(){

    goalList.innerHTML = "";

    goals.forEach((goal, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="goal-text ${goal.completed ? "completed" : ""}">
                ${goal.text}
            </span>

            <div class="goal-buttons">

                <button class="complete-btn" onclick="toggleGoal(${index})">
                    ✓
                </button>

                <button class="delete-btn" onclick="deleteGoal(${index})">
                    ✕
                </button>

            </div>
        `;

        goalList.appendChild(li);

    });

}

function addGoal(){

    const text = goalInput.value.trim();

    if(text === "") return;

    goals.push({
        text:text,
        completed:false
    });

    saveGoals();

    renderGoals();

    goalInput.value = "";
}

function toggleGoal(index){

    goals[index].completed = !goals[index].completed;

    saveGoals();

    renderGoals();
}

function deleteGoal(index){

    goals.splice(index,1);

    saveGoals();

    renderGoals();
}

renderGoals();
/* NET WORTH GRAPH */

const ctx = document.getElementById("worthChart");

let worthData = JSON.parse(localStorage.getItem("worthData")) || [];

const worthChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: worthData.map((item, index) => `Entry ${index + 1}`),
        datasets: [{
            label: "Net Worth Progress",
            data: worthData,
            borderColor: "#ff1493",
            backgroundColor: "rgba(255,20,147,0.2)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor:"#ff1493",
            pointRadius:5
        }]
    },
    options: {
        responsive:true,
        scales:{
            y:{
                beginAtZero:true
            }
        }
    }
});

function updateGraph(){

    const target = Number(document.getElementById("targetWorth").value);

    const current = Number(document.getElementById("currentWorth").value);

    if(current === 0 || target === 0) return;

    const progress = (current / target) * 100;

    worthData.push(progress);

    localStorage.setItem("worthData", JSON.stringify(worthData));

    worthChart.data.labels.push(`Entry ${worthData.length}`);

    worthChart.data.datasets[0].data = worthData;

    worthChart.update();

    /* UPDATE NET WORTH CIRCLE */

    const slider3 = document.getElementById("slider3");

    slider3.value = Math.min(progress,100);

    slider3.dispatchEvent(new Event("input"));

}
/* DAILY STATUS TRACKER */

const dailyCtx = document.getElementById("dailyChart");

let trackingData = JSON.parse(localStorage.getItem("trackingData")) || [];

const dailyChart = new Chart(dailyCtx, {

    type: "line",

    data: {
        labels: trackingData.map(item => item.date),

        datasets: [{
            label:"Progress History",
            data: trackingData.map(item => item.value),

            borderColor:"#ff1493",
            backgroundColor:"rgba(255,20,147,0.2)",
            fill:true,
            tension:0.4,
            pointRadius:5,
            pointBackgroundColor:"#ff1493"
        }]
    },

    options:{
        responsive:true,
        scales:{
            y:{
                beginAtZero:true
            }
        }
    }

});

function saveTracking(){

    const type = document.getElementById("trackType").value;

    const value = document.getElementById("trackValue").value;

    const date = document.getElementById("trackDate").value;

    if(value === "" || date === "") return;

    const entry = {
        type,
        value:Number(value),
        date
    };

    trackingData.push(entry);

    localStorage.setItem("trackingData", JSON.stringify(trackingData));

    updateHistory();

    updateChart(type);

    /* AUTO UPDATE TOP CARDS */

    if(type === "Body Weight"){
        updateCard("slider1","circle1","number1",value);
    }

    if(type === "Self Focus"){
        updateCard("slider2","circle2","number2",value);
    }

    if(type === "Net Worth"){
        updateCard("slider3","circle3","number3",value);
    }

    if(type === "Selfishness"){
        updateCard("slider4","circle4","number4",value);
    }

}

function updateCard(sliderId,circleId,numberId,value){

    const slider = document.getElementById(sliderId);

    slider.value = value;

    slider.dispatchEvent(new Event("input"));

}

function updateHistory(){

    const historyList = document.getElementById("historyList");

    historyList.innerHTML = "";

    trackingData
    .slice()
    .reverse()
    .forEach((item, index) => {

        const realIndex = trackingData.length - 1 - index;

        const li = document.createElement("li");

        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">

                <div>
                    💖 On <b>${item.date}</b> your
                    <b>${item.type}</b> was
                    <b>${item.value}</b>
                </div>

                <div style="position:relative;">
                    
                    <button onclick="toggleMenu(${realIndex}, this)"
                        style="
                            background:none;
                            border:none;
                            font-size:20px;
                            cursor:pointer;
                            color:#ff1493;
                        ">
                        ⋯
                    </button>

                    <div id="menu-${realIndex}" class="popup-menu">
                        <button onclick="deleteTracking(${realIndex})">Delete</button>
                    </div>

                </div>

            </div>
        `;

        historyList.appendChild(li);

    });
}

function updateChart(type){

    const filtered = trackingData.filter(item => item.type === type);

    dailyChart.data.labels = filtered.map(item => item.date);

    dailyChart.data.datasets[0].data = filtered.map(item => item.value);

    dailyChart.data.datasets[0].label = type + " History";

    dailyChart.update();

}

/* LOAD HISTORY */

updateHistory();
function deleteTracking(index){

    trackingData.splice(index, 1);

    localStorage.setItem("trackingData", JSON.stringify(trackingData));

    updateHistory();

    updateChart("Body Weight"); // default refresh
}
function toggleMenu(index, btn){

    const menu = document.getElementById("menu-" + index);

    // close all other menus first
    document.querySelectorAll(".popup-menu").forEach(m => {
        if(m !== menu) m.style.display = "none";
    });

    if(menu.style.display === "block"){
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }

    // close when clicking outside
    document.addEventListener("click", function closeMenu(e){
        if(!btn.contains(e.target) && !menu.contains(e.target)){
            menu.style.display = "none";
            document.removeEventListener("click", closeMenu);
        }
    });
}