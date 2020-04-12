var express = require('express');
var linebot = require('linebot');
var qwant = require("qwant-api");
const randomInt = require('random-int');

// Get channelId, channelSecret, channelAccessToken from the Messaging API page

// The data needs to be included is a pair of quot marks.
var bot = linebot({
  channelId: '1534513091',
  channelSecret: '731960273e6f4236b93839df10bf4263',
  channelAccessToken: '6b2SrZ/6nHn7hSL6C9+OIFNOV1LCWeEKTJRel6doYp5G+QCWzwH83FcSAtpHfV+h0wrClYePhffwD7u4FAQp95ZudhReQkMfQ6ehOaXDuexuNZNYyPFjRNsjei1W9aC7/JPMjQzqSkubBrRvfegTxgdB04t89/1O/w1cDnyilFU='
});

// When the LINE server gets the message from another user to HelloWorldBot,
// the LINE server will send message to the webhook URL
bot.on('message', function(event) {
  //console.log(event, event.message.type);
  //var msg = 'Hello World1';
  console.log(event);
  console.log("userId: "+event.source.userId);
  console.log("message text: "+event.message.text+"\n");


  var serachFor = event.message.text;
  var searchCount = 50;

  qwant.search("images", 
    { query: serachFor, count: searchCount, offset: 1}, 
    function(err, data){
      if (err) return console.log(err);

      var i = randomInt(searchCount-1);
      var imageUrl    = data["data"]["result"]["items"][i]["media"];
      var imageSize   = data["data"]["result"]["items"][1]["size"];
      var imageWidth  = data["data"]["result"]["items"][i]["width"];
      var imageHeight = data["data"]["result"]["items"][1]["height"];

      var splitHead = imageUrl.split(":")[0];
      var splitBody = imageUrl.split(":")[1];

      console.log("head: " + splitHead);
      console.log("body: " + splitBody);
      console.log(i +": url "   + imageUrl    +"\n");
      console.log(i +": size "  + imageSize   +"\n");
      console.log(i +": width " + imageWidth  +"\n");
      console.log(i +": height "+ imageHeight +"\n");

      if (splitHead == "http") {
         splitHead = "https";
       }

      console.log(splitHead +":" +splitBody);
      var msg = [{
        type: 'image',
        originalContentUrl: splitHead+":"+splitBody,
        previewImageUrl:    splitHead+":"+splitBody
      }, 'try again'];

      event.reply(msg).then(function(data) {
        // success 
        console.log('Replied!');
      }).catch(function(error) {
        // error
       console.log('error');
    });
     }
  );



  //var msg = [{
  //  type: 'image',
  //  originalContentUrl: 'https://www.petpaw.com.au/wp-content/uploads/2012/09/Australian-Mist.jpg',
  //  previewImageUrl: 'https://www.petpaw.com.au/wp-content/uploads/2012/09/Australian-Mist.jpg'
  //}, 'try again'];
  //event.reply(msg).then(function(data) {
  //    // success 
  //    console.log('Replied!');

  //  }).catch(function(error) {
  //    // error
  //   console.log('error');
   // });
});



const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


//要讓 LINE 使用 webhook 必須是 port 80，所以將預設的 port 改為 80
var server = app.listen(process.env.PORT || 80, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
