from google.appengine.ext import db

class Game(db.Model):
	turn = db.IntegerProperty(required=True, default=-1)
	pieces = db.StringListProperty(required=True, default=["mortarboard", "dolphin", "book", "glass"])
	colours = db.StringListProperty(required=True, default=["FF0000", "19A82C", "0000FF", "FFE303"])
	inProgress = db.BooleanProperty(required=True, default=False)
	rollRemaining = db.BooleanProperty(required=True, default=True)
	numRolls = db.IntegerProperty(required=True, default = 0)
	lastDiceTotal = db.IntegerProperty(required=True, default = 0)
