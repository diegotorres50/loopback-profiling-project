// Copyright IBM Corp. 2014. All Rights Reserved.
// Node module: loopback-example-offline-sync
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
module.exports = {
  'db': {
    'name': 'db',
    'connector': 'memory'
  },
  'profiling_mongodb_ds': {
    'host': 'localhost',
    'port': 27017,
    'url': 'mongodb://localhost:27017/contentProfiling',
    'database': 'contentProfiling',
    'password': '',
    'name': 'profiling_mongodb_ds',
    'user': '',
    'connector': 'mongodb'
  },
  'emptor_rest_ds': {
    'name': 'emptor_rest_ds',
    'connector': 'rest',
    'operations': [{
      'functions': {
        'getUserData': [
          'ACCESS_TOKEN'
        ]
      },
      'template': {
        'method': 'POST',
        'url': 'https://seg.eltiempobeta.com/v2/me',
        'headers': {
          'Authorization': 'Bearer ' + '{ACCESS_TOKEN}'
        }
      }
    }]
  }
}
