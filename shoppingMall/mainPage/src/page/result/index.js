/*
 * @Author: WalkerWang 
 * @Date: 2020-01-16 01:06:30 
 * @Last Modified by: WalkerWang
 * @Last Modified time: 2020-01-19 10:21:26
 */
'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');
$(function(){
    var type = _mm.getUrlParam('type') || 'default',
        $elemnt = $('.' + type + '-success');
    if(type === 'payment'){
        var orderNumber = _mm.getUrlParam('orderNumber'),
            $orderNumber = $elemnt.find('.order-number');
        $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber);
    }
    // 显示对应的提示元素
    $elemnt.show();
})