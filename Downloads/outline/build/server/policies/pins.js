"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.Pin, (user, pin) => user.teamId === (pin === null || pin === void 0 ? void 0 : pin.teamId) && user.isAdmin);