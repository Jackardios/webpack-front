function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updateQueryStringParams(params, queryString = window.location.search.substring(1)) {
    let queryParameters = {},
        re = /([^&=]+)=([^&]*)/g,
        m;

    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    $.each(params, (key, value) => {
        queryParameters[key] = value;
    })

    location.search = $.param(queryParameters);
}

function normalizeSerializedArray(serializedArray) {
    let normalizedData = new Object;
    $.each(serializedArray, (idx, obj) => {
        normalizedData[obj.name] = obj.value;
    });
    return normalizedData;
}

export { getParameterByName, updateQueryStringParams, normalizeSerializedArray };