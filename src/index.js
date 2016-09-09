import {EventEmitter} from 'events';
import couchbase from "couchbase";

function isKeyNotFound( err ) {
  return err.code===13;
}

export default class CouchbaseSessionStore extends EventEmitter {

  /**
  * Construct a couchbase session store
  *
  * @param {string}     options.connect           The couchbase connect string
  * @param {string}     options.bucketName        The bucket for session data
  * @param {string}     options.bucketPassword    The bucket password
  */
  constructor({ connect, bucketName, bucketPassword=null }) {
    super();

    this.cluster = new couchbase.Cluster( connect );

    this.bucket = this.cluster.openBucket( bucketName, bucketPassword);
    this.bucket.on( "connect", () => {
      this.emit( "connect", this );
    });

    this.bucket.on( "error", err => {
      this.emit( "error", err );
    });

  }

  /**
  * Gets a session object by id
  *
  * @param {string}     id          The id to look up
  * @returns {Promise}              Promise resolves to the session object
  */
  get( id ) {
    return new Promise( (resolve, reject ) => {
      this.bucket.get( id, (err,doc) => {
        if (err) {
          if (isKeyNotFound(err)) {
            resolve(null)
          }
          else {
            reject(err);
          }
        }
        else {
          resolve(doc.value);
        }
      });
    });
  }

  /**
  * Sets a session object by id
  *
  * @param {string}     id          The id to look up
  * @param {object}     session     The session object
  * @param {int}        ttl         The time to live, in ms
  * @returns {Promise}              Promise resolves when done
  */
  set( id, session, ttl ) {
    return new Promise( (resolve, reject ) => {
      this.bucket.upsert( id, session, {
        expiry: ttl / 1000
      }, err => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    });
  }

  /**
  * Destroys a session object by id
  *
  * @param {string}     id          The id to look up
  * @returns {Promise}              Promise resolves when done
  */
  destroy( id ) {
    return new Promise( (resolve, reject ) => {
      this.bucket.remove( id, err => {
        if (err) {
          if (isKeyNotFound(err)) {
            resolve();
          }
          else {
            reject(err);
          }
        }
        else {
          resolve();
        }
      });
    });
  }

}
