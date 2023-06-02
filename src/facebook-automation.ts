import puppeteer from "puppeteer";

import {productDetalies} from "./interface-facebook-automation"

import {FACEBOOK_URL,FACEBOOK_MARKET_PLACE_URL,oneSecend, marketSearchItem} from "./constants"

import { facebookSelecter } from "./facebook-selecter";


browserWork()

async function browserWork(): Promise<void> {
    try {
        await facebook_data_wcriping()
    }
    catch (error) {
        console.log(error)
    }
}


async function facebook_market_data(browser: any, link: any):Promise<productDetalies> {

    const newPage = await browser.newPage();

    await newPage.goto(link)

    const productDetailes =await selecterWorkText(newPage,facebookSelecter.selecterProductDetailes)

    const product_Price = await selecterWorkText(newPage,facebookSelecter.selecterProductPrice)

    const productSellerAddress = await selecterWorkText(newPage,facebookSelecter.selecterProductAddress)

    const productSellerProfilelink = await selecterWorkHrefLink(newPage,facebookSelecter.selecterProductProfileLink)

    const productSellerName = await selecterWorkText(newPage,facebookSelecter.selecterProductSellerName)

    const productDetalies = {
        productDescription: productDetailes,
        productPrice: product_Price,
        address: productSellerAddress,
        productProfileLink: productSellerProfilelink,
        productSellerName: productSellerName
    }

    newPage.close()

    return productDetalies
}

async function facebook_data_wcriping() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 20 });

    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 });

    await page.goto(FACEBOOK_URL);

    await page.waitForSelector(facebookSelecter.facebookEmailSeleter)

    await page.type(facebookSelecter.facebookEmailSeleter, "@@@@@@@oe.com")

    await page.type(facebookSelecter.facebookPasswordSeleter,"D#$#$$$a12@")

    await page.click(facebookSelecter.facebookSubmitButtonSeleter)

    await page.waitForNavigation()

    await page.waitForTimeout(oneSecend*3)

    await page.goto(FACEBOOK_MARKET_PLACE_URL)

    await page.waitForTimeout(oneSecend*5)

    await page.waitForSelector(facebookSelecter.facebookMarketPlaceInbox)

    await page.type(facebookSelecter.facebookMarketPlaceInbox, marketSearchItem)

    await page.keyboard.press('Enter');

    await page.waitForTimeout(oneSecend*5)

    const productLinks = await page.evaluate((sel) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.href);
    }, facebookSelecter.facebookProductLinkSEleter);


    const productArray = []

    for (const link of productLinks) {

        const productData = await facebook_market_data(browser, link)

        productArray.push(productData)

    }
    console.log(productArray)

    browser.close()
}


async function selecterWorkText(newPage :any,selecterinformation:any):Promise<string>{

    await newPage.waitForSelector(selecterinformation)

    const data= await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, selecterinformation);
    
    const newData =data.toString()
    
    return newData
}

async function selecterWorkHrefLink(newPage :any,selecterinformation:any):Promise<string>{

    await newPage.waitForSelector(selecterinformation)

    const data= await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.href);
    }, selecterinformation);
    
    const newData =data.toString()
    
    return newData
}