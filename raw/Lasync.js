let fs=require('fs');
console.log("Before");
async function fn(){
    console.log("4 Hello");
    let frp=fs.promises.readFile("./f1.txt");
    let data=await frp;
    console.log("7 "+data);
    return 10;
}
let fnkap=fn();
console.log(fnkap);
fnkap.then(function(data){
    console.log("13 data"+data);
})
console.log("After");

console.log("BEfore");
async function fn(){
    console.log("4 Hello");
    let frp=fs.promises.readFile("./f1.txt");
    let data=await frp;
    console.log("7 "+data);
    return 10;
}

