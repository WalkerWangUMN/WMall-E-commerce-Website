/*
 * @Author: WalkerWang 
 * @Date: 2020-01-18 11:06:23 
 * @Last Modified by: WalkerWang
 * @Last Modified time: 2020-01-18 21:15:23
 */
'use strict';
var _mm = require('util/mm.js');
var _cities = require('util/cities/index.js');
var _address = require('service/address-service.js');
var templateAddressModal = require('./address-modal.string');

var addressModal = {
    show: function(option){
        // option绑定
        this.option = option;
        this.option.data = option.data || {};
        this.$modalWrap = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },
    bindEvent: function(){
        var _this = this;
        // 省级和城市二级联动
        this.$modalWrap.find('#receiver-province').change(function(){
            var selectProvince = $(this).val();
            _this.loadCities(selectProvince);
        });
        // 提交收获地址
        this.$modalWrap.find('.address-btn').click(function(){
            var receiverInfo = _this.getReceiverInfo(),
                isUpdate = _this.option.isUpdate;
            // 使用新地址，且验证通过
            if(!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data, function(res){
                    _mm.successTips('Adding success');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                        && _this.option.onSuccess(res);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            // 更新收件人，且验证通过
            else if(isUpdate && receiverInfo.status){
                _address.update(receiverInfo.data, function(res){
                    _mm.successTips('Changing success');
                    _this.hide();
                    typeof _this.option.onSuccess ===  'function'
                        && _this.option.onSuccess(res);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            // 验证不通过
            else {
                _mm.errorTips(receiverInfo.errMsg || 'Something went wrong...');
            }
        });
        // 保证点击modal内容区，不关闭弹窗
        this.$modalWrap.find('.modal-container').click(function(e){
            e.stopPropagation();
        });
        // 点击叉号或蒙版区域，关闭弹窗
        this.$modalWrap.find('.close').click(function(e){
            _this.hide();
        });
    },
    loadModal: function(){
        var addressModalHtml = _mm.renderHtml(templateAddressModal, {
            isUpdate: this.option.isUpdate,
            data: this.option.data
        });
        this.$modalWrap.html(addressModalHtml);
        // 加载省份
        this.loadProvince();
    },
    // 加载省份信息
    loadProvince: function(){
        var provinces = _cities.getProvinces() || [],
            $provinceSelect = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));
        // 如果是更新地址，并且有省份信息，做省份的回填
        if (this.option.isUpdate && this.option.data.receiverProvince){
            $provinceSelect.val(this.option.data.receiverProvince);
            this.loadCities(this.option.data.receiverProvince);
        }
    },
    // 加载城市信息
    loadCities: function(provinceName){
        var cities = _cities.getCities(provinceName) || [],
            $citySelect = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));
        // 
        if(this.option.isUpdate && this.option.data.receiverCity){
            $citySelect.val(this.option.data.receiverCity);
        }
    },
    // 获取表单里收件人信息，并做表单的验证
    getReceiverInfo: function(){
        var receiverInfo = {},
            result = {
                status: false
            };
            receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
            receiverInfo.receiverProvince = $.trim(this.$modalWrap.find('#receiver-province').val());
            receiverInfo.receiverCity = $.trim(this.$modalWrap.find('#receiver-city').val());
            receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
            receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
            receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());

            if(this.option.isUpdate){
                receiverInfo.id = this.$modalWrap.find('#receiver-id').val();
            }
            // 表单验证
            if(!receiverInfo.receiverName){
                result.errMsg = 'Please input full name';
            }
            else if(!receiverInfo.receiverProvince){
                result.errMsg = 'Please input state';
            }
            else if(!receiverInfo.receiverCity){
                result.errMsg = 'Please input city';
            }
            else if(!receiverInfo.receiverAddress){
                result.errMsg = 'Please input address';
            }
            else if(!receiverInfo.receiverPhone){
                result.errMsg = 'Please input phone';
            }
            else if(!receiverInfo.receiverZip){
                result.errMsg = 'Please input zipcode';
            }
            //  所有验证都通过
            else {
                result.status =true;
                result.data = receiverInfo;
            }
            return result;
    },
    // 获取select框的选项，输入:array，输出：HTML
    getSelectOption: function(optionArray){
        var html = '<option value="">Please select</option>';
        for (var i = 0, length = optionArray.length; i < length; i++) {
            html += '<option value="'+ optionArray[i] + '">' + optionArray[i] + '</option>';
        }
        return html;
    },
    // 关闭弹窗
    hide: function(){
        this.$modalWrap.empty();
    }
};
module.exports = addressModal;