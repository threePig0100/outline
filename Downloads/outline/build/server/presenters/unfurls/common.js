"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.presentLastViewedInfoFor = exports.presentLastOnlineInfoFor = exports.presentLastActivityInfoFor = void 0;
var _dateFns = require("date-fns");
var _i18next = require("i18next");
var _date = require("./../../../shared/utils/date");
var _models = require("./../../models");
var _i18n = require("./../../utils/i18n");
const presentLastOnlineInfoFor = user => {
  const locale = (0, _date.dateLocale)(user.language);
  let info;
  if (!user.lastActiveAt) {
    info = (0, _i18next.t)("Never logged in", {
      ...(0, _i18n.opts)(user)
    });
  } else if ((0, _dateFns.differenceInMinutes)(new Date(), user.lastActiveAt) < 5) {
    info = (0, _i18next.t)("Online now", {
      ...(0, _i18n.opts)(user)
    });
  } else {
    info = (0, _i18next.t)("Online {{ timeAgo }}", {
      timeAgo: (0, _dateFns.formatDistanceToNowStrict)(user.lastActiveAt, {
        addSuffix: true,
        locale
      }),
      ...(0, _i18n.opts)(user)
    });
  }
  return info;
};
exports.presentLastOnlineInfoFor = presentLastOnlineInfoFor;
const presentLastViewedInfoFor = async (user, document) => {
  const lastView = await _models.View.findOne({
    where: {
      userId: user.id,
      documentId: document.id
    },
    order: [["updatedAt", "DESC"]]
  });
  const lastViewedAt = lastView ? lastView.updatedAt : undefined;
  const locale = (0, _date.dateLocale)(user.language);
  let info;
  if (!lastViewedAt) {
    info = (0, _i18next.t)("Never viewed", {
      ...(0, _i18n.opts)(user)
    });
  } else if ((0, _dateFns.differenceInMinutes)(new Date(), lastViewedAt) < 5) {
    info = (0, _i18next.t)("Viewed just now", {
      ...(0, _i18n.opts)(user)
    });
  } else {
    info = (0, _i18next.t)("Viewed {{ timeAgo }}", {
      timeAgo: (0, _dateFns.formatDistanceToNowStrict)(lastViewedAt, {
        addSuffix: true,
        locale
      }),
      ...(0, _i18n.opts)(user)
    });
  }
  return info;
};
exports.presentLastViewedInfoFor = presentLastViewedInfoFor;
const presentLastActivityInfoFor = (document, viewer) => {
  const locale = (0, _date.dateLocale)(viewer.language);
  const wasUpdated = document.createdAt !== document.updatedAt;
  let info;
  if (wasUpdated) {
    const lastUpdatedByViewer = document.updatedBy.id === viewer.id;
    if (lastUpdatedByViewer) {
      info = (0, _i18next.t)("You updated {{ timeAgo }}", {
        timeAgo: (0, _dateFns.formatDistanceToNowStrict)(document.updatedAt, {
          addSuffix: true,
          locale
        }),
        ...(0, _i18n.opts)(viewer)
      });
    } else {
      info = (0, _i18next.t)("{{ user }} updated {{ timeAgo }}", {
        user: document.updatedBy.name,
        timeAgo: (0, _dateFns.formatDistanceToNowStrict)(document.updatedAt, {
          addSuffix: true,
          locale
        }),
        ...(0, _i18n.opts)(viewer)
      });
    }
  } else {
    const lastCreatedByViewer = document.createdById === viewer.id;
    if (lastCreatedByViewer) {
      info = (0, _i18next.t)("You created {{ timeAgo }}", {
        timeAgo: (0, _dateFns.formatDistanceToNowStrict)(document.createdAt, {
          addSuffix: true,
          locale
        }),
        ...(0, _i18n.opts)(viewer)
      });
    } else {
      info = (0, _i18next.t)("{{ user }} created {{ timeAgo }}", {
        user: document.createdBy.name,
        timeAgo: (0, _dateFns.formatDistanceToNowStrict)(document.createdAt, {
          addSuffix: true,
          locale
        }),
        ...(0, _i18n.opts)(viewer)
      });
    }
  }
  return info;
};
exports.presentLastActivityInfoFor = presentLastActivityInfoFor;