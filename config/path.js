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
            `${clientDirectory}components/**/*.scss`, 
            `${clientDirectory}layouts/**/*.scss`,
            `${clientDirectory}styles/**/*.scss`,
        ],
        templates: [
            `${clientDirectory}pages/**/*.pug`,
            `${clientDirectory}components/**/*.pug`, 
            `${clientDirectory}layouts/**/*.pug`
        ]
    },

    clear: outputDirectory
}