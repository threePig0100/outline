"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fractionalIndex = _interopRequireDefault(require("fractional-index"));
var _invariant = _interopRequireDefault(require("invariant"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _sequelize = require("sequelize");
var _types = require("./../../../../shared/types");
var _collectionDestroyer = _interopRequireDefault(require("./../../../commands/collectionDestroyer"));
var _collectionExporter = _interopRequireDefault(require("./../../../commands/collectionExporter"));
var _teamUpdater = _interopRequireDefault(require("./../../../commands/teamUpdater"));
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _rateLimiter = require("./../../../middlewares/rateLimiter");
var _transaction = require("./../../../middlewares/transaction");
var _validate = _interopRequireDefault(require("./../../../middlewares/validate"));
var _models = require("./../../../models");
var _policies = require("./../../../policies");
var _presenters = require("./../../../presenters");
var _RateLimiter = require("./../../../utils/RateLimiter");
var _indexing = require("./../../../utils/indexing");
var _removeIndexCollision = _interopRequireDefault(require("./../../../utils/removeIndexCollision"));
var _pagination = _interopRequireDefault(require("../middlewares/pagination"));
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
router.post("collections.create", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsCreateSchema), async ctx => {
  const {
    name,
    color,
    description,
    permission,
    sharing,
    icon,
    sort
  } = ctx.input.body;
  let {
    index
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "createCollection", user.team);
  if (!index) {
    const collections = await _models.Collection.findAll({
      where: {
        teamId: user.teamId,
        deletedAt: null
      },
      attributes: ["id", "index", "updatedAt"],
      limit: 1,
      order: [
      // using LC_COLLATE:"C" because we need byte order to drive the sorting
      _sequelize.Sequelize.literal('"collection"."index" collate "C"'), ["updatedAt", "DESC"]]
    });
    index = (0, _fractionalIndex.default)(null, collections.length ? collections[0].index : null);
  }
  index = await (0, _removeIndexCollision.default)(user.teamId, index);
  const collection = await _models.Collection.create({
    name,
    description,
    icon,
    color,
    teamId: user.teamId,
    createdById: user.id,
    permission,
    sharing,
    sort,
    index
  });
  await _models.Event.create({
    name: "collections.create",
    collectionId: collection.id,
    teamId: collection.teamId,
    actorId: user.id,
    data: {
      name
    },
    ip: ctx.request.ip
  });
  // we must reload the collection to get memberships for policy presenter
  const reloaded = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(collection.id);
  (0, _invariant.default)(reloaded, "collection not found");
  ctx.body = {
    data: (0, _presenters.presentCollection)(reloaded),
    policies: (0, _presenters.presentPolicies)(user, [reloaded])
  };
});
router.post("collections.info", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsInfoSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id);
  (0, _policies.authorize)(user, "read", collection);
  ctx.body = {
    data: (0, _presenters.presentCollection)(collection),
    policies: (0, _presenters.presentPolicies)(user, [collection])
  };
});
router.post("collections.documents", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsDocumentsSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id);
  (0, _policies.authorize)(user, "readDocument", collection);
  ctx.body = {
    data: collection.documentStructure || []
  };
});
router.post("collections.import", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerHour), (0, _authentication.default)(), (0, _validate.default)(T.CollectionsImportSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    attachmentId,
    format
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "importCollection", user.team);
  const attachment = await _models.Attachment.findByPk(attachmentId, {
    transaction
  });
  (0, _policies.authorize)(user, "read", attachment);
  const fileOperation = await _models.FileOperation.create({
    type: _types.FileOperationType.Import,
    state: _types.FileOperationState.Creating,
    format,
    size: attachment.size,
    key: attachment.key,
    userId: user.id,
    teamId: user.teamId
  }, {
    transaction
  });
  await _models.Event.create({
    name: "fileOperations.create",
    teamId: user.teamId,
    actorId: user.id,
    modelId: fileOperation.id,
    data: {
      type: _types.FileOperationType.Import
    }
  }, {
    transaction
  });
  ctx.body = {
    success: true
  };
});
router.post("collections.add_group", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsAddGroupSchema), async ctx => {
  const {
    id,
    groupId,
    permission
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id);
  (0, _policies.authorize)(user, "update", collection);
  const group = await _models.Group.findByPk(groupId);
  (0, _policies.authorize)(user, "read", group);
  let membership = await _models.GroupPermission.findOne({
    where: {
      collectionId: id,
      groupId
    }
  });
  if (!membership) {
    membership = await _models.GroupPermission.create({
      collectionId: id,
      groupId,
      permission,
      createdById: user.id
    });
  } else {
    membership.permission = permission;
    await membership.save();
  }
  await _models.Event.create({
    name: "collections.add_group",
    collectionId: collection.id,
    teamId: collection.teamId,
    actorId: user.id,
    modelId: groupId,
    data: {
      name: group.name,
      membershipId: membership.id
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    data: {
      collectionGroupMemberships: [(0, _presenters.presentCollectionGroupMembership)(membership)]
    }
  };
});
router.post("collections.remove_group", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsRemoveGroupSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    id,
    groupId
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const {
    transaction
  } = ctx.state;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id, {
    transaction
  });
  (0, _policies.authorize)(user, "update", collection);
  const group = await _models.Group.findByPk(groupId, {
    transaction
  });
  (0, _policies.authorize)(user, "read", group);
  const [membership] = await collection.$get("collectionGroupMemberships", {
    where: {
      groupId
    },
    transaction
  });
  if (!membership) {
    ctx.throw(400, "This Group is not a part of the collection");
  }
  await collection.$remove("group", group);
  await _models.Event.create({
    name: "collections.remove_group",
    collectionId: collection.id,
    teamId: collection.teamId,
    actorId: user.id,
    modelId: groupId,
    data: {
      name: group.name,
      membershipId: membership.id
    },
    ip: ctx.request.ip
  }, {
    transaction
  });
  ctx.body = {
    success: true
  };
});
router.post("collections.group_memberships", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.CollectionsGroupMembershipsSchema), async ctx => {
  const {
    id,
    query,
    permission
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id);
  (0, _policies.authorize)(user, "read", collection);
  let where = {
    collectionId: id
  };
  let groupWhere;
  if (query) {
    groupWhere = {
      name: {
        [_sequelize.Op.iLike]: "%".concat(query, "%")
      }
    };
  }
  if (permission) {
    where = {
      ...where,
      permission
    };
  }
  const options = {
    where,
    include: [{
      model: _models.Group,
      as: "group",
      where: groupWhere,
      required: true
    }]
  };
  const [total, memberships] = await Promise.all([_models.GroupPermission.count(options), _models.GroupPermission.findAll({
    ...options,
    order: [["createdAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  })]);
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data: {
      collectionGroupMemberships: memberships.map(_presenters.presentCollectionGroupMembership),
      groups: memberships.map(membership => (0, _presenters.presentGroup)(membership.group))
    }
  };
});
router.post("collections.add_user", (0, _authentication.default)(), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.OneHundredPerHour), (0, _transaction.transaction)(), (0, _validate.default)(T.CollectionsAddUserSchema), async ctx => {
  const {
    auth,
    transaction
  } = ctx.state;
  const actor = auth.user;
  const {
    id,
    userId,
    permission
  } = ctx.input.body;
  const collection = await _models.Collection.scope({
    method: ["withMembership", actor.id]
  }).findByPk(id, {
    transaction
  });
  (0, _policies.authorize)(actor, "update", collection);
  const user = await _models.User.findByPk(userId);
  (0, _policies.authorize)(actor, "read", user);
  const [membership, isNew] = await _models.UserMembership.findOrCreate({
    where: {
      collectionId: id,
      userId
    },
    defaults: {
      permission: permission || user.defaultCollectionPermission,
      createdById: actor.id
    },
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  if (permission) {
    membership.permission = permission;
    await membership.save({
      transaction
    });
  }
  await _models.Event.create({
    name: "collections.add_user",
    userId,
    modelId: membership.id,
    collectionId: collection.id,
    teamId: collection.teamId,
    actorId: actor.id,
    data: {
      isNew,
      permission: membership.permission
    },
    ip: ctx.request.ip
  }, {
    transaction
  });
  ctx.body = {
    data: {
      users: [(0, _presenters.presentUser)(user)],
      memberships: [(0, _presenters.presentMembership)(membership)]
    }
  };
});
router.post("collections.remove_user", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsRemoveUserSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    auth,
    transaction
  } = ctx.state;
  const actor = auth.user;
  const {
    id,
    userId
  } = ctx.input.body;
  const collection = await _models.Collection.scope({
    method: ["withMembership", actor.id]
  }).findByPk(id, {
    transaction
  });
  (0, _policies.authorize)(actor, "update", collection);
  const user = await _models.User.findByPk(userId, {
    transaction
  });
  (0, _policies.authorize)(actor, "read", user);
  const [membership] = await collection.$get("memberships", {
    where: {
      userId
    },
    transaction
  });
  if (!membership) {
    ctx.throw(400, "User is not a collection member");
  }
  await collection.$remove("user", user, {
    transaction
  });
  await _models.Event.create({
    name: "collections.remove_user",
    userId,
    modelId: membership.id,
    collectionId: collection.id,
    teamId: collection.teamId,
    actorId: actor.id,
    data: {
      name: user.name
    },
    ip: ctx.request.ip
  }, {
    transaction
  });
  ctx.body = {
    success: true
  };
});
router.post("collections.memberships", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.CollectionsMembershipsSchema), async ctx => {
  const {
    id,
    query,
    permission
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id);
  (0, _policies.authorize)(user, "read", collection);
  let where = {
    collectionId: id
  };
  let userWhere;
  if (query) {
    userWhere = {
      name: {
        [_sequelize.Op.iLike]: "%".concat(query, "%")
      }
    };
  }
  if (permission) {
    where = {
      ...where,
      permission
    };
  }
  const options = {
    where,
    include: [{
      model: _models.User,
      as: "user",
      where: userWhere,
      required: true
    }]
  };
  const [total, memberships] = await Promise.all([_models.UserMembership.count(options), _models.UserMembership.findAll({
    ...options,
    order: [["createdAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  })]);
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data: {
      memberships: memberships.map(_presenters.presentMembership),
      users: memberships.map(membership => (0, _presenters.presentUser)(membership.user))
    }
  };
});
router.post("collections.export", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerHour), (0, _authentication.default)(), (0, _validate.default)(T.CollectionsExportSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id,
    format,
    includeAttachments
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const team = await _models.Team.findByPk(user.teamId, {
    transaction
  });
  (0, _policies.authorize)(user, "createExport", team);
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id, {
    transaction
  });
  (0, _policies.authorize)(user, "export", collection);
  const fileOperation = await (0, _collectionExporter.default)({
    collection,
    user,
    team,
    format,
    includeAttachments,
    ip: ctx.request.ip,
    transaction
  });
  ctx.body = {
    success: true,
    data: {
      fileOperation: (0, _presenters.presentFileOperation)(fileOperation)
    }
  };
});
router.post("collections.export_all", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.FivePerHour), (0, _authentication.default)(), (0, _validate.default)(T.CollectionsExportAllSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    format,
    includeAttachments
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const team = await _models.Team.findByPk(user.teamId, {
    transaction
  });
  (0, _policies.authorize)(user, "createExport", team);
  const fileOperation = await (0, _collectionExporter.default)({
    user,
    team,
    format,
    includeAttachments,
    ip: ctx.request.ip,
    transaction
  });
  ctx.body = {
    success: true,
    data: {
      fileOperation: (0, _presenters.presentFileOperation)(fileOperation)
    }
  };
});
router.post("collections.update", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsUpdateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id,
    name,
    description,
    icon,
    permission,
    color,
    sort,
    sharing
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id, {
    transaction
  });
  (0, _policies.authorize)(user, "update", collection);

  // we're making this collection have no default access, ensure that the
  // current user has an admin membership so that at least they can manage it.
  if (permission !== _types.CollectionPermission.ReadWrite && collection.permission === _types.CollectionPermission.ReadWrite) {
    await _models.UserMembership.findOrCreate({
      where: {
        collectionId: collection.id,
        userId: user.id
      },
      defaults: {
        permission: _types.CollectionPermission.Admin,
        createdById: user.id
      },
      transaction
    });
  }
  let privacyChanged = false;
  let sharingChanged = false;
  if (name !== undefined) {
    collection.name = name.trim();
  }
  if (description !== undefined) {
    collection.description = description;
  }
  if (icon !== undefined) {
    collection.icon = icon;
  }
  if (color !== undefined) {
    collection.color = color;
  }
  if (permission !== undefined) {
    privacyChanged = permission !== collection.permission;
    collection.permission = permission ? permission : null;
  }
  if (sharing !== undefined) {
    sharingChanged = sharing !== collection.sharing;
    collection.sharing = sharing;
  }
  if (sort !== undefined) {
    collection.sort = sort;
  }
  await collection.save({
    transaction
  });
  await _models.Event.create({
    name: "collections.update",
    collectionId: collection.id,
    teamId: collection.teamId,
    actorId: user.id,
    data: {
      name
    },
    ip: ctx.request.ip
  }, {
    transaction
  });
  if (privacyChanged || sharingChanged) {
    await _models.Event.create({
      name: "collections.permission_changed",
      collectionId: collection.id,
      teamId: collection.teamId,
      actorId: user.id,
      data: {
        privacyChanged,
        sharingChanged
      },
      ip: ctx.request.ip
    }, {
      transaction
    });
  }

  // must reload to update collection membership for correct policy calculation
  // if the privacy level has changed. Otherwise skip this query for speed.
  if (privacyChanged || sharingChanged) {
    await collection.reload({
      transaction
    });
    const team = await _models.Team.findByPk(user.teamId, {
      transaction,
      rejectOnEmpty: true
    });
    if (collection.permission === null && (team === null || team === void 0 ? void 0 : team.defaultCollectionId) === collection.id) {
      await (0, _teamUpdater.default)({
        params: {
          defaultCollectionId: null
        },
        ip: ctx.request.ip,
        user,
        team,
        transaction
      });
    }
  }
  ctx.body = {
    data: (0, _presenters.presentCollection)(collection),
    policies: (0, _presenters.presentPolicies)(user, [collection])
  };
});
router.post("collections.list", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsListSchema), (0, _pagination.default)(), async ctx => {
  const {
    includeListOnly
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collectionIds = await user.collectionIds();
  const where = includeListOnly && user.isAdmin ? {
    teamId: user.teamId
  } : {
    teamId: user.teamId,
    id: collectionIds
  };
  const [collections, total] = await Promise.all([_models.Collection.scope({
    method: ["withMembership", user.id]
  }).findAll({
    where,
    order: [_sequelize.Sequelize.literal('"collection"."index" collate "C"'), ["updatedAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  }), _models.Collection.count({
    where
  })]);
  const nullIndex = collections.findIndex(collection => collection.index === null);
  if (nullIndex !== -1) {
    const indexedCollections = await (0, _indexing.collectionIndexing)(user.teamId);
    collections.forEach(collection => {
      collection.index = indexedCollections[collection.id];
    });
  }
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data: collections.map(_presenters.presentCollection),
    policies: (0, _presenters.presentPolicies)(user, collections)
  };
});
router.post("collections.delete", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsDeleteSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(id, {
    transaction
  });
  (0, _policies.authorize)(user, "delete", collection);
  await (0, _collectionDestroyer.default)({
    collection,
    transaction,
    user,
    ip: ctx.request.ip
  });
  ctx.body = {
    success: true
  };
});
router.post("collections.move", (0, _authentication.default)(), (0, _validate.default)(T.CollectionsMoveSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id
  } = ctx.input.body;
  let {
    index
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.findByPk(id, {
    transaction
  });
  (0, _policies.authorize)(user, "move", collection);
  index = await (0, _removeIndexCollision.default)(user.teamId, index);
  await collection.update({
    index
  }, {
    transaction
  });
  await _models.Event.create({
    name: "collections.move",
    collectionId: collection.id,
    teamId: collection.teamId,
    actorId: user.id,
    data: {
      index
    },
    ip: ctx.request.ip
  }, {
    transaction
  });
  ctx.body = {
    success: true,
    data: {
      index
    }
  };
});
var _default = exports.default = router;