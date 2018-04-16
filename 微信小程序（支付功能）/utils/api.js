'use strict';
import Promise from './es6-promise.min'

module.exports = {
    get(url, cookie) {
        return new Promise((resolve, reject) => {
            if (cookie) {
                var header = {
                    'Content-Type': 'application/json',
                    'Cookie': cookie
                };
            } else
                var header = {
                    'Content-Type': 'application/json'
                };
            wx.request({
                url: url,
                header: header,
                success: function (res) {
                    resolve(res)
                },
                fail: function (res) {
                    reject(res)
                }
            })
        })
    },

    post(url, data, cookie) {
        return new Promise((resolve, reject) => {
            if (cookie) {
                var header = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookie
                };
            } else
                var header = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            wx.request({
                url: url,
                data: data,
                method: 'POST',
                header: header,
                success: function (res) {
                    resolve(res)
                },
                fail: function (res) {
                    reject(res)
                }
            })
        })
    },

    json2Form(json) {
        var str = []
        for (var p in json) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
        }
        return str.join("&")
    }

};
