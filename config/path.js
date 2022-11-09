const clientDirectory = './';
const outputDirectory = './pub/';

export const path = {
    source: {
        styles: `${clientDirectory}pages/**/*.scss`,
        templates: `${clientDirectory}pages/**/*.pug`
    },

    build: {
        styles: outputDirectory,
        templates: `${clientDirectory}pub/`
    },

    watch: {
        styles: [
            `${clientDirectory}pages/**/*.scss`,
            `${clientDirectory}components/**/*.scss`, 
            `${clientDirectory}layouts/**/*.scss`
        ],
        templates: [
            `${clientDirectory}pages/**/*.pug`,
            `${clientDirectory}components/**/*.pug`, 
            `${clientDirectory}layouts/**/*.pug`
        ]
    },

    clear: outputDirectory
}