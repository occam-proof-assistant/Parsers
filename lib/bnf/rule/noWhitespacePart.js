"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _rule = _interopRequireDefault(require("../rule"));
var _noWhitespacePart = _interopRequireDefault(require("../node/noWhitespacePart"));
var _noWhitespacePart1 = _interopRequireDefault(require("../definition/noWhitespacePart"));
var _ruleNames = require("../ruleNames");
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var NoWhitespacePartRule = function(Rule) {
    _inherits(NoWhitespacePartRule, Rule);
    function NoWhitespacePartRule() {
        _classCallCheck(this, NoWhitespacePartRule);
        var noWhitespacePartDefinition = new _noWhitespacePart1.default(), name = _ruleNames.NoWhitespacePartRuleName, definitions = [
            noWhitespacePartDefinition
        ], Node1 = _noWhitespacePart.default;
        return _possibleConstructorReturn(this, _getPrototypeOf(NoWhitespacePartRule).call(this, name, definitions, Node1));
    }
    return NoWhitespacePartRule;
}(_rule.default);
exports.default = NoWhitespacePartRule;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ibmYvcnVsZS9ub1doaXRlc3BhY2VQYXJ0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVsZSBmcm9tIFwiLi4vcnVsZVwiO1xuaW1wb3J0IE5vV2hpdGVzcGFjZVBhcnROb2RlIGZyb20gXCIuLi9ub2RlL25vV2hpdGVzcGFjZVBhcnRcIjtcbmltcG9ydCBOb1doaXRlc3BhY2VQYXJ0RGVmaW5pdGlvbiBmcm9tIFwiLi4vZGVmaW5pdGlvbi9ub1doaXRlc3BhY2VQYXJ0XCI7XG5cbmltcG9ydCB7IE5vV2hpdGVzcGFjZVBhcnRSdWxlTmFtZSB9IGZyb20gXCIuLi9ydWxlTmFtZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9XaGl0ZXNwYWNlUGFydFJ1bGUgZXh0ZW5kcyBSdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgbm9XaGl0ZXNwYWNlUGFydERlZmluaXRpb24gPSBuZXcgTm9XaGl0ZXNwYWNlUGFydERlZmluaXRpb24oKSxcbiAgICAgICAgICBuYW1lID0gTm9XaGl0ZXNwYWNlUGFydFJ1bGVOYW1lLFxuICAgICAgICAgIGRlZmluaXRpb25zID0gW1xuICAgICAgICAgICAgbm9XaGl0ZXNwYWNlUGFydERlZmluaXRpb25cbiAgICAgICAgICBdLFxuICAgICAgICAgIE5vZGUgPSBOb1doaXRlc3BhY2VQYXJ0Tm9kZTtcblxuICAgIHN1cGVyKG5hbWUsIGRlZmluaXRpb25zLCBOb2RlKVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkNBQUEsVUFBWTs7Ozs7SUFFSyxLQUFTO0lBQ08saUJBQTBCO0lBQ3BCLGtCQUFnQztJQUU5QixVQUFjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWxDLG9CQUFvQjtjQUFwQixvQkFBb0I7YUFBcEIsb0JBQW9COzhCQUFwQixvQkFBb0I7WUFFL0IsMEJBQTBCLE9BTkcsa0JBQWdDLFlBTzdELElBQUksR0FMMkIsVUFBYywyQkFNN0MsV0FBVztZQUNULDBCQUEwQjtXQUU1QixLQUFJLEdBWm1CLGlCQUEwQjtnRUFLdEMsb0JBQW9CLGFBUy9CLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSTs7V0FUWixvQkFBb0I7RUFOeEIsS0FBUztrQkFNTCxvQkFBb0IifQ==