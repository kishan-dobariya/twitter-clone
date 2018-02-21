$(document).ready(function(){
  if (document.getElementById("tweetbutton") != null) {
    $("#tweetbutton").hide();
  }
  document.getElementById("showuser").style.display = "none";
  $("#search").click(function(){
    $(this).css('border', '2px solid #4AB3F4');;
  });
  $("#tweet").focusin(function() {
    $("#tweetbutton").show();
  });
  $("#tweet").focusout(function() {
    $('#tweetbutton').delay(200).hide(0, function () {
    });
  });
});
