/*

*/

class LocalStorageDB {
    /**
     * Creates a new LocalStorageDB instance or loads an existing one
     * 
     * @param {string} dbName The database name
     */
    constructor(dbName){
        this.dbName = dbName;
        const existingDB = localStorage.getItem(this.dbName);

        if(!existingDB) {
            this._initDB();
        }
    }

    /**
     * Initializes a new database structure in LocalStorage
     * @private
     */
    _initDB() {
        const db = {
            name: this.dbName,
            createdAt: new Date().toISOString(),
            data: {},
        };
        localStorage.setItem(this.dbName, JSON.stringify(db));
    }

    /**
     * Retrieves the entire database object
     * @private
     * @returns The parsed database object or null if not found
     */
    _getDB(){
        const db = localStorage.getItem(this.dbName);
        if(db){ 
            return JSON.parse(db);
        }else{ // database not found!
            return null;
        }
    }

    /**
     * Saves the entire database object to LocalStorage
     * @private
     * @param {*} db - The database object to save
     */
    _saveDB(db){
        localStorage.setItem(this.dbName, JSON.stringify(db));
    }

    /**
     * Stores an object using the key and the value
     * @param {string} key the key used to store the object 
     * @param {*} value the value we want to archive
     */
    set(key, value){
        const db = this._getDB();
        db.data[key]= value;
        this._saveDB(db);
    }

    /**
     * Updates an existing object in the database
     * @param {string} key the key used to store the object 
     * @param {*} newValue the value we want to archive
     * @returns {boolean} True if the update was successful, false if the key is not already in the database 
     */
    update(key, newValue){
        const db = this._getDB();
        if(db.data[key]){ // if the key exists
            db.data[key] = newValue;
            this._saveDB(db);
            return true;
        }
        return false; // key not found
    }

    /**
     * Saves an object to the database by updating it if it already exists or creating it if it doesn't.
     * 
     * @param {string} key the key used to store the object  
     * @param {*} value the value we want to archive
     * @returns {boolean} True if the object was created (didn't exist), false it was updated
     */
    save(key,value){
        const db = this._getDB();
        const exists = key in db.data;
        db.data[key]= value;
        this._saveDB(db);
        return !exists;
    }

    /**
     * Removes an object from the database.
     * @param {string} key the key used to store the object  
     * @returns {boolean} True if the delete was successful, false if the key is not already in the database 
     */
    delete(key){
        const db = this._getDB();
        if(db.data[key]){ // if the key exists
            delete db.data[key]
            this._saveDB(db);
            return true;
        }
        return false; // key not found
    }

    /**
     * Retrieves an object from the database.
     * @param {string} key the key used to store the object 
     * @returns {*} The stored value or null if not found
     */
    get(key){
        const db = this._getDB();
        if(db.data[key]){ // if the key exists
            return db.data[key]
        }
        return null; // key not found
    }


    /**
     * Retrieves all objects in the database as a key-value object
     * @returns {object} An object containing all key-value pairs.
     */
    getAll(){
        const db = this._getDB();
        return db.data;
    }
    
    /**
     * Serializes the entire database including metadata.
     * @returns {string} A JSON string representation of the entire database
     */
    serialize(){
        return JSON.stringify(this._getDB());
    }
}