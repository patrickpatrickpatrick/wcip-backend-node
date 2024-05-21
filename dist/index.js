"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var cookie_1 = require("hono/cookie");
var node_server_1 = require("@hono/node-server");
var firebase_1 = require("./firebase");
var utils_1 = require("./utils");
var igbdClientID = process.env.IGDB_ID;
var igbdClientSecret = process.env.IGDB_SECRET;
if (!(igbdClientID && igbdClientSecret)) {
    throw "Provide a clientID and clientSecret for IGDBB.";
}
var accessTokenGetter = function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, _a, access_token, expires_in, expire_date;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                accessToken = (0, cookie_1.getCookie)(c, "igdb_access_token");
                if (!!accessToken) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, utils_1.getIgdbToken)(igbdClientID, igbdClientSecret)];
            case 1:
                _a = _b.sent(), access_token = _a.access_token, expires_in = _a.expires_in;
                expire_date = new Date();
                expire_date.setSeconds(expire_date.getSeconds() + parseInt(expires_in));
                (0, cookie_1.setCookie)(c, "igdbAccessToken", access_token, {
                    expires: expire_date
                });
                accessToken = access_token;
                _b.label = 2;
            case 2: return [2 /*return*/, accessToken];
        }
    });
}); };
var app = new hono_1.Hono();
process.on('uncaughtException', function (err) {
    console.log(err);
});
app.use('/*', (0, cors_1.cors)());
app.get('/', function (c) { return c.text('This is the "Where Can I Play?" backend. It is implemented using Hono and nodejs.'); });
app.post('/arcades', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, ref, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, c.req.json()];
            case 1:
                gameId = (_a.sent()).gameId;
                ref = firebase_1.db.collection('arcades');
                return [4 /*yield*/, (0, firebase_1.getData)(ref, ['games', 'array-contains-any', [parseInt(gameId)]])];
            case 2:
                response = _a.sent();
                return [2 /*return*/, c.json(response)];
        }
    });
}); });
app.post('/games', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, query, queryIgdb, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accessTokenGetter(c)];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, c.req.json()];
            case 2:
                query = (_a.sent()).query;
                queryIgdb = "search \"".concat(query.replaceAll("\"", ""), "\"; fields name,first_release_date,cover;");
                return [4 /*yield*/, (0, utils_1.gamesApiFetch)(igbdClientID, accessToken, queryIgdb)];
            case 3:
                response = _a.sent();
                return [2 /*return*/, c.json(response)];
        }
    });
}); });
app.post('/game/:id', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, id, queryIgdb, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accessTokenGetter(c)];
            case 1:
                accessToken = _a.sent();
                id = c.req.param('id');
                queryIgdb = "fields name,first_release_date,cover; where id = ".concat(id, ";");
                return [4 /*yield*/, (0, utils_1.gamesApiFetch)(igbdClientID, accessToken, queryIgdb)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, c.json(response[0])];
        }
    });
}); });
var port = 3000;
if (process.env.PORT) {
    port = parseInt(process.env.PORT);
}
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: port
});
