const puppeteer = require("puppeteer");
// let { answers } = require("./code");
let link="https://www.monsterindia.com/";
let pName = process.argv[2];
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
        cTab.setDefaultNavigationTimeout(50000)
        await apply(link);
    }catch(err){
        console.log(err);
    }
})();

async function apply(link){
    await cTab.goto(link);
    await cTab.waitForSelector("#seekerLoginBtn");
    await cTab.click("#seekerLoginBtn");
    await cTab.waitForSelector("#signInName");
    await cTab.click("#signInName");
    await cTab.type("#signInName","cse.18bcs3018@gmail.com");
    await cTab.click("#password");
    await cTab.type("#password","Raj8465@");
    await cTab.click(".form-control.signInbtnCont")
    await cTab.waitForSelector(".col-xl-2.col-lg-3.col-sm-2.col-xxs-12.fr-imp.no-padding.adv-search");
    await cTab.click(".col-xl-2.col-lg-3.col-sm-2.col-xxs-12.fr-imp.no-padding.adv-search");
    await cTab.waitForSelector("input[placeholder='Enter Job Keywords']")
    await cTab.type("input[placeholder='Enter Job Keywords']","Web Developer");
    await cTab.waitForTimeout(200);
    await cTab.type("input[class='input adv_location_ac modal-ref-class']","Delhi");
    await cTab.click("input[class='btn modal-ref-class']");
    await cTab.waitForTimeout(200);    
    await cTab.waitForSelector(".col-xxs-12.col-sm-3.text-ellipsis")
    let arr=await cTab.evaluate(consoleFn,".col-xxs-12.col-sm-3.text-ellipsis");
    console.table(arr);
    for(let i=1;i<arr.length;i++){
    await cTab.goto(arr[i]);
    await cTab.waitForSelector(".apply-footer-action.fr.mt10 .line-btn.btn-apply.btn-apply-only");
    await cTab.click(".apply-footer-action.fr.mt10 .line-btn.btn-apply.btn-apply-only");
    }

}
 function consoleFn(selector){
     let linksarr=[];
    let years=document.querySelectorAll(selector);
    let links=document.querySelectorAll(".job-tittle a")
    for(let i=0;i<years.length;i++){
    let only0years=years[i].innerText.split(" ")[1].split("-")[0];
    let onlyFresher=years[i].innerText;
    if(only0years==3 || onlyFresher=="Fresher"){
        let lzerolink=links[i*2].href;
        linksarr.push(lzerolink);
    }

    }
    return linksarr
}

