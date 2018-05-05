const express = require('express'); 
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const PORT = 5000;
const Pool = pg.Pool;

app.use(express.static('server/public'));

const pool = new Pool({
database: "shoe", //name of databse
host: 'localhost', //where is it
port: 5432, //databse port, default for postgres
max: 10, //how many queries can you run at one time
idleTimeoutMillis: 30000  //30 sec to try to connect otherwise cancel query
});

pool.on('connect', () => {
    console.log('postgresql connected');
});

pool.on('error', (error) => {
    console.log('unexpected error with postgres pool', error)
});



const shoeList = [
    {name: 'nike', cost: '100'},
    {name: 'addidas', cost: '150'}
];

app.use(bodyParser.json())

app.get('/shoe', (req, res) => {
    pool.query(`SELECT * FROM "shoes"`)
    .then((results) =>{
        // console.log(results)
        res.send(results.rows)
    })
    .catch((error) => {
        res.sendStatus(500)
    })
    
});

app.post('/shoe', (req, res) => {
    const shoe = req.body;
    pool.query(`INSERT INTO "shoes" ("name", "cost")
                VALUES ($1, $2);`, [shoe.name, shoe.cost])
                .then((results) => {
                    res.sendStatus(200);
                })
                .catch((error) => {
                    console.log('error with sql insert on shoe post', error)
                    res.sendStatus(500)
                }); 
    // shoeList.push(req.body);
    // res.send(shoeList);
});

app.delete('/shoe', (req, res) => {
    const shoe = req.query;
    console.log(req.query);
    pool.query(`DELETE FROM "shoes"
                 WHERE "id" = $1`, [shoe.id])
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error from delete', error);
            res.sendStatus(500);
        });
});

app.put('/shoe', (req, res) => {
    const shoe = req.body;
    console.log(shoe);
    pool.query(`UPDATE "shoes"
            SET "name" = $1, "cost" = $2
            WHERE "id" = $3`, [shoe.name, shoe.cost, shoe.id])
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error from update', error);
            res.sendStatus(500);
        })
});

app.listen(PORT , () => {
    console.log ('running on', PORT);
})