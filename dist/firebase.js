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
exports.getData = exports.db = void 0;
var app_1 = require("firebase-admin/app");
var firestore_1 = require("firebase-admin/firestore");
var firebaseConfig;
if (process.env.GOOGLE_CREDS) {
    firebaseConfig = JSON.parse(process.env.GOOGLE_CREDS);
}
else {
    firebaseConfig = (0, app_1.applicationDefault)();
}
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
var getData = function (ref, query) { return __awaiter(void 0, void 0, void 0, function () {
    var snapshot, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ref.where.apply(ref, query).get()];
            case 1:
                snapshot = _a.sent();
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return [2 /*return*/, {
                            results: []
                        }];
                }
                results = [];
                snapshot.forEach(function (doc) {
                    results = __spreadArray(__spreadArray([], results, true), [doc.data()], false);
                });
                return [2 /*return*/, {
                        results: results
                    }];
        }
    });
}); };
exports.getData = getData;
// const arcadeRef = db.collection('arcades');
// await arcadeRef.doc().set({
//   "name": "Las Vegas Arcade",
//   "address": {
//     "leisure": "Las Vegas Arcade",
//     "house_number": "89-91",
//     "road": "Wardour Street",
//     "suburb": "Soho",
//     "town": "Islington",
//     "city": "City of Westminster",
//     "ISO3166-2-lvl8": "GB-WSM",
//     "state_district": "Greater London",
//     "state": "England",
//     "ISO3166-2-lvl4": "GB-ENG",
//     "postcode": "W1F 0TD",
//     "country": "United Kingdom",
//     "country_code": "gb"
//   },
//   "place_id": 60052217,
//   "osm_id": 5480809514,
//   "games": [
//     85872,
//     79271
//   ]
// });
// await arcadeRef.doc().set({
//   "name": "The Four Quarters",
//   "address": {
//     "amenity": "The Four Quarters",
//     "house_number": "187",
//     "road": "Rye Lane",
//     "suburb": "Peckham",
//     "city_district": "London Borough of Southwark",
//     "ISO3166-2-lvl8": "GB-SWK",
//     "city": "London",
//     "state_district": "Greater London",
//     "state": "England",
//     "ISO3166-2-lvl4": "GB-ENG",
//     "postcode": "SE15 4TP",
//     "country": "United Kingdom",
//     "country_code": "gb"
//   },
//   "place_id": 265684983,
//   "osm_id": 828010759,
//   "games": [
//     17245
//   ]
// });
// const ref = db.collection('arcades');
// await ref.doc().set({
//   "name": "NQ64",
//   "address": {
//     "leisure": "NQ64",
//     "house_number": "25",
//     "road": "Lothian Road",
//     "neighbourhood": "Lauriston",
//     "suburb": "Tollcross",
//     "city": "City of Edinburgh",
//     "ISO3166-2-lvl6": "GB-EDH",
//     "state": "Scotland",
//     "ISO3166-2-lvl4": "GB-SCT",
//     "postcode": "EH1 2DJ",
//     "country": "United Kingdom",
//     "country_code": "gb",
//   },
//   "place_id": 42075947,
//   "osm_id": 3300377735,
//   "games": [
//     13893
//   ]
// });
