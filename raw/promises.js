// let fs=require("fs");
// console.log("Before");
// let frp=fs.promises.readFile("f1.txt");
// frp.then(function (content){
//     console.log("content -> "+ content);
// })
// frp.catch(function(err){
//     console.log(err);
// })
// function MyFilereadPromise(filepath){
//     return new Promise(cb);
//     function cb(resolve,reject){
//         console.log("Hello");
//         fs.readFile(filepath,function cb(err,data){
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(data);
//             }
//         })
//         console.log("15","Hello after");
//     }
// }
// let frp=MyFilereadPromise("f1.txt");
// console.log("20", frp);
// setTimeout(function(){
//     console.log("22",frp)
// },1000)
// //Serial Promise;
// let frp=fs.promises.readFile("./f1.txt");
// frp.then(cb1).then(cb2).then(cb3).catch(fcb);
// function cb1(content){
//     console.log("content ->" + content);
//     console.log("F2 read sent");
//     let 
// }
// let p = new Promise(function (resolve, reject) {
//     reject(new Error("some error"));
//     setTimeout(function(){
//     reject(new Error("some error"));
//     },1000)
//     reject(new Error("some error"));
//    });
//    p.then(null, function (err) {
//     console.log(1);
//     console.log(err);
//    }).catch(function (err) {
//     console.log(2);
//     console.log(err);
//    });
   
// let p = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//     reject(new Error("some value"));
//     }, 2000);
//     resolve("some error");
//     setTimeout(function () {
//     reject(new Error("some value"));
//     }, 2000);
//     resolve("some error");
//     setTimeout(function () {
//     reject(new Error("some value"));
//     }, 2000);
//    });
//    p.then(null, function (err) {
//     console.log(1);
//     console.log(err);
//    });
//    p.catch(function (err) {
//     console.log(2);
//     console.log(err);
//    });
//    p.finally(function () {
//     console.log(1);
//    })
//    p.finally(function () {
//     console.log(2);
//    }).then(function (val) {
//     console.log(val);
//    })
//    p.then(
//     function (val) {
//     console.log(val);
//     },
//     function (err) {
//     console.log(err);
//     }
//    );
   
// console.log(1);
// setTimeout(function () {
//  console.log(3);
// });
// console.log(4);
// setTimeout(function () {
//  console.log(2);
// });
// Promise.resolve().then(function () {
//  console.log(5);
// });
// console.log(6);
// function fn(a,b)
// {
//     return new Promise(function(resolve,rejects){
//         if(a%2==0 && a%b==0)
//         {
//             resolve(a/b);
//         }
//         else
//         {
//             rejects(new Error("incompatible types"));
//         }
//     })
// }

// let Prom=fn(8,3);
// Prom.then((ans)=>{
//     console.log(ans);
// })
// Prom.catch((err)=>{
//     console.log(err);
// })
// function findSun(v1,v2)
// {
//     return new Promise(function(resolve,rejects){
//         if(v1%2==0 && v1%v2==0)
//         {
//             resolve(v1/v2);
//         }
//         else
//         {
//             rejects(new Error("incompatible types"));
//         }
//     })
// }

// let p=findSun(8,3);
// p.then((val)=>{
//     console.log(val);
// })
// p.catch((err)=>{
//     console.log(err);
// })

const pptr = require('puppeteer');
const gotoUrl = 'http://www.google.com';
 
(async () => {
  const browser = await pptr.launch({
    headless: false,
    slowMo: 250,
  });
  const page = await browser.newPage();
 
  page.on('console', msg => {
    console.log(msg.text());
  });
  await page.goto(gotoUrl);
 
 
  
})();