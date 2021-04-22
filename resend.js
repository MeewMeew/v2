module.exports.config = {
	name: "resend",
	version: "1.2.2",
	hasPermssion: 1,
	credits: "Thọ",
	description: "Thì là resend đó",
	commandCategory: "group", 
	usages: "resend",
	cooldowns: 5, 
	dependencies: ["tinyurl","fs-extra"]
};

module.exports.event = async function ({ event, api, client, Users }) {
  let {messageID, senderID, threadID, body } = event;
  let fs = require("fs-extra");
  if (!client.message) client.message = new Array();
  if (!fs.existsSync(__dirname + "/cache/resend.json")) {
  fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify({}), null,8);
}
 
  var resend = JSON.parse(fs.readFileSync(__dirname + "/cache/resend.json"))
    if (!Object.keys(resend).some(item => item == event.threadID.toString())) {
          if (event.isGroup) {
            resend[event.threadID] = {on: "false" };
            fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 8));
             }
    } 

					
     resend = JSON.parse(fs.readFileSync(__dirname + "/cache/resend.json"))
  if(!resend) return;
       if (resend[event.threadID.toString()]) {
				let getThread = resend[event.threadID.toString()]["on"];
				if (getThread == "false") return;
       }
  
    if(event.type != "message_unsend") client.message.push({
    msgID:messageID,
    msgBody:body,
    attachment:event.attachments
  })
    if(event.type == "message_unsend") {
      if(!client.message.some(item => item.msgID == messageID)) return;
      var getMsg = client.message.find(item => item.msgID == messageID);
     let name = (await Users.getData(event.senderID)).name;
      if(getMsg.msgBody != "") return api.sendMessage(`${name} đã gỡ 1 tin nhắn:\n${getMsg.msgBody}`,threadID)
      else {
            let num = 0
            let msg = `${name} vừa gỡ ${getMsg.attachment.length} tệp đính kèm:\n`
          for (var i = 0; i < getMsg.attachment.length; i++) {
				var shortLink = await require("tinyurl").shorten(getMsg.attachment[i].url);
				num +=1;
        msg += `${num}: ${shortLink}\n`;
    	}
        api.sendMessage(msg,threadID);
        }
     
      }
    }

module.exports.run = async function({ api, event, args}) {
  let { messageID, threadID, senderID } = event
  let fs = require("fs-extra");
  let resend = JSON.parse(fs.readFileSync(__dirname + "/cache/resend.json"));
  if(!resend[threadID.toString()]) {
    resend[threadID.toString()] = {on: "false" };
     fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 8));
    return api.sendMessage("Tạo data resend thành công",threadID,messageID)
      }
  let getThread = resend[threadID.toString()];
		
  switch (getThread["on"]) {
    case "false": 
      getThread["on"] = "true";
          api.sendMessage("Bật resend thành công!", threadID, () => fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 4)), messageID);
      break;
    case "true":
          getThread["on"] = "false";
         api.sendMessage("Tắt resend thành công!", threadID, () => fs.writeFileSync(__dirname + "/cache/resend.json", JSON.stringify(resend, null, 4)), messageID);
      break;
         
       }
  }
 
