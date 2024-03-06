"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CannotUseWithout = CannotUseWithout;
var _classValidator = require("class-validator");
/* eslint-disable @typescript-eslint/ban-types */

function CannotUseWithout(property, validationOptions) {
  return function (object, propertyName) {
    (0, _classValidator.registerDecorator)({
      name: "cannotUseWithout",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value, args) {
          const object = args.object;
          const required = args.constraints[0];
          return object[required] !== undefined;
        },
        defaultMessage(args) {
          return "".concat(propertyName, " cannot be used without ").concat(args.constraints[0], ".");
        }
      }
    });
  };
}