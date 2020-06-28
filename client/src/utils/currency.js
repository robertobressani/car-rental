/**
 * Converts a value to a string with €
 * @param value to be converted
 * @return {string}
 */
export function getEuro(value=0){
    return value.toLocaleString('it-IT', {
        style: 'currency',
        currency: 'EUR',
    });
}
