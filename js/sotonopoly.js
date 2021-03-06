//Based on function from the Prototype JS framework.
//This is to make life easier when working with scopes in Javascript.
//You can read more about it here:
//http://www.digital-web.com/articles/scope_in_javascript/
Function.prototype.bind = function ( obj ) {
	var method = this,
	temp = function() {
		return method.apply (obj, arguments);
	};

	return temp;
};

// Centering an element, from:
// http://stackoverflow.com/questions/210717/using-jquery-to-center-a-div-on-the-screen
jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
	this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
	return this;
}

//Wrapper function so that we can just rewrite this later on to display stuff
//in our own console.
function log ( data, color ) {
	console.log (data);

	if(typeof color == "undefined") {
		color = "#000000"; // default color for log messages
	}

	var message = $("<div style='color: #" + color + ";'> " + data + "</div>");
	$("#log").append(message);
	var position = $("#log div:last").position();
	
	$("#log").animate({scrollTop:$('#log')[0].scrollHeight});
}

function Sotonopoly ( canvas, client_id, game_key ) {
	// Game state. This should be kept up to date by the client.
	// Most messages received from the server should have information on how
	// to update the game state.
	//
	// The board should probably get redrawn as well when the game state changes
	// using the this.redraw() function.
	this.game_state = {
			key: null,
			players: [],
			chance_cards: [],
			community_cards: [],
			buildings: [],
			in_progress: false,
			current_turn: 1,
			started: false
	};

	// All valid messages from the server should have a 'status' field describing
	// what type of message it is. The keys in this message_handlers field
	// should match the possible status types. The JavaScript will then call the
	// function assigned to the message type below.
	this.message_handlers = {
			player_joined: this.onPlayerJoin,
			you: this.onSelfJoined,
			current_players: this.onOtherJoined,
			bought: this.onPlayerBoughtProperty,
			player_ended_turn: this.onPlayerEndTurn,
			game_started: this.onGameStart,
			turn: this.onPlayerTurn,
			die_roll: this.onDieRoll,
			tax: this.onTaxed,
			go_to_jail: this.onJailed,
			pick_up_card: this.onPickUpCard,
			triple_doubles: this.onTripleDoubles,
			left_jail: this.onLeftJail,
			passed_go: this.onPassedGo,
			rent: this.onPaidRent,
			bankrupt: this.onBankrupt,
			victory: this.onVictory,
			chat: this.onChat,
			/*force_mortgage: this.onForceMortgage,*/
			addBuilding: this.onAddHouse,
			sellBuilding: this.onSellHouse,
			mortgaged: this.onPropertyMortgaged,
			unmortgaged: this.onPropertyUnmortgaged,
			player_disconnected: this.onPlayerDisconnected
	};

	// Using an array because we might add multiple players from the same client
	// session. This shouldn't really be an array because a client should only
	// be connected once, but for the purposes of making testing easier we'll
	// have it like this...
	this.my_players = [];

	// Is this game started by me?
	this.my_game = false;

	// Some info about our turn
	this.turn = {
		has_moved: false, // Moved this turn yet?
		rolled_doubles: false, // Rolled doubles last turn?
		
		// Is the player currently improving sites: will change the
		// way viewing of building cards is performed
		improving_sites: false,
		currently_improving: null, // Reference to building we're currently improving
		
		mortgaging_property: false, // Are we currently mortgaging a property
		currently_mortgaging: null, // Reference to the property we're currently mortgaging
		
		unmortgaging_property: false, // are we currently unmortgaging a property
		currently_unmortgaging: null // reference to the property we're currently unmortgaging
	};
	
	var t = this;
	$("#send-message").click (function()
	{
		t.onChannelMessage ({ data: $("#json-message").val() });
		$("#json-message").val("");
	});

	this.initializeBoard (canvas);
	this.updateButtons();
	this.setupGame (client_id, game_key);
}


// Retrieves the information regarding offices and labs from the player on turn.
// It updates the information retrieved when necesssary and
// adds a new office/lab to the information on the server and on the interface.
// It then displays it in the console.
Sotonopoly.prototype.onAddHouse = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player);
	if ( p === null ) return;

	p.money = data.money;
	
	var building = this.game_state.buildings[data.property];
	building.num_houses++;

	$("#add-house, #remove-house").removeAttr ("disabled");

	if ( building.num_houses == 5 )	{
		for ( var i = 0; i < 4; i++ ) {
			$("#building" + data.property + "_house" + i).attr ("opacity", 0.0);
			$("#building" + data.property + "_hotel").attr ("opacity", 1.0);
		}
		
		$("#num-houses").html ("1");
		$("#building-type").html ("lab");
		
		log (p.name + ": Built a research lab in " + building.name, p.colour);
	} else {
		var lastHouse = building.num_houses - 1;
		$("#building" + data.property + "_house" + lastHouse).attr ("opacity", 1.0);
	
		$("#num-houses").html (building.num_houses);
		$("#building-type").html ("office(s)");
		
		log (p.name + ": Built an office in " + building.name, p.colour);
	}
};

// Retrieves the information regarding offices and labs from the player on turn.
// It updates the information retrieved when necesssary and
// removes an existing office/lab to the information on the server and on the interface
// It then displays it in the console.

Sotonopoly.prototype.onSellHouse = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player);
	if ( p === null ) return;
	
	p.money = data.money;
	
	var building = this.game_state.buildings[data.property];
	building.num_houses--;
	
	$("#add-house, #remove-house").removeAttr ("disabled");
	
	if ( building.num_houses == 4 ) {
		for ( var i = 0; i < 4; i++ ) {
			$("#building" + data.property + "_house" + i).attr ("opacity", 1.0);
			$("#building" + data.property + "_hotel").attr ("opacity", 0.0);
		}
		
		log (p.name + ": Sold a research lab from " + building.name, p.colour);
	} else {
		$("#building" + data.property + "_house" + building.num_houses).attr ("opacity", 0.0);
	
		log (p.name + ": Sold an office from " + building.name, p.colour);
	}
	
	$("#num-houses").html (building.num_houses);
	$("#building-type").html ("office(s)");
};


Sotonopoly.prototype.onPropertyMortgaged = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player_id);
	if ( p === null ) return;
	
	var building = this.game_state.buildings[data.property_id];
	building.currentlyMortgaged = true;
	
	//Change the color of the owner blob to black to mark as mortgaged
	drawOwnerSquare(building, "#000000");
	this.turn.mortgaging_property = false; // we're no longer mortgaging a property
	this.turn.currently_mortgaging = null; // drop the reference to teh property we were holding on to
	
	p.money = data.money;
	
	log (p.name + ": Mortgaged " + building.name + " for a value of £" + data.money_change, p.colour);
};

Sotonopoly.prototype.onPropertyUnmortgaged = function ( data ) {
	var p = this.getPlayerFromTurnNumber(data.player_id);
	if(p === null) return;
	
	var building = this.game_state.buildings[data.property_id];
	building.currentlyMortgaged = false; 
	
	drawOwnerSquare(building, p.colour);
	this.turn.unmortgaging_property = false; 
	this.turn.currently_unmortgaging = null;

	p.money = data.money;
	log (p.name + ": Unmortgaged " + building.name + " for a cost of £" + data.money_change, p.colour);
};


