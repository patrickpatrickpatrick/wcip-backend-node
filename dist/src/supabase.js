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
exports.getGameData = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = 'https://iophpxwuqfrtgujyfbiz.supabase.co';
var SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) {
    throw "Provide a SUPABASE KEY.";
}
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, SUPABASE_KEY);
var getGameData = function (game_id, filter) { return __awaiter(void 0, void 0, void 0, function () {
    var regionId, countryId, cityId, query, _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                regionId = filter.regionId, countryId = filter.countryId, cityId = filter.cityId;
                query = supabase
                    .from('arcade')
                    .select("*, games_to_arcades!inner(game_id), ...address(*, ...region(*, ...country(*)))")
                    .eq('games_to_arcades.game_id', game_id);
                if (regionId) {
                    query = query.eq('code', regionId);
                }
                if (countryId) {
                    query = query.eq('country.code', countryId);
                }
                if (cityId) {
                    query = query.eq('arcade.address.city.id', cityId);
                }
                return [4 /*yield*/, query];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                // better way of debugging
                // have to find :)
                console.log(error);
                if (error)
                    throw error;
                return [2 /*return*/, data];
        }
    });
}); };
exports.getGameData = getGameData;
