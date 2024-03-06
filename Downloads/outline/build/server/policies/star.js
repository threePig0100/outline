"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.Star, (user, star) => user.id === (star === null || star === void 0 ? void 0 : star.userId));