const clientDirectory = './';
const outputDirectory = './pub/';

export const path = {
    source: {
        styles: `${clientDirectory}pages/*/*.scss`,
        templates: `${clientDirectory}pages/*/*.pug`
    },

    build: {
        styles: `${outputDirectory}pages`,
        templates: `${outputDirectory}pages`
    },

    watch: {
        styles: [
            `${clientDirectory}pages/**/*.scss`,
            `${clientDirectory}code/**/*.scss`, 
            `${clientDirectory}layouts/**/*.scss`,
            `${clientDirectory}styles/**/*.scss`,
        ],
        templates: [
            `${clientDirectory}pages/**/*.pug`,
            `${clientDirectory}code/**/*.pug`, 
            `${clientDirectory}layouts/**/*.pug`
        ]
    },

    clear: outputDirectory
}