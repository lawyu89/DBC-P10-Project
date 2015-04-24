$(document).ready(function () {

  // Optional - Use AJAX to send an HTTP DELETE request for the sign-out link

  $("form#search").on("submit",function(event){
    event.preventDefault()
    $.ajax({
      url: '/places',
      type: 'GET',
      dataType: 'json',
      data: $(this).serialize()
    }).done(function(data){
      var results = data.results
      prev_results = $('.results').children()

      if (prev_results.length>0){
        for(var i=0;i<prev_results.length;i++){
        $('#template').remove()
        }
      }
      for(var i=0;i<results.length;i++){
        $('.results').append(placeTemplate(results[i]))
      }
      next_page_token = data.next_page_token
      $('form#add').on('submit',function(event){
        current =$(this)
        event.preventDefault()
        path = $(this).attr("action")
        $.ajax({
          url: path,
          type: "POST"
        }).done(function(){
          current.attr('id',"delete")
          current.find('input').attr('value', "Remove From List")
          current.append('<input type="hidden" name="_method" value="delete"/>')
          current.css("background","blue")
        })
      })
      $('.results').append('<form id="next_page" method="get"action="/places/'+next_page_token+'"><input type="submit" value="See More Results"></form>')

      $("form#next_page").on("submit",function(event){
        event.preventDefault()
        path = $(this).attr("action")
        $.ajax({
          url: path,
          type: 'GET',
          dataType: 'json',
          data: $(this).serialize()
      }).done(function(data){
        var results = data.results
        for(var i=0;i<results.length;i++){
          $('.results').append(placeTemplate(results[i]))
      }
      next_page_token = data.next_page_token

      $('.results').append('<form id="next_next_page" method="get"action="/places/'+next_page_token+'"><input type="submit" value="See More Results"></form>')
      $("form#next_next_page").on("submit",function(event){
        event.preventDefault()
        path = $(this).attr("action")
        $.ajax({
          url: path,
          type: 'GET',
          dataType: 'json',
          data: $(this).serialize()
          }).done(function(data){
            var results = data.results
            for(var i=0;i<results.length;i++){
            $('.results').append(placeTemplate(results[i]))
            }
          })
          })
        })
      })
    })
  })
});

function placeTemplate(place){
  var template = $('#template').clone()
  template.find('h2').text(place.name)
  template.find('p.address').text(place.vicinity)
  template.find('img').attr('src',place.icon)
  rating = "Rating: " + place.rating
  if (place.rating === undefined){
    rating = "Rating: Unavailable"
  }
  template.find('p.rating').text(rating)
  user_id_path = template.find('form').attr('action')
  template.find('form').attr('action', user_id_path+'?name='+place.name+'&address='+place.vicinity)
  return template
}

