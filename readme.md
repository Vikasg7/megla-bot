# megla-bot
A functional styled Twitch Bot written in Nodejs powered by RXJS and RamdaJS  

## Must have
Make sure to install [Nodejs](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads) before you proceed with Installation.  

## Installation 
```console
$ git clone https://github.com/Vikasg7/megla-bot.git
$ cd megla-bot
$ npm install
$ npm run build
$ npm start
```  

## Configuration  
Make sure to add `config.json` based on `example-config.json` to the `megla-bot` folder before you run the bot.  

## Add new Bot
Add your new bot function as a key value pair in the `bots\index.js` having the key as command name and value as a function that will receive the tags and args as arguments just like weather bot and list bot does.