import puppeteer from "puppeteer";

import {productDetalies} from "./interface-facebook-automation"

import {FACEBOOK_URL,FACEBOOK_MARKET_PLACE_URL,fiveSec,ThreeSec} from "./constants"

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

    await newPage.waitForSelector(facebookSelecter.selecterProductDetailes)

    const data_product_name_detailes = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, facebookSelecter.selecterProductDetailes);

    const newdata_product_name_detailes = data_product_name_detailes.toString()

    await newPage.waitForSelector(facebookSelecter.selecterProductPrice)

    const product_Price = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, facebookSelecter.selecterProductPrice);

    const newproduct_Price = product_Price.toString()

    await newPage.waitForSelector(facebookSelecter.selecterProductAddress)

    const productSellerAddress = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    }, facebookSelecter.selecterProductAddress);

    const newproductSellerAddress = productSellerAddress.toString()

    await newPage.waitForSelector(facebookSelecter.selecterProductProfileLink)

    const productSellerProfilelink = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.href);
    },facebookSelecter.selecterProductProfileLink);

    const newproductSellerProfilelink = productSellerProfilelink.toString()

    await newPage.waitForSelector(facebookSelecter.selecterProductSellerName)

    const productSellerName = await newPage.evaluate((sel: any) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements, (el: any) => el.innerText);
    },facebookSelecter.selecterProductSellerName);

    const newproductSellerName = productSellerName.toString()

    const productDetalies = {
        productDescription: newdata_product_name_detailes,
        productPrice: newproduct_Price,
        address: newproductSellerAddress,
        productProfileLink: newproductSellerProfilelink,
        productSellerName: newproductSellerName
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

    await page.type(facebookSelecter.facebookEmailSeleter, "$%$##$$$$@lieboe.com")

    await page.type(facebookSelecter.facebookPasswordSeleter,"#####12@")

    await page.click(facebookSelecter.facebookSubmitButtonSeleter)

    await page.waitForNavigation()

    await page.waitForTimeout(ThreeSec)

    await page.goto(FACEBOOK_MARKET_PLACE_URL)

    await page.waitForTimeout(fiveSec)

    await page.waitForSelector(facebookSelecter.facebookMarketPlaceInbox)

    await page.type(facebookSelecter.facebookMarketPlaceInbox, "ktm")

    await page.keyboard.press('Enter');

    await page.waitForTimeout(fiveSec)

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
