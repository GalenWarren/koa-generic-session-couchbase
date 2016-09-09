import couchbase from "couchbase";
import {EventEmitter} from 'events';

export default class CouchbaseSessionStore extends EventEmitter {

  constructor({ connect, bucketName, bucketPassword=null, open=true }) {
    super();

    this.connect = connect;
    this.bucketName = bucketName;
    this.bucketPassword = bucketPassword;

    if (open) {
      this.open()
    }

  }

  open() {

    return new Promise( (resolve, reject) => {

      this.cluster = new couchbase.Cluster( this.connect );
      this.bucket = this.cluster.openBucket( this.bucketName, this.password );

      this.bucket.on( "connect", () => {
        resolve();
        this.emit( "connect", null );
      });

      this.bucket.on( "error", err => {
        reject( err );
        this.emit( "error", err );
      });

    });

  }

  *get( sid ) {
    yield null;
  }



}
