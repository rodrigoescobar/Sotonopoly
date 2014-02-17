import json
import logging
import random
import sys
import cgi
from Game import Game
from Building import Building
from Player import Player
from EventCard import EventCard
from Channel import Channel
from google.appengine.ext import db

class GameUpdater:

	def __init__(self, TheGame):
		self.game = TheGame

	def setup(self):	
		self.initBuildings()
		self.init_chance_cards()
		self.init_community_chest_cards()

	def initBuildings(self):
		buildings = []

		buildings.append(Building(parent=self.game, name="Avenue Campus", position = 1, colour="954c23", cost=60, rent=[2, 10, 30, 90, 160, 250], buildCost=50))
		buildings.append(Building(parent=self.game, name="Winchester Campus", position = 3, colour="954c23", cost=60, rent=[4, 20, 60, 180, 320, 450], buildCost=50))

		buildings.append(Building(parent=self.game, name="Shackleton", position = 6, colour="34c1f1", cost=100, rent=[6, 30, 90, 270, 400, 550], buildCost=50))
		buildings.append(Building(parent=self.game, name="Management", position = 8, colour="34c1f1", cost=100, rent=[6, 30, 90, 270, 400, 550], buildCost=50))
		buildings.append(Building(parent=self.game, name="Music", position = 9, colour="34c1f1", cost=120, rent=[8, 40, 100, 300, 450, 600], buildCost=50))

		buildings.append(Building(parent=self.game, name="Law", position = 11, colour="ea3777", cost=140, rent=[10, 50, 150, 450, 625, 750], buildCost=100))
		buildings.append(Building(parent=self.game, name="Murray Building", position = 13, colour="ea3777", cost=140, rent=[10, 50, 150, 450, 625, 750], buildCost=100))
		buildings.append(Building(parent=self.game, name="Nuffield Theatre", position = 14, colour="ea3777", cost=160, rent=[12, 60, 180, 500, 700, 900], buildCost=100))

		buildings.append(Building(parent=self.game, name="Politics", position = 16, colour="f17e24", cost=180, rent=[14, 70, 200, 550, 750, 950], buildCost=100))
		buildings.append(Building(parent=self.game, name="Tizard", position = 18, colour="f17e24", cost=180, rent=[14, 70, 200, 550, 750, 950], buildCost=100))
		buildings.append(Building(parent=self.game, name="Psycology", position = 19, colour="f17e24", cost=200, rent=[16, 80, 220, 600, 800, 1000], buildCost=100))

		buildings.append(Building(parent=self.game, name="Physics", position = 21, colour="ed3923", cost=220, rent=[18, 90, 250, 700, 875, 1050], buildCost=150))
		buildings.append(Building(parent=self.game, name="Maths", position = 23, colour="ed3923", cost=220, rent=[18, 90, 250, 700, 875, 1050], buildCost=150))
		buildings.append(Building(parent=self.game, name="Lanchester", position = 24, colour="ed3923", cost=240, rent=[20, 100, 300, 750, 925, 1100], buildCost=150))

		buildings.append(Building(parent=self.game, name="Eustice", position = 26, colour="fbe406", cost=260, rent=[22, 110, 330, 800, 975, 1150], buildCost=150))
		buildings.append(Building(parent=self.game, name="Graham Hills", position = 27, colour="fbe406", cost=260, rent=[22, 110, 330, 800, 975, 1150], buildCost=150))
		buildings.append(Building(parent=self.game, name="Chemistry", position = 29, colour="fbe406", cost=280, rent=[22, 120, 360, 850, 1025, 1200], buildCost=150))

		buildings.append(Building(parent=self.game, name="Nightingale", position = 31, colour="10a459", cost=300, rent=[26, 130, 390, 900, 1100, 1275], buildCost=200))
		buildings.append(Building(parent=self.game, name="EEE", position = 32, colour="10a459", cost=300, rent=[26, 130, 390, 900, 1100, 1275], buildCost=200))
		buildings.append(Building(parent=self.game, name="Life Sciences", position = 34, colour="10a459", cost=320, rent=[28, 150, 450, 1000, 1200, 1400], buildCost=200))

		buildings.append(Building(parent=self.game, name="Zepler", position = 37, colour="284ea1", cost=350, rent=[35, 175, 500, 1100, 1300, 1500], buildCost=200))
		buildings.append(Building(parent=self.game, name="Mountbatten", position = 39, colour="284ea1", cost=400, rent=[50, 200, 600, 1400, 1700, 2000], buildCost=200))

		buildings.append(Building(parent=self.game, name="The Stag's Head", position = 5, type="pub", colour="ffffff", cost=200, rent=[25, 50, 100, 200]))
		buildings.append(Building(parent=self.game, name="The Stile", position = 15, type="pub", colour="ffffff", cost=200, rent=[25, 50, 100, 200]))
		buildings.append(Building(parent=self.game, name="The Crown Inn", position = 25, type="pub", colour="ffffff", cost=200, rent=[25, 50, 100, 200]))
		buildings.append(Building(parent=self.game, name="The Bridge Bar", position = 35, type="pub", colour="ffffff", cost=200, rent=[25, 50, 100, 200]))
		
		buildings.append(Building(parent=self.game, name="The Shop", position = 12, type="shop", colour="fefefe", cost=150))
		buildings.append(Building(parent=self.game, name="The Cafe", position = 28, type="shop", colour="fefefe", cost=150))

		db.put(buildings)

	def init_community_chest_cards(self):

		community_chest_cards = []

		community_chest_cards.append(EventCard(parent=self.game,text="Advance to Go.",event=2,value=0,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You help out on University Open Day. Collect &pound;75",event=0,value=75,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="Go to see a UniFilm. Pay &pound;50.",event=0,value=-50,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You skip a lecture - go straight to the library. Do not pass go. Do not collect &pound;200",event=4,value=1,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="Your ISP refunds you for terrible service. You receive &pound;50",event=0,value=50,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="It's your birthday! Collect &pound;10 drinks money from each player.",event=3,value=-10,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You find money left in a taxi. Collect &pound;20",event=0,value=20,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="Student finance actually pays out. Collect &pound;200.",event=0,value=200,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You have to buy new textbooks. Pay &pound;100.",event=0,value=-100,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You receive a fine for inappropriate behaviour in a taxi. Pay &pound;50",event=0,value=-50,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You win a pub quiz. Receive &pound;25.",event=0,value=25,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="Your properties are damaged by fire. Pay &pound;40 per office; &pound;115 per lab.",event=7,value=40,value2=115,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You win second place in Stag's Karaoke! Collect &pound;10.",event=0,value=10,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="Parents visit and take you shopping. Receive &pound;100.",event=0,value=100,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="You sell some furniture. Collect &pound;50",event=0,value=50,isChance=False))
		community_chest_cards.append(EventCard(parent=self.game,text="Your department has discovered something! Collect &pound;100.",event=0,value=100,isChance=False))

		db.put (community_chest_cards)

	def init_chance_cards(self):
	
		chance_cards = []

		chance_cards.append(EventCard(parent=self.game,text="Advance to Go. Collect &pound;200.", event=2,value=0,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Advance to Mountbatten. If you pass go, collect &pound;200.", event=2,value=39,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="It's reading week! Advance to Murray Building. If you pass go, collect &pound;200.", event=2,value=13,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="You get free stuff from the Freshers' Fair. Collect &pound;50", event=0,value=50,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Get out of the library for free. Keep this until required", event=4,value=0,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="The University internet is broken. Move back 3 spaces while it is repaired.", event=1,value=-3,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Go directly to the library. Do not pass go. Do not collect &pound;200.", event=4,value=1,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Buy new equipment for your properties. You must pay &pound;50 for each office; &pound;100 for each lab.", event=7,value=50,value2=100,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Pay a tax for being a poor student. &pound;15.", event=0,value=-15,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="ECSS event. Go to The Bridge Bar. If you pass Go, collect &pound;200.", event=2,value=5,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="You have been elected SUSU president! Pay each player &pound;50.", event=3,value=50,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Your council tax has been refunded. Collect &pound;150.", event=0,value=150,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="You have been granted a scholarship. Collect &pound;100.", event=0,value=100,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Advance token to the nearest Shop. If unowned, you may buy it from the Bank. If owned, pay the owner the rent to which they are entitled.", event=5,value=0,isChance=True))
		chance_cards.append(EventCard(parent=self.game,text="Advance token to the nearest Pub. If unowned, you may buy it from the Bank. If owned, pay the owner the rent to which they are entitled.", event=6,value=0,isChance=True))

		db.put (chance_cards);
		
	def addPlayer(self, userObj, userName, game_key):
		if (not self.game.inProgress):
			#Check number of players
			#Escape user name
			userName = cgi.escape(userName)
			
			#Check if name is null
			if len(userName) < 1 :
				self.messagePlayer(userObj, {'error' : 'name is empty'})
				return
			
			numberOfPlayers = self.getNumberOfPlayers()

			#Check user is not in use already
			query = Player.gql("WHERE ANCESTOR IS :1", self.game)
			players = query.fetch(3)
			for player in players :
				if player.user == userObj :
					#user in use, throw an error saying they can't use the user
					message = {'error' : 'Your account is already being used in this game'}
					self.messagePlayer(userObj, message)
					return

			#add player
			playerColour = self.game.colours[0]
			self.game.colours.remove(playerColour)
			playerPiece = self.game.pieces[0]
			self.game.pieces.remove(playerPiece)
			self.game.put()
			
			playerArray = []
			for play in players:
				playerArray.append({'name': play.name, 'colour' : play.colour, 'piece' : play.piece, 'money' : play.money, 'position' : play.position})
			
			message = {'status' : 'current_players', 'current_players' : playerArray}

			self.messagePlayer(userObj, message)

			player = Player(parent=self.game, user = userObj, name = userName, turnNumber = -1, piece = playerPiece, colour = playerColour, clientID = (str (userObj.user_id()) + str(game_key)))
			player.put()
			
			message = {'status' : 'player_joined', 'name': userName, 'colour' : playerColour, 'piece' : playerPiece, 'money' : 1500, 'position' : 0}
			self.messageAll(message)
			
			message = {'status' : 'you', 'piece' : playerPiece, 'colour' : playerColour}
			self.messagePlayer(userObj, message)

			if (numberOfPlayers + 1 == 4):
				self.startGame()
		else:
			message = {'error' : 'The game has already started'}
			self.messagePlayer(userObj, message)

	def startGame(self):
		if self.game.inProgress :
			self.messagePlayer(player.user, {'error' : 'The game has already been started'})
		elif self.getNumberOfPlayers() < 2 :
			self.messagePlayer(player.user, {'error' : 'Not enough players'})
		else :	
			#Set game variables so the game can start
			self.game.inProgress = True
			self.game.turn = 1
			self.game.rollRemaining = True
			self.game.numRolls = 0
			self.game.put()
			
			#Create turn numbers
			query = Player.gql("WHERE ANCESTOR IS :1", self.game)
			players = query.fetch(4)
			number = 0
			playersString = {}
			for player in players :
				number+= 1
				player.turnNumber = number
				playersString[player.piece] = number
			#Store all players
			db.put(players)
			
			#Message the players with the mappings 
			self.messageAll({'status' : 'game_started', 'turns' : playersString})
			self.messageAll({'status' : 'turn', 'turn_number' : 1})
			

	def messagePlayer(self, user, message):
		channel = Channel()
		channel.sendMessage(user, self.game, message)

	def messageAll(self, message):
		channel = Channel()
		channel.sendMessageToAll(self.game, message)

	def rollTheDice(self, user) :
		#Check it's players turn
		if self.game.inProgress :
			if self.checkPlayerTurn(user) :
				if self.game.rollRemaining :
					
					player = self.getCurrentPlayer() #Get the player

					die1, die2 = self.diceRoll() #Get the die rolls
					self.game.lastDiceTotal = die1 + die2
					self.game.numRolls = self.game.numRolls + 1 #The user had a roll
					self.game.put()

					player = self.getCurrentPlayer() #Get the player

					if (die1 == die2):
						#It's a double!
						self.game.rollRemaining = True
						if player.inJail != -1 :
							player.inJail = -1
							player.put()
							self.messageAll({'status' : 'left_jail', 'method' : 'double'})
					else :
						self.game.rollRemaining = False #Prevents a user from rolling the dice again
					
					if self.game.rollRemaining and self.game.numRolls >= 3:
						#Jail time
						self.goToJail(player)
						self.messageAll({'status' : 'triple_doubles', 'player_id' : self.game.turn, 'die1' : die1, 'die2' : die2, 'move_to' : 10})

					elif 3 > player.inJail > -1:
						self.messageAll({'status' : 'die_roll', 'player_id' : self.game.turn, 'die1' : die1, 'die2' : die2})
						player.inJail += 1
				
						if player.inJail == 3 :
							player.inJail = -1
							self.transferMoney(50, player)
							message = {'status' : 'left_jail', 'player_id' : self.game.turn, 'method' : 'paid', 'money_change' : '-50', 'money' : player.money}
							self.messageAll(message)
							
					else :
						self.messageAll({'status' : 'die_roll', 'player_id' : self.game.turn, 'die1' : die1, 'die2' : die2, 'move_to' : (player.position+die1+die2) % 40})
						self.movePlayer(player, die1 + die2)
					player.put()
					self.game.put()
				else :
					message = {'error' : 'You have already rolled'}
					self.messagePlayer(user, message)
			else:
				message = {'error' : 'It is not your turn'}
				self.messagePlayer(user, message)
		else :
			message = {'error' : 'The game has not started'}
			self.messagePlayer(user, message)
	
	def goToJail(self, player):
		player.position = 10
		player.inJail = 0
		player.put()
		self.game.rollRemaining = False
		self.game.put()
	
	def checkPlayerTurn(self, user):
		if (self.getCurrentPlayer().user == user):
			return True
		else:
			return False

	def getCurrentPlayer(self):
		query = Player.gql("WHERE ANCESTOR IS :1 AND turnNumber = :2", self.game, self.game.turn)
		result = query.get()
		if (result == None or result.bankrupt == True):
			self.messageAll({'error' : 'Player not playing'})
		else:
			return result
			
	def checkPlayerPlaying(self):
		query = Player.gql("WHERE ANCESTOR IS :1 AND turnNumber = :2", self.game, self.game.turn)
		result = query.get()
		if (result == None or result.bankrupt == True):
			self.game.turn += 1
			self.game.put()
			self.checkPlayerPlaying()


	def getNumberOfPlayers(self):
		query = Player.gql("WHERE ANCESTOR IS :1", self.game)
		return query.count(4)

	def diceRoll(self):
		die1 = random.randint(1,6)
		die2 = random.randint(1,6)
		return (die1, die2)

	def setPlayerPosition(self, player, newPosition):
		if (newPosition <= player.position):
			player.money += 200
			self.messageAll({'status' : 'passed_go', 'player_id' : self.game.turn, 'money_change' : '+200', 'money' : player.money})
		player.position = newPosition
		player.put()
		
		self.actOnPosition(player)

	def movePlayer(self, player, places):
		newPosition = (player.position + places)%40
		if (newPosition <= player.position and places > 0):
			player.money += 200
			self.messageAll({'status' : 'passed_go', 'player_id' : self.game.turn, 'money_change' : '+200', 'money' : player.money})
		player.position = newPosition
		player.put()
		
		self.actOnPosition(player)
		
	def actOnPosition(self, player):
		
		pos = player.position
		
		#Community Chest
		if ((pos == 2) or (pos == 17) or (pos == 33)):
			self.drawCard(False, player)
		
		#Chance
		elif((pos == 7) or (pos == 22) or (pos == 36)):
			self.drawCard(True, player)
		
		#Income Tax
		elif(pos == 4):
			self.transferMoney(200, player)
			self.messageAll({'status' : 'tax', 'player_id' : self.game.turn, 'money_change' : '-200', 'money' : player.money})
			
		#Super Tax
		elif(pos == 38):
			self.transferMoney(100, player)
			self.messageAll({'status' : 'tax', 'player_id' : self.game.turn, 'money_change' : '-100', 'money' : player.money})
		
		#Jail
		elif(pos == 30):
			self.goToJail(player)
			self.messageAll({'status' : 'go_to_jail', 'player_id' : self.game.turn, 'position' : 10})
			
		#Free Parking/Just Visiting/Go
		elif((pos == 0) or ((pos == 10) and (player.inJail == -1)) or (pos == 20)):
			pass
		
		#Property
		else:
			query = Building.gql("WHERE ANCESTOR IS :1 AND position = :2", self.game, pos)
			building = query.get()
			
			if(building.mortgaged == False and building.owner != None and building.owner != player.user):
				query = Player.gql("WHERE ANCESTOR IS :1 AND user = :2", self.game, building.owner)
				buildingOwner = query.get()
				rent = self.calculateRent(buildingOwner, building, self.game.lastDiceTotal)
				self.transferMoney(rent, player, buildingOwner)
				
				#Send a message to the clients that rent is to be paid
				self.messageAll({'status' : 'rent', 'player_id' : player.turnNumber, 'property_owner' : buildingOwner.turnNumber, 'amount' : rent, 'player_money' : player.money, 'owner_money' : buildingOwner.money})
		
		
	def endPlayerTurn(self, userObj):
		if self.game.inProgress:
			if (self.checkPlayerTurn(userObj)):
				#if user turn
				player = Player.gql("WHERE ANCESTOR IS :1 AND user = :2", self.game, userObj).get()
				if self.game.rollRemaining :
					message = {'error' : 'roll remaining'}
					self.messagePlayer(userObj, message)
				elif player.money <= 0:
					message = {'error' : 'You do not have enough money to continue. Mortgage a property or sell houses'}
					self.messagePlayer(userObj, message)
				
				else :
					self.game.rollRemaining = True
					self.game.numRolls = 0
					self.game.turn = self.game.turn + 1
					if self.game.turn > self.getNumberOfPlayers():
						self.game.turn = 1
					#Check for bankrupt players
					self.checkPlayerPlaying()
					self.game.put()
					message = {'status' : 'player_ended_turn', 'turn_number' : self.game.turn}
					self.messageAll(message)
			else:
				message = {'error' : 'Not your turn'}
				self.messagePlayer(userObj, message)
		else :
			message = {'error' : 'The game has not started'}
			self.messagePlayer(userObj, message)
	
	def calculateRent(self, player, building, dice = None):
		#Rent for buildings
		if (building.type == "building"):
			query = Building.gql("WHERE ANCESTOR IS :1 AND colour = :2 AND owner = :3", self.game, building.colour, player.user)
			count = query.count(3)
			if (building.houses == 0 and (((building.colour == "954c23" or building.colour == "284ea1") and count == 2) or count == 3)):
				return building.rent[0] * 2
			elif(0 <= building.houses <= 5):
				return building.rent[building.houses]
			else:
				message = {'error' : 'Invalid number of houses. Contact a game admin.'}
				self.messageAll(message)
				sys.exit()
		
		#Rent for pubs
		elif (building.type == "pub"):
			query = Building.gql("WHERE ANCESTOR IS :1 AND type = 'pub' AND owner = :2", self.game, player.user)
			count = query.count(4)
			return building.rent[count-1]
			
		#Rent for shops
		elif (building.type == "shop"):
			query = Building.gql("WHERE ANCESTOR IS :1 AND type = 'shop' AND owner = :2", self.game, player.user)
			count = query.count(2)
			if(count == 1):
				return 4 * (dice)
			elif(count ==2):
				return 10 * (dice)
			else:
				message = {'error' : 'Property number error. Contact a game admin.'}
			self.messagePlayer(player.user, message)
		else:
			message = {'error' : 'Invalid building type. Contact a game admin.'}
			self.messagePlayer(player.user, message)
			sys.exit()
			
	def transferMoney(self, amount, playerFrom, playerTo=None):
		if(playerFrom.money > amount):
			playerFrom.money -= amount
			playerFrom.put()
			
			if(playerTo != None):
				playerTo.money += amount
				playerTo.put()
			
		else:
			query = Building.gql("WHERE ANCESTOR IS :1 AND owner = :2 AND mortgaged = False", self.game, playerFrom.user)
			buildings = query.fetch(100)
			mortgageValue = 0
			
			for building in buildings:
				mortgageValue += building.houses * (building.buildCost/2)
				mortgageValue += building.cost/2
			
			playerFrom.money -= amount
			playerFrom.put()
				
			if(mortgageValue > amount):
				message = {'status' : 'force_mortgage', 'amount' : (-1 * playerFrom.money)+1}
				self.messagePlayer(playerFrom.user, message)
			else:
				playerFrom.bankrupt = True
				playerFrom.put()
				message = {'status' : 'bankrupt', 'player' : playerFrom.turnNumber}
				self.messageAll(message)
				
				query = Player.gql("WHERE ANCESTOR IS :1 AND Bankrupt = False", self.game)
				count = query.count(2)
				if(count == 1):
					message = {'status' : 'victory', 'player' : query.get().turnNumber}
					self.messageAll(message)
					self.cleanUpDatastore()
				else:
					query = Building.gql("WHERE ANCESTOR IS :1 AND owner = :2", self.game, playerFrom.user)
					buildings = query.fetch(40)
					for building in buildings:
						building.owner = playerTo.user
						building.put()

	def drawCard(self, isChance, player):
		#Get all undrawn cards of type the game requires (chance/community chest)
		query1 = EventCard.gql("WHERE ANCESTOR IS :1 AND isChance = :2 AND drawn = False",self.game, isChance) 
		cards = query1.fetch(20)
		
		#If there are no undrawn cards
		#shuffle and redraw
		if (len(cards) == 0): 			
			#Get all cards of type (chance/community chest)
			query2 = EventCard.gql("WHERE ANCESTOR IS :1 AND isChance = :2",self.game,isChance)
			all_cards = query2.fetch(20)
			for card in all_cards:
				#Mark all cards of type un-drawn
				card.drawn = False 
			db.put(all_cards)
			#Reload shuffled deck
			cards = query1.fetch(20)
		
		#Pick a random card
		card = random.choice(cards)
		#Pass the card and the player to the take card method which acts on the card
		self.takeCard(card,player, isChance)
		#Mark as drawn
		card.drawn = True
		card.put() 
						
	#"Event" determines what "value" means and what action to take. Key shown in EventCard.py
	def takeCard(self, card, player, isChance):
		#Display card.text to player that drew card
		moneyChange = 0
		position = None
		otherPlayers = []
		inJail = False
		goojf = False
		
		if(card.event == 0):
			#Transfer money
			self.transferMoney((-1 * card.value),player)
			moneyChange = card.value
		elif(card.event == 1):
			#Move player
			self.movePlayer(player,card.value)
			position = player.position
		elif(card.event == 2):
			#Move player to stated position
			self.setPlayerPosition(player, card.value)
			position = player.position
			
		elif(card.event == 3):
			#Player pays/receives-from all
			query = Player.gql("WHERE ANCESTOR IS :1",self.game)
			players = query.fetch(4)
			for playerX in players:
				if (player.key() != playerX.key()):
					#If other player - don't give money to self
					self.transferMoney(card.value,player,playerX)
					otherPlayers.append([playerX.turnNumber, card.value, playerX.money])
		elif(card.event == 4):
			#Get out jail free or go to jail
			if(card.value == 1):

				#Puts player in jail. No checking for GOOJF cards
				self.goToJail(player)
				position = 10
				inJail = True
			else:
				player.getOutOfJailFree += 1
				player.put()
				goojf = player.getOutOfJailFree
		elif(card.event == 5):
			#Move to nearest shop
			#Currently only moves if player is on a chance/commchest space
			if (player.position in (2, 7, 33, 36)):
				#self.setPlayerPosition(player,12)
				if player.position > 12 :
					#Will pass go
					moves = 40 - player.position + card.value
					self.movePlayer(player, moves)
				else :	
					self.setPlayerPosition(player, 12)
				position = 12
			elif (player.position in (17, 22)):
				self.setPlayerPosition(player, 28)
				position = 28
		elif(card.event == 6):
			#Move to pub
			#currently only moves if player is on a chance/commchest space
			if (player.position in (2, 36)):
				if player.position > 5 :
					#Will pass go
					moves = 40 - player.position + card.value
					self.movePlayer(player, moves)
				else :	
					self.setPlayerPosition(player, 5)
				position = 5
			if (player.position == 7):
				self.setPlayerPosition(player,15)
				position = 15
			if (player.position in (17, 22)):
				self.setPlayerPosition(player,25)
				position = 25
			if (player.position == 33):
				self.setPlayerPosition(player,35)
				position = 35
		elif(card.event == 7):
			#NEEDS REVIEW: how does building.houses property work?
			#also not thoroughly tested. Problem with having hotel/lab
			#pay per property

			total_to_pay = 0			

			#get all buildings with offices/lab
			query = Building.gql("WHERE ANCESTOR IS :1 AND type = 'building' AND houses > 0",self.game)
			buildings = query.fetch(40)
			#find all buildings belonging to player
			for building in buildings:
				if (building.owner == player.user):
					if (building.houses == 5): total_to_pay += card.value2	#pay per hotel/lab
					else: total_to_pay += (card.value * building.houses)	#pay per house/office
			self.transferMoney(total_to_pay,player)
			moneyChange = total_to_pay
		else:
			message = {'error' : 'Invalid event type. Contact a game admin.'}
			self.messageAll(message)
			sys.exit()
		
		#Finally send the message regarding the card to all players
		message = {'status': 'pick_up_card','player': player.turnNumber,'isChance': isChance, 'text': card.text, 'money_change' : moneyChange, 'money' : player.money, 'position' : position, 'otherPlayers' : otherPlayers, 'in_jail' : inJail, 'goojf_card' : goojf}
		self.messageAll(message) 
		
	def buyProperty(self, user):
		#Check it is the user's turn
		if self.game.inProgress :
			if (self.checkPlayerTurn(user)) :
				#Action of buying property
				player = self.getCurrentPlayer()
				
				if self.game.numRolls == 0:
					self.messagePlayer(user, {"error": "You haven't moved yet."});
					return
				
				#Check if property is available
				query = Building.gql("WHERE ANCESTOR IS :1 AND owner = NULL AND position = :2" , self.game, player.position)
				property = query.get()
				if not property :
					#property not available
					message = {'error' : 'property unavailable'}
					self.messagePlayer(user, message)
				else :
					#property is available
					#Check if the player has the available funds
					if self.deductMoney(player, property.cost) :
						property.owner = user
						property.put()
						message = {'status' : 'bought', 'player' : player.turnNumber, 'property' : property.position, 'money_change' : -property.cost, 'money' : player.money}
						self.messageAll(message)
					else :
						message = {'error' : 'not enough money'}
						self.messagePlayer(user, message)
			else :
				message = {'error' : 'It is not your turn'}
				self.messagePlayer(user, message)
		else :
			message = {'error' : 'The game has not started'}
			self.messagePlayer(user, message)

	def buyHouse(self, user, propertyPosition):
		#Check it is the user's turn
		if self.game.inProgress :
			if (self.checkPlayerTurn(user)) :
				#Now time to buy an office/lab
				player = self.getCurrentPlayer()
				
				query = Building.gql("WHERE ANCESTOR IS :1 AND owner = :2 AND position = :3 AND type = 'building' ", self.game, player.user, int(propertyPosition))
				
				property = query.get()
				
				#Check if property belongs to player and property is "building" type
				if property != None :                        
				
					block = self.getBlockDetails(property.colour)
				
					#Check if surrounding houses have the minumum number of houses on them 
					#or if one of the properties is mortgaged (as only need to check for one)
					for houseCheck in block :
						#Check player owns all in group
						if houseCheck["owner"] != user:
							message = {'error' : 'must own all properties'}
							self.messagePlayer(user, message)
							return
					
						if houseCheck["houses"] < property.houses :
							message = {'error' : 'not enough houses on neighbouring properties'} 
							self.messagePlayer(user, message)
							return
					
						if houseCheck["mortgaged"] :
							message = {'error' : 'property in group is mortgaged'}
							self.messagePlayer(user, message)
							return 
				
					if property.houses >= 5 :
						#Check if the house will exceed the maximum allowed
						message = {'error' : 'maximum number of houses already'}
						self.messagePlayer(user, message)
						return
				
					#Check if the player has the available funds
					if self.deductMoney(player, property.buildCost) :
						property.houses = property.houses + 1
						property.put()
						message = {'status' : 'addBuilding', 'player' : player.turnNumber, 'property' : property.position, 'money_change' : -property.buildCost, 'money' : player.money}
						self.messageAll(message)
					else :
						message = {'error' : 'not enough money'}
						self.messageAll(message)
				else:
					message = {'error' : 'Cannot build houses here!'}
					self.messagePlayer(user, message)
			else :
				message = {'error' : 'It is not your turn'}
				self.messagePlayer(user, message)
		else :
			message = {'error' : 'The game has not started'}
			self.messagePlayer(user, message)

	def sellHouse(self, user, propertyPosition):
		#Check it is the user's turn
		if self.game.inProgress :
			if (self.checkPlayerTurn(user)) :
				#Now time to buy an office/lab
				player = self.getCurrentPlayer()
				
				query = Building.gql("WHERE ANCESTOR IS :1 AND owner = :2 AND position = :3 AND type = 'building' ", self.game, player.user, int(propertyPosition))
				
				property = query.get()
				
				#Check if property belongs to player and property is "building" type
				if property != None :                        
				
					block = self.getBlockDetails(property.colour)
				
					#Check if surrounding houses have the minumum number of houses on them 
					#or if one of the properties is mortgaged (as only need to check for one)
					for houseCheck in block :
						#Check player owns all in group
						if houseCheck["owner"] != user:
							message = {'error' : 'must own all properties'}
							self.messagePlayer(user, message)
							return
					
						if houseCheck["houses"] > property.houses :
							message = {'error' : 'too many houses on neighbouring properties'} 
							self.messagePlayer(user, message)
							return
					
						if houseCheck["mortgaged"] :
							message = {'error' : 'property in group is mortgaged'}
							self.messagePlayer(user, message)
							return 
				
					if property.houses <= 0 :
						#Check if the house will exceed the minimum allowed
						message = {'error' : 'minimum number of houses already'}
						self.messagePlayer(user, message)
						return

					property.houses = property.houses - 1
					property.put()
					player.money += property.buildCost/2
					message = {'status' : 'sellBuilding', 'player' : player.turnNumber, 'property' : property.position, 'money': player.money}
					self.messageAll(message)

				else:
					message = {'error' : 'Cannot build houses here!'}
					self.messagePlayer(user, message)
			else :
				message = {'error' : 'It is not your turn'}
				self.messagePlayer(user, message)
		else :
			message = {'error' : 'The game has not started'}
			self.messagePlayer(user, message)


	
	def mortgageProperty(self, user, position) :
		if self.game.inProgress :
			if self.checkPlayerTurn(user) :
				#Mortgage property
				#Get property
				player = self.getCurrentPlayer()
				query = Building.gql("WHERE ANCESTOR IS :1 AND position = :2", self.game, int(position))
				property = query.get()
				
				#Validate if player can mortgage property (Who owns it, if has houses on block, already mortgaged)
				if property.owner != user :
					message = {'error' : 'not your property'}
					self.messagePlayer(user, message)
				elif property.mortgaged == True :
					message = {'error' : 'property already mortgaged'}
					self.messagePlayer(user, message)
				elif not self.checkBlockForHouses(property.colour):
					#no houses so can mortgage
					property.mortgaged = True
					property.put()
					#Now give the player their money
					amount = property.cost / 2
					self.addMoney(player, amount)
					message = {'status' : 'mortgaged', 'player_id' : player.turnNumber, 'property_id' : property.position, 'money_change' : amount, 'money' : player.money}
					self.messageAll(message)
				else :
					#Block has houses on
					message = {'error' : 'too many houses on neighbouring properties'}
					self.messagePlayer(user, message)
			else :
				message = {'error' : 'It is not your turn'}
				self.messagePlayer(user, message)
		else :
			message = {'error' : 'The game has not started'}
			self.messagePlayer(user, message)
	
	def checkBlockForHouses(self, colour) :
		if colour == 'ffffff' or colour == 'fefefe' :
			return False
		else :
			block = self.getBlockDetails(colour)
			houses = False
			for x in range(0, len(block)) :
				if block[x]["houses"] > 0 :
					houses = True
			return houses
	
	def getBlockDetails(self, colour) :
		#Returns a list that contains the properties positions
		query = Building.gql("WHERE ANCESTOR IS :1 AND colour = :2", self.game, colour)
		result = query.fetch(3)
		positions = []
		for x in range(0, len(result)) :
			if colour == 'ffffff' or colour == 'fefefe' :
				positions.append({
					"position": result[x].position,
					"owner": result[x].owner,
					"mortgaged": result[x].mortgaged
				})
			else :
				positions.append({
					"position": result[x].position,
					"houses": result[x].houses,
					"owner": result[x].owner,
					"mortgaged": result[x].mortgaged
				})
		return positions
		
		
	def unmortgageProperty(self, user, property_id) :
		if self.game.inProgress :
			if self.checkPlayerTurn(user) :
				player = self.getCurrentPlayer()
				query = Building.gql("WHERE ANCESTOR IS :1 AND position = :2", self.game, int(property_id))
				property = query.get()
				#Unmortgage amount is mortgage cost + 10% interest
				amount = property.cost/2
				amount = amount + amount/10 
				#Validate if player can unmortgage property (Who owns it, if not mortgaged)
				if property.owner != user :
					message = {'error' : 'not your property'}
					self.messagePlayer(user, message)
				elif property.mortgaged == False :
					message = {'error' : 'property already unmortgaged'}
					self.messagePlayer(user, message)
				elif self.deductMoney(player, amount) :
					property.mortgaged = False
					property.put()
					message = {'status' : 'unmortgaged', 'player_id' : player.turnNumber, 'property_id' : property.position, 'money_change' : amount, 'money' : player.money}
					self.messageAll(message)
				else :
					message = {'error' : 'not enough money'}
					self.messagePlayer(user, message)
			else :
				message = {'error' : 'It is not your turn'}
				self.messagePlayer(user, message)
		else :
			message = {'error' : 'The game has not started'}
			self.messagePlayer(user, message)
		
		
	def hasRequiredFunds(self, player, amount) :
		if player.money >= amount :
			return True
		else :
			return False
	
	def deductMoney(self, player, amount) :
		if self.hasRequiredFunds(player, amount) :
			player.money = player.money - amount
			player.put()
			return True
		else :
			return False
	
	def addMoney(self, player, amount) :
		player.money = player.money + amount
		player.put()

	def leaveJail (self, user, action) :
		if self.game.rollRemaining :
			player = self.getCurrentPlayer()
			if action == 'card' :
				#Check player has a card
				if player.getOutOfJailFree > 0 :
					player.getOutOfJailFree = player.getOutOfJailFree - 1
					player.inJail = -1
					message = {'status' : 'left_jail', 'player_id' : player.turnNumber, 'method' : 'card'}
					self.messageAll(message)
				else :
					message = {'error' : 'you do not have a card'}
					self.messagePlayer(user, message)
			elif action == 'paid' :
				if self.deductMoney(player, 50) :
					player.inJail = -1
					player.put()
					message = {'status' : 'left_jail', 'player_id' : player.turnNumber, 'method' : 'paid', 'money_change' : '-50', 'money' : player.money}
					self.messageAll(message)
				else :
					message = {'error' : 'not enough money'}
					self.messagePlayer(user, message)
			else :
				message = {'error' : 'invalid action'}
				self.messagePlayer(user, message)	
		else :
			self.messagePlayer(user, {'error' : 'already rolled'})
			
	def leaveGame(self, player) :
		#Need logic to test if they are not bankrupt and if so return their properties to the bank
		propertiesMessage = []
		if self.game.inProgress : 
			if not player.bankrupt : 
				#In this case they still in the game so their properties still need to be returned to the bank
				query = Building.gql("WHERE ANCESTOR IS :1 AND owner = :2", self.game, player.user)
				properties = query.fetch(30)
				for property in properties :
					property.owner = None
					property.houses = 0
					property.mortgaged = False
					property.put()
					propertiesMessage.append(property.position)
				
		#Remove player from the datastore
		player.delete()
		#Notify all players that player has left
		
		#Check how many players are left (and delete game possibility)
		if self.game.inProgress :
			if self.getNumberOfPlayers() < 2 : 
				#Then the remaining player has won
				message = {'status' : 'victory', 'player_piece' : Player.gql("WHERE ANCESTOR IS :1 AND bankrupt = False", self.game).get().piece}
				self.messageAll(message)
				self.cleanUpDatastore()
			if self.game.turn == player.turnNumber :
				self.game.rollRemaining = False
				self.endPlayerTurn(player.user) #End the players turn
			self.messageAll({'status' : 'player_disconnected', 'player_piece' : player.piece, 'property_positions_returned_to_bank' : propertiesMessage})
		else :
			#Return the colours and pieces to game to use
			self.game.pieces.append(player.piece)
			self.game.colours.append(player.colour)
			self.game.put()
			self.messageAll({'status' : 'player_disconnected', 'player_piece' : player.piece})

	def cleanUpDatastore(self):
		query = Building.gql("WHERE ANCESTOR IS :1", self.game)
		db.delete(query.fetch(100))

		query = Player.gql("WHERE ANCESTOR IS :1", self.game)
		db.delete(query.fetch(100))

		query = EventCard.gql("WHERE ANCESTOR IS :1", self.game)
		db.delete(query.fetch(100))


		self.game.delete()

				
	def chat(self, user, userMessage) :
		#Get the player from the user
		query = Player.gql("WHERE ANCESTOR IS :1 AND user = :2", self.game, user)
		player = query.get()
		#Escape any html in the message
		userMessage = cgi.escape(userMessage)
		message = {'status' : 'chat', 'from' : player.piece, 'message' : userMessage}
		self.messageAll(message)
