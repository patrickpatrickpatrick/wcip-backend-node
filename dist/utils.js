"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesApiFetch = exports.getIgdbToken = exports.requestBuilder = void 0;
var API_URL = "https://api.igdb.com/v4/";
var requestBuilder = function (clientId, accessToken, query) { return ({
    headers: {
        "Client-ID": clientId,
        "Authorization": "Bearer ".concat(accessToken),
    },
    method: "POST",
    body: query
}); };
exports.requestBuilder = requestBuilder;
var handleResponse = function (res) { return __awaiter(void 0, void 0, void 0, function () {
    var json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!res.ok) return [3 /*break*/, 2];
                return [4 /*yield*/, res.json()];
            case 1:
                json = _a.sent();
                return [2 /*return*/, {
                        results: json,
                        type: "success",
                    }];
            case 2: return [2 /*return*/, {
                    type: 'error',
                    message: res.body || 'An error has occurred',
                }];
        }
    });
}); };
var getIgdbToken = function (client_id, client_secret) { return fetch("https://id.twitch.tv/oauth2/token?client_id=".concat(client_id, "&client_secret=").concat(client_secret, "&grant_type=client_credentials"), {
    method: "POST"
})
    .then(function (data) { return data.json(); })
    .then(function (json) { return json; }); };
exports.getIgdbToken = getIgdbToken;
var gamesApiFetch = function (clientId, accessToken, query) { return __awaiter(void 0, void 0, void 0, function () {
    var gamesQuery, gameResponse, coversIds, coverQuery, coverResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gamesQuery = query;
                return [4 /*yield*/, fetch("".concat(API_URL, "games"), (0, exports.requestBuilder)(clientId, accessToken, gamesQuery)).then(function (res) { return handleResponse(res); })];
            case 1:
                gameResponse = _a.sent();
                if (gameResponse.type == 'error') {
                    return [2 /*return*/, gameResponse];
                }
                coversIds = gameResponse.results.filter(function (x) { return x.cover; }).map(function (x) { return x.cover; }).join(',');
                coverQuery = "fields url; where id = (".concat(coversIds, ");");
                if (!(coversIds && coversIds.length)) return [3 /*break*/, 3];
                return [4 /*yield*/, fetch("".concat(API_URL, "covers"), (0, exports.requestBuilder)(clientId, accessToken, coverQuery)).then(function (res) { return handleResponse(res); })];
            case 2:
                coverResponse = _a.sent();
                if (coverResponse.type == 'error') {
                    console.log("Error occured when trying to fetch covers. Non-blocking error.");
                }
                _a.label = 3;
            case 3: return [2 /*return*/, gameResponse.results.reduce(function (res, game) {
                    var cover = coverResponse.results.find(function (x) { return x.id == game.cover; });
                    return __spreadArray(__spreadArray([], res, true), [
                        __assign(__assign({}, game), (cover ? { cover_url: cover.url } : {}))
                    ], false);
                }, [])];
        }
    });
}); };
exports.gamesApiFetch = gamesApiFetch;
