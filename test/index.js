import "babel-polyfill";

import co from "co";
import sinon from "sinon";
import chai from "chai";
import mockery from "mockery";

const assert = chai.assert;

/**
* Prepares the state for tests
*/
function beforeTests() {

  const bucket = {

  };

  const cluster = {
    openBucket: sinon.stub().returns( bucket )
  };

  const couchbase = {
    Cluster: sinon.stub().returns( cluster )
  };

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: true,
    warnOnUnregistered: false
  });

  mockery.registerMock( "couchbase", couchbase );

  const CouchbaseSessionStore = require("../src/index").default;

  this.state = { CouchbaseSessionStore, bucket, cluster, couchbase };

}

function afterTests() {
  mockery.disable();
}

describe('CouchbaseSessionStore constructor', function() {

  before( beforeTests );
  after( afterTests );

  it('should initialize couchbase cluster and bucket', function( done ) {

    const options = {
      cluster: "couchbase://localhost",
      bucket: "session"
    };

    const store = new this.state.CouchbaseSessionStore(options);

    assert(this.state.couchbase.Cluster.called);
    assert(this.state.couchbase.Cluster.calledWith( options.cluster ));

    //assert(this.state.couchbase.Cluster.called);
    //assert(this.state.couchbase.Cluster.calledWith( options.cluster ));


    done();

  });
});