//
Sotonopoly.prototype.onChat = function (data) {

	var player = this.getPlayerFromPiece(data.from);
	
	var chatLog = $("#chat_box");
	var message = $("<div style='color: #" + player.colour + "'>" + player.name + ": "+ data.message + "</div>");
	chatLog.append(message);
	var position = $("#chat_box :last-child").position();
	$("#chat_box").animate({scrollTop:$('#chat_box')[0].scrollHeight});
}

Sotonopoly.prototype.onPickUpCard = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player);
	if ( p === null ) return;
	
	p.money = data.money;
	var t = this;
	this.queueActionOnPlayer (p, function (next) {
		t.onDrawCard (next, data);
	});
	
	// Card moves the player?
	if (data.position != null) {
		if (data.position == 10){
			this.movePlayerPieceTo(p, data.position, false);
			p.position = data.position;
		} else if (data.text == "The University internet is broken. Move back 3 spaces while it is repaired.") {
			this.movePlayerPieceTo(p, data.position, false);
		} else {
			this.movePlayerPieceTo(p, data.position, true);
			p.position = data.position;
		}
	}
	
	// Update player money
	for ( var i in data.otherPlayers ) {
		var player = this.getPlayerFromTurnNumber (data.otherPlayers[i][0]);
		player.money = data.otherPlayers[i][2];
	}
	
	// Moved to jail?
	if ( data.in_jail ) {
		p.in_jail = true;
		p.jailbreak_attempts = 0;
	}
	
	// Get out of jail free card?
	if ( data.goojf_card ) {
		p.jail_cards = data.goofj_card;
	}
	
	log (p.name + ": Picked up a card...", p.colour);
}

Sotonopoly.prototype.onPaidRent = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player_id);
	if ( p === null ) return;
	
	var owner = this.getPlayerFromTurnNumber (data.property_owner);
	if ( owner === null ) return;
	
	p.money = data.player_money;
	owner.money = data.owner_money;
	
	log (p.name + ": Paid rent of £" + data.amount + " to " + owner.name, p.colour);
}

Sotonopoly.prototype.onPassedGo = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player_id);
	if ( p === null ) return;
	
	p.money = data.money;
	log (p.name + ": Passed GO! and collected £200.", p.colour);
}

Sotonopoly.prototype.playerOwnsAllColours = function ( player, building ) {
	var p = player;
	if ( building.type != "property" ) return false;

	var buildings_owned = player.buildings_owned;
	var building_id = this.game_state.buildings.indexOf (building);
	var buildings_owned_in_group = [];
	
	// Get IDs of all the buildings player owns
	for ( var b in buildings_owned ) {
		var b2 = buildings_owned[b];
		if ( b2.color == building.color ) {
			buildings_owned_in_group.push (this.game_state.buildings.indexOf (b2));
		}
	}
	
	// Sort the IDs to make reasoning about them easier
	buildings_owned_in_group.sort();
	
	var building_groups = [
		[1, 3], // brown
		[6, 8, 9], // cyan
		[11, 13, 14], // pink
		[16, 18, 19], // orange
		[21, 23, 24], // red
		[26, 27, 29], // yellow
		[31, 32, 34], // green
		[37, 39] // blue
	];

	// Make sure we have them all
	for ( var i in building_groups ) {
		var group = building_groups[i];
		if ( buildings_owned_in_group[0] != group[0] ) {
			continue;
		}
		
		// Should be enough to check if the lengths are the same.
		return buildings_owned_in_group.length == group.length;
	}
	
	return false;
};

Sotonopoly.prototype.onVictory = function ( data ) {
	var p = this.getPlayerFromPiece ( data.player_piece );
	var canvas = $("#canvas"); // grabs the "board" element (canvas)
	var svgNS = "http://www.w3.org/2000/svg";
	var xlinkNS="http://www.w3.org/1999/xlink"; // namespace for linking to other documents

	var notification = document.createElementNS (svgNS, "image"); // creates a SVG image element
	var imagePath = "images/victory.png"; // the path to the image for the player icon
	$(notification).attr ({ x: 170, y: 185, width: 300, height: 176 });
	notification.setAttributeNS(xlinkNS, "href", imagePath); // uses the xlink NS to link to the src of the icon
	/* FOR FUTURE REF, IF YOU NEED TO USE TWO NS WITH ONE ELEMENT, USE ABOVE CODE */

	$(canvas).append (notification); // adds the icon to the board
	log( p.name + " has won the game");
};

Sotonopoly.prototype.onLeftJail = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player_id);
	if ( p === null ) return;

	p.in_jail = false;
	p.jailbreak_attempts = 0;
	
	if ( data.method == "card" ) {
		p.jail_cards--;
		log (p.name + ": Left jail by using their jail card.", p.colour);
	} else if ( data.method == "paid" ) {
		p.money = data.money;
		log (p.name + ": Left jail by paying their fine.", p.colour);
	} else if ( data.method == "double" ) {
		this.turn.rolled_doubles = true;
		log (p.name + ": Left jail by rolling a double.", p.colour);
	}
}

Sotonopoly.prototype.onTripleDoubles = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player_id);
	if ( p === null ) return;
	
	this.movePlayerPieceTo (p, data.move_to, false);
	
	p.in_jail = true;
	p.position = data.move_to;
	this.turn.has_moved = true;
	
	log (p.name + ": Was sent to jail for speeding.", p.colour);
}

Sotonopoly.prototype.onJailed = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player_id);
	if ( p === null ) return;

	this.movePlayerPieceTo (p, 10, false);

	p.in_jail = true;
	p.position = 10;
	
	log (p.name + ": Was sent to jail.", p.colour);
};

Sotonopoly.prototype.onTaxed = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player_id);
	if ( p === null ) return;

	p.money = data.money;
	log (p.name + ": Paid tax of £" + -parseInt (data.money_change), p.colour);
};

Sotonopoly.prototype.onPlayerBoughtProperty = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player);
	if ( p === null ) return;

	var building = this.game_state.buildings[data.property];
	building.owner = p;
	
	p.buildings_owned.push (building);
	p.money = data.money;
	
	drawOwnerSquare(building, p.colour);
	
	log (p.name + ": Bought " + building.name, p.colour);
};

function drawOwnerSquare(building, colour) {
	var xPosition = building.pos[0];
	var yPosition = building.pos[1];
	translatePosition(xPosition, yPosition);

	var canvas = $("#canvas"); // grabs the "board" element (canvas)
	var svgNS = "http://www.w3.org/2000/svg";
	
	var positions = translatePosition(xPosition, yPosition);

	var piece = document.createElementNS (svgNS, "rect"); // creates a SVG image element
	$(piece).attr ({ x: positions[0], y: positions[1], rx: 4,  ry: 4, width: positions[2], height: positions[3] });
	piece.setAttributeNS(null, "fill", "#" + colour); // uses the xlink NS to link to the src of the icon
	$(canvas).append(piece);
};

