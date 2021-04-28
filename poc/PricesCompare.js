const puppeteer = require("puppeteer");
let links=["https://www.amazon.in","http://www.flipkart.com","http://paytmmall.com"];
let cTab;
let pName="iphone11";
(async function fn() {
    try {
        let browserOpenPromise = puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let browser = await browserOpenPromise;
        let allTabsArr=await browser.pages();
        cTab=allTabsArr[0];
        
        let list1=await getListingFromAmazon(links[0]);
        let list2=await getListFromFlipkart(links[1]);
        let list3=await getListFromPaytmmall(links[2]);
        console.table(list2);
        console.table(list1);
        console.table(list3);
        

        
    }catch(err){
        console.log(err);
    }

})();
async function getListingFromAmazon(link)
{
    await cTab.goto(link);
    await cTab.type("input[name='field-keywords']"," iPhone 11  ");
    await cTab.keyboard.press("Enter");
    await cTab.waitForSelector(".a-size-medium.a-color-base.a-text-normal",{visible:true});
    return cTab.evaluate(consoleFn,".a-size-medium.a-color-base.a-text-normal",".a-price-whole");
}



async function getListFromFlipkart(link){
    await cTab.goto(link);
    await cTab.type("input[name='q']","Appple iphone11");
    await cTab.keyboard.press("Enter");
    await cTab.waitForSelector("._4rR01T",{visible:true});
    return cTab.evaluate(consoleFn,"._4rR01T","._30jeq3");
}
async function getListFromPaytmmall(link){
    await cTab.goto(link);
    await cTab.type("input[id='searchInput']","Apple iphone11");
    await cTab.click("input[id='searchInput']");
    await cTab.keyboard.press("Enter");
    await cTab.waitForSelector(".UGUy",{visible:true});
    return cTab.evaluate(consoleFn,".UGUy","._1kMS");
}
function consoleFn(nameselector,priceselector){
    let NameElems=document.querySelectorAll(nameselector);
    let PriElems=document.querySelectorAll(priceselector);
    let listings=[];
    for(let i =0;i<5;i++){
        let name=NameElems[i].innerText;
        let price=PriElems[i].innerText;
        listings.push({
            name,price
        })
    }
return listings;
    
}

