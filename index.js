const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


(async() => {
const bookId = (await axios.get("https://lyampaul.github.io/qimao")).data
const { data } = (await axios.get("https://www.qimao.com/api/book/chapter-list?book_id="+bookId)).data
const browser = await puppeteer.launch();
for (var i in data.chapters) {
var { id, title } = data.chapters[i]
console.log(`Launch new page for ${id} - ${title}`)
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.0 Safari/537.36");
await page.setViewport({ width: 1280, height: 720 });
await page.goto(`https://www.qimao.com/shuku/${bookId}-${id}/`);
if (!fs.existsSync(bookId)){
    fs.mkdirSync(bookId);
}
console.log(`   Taking screenshot`)
await page.screenshot({ path:`./${bookId}/${title}.png`, fullPage: true });
const content = await page.content();
const $ = cheerio.load(content.replaceAll("\u003C\u002Fp\u003E\u003Cp\u003E", "\n"));
console.log(`   Saving Content`)
fs.writeFileSync(`./${bookId}/${title}.txt`, $(".article").text())
await page.close()
console.log(`Done for ${id}`)
}
await browser.close()
})();
