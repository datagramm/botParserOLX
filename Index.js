const {Telegraf} = require('telegraf');
const bot = new Telegraf('5766082947:AAGtFMnY6PF7-llWDAtJEmvXXqNBXujGZPk')
const rp = require('request');
const cheerio = require('cheerio');
const {type} = require("superagent/lib/utils");
const url = 'https://www.olx.ua/d/uk/rabota/uzhgorod/?currency=UAH';
let urlsPreArray = [];
let urls = [];
let timer;
setInterval(()=>{

   rp(url, (error, response, html)=>{
       async function getUrls() {
           if (!error && response.statusCode === 200) {
               urlsPreArray = [];
               urls = [];
               function pushUrls(item){
                   urlsPreArray.push('olx.ua' + item.attribs.href)
               }
               const $ = await cheerio.load(html);
                if ($('.css-19ucd76 > a').length !== 0) {
                    for (const item of $('.css-19ucd76 > a')) {
                     await pushUrls(item);
                    }
                   await console.log(urlsPreArray)
                   await console.log(urlsPreArray.length)
                     for (let i = urlsPreArray.length - 5; i < urlsPreArray.length; i++ ){
                         urls.push(urlsPreArray[i]);
                     }
                     console.log(urls)

                }
                else console.log('Array of link is empty');
           }
       }
       getUrls();

    })
},3000)

 bot.hears('pulling', ctx =>{

     ctx.reply('Hello, im work! Now im pulling ...')
     if(urls.length !== 0) {
         async function* gen(start, end) {
             for (let i = start; i <= end; i++) {
                 await new Promise(resolve => setTimeout(resolve, 1000));
                 yield i;
             }
         }

         (async () => {
             let generator = gen(0, 4);
             for await (let value of generator) {
                 bot.telegram.sendMessage("-845165248", urls[value])
             }

         })();
         timer = setInterval(async () => {
             let generator = gen(0, 4);
             for await (let value of generator) {
                 bot.telegram.sendMessage("-845165248", urls[value])
             }
         }, 1800000)
     }
     else {ctx.reply('Sorry, but request page  are empty  in moment of parsing')}


})
bot.hears('stop', ctx => {
    clearInterval(timer);
    ctx.reply('Interval was stopping')
})


bot.launch();


