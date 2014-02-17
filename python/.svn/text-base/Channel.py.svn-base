import json
import logging
import random
import sys
from google.appengine.api import channel
from Game import Game
from Player import Player

class Channel :

	def __init__(self):
		pass
		
	def createToken(self, user, game_key) :
		#Creates a channel and returns token to the calling function which needs to be passed to the client
		return channel.create_channel(str (user.user_id()) + str(game_key))
		
	def sendMessage(self, user, game, message) :
		#Sends a message to a given user in a given game
		channel.send_message(user.user_id() + str(game.key().id_or_name()), json.dumps(message))
		logging.info ("Sent to %s: %s", user.user_id(), message)
		
	def sendMessageToAll(self, game, message) :
		#Sends a message to all players in a game
		query = Player.gql("WHERE ANCESTOR IS :1", game)
		players = query.fetch(4)
		for player in players:
			self.sendMessage(player.user, game, message)
	
	def clientDisconnected(self, clientID) :
		#Gets the player and the game of which the client just disconnected
		#The client ID is created from the user id and the game key. (It's pretty hard to recreate confidently, so it's stored with the player)
		query = Player.gql("WHERE clientID = :1", clientID)
		player = query.get()
		#can't import game updater here due to infinite import loop. Return player and the game to request handler
		return [player, player.parent()]
		
	def clientConnected(self, clientID) :
		#Can do something when a client connects to a channel. Have no use for this at the moment.
		pass
		
		
	