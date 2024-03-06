"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.UserMembership, (user, membership) => user.id === (membership === null || membership === void 0 ? void 0 : membership.userId) || user.isAdmin);