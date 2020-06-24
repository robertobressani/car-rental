export function getEuro(x=0){
    return x.toLocaleString('it-IT', {
        style: 'currency',
        currency: 'EUR',
    });
}
