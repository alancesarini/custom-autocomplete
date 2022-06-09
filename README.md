# About this project

This project has been created with create-react-app and its purpose is to showcase a custom autocomplete component.

# Hacks

In order to highlight the search string in the suggestions I had to use "dangerouslySetInnerHTML" which in a production environment I would not use because it can open the door to XSS attacks. Another approach would be something like this:

`<div>{getStringBefore(suggestion.name)}<em>{searchString}</em>{getStringAfter(suggestion.name)}</div>`

Also, to not make the highlighting too complex, the search is case-sensitive.

# Installing

Just run "npm install"

# Running

Run "npm start"
