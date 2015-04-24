helpers do

  def current_user
    @current_user ||= User.where(id: session[:id]).first if session[:id]
  end

  def login?(email,password)
    user = User.where(email: email).first
    return false if user.nil?
    user.password = password
  end
end
