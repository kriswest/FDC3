"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAppSupport = void 0;
var DefaultAppSupport = /** @class */ (function () {
    function DefaultAppSupport() {
    }
    DefaultAppSupport.prototype.hasDesktopAgentBridging = function () {
        throw new Error("Method not implemented.");
    };
    DefaultAppSupport.prototype.hasOriginatingAppMetadata = function () {
        throw new Error("Method not implemented.");
    };
    DefaultAppSupport.prototype.findInstances = function (_app) {
        throw new Error("Method not implemented.");
    };
    DefaultAppSupport.prototype.getAppMetadata = function (_app) {
        throw new Error("Method not implemented.");
    };
    DefaultAppSupport.prototype.open = function (_app, _context) {
        throw new Error("Method not implemented.");
    };
    DefaultAppSupport.prototype.getThisAppMetadata = function () {
        throw new Error("Method not implemented.");
    };
    return DefaultAppSupport;
}());
exports.DefaultAppSupport = DefaultAppSupport;
