$(document).ready(function () {
  // Optional - Use AJAX to send an HTTP DELETE request for the sign-out link
  $("#parent_container form.search").on("submit",function(e){
    e.preventDefault()
    $.ajax({
    url: '/places',
    type: 'GET',
    dataType: 'json',
    data: $(this).serialize()
    }).done(function(data){
      var results = data.results
      for(var i=0;i<results.length;i++){
        $('#parent_container').append(placeTemplate(results[i]))
      }
      next_page_token = data.next_page_token
      $('#parent_container').append('<form id="next_page" method="get" action="/places/'+next_page_token+'"><input type="submit" value="See More Results"></form>')
    })
  })

  $("#parent_container").on("submit", "#next_next_page", function(e){
    e.preventDefault()
    var path = $(this).attr("action")
    var current =$(this)
    $.ajax({
      url: path,
      type: 'GET',
      dataType: 'json',
      data: $(this)
    }).done(function(data){
      var results = data.results
      for(var i=0;i<results.length;i++){
        $('#parent_container').append(placeTemplate(results[i]))
      }
      current.css('display','none')
    })
  })

  $("#parent_container").on("submit", "#next_page", function(e){
    e.preventDefault()
    var path = $(this).attr("action")
    var current =$(this)
    $.ajax({
      url: path,
      type: 'GET',
      dataType: 'json',
      data: $(this)
    }).done(function(data){
      var results = data.results
      for(var i=0;i<results.length;i++){
        $('#parent_container').append(placeTemplate(results[i]))
      }
      current.css('display','none')
      next_page_token = data.next_page_token
      $('#parent_container').append('<form id="next_next_page" method="get"action="/places/'+next_page_token+'"><input type="submit" value="See More Results"></form>')
    })
  })

  $("#parent_container").on("submit", "#add", function(e){
    e.preventDefault()

    current =$(this)
    event.preventDefault()
    var path = $(this).attr("action")
    $.ajax({
      url: path,
      type: "POST"
    }).done(function(){
      current.css("display","none")
      current.parent().find('#delete').css("display","block")
    })
  })

  $("#parent_container").on("submit", "#delete", function(e){
    e.preventDefault()
    var current =$(this)
    event.preventDefault()
    path = $(this).attr("action")
    $.ajax({
      url: path,
      type: "DELETE"
    }).done(function(){
      current.css("display","none")
      current.parent().find('#add').css("display","block")
    })
  })

  $('#date').on("submit", function(e){
    e.preventDefault()
    $.ajax({
      url: '/change_date',
      type: "POST",
      data: $(this).serialize(),
      dataType: 'json'
    }).done(function(data){
      $('h1').text(data.date)
    })
  })

  $(".list_container").on("click", ".delete",function(e){
    e.preventDefault()
    path = $(this).find('a').attr("href")
    var current = $(this)
    $.ajax({
      url: path,
      type: "DELETE"
    }).done(function(){
      current.parent().remove()
    })
  })

  $(".list_container").on("click", ".put", function(e){
    e.preventDefault()
    $('.plan_to').text("Plan Trip to: "+$(this).children().html())
    $('.date').css('display','none')
    $('.time').css('display','table-row')
    var path = $(this).children().attr('href')
    $('.time').find('form').attr('action', path)
  })

  $(".time").on("submit", '#time', function(e){
    e.preventDefault()
    var path = $(this).attr('action')
    var current =$(this).parent().parent()

    $.ajax({
      url: path,
      type: "PUT",
      data: $(this).serialize(),
      dataType: 'json'
    }).done(function(data){
      var matching_start_div_time = parseInt(data.start_time.split(':')[0])
      var matching_end_div_time = parseInt(data.end_time.split(':')[0])
      if (matching_end_div_time === 0){
        matching_end_div_time = 24
      }

      for (var i=matching_start_div_time;i<matching_end_div_time;i++){
        if (i<10){
          $('.0'+i).css("background-color",data.color)
          $('.0'+i).find('p').text(data.name+' At '+data.address)
          current.css("display","none")
          current.parent().find('.date').css("display","table-row")
        } else {
          debugger
          $('.'+i).css("background-color",data.color)
          $('.'+i).find('p').text(data.name+' At '+data.address)
          current.css("display","none")
          current.parent().find('.date').css("display","table-row")
        }
      }
    })
  })

});

function placeTemplate(place){
  var user_id_path = $('.place_item_template').find('form').attr('action')
  var template = $('#template').clone()
  template.find('h2').text(place.name)
  template.find('p.address').text(place.vicinity)
  template.find('img').attr('src',place.icon)
  rating = "Rating: " + place.rating
  if (place.rating === undefined){
    rating = "Rating: Unavailable"
  }
  template.find('p.rating').text(rating)

  template.find('form').attr('action', user_id_path+'?name='+place.name+'&address='+place.vicinity)
  return template
}


