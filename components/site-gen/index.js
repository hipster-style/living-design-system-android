const fs = require('fs');
const path = require('path');
const createHTML = require('create-html');
const sass = require('node-sass');

var components = {}

fs.readdirSync("../screenshots").forEach(file => {
  const nameOfFile = file;
  const absolutePathToFile = path.resolve(__dirname, '../screenshots', file);
  const [componentName, state] = nameOfFile.split(".png")[0].split(":")

  if (!components.hasOwnProperty(componentName)) {
    components[componentName] = []
  }

  // Copy screenshots to screenshots folder
  fs.createReadStream(absolutePathToFile).pipe(fs.createWriteStream('site/screenshots/' + file))

  components[componentName].push({
    "image": "screenshots/" + file,
    "state": state
  });
});

var htmlBody = "";

htmlBody += '<div class="columns is-mobile">'

// Begin - Setup menu
htmlBody += '<div class="column">'

htmlBody += '<aside class="menu">'

htmlBody += `<p class="menu-label">General</p>`
htmlBody += '<ul class="menu-list">'
htmlBody += `<li><a href="../styleguide/app.html">Design Tokens</a></li>`
htmlBody += '</ul>'

htmlBody += '<p class="menu-label">Components</p>'
htmlBody += '<ul class="menu-list">'

for (var componentName in components) {
  htmlBody += `<li><a>${componentName}</a></li>`
}

htmlBody += '</ul>'
htmlBody += '</aside>'
htmlBody += '</div>'
// End - Setup menu

htmlBody += '<div class="column is-four-fifths">'

for (var componentName in components) {
  if (components.hasOwnProperty(componentName)) {
    htmlBody += `<div class="component"><h2 class="title is-3">${componentName}</h2>`

    components[componentName].forEach(componentState => {
      htmlBody += `<div class="component-state">
                  <h3 class="title is-5">${componentState['state']}</h3>
                  <img src="${componentState['image']}"/>
                  </div>`
    })
    htmlBody += "</div>"
  }
}

// End - column of components content
htmlBody += "</div>"

// End - columns section
htmlBody += "</div>"

// Add index.html to the site folder
fs.writeFileSync('site/index.html', createHTML({
  'title': "Design System",
  'body': htmlBody,
  'css': 'style.css',
  'head': '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
}));

// Generate css from scss file and add to correct place
const cssOutput = sass.renderSync({file: 'style.scss'}).css;
fs.writeFileSync('site/style.css', cssOutput);
