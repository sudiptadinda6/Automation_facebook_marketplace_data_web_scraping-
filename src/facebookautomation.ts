import puppeteer from "puppeteer";

browserWork()

async function browserWork(): Promise<void> {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 20 });

        const page = await browser.newPage();

        await page.setViewport({ width: 1080, height: 1024 });

        await page.goto('https://www.facebook.com/');

        await page.waitForSelector('#email')

        await page.type('#email', "petofem399@lieboe.com")

        await page.type('#pass', 'Diganta12@')

        await page.click(`[type="submit"]`)

        await page.waitForNavigation()

        await page.waitForTimeout(3 * 1000)

        await page.goto('https://www.facebook.com/marketplace/?ref=bookmark')

        await page.waitForTimeout(5*1000)

        await page.waitForSelector(`input[aria-label="Search Marketplace"]`)

        await page.type(`input[aria-label="Search Marketplace"]`, "ktm")

        await page.keyboard.press('Enter');

        await page.waitForTimeout(5 * 1000)

        const productLinks = await page.evaluate((sel) => {
            const elements = document.querySelectorAll(sel);
            return Array.from(elements, (el: any) => el.href);
        }, 'div[class="x3ct3a4"] >a');


        const productArray = []

        for (const link of productLinks) {

            const productData = await facebook_market_data(browser, link)

            productArray.push(productData)

        }
        console.log(productArray)

        browser.close()
    }
    catch (error) {
        console.log(error)
    }
}


async function facebook_market_data(browser: any, link: any) {

    const newPage = await browser.newPage();

    await newPage.goto(link)

    await newPage.waitForSelector('div:nth-child(1) > h1 > span')

    const data_product_name_detailes = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, 'div:nth-child(1) > h1 > span');

    const newdata_product_name_detailes = data_product_name_detailes.toString()

    await newPage.waitForSelector('div[class="x1xmf6yo"] >div >span')

    const data_product_price_detailes = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, 'div[class="x1xmf6yo"] >div >span');

    const newdata_product_price_detailes = data_product_price_detailes.toString()

    await newPage.waitForSelector('div>div >span >a >span')

    const data_product_address_detailes = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, 'div>div >span >a >span');

    const newdata_product_address_detailes = data_product_address_detailes.toString()

    await newPage.waitForSelector('span >span >div >div >a')

    const data_product_profilelink_detailes = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.href);
    }, 'span >span >div >div >a');

    const newdata_product_profilelink_detailes = data_product_profilelink_detailes.toString()

    await newPage.waitForSelector('span >span >div >div >a>span')

    const data_product_womername_detailes = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, 'span >span >div >div >a>span');

    const newdata_product_womername_detailes = data_product_womername_detailes.toString()

    let productDetalies = {
        product_description: newdata_product_name_detailes,
        product_price: newdata_product_price_detailes,
        address: newdata_product_address_detailes,
        product_profile_link: newdata_product_profilelink_detailes,
        product_woner_name: newdata_product_womername_detailes
    }

    newPage.close()

    return productDetalies

}
