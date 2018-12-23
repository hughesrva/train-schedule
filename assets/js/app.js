// to do:
// 

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCIQ6WFInoOo-saGkPCrYZhc2YcmMh9vCo",
    authDomain: "choochooen.firebaseapp.com",
    databaseURL: "https://choochooen.firebaseio.com",
    projectId: "choochooen",
    storageBucket: "choochooen.appspot.com",
    messagingSenderId: "400378382665"
};

firebase.initializeApp(config);
var database = firebase.database();

var newNameI = $("#newName");
var newDestI = $("#newDest");
var newStartI = $("#newStart");
var newFreqI = $("#newFreq");

var newName = "";
var newDest = "";
var newStart = "";
var newFreq = 0;

// function to push values to firebase
$("#subBtn").on("click", function (event) {
    event.preventDefault();
    console.log(newFreqI.val());


    // alerts if any fields are empty
    if ($(newNameI).val() === "" || $(newDestI).val() === "" || $(newStartI).val() === "" || $(newFreq).val() === "") {
        window.alert("You need to fill out the form!");
    }

    else {
        newName = $(newNameI).val();
        newDest = $(newDestI).val();
        newStart = $(newStartI).val();
        newFreq = $(newFreqI).val();

        database.ref().push({
            dbName: newName,
            dbDest: newDest,
            dbStart: newStart,
            dbFreq: newFreq,
        })
        console.log("items pushed");
        $(newNameI).val("");
        $(newDestI).val("");
        $(newStartI).val("");
        $(newFreqI).val("");
    }
})


// function to get and show row values
database.ref().orderByChild("dbDest").on("child_added", function (snapshot) {
    console.log(snapshot);

    // fb node's key
    var nodeKey = snapshot.key;

    // current time moment
    var currentTime = moment();

    // start time moment
    var dbStart = snapshot.val().dbStart;
    var startTime = moment(dbStart, "HH:mm");

    // frequency variable
    var dbFreq = snapshot.val().dbFreq;

    // time difference moment
    var diffTime = moment().diff(moment(startTime), "minutes");

    // time remainder
    var remTime = diffTime % dbFreq;

    // time until next train
    var tillTime = dbFreq - remTime;
    
    // next train time moment
    var nextTime = currentTime.add(tillTime, "minutes").format("hh:mm a");

    // create row and items for each value
    var newRow = $("<tr>").addClass("tableRow");
    var rowName = $("<td scope='col'>").text(snapshot.val().dbName);
    var rowDest = $("<td scope='col'>").text(snapshot.val().dbDest);
    var rowFreq = $("<td scope='col'>").text(snapshot.val().dbFreq);
    var rowNext = $("<td scope='col'>").text(nextTime);
    var rowAway = $("<td scope='col'>").text(tillTime);
    var delBtn = $("<button scope='col' class='btn btn-danger delBtn'>").text("Delete");
    $(delBtn).data("nodeKey", nodeKey);

    // append items
    $(newRow).append(rowName, rowDest, rowFreq, rowNext, rowAway, delBtn);
    $("#tableBody").append(newRow);



});

// click function to delete row and fb child
$("body").on("click", ".delBtn", function() {
    database.ref($(this).data("nodeKey")).remove(); 
    $(this).parent().remove();   
});