from google.appengine.ext import db

class EventCard(db.Model):
	#"Event" determines what "value" means and what action to take. Key shown below:
	# 0: Income - value is an int, player recieves (or loses, if value is negative) that much money in &pound;
	# 1: Move - value is an int, player moves forwards (or backwards, if value is negative) that many spaces
	# 2: MoveTo - value is an int in range 0-39 (inclusive), player moves to that location on the board
	# 3: PayAll - value is an int, player pays (or receives, if value is negative) that much money to/from each player
	# 4: Jail - value is int, 1 = GoToJail, 0 = GetOutOfJail
	# 5: Utilty - value is not needed (int = 0), just move to the nearest Shop
	# 6: Station - value is not needed (int = 0), just move to the nearest Pub
	# 7: Pay per property - 2nd value property used, both int, 1st per office/house, 2nd per lab/hotel

	text = db.StringProperty(required=True, default="card")
	event = db.IntegerProperty(required=True, default=0)
	value = db.IntegerProperty(required=True, default=0)
	#This is included for pay x per house and y per hotel. Redundant for all others
	value2 = db.IntegerProperty(required=False, default=0)
	drawn = db.BooleanProperty(required=True, default=False)
	#True - comm chest, False - chance
	isChance = db.BooleanProperty(required=True, default=False)
