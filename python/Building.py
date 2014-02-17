from google.appengine.ext import db

class Building(db.Model):
	name = db.StringProperty(required=True)
	position = db.IntegerProperty(required=True)
	type = db.StringProperty(required=True, choices=set(["building", "pub", "shop"]), default="building")
	colour = db.StringProperty(required=True)
	cost = db.IntegerProperty(required=True)
	houses = db.IntegerProperty(required=True, default=0)
	owner = db.UserProperty(required=False)
	rent = db.ListProperty(item_type=int)
	buildCost = db.IntegerProperty(required=False)
	mortgaged = db.BooleanProperty(required=True, default=False)