function translatePosition(x, y) {
	var newX;
	var newY;
	var width; 
	var height;
	if(y == 693) { // bottom row
		newX = x + 4;
		newY = y + 88;
		width = 58;
		height = 15;
	} else if(x == 0) { // left row
		newX = x + 2; 
		newY = y + 4;
		width = 15;
		height = 58;
	}
	else if(y == 0) { // top row
		newX = x + 3;
		newY = y + 2;
		width = 58;
		height = 15;
	} else if(x == 692) { // right row
		newX = x + 90;
		newY = y + 4;
		width = 15;
		height = 58;
	}
	var positions = [newX, newY, width, height];
	return positions;
};


Sotonopoly.prototype.queueActionOnPlayer = function ( player, action ) {
	player.actionQueue.queue (action);
}

Sotonopoly.prototype.getPlayerFromTurnNumber = function ( turnNumber ) {
	for ( var p in this.game_state.players ) {
		var player = this.game_state.players[p];
		if ( player.id == turnNumber ) {
			return player;
		}
	}

	return null;
};

Sotonopoly.prototype.getPlayerFromPiece = function ( piece ) {
	for ( var p in this.game_state.players ) {
		var player = this.game_state.players[p];
		if ( player.piece == piece ) {
			return player;
		}
	}
	return null;
};


Sotonopoly.prototype.onBankrupt = function ( data ) {
	var p = this.getPlayerFromTurnNumber (data.player);
	if (p == null) return;
	
	var index = this.game_state.players.indexOf( p );
	for ( i in p.buldings_owned) {
		p.buildings_owned[i] = null;
	} 
	
	this.game_state.players.splice(index, 1);
	$("#" + p.piece).attr ("opacity", 0);
	
	var canvas = $("#canvas"); // grabs the "board" element (canvas)
	var svgNS = "http://www.w3.org/2000/svg";
	var xlinkNS="http://www.w3.org/1999/xlink"; // namespace for linking to other documents

	var notification = document.createElementNS (svgNS, "image"); // creates a SVG image element
	var imagePath = "images/you_lose.png"; // the path to the image for the player icon
	
	$(notification).attr ({ x: 170, y: 185, width: 300, height: 176 });
	notification.setAttributeNS(xlinkNS, "href", imagePath); // uses the xlink NS to link to the src of the icon
	/* FOR FUTURE REF, IF YOU NEED TO USE TWO NS WITH ONE ELEMENT, USE ABOVE CODE */

	$(canvas).append (notification); // adds the icon to the board
	
	log(p.name+' has lost all his money and is not part of the game anymore', p.colour)
};

Sotonopoly.prototype.getMyCurrentPlayer = function () {
	for ( var p in this.my_players ) {
		var player = this.my_players[p];
		if ( player.id == this.game_state.current_turn ) {
			return player;
		}
	}

	return null;
};

Sotonopoly.prototype.isPlayersTurn = function ( player ) {
	if ( player === null ) return false;
	return current_player.id == this.game_state.current_turn;
};

Sotonopoly.prototype.updateButtons = function() {
	var current_player = this.getMyCurrentPlayer();

	$("#game-options > *").hide();
	if ( !this.game_state.started ) {
		if ( this.game_state.players.length >= 2 ) {
			$("#start-game").show();
		} else {
			$("#waiting-players").show();
		}
	} else {
		if ( current_player === null ) {
			// If current_player is null, then it's not this particular client's
			// turn.

			$("#waiting-turn").show();
		} else {
			// your turn
			$("#show-property").show();
			if ( current_player.in_jail ) {
				if ( this.turn.has_moved ) {
					$("#end-turn").show();
				} else {
					$("#roll").show(); // only if had 3 or less triples
					$("#").show();
					$("#pay-50-fine").show();
					if ( current_player.jail_cards > 0 ) {
						$("#use-jail-card").show();
					}
				}
			} else {
				// not in jail
				if ( this.turn.improving_sites ) {
					$("#finished-improving").show();
				} else {
					if ( this.turn.has_moved ) {
						var building = this.game_state.buildings[current_player.position];
						if ( !building.owner && (building.type == "pub" || building.type == "property" || building.type == "shop") ) {
							$("#buy-property").show();
						}
						
						if ( !this.turn.rolled_doubles ) {
							$("#end-turn").show();
						} else {
							$("#roll").show();
						}
		
						if ( current_player.buildings_owned.length > 0 && (current_player.buildings_owned.length > getPlayersMortgagedProperties(current_player).length) && !this.turn.improving_sites && !this.turn.unmortgaging_property) {
							$("#mortgage-property").show();
						}
					
						if(doesPlayerHaveMortgagedProperties(current_player) && !this.turn.improving_sites && !this.turn.mortgaging_property) {
							$("#unmortgage-property").show();
						}
					
					} else {
						$("#roll").show();
					}
					
					var has_improvable_site = false;
					for ( var b in current_player.buildings_owned ) {
						var building = current_player.buildings_owned[b];
						if ( this.playerOwnsAllColours (current_player, building) ) {
							has_improvable_site = true;
							break;
						}
					}

					if ( has_improvable_site && !this.turn.mortgaging_property && !this.turn.unmortgaging_property) {
						$("#buy-houses").show();
					}
				}
			}
		}
	}
};


function doesPlayerHaveMortgagedProperties(player) {
	var buildings = player.buildings_owned;
	var seenMortgaged = false; 
	for(var i = 0; i < buildings.length; i++) {
		var building = buildings[i];
		if(building.currentlyMortgaged == true) {
			seenMortgaged = true;
		}
	}
	return seenMortgaged; 
}

function getPlayersMortgagedProperties(player) {
	var buildings = player.buildings_owned;
	var mortgagedProperties = [];
	for(var i = 0; i < buildings.length; i++) {
		var building = buildings[i];
		if(building.currentlyMortgaged == true) {
			mortgagedProperties.push(building);
		}
	}
	return mortgagedProperties;
}

function getPlayersUnmortgagedProperties(player) {
	var buildings = player.buildings_owned; 
	var unmortgagedProperties = [];
	for(var i = 0; i < buildings.length; i++) {
		var building = buildings[i];
		if(building.currentlyMortgaged == false) {
			unmortgagedProperties.push(building);
		}
	}
}

Sotonopoly.prototype.onGameStart = function ( data ) {
	log ("Game started", "#000000");
	this.game_state.started = true;
	for ( var piece in data.turns ) {
		var player = this.getPlayerFromPiece (piece);
		player.id = data.turns[piece];
	}
	
	// show things when game starts
	// dice and chat console
	$(".dice1").show();
	$(".dice2").show();

};

Sotonopoly.prototype.onPlayerEndTurn = function ( data ) {
	var currentPlayer = this.getPlayerFromTurnNumber (this.game_state.current_turn);
	if ( currentPlayer === null ) return;

	log (currentPlayer.name + ": Ended their turn.", currentPlayer.colour);
	this.game_state.current_turn = data.turn_number;
	this.turn.has_moved = false;
	this.turn.rolled_doubles = false;
	this.turn.mortgaging_property = false;
	
	$("#card").fadeOut ("slow");
};

