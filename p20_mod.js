// Github:   https://github.com/....
// By:       ....
// Contact:  ....


// create a PC attribute and return it
function createAttribute(char_id, attr_name, attr_val) {

	var attr_val_t = String(attr_val).trim();
	var attr = createObj("attribute", { name: attr_name, current: attr_val_t, _characterid: char_id });
	log("Setting " + attr_name + " to value " + attr_val_t);
	return attr;
}

// return text between two strings
function regex_between(regexp, str) {

	// todo -- make this way more robust
	var matches = str.match(regexp);
	return matches[1];
}

// Create a PC character from a raw DCC character message
function createCharFromRawMessage(msg) {

	var charname = regex_between(/Occupation: (.*?)</, msg);
	var mychar = createObj('character', { name: charname } );
								
	var str = regex_between(/Strength: (.*?) \(.*?\)/, msg);
	createAttribute(mychar.id, "str", str);
	createAttribute(mychar.id, "strMax", str);
	var agi = regex_between(/Agility: (.*?) \(.*?\)/, msg);
	createAttribute(mychar.id, "agi", agi);
	createAttribute(mychar.id, "agiMax", agi);
	var per = regex_between(/Personality: (.*?) \(.*?\)/, msg);
	createAttribute(mychar.id, "per", per);
	createAttribute(mychar.id, "perMax", per);
	var intt = regex_between(/Intelligence: (.*?) \(.*?\)/, msg);
	createAttribute(mychar.id, "int", intt);
	createAttribute(mychar.id, "intMax", intt);
	var sta = regex_between(/Stamina: (.*?) \(.*?\)/, msg);
	createAttribute(mychar.id, "sta", sta);
	createAttribute(mychar.id, "staMax", sta);
	var luck = regex_between(/Luck: (.*?) \(.*?\)/, msg);
	createAttribute(mychar.id, "luck", luck);
	createAttribute(mychar.id, "luckMax", luck);
	
	createAttribute(mychar.id, "REF", regex_between(/Ref: (.*?);/, msg));
	createAttribute(mychar.id, "FORT", regex_between(/Fort: (.*?);/, msg));
	createAttribute(mychar.id, "WILL", regex_between(/Will: (.*?)</, msg));
	
	var hp = regex_between(/; HP: (.*?)</, msg);
	createObj("attribute", { name: "HP", current: hp, max: hp, _characterid: mychar.id });
	
	createAttribute(mychar.id, "INIT", regex_between(/Init: (.*?);/, msg));
	createAttribute(mychar.id, "Speed", regex_between(/Speed: (.*?);/, msg));
	createAttribute(mychar.id, "Level", 0);
	createAttribute(mychar.id, "HPDie", "d4");
	
	createAttribute(mychar.id, "race", "");
	createAttribute(mychar.id, "occupation", regex_between(/Occupation: (.*?)</, msg));
	createAttribute(mychar.id, "Alignment", "");
	createAttribute(mychar.id, "Title", "");
	createAttribute(mychar.id, "className", "");
	
	//createAttribute(mychar.id, "allAtkLuckyRoll", "[[@{luckStartingMod}]]");
	createAttribute(mychar.id, "birthAugur", regex_between(/Lucky sign: (.*?) \(/, msg)); 
	createAttribute(mychar.id, "luckyRoll", regex_between(/Lucky sign: .*? \((.*?)\) \(/, msg)); 
	
	var treasure = regex_between(/Trade good: (.*?)</, msg) + "\r" + regex_between(/Starting Funds: (.*?)</, msg) + "\r" + regex_between(/Weapon: (.*?)</, msg)
	createAttribute(mychar.id, "treasure", treasure);
	createAttribute(mychar.id, "Equipment", regex_between(/Equipment: (.*?)</, msg));
	createAttribute(mychar.id, "Languages", regex_between(/Languages: (.*?)</, msg));
	
	var starting_copper = regex_between(/Starting Funds: (.*?) cp</, msg);
	createAttribute(mychar.id, "CP", starting_copper);
	createAttribute(mychar.id, "SP", 0);
	createAttribute(mychar.id, "GP", 0);
	createAttribute(mychar.id, "EP", 0);
	createAttribute(mychar.id, "PP", 0);
	
	return mychar;
}


var P20Bot = P20Bot || (function() {
	'use strict';

	var version = '0.1.0',
	lastUpdate = 1530335089,

	checkInstall = function() {
		log('-=> P20Bot v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');
	},

	handleInput = function(msg) {
	
		// check for magic strings from Crawler Companion

		if (msg.content.includes("Generator Settings: Source:")) {
			sendChat("P20Bot", "DCC PC statistics detected! Creating character...");
			var mychar = createCharFromRawMessage(msg.content);
		} 
		
		if (msg.type !== "api") {
			return;
		}
		

		var args = msg.content.split(/\s+/);
		switch(args.shift()) {
			case '!p20':
			
				switch(args.shift()) {
					case 'ping':
						sendChat('P20Bot','pong');
						break;
				
					/*case 'gen':
						
						var char = createCharFromRawMessage(msg.content)
						
						sendChat('P20Bot','I have created a new character, by your command');
						break;*/
				
				}
				
				break;
			
		}
	},

	registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};

}());

on('ready',function() {
	'use strict';

	P20Bot.CheckInstall();
	P20Bot.RegisterEventHandlers();
});