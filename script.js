const { exec } = require('child_process');

exec('git log', (err, stdout, stderr) => {
    if (err) {
      console.log('Error executing the command')
      return;
    }

    const logArray = stdout.split("commit ")

    const authorMessageArray = logArray.map( logEntry => {
      let author = ''
      let message = ''
      let email = ''
      const logEntryArray = logEntry.split("\n")
      if(logEntryArray[1]){
        if(logEntryArray[1].startsWith("Author: ")){
          author = logEntryArray[1].substr(8).split(" <")[0]
          email = logEntryArray[1].split(" <")[1].split(">")[0]
          message = logEntryArray[4]
        } else if (logEntryArray[2].startsWith("Author: ")){
          author = logEntryArray[2].substr(8).split(" <")[0]
          email = logEntryArray[1].split(" <")[1] ? logEntryArray[1].split(" <")[1].split(">")[0] : "";
          message = logEntryArray[5]
        }
      }
      return [author, message, email]
    })

    const shortLogObject = {}

    for(i = 0; i < authorMessageArray.length; i++){
      if(!shortLogObject[authorMessageArray[i][0]]){
        shortLogObject[authorMessageArray[i][0]] = {
          name:  authorMessageArray[i][0],
          count: 1,
          email: authorMessageArray[i][2]
        }
      } else if(shortLogObject[authorMessageArray[i][0]]){
        shortLogObject[authorMessageArray[i][0]].email ? null : shortLogObject[authorMessageArray[i][0]].email = authorMessageArray[i][2]
        shortLogObject[authorMessageArray[i][0]].message ? null : shortLogObject[authorMessageArray[i][0]].message = authorMessageArray[i][0]
        shortLogObject[authorMessageArray[i][0]].count ++
      }
    }
   
    let shortLogArray = []

    for (const entry in shortLogObject) {
      if (shortLogObject.hasOwnProperty(entry)) {
        shortLogArray.push([shortLogObject[entry].count, shortLogObject[entry]])
      }
    }

    shortLogArray.sort((a, b) => b[0] - a[0])
  
    shortLogArray.forEach((entry) => {
      if(entry[1].count > 99){
        entry[1].count = `   ${entry[1].count}`
      } else if (entry[1].count > 9) {
        entry[1].count = `    ${entry[1].count}`
      } else {
        entry[1].count = `     ${entry[1].count}`
      }

      if(entry[1].name){console.log(`${entry[1].count}  ${entry[1].name} <${entry[1].email}>`)}
    })

  });