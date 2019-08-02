const puppeteer = require('puppeteer');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

//275 230
(async () => {
  const emulate = {
    viewport:{ 
      height: 230, 
      width: 375, 
      isMobile: true, 
    },
    userAgent: 'screen'
  }
 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(emulate);
  await page.goto('https://example.com');
  await page.screenshot({path: './capture.png'});

  await browser.close();

  const img1 = PNG.sync.read(fs.readFileSync('design1.png'));
  const img2 = PNG.sync.read(fs.readFileSync('design2.png'));

  const img3 = PNG.sync.read(fs.readFileSync('capture.png'));
  const {width, height} = img1;
  const diff1 = new PNG({width, height});
  const diff2 = new PNG({width, height});

  const pixelDiff1 = pixelmatch(img1.data, img3.data, diff1.data, width, height, {threshold: 0.1});
  const pixelDiff2 = pixelmatch(img2.data, img3.data, diff2.data, width, height, {threshold: 0.1});

  const percentDiff1 = pixelDiff1 / (width * height) * 100
  const percentDiff2 = pixelDiff2 / (width * height) * 100

  fs.writeFileSync('diff1.png', PNG.sync.write(diff1));
  fs.writeFileSync('diff2.png', PNG.sync.write(diff2));

  console.log("percentage difference from design 1: " + percentDiff1 +"%");
  console.log("percentage difference from design 2: " + percentDiff2 +"%");

})();



