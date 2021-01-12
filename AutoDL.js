let isBeforeExitAlreadyFired = false;

process.on('beforeExit', (code) => {
    // beforeExit を1回しか実行させないためのガード条件
    if (isBeforeExitAlreadyFired) {
        return;
    }
    isBeforeExitAlreadyFired = true;
    main()

})


async function main() {
    let https = require('https');
    var fs = require('fs');

    const URL = 'https://database.kirafan.cn/database/CharacterList.json';

    var data = [];
    let db;
    await https.get(URL, function (res) {
        res.on('data', function (chunk) {
            data.push(chunk);
        }).on('end', async function () {
            var events = Buffer.concat(data);
            db = JSON.parse(events);

            await db.forEach(async chara => {
                let id = chara["m_CharaID"]

                let path = `./mergedcharaicon/charaicon_${id}.png`
                if (fs.existsSync(path) === false) {
                    var url = `https://card-asset.kirafan.cn/mergedcharaicon/charaicon_${id}.png`;

                    var outFile = fs.createWriteStream(path);

                    var req =
                        https.get(url, function (res) {
                            res.pipe(outFile);
                            res.on('end', function () {
                                outFile.close();
                            });
                        });
                    req.on('error', function (err) {
                        console.log('Error: ', err); return;
                    });

                }

            });

        })
    });


}

process.on('exit', (code) => {
    console.log('Process exit event with code: ', code);
});