Sotonopoly.prototype.setupGame = function ( client_id, game_key ) {
	var init_json = { 'client_id': client_id };
	var sotonopoly = this;
	var game_id = window.location.href.split("?join=")[1];
	if ( game_id !=null) {
		//if joining running game
		myprompt("Enter Your Name","Please enter your name:", function (name) {
			init_json.game_key = game_id;
			sotonopoly.setupGameConnection (init_json, function() {
				$.post ('/game/add_player', { 'game_key': sotonopoly.game_state.key, "name": name });
			});
		});
	} else {
		//if starting new game
		myprompt ("Enter Your Name", "New game. Please enter your name:", function (name) {
			sotonopoly.my_game = true;
			sotonopoly.setupGameConnection (init_json, function() {
				$.post ('/game/add_player', { 'game_key': sotonopoly.game_state.key, "name": name });
			});
		});
	}
};

Sotonopoly.prototype.setupGameConnection = function ( init_json, callback ) {
	var sotonopoly = this;
	$.post ('/game/setup', init_json, function (data, success, jqXHR) {
		if ( typeof data.error != "undefined" ) {
			window.location.href = "/";
			return;
		}
	
		//log ("Connecting to server with token " + data.token, "generic");
		log ("Connecting to server...");
		sotonopoly.game_state.key = data.game_key;

		var port = "";
		if ( document.location.port != "" && document.location.port != "80" ) {
			port = ":" + document.location.port;
		}

		var join_game_url = document.location.protocol + "//" +
		document.location.hostname + port + 
		document.location.pathname + 
		"?join=" + data.game_key;
		$("#join_url").text (join_game_url);

		var channel = new goog.appengine.Channel (data.token);
		socket = channel.open();
		socket.onopen = function() {
			sotonopoly.onChannelOpen.call (sotonopoly);
			window.setTimeout (function() { callback(); }, 1000);
		};
		socket.onmessage = sotonopoly.onChannelMessage.bind (sotonopoly);
		socket.onerror = sotonopoly.onChannelError.bind (sotonopoly);
		socket.onclose = function() { myalert ("Error", "Channel was closed by server."); };

		$("#start-game a").click (function() {
			$.post ('/game/start', { game_key: data.game_key });				
		});

		$("#roll a").click (function() {
			$.post ('/game/roll', { game_key: data.game_key });
		});

		$("#end-turn a").click (function() {
			$.post ('/game/end_turn', { game_key: data.game_key });
			clearSquares(sotonopoly.getMyCurrentPlayer());
		});

		$("#buy-property a").click (function() {
			$.post ("/game/buy_property", { game_key: data.game_key });
		});

		$("#pay-50-fine a").click (function() {
			$.post ('/game/leave_jail', { game_key: data.game_key, method: "paid" });
		});

		$("#use-jail-card a").click (function() {
			$.post ('/game/leave_jail', { game_key: data.game_key, method: "card" });
		});
				
		$("#buy-houses a").click (function() {
			var current_player = sotonopoly.getMyCurrentPlayer();
			if ( current_player === null ) return;
			
			sotonopoly.turn.improving_sites = true;
			for ( var b in current_player.buildings_owned ) {
				var building = current_player.buildings_owned[b];
				if ( building.type == "property" ) {
					$(building.element).attr ("opacity", "0.5");
					$(building.element).css ("fill", "green");
				}
			}
			
			sotonopoly.updateButtons();
		});
		
		$("#mortgage-property a").click (function() {
			var current_player = sotonopoly.getMyCurrentPlayer();
			if(current_player === null) return;
			
			sotonopoly.turn.mortgaging_property = true;
			for (var b in current_player.buildings_owned)  {
				var building = current_player.buildings_owned[b];
				// don't highlight the buildings that are mortgaged
				if(!building.currentlyMortgaged) {
					// highligh the buildings that a player owns
					$(building.element).attr("opacity", "0.5");
					$(building.element).css("fill", current_player.colour);	
				}

			}
		});
		
		// Click handler for confirm button on mortgage box 
		$("#mortgage_confirm").click(function() {
			$("#mortgage-site").hide(); // hides the mortgage pop up screen
			$.post('/game/mortgage_property', {game_key: data.game_key, 'property_id': sotonopoly.game_state.buildings.indexOf(sotonopoly.turn.currently_mortgaging)});
			var current_player = sotonopoly.getMyCurrentPlayer();
			if(current_player === null) return;
			// Draws white back on all of the squares
			for(var b in current_player.buildings_owned) {
				var building = current_player.buildings_owned[b];
				$(building.element).attr("opacity", "0");
				$(building.element).css("fill", "#ffffff");        
			}

		
		});
		
		// Click handler for the confirm button of the unmortgage box
		$("#unmortgage_confirm").click(function() {
			$("#unmortgage-site").hide(); // hides the unmortgage pop up screen
			$.post("/game/unmortgage_property", {game_key: data.game_key, 'property_id': sotonopoly.game_state.buildings.indexOf(sotonopoly.turn.currently_unmortgaging)});
			var current_player = sotonopoly.getMyCurrentPlayer();
			if(current_player === null) return;
			var mortgagedProperties = getPlayersMortgagedProperties(current_player);

			for(var b in mortgagedProperties) {
				var building = mortgagedProperties[b];
				$(building.element).attr("opacity", "0");
				$(building.element).css("fill", "#ffffff");
			}
		});
		
		// Click handler for the cancel button on the mortgage pop up
		$("#mortgage_cancel").click( function() {
			$("#mortgage-site").hide(); // hides the mortgage pop up screen
			var current_player = sotonopoly.getMyCurrentPlayer();
			if(current_player === null) return;
			// Sets the colour on the overlapped highl;ighted buildings back to white
			for (var b in current_player.buildings_owned) {	
				var building = current_player.buildings_owned[b];
				$(building.element).attr("opacity", "0");
				$(building.element).css("fill", "#ffffff");
			}

			sotonopoly.turn.mortgaging_property =  false; // we're no longer mortgaging propery
			sotonopoly.turn.currently_mortgaging = null; // drop the reference to the property we're mortgaging
		});
		
		// Click handler for the cancel button on the unmortgage pop up
		$("#unmortgage_cancel").click(function() {
			$("#unmortgage-site").hide(); // hides the unmortgage pop up screen
			var current_player = sotonopoly.getMyCurrentPlayer(); 
			if(current_player === null) return;
			var mortgagedProperties = getPlayersMortgagedProperties(current_player);
			// Sets the colour on the overlapped highlighted buildings back to white
			for(var b in mortgagedProperties) {
				var building = mortgagedProperties[b];
				$(building.element).attr("opacity", "0");
				$(building.element).css("fill", "#ffffff");
			}
			sotonopoly.turn.unmortgaging_property = false;
			sotonopoly.turn.currently_unmortgaging = null; 
				
		});
		

		// When unmortgage button is clicked on left menu bar
		$("#unmortgage-property a").click (function() {
		
			var current_player = sotonopoly.getMyCurrentPlayer();
			if(current_player === null) return;
			var mortgagedProperties = getPlayersMortgagedProperties(current_player); // the properties that the player owns and are mortgaged
			
			sotonopoly.turn.unmortgaging_property = true; // sets a boolean to state we are unmortgaging a property
			
			// highligh the buildings that a player owns
			for(var b in mortgagedProperties) {
				var building = mortgagedProperties[b];
				$(building.element).attr("opacity", "0.5");
				$(building.element).css("fill", current_player.colour);
			}
			
		});
		
		$("#card #card_close").click (function() {
			$("#card").fadeOut ("slow");
		});

		$("#finished-improving a").click (function() {
			sotonopoly.turn.improving_sites = false;
			sotonopoly.turn.currently_improving = null;
			
			for ( var b in sotonopoly.game_state.buildings ) {
				var building = sotonopoly.game_state.buildings[b];
				$(building.element).attr ("opacity", "0.0");
				$(building.element).css ("fill", "white");
			}
			
			sotonopoly.updateButtons();
		});

		$("#send_button").click( function() {
			$.post ('/game/chat', { game_key: data.game_key, "message": $("#chat_text").val() });
			$("#chat_text").val("");
		});

		sotonopoly.updateButtons();
		$(".box").fadeIn ("slow");
	});
};


