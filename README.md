# uk-mps-parser [![Build Status](https://travis-ci.org/globalroo/uk-mps-parser.svg?branch=master)](https://travis-ci.org/globalroo/uk-mps-parser)[![Dependency Status](https://dependencyci.com/github/globalroo/uk-mps-parser/badge)](https://dependencyci.com/github/globalroo/uk-mps-parser)[![codecov](https://codecov.io/gh/globalroo/uk-mps-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/globalroo/uk-mps-parser)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# uk-mps-parser

## Brief description

A list of all current UK-MPs (with images) pulled from the excellent new beta parliament site https://beta.parliament.uk/.

Read the story about how the content team, got all these images. https://pds.blog.parliament.uk/2017/07/21/mp-official-portraits-open-source-images/

Motivation? I'm listening to https://www.amazon.co.uk/Quantum-Memory-Power-Improve-Champion/dp/0743528662 at the moment, and one of the first chapters is about memorising names and faces. I figured it would be good to do this with our members of parliament, then I saw the APIs and thought it would be fun to combine two activities.

In order to make a usable client, I needed a way to grab all of the MPs here:

https://api.parliament.uk/Live/fixed-query/house_current_members?house_id=1AFu55Hs&format=application%2Fjson

and their individual records here:

https://api.parliament.uk/Live/fixed-query/person_by_id?person_id=${ix}&format=application%2Fjson

into something more manageable, like this:

```json
[{
	"id": "123456",
	"honorificName": "Dr Dan Poulter MP",
	"fullName": "Dr Dan Poulter",
	"personFamilyName": "Poulter",
	"personGivenName": "Daniel",
	"personHasPersonalWebLink": "http://www.drdanielpoulter.com/",
	"personHasTwitterWebLink": "https://twitter.com/drdanpoulter",
	"personOtherNames": "Leonard James",
	"houseName": "House of Commons",
	"addressLine1": "House of Commons",
	"addressLine2": "London",
	"postCode": "SW1A 0AA",
	"partyName": "Conservative",
	"positionName": "Parliamentary Under-Secretary (Department of Health)",
	"constituencyGroupName": "Central Suffolk and North Ipswich",
	"constituencyGroupStartDate": "2010-05-06+00:00",
	"email": "daniel.poulter.mp@parliament.uk",
	"phoneNumber": "020 7219 7038",
	"localImage": "images/404.jpeg",
	"remoteImage": "https://api.parliament.uk/Live/photo/404.jpeg?crop=CU_1:1&width=186&quality=80"
}]
```
You can see the result in the data/processed.json file.

The file is now in a consumable format for the memory game. Ready to update the client side React (https://www.github/globalroo/uk-mps).

The requests to the server are deliberately staggered to prevent overloading them. You shouldn't need to regenerate the file too often anyway!

The images can be served from their remote resize-inator (remoteImage property), but it's easy enough to save the thumbnails by visiting the site and "saving" the page (https://beta.parliament.uk/houses/1AFu55Hs/members/current). The images are then stored locally to your disk at the right size and in the format `${id}.jpeg`.

For my React client, I have added them to an images directory so I don't hit their image server at all (localImage property).

```sh
	yarn
	yarn test // run tests and coverage
	yarn parse // update data/processed.json
```
