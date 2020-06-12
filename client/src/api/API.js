

async function checkAuthentication() {
    //TODO implement
    return new Promise(((resolve, reject) =>
                     setTimeout(()=>
                    // resolve("Roberto")

                    reject()
                         , 1000)
    ));
}
async function login(email, password){
    //TODO implement
    return password==="test" ? "pippo" : false;
    //return true;
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



const API={checkAuthentication, logout, login, getCars, getBrands}
export default API;
