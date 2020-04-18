/*
 * @Author: WalkerWang 
 * @Date: 2020-01-16 16:46:48 
 * @Last Modified by: WalkerWang
 * @Last Modified time: 2020-01-16 17:17:05
 */
'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');

// page 逻辑部分
var page = {
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        // 初始化左侧菜单
        navSide.init({
            name: 'user-pass-update'
        });
    },
    bindEvent : function(){
        var _this = this;
        // 点击提交按钮后的动作
        $(document).on('click', '.btn-submit', function(){
            var userInfo = {
                password        : $.trim($('#password').val()),
                passwordNew     : $.trim($('#password-new').val()),
                passwordConfirm : $.trim($('#password-confirm').val())
            },
            validateResult = _this.validateForm(userInfo);
            if(validateResult.status){
                // 更改用户密码
                _user.updatePassword({
                    passwordOld : userInfo.password,
                    passwordNew : userInfo.passwordNew
                }, function(res, msg){
                    _mm.successTips(msg);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            else{
                _mm.errorTips(validateResult.msg);
            }
        });
    },
    // 验证字段信息
    validateForm : function(formData){
        var result = {
            status  : false,
            msg     : ''
        };
        // 验证原密码是否为空
        if(!_mm.validate(formData.password, 'require')){
            result.msg = 'Old password cannot be empty';
            return result;
        }
        // 验证新密码长度
        if(!formData.passwordNew || formData.passwordNew.length < 6){
            result.msg = 'Password must be at least 6 characters in length';
            return result;
        }
        // 验证两次输入的密码是否一致
        if(formData.passwordNew !== formData.passwordConfirm){
            result.msg = 'Password must be same';
            return result;
        }
        // 通过验证，返回正确提示
        result.status   = true;
        result.msg      = 'Pass authentication';
        return result;
    }
};
$(function(){
    page.init();
});