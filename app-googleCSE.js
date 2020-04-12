var express = require('express');
var linebot = require('linebot');
var qwant = require("qwant-api"); // 2020-04-12 Qwant API 傳回未知的 errorCode:7, 無法再使用
const randomInt = require('random-int');
const request = require('request');

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

  // Google Custom SDearch Engine (CSE) 免費的帳號 "好像" 次只能查詢 10 筆，但還好是可以指定 Start Index
  // "template": "https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&relatedSite={relatedSite?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"
  
  var searchFor = event.message.text;
  var searchCount = 190;  // Google CSE limit it not more than 191

  var randomStartIndex = randomInt(1, searchCount);
  console.log(randomStartIndex);

  var paramToSend = encodeURI("https://www.googleapis.com/customsearch/v1?cx=005803247661827777184:gn8txv8dpgt&key=AIzaSyAIzpCnerVsyynAe8lSxSGIX0X2vxZRuVs&searchType=image&q="+searchFor+"&start="+String(randomStartIndex));

  var resBody;
  request(paramToSend, function(error, response, body) {
    
    resBody=JSON.parse(body);
    console.log(resBody.items.length, resBody.items[0].link);
    
    var msg = [{
      type: 'image',
      originalContentUrl: resBody.items[0].link,
      previewImageUrl:    resBody.items[0].link
    }, 'Thank you'];

    event.reply(msg).then(function(data) {
      // success
      console.log('Replied!');
    }).catch(function(error) {
      // error
     console.log('error');
    }); 
    
  });  
  
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


//要讓 LINE 使用 webhook 必須是 port 80，所以將預設的 port 改為 80
var server = app.listen(process.env.PORT || 80, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});