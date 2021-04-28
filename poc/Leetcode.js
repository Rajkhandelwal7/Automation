// Requiring Puppeteer,fs & Path Module From Nodejs
let fs = require("fs");
const puppeteer = require("puppeteer");
let path=require("path");
// Setting up  Important Links

let Glink = "http://www.google.com";//Google Search Link
let ylink1="https://www.youtube.com/";// You Tube Link
let ydlink2="https://yt1s.com/youtube-to-mp4";// You Tube Downloader Link
let cTab;
let browser;//Creating Browser Variable to Acess it everywhere in the Code
let input = process.argv;//Taking Input From User;
let pName = "";//Varible to Store Topic to be Searched on Leetcode ex-Queue,Satck etc;
for (let i = 2; i < input.length; i++) {
    pName = pName + input[i];
}

//Driver Function To open Browser and All work is done is getLink() function
(async function fn() {
    try {
        let browserOpenPromise = puppeteer.launch({
            headless: false,
            defaultViewport: null,

            args: ["--start-maximized",]
        });
         browser = await browserOpenPromise;
        let allTabsArr = await browser.pages();
        cTab = allTabsArr[0];//Current Tab At idx 0
        cTab.setDefaultNavigationTimeout(100000)
        await getLink(Glink);// will open google and does rest of work
    } catch (err) {
        console.log(err);
    }
})();



    let extn="crdownload";//Extension of Current Downloading File
    async function getLink(links) {
    await cTab.goto(links);//Move to Google Home Page
    await cTab.waitForSelector(".gLFyf.gsfi", { visible: true });
    let TopicLeetcode = pName + " Leetcode";
    await cTab.type(".gLFyf.gsfi", TopicLeetcode);
    await cTab.keyboard.press("Enter");

    //Will pick First Result in Google Search
    await cTab.waitForSelector(".yuRUbf a", { visible: true });
    let link1 = await cTab.evaluate(consoleFn1, ".yuRUbf a");
    await cTab.goto(link1);//will Gode to First result of Google Search

    //Wait For Selector For ALl Question Names on Leetcode
    await cTab.waitForSelector(".title-cell__ZGos a");
    let arr = await cTab.evaluate(consoleFn, ".title-cell__ZGos", ".title-cell__ZGos span[data-toggle='tooltip']", ".title-cell__ZGos a");
    console.table(arr);

    //Now After Getting All Question link And Name in variable arr we will to Each Question Page
    for (let i = 0; i < arr.length; i++) {
        //Working on All the Question of a Particular Topic Serially
        //Getting Name of Question And Link of Solution Video 
        let name=arr[i].qname;
        let vdoUrl= await getUrl(name);//Will Return Top Most You Tube Video Explaining Solution
        console.log(vdoUrl);

        await downloadVids(vdoUrl);//Dowanload video From y1ts.com 

        //Will Goto Specific Question Page -> Discussion Tab -> Applying Tag For java Code -> copy code in Clipboard -> Downloading code form 
                                                                                                                        // online Text Editor
        await cTab.goto(arr[i].qlink);//Move To Question Page

        await cTab.waitForSelector(".css-1lelwtv-TabHeader.e5i1odf4 a");
        let dislink = await cTab.evaluate(conssoleFn2, ".css-1lelwtv-TabHeader.e5i1odf4 a");

        await cTab.goto(dislink);// Will Go to Discussion Page 
        await cTab.waitForSelector(".wrapper__3yGD.sm__YB7w.searchinput__3xUp");
        //Applying  Java Tag

        await cTab.click(".wrapper__3yGD.sm__YB7w.searchinput__3xUp")
        await cTab.type(".wrapper__3yGD.sm__YB7w.searchinput__3xUp", "Java");
        await cTab.waitForSelector("button[title='java']");
        await cTab.click("button[title='java']");
        await cTab.waitForSelector(".item-header__2w29 a");
        await cTab.waitForTimeout(2000);

        // Code From Discussion link 
        let javasollink = await cTab.evaluate(consoleFn3, ".item-header__2w29 a");
        //Will Copy Code into ClipBoard
        await CopyCodeFromDiscussionTab(javasollink);

        //Download Text File From RapidTables.com(Online Notepad) 
        await DownloadCodefile("https://www.rapidtables.com/tools/notepad.html", name);

        // Now will check if there is UnDownloaded or Currently Downloading File 
        //Untill then We Continue Our loop
        while(true)
        {
            let allFiles=fs.readdirSync("C:\\Users\\HP\\Downloads");
            let flag=0;
            for(let i=0;i<allFiles.length;i++)
            {
                
                let temp=allFiles[i].split(".").pop();
                if(temp==extn ||  temp=="tmp")
                {
                    flag=1;
                    break;
                }   
            }
            if(flag==0)
                break;
        }

        // After Downloading Every File we are Having Two Files 
        //.One is Of video Solution
        //.Code text file
        await arrangeinFolders(name);
    
      
        //Above Process will continue For All Question Of Specific Topic 
    }
    // Now last Task is To Move Every Folder into Topic Folder 
    //ex-All Question of Queue will be in a Folder named as Queue
    await MakeOneFolder(pName);
    

    
}

