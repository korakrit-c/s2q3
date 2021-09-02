const request = require('request');
const cheerio = require('cheerio')

const url = 'https://codequiz.azurewebsites.net';
const cookie = 'hasCookie=true';

function main(args) {
    const jar = request.jar();
    const setCookie = request.cookie(cookie);
    jar.setCookie(setCookie, url);

    request({ url: url, jar: jar}, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            let ResultObject = {};
            let $ = cheerio.load(body, null, false)
            let objRow = $('tr')

            for(let row = 0; row < objRow.length; row++){
                let objData = objRow[row];
                let fundName;
                let firstData = true;

                for(let i = 0; i < objData.children.length; i++){
                    if(objData.children[i].name === 'td'){
                        if(firstData){
                            fundName = objData.children[i].children[0].data.trim();
                            ResultObject[fundName] = [];
                        } else {
                            ResultObject[fundName].push(objData.children[i].children[0].data.trim());
                        }
                        firstData = false;
                    }
                }
            }
            // printout
            if(ResultObject[args]){
                console.log(ResultObject[args][0]);
            } else {
                console.log(`${args} not found!!`);
            }
        } else {
            console.log(err);
        }
    })
}

main(process.argv[2]);
