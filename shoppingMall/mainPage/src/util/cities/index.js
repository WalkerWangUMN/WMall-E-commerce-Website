/*
 * @Author: WalkerWang 
 * @Date: 2020-01-18 11:28:34 
 * @Last Modified by: WalkerWang
 * @Last Modified time: 2020-01-18 11:54:20
 */
'use strict'

var _cities = {
    cityInfo: {
        'MN': ['Minneapolis', 'St Paul'],
        'NY': ['New York', 'Long Beach'],
        'CA': ['Los Angeles', 'San Francisco', 'San Diego'],
        'IL': ['Chicago'],
        'FL': ['Miami'],
        'GA': ['Atlanta'],
        'WA': ['Seattle'],
        'MA': ['Boston']
    },
    // 获取所有省份
    getProvinces: function(){
        var provinces =  [];
        for(var item in this.cityInfo){
            provinces.push(item);
        }
        return provinces;
    },
    // 获取某省份所有城市
    getCities: function(provinceName){
        return this.cityInfo[provinceName] || [];
    }
}

module.exports = _cities