Sotonopoly.prototype.onDrawCard = function ( next, data ) {
	var winHeight = $(window).height();
	var winWidth = $(window).width();
	var animateScale = 10;
	var sotonopoly = this;
	
	$("#card *").hide();
	$("#card").show();
	
	var animateId = window.setInterval(function ()  {	
		sotonopoly.animateTickDrawCard(data,winWidth,winHeight,animateScale);
		animateScale+=10;
		if (animateScale == 400) {
			clearInterval(animateId);
			
			$("#card_header").html(data.isChance ? "CHANCE" : "COMMUNITY CHEST");

			$("#card_text").html(data.text);
			$("#card_text, #card_header, #card_close").show();
			
			$("#card").css('left',winWidth/2-200);
			$("#card").css('top',winHeight/2-100);
			
			$("#card_header").css('left',200-$("#card_header").width()/2);
			
			next();
		}
	}, 20);
};

Sotonopoly.prototype.animateTickDrawCard = function ( data, winW, winH, scale ) {	//scale is width of div. height is half this.
	//winW and winH are viewport width/height to determine centering info
	$("#card").css('height',scale/2);
	$("#card").css('width',scale);
	$("#card").css('left',winW/2-scale/2);
	$("#card").css('top',winH/2-scale/4);
};

Sotonopoly.prototype.addPlayer = function ( player ) {
	// If a player doesn't already exist with this turn number, then add.
	// This might not be true if you're connected multiple times..
	var p = {
			name: player.name,
			piece: player.piece,
			money: player.money,
			position: player.position,
			jail_cards: 0,
			in_jail: false,
			buildings_owned: [],
			colour: player.colour,
			jailbreak_attempts: 0,
			actionQueue: $({}) // Apparently an empty jQuery object.
	};
	this.game_state.players.push (p);
	// draw player list
	switch(p.piece) {
		case "mortarboard": 
			$("#player_one .content").html (player.name);
			$("#player_one").slideDown();
		break;
		case "dolphin":
			$("#player_two .content").html (player.name);
			$("#player_two").slideDown();
		break;
		case "book":
			$("#player_three .content").html (player.name);
			$("#player_three").slideDown();
		break;
		case "glass":
			$("#player_four .content").html (player.name);
			$("#player_four").slideDown();
		break;
	}
		
	return p;
};

Sotonopoly.prototype.onOtherJoined = function ( data ) {
	for (count=0; count<data.current_players.length; count=count+1) {
		log (data.current_players[count]['name'] + ": Currently playing", data.current_players[count]['colour']);

		var player_data = data.current_players[count];
		this.addPlayer (player_data);
	}
};

Sotonopoly.prototype.onSelfJoined = function ( data ) {
	var myPlayer = this.getPlayerFromPiece (data.piece);
	if ( myPlayer !== null ) {
		this.my_players.push (myPlayer);
	}
};

Sotonopoly.prototype.onPlayerJoin = function ( data ) {
	this.addPlayer (data);

	for ( var i in this.game_state.players ) {
		var player = this.game_state.players[i];
		$("#" + player.piece).attr ("opacity", 1);

	}

	log (data.name + ": Joined the game", data.colour);
};

Sotonopoly.prototype.onPlayerTurn = function (data) {
	var currentPlayer = this.getPlayerFromTurnNumber(this.game_state.current_turn);
	log (currentPlayer.name + ": It's my turn", currentPlayer.colour);
};

Sotonopoly.prototype.movePlayerPieceTo = function ( player, move_to, doCorners ) {
	var newPosition = move_to;
	var coords = this.getCoordinates(player.piece, newPosition);

	var currentPosition = player.position;

	var placesToMove = [];
	if ( !doCorners ) {
		placesToMove.push(coords);
	} else {
		while (currentPosition != newPosition) {
			var placesToCorner = (10 -(currentPosition + 10)%10);
			var cornerPosition = currentPosition + placesToCorner;
		
			if (cornerPosition > 39) {
				cornerPosition = 0;
			}
		
			var tempCoords = this.getCoordinates(player.piece, cornerPosition);
			
			if(currentPosition > newPosition){
				placesToMove.push(tempCoords);
			}else if (cornerPosition != 0 && cornerPosition > newPosition) {
				placesToMove.push(coords);
				
				break;
			}else if (cornerPosition == 0 && (newPosition > 30)) {
				placesToMove.push(coords);
				
				break;
			}else if (newPosition < currentPosition){
				placesToMove.push(tempCoords);
				
			}else {
				placesToMove.push(tempCoords);
			}
			
			currentPosition = cornerPosition;
		}
	}

	var t = this;
	this.queueActionOnPlayer (player, function (next) {
		t.move(next, player.piece, placesToMove);
	});
}

Sotonopoly.prototype.onDieRoll = function(data) {
	var currentPlayer = this.getPlayerFromTurnNumber (this.game_state.current_turn);
	if ( currentPlayer === null ) return;
	
	$("#card").fadeOut ("slow");

	var t = this;
	this.queueActionOnPlayer (currentPlayer, function (next) {
		t.animateDiceRoll(next, data);
	});
	
	this.turn.has_moved = true;
	this.turn.rolled_doubles = (data.die1 == data.die2);
	
	if ( currentPlayer.in_jail && !this.turn.rolled_doubles ) {
		log (currentPlayer.name + ": Rolled " + data.die1 + " and " + data.die2 + ". They remain in jail.", currentPlayer.colour);
		this.turn.jailbreak_attempts++;
	} else {
		var newPosition = data.move_to;
		var building = this.game_state.buildings[newPosition];
	
		this.movePlayerPieceTo (currentPlayer, newPosition, true);
		if ( currentPlayer.position > newPosition ) {
			// Passed GO!
			currentPlayer.money += 200;
		}
	
		currentPlayer.position = newPosition;
		
		var buildingName = building.name;
		if ( buildingName == "Library" ) {
			buildingName = "visit Library";
		}
		
		log (currentPlayer.name+" has rolled "+data.die1+" and "+data.die2+". This player is moving to "+buildingName, currentPlayer.colour);
	}
};

