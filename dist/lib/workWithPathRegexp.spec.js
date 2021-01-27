"use strict";

var _workWithPathRegexp = require("./workWithPathRegexp");

describe('matchPath', function () {
  test('/ and /', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/', '/')).toBe(true);
  });
  test('/ and /user be false', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/', '/user')).toBe(false);
  });
  test('page with variable', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/123', '/:id([0-9]+)')).toBe(true);
  });
  test('page with variable not', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/gam', '/:id([0-9]+)')).toBe(false);
  });
  test('/main math /main', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/main', '/main')).toBe(true);
  });
  test('/clevel NOT match /main', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/clevel', '/main')).toBe(false);
  });
  test('/about/info NOT match /about', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/about/info', '/about')).toBe(false);
  });
  test('/about NOT match /about/info', function () {
    expect(!!(0, _workWithPathRegexp.matchPath)('/about', '/about/info')).toBe(false);
  });
  test('generatePath simple', function () {
    expect((0, _workWithPathRegexp.generatePath)('user', {})).toEqual('user');
  });
  test('generatePath params', function () {
    expect((0, _workWithPathRegexp.generatePath)('user/:id', {
      id: 5
    })).toEqual('user/5');
  });
  test('generatePath params and slash', function () {
    expect((0, _workWithPathRegexp.generatePath)('/user/:id', {
      id: 5
    })).toEqual('/user/5');
  });
  test('generatePath inline and additional params', function () {
    expect((0, _workWithPathRegexp.generatePath)('user/:id', {
      id: 19,
      name: 'Ivan'
    })).toEqual('user/19?name=Ivan');
  });
  test('generatePath only additional params', function () {
    expect((0, _workWithPathRegexp.generatePath)('user', {
      id: 19,
      name: 'Ivan'
    })).toEqual('user?id=19&name=Ivan');
  });
  test('generatePath edge case 1', function () {
    expect((0, _workWithPathRegexp.generatePath)('', {})).toEqual('');
  });
  test('generatePath edge case 2', function () {
    expect((0, _workWithPathRegexp.generatePath)('/', {})).toEqual('/');
  });
  test('generatePath edge case 3', function () {
    expect((0, _workWithPathRegexp.generatePath)('/:name', {
      name: 'Ivan'
    })).toEqual('/Ivan');
  });
  test('generatePath edge case 4', function () {
    expect((0, _workWithPathRegexp.generatePath)('/:name', {
      name: 'Ivan',
      id: '9'
    })).toEqual('/Ivan?id=9');
  });
  test('generatePath edge case 5', function () {
    expect((0, _workWithPathRegexp.generatePath)('/', {
      id: '9'
    })).toEqual('/?id=9');
  });
});