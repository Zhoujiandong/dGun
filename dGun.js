function dGun(obj = {}) {
    var id = obj.id;
    var time = obj.time ? parseInt(obj.time) : 3000;
    time = time > 300 ? time : 1000;
    var _width = document.querySelector("#"+id).offsetWidth;  //获取轮播图宽度
    var _index = 0;                                             //当前是第几个轮播 从-1开始
    var inner = document.querySelector("#"+id+" .inner");               //获取轮播内容外壳（很长的那个）
    var items = document.querySelectorAll("#"+id+" .item");             //获取轮播元素

    // 将第一个元素复制到最后，将最后的元素复制到开头
    var firstItem = items[0];
    var lastItem = items[items.length-1];
    inner.insertBefore(lastItem.cloneNode(true),firstItem);
    inner.appendChild(firstItem.cloneNode(true));
    inner.style.transform = "translateX(-"+_width+"px)";
    // 生成底部小圆点
    var imgLength = document.querySelector("#"+id+" .inner").children.length-2;
    var makeCir = '<li class="select"></li>';
    for (var i = 0; i < imgLength - 1; i++) {
        makeCir += '<li></li>';
    }
    document.querySelector("#"+id+" .num" ).innerHTML = makeCir;
    var newItems = document.querySelectorAll("#"+id+" .item");
    for(var i = 0; i<newItems.length;i++){
        newItems[i].style.width = _width+"px";
    }

    //首尾无缝连接
    function play(index) {
        setTimeout(function () {
            inner.style.transition = 'all 0s';
            if (index == -1) {
                var _number = -imgLength * _width;
                inner.style.transform = 'translateX(' + _number + 'px)';
                _index = imgLength - 1;
            } else if (index == imgLength) {
                inner.style.transform = 'translateX(-' + _width + 'px)';
                _index = 0;
            }
        }, 250);
    }

    //滑动部分
    var startX = 0, changedX = 0, originX = 0, basKey = 0;

    // 轮播方法
    function Broadcast() {
        var that = this;
        this.box = document.querySelector("#"+id+" .inner");
        this.box.addEventListener("touchstart", function (ev) {
            that.fnStart(ev);
        })
    }

    // 轮播手指按下
    Broadcast.prototype.fnStart = function (ev) {
        clearInterval(autoPlay);          //手指按下的时候清除定时轮播
        if (!basKey) {
            var that = this;
            startX = ev.targetTouches[0].clientX;
            var tempArr = window.getComputedStyle(inner).transform.split(",");
            //获取当前偏移量
            if (tempArr.length > 2) {
                originX = parseInt(tempArr[tempArr.length - 2]) || 0;
            }
            this.box.ontouchmove = function (ev) {
                that.fnMove(ev)
            }
            this.box.ontouchend = function (ev) {
                that.fnEnd(ev)
            }
        }
    };
    // 轮播手指移动
    Broadcast.prototype.fnMove = function (ev) {
        ev.preventDefault();
        changedX = ev.touches[0].clientX - startX;
        var changNum = (originX + changedX);
        this.box.style.cssText = "transform: translateX(" + changNum + "px);";
    };
    // 轮播手指抬起
    Broadcast.prototype.fnEnd = function (ev) {
        // 移除底部按钮样式
        document.querySelector("#"+id+" .select").classList.remove("select");
        basKey = 1;
        setTimeout(function () {
            basKey = 0;
        }, 300)
        if (changedX >= 100) {                   //向某一方向滑动
            var _end = (originX + _width);
            this.box.style.cssText = "transform: translateX(" + _end + "px);transition:all .3s";
            _index--;
            if (_index == -1) {                //滑动到第一个了，为了实现无缝隙，滚到最后去
                document.querySelectorAll("#"+id+" .num>li")[imgLength - 1].classList.add("select");
                play(-1);
            }
        } else if (changedX < -100) {         //向负的某一方向滑动
            var _end = (originX - _width);
            this.box.style.cssText = "transform: translateX(" + _end + "px);transition:all .3s";
            _index++;
            if (_index == imgLength) {       //滑到最后一个了，为了实现无缝隙，滚到前面去
                play(imgLength);
                document.querySelectorAll("#"+id+" .num>li")[0].classList.add("select");
            }
        } else {                          //滑动距离太短，没吃饭不用管
            this.box.style.cssText = "transform: translateX(" + originX + "px);transition:all .3s";
        }
        // 完成一次滑动初始化值
        startX = 0;
        changedX = 0;
        originX = 0;
        if (_index != -1 && _index != imgLength) {
            document.querySelectorAll("#"+id+" .num>li")[_index].classList.add("select");
        }
        this.box.ontouchmove = null;            //清除事件
        this.box.ontouchend = null;             //清除绑定事件
        autoPlay = setInterval(lunbo, time)      //开启轮播
    }
    // 自动轮播函数
    function lunbo(){
        document.querySelector("#"+id+" .select").classList.remove("select");
        var tempArr = window.getComputedStyle(inner).transform.split(",");
        if (tempArr.length > 2) {
            originX = parseInt(tempArr[tempArr.length - 2]) || 0;
        }
        var _end = (originX - _width);
        inner.style.cssText = "transform: translateX(" + _end + "px);transition:all .3s";
        _index++;
        if (_index != -1 && _index != imgLength) {
            document.querySelectorAll("#"+id+" .num>li")[_index].classList.add("select");
        }else if(_index == -1 ){
            document.querySelectorAll("#"+id+" .num>li")[imgLength - 1].classList.add("select");
        } else if (_index == imgLength) {
            play(imgLength);
            document.querySelectorAll("#"+id+" .num>li")[0].classList.add("select");
        }
    }
    // 初始化轮播
    var autoPlay = setInterval(lunbo,time);       //开启轮播
    var _Broadcast = new Broadcast();             //实例触摸
}