'use strict';
var promise = new Promise(function (fulfill, reject) {
  //setTimeout(function () {
    reject(new Error('I DID NOT FIRE'));
    fulfill('I FIRED');

  //}, 300);
}).then(console.log,onReject);
//	console.log(error.message);


function onReject (error) {
    console.log(error.message);
      //Your solution here
   }
