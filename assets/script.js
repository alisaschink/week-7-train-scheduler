$(document).ready(function() {

 // initial values
 var dataRef = firebase.database();
 var name = "";
 var destination = "";
 var time = "";
 var frequency = "";
 var currentTime = moment(currentTime).format("hh:mm");
 var firstTimeConverted;
 var clock;
 var date;
 var trainName;
 var trainDes;
 var trainFreq;
 var nextTrainTime;
 var minutesLeft;
 var trainNames = [];
 var trainDests = [];
 var trainTimes = [];
 var trainFreqs = [];


 // display current time
 var updateClock = function() {
  clock = $('#current-time');
  date = moment(new Date()).format('dddd, MMMM Do YYYY, h:mm:ss a');
  clock.html('<h3>' + date + '</h3>');
  // isolates seconds
  var indCol = date.indexOf(':');
  var seconds = (date.substring(indCol + 4, date.length - 3));

  // update table for each new minute
  if (seconds == '00') {
   updateTable();
  };
 };

 updateClock();

 setInterval(updateClock, 1000);


 // calculate time when next train arrives
 function calcTime() {
  //time difference = current time - time of first train
  var timeDiff = moment().diff(firstTimeConverted, "minutes");
  console.log("DIFFERENCE IN TIME: " + timeDiff);
  //timeDiff % frequency = minutesAgo
  var minutesAgo = timeDiff % trainFreq;
  console.log("LAST TRAIN CAME" + " " + minutesAgo + " " + "MINUTES AGO");
  //minutesLeft = frequency - minutesAgo
  minutesLeft = trainFreq - minutesAgo;
  console.log("MINUTES TILL TRAIN: " + minutesLeft);
  //currentTime + minutesLeft = time of next train
  var nextTrain = moment().add(minutesLeft, "minutes");
  console.log(nextTrain);
  //format new time
  nextTrainTime = moment(nextTrain).format("hh:mm");
  console.log("ARRIVAL TIME: " + nextTrainTime);
 };


 // displays train info in table
 function showTrains() {
  $("#table-body").append("<tr class='table-row'><td class='table-name'> " + trainName +
   " </td><td class='table-desination'> " + trainDes +
   " </td><td class='table-frequency'> " + trainFreq + " </td><td class='next-train'> " + nextTrainTime +
   " </td><td class='minutes-away'> " + minutesLeft +
   " </td></tr>");
 };

 // updates table with train info
 function updateTable() {
  // empty tables
  $("#table-body").empty();

  // updates values in table for each object key
  for (i = 0; i < trainNames.length; i++) {
   firstTimeConverted = moment(trainTimes[i], "hh:mm").subtract(1, "years");
   trainName = trainNames[i]
   trainDes = trainDests[i];
   trainFreq = trainFreqs[i];
   calcTime();
   showTrains();

  };
 };

 // capture button click
 $("#add-train").on("click", function(event) {
  event.preventDefault();
  name = $("#name-input").val().trim();
  destination = $("#destination-input").val().trim();
  time = $("#time-input").val().trim();
  frequency = $("#frequency-input").val().trim();
  // code for the push
  dataRef.ref().push({
   name: name,
   destination: destination,
   time: time,
   frequency: frequency,
   dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

 });


 // event listener triggers if a child is added 
 dataRef.ref().on("child_added", function(childSnapshot) {

  trainName = childSnapshot.val().name
  trainDes = childSnapshot.val().destination
  trainFreq = childSnapshot.val().frequency
   // First Time (pushed back 1 year to make sure it comes before current time)
  firstTimeConverted = moment(childSnapshot.val().time, "hh:mm").subtract(1, "years");
  calcTime();
  showTrains();


  // handle the errors
 }, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
 });


 //pulls data out of firebase and updates table
 dataRef.ref().on("value", function(snapshot) {
  var sv = snapshot.val();
  var sv_arr = Object.keys(sv);

  for (i = 0; i < sv_arr.length; i++) {
   trainNames.push(sv[sv_arr[i]].name);
   trainDests.push(sv[sv_arr[i]].destination);
   trainTimes.push(sv[sv_arr[i]].time);
   trainFreqs.push(sv[sv_arr[i]].frequency);
  };

  updateTable();
  // Handle the errors
 }, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
 });

});