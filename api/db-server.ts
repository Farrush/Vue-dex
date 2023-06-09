import type IListaPoke from '../src/interfaces/IListaPoke'
import type IPokemon from '../src/interfaces/IPokemon'
import express, { type Request, type Response } from 'express'
import sqlite3 from 'sqlite3'
import { formToJSON } from 'axios'

const app = express()
const sqlite = sqlite3.verbose()


app.use(function (req: Request, res: Response, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
 
app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Poke API</h1><a href="/nav-list">nav-list</a><br/><a href="/pokemon/0001">pokemon</a>')
})

app.get('/nav-list', (req: Request, res: Response) => {
    const db = new sqlite.Database('./db/poke.db', sqlite.OPEN_READONLY, (err: any | null) => {
        if (err) {

            console.log('Failed to connect: ' + err)
        }
    }
    )
    db.all('select codigo, nome, icon from pokemons order by codigo', [], (err: any, rows: IListaPoke[]) => {
        if (err) {
            console.log("/nav-list " + err)
        }

        res.send(rows)
    })
    db.close((err) => {
        if (err) {
            console.log('Failed to close ' + err)
            res.send(err)
      
        }
    })
})

app.post('/pokemon/add', (req: Request, res: Response) =>{
/*
    const db = new sqlite.Database('./db/poke.db', sqlite.OPEN_READWRITE, (err) => {
        if (err) {

            console.log('Failed to connect: ' + err)
        }
    })
    db.run(`insert codigo, nome, tipo, habilidade1, habilidade2, hp,
     atq, def, vel, img, icon`,[req.body._value], (err)=>console.log(err))
    db.close()
*/
console.log(req.body.code._value)
    res.send()
})

app.get('/pokemon/:slug', (req: Request, res: Response) => {
    const db = new sqlite.Database('./db/poke.db', sqlite.OPEN_READONLY, (err) => {
        if (err) {

            console.log('Failed to connect: ' + err)
        }
    }
    )
    const pesquisa = req.params.slug
    db.get(`select codigo, nome, tipo, habilidade1, habilidade2, hp,
     atq, def, vel, img from pokemons where codigo = "${pesquisa}"`, (err, row: IPokemon) => {
        if (err) {
            console.log(err)
        }
        res.send(row)
    })
    db.close()
})

app.listen(3000)