'use strict';

describe('Service: Rottentomatoes', function () {

  // load the service's module
  beforeEach(module('castThatPopcornApp'));

  // instantiate service
  var Rottentomatoes;
  beforeEach(inject(function (_Rottentomatoes_) {
    Rottentomatoes = _Rottentomatoes_;
  }));

  it('should do something', function () {
    expect(!!Rottentomatoes).toBe(true);
  });

});
