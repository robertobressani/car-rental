export function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        if(d==="end" || d==="start")//date to deal with
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d].format("yyyy-MM-DD")));
        else
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}
