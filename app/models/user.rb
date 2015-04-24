class User < ActiveRecord::Base
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create
  validates :email, uniqueness: true
  validates :password, presence: true
  has_many :places

  include BCrypt

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @new_password = new_password
    @password = Password.create(new_password)
    self.password_hash = @password
  end

  validate :validate_password_length!

  private

  def validate_password_length!
    if @new_password && @new_password.length < 6
      errors.add(:password, 'too short')
    end
  end

end