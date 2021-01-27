"use strict";

var _Page = require("./Page");

test('page clone', function () {
  var page = new _Page.Page('vew_main', 'panel_main');
  expect(JSON.stringify(page)).toEqual(JSON.stringify(page.clone()));
  var page2 = new _Page.Page('vew_main', 'panel_main').makeInfinity();
  expect(JSON.stringify(page2)).toEqual(JSON.stringify(page2.clone()));
});