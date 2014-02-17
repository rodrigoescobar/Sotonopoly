from google.appengine.ext import db

class Player(db.Model):
	user = db.UserProperty(required=True)
	name = db.StringProperty(required=True)
	turnNumber = db.IntegerProperty(required=True)
	piece = db.StringProperty(required=True)
	colour = db.StringProperty(required=True)
	money = db.IntegerProperty(required=True, default=1500)
	position = db.IntegerProperty(required=True, default=0)
	# -1: Not in jail, 0..3: In jail for x turns
	inJail = db.IntegerProperty(required=True, default=-1)
	# Has x get out of jail free cards
	getOutOfJailFree = db.IntegerProperty(required=True, default=0)
	bankrupt = db.BooleanProperty(required=True, default=False)
	clientID = db.StringProperty(required=True)
