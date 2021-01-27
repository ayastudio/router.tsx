"use strict";

var _Page = require("./Page");

var _Route = require("./Route");

test('from location', function () {
  var list = {
    '/': new _Page.Page()
  };
  var location = '';
  expect(!!_Route.Route.fromLocation(list, location)).toBe(true);
  expect(!!_Route.Route.fromLocation(list, location, true)).toBe(true);
});
test('route clone', function () {
  var page = new _Page.Page('vew_main', 'panel_main').makeInfinity();
  var route = new _Route.Route(page, '/', {
    id: '15'
  });
  expect(JSON.stringify(route)).toEqual(JSON.stringify(route.clone()));
});