const rp = require('request-promise')
const { skillNames } = require('./CONSTANTS.js')

const makeHiscoresRequest = async name => {
  const options = {
    uri: `http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${name}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true, // Automatically parses the JSON string in the response
  }
  try {
    return await rp(options)
  } catch (err) {
    throw err
  }
}

const parseResponse = async res => {
  let resArray = res.replace(/\n/g, ',').split(',')
  let skillsArray = resArray.slice(0, 72)

  let skillsObject = {}
  let x = 0
  for (let i = 0; i < skillNames.length; i++) {
    skillsObject[skillNames[i]] = {
      rank: skillsArray[x],
      level: skillsArray[x + 1],
      xp: skillsArray[x + 2],
    }
    x += 3
  }
  skillsObject['timestamp'] = new Date()
  return skillsObject
}

const getHiscores = async names => {
  if (!names.length || !Array.isArray(names)) {
    throw new Error('names must be in a non-empty array')
  }
  let results = names.map(async name => {
    try {
      let res = await makeHiscoresRequest(name)
      let parsedRes = await parseResponse(res)
      return parsedRes
    } catch (err) {
      throw err
    }
  })
  return Promise.all(results)
}

// with an array of parsed hiscores objects, we should then save them into the database
// now what? setup a mongo database?

// start with the database layer, design a

console.log(getHiscores(['3_iron_go']))
