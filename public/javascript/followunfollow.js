$("#follow_unfollow").click(function(){
  if(document.getElementById("follow_unfollow").innerHTML == "Follow"){
    var username = document.getElementById("follow_unfollow").value;
    $.ajax({
      url: '/follow',
      type: 'post',
      data: { un : username, status : true},
      success: function( data, textStatus, jQxhr ){
         document.getElementById("follow_unfollow").innerHTML = data;
      },
      error: function( jqXhr, textStatus, errorThrown ){
          console.log( errorThrown );
      }
    });
  }
  else {
    var username = document.getElementById("follow_unfollow").value;
    $.ajax({
      url: '/follow',
      type: 'post',
      data: { un : username, status : false },
      success: function( data, textStatus, jQxhr ){
        document.getElementById("follow_unfollow").innerHTML = data;
      },
      error: function( jqXhr, textStatus, errorThrown ){
          console.log( errorThrown );
      }
    });
  }
  });
