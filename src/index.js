import couchbase from "couchbase";

export default class CouchbaseSessionStore {

  constructor({ cluster, bucket }) {
    this.cluster = new couchbase.Cluster( cluster );
    this.bucket = null;
  }

  *get( sid ) {
    yield null;
  }



}
