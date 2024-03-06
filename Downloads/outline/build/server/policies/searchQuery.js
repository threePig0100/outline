"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, ["read", "delete"], _models.SearchQuery, (user, searchQuery) => user && user.id === (searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.userId));