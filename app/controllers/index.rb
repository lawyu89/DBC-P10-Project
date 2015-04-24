get '/' do
  session[:id] = nil if current_user.nil?
  erb :index
end

#----------- SESSIONS -----------

get '/login' do
  @email
  erb :login
end

post '/login' do
  @error
  @email = params[:email]
  @user = User.where(email: params[:email]).first
  if login?(params[:email], params[:password])
    session[:id] = User.where(email: params[:email]).first.id
    redirect "/"
  else
    @error = "Incorrect Email/Password Combination"
    erb :login
  end
end

delete '/logout' do
  session[:id] = nil
  redirect '/'
end

#----------- USERS -----------

get '/signup' do
  @user = User.new
  erb :sign_up
end

post '/signup' do
  @user = User.new
  @user.first_name = params[:first_name]
  @user.last_name = params[:last_name]
  @user.email = params[:email]
  @user.password = params[:password]

  if @user.save
    session[:id] = @user.id
    redirect '/'
  else
    erb :sign_up
  end
end

post '/users/:id' do
  @place = Place.new
  @place.name = params[:name]
  p params[:name].to_s
  @place.address = params[:address]
  current_user.places << @place
  @place.save
end

delete '/users/:id' do
  @place = Place.where(address: params[:address]).first
  @place.destroy
end

get '/places' do
  distance = params[:distance]
  num = distance.split(' ')[0].to_f
  radius = (num*1609.34).floor.to_s
  address = CGI.escape(params[:address])
  api_key = ENV["API_KEY"]
  location_response = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ address + "&key=" + api_key)
  location = location_response.to_json.scan(/\"location":\{"lat":\-?\d+.?\d+,\"lng":\-?\d+\.?\d+\}/)
  lat = location[0].scan(/(\-?\d+\.?\d+)/)[0][0]
  lng = location[0].scan(/(\-?\d+\.?\d+)/)[1][0]
  place_response = HTTParty.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+"&radius="+radius+"&ratings=4+&types=park%7Cmusuem%7Cfood%7Cstadium%7Cbar%7Camusement_park%7Cnight_club%7Caquarium%7Cart_gallery%7Ccafe%7Cresturant%7Cshopping_mall%7Ccasino%7Czoo&key="+ENV["API_KEY"])
  place_response.to_json
end

get '/places/:next_page' do
  place2_response = HTTParty.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+params[:next_page]+"&key="+ENV["API_KEY"])
  place2_response.to_json
end

get '/users/:id/places' do
  if current_user.nil?
    redirect '/'
  end
  erb :place_index
end

post '/change_date' do
  date = DateTime.parse(params[:date])
  formatted_date = "#{date.month}/#{date.day}/#{date.year}"
  {date: formatted_date}.to_json
end

delete '/users/:id/places/:place_id' do
  place = Place.where(id: params[:place_id]).first
  place.destroy
end

put '/users/:id/places/:place_id' do
  place = Place.where(id: params[:place_id]).first
  place.start_time = params[:start_time]
  place.end_time = params[:end_time]
  place.color = params[:color]
  place.save
  return place.to_json
end