"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _ruleName = _interopRequireDefault(require("./ruleName"));
var _childNodes = _interopRequireDefault(require("./childNodes"));
var _verticalBranch = _interopRequireDefault(require("./verticalBranch"));
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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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
var NonTerminalNodeParseTree = function(VerticalBranchParseTree) {
    _inherits(NonTerminalNodeParseTree, VerticalBranchParseTree);
    function NonTerminalNodeParseTree() {
        _classCallCheck(this, NonTerminalNodeParseTree);
        return _possibleConstructorReturn(this, _getPrototypeOf(NonTerminalNodeParseTree).apply(this, arguments));
    }
    _createClass(NonTerminalNodeParseTree, null, [
        {
            key: "fromNonTerminalNodeAndTokens",
            value: function fromNonTerminalNodeAndTokens(nonTerminalNode, tokens) {
                var childNodes = nonTerminalNode.getChildNodes(), ruleNameParseTree = _ruleName.default.fromNonTerminalNodeAndTokens(nonTerminalNode, tokens), childNodesParseTree = _childNodes.default.fromChildNodesAndTokens(childNodes, tokens);
                var ruleNameParseTreeVerticalBranchPosition = ruleNameParseTree.getVerticalBranchPosition();
                var childNodesParseTreeVerticalBranchPosition = childNodesParseTree.getVerticalBranchPosition(), verticalBranchPositionsDifference = ruleNameParseTreeVerticalBranchPosition - childNodesParseTreeVerticalBranchPosition;
                var leftMarginWidth = undefined;
                if (false) {
                ///
                } else if (verticalBranchPositionsDifference < 0) {
                    leftMarginWidth = -verticalBranchPositionsDifference;
                    ruleNameParseTree.addLeftMargin(leftMarginWidth);
                } else if (verticalBranchPositionsDifference > 0) {
                    leftMarginWidth = +verticalBranchPositionsDifference;
                    childNodesParseTree.addLeftMargin(leftMarginWidth);
                }
                var ruleNameParseTreeWidth = ruleNameParseTree.getWidth(), childNodesParseTreeWidth = childNodesParseTree.getWidth(), widthsDifference = ruleNameParseTreeWidth - childNodesParseTreeWidth;
                var rightMarginWidth = undefined;
                if (false) {
                ///
                } else if (widthsDifference < 0) {
                    rightMarginWidth = -widthsDifference;
                    ruleNameParseTree.addRightMargin(rightMarginWidth);
                } else if (widthsDifference > 0) {
                    rightMarginWidth = +widthsDifference;
                    childNodesParseTree.addRightMargin(rightMarginWidth);
                }
                ruleNameParseTreeVerticalBranchPosition = ruleNameParseTree.getVerticalBranchPosition();
                var ruleNameParseTreeDepth = ruleNameParseTree.getDepth(), nonTerminalNodeParseTreeDepth = ruleNameParseTreeDepth, verticalBranchPosition = ruleNameParseTreeVerticalBranchPosition, nonTerminalNodeParseTree = _verticalBranch.default.fromDepthAndVerticalBranchPosition(NonTerminalNodeParseTree, nonTerminalNodeParseTreeDepth, verticalBranchPosition);
                nonTerminalNodeParseTree.appendToRight(ruleNameParseTree);
                nonTerminalNodeParseTree.appendToBottom(childNodesParseTree);
                return nonTerminalNodeParseTree;
            }
        }
    ]);
    return NonTerminalNodeParseTree;
}(_verticalBranch.default);
exports.default = NonTerminalNodeParseTree;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcGFyc2VUcmVlL25vblRlcm1pbmFsTm9kZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bGVOYW1lUGFyc2VUcmVlIGZyb20gXCIuL3J1bGVOYW1lXCI7XG5pbXBvcnQgQ2hpbGROb2Rlc1BhcnNlVHJlZSBmcm9tIFwiLi9jaGlsZE5vZGVzXCI7XG5pbXBvcnQgVmVydGljYWxCcmFuY2hQYXJzZVRyZWUgZnJvbSBcIi4vdmVydGljYWxCcmFuY2hcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9uVGVybWluYWxOb2RlUGFyc2VUcmVlIGV4dGVuZHMgVmVydGljYWxCcmFuY2hQYXJzZVRyZWUge1xuICBzdGF0aWMgZnJvbU5vblRlcm1pbmFsTm9kZUFuZFRva2Vucyhub25UZXJtaW5hbE5vZGUsIHRva2Vucykge1xuICAgIGNvbnN0IGNoaWxkTm9kZXMgPSBub25UZXJtaW5hbE5vZGUuZ2V0Q2hpbGROb2RlcygpLFxuICAgICAgICAgIHJ1bGVOYW1lUGFyc2VUcmVlID0gUnVsZU5hbWVQYXJzZVRyZWUuZnJvbU5vblRlcm1pbmFsTm9kZUFuZFRva2Vucyhub25UZXJtaW5hbE5vZGUsIHRva2VucyksXG4gICAgICAgICAgY2hpbGROb2Rlc1BhcnNlVHJlZSA9IENoaWxkTm9kZXNQYXJzZVRyZWUuZnJvbUNoaWxkTm9kZXNBbmRUb2tlbnMoY2hpbGROb2RlcywgdG9rZW5zKTtcbiAgICBcbiAgICBsZXQgcnVsZU5hbWVQYXJzZVRyZWVWZXJ0aWNhbEJyYW5jaFBvc2l0aW9uID0gcnVsZU5hbWVQYXJzZVRyZWUuZ2V0VmVydGljYWxCcmFuY2hQb3NpdGlvbigpO1xuICAgIFxuICAgIGNvbnN0IGNoaWxkTm9kZXNQYXJzZVRyZWVWZXJ0aWNhbEJyYW5jaFBvc2l0aW9uID0gY2hpbGROb2Rlc1BhcnNlVHJlZS5nZXRWZXJ0aWNhbEJyYW5jaFBvc2l0aW9uKCksXG4gICAgICAgICAgdmVydGljYWxCcmFuY2hQb3NpdGlvbnNEaWZmZXJlbmNlID0gcnVsZU5hbWVQYXJzZVRyZWVWZXJ0aWNhbEJyYW5jaFBvc2l0aW9uIC0gY2hpbGROb2Rlc1BhcnNlVHJlZVZlcnRpY2FsQnJhbmNoUG9zaXRpb247XG4gICAgXG4gICAgbGV0IGxlZnRNYXJnaW5XaWR0aCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChmYWxzZSkge1xuICAgICAgLy8vXG4gICAgfSBlbHNlIGlmICh2ZXJ0aWNhbEJyYW5jaFBvc2l0aW9uc0RpZmZlcmVuY2UgPCAwKSB7XG4gICAgICBsZWZ0TWFyZ2luV2lkdGggPSAtdmVydGljYWxCcmFuY2hQb3NpdGlvbnNEaWZmZXJlbmNlO1xuXG4gICAgICBydWxlTmFtZVBhcnNlVHJlZS5hZGRMZWZ0TWFyZ2luKGxlZnRNYXJnaW5XaWR0aCk7XG4gICAgfSBlbHNlIGlmICh2ZXJ0aWNhbEJyYW5jaFBvc2l0aW9uc0RpZmZlcmVuY2UgPiAwKSB7XG4gICAgICBsZWZ0TWFyZ2luV2lkdGggPSArdmVydGljYWxCcmFuY2hQb3NpdGlvbnNEaWZmZXJlbmNlO1xuXG4gICAgICBjaGlsZE5vZGVzUGFyc2VUcmVlLmFkZExlZnRNYXJnaW4obGVmdE1hcmdpbldpZHRoKTtcbiAgICB9XG5cbiAgICBjb25zdCBydWxlTmFtZVBhcnNlVHJlZVdpZHRoID0gcnVsZU5hbWVQYXJzZVRyZWUuZ2V0V2lkdGgoKSxcbiAgICAgICAgICBjaGlsZE5vZGVzUGFyc2VUcmVlV2lkdGggPSBjaGlsZE5vZGVzUGFyc2VUcmVlLmdldFdpZHRoKCksXG4gICAgICAgICAgd2lkdGhzRGlmZmVyZW5jZSA9IHJ1bGVOYW1lUGFyc2VUcmVlV2lkdGggLSBjaGlsZE5vZGVzUGFyc2VUcmVlV2lkdGg7XG4gICAgXG4gICAgbGV0IHJpZ2h0TWFyZ2luV2lkdGggPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZmFsc2UpIHtcbiAgICAgIC8vL1xuICAgIH0gZWxzZSBpZiAod2lkdGhzRGlmZmVyZW5jZSA8IDApIHtcbiAgICAgIHJpZ2h0TWFyZ2luV2lkdGggPSAtd2lkdGhzRGlmZmVyZW5jZTtcbiAgICAgIFxuICAgICAgcnVsZU5hbWVQYXJzZVRyZWUuYWRkUmlnaHRNYXJnaW4ocmlnaHRNYXJnaW5XaWR0aCk7XG4gICAgfSBlbHNlIGlmICh3aWR0aHNEaWZmZXJlbmNlID4gMCkge1xuICAgICAgcmlnaHRNYXJnaW5XaWR0aCA9ICt3aWR0aHNEaWZmZXJlbmNlO1xuXG4gICAgICBjaGlsZE5vZGVzUGFyc2VUcmVlLmFkZFJpZ2h0TWFyZ2luKHJpZ2h0TWFyZ2luV2lkdGgpO1xuICAgIH1cblxuICAgIHJ1bGVOYW1lUGFyc2VUcmVlVmVydGljYWxCcmFuY2hQb3NpdGlvbiA9IHJ1bGVOYW1lUGFyc2VUcmVlLmdldFZlcnRpY2FsQnJhbmNoUG9zaXRpb24oKTtcblxuICAgIGNvbnN0IHJ1bGVOYW1lUGFyc2VUcmVlRGVwdGggPSBydWxlTmFtZVBhcnNlVHJlZS5nZXREZXB0aCgpLFxuICAgICAgICAgIG5vblRlcm1pbmFsTm9kZVBhcnNlVHJlZURlcHRoID0gcnVsZU5hbWVQYXJzZVRyZWVEZXB0aCwgLy8vXG4gICAgICAgICAgdmVydGljYWxCcmFuY2hQb3NpdGlvbiA9IHJ1bGVOYW1lUGFyc2VUcmVlVmVydGljYWxCcmFuY2hQb3NpdGlvbiwgLy8vXG4gICAgICAgICAgbm9uVGVybWluYWxOb2RlUGFyc2VUcmVlID0gVmVydGljYWxCcmFuY2hQYXJzZVRyZWUuZnJvbURlcHRoQW5kVmVydGljYWxCcmFuY2hQb3NpdGlvbihOb25UZXJtaW5hbE5vZGVQYXJzZVRyZWUsIG5vblRlcm1pbmFsTm9kZVBhcnNlVHJlZURlcHRoLCB2ZXJ0aWNhbEJyYW5jaFBvc2l0aW9uKTtcblxuICAgIG5vblRlcm1pbmFsTm9kZVBhcnNlVHJlZS5hcHBlbmRUb1JpZ2h0KHJ1bGVOYW1lUGFyc2VUcmVlKTtcbiAgICBub25UZXJtaW5hbE5vZGVQYXJzZVRyZWUuYXBwZW5kVG9Cb3R0b20oY2hpbGROb2Rlc1BhcnNlVHJlZSk7XG5cbiAgICByZXR1cm4gbm9uVGVybWluYWxOb2RlUGFyc2VUcmVlO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkNBQUEsVUFBWTs7Ozs7SUFFa0IsU0FBWTtJQUNWLFdBQWM7SUFDVixlQUFrQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWpDLHdCQUF3QjtjQUF4Qix3QkFBd0I7YUFBeEIsd0JBQXdCOzhCQUF4Qix3QkFBd0I7Z0VBQXhCLHdCQUF3Qjs7aUJBQXhCLHdCQUF3Qjs7WUFDcEMsR0FBNEIsR0FBNUIsNEJBQTRCOzRCQUE1Qiw0QkFBNEIsQ0FBQyxlQUFlLEVBQUUsTUFBTTtvQkFDbkQsVUFBVSxHQUFHLGVBQWUsQ0FBQyxhQUFhLElBQzFDLGlCQUFpQixHQVBHLFNBQVksU0FPTSw0QkFBNEIsQ0FBQyxlQUFlLEVBQUUsTUFBTSxHQUMxRixtQkFBbUIsR0FQRyxXQUFjLFNBT00sdUJBQXVCLENBQUMsVUFBVSxFQUFFLE1BQU07b0JBRXRGLHVDQUF1QyxHQUFHLGlCQUFpQixDQUFDLHlCQUF5QjtvQkFFbkYseUNBQXlDLEdBQUcsbUJBQW1CLENBQUMseUJBQXlCLElBQ3pGLGlDQUFpQyxHQUFHLHVDQUF1QyxHQUFHLHlDQUF5QztvQkFFekgsZUFBZSxHQUFHLFNBQVM7b0JBRTNCLEtBQUs7Z0JBQ1AsRUFBRyxBQUFILENBQUc7MkJBQ00saUNBQWlDLEdBQUcsQ0FBQztvQkFDOUMsZUFBZSxJQUFJLGlDQUFpQztvQkFFcEQsaUJBQWlCLENBQUMsYUFBYSxDQUFDLGVBQWU7MkJBQ3RDLGlDQUFpQyxHQUFHLENBQUM7b0JBQzlDLGVBQWUsSUFBSSxpQ0FBaUM7b0JBRXBELG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxlQUFlOztvQkFHN0Msc0JBQXNCLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxJQUNuRCx3QkFBd0IsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLElBQ3ZELGdCQUFnQixHQUFHLHNCQUFzQixHQUFHLHdCQUF3QjtvQkFFdEUsZ0JBQWdCLEdBQUcsU0FBUztvQkFFNUIsS0FBSztnQkFDUCxFQUFHLEFBQUgsQ0FBRzsyQkFDTSxnQkFBZ0IsR0FBRyxDQUFDO29CQUM3QixnQkFBZ0IsSUFBSSxnQkFBZ0I7b0JBRXBDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxnQkFBZ0I7MkJBQ3hDLGdCQUFnQixHQUFHLENBQUM7b0JBQzdCLGdCQUFnQixJQUFJLGdCQUFnQjtvQkFFcEMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLGdCQUFnQjs7Z0JBR3JELHVDQUF1QyxHQUFHLGlCQUFpQixDQUFDLHlCQUF5QjtvQkFFL0Usc0JBQXNCLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxJQUNuRCw2QkFBNkIsR0FBRyxzQkFBc0IsRUFDdEQsc0JBQXNCLEdBQUcsdUNBQXVDLEVBQ2hFLHdCQUF3QixHQWxERSxlQUFrQixTQWtETyxrQ0FBa0MsQ0FBQyx3QkFBd0IsRUFBRSw2QkFBNkIsRUFBRSxzQkFBc0I7Z0JBRTNLLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxpQkFBaUI7Z0JBQ3hELHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxtQkFBbUI7dUJBRXBELHdCQUF3Qjs7OztXQXJEZCx3QkFBd0I7RUFGVCxlQUFrQjtrQkFFakMsd0JBQXdCIn0=