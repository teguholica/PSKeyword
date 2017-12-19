const gplay = require('google-play-scraper')
const async = require('async')

const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','10']

$('button').click(() => {
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

function getSuggests(keyword, callback) {
    gplay.suggest({term: keyword}).then(function(response) {
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