Sotonopoly.prototype.animateDiceRoll = function(next, data) {
	var die1 = data.die1;
	var die2 = data.die2;
	var animateTickLength = 10;
	var animationId = window.setInterval(function() {
		var die1shown = Math.floor((Math.random()*6)+1);
		var die2shown = Math.floor((Math.random()*6)+1);
		$(".red_die_face").hide();
		$("#red_die_face_"+die1shown).show();
		$(".blue_die_face").hide();
		$("#blue_die_face_"+die2shown).show();
		animateTickLength = animateTickLength + (animateTickLength * 0.1);
		if (animateTickLength > 5000) {
			$(".red_die_face").hide();
			$(".blue_die_face").hide();
			$("#red_die_face_"+die1).show();
			$("#blue_die_face_"+die2).show();
			clearInterval( animationId );
			next();
		}
	},animateTickLength);
}

Sotonopoly.prototype.initializeBoard = function ( canvas ) {
	this.game_state.pieces = [
		{pos: [721, 722], size: [24, 24], name: "mortarboard", path: "images/mortarboard.png"}, 
		{pos: [746, 722], size: [24, 24], name: "dolphin", path: "images/dolphin.png"}, 
		{pos: [721, 747], size: [24, 24], name: "book", path: "images/book.png"}, 
		{pos: [746, 747], size: [24, 24], name: "glass", path: "images/glass.png"},
	];
	                          
	// Locations are in order. The order needs to match the order of the locations
	// on the board in a clockwise direction starting from GO!
	this.game_state.buildings = [
		{ pos: [692, 693], size: [108, 108], name: "GO!" },
		{ pos: [625, 693], size: [62, 108], name: "Avenue Campus", color: "#9f4710", price: 60, rent: [2, 10, 30, 90, 160, 250], houses: 50, mortgage: 30, type: "property" },
		{ pos: [564, 693], size: [62, 108], name: "Community Chest", color: "none", price: "none", rent: "none", houses: "none", mortgage: "none"},
		{ pos: [499, 693], size: [62, 108], name: "Winchester Campus", color: "#9f4710", price: 60, rent: [4, 20, 60, 180, 320, 450], houses: 50, mortgage: 30, type: "property" },
		{ pos: [434, 693], size: [62, 108], name: "Hobbit Tax", color: "none", price: "none", rent: "none", houses: "none", mortgage: "none", type: "tax" },
		{ pos: [369, 693], size: [62, 108], name: "The Bridge", color: "none", price: 200, rent: "none", houses: "none", mortgage: "none", type: "pub" },
		{ pos: [304, 693], size: [62, 108], name: "Shackleton", color: "#00c2f5", price: 100, rent: [6, 30, 90, 270, 400, 550], houses: 50, mortgage: 50, type: "property" },
		{ pos: [239, 693], size: [62, 108], name: "Chance" },
		{ pos: [174, 693], size: [62, 108], name: "Management", color: "#00c2f5",  price: 100, rent: [6, 30, 90, 270, 400, 550], houses: 50, mortgage: 50, type: "property" },
		{ pos: [109, 693], size: [62, 108], name: "Music", color: "#00c2f5",  price: 120, rent: [8, 40, 100, 300, 450, 600], houses: 50, mortgage: 60, type: "property" },
		{ pos: [0, 693], size: [108, 108], name: "Library", color: "none", price: "none", rent: "none", houses: "none", mortgage: "none", type: "jail" },
		{ pos: [0, 628], size: [108, 62], name: "Law", color: "#ff006e", price: 140, rent: [10, 50, 150, 450, 625, 750], houses: 100, mortgage: 120, type: "property" },
		{ pos: [0, 563], size: [108, 62], name: "SUSU Shop", color: "none", price: 150, rent: "none", houses: "none", mortgage: "none", type: "shop", logo: "images/shop-logo.png" },
		{ pos: [0, 498], size: [108, 62], name: "Murray Building", color: "#ff006e", price: 140, rent: [10, 50, 150, 450, 625, 750], houses: 100, mortgage: 70, type: "property" },
		{ pos: [0, 433], size: [108, 62], name: "Nuffield Theatre", color: "#ff006e", price: 160, rent: [12, 60, 180, 500, 700, 900], houses: 100, mortgage: 80, type: "property" },
		{ pos: [0, 368], size: [108, 62], name: "The Stag's", color: "none", price: 200, rent: "none", houses: "none", mortgage: "none", type: "pub" },
		{ pos: [0, 303], size: [108, 62], name: "Politics", color: "#ff7600", price: 180, rent: [14, 70, 200, 550, 750, 950], houses: 100, mortgage: 90, type: "property" },
		{ pos: [0, 238], size: [108, 62], name: "Community Chest" },
		{ pos: [0, 173], size: [108, 62], name: "Tizard Building", color: "#ff7600", price: 180, rent: [14, 70, 200, 550, 750, 950], houses: 100, mortgage: 90, type: "property" },
		{ pos: [0, 108], size: [108, 62], name: "Psychology", color: "#ff7600", price: 200, rent: [16, 80, 220, 600, 800, 1000], houses: 100, mortgage: 100, type: "property" },
		{ pos: [0, 0], size: [108, 108], name: "Free Parking" },
		{ pos: [109, 0], size: [62, 108], name: "Physics", color: "#f00", price: 220, rent: [18, 90, 250, 700, 875, 1050], houses: 150, mortgage: 110, type: "property" },
		{ pos: [174, 0], size: [62, 108], name: "Chance" },
		{ pos: [238, 0], size: [62, 108], name: "Lanchester", color: "#f00", price: 220, rent: [18, 90, 250, 700, 875, 1050], houses: 150, mortgage: 110, type: "property" },
		{ pos: [304, 0], size: [62, 108], name: "Maths", color: "#f00", price: 240, rent: [20, 100, 300, 750, 925, 1100], houses: 150, mortgage: 120, type: "property" },
		{ pos: [369, 0], size: [62, 108], name: "The Stile", color: "none", price: 200, rent: "none", houses: "none", mortgage: "none", type: "pub" },
		{ pos: [434, 0], size: [62, 108], name: "Eustice", color: "#faea00", price: 260, rent: [22, 110, 330, 800, 975, 1150], houses: 150, mortgage: 130, type: "property" },
		{ pos: [499, 0], size: [62, 108], name: "Graham Hill", color: "#faea00", price: 260, rent: [22, 110, 330, 800, 975, 1150], houses: 150, mortgage: 13, type: "property" },
		{ pos: [564, 0], size: [62, 108], name: "SUSU Café", color: "none", price: 150, rent: "none", houses: "none", mortgage: "none", type: "shop", logo: "images/cafe-logo.png" },
		{ pos: [628, 0], size: [62, 108], name: "Chemistry", color: "#faea00", price: 280, rent: [24, 120, 360, 850, 1025, 1200], houses: 150, mortgage: 140, type: "property" },
		{ pos: [692, 0], size: [108, 108], name: "Go to Jail" },
		{ pos: [692, 108], size: [108, 62], name: "Nightingale", color: "#00ad5c", price: 300, rent: [26, 130, 390, 900, 1100, 1275], houses: 200, mortgage: 150, type: "property" },
		{ pos: [692, 173], size: [108, 62], name: "EEE", color: "#00ad5c", price: 300, rent: [26, 130, 390, 900, 1100, 1275], houses: 200, mortgage: 150, type: "property" },
		{ pos: [692, 238], size: [108, 62], name: "Community Chest" },
		{ pos: [692, 303], size: [108, 62], name: "Life Sciences", color: "#00ad5c", price: 320, rent: [28, 150, 450, 1000, 1400], houses: 200, mortgage: 160, type: "property" },
		{ pos: [692, 368], size: [108, 62], name: "The Crown Inn", color: "none", price: 200, rent: "none", houses: "none", mortgage: "none", type: "pub" },
		{ pos: [692, 433], size: [108, 62], name: "Chance", color: "none", price: "none", rent: "none", houses: "none", mortgage: "none"  },
		{ pos: [692, 498], size: [108, 62], name: "Zepler", color: "#2c43a3", price: 350, rent: [28, 150, 450, 1000, 1200, 1400], houses: 200, mortgage: 160, type: "property" },
		{ pos: [692, 563], size: [108, 62], name: "Jesters Tax", color: "none", price: "none", rent: "none", houses: "none", mortgage: "none", type: "tax" },
		{ pos: [692, 628], size: [108, 62], name: "Mountbatten", color: "#2c43a3", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houses: 200, mortgage: 200, type: "property" }
	];

	var svgNS = "http://www.w3.org/2000/svg";
	var xlinkNS="http://www.w3.org/1999/xlink"; // namespace for linking to other documents
	var svg = canvas;

	var sotonopoly = this;

	for ( var i in this.game_state.buildings ) {
		var a = this.game_state.buildings[i];
		var element = document.createElementNS (svgNS, "rect");
		$(element)
			.attr ({ x: a.pos[0], y: a.pos[1], width: a.size[0], height: a.size[1], opacity: 0.0, color: a.color == "none" ? "white" : a.color })
			.css ({ "stroke-width": 2, fill: "white" });
			
		a.num_houses = 0;
		if ( a.type == "property" ) {
			var posfunc = null;
			// I have a feeling all this will need to be changed when Rod moves the squares about..
			if ( i < 10 ) posfunc = function (x, y, w, h, i) { return [x + 8 + 12 * i, y + 6]; }
			else if ( i < 20 ) posfunc = function (x, y, w, h, i) { return [x + w - 16, y + 8 + 12 * i]; }
			else if ( i < 30 ) posfunc = function (x, y, w, h, i) { return [x + 8 + 12 * i, y + h - 18]; }
			else if ( i < 40 ) posfunc = function (x, y, w, h, i) { return [x + 6, y + 8 + 12 * i]; }
			
			for ( var j = 0; j < 4; j++ ) {
				var house = document.createElementNS (svgNS, "rect");
				var position = posfunc (a.pos[0], a.pos[1], a.size[0], a.size[1], j);
				$(house)
					.attr ({ id: "building" + i + "_house" + j, x: position[0], y: position[1], width: 10, height: 10, opacity: 0.0 })
					.css ({ fill: "green" });
				$(svg).append (house);
			}
			
			var hotel = document.createElementNS (svgNS, "rect");
			var position = posfunc (a.pos[0], a.pos[1], a.size[0], a.size[1], 0);
			$(hotel)
				.attr ({ id: "building" + i + "_hotel", x: position[0], y: position[1], width: 10, height: 10, opacity: 0.0 })
				.css ({ fill: "red" });
			$(svg).append (hotel);
		}

		// Add the newly created rect element to the board
		$(svg).append (element);
		a.element = element;
		
		$("#player_one").hide();
		$("#player_two").hide();
		$("#player_three").hide();
		$("#player_four").hide();

		$(element)
			// Assign data to this rect element
			.data ("area", a)
			.mouseover (function() {
				var data = $(this).data("area");
				$(this).attr ("opacity", "0.5");
				$(".location").stop (true, true);

				if ( data.type == "property" ) {
					if ( data.color != "none" ) {
						$("#property .title").css ("background-color", data.color);
						// Small hack to get the text to turn black for yellow backgrounds
						if ( data.color == "#faea00" ) {
							$("#property .title").css ("color", "black");
						} else {
							$("#property .title").css ("color", "white");
						}
					} else {
						$("#property .title").css ("background-color", "#fff");
					}
					$("#property .title").text (data.name);
					$("#property .rent-site-only").text(data.rent[0]);
					$("#property .rent-one-house").text(data.rent[1]);
					$("#property .rent-two-houses").text(data.rent[2]);
					$("#property .rent-three-houses").text(data.rent[3]);
					$("#property .rent-four-houses").text(data.rent[4]);
					$("#property .rent-hotel").text(data.rent[5]);

					// test for ownership at some point
					// the #ownership div will show who owns the property
					$("#property #ownership").hide();

					$("#property").fadeIn ("fast");
				} else if ( data.type == "pub" ) {
					$("#pub .title").text (data.name);

					$("#pub").fadeIn ("fast");
				} else if ( data.type == "shop" ) {
					$("#shop .title").text (data.name);
					$("#shop #shop-image").attr ("src", data.logo);

					$("#shop").fadeIn ("fast");
				}
			})
			.mouseout (function() {
				var current_player = sotonopoly.getMyCurrentPlayer();
				var owned_by_current = false;
				if ( current_player !== null ) {
					var data = $(this).data("area");
					owned_by_current = ( current_player == data.owner );
				}
				
				if ( (!sotonopoly.turn.mortgaging_property && !sotonopoly.turn.improving_sites && !sotonopoly.turn.unmortgaging_property) || !owned_by_current ) {
					$(this).attr ("opacity", "0.0");
				}
				
				$(".location").hide();
			})
			.mousemove (function (e) {
				var area = $(this).data ("area");

				// Let's be smart about where to put this..
				var top, left, right, bottom;
				var div = $("#" + area.type);
				var pagewidth = parseInt ($(document).width());
				var pageheight = parseInt ($(document).height());
				var divwidth = parseInt (div.outerWidth());
				var divheight = parseInt (div.outerHeight());

				top = e.pageY + 10;
				left = e.pageX;
				right = left + divwidth;
				bottom = top + divheight;

				if ( right > pagewidth ) {
					left = e.pageX - divwidth;
				}

				if ( bottom > pageheight ) {
					top = e.pageY - divheight - 10;
				}

				$("#" + area.type).offset ({"top": top, "left": left});
			})
			.click (function (e) {
				if (sotonopoly.turn.improving_sites) {
					var data = $(this).data ("area");
					if ( data.type != "property" ) return;
				
					sotonopoly.turn.currently_improving = data;
				
					var has_hotel = (data.num_houses == 5);
					$("#improve-site #num-houses").html (has_hotel ? 1 : data.num_houses);
					$("#improve-site #building-type").html (has_hotel ? "lab" : "offices");
				
					$("#improve-site h2").html (data.name);
					if ( data.color != "none" ) {
						$("#improve-site h2").css ("background-color", data.color);
						// Small hack to get the text to turn black for yellow backgrounds
						if ( data.color == "#faea00" ) {
							$("#improve-site h2").css ("color", "black");
						} else {
							$("#improve-site h2").css ("color", "white");
						}
					} else {
						$("#improve-site h2").css ("background-color", "#fff");
					}
					$("#improve-site").show();
				}
				if(sotonopoly.turn.mortgaging_property) {
					var building = $(this).data("area");
					var current_player = sotonopoly.getMyCurrentPlayer();
					var myProperties = current_player.buildings_owned;
					if(myProperties.indexOf(building) != -1) {
						sotonopoly.turn.currently_mortgaging = building;
						$("#mortgage-site h2").html(building.name);
						$("#mortgage-site h2").css("background-color", building.color);
						$("#mortgage-site").show();
					}

				}
				if(sotonopoly.turn.unmortgaging_property) {
					var building = $(this).data("area");
					var current_player = sotonopoly.getMyCurrentPlayer();
					var mortgagedProperties = getPlayersMortgagedProperties(current_player);
					if(mortgagedProperties.indexOf(building) != -1) {
						sotonopoly.turn.currently_unmortgaging = building;
						$("#unmortgage-site h2").html(building.name);
						$("#unmortgage-site h2").css("background-color", building.color);
						$("#unmortgage-site").show();
					}
				}
				
			
			});
	}

	for ( var i in this.game_state.pieces ) {
		var a = this.game_state.pieces[i];
		var piece = document.createElementNS (svgNS, "image");
		$(piece).attr ({ id: a.name, x: a.pos[0], y: a.pos[1], width: a.size[0], height: a.size[1], opacity: 0 });
		
		piece.setAttributeNS(xlinkNS, "href", a.path);
		
		// Add the newly created rect element to the board
		$(svg).append(piece);
	}
	
	$("#remove-house").click (function() {
		if ( !sotonopoly.turn.improving_sites || !sotonopoly.turn.currently_improving ) return;
	
		var building = sotonopoly.turn.currently_improving;
		if ( building.num_houses <= 0 ) return false;
		
		$("#add-house, #remove-house").attr ("disabled", "disabled");
		$.post (
			"/game/edit_property",
			{
				game_key: sotonopoly.game_state.key,
				action: "sell",
				property: sotonopoly.game_state.buildings.indexOf (sotonopoly.turn.currently_improving)
			}
		);
	});
	
	$("#add-house").click (function() {
		if ( !sotonopoly.turn.improving_sites || !sotonopoly.turn.currently_improving ) return;
	
		if ( sotonopoly.turn.currently_improving.num_houses >= 5 ) return;
		
		$("#add-house, #remove-house").attr ("disabled", "disabled");
		$.post (
			"/game/edit_property",
			{
				game_key: sotonopoly.game_state.key,
				action: "buy",
				property: sotonopoly.game_state.buildings.indexOf (sotonopoly.turn.currently_improving)
			}
		);
	});
	
	$("#improve-site").center();
	$("#mortgage-site").center();
	$("#unmortgage-site").center();
	$("#improve-site #finished-improving").click (function() {
		sotonopoly.turn.currently_improving = false;
		$("#improve-site").hide();
	});
};

