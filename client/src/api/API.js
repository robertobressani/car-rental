

async function checkAuthentication() {
    //TODO implement
    return new Promise(((resolve, reject) =>
                    // setTimeout(()=>
                    resolve("Roberto")
                    // , 2000)
                    // reject()
    ));
}

async function logout(){
    //TODO implement
}

async function getCars(){
    //TODO implement
    return [];
}

async function getBrands(){
    //TODO implement
    return ["Alfa", "Fiat"];
}

const API={checkAuthentication, logout, getCars, getBrands}
export default API;
