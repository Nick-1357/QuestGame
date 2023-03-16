//Code Referenced from https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
function createTimer(){
questionData = fetch("./questionData.json")
questionTimes = JSON.parse(questionData)
for (var key in questionTimes){
    var timeLeft = questionTimes[key]
    if (timeLeft <= 0) {
        clearInterval(createTimer);
        document.getElementById("countdown").innerHTML = "You're out of time!";
  }
    else {
        document.getElementById("countdown").innerHTML = "Seconds Remaining: " + timeLeft;

    } 
    timeLeft -= 1;
    }
}