Sotonopoly.prototype.onChannelOpen = function() {
	log ("Connection with server open");
};

//Acts as a message dispatcher. Message is dispatched based on the
//message.data.status field.
Sotonopoly.prototype.onChannelMessage = function ( message ) {
	var msg = $.parseJSON (message.data);
	if ( 'error' in msg ) {
		myalert ("Error", msg.error);
		return;
	}

	if ( !('status' in msg) ) {
		log ("could not dispatch the message to correct handler. no status key exists in JSON object");
		log (msg);
	} else {
		if ( msg.status in this.message_handlers ) {
			this.message_handlers[msg.status].call (this, msg);
			this.updateButtons();
			this.updatePlayerList();
		} else {
			log ("no message handler exists for status \"" + msg.status + "\"");
		}
	}
};

Sotonopoly.prototype.onChannelError = function ( err ) {
	log ("ERROR: " + err.description);
};

Sotonopoly.prototype.getCoordinates=function(piece,move_to){
	var building = this.game_state.buildings[move_to];
	var xCentre = building.pos[0] + (building.size[0]/2);
	var yCentre = building.pos[1] + (building.size[1]/2);

	if (piece == 'mortarboard') {
		xCentre = xCentre - 25;
		yCentre = yCentre - 25;
	} else if(piece == 'dolphin') {
		xCentre = xCentre;
		yCentre = yCentre - 25;
	} else if(piece == 'book') {
		xCentre = xCentre - 25;
		yCentre = yCentre;
	} else if(piece == 'glass') {
		xCentre = xCentre;
		yCentre = yCentre;
	}
	return [xCentre, yCentre];
};