//Function To Select And Copy code into ClipBoard
async function CopyCodeFromDiscussionTab(link) {
    await cTab.goto(link);
    await cTab.waitForSelector('code');
    const fromJSHandle = await cTab.evaluateHandle(() => Array.from(document.querySelectorAll('.discuss-markdown-container pre code'))[0])
    const toJSHandle = await cTab.evaluateHandle(() => Array.from(document.querySelectorAll('.discuss-markdown-container pre code'))[0])

    await cTab.evaluate((from, to) => {
        const selection = from.getRootNode().getSelection();
        const range = document.createRange();
        range.setStartBefore(from);
        range.setEndAfter(to);
        selection.removeAllRanges();
        selection.addRange(range);
    }, fromJSHandle, toJSHandle);


    await cTab.bringToFront();
    await cTab.evaluate(() => {
        document.execCommand('copy')

    })
}

// Excluding Locked Question We are Having link of Every Question 
function consoleFn(selector, blockerselector, hreflink) {
    let linkArr = [];
    let queslinkhref = document.querySelectorAll(hreflink);
    let queslinks = document.querySelectorAll(selector);
    let blockerlink = document.querySelectorAll(blockerselector);
    let idx = 0;
    console.log(queslinks.length);
    for (let i = 0; i < queslinks.length; i++) {

        if (!queslinks[i].contains(blockerlink[idx])) {
            let qlink = queslinkhref[i].href
            let qname = queslinks[i].innerText;
            linkArr.push({
                qlink, qname
            })
        } else if (idx >= blockerlink.length) {
            let qlink = queslinkhref[i].href
            let qname = queslinks[i].innerText;
            linkArr.push({
                qlink, qname
            })
        } else {
            idx++;
        }
        
    }
    return linkArr;
}

// Function to Select First Link From Google Search
function consoleFn1(linkselector) {
    let NameElems = document.querySelectorAll(linkselector)[0].href;
    return NameElems;

}

// Tapping on  Discussion Tab
function conssoleFn2(selector) {
    let dlink = "";
    let alldiscuss = document.querySelectorAll(selector);
    if (alldiscuss.length == 2) {
        dlink = alldiscuss[0].href;
    } else {
        dlink = alldiscuss[1].href;
    }
    return dlink;
}

