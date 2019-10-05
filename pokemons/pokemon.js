const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const DB_URL = 'mongodb+srv://superadmin:pwdsecure@pokemon-cluster-zp5v5.gcp.mongodb.net/admin?retryWrites=true&w=majority'
const DB_NAME = 'example'
const options = { useNewUrlParser: true, useUnifiedTopology: true }
let client

let pokemons = []
mockPokemon()

function Pokemon(name, type) {
    this.name = name
    this.type = type
    this.id = null
    this.type2 = null
}

async function connectDatabase() {
    if (client !== undefined && client !== null && client.isConnected) {
        return client
    }

    client = await mongoClient.connect(DB_URL, options)
        .catch(err => console.error(err))
        
    return client
}

async function getCollection(name) {
    client = await connectDatabase().catch(err => console.error(err))
    database = client.db(DB_NAME)
    collection = database.collection(name)
    return collection
}

async function getPokemons() {
    var collection = await getCollection('pokemons')

    try {
        var result = await collection.find({}).toArray()
        return result
    } catch (err) {
        console.error(err)
        return null
    } finally {
        client.close()
    }
}

async function savePokemon(name, type) {
    let p = createPokemon(name, type)
    var collection = await getCollection('pokemons')
    try {
        var result = await collection.insert(p)
        return true
    } catch (err) {
        console.error(err)
        return false
    } finally {
        client.close()
    }
}

function createPokemon(name, type) {
    let p = new Pokemon(name, type)
    p.id = generateNewId(pokemons.length)
    return p
}

function mockPokemon() {
    pokemons.push(createPokemon('Pikachu', 'Electric'))
    pokemons.push(createPokemon('Paras', 'Bug'))
}

function generateNewId(num) {
    return num + 1
}

function isPokemonExisted(id) {
    return pokemons[id - 1] !== undefined && pokemons[id - 1] !== null
}

async function getPokemon(id) {
    var collection = await getCollection('pokemons')

    try {
        var result = collection.findOne({ _id: ObjectID(id)})
        return result
    } catch(err) {
        console.error(err)
        return err
    } finally {
        // client.close()
    }
}

async function update(pokemon) {
    let collection = await getCollection('pokemons')
    
    try {
        var result = await collection.updateOne({ _id: ObjectID(pokemon._id)}, { $set: { type2: pokemon.type2 } })
        return true
    } catch(err) {
        console.log(err)
        return false
    } finally {
        // client.close()
    }
    // pokemons[pokemon.id - 1] = pokemon
    // return true
}

module.exports.isPokemonExisted = isPokemonExisted
module.exports.savePokemon = savePokemon
module.exports.getPokemon = getPokemon
module.exports.getPokemons = getPokemons
module.exports.update = update