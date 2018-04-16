var app = new getApp();
var api = require('../../utils/api.js');
var MD5Util = require('../../utils/md5.js');
var testpayData = require('../../data/testpaydata.js');
var orderArr = []; //订单信息集合
Page({

    /**
     * 页面的初始数据
     */
    data: {
        open_id:'',
        order_id: '',  //订单编号
        order_money: 0,  //订单金额
        order_name: '',  //订单名称
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.keyid) {
            console.log("支付页面地址栏的参数为：" + options.keyid);
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //this.onloadPaylist();
        this.setData({
            JTests: testpayData.testpayList
        })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onloadPaylist: function () {
        var that = this;
        api.get(app.globalData.ctxPath + '/careerTest/list', '').then(res => {
            that.setData({
                JTests: res.data,
            })
        })
    },
    testPay: function (event) {
        orderArr = []; //先清空集合在重新赋值，防止重复
        var that = this;
        that.setData({
            order_id: event.target.dataset.id,
            order_money: event.target.dataset.money,
            order_name: event.target.dataset.name,
        })
        orderArr.push({ "id": that.data.order_id, "money": that.data.order_money, "name": that.data.order_name })
        app.getUserOpenid(function (openid) {  //获取全局openid
            console.log("openid===" + openid);
            that.setData({
                open_id: openid
            })
            //传递openid进行下单操作
            that.doOrder(that.data.open_id, orderArr);
        })
        
    },
    //下单
    doOrder: function (openId, orderArr) {
        var that = this;
        wx.request({
            url: app.globalData.ctxPath + '/wxapp/onPayOrder',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { 'openid': openId, "orderinfo": orderArr},
            success: function (res) {
                var prepay_id = res.data.prepay_id;
                console.log("统一下单返回 prepay_id:" + prepay_id);
                that.doSign(prepay_id);
            }
        })
    },
    //签名
    doSign: function (prepay_id) {
        var that = this;
        wx.request({
            url: app.globalData.ctxPath + '/wxapp/sign',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { 'repay_id': prepay_id },
            success: function (res) {
                that.doRequestPayment(res.data);
                console.log(res);
            }
        })
    },
    //申请支付
    doRequestPayment: function (obj) {
        var that = this;
        wx.requestPayment({
            'timeStamp': obj.timeStamp,
            'nonceStr': obj.nonceStr,
            'package': obj.package,
            'signType': obj.signType,
            'paySign': obj.paySign,
            'success': function (res) {
                console.log("支付成功");
                wx.navigateTo({
                    url: '../payresult/payresult?payId=' + that.data.order_id + '&payBody=' + that.data.order_name + '&payTotalfee=' + that.data.order_money
                })
            },
            'fail': function (res) {
                console.log("支付失败");
                console.log(res.errMsg);
            }
        })
    }
})
