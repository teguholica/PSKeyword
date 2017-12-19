const packager = require('electron-packager')
const electronDMGInstaller = require('electron-installer-dmg')
const zip = require('electron-installer-zip')
const async = require('async')

const funcArr = [
    async.apply(buildPackage),
    async.apply(createZIP),
    async.apply(createDMG)
];

async.series(funcArr, function(err, results) {
    console.log('DONE')
})

function buildPackage(callback) {
    packager({
        dir: '.',
        platform: 'darwin,win32',
        arch: 'x64',
        out: 'build'
    }, () => {
        callback(null)
        console.log('Build Done')
    })
}

function createDMG(callback) {
    electronDMGInstaller({
        appPath: 'build/pskeyword-darwin-x64/pskeyword.app',
        name: 'PSKeyword-darwin-x64',
        out: 'dist'
    }, () => {
        callback(null)
        console.log('Make DMG Done')
    })
}

function createZIP(callback) {
    zip({
        dir: 'build/pskeyword-win32-x64',
        out: 'dist/PSKeyword-win32-x64'
    }, function(err, res) {
        callback(null)
        console.log('Make Windows ZIP')
    })
}