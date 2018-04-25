const fs = require('fs');
const path = require('path');
const createHTML = require('create-html');
const sass = require('node-sass');
const escape = require('escape-html');

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

    htmlBody += '<h3 class="title is-4">States</h3>'

    components[componentName].forEach(componentState => {
      htmlBody += `<div class="component-state">
                  <h3 class="title is-5">${componentState['state']}</h3>
                  <img src="${componentState['image']}"/>
                  </div>`
    })
    htmlBody += "</div>"

    // Get the test code out of file and then put it in a section
    var fileOutput = fs.readFileSync(
      '../src/androidTest/java/com/jolandaverhoef/designsystem/library/' + componentName + 'BehaviorTest.kt',
      'utf-8'
    )

    fileOutput = fileOutput
      .split('\n')
      .filter(line => {
        // Filter out import statement lines
        if (line.indexOf('import') > -1) {
          return false;
        }
        // Filter out line that contains package name
        if (line.indexOf('package') > -1) {
          return false;
        }
        return true;
      })
      // This makes sure to get rid of the two whitespace lines at the top of the file
      // These lines are there because of the removing of import and package statements
      .splice(2)
      .join('\n');

    htmlBody += '<h3 class="title is-4">Behavior</h3>'
    htmlBody += '<div class="component-code">'
    htmlBody += '<pre>'
    htmlBody += '<code class="language-kotlin">'
    htmlBody += escape(fileOutput)
    htmlBody += '</code>'
    htmlBody += '</pre>'
    htmlBody += '</div>'
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
  'css': ['style.css', 'prism.css'],
  'script': 'prism.js',
  'head': '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
}));


// Generate css from scss file and add to correct place
const cssOutput = sass.renderSync({file: 'style.scss'}).css;
fs.writeFileSync('site/style.css', cssOutput);

// Copy prism.js and prism.css files
fs.createReadStream('prism.css').pipe(fs.createWriteStream('site/prism.css'))
fs.createReadStream('prism.js').pipe(fs.createWriteStream('site/prism.js'))
