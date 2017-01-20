$(document).ready(function() {

var dataRef = firebase.database();
    // initial values
    var trainID;
    var name = "";
    var destination = "";
    var time = 0;
    var frequency = "";
    var currentTime = moment(currentTime).format("hh:mm");
    var datetime;
    var date;

    // display current time

  
    var update = function(){
      datetime = $('#current-time');
      date = moment(new Date());
      datetime.html('<h3>' + date.format('dddd, MMMM Do YYYY, h:mm:ss a' + '</h3>'));
      };

    update();

    setInterval(update, 1000);


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
      // log everything that's coming out of snapshot
      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().time);
      console.log(childSnapshot.val().frequency);


      // calculate next time train arrives
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var trainFreq = childSnapshot.val().frequency
    console.log("CURRENT TIME: " + currentTime);
    
    //time difference = current time - time of first train
    var timeDiff = moment().diff(firstTimeConverted, "minutes");
    console.log("DIFFERENCE IN TIME: " +timeDiff);
    //timeDiff % frequency = minutesAgo
    var minutesAgo = timeDiff % trainFreq;
    console.log("LAST TRAIN CAME" + " " + minutesAgo + " " + "MINUTES AGO");
    //minutesLeft = frequency - minutesAgo
    var minutesLeft = trainFreq - minutesAgo;
    console.log("MINUTES TILL TRAIN: " +minutesLeft);
    //currentTime + minutesLeft = time of next train
    var nextTrain = moment().add(minutesLeft, "minutes");
    console.log(nextTrain);
    //format new time
    var nextTrainTime = moment(nextTrain).format("hh:mm");
    console.log("ARRIVAL TIME: " + nextTrainTime);


      // full list of items to the well
      $("#table-body").append("<tr class='table-row'><td class='table-name'> " + childSnapshot.val().name +
        " </td><td class='table-desination'> " + childSnapshot.val().destination +
        " </td><td class='table-frequency'> " + childSnapshot.val().frequency + " </td><td class='next-train'> " + nextTrainTime +
        " </td><td class='minutes-away'> " + minutesLeft +
        " </td></tr>");

    // handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

});
