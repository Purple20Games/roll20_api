// Github:   https://github.com/Purple20Games/roll20_api/blob/main/p20_mod.js
// By:       Purple20 Games


const P20Bot = (() => { //eslint-disable-line no-unused-vars

  const version = '0.2.0';
  const lastUpdate = 1704050051;

  // create a PC attribute and return it
  const createAttribute = (char_id, attr_name, attr_val) => {

    let attr_val_t = String(attr_val).trim();
    let attr = createObj("attribute", { name: attr_name, current: attr_val_t, _characterid: char_id });
    log("Setting " + attr_name + " to value " + attr_val_t);
    return attr;
  };

  // return text between two strings
  const regex_between = (regexp, str) => {

    // todo -- make this way more robust
    let matches = str.match(regexp);
    return matches[1];
  };

  // Create a PC character from a raw DCC character message
  const createCharFromRawMessage = (msg) => {

    let charname = regex_between(/Occupation: (.*?)</, msg);
    let mychar = createObj('character', { name: charname } );

    let str = regex_between(/Strength: (.*?) \(.*?\)/, msg);
    createAttribute(mychar.id, "str", str);
    createAttribute(mychar.id, "strMax", str);
    let agi = regex_between(/Agility: (.*?) \(.*?\)/, msg);
    createAttribute(mychar.id, "agi", agi);
    createAttribute(mychar.id, "agiMax", agi);
    let per = regex_between(/Personality: (.*?) \(.*?\)/, msg);
    createAttribute(mychar.id, "per", per);
    createAttribute(mychar.id, "perMax", per);
    let intt = regex_between(/Intelligence: (.*?) \(.*?\)/, msg);
    createAttribute(mychar.id, "int", intt);
    createAttribute(mychar.id, "intMax", intt);
    let sta = regex_between(/Stamina: (.*?) \(.*?\)/, msg);
    createAttribute(mychar.id, "sta", sta);
    createAttribute(mychar.id, "staMax", sta);
    let luck = regex_between(/Luck: (.*?) \(.*?\)/, msg);
    createAttribute(mychar.id, "luck", luck);
    createAttribute(mychar.id, "luckMax", luck);

    createAttribute(mychar.id, "REF", regex_between(/Ref: (.*?);/, msg));
    createAttribute(mychar.id, "FORT", regex_between(/Fort: (.*?);/, msg));
    createAttribute(mychar.id, "WILL", regex_between(/Will: (.*?)</, msg));

    let hp = regex_between(/; HP: (.*?)</, msg);
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

        let treasure = regex_between(/Trade good: (.*?)</, msg) + "\r" + regex_between(/Starting Funds: (.*?)</, msg) + "\r" + regex_between(/Weapon: (.*?)</, msg);
        createAttribute(mychar.id, "treasure", treasure);
        createAttribute(mychar.id, "Equipment", regex_between(/Equipment: (.*?)</, msg));
        createAttribute(mychar.id, "Languages", regex_between(/Languages: (.*?)</, msg));

        let starting_copper = regex_between(/Starting Funds: (.*?) cp</, msg);
        createAttribute(mychar.id, "CP", starting_copper);
        createAttribute(mychar.id, "SP", 0);
        createAttribute(mychar.id, "GP", 0);
        createAttribute(mychar.id, "EP", 0);
        createAttribute(mychar.id, "PP", 0);

        return mychar;
      };


  const checkInstall = () => {
    log('-=> P20Bot v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');
  };

  const handleInput = (msg) => {

    // check for magic strings from Crawler Companion
    if (/Generator Settings: Source:/.test(msg.content)) {
      sendChat("P20Bot", "DCC PC statistics detected! Creating character...");
      /*let mychar = */ createCharFromRawMessage(msg.content);
    } 

    if (msg.type !== "api") {
      return;
    }


    let args = msg.content.split(/\s+/);
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
  };

  const registerEventHandlers = () => {
    on('chat:message', handleInput);
  };

  on('ready',() => {
    checkInstall();
    registerEventHandlers();
  });

  return {};

})();
