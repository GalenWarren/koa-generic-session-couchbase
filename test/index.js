import "babel-polyfill";

import {Mock as couchbaseMock} from "couchbase";
import co from "co";
import sinon from "sinon";
import chai from "chai";
import mockery from "mockery";
import _ from "lodash";

const assert = chai.assert;

const options = {
  connect: "couchbase://localhost",
  bucketName: "session",
  bucketPassword: "asdlfkjasd"
};

function beforeTests() {

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  });

  this.sandbox = sinon.sandbox.create();
  this.sandbox.spy( couchbaseMock, "Cluster" );
  this.sandbox.spy( couchbaseMock.Cluster.prototype, "openBucket" )

  mockery.registerMock( "couchbase", couchbaseMock );

  this.CouchbaseSessionStore = require("../src/index").default;

}

function afterTests() {
  this.sandbox.restore();
  mockery.disable();
}

describe("CouchbaseSessionStore", function() {

  beforeEach( beforeTests );
  afterEach( afterTests );

  const id = "1";

  const id_invalid = "2";

  const session = {
    foo: "bar"
  };

  describe( "constructor", function() {

    it('should properly initialize couchbase cluster and bucket', function( done ) {

      const store = new this.CouchbaseSessionStore(options);

      store.on( "connect", () => {

        assert( couchbaseMock.Cluster.calledOnce );
        assert( couchbaseMock.Cluster.calledWith( options.connect ));
        assert( store.cluster.openBucket.calledOnce );
        assert( store.cluster.openBucket.calledWith( options.bucketName, options.bucketPassword ));

        done();

      });

    });

  });

  describe( "set/get", function() {

    it( "should set a value and read it back out", function(done) {

      const store = new this.CouchbaseSessionStore(options);
      store.on( "connect", () => {

        store.set(id,session).then( () => {

          store.get( id ).then( retrievedSession => {

            assert(_.isEqual( session, retrievedSession));
            done();

          });

        });

      });

    });

    it( "should return null for invalid key", function(done) {

      const store = new this.CouchbaseSessionStore(options);
      store.on( "connect", () => {

        store.get( id_invalid ).then( retrievedSession => {

          assert( retrievedSession === null );
          done();

        });

      });

    });

  });

  describe( "destroy", function() {

    it( "should set a value and destroy it", function(done) {

      const store = new this.CouchbaseSessionStore(options);
      store.on( "connect", () => {

        store.set(id,session).then( () => {

          store.destroy( id ).then( done );

        });

      });

    });

    it( "should not fail on an invalid key", function(done) {

      const store = new this.CouchbaseSessionStore(options);
      store.on( "connect", () => {

        store.destroy(id_invalid).then(done);

      });

    });

  });

});
