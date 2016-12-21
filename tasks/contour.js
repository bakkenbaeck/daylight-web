module.exports = {
  "templatingLanguage": "twig",
  "proxy": "localhost:4000",
  "globals": {},
  "paths": {
    "source": "./source",
    "dest": "./public",
    "templates": "./templates"
  },
  "tasks": {
    "htmlmin": {
      "options": {
        "removeComments": true,
        "collapseWhitespace": true,
        "minifyCSS": true,
        "minifyJS": true,
        "removeEmptyAttributes": false,
        "removeScriptTypeAttributes": true,
        "removeStyleLinkTypeAttributes": true
      }
    },
    "svgo": {
      "options": {}
    },
    "filerev": {
      "ignore": ["icons/*.png"]
    },
    "clean": {
      "ignore": []
    },
    "webpack": {
      "entries": [
        "app",
        "landing"
      ]
    }
  }
}