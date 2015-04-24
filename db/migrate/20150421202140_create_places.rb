class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :name
      t.string :address
      t.string :start_time
      t.string :end_time
      t.string :color
      t.integer :user_id
    end
  end
end
