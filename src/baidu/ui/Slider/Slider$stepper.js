/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/Slider/Slider$stepper.js
 * author: wangranran
 * version: 1.0.0
 * date: 2011-10-20
 */

///import baidu.ui.Slider;

/**
 * Slider的滑块以由 step 设定的间距值跳跃式滑动
 */

baidu.ui.Slider.register(function(me){
    if(!me.isStep){return;}
	me.addEventListener("onload", function() {
	    me._drag.cancel();
	})
    /**
     * 处理鼠标在滚动条上的按下事件
     * @private
     */
    me._mouseDown = function(e){
        var me = this,
            axis = me._axis[me.layout],
            mousePos = baidu.page.getMousePosition(),
            mainPos = baidu.dom.getPosition(me.getBody()),
            thumb = me.getThumb(),
            target = baidu.event.getTarget(e);
		baidu.event.preventDefault(e, false);
		if (e.button > 1 || me.disabled) { return; } //只支持鼠标左键拖拽; 左键代码: IE为1,W3C为0
        //如果点在了滑块之外，先跳到最近的刻度点
        if(target != thumb && !baidu.dom.contains(thumb, target)){
			me._mouseCurrentPos = me._parseValue(mousePos[axis.mousePos]
					 - mainPos[axis.pos] - thumb[axis.offsetSize] / 2, 'value');
			if ((me._mouseCurrentPos - me.value) > (me.step/2)) {
				me.value += me.step * (Math.round((me._mouseCurrentPos - me.value) / me.step));
				me.update();
				me.dispatchEvent("slideclick");
			} else if ((me._mouseCurrentPos - me.value) < -(me.step/2)) {
				me.value -= me.step * (Math.round((me.value - me._mouseCurrentPos) / me.step));
				me.update();
				me.dispatchEvent("slideclick");
			}
        }
		me._moving = true; //开始模拟拖动
		me.dispatchEvent("slidestart");
    };
    /**
     * 处理鼠标在整个页面上的放开事件
     * @private
     */
    me._mouseUp = function(e){
        var me = this;
		me._moving = false;
		me.dispatchEvent("slidestop");
    };
    /**
     * 处理鼠标在整个页面上的移动事件
     * @private
     */
    me._mouseMove = function(e){
		var me = this,
            axis = me._axis[me.layout],
            mousePos = baidu.page.getMousePosition(),
            mainPos = baidu.dom.getPosition(me.getBody()),
            thumb = me.getThumb(),
            target = baidu.event.getTarget(e);
		baidu.event.preventDefault(e, false);
		if(me._moving == true){
			me._mouseCurrentPos = me._parseValue(mousePos[axis.mousePos]
				 - mainPos[axis.pos] - thumb[axis.offsetSize] / 2, 'value');
			if ((me._mouseCurrentPos - me.value) > (me.step/2)) {
				me.value = me.value + me.step;
			    me.update();
			} else if ((me._mouseCurrentPos - me.value) < -(me.step/2)) {
			    me.value = me.value - me.step;
			    me.update();
			}
			me.dispatchEvent("slide");
		}
    };
    //填加鼠标事件
	me.on(document, 'onmousemove', function(e){ me._mouseMove.call(me, e); });
	me.on(document, 'onmouseup', function(e){ me._mouseUp.call(me, e); });
});

baidu.ui.Slider.extend({
	isStep: true,
	step: 10,
	_moving: false,
	_mouseCurrentPos: 0
});