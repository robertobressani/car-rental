/**
 * Encode a Configuration object into an URI
 * @param data to be converted
 * @return {string} the parametric part of the URI
 */
export function encodeQueryData(data) {
    const ret = [];
    for (const d in data)
        if(d==="end" || d==="start")//date to deal with
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d].format("yyyy-MM-DD")));
        else
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}
