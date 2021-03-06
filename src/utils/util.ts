"use strict";

declare var global: any;

export class Util {

    /**
     * Gets a callback function which will maintain context across async calls.
     * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
     *
     * @param context The object that will be the 'this' value in the callback
     * @param method The method to which we will apply the context and parameters
     * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
     */
    public static getCtxCallback(context: any, method: Function, ...params: any[]): Function {
        return function () {
            method.apply(context, params);
        };
    }

    /**
     * Tests if a url param exists
     *
     * @param name The name of the url paramter to check
     */
    public static urlParamExists(name: string): boolean {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        return regex.test(location.search);
    }

    /**
     * Gets a url param value by name
     *
     * @param name The name of the paramter for which we want the value
     */
    public static getUrlParamByName(name: string): string {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        let results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /**
     * Gets a url param by name and attempts to parse a bool value
     *
     * @param name The name of the paramter for which we want the boolean value
     */
    public static getUrlParamBoolByName(name: string): boolean {
        let p = this.getUrlParamByName(name);
        let isFalse = (p === "" || /false|0/i.test(p));
        return !isFalse;
    }

    /**
     * Inserts the string s into the string target as the index specified by index
     *
     * @param target The string into which we will insert s
     * @param index The location in target to insert s (zero based)
     * @param s The string to insert into target at position index
     */
    public static stringInsert(target: string, index: number, s: string): string {
        if (index > 0) {
            return target.substring(0, index) + s + target.substring(index, target.length);
        }
        return s + target;
    }

    /**
     * Adds a value to a date
     *
     * @param date The date to which we will add units, done in local time
     * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
     * @param units The amount to add to date of the given interval
     *
     * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
     */
    public static dateAdd(date: Date, interval: string, units: number): Date {
        let ret = new Date(date.toLocaleString()); // don't change original date
        switch (interval.toLowerCase()) {
            case "year": ret.setFullYear(ret.getFullYear() + units); break;
            case "quarter": ret.setMonth(ret.getMonth() + 3 * units); break;
            case "month": ret.setMonth(ret.getMonth() + units); break;
            case "week": ret.setDate(ret.getDate() + 7 * units); break;
            case "day": ret.setDate(ret.getDate() + units); break;
            case "hour": ret.setTime(ret.getTime() + units * 3600000); break;
            case "minute": ret.setTime(ret.getTime() + units * 60000); break;
            case "second": ret.setTime(ret.getTime() + units * 1000); break;
            default: ret = undefined; break;
        }
        return ret;
    }

    /**
     * Loads a stylesheet into the current page
     *
     * @param path The url to the stylesheet
     * @param avoidCache If true a value will be appended as a query string to avoid browser caching issues
     */
    public static loadStylesheet(path: string, avoidCache: boolean): void {
        if (avoidCache) {
            path += "?" + encodeURIComponent((new Date()).getTime().toString());
        }
        let head = document.getElementsByTagName("head");
        if (head.length > 0) {
            let e = document.createElement("link");
            head[0].appendChild(e);
            e.setAttribute("type", "text/css");
            e.setAttribute("rel", "stylesheet");
            e.setAttribute("href", path);
        }
    }

    /**
     * Combines an arbitrary set of paths ensuring that the slashes are normalized
     *
     * @param paths 0 to n path parts to combine
     */
    public static combinePaths(...paths: string[]): string {
        let parts = [];
        for (let i = 0; i < paths.length; i++) {
            if (typeof paths[i] !== "undefined" && paths[i] !== null) {
                parts.push(paths[i].replace(/^[\\|\/]/, "").replace(/[\\|\/]$/, ""));
            }
        }
        return parts.join("/").replace(/\\/, "/");
    }

    /**
     * Gets a random string of chars length
     *
     * @param chars The length of the random string to generate
     */
    public static getRandomString(chars: number): string {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < chars; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Gets a random GUID value
     *
     * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    /* tslint:disable no-bitwise */
    public static getGUID(): string {
        let d = new Date().getTime();
        let guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return guid;
    }
    /* tslint:enable */

    /**
     * Determines if a given value is a function
     *
     * @param candidateFunction The thing to test for being a function
     */
    public static isFunction(candidateFunction: any): boolean {
        return typeof candidateFunction === "function";
    }

    /** 
     * @returns whether the provided parameter is a JavaScript Array or not. 
    */
    public static isArray(array: any): boolean {

        if (Array.isArray) {
            return Array.isArray(array);
        }

        return array && typeof array.length === "number" && array.constructor === Array;
    }


    /**
     * Determines if a string is null or empty or undefined
     *
     * @param s The string to test
     */
    public static stringIsNullOrEmpty(s: string): boolean {
        return typeof s === "undefined" || s === null || s === "";
    }

    /**
     * Provides functionality to extend the given object by doign a shallow copy
     *
     * @param target The object to which properties will be copied
     * @param source The source object from which properties will be copied
     * @param noOverwrite If true existing properties on the target are not overwritten from the source
     *
     */
    /* tslint:disable:forin */
    public static extend<T, S>(target: T, source: S, noOverwrite = false): T & S {

        let result = <T & S>{};
        for (let id in target) {
            result[id] = target[id];
        }

        // ensure we don't overwrite things we don't want overwritten
        let check: (o, i) => Boolean = noOverwrite ? (o, i) => !o.hasOwnProperty(i) : (o, i) => true;

        for (let id in source) {
            if (check(result, id)) {
                result[id] = source[id];
            }
        }

        return result;
    }
    /* tslint:enable */

    /**
     * Applies one or more mixins to the supplied target
     *
     * @param derivedCtor The classto which we will apply the mixins
     * @param baseCtors One or more mixin classes to apply
     */
    public static applyMixins(derivedCtor: any, ...baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }

    /**
     * Determines if a given url is absolute
     *
     * @param url The url to check to see if it is absolute
     */
    public static isUrlAbsolute(url: string): boolean {
        return /^https?:\/\/|^\/\//i.test(url);
    }

    /**
     * Attempts to make the supplied relative url absolute based on the _spPageContextInfo object, if available
     * 
     * @param url The relative url to make absolute
     */
    public static makeUrlAbsolute(url: string): string {

        if (Util.isUrlAbsolute(url)) {
            return url;
        }

        if (typeof global._spPageContextInfo !== "undefined") {
            if (global._spPageContextInfo.hasOwnProperty("webAbsoluteUrl")) {
                return Util.combinePaths(global._spPageContextInfo.webAbsoluteUrl, url);
            } else if (global._spPageContextInfo.hasOwnProperty("webServerRelativeUrl")) {
                return Util.combinePaths(global._spPageContextInfo.webServerRelativeUrl, url);
            }
        } else {
            return url;
        }
    }
}
