var dataRef = firebase.database();
    // initial values
    var name = "";
    var destination = "";
    var time = 0;
    var frequency = "";

    // capture button click
    $("#add-train").on("click", function() {
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
      // don't refresh the page
      return false;
    });


    // event listener triggers if a child is added 
    dataRef.ref().on("child_added", function(childSnapshot) {
      // log everything that's coming out of snapshot
      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().time);
      console.log(childSnapshot.val().frequency);

      // full list of items to the well
      $("#full-train-list").append("<div class='well'><span id='name'> " + childSnapshot.val().name +
        " </span><span id='desination'> " + childSnapshot.val().destination +
        " </span><span id='time'> " + childSnapshot.val().time +
        " </span><span id='frequency'> " + childSnapshot.val().frequency + " </span></div>");

    // handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    // runs on page load and when a child is added
    dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(data) {
      // change the HTML to reflect
      $("#name-display").html(data.val().name);
      $("#destination-display").html(data.val().destination);
      $("#time-display").html(data.val().time);
      $("#frequency-display").html(data.val().frequency);
    });
