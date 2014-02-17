import sys
import webapp2
from python.GameUpdater import GameUpdater
from google.appengine.api import users
from python.Game import Game
from python.Channel import Channel
import random
import json
import logging

class HomeHandler(webapp2.RequestHandler):
	def get(self):
		user = users.get_current_user()
		if not user:
			self.redirect(users.create_login_url(self.request.uri)) #send to google login script
			return #end the script
		#else return the page with the user id in it
		page = open('game.html', 'r')
		self.response.headers['Content-Type'] = 'text/html' #set the content type to html
		self.response.write(page.read())
		page.close()

		self.response.write('<form id="login" action="" method="post"><input type="hidden" id="user_id" value="' + user.user_id() + '">')

		if self.request.get('join'):
			game_key = self.request.get('join')
			self.response.write('<input type="hidden" id="game_key" value="' + game_key + '">')

		self.response.write('</form>') #add a form with a hidden user_id field to the page
		page = open('game_footer.html', 'r')
		self.response.write(page.read())
		page.close() 

class GameSetupHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		game_key = self.request.get("game_key")
		self.channel = Channel()
		if not game_key:
			#if the client did not specify a game_key, then obviously they have no friends so we'll create a game_key for them
			game_key = str(random.getrandbits(32)) + user.user_id() # a relatively long pseudo random number should ensure enough uniqueness that we require (after all, it's not secret!)
			token = self.channel.createToken(user, game_key)

			self.game = Game(key_name = str(game_key))
			self.game.put()
			gameupdater = GameUpdater(self.game)
			gameupdater.setup()
			
			self.response.headers['Content-Type'] = 'application/json'
			self.response.write(json.dumps({'game_key': game_key, 'token' : token})) #Return a JSON with the token inside		
		else:
			game = Game.get_by_key_name(self.request.get('game_key'))
			if not game :
				self.response.headers['Content-Type'] = 'application/json'
				self.response.write(json.dumps({'error' : 'no game exists'})) #Return a JSON with the token inside
			else :
				game_key =  self.request.get('game_key')
				token = self.channel.createToken(user, game_key)
				self.response.headers['Content-Type'] = 'application/json'
				self.response.write(json.dumps({'game_key': game_key, 'token' : token})) #Return a JSON with the token inside


class GameRollHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		if not user:
			self.response.headers['Content-Type'] = 'application/json'
			self.response.write(json.dumps({'status': 'no_login'}))
			return #end the script
		game = Game.get_by_key_name(self.request.get('game_key'))
		gu = GameUpdater(game)
		gu.rollTheDice(user)

class GameLeaveJailHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		if not user:
			self.response.headers['Content-Type'] = 'application/json'
			self.response.write(json.dumps({'status': 'no_login'}))
			return #end the script
			
		method = self.request.get("method")
		user = users.get_current_user()
		game = Game.get_by_key_name(self.request.get('game_key'))
		gu = GameUpdater(game)
		gu.leaveJail(user, method)

class GameEditPropertyHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		game = Game.get_by_key_name(self.request.get('game_key'))
		action = self.request.get('action')
		property = self.request.get('property')
		gu = GameUpdater(game)
		if action == 'buy' :
			gu.buyHouse(user, property)
		elif action == 'sell' :
			#gu.sellHouse(user, property)
			pass

class GameStartHandler(webapp2.RequestHandler):
	def post(self):
		#start game(game_key) iff client_id is the game creator
		game = Game.get_by_key_name(self.request.get('game_key'))
		gu = GameUpdater(game)
		gu.startGame()

class GameAddPlayerHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		if not user:
			self.response.headers['Content-Type'] = 'application/json'
			self.response.write(json.dumps({'status': 'no_login'}))
			return #end the script
		game_key = self.request.get('game_key')
		game = Game.get_by_key_name(game_key)
		gu = GameUpdater(game)
		gu.addPlayer(user, self.request.get('name'), game_key) 

class GameEndTurnHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		if not user:
			self.response.headers['Content-Type'] = 'application/json'
			self.response.write(json.dumps({'status': 'no_login'}))
			return #end the script
		else:
			game = Game.get_by_key_name(self.request.get('game_key'))
			gu = GameUpdater(game)
			gu.endPlayerTurn(user)

class GameBuyPropertyHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		game = Game.get_by_key_name(self.request.get('game_key'))
		gu = GameUpdater(game)
		gu.buyProperty(user)
		
class ChannelConnectedHandler(webapp2.RequestHandler):
	def post(self):
		self.channel = Channel()
		self.channel.clientConnected(self.request.get("from"))
		
class ChannelDisconnectedHandler(webapp2.RequestHandler):
	def post(self):
		self.channel = Channel()
		data = self.channel.clientDisconnected(self.request.get("from"))
		#Data is a list which has the player and the game, in that order)
		if data[1] : 
			gu = GameUpdater(data[1])
			gu.leaveGame(data[0])
		
class GameChatHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		game = Game.get_by_key_name(self.request.get('game_key'))
		gu = GameUpdater(game)
		gu.chat(user, self.request.get('message'))
	
class GameLobbyHandler(webapp2.RequestHandler) :
	def post(self):
		query = Game.gql("WHERE inProgress = False")
		games = query.fetch(20)
		self.response.headers['Content-Type'] = 'application/json'
		output = []
		for game in games :
			output.append({'key' : game.key().name(), 'players' : 4 - len(game.pieces)})
		self.response.write(json.dumps(output))
		
class GameMortgageHandler(webapp2.RequestHandler) :
	def post(self):
		user = users.get_current_user()
		game = Game.get_by_key_name(self.request.get('game_key'))
		GameUpdater(game).mortgageProperty(user, self.request.get('property_id'))
		
class GameUnmortgageHandler(webapp2.RequestHandler) :
	def post(self):
		user = users.get_current_user()
		game = Game.get_by_key_name(self.request.get('game_key'))
		GameUpdater(game).unmortgageProperty(user, self.request.get('property_id'))
		
app = webapp2.WSGIApplication([
	(r'/play', HomeHandler),
	(r'/game/setup', GameSetupHandler),
	(r'/game/roll', GameRollHandler),
	(r'/game/leave_jail', GameLeaveJailHandler),
	(r'/game/edit_property', GameEditPropertyHandler),
	(r'/game/start', GameStartHandler),
	(r'/game/add_player', GameAddPlayerHandler),
	(r'/game/end_turn', GameEndTurnHandler),
	(r'/game/chat', GameChatHandler),
	(r'/game/lobby', GameLobbyHandler),
	(r'/game/buy_property', GameBuyPropertyHandler),
	(r'/game/unmortgage_property', GameUnmortgageHandler),
	(r'/game/mortgage_property', GameMortgageHandler),
	(r'/_ah/channel/connected/', ChannelConnectedHandler),
	(r'/_ah/channel/disconnected/', ChannelDisconnectedHandler),
]) 
