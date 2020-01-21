let config = {
    filenames: {
        images: './lp.json',
        emotes: './lp_emotes.json',
        index: './lp_state.json'
    },
    folders: {
        images: 'images',
        imageFolder: 'Update%n'
    },
    urls: {
        images: 'https://lparchive.org/Half-Life-2/Update %n/'
    },
    emotes: {
        prefix: 'emot-',
        suffix: '.gif'
    }
}

// END OF CONFIGURATION //

config.getImageFolder = (n = 1) => config.folders.images + '/' + config.folders.imageFolder.replace('%n', n) 
config.getImagePath = (n = 1) => config.urls.images.replace('%n', n) 

module.exports = config