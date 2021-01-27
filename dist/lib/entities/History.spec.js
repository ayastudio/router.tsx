"use strict";

var _History = require("./History");

var _Route = require("./Route");

var _State = require("./State");

var _Page = require("./Page");

function getRoute() {
  return new _Route.Route(new _Page.Page('main', 'main'), '/', {});
}

function getState() {
  return (0, _State.stateFromLocation)(0);
}

describe('History', function () {
  it('check', function () {
    var h = new _History.History();
    expect(h.getCurrentIndex()).toEqual(0);
    expect(h.getLength()).toEqual(0);
    h.push(getRoute(), getState());
    expect(h.getCurrentIndex()).toEqual(0);
    expect(h.getLength()).toEqual(1);
    h.push(getRoute(), getState());
    expect(h.getCurrentIndex()).toEqual(1);
    expect(h.getLength()).toEqual(2);
    h.push(getRoute(), getState());
    expect(h.getCurrentIndex()).toEqual(2);
    expect(h.getLength()).toEqual(3);
    h.replace(getRoute(), getState());
    expect(h.getCurrentIndex()).toEqual(2);
    expect(h.getLength()).toEqual(3);
    h.push(getRoute(), getState());
    expect(h.getCurrentIndex()).toEqual(3);
    expect(h.getLength()).toEqual(4);
    h.setCurrentIndex(h.getCurrentIndex() - 2);
    expect(h.getCurrentIndex()).toEqual(1);
    expect(h.getLength()).toEqual(4);
    h.push(getRoute(), getState());
    expect(h.getCurrentIndex()).toEqual(2);
    expect(h.getLength()).toEqual(3);
  });
});