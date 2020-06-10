

async function checkAuthentication() {
    //TODO implement
    return new Promise(((resolve, reject) =>
                    resolve("Roberto")
                    // reject()
    ));
}

async function logout(){
    //TODO implement
}

const API={checkAuthentication, logout}
export default API;