Sotonopoly.prototype.updatePlayerList = function () {
	var players = this.game_state.players;
	for(var i = 0; i < players.length; i++) {
		switch(players[i].id) {
			case 1:
				$("#player_one .amount").html(players[i].money);
				break;
			case 2:
				$("#player_two .amount").html(players[i].money);
				break;
			case 3:
				$("#player_three .amount").html(players[i].money);
				break;
			case 4:
				$("#player_four .amount").html(players[i].money);
				break;
		}
	}
};

Sotonopoly.prototype.move = function(next, elementName, placesToMove) {
	var pieceImage = document.getElementById(elementName);
	var x = parseInt(pieceImage.getAttributeNS(null, 'x'));
	var y = parseInt(pieceImage.getAttributeNS(null, 'y'));

	if(x < placesToMove[0][0]) {
		pieceImage.setAttributeNS(null, 'x', x + 1);
	}else if(x > placesToMove[0][0]) {
		pieceImage.setAttributeNS(null, 'x', x - 1);
	}
	
	if(y < placesToMove[0][1]) {
		pieceImage.setAttributeNS(null, 'y', y + 1);
	}else if(y > placesToMove[0][1]) {
		pieceImage.setAttributeNS(null, 'y', y - 1);
	}
	
	if (placesToMove[0][0] == x && placesToMove[0][1] == y) {
		placesToMove.shift();
	}

	if (placesToMove.length == 0) {
		next();
	}else{
		var t = this;
		setTimeout(function(){t.move(next, elementName, placesToMove)}, 3);
	}
};

function clearSquares(current_player) {
	if(current_player === null) return;
	$("#mortgage-site").hide();
	$("#unmortgage-site").hide();
	var buildings = current_player.buildings_owned;
	for(var b in buildings) {
		var building = buildings[b];
		$(building.element).attr("opacity", "0");
		$(building.element).css("fill", "#ffffff");
	}
};

// Called when the JSON object contains a status player_disconnected.
// It retrieves the player that disconnected.
// The properties previously owned by this player are reset, so that no one owns them.
// Then the player s removed from the list of player in the server and its piece is hidden.
// Finally, a message in the console is displayed

Sotonopoly.prototype.onPlayerDisconnected = function ( data ){
	var p = this.getPlayerFromPiece ( data.piece );
	
	var index = this.game_state.players.indexOf( p );
	for ( i in p.buldings_owned) {
		p.buildings_owned[i] = null;
	} 
	
	this.game_state.players.splice(index, 1);
	$("#" + p.piece).attr ("opacity", 0);
	log(p.name = " has disconnected");
};