// returning Solution from Discussion tab
function consoleFn3(selector) {
    let sollink = document.querySelectorAll(selector)[0].href;
    return sollink;
    
}
// Download Code File From Online Notepad
async function DownloadCodefile(link, Qname) {
    
    await cTab.goto(link);
    await cTab.waitForSelector("#area")
    await cTab.click("#area");
    await cTab.keyboard.down("Control");
    await cTab.keyboard.press("a");
    await cTab.keyboard.press("Backspace");
    await cTab.keyboard.press("v");
    await cTab.keyboard.up("Control");
    await cTab.waitForTimeout(2000);
    await cTab.click("button[id='fileMenu']");
    await cTab.click("button[onClick='Save_As()']");
    await cTab.waitForSelector("#filename");
    await cTab.click("#filename");
    await cTab.keyboard.down("Control");
    await cTab.keyboard.press("a");
    await cTab.keyboard.press("Backspace");
    await cTab.keyboard.up("Control");
    await cTab.type("#filename", Qname + " Java Solution");
    await cTab.waitForSelector("#save");
    await cTab.click("#save");
    
}

//Solution Video From Youtube
async function getUrl(name)
{
    
    await cTab.goto(ylink1);
    await cTab.waitForSelector("input[id='search']");
    await cTab.waitForTimeout(2000);
    await cTab.click("input[id='search']");
   
    await cTab.type("input[id='search']",name+" Leetcode");
    await cTab.keyboard.press("Enter");
    await cTab.waitForSelector("a#video-title");
    let got=await cTab.evaluate(()=>{
        let twoVids=[];
        
        let allLinks=document.querySelectorAll("a#video-title");
        console.log(allLinks);
        twoVids.push({link:"https://www.youtube.com"+allLinks[0].getAttribute("href"),
        title:allLinks[0].getAttribute("title")});
        return twoVids;
        
    });
    await cTab.waitForTimeout(2000);
    return got;
}

// Downlaoding  Solution Video From yt1s.com 
async function downloadVids(list)
{
    await cTab.goto(ydlink2);
    await cTab.waitForSelector("input[id='s_input']");
    await cTab.type("input[id='s_input']",list[0].link);
    await cTab.keyboard.press("Enter");
    await cTab.waitForSelector("a[id='asuccess']");
    await cTab.waitForTimeout(5000);
    await cTab.click("a[id='asuccess']");
    await cTab.waitForTimeout(2000);
    allTabsArr = await browser.pages();
    if(allTabsArr.length>1){
    let nTab = allTabsArr[1];
    await nTab.close();
    }
}

// Arrange Video and Code Solution in Specific Question Name Folder
//Thsese Both Function Are done using FS Module
async function arrangeinFolders(name){
    if(!fs.existsSync("C:\\Users\\HP\\Downloads\\"+name)){
        fs.mkdirSync("C:\\Users\\HP\\Downloads\\"+name,0744)
    }

    let allFiles=fs.readdirSync("C:\\Users\\HP\\Downloads");
            
            let flag=0;
            for(let i=0;i<allFiles.length;i++)
            {
                
                if(fs.lstatSync("C:\\Users\\HP\\Downloads\\"+allFiles[i]).isFile()){
                    console.log(allFiles[i]+"isFile");
                    
                    var oldPath = "C:\\Users\\HP\\Downloads\\"+allFiles[i];
                    var newPath = "C:\\Users\\HP\\Downloads\\"+name+"\\"+allFiles[i];

                    fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                    })
                    
                }
            }
}

// Moving All Question Folder into Topic Folder
async function MakeOneFolder(pName){
    if(!fs.existsSync("C:\\Users\\HP\\Downloads\\"+pName)){
        fs.mkdirSync("C:\\Users\\HP\\Downloads\\"+pName,0744)
    }
    let allFolders=fs.readdirSync("C:\\Users\\HP\\Downloads");
    for(let i=0;i<allFolders.length;i++)
            {
               
                if(!fs.lstatSync("C:\\Users\\HP\\Downloads\\"+allFolders[i]).isFile() && allFolders[i]!="All" && allFolders[i]!=pName){
                   
                    
                    var oldPath = "C:\\Users\\HP\\Downloads\\"+allFolders[i];
                    var newPath = "C:\\Users\\HP\\Downloads\\"+pName+"\\"+allFolders[i];

                    fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                    console.log('Successfully moved!')
                    
                    })
                    
                }
            }

}
// Now in Last all the Folder will move to one Folder like all the questions Folder will go to in Queue Folder