const gplay = require('google-play-scraper')
const async = require('async')
const fs = require('fs')

const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','10']

onLoad();

$('button').click(() => {
    console.log($('#countryView').val());
    console.log($('#langView').val());

    const keyword = $('input').val()

    clearTable()
    showLoading()

    const suggestFuncList = []
    suggestFuncList.push(async.apply(getSuggests, keyword))
    for(char of chars){
        var appendKeyword = keyword + ' ' + char
        suggestFuncList.push(async.apply(getSuggests, appendKeyword))
    }

    async.series(suggestFuncList, function(err, results) {
        hideLoading()

        var result = []
        for(item of results){
            result = result.concat(item)
        }
        result = result.filter(function(elem, index, self) {
            return index == self.indexOf(elem)
        })
        for(item of result) {
            addToTable(item)
        }
    })
})

function onLoad() {
    let rawdata = fs.readFileSync(__dirname + '/config.json')
    let config = JSON.parse(rawdata)

    config.country.forEach(country => {
        let selected = '';
        if (country.code === 'us') {
            selected = 'selected';
        }
        $('#countryView').append(`
            <option value='${country.code}' ${selected}>
                <td>${country.name}</td>
            </tr>
        `)
    })

    config.lang.forEach(lang => {
        let selected = '';
        if (lang.code === 'en') {
            selected = 'selected';
        }
        $('#langView').append(`
            <option value='${lang.code}' ${selected}>
                <td>${lang.name}</td>
            </tr>
        `)
    })
}

function getSuggests(keyword, callback) {
    gplay.suggest({
        term: keyword,
        country: $('#countryView').val(),
        lang: $('#langView').val()
    }).then(function(response) {
        callback(null, response)
    })
}

function addToTable(keyword) {
    $('table').append(`
        <tr class='item'>
            <td>${keyword}</td>
        </tr>
    `)
}

function showLoading() {
    $('table').append(`
        <tr class='loading'>
            <td>Please wait...</td>
        </tr>
    `)
}

function hideLoading() {
    $('table .loading').remove()
}

function clearTable() {
    $('table .item').remove()
}