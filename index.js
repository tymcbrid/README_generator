const inquirer = require('inquirer')
const fs = require('fs')
const axios = require('axios')
const util = require('util')
const dedent = require('dedent')
const writeFileAsync = util.promisify(fs.writeFile);

inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Please enter your name."
    },
    {
      type: "input",
      name: "username",
      message: "Please enter your GitHub username."
    },
    {
      type: "input",
      name: "projectname",
      message: "Please enter your project name."
    },
    {
      type: "input",
      name: "projectdescription",
      message: "Please enter your project description."
    },
    {
      type: "input",
      name: "usagetype",
      message: "Please enter how your project will be used."
    },
    {
      type: "input",
      name: "contributors",
      message: "Please enter the names of all contributors to your project."
    },
    {
      type: "list",
      name: "license",
      message: "Please enter which license your project has.",
      choices: [
        'Apache',
        'MIT',
        'ISC',
        'GNU',
        'Other',
        'None'
      ]
    },
    {
      type: "list",
      name: "languagesused",
      message: "Please enter which languages and technologies were used.",
      choices: [
        'HTML',
        'CSS',
        'JavaScript',
        'Node.js',
        'React.js',
        'MongoDB',
        'MySQL'
      ]
    }
    
  ]).then(function(data) {


    const { name, username, projectname, projectdescription, usagetype, contributers, license, languagesused } = data

    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl)
        .then((res) => {
            const imageUrl = `${res.data.avatar_url}&s=1000`
            const accountUrl = `${res.data.url}`
            const repos = `https://api.github.com/users/${username}/repos`

            axios.get(repos)
                .then((repos) => {

                    const repoNames = repos.data.map(function (repo) {
                        const returnedreponames = [repo.name, repo.html_url, repo.description, repo.language];

                        return returnedreponames
                        // return repo.name
                    })

                    const [reponame, url, desc, lang] = repoNames

                    const repoNameStr = JSON.stringify(reponame.join("\n"))
                    const repoUrlStr = JSON.stringify(url.join("\n"))
                    const repoDescriptionStr = JSON.stringify(desc.join("\n"))
                    const repoLanguageStr = JSON.stringify(lang.join("\n"))

                    // console.log(repos)

                    const mdFile = dedent(`
                    
                        [![](https://img.shields.io/apm/MIT)](https://${username}.github.io/${projectname}/.)
                        [![](https://img.shields.io/github/pipenv/locked/python-version/${username}/${projectname}?style=plastic)](https://${username}.github.io/${projectname}/.)
                        [![](https://img.shields.io/visual-studio-app-center/releases/size/${username}/${projectname}/null)](https://${username}.github.io/${projectname}/.)
                        
                        
                        # ${projectname}   
                        ### ${projectdescription}
                        
                        # Table of Contents
                        * [Primary Technology](#tecnology)
                        * [Installation](#installation)
                        * [Usage](#usage)
                        * [Contributing](#contributing)
                        * [Licensing](#licensing)
                        
                        ### [Primary Technology](#technology)
                        * ${languagesused}
                        ### [Installation](#installation)
                        * Please follow GitHub link above to clone or fork repository. To sample the complete project, please click [here](https://${username}.github.io/${projectname}/.). To browse the source code of the project, please click [here](https://github.com/${username}/${projectname})
                        ### [Usage](#usage)
                        * This application was created and designed solely for purposes of learning, applying, and deploying mock applications for educational purposes. Please do not infringe or plagerize the code provided below.
                        * ${usagetype}
                        ### [Contributers](#contributers)
                        * The following helped contribute to this project: ${contributers}
                        # Author Overview
                        ## This project was created, reviewed, and deployed by ${name} 
                        !['profile picture'](${imageUrl})
                        ### [Licensing](#licensing)
                        * ${license}
                        `);
                    return writeFileAsync('README.MD', mdFile)
                })
        })
}).catch(function (err) {
    if (err) throw err
    console.log('success!')
})

// **Github link: ${accountUrl}**
// # Past repos 
// ### ${repoNameStr}__
// ### ${repoUrlStr}__
// ### ${repoDescriptionStr}__