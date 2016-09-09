import "babel-polyfill";
import {EventEmitter} from "events";

import co from "co";
import sinon from "sinon";
import chai from "chai";
import mockery from "mockery";

const assert = chai.assert;

const valid = {
  connect: "couchbase://localhost",
  bucketName: "session",
  bucketPassword: "password"
};

const delay = 100;

/**
* A mock bucket class
*/
class Bucket extends EventEmitter {
  constructor( valid ) {
    super();

    setTimeout( () => {
      console.log("Abc", valid)
      if (valid) {
        this.emit( "connect", null );
      }
      else {
        this.emit( "error", "fail" );
      }
    }, delay );
  }
}

/**
* A mock cluster class
*/
class Cluster  {

  constructor( connect ) {
    this.valid = connect === valid.connect;
    this.openBucket = sinon.spy( this.openBucket );
  }

  openBucket( name, password ) {
    const bucketValid = this.valid &&
      (name===valid.bucketName) && (password===valid.bucketPassword);
    return new Bucket( bucketValid );
  }
}

/**
* Prepare for the tests
*/
function beforeTests() {

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  });

  this.couchbase = {
    Cluster: sinon.spy(Cluster)
  };

  mockery.registerMock( "couchbase", this.couchbase );

  this.CouchbaseSessionStore = require("../src/index").default;

}

/**
* Tear down after tests
*/
function afterTests() {
  mockery.disable();
}


describe('CouchbaseSessionStore constructor', function() {

  beforeEach( beforeTests );
  afterEach( afterTests );

  it('should properly initialize couchbase cluster and bucket when open=true', function( done ) {

    const store = new this.CouchbaseSessionStore({
      connect: valid.connect,
      bucketName: valid.bucketName,
      bucketPassword: valid.bucketPassword,
      open: true
    });

    store.on( "connect", () => {

      assert( this.couchbase.Cluster.called);
      assert( this.couchbase.Cluster.calledWith( options.cluster ));

      //assert(this.state.cluster.openBucket.called);
      //assert(this.state.cluster.openBucket.calledWith( options.bucket ));

      done();

    });

  });

  it('should not initialize couchbase cluster and bucket when open=false', function() {

    const store = new this.CouchbaseSessionStore({
      connect: valid.connect,
      bucketName: valid.bucketName,
      bucketPassword: valid.bucketPassword,
      open: false
    });

    assert(!this.couchbase.Cluster.called, "Cluster constructor should not be called");

  });
});
