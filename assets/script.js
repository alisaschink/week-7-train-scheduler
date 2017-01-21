$(document).ready(function() {

 // initial values
 var dataRef = firebase.database();
 var name = "";
 var destination = "";
 var time = "";
 var frequency = "";
 var currentTime = moment(currentTime).format('hh:mm');
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
 function showTrains() {
  //time difference = current time - time of first train
  var timeDiff = moment().diff(firstTimeConverted, 'minutes');
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

  //appends train info to table
  $("#table-body").append("<tr class='table-row'><td class='table-name'> " + trainName +
  " </td><td class='table-desination'> " + trainDes +
  " </td><td class='table-frequency'> " + trainFreq + " </td><td class='next-train'> " + nextTrainTime +
  " </td><td class='minutes-away'> " + minutesLeft +
  " </td></tr>");
 };


 // updates table with train info
 function updateTable() {
  // empty table
  $("#table-body").empty();

  // updates values in table for each object key
  for (i = 0; i < trainNames.length; i++) {
    //ensures that time is in the past
   firstTimeConverted = moment(trainTimes[i], "hh:mm").subtract(1, "years");
   trainName = trainNames[i]
   trainDes = trainDests[i];
   trainFreq = trainFreqs[i];
   showTrains();

  };
 };

 // capture button click
 $(document).on('click', '#add-train', function(event) {
  event.preventDefault();
  name = $("#name-input").val().trim();
  destination = $("#destination-input").val().trim();
  time = $("#time-input").val().trim();
  frequency = $("#frequency-input").val().trim();
  // code for the push
  // wont push unless user fills out all fields
  if(name != '' && destination != '' && time != '' && frequency != '') {
    dataRef.ref().push({
      name: name,
      destination: destination,
      time: time,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // empty input fields
    $("#name-input").val('');
    $("#destination-input").val('');
    $("#time-input").val('');
    $("#frequency-input").val('');

  } else {
    alert("Please fill out all of the fields");
  }

 });


 // event listener triggers if a child is added 
 dataRef.ref().on("child_added", function(childSnapshot) {

  //pushes new values to arrays
  trainNames.push(childSnapshot.val().name);
  trainDests.push(childSnapshot.val().destination);
  trainTimes.push(childSnapshot.val().time);
  trainFreqs.push(childSnapshot.val().frequency);

  updateTable();


  // handle the errors
 }, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
 });

});