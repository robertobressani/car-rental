import Car from "../entity/Car";

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
    return [new Car(1,"Alfa", "A","Romeo", 100 ), new Car(2, "Fiat", "E", "500",500)];
}

async function getBrands(){
    //TODO implement
    return ["Alfa", "Fiat"];
}



const API={checkAuthentication, logout, login, getCars, getBrands}
export default API;
