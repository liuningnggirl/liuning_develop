/**
 * Created by zhanghaiwei on 16/8/10.
 */

function GoodsSelector(options) {

    var goodsLoadUrl = '/nggirl-web/web/admin/comodity/list/2.5.0';

    if (options.goodsLoadUrl != undefined && options.goodsLoadUrl != null) {
        goodsLoadUrl = options.goodsLoadUrl;
    }

    var id = 'article_goods_selector';
    if (options.id != undefined && options.id != null) {
        id = options.id;
    }


    var onSelectedCallback = options.onSelectedCallback;
    var onCancelSelectCallback = options.onCancelSelectCallback;

    var page = 1;
    if (options.page != undefined && options.page != null) {
        page = options.page
    }
    var num = 20;
    if (options.num != undefined && options.num != null) {
        num = options.num;
    }

    var $editor = undefined;
    if(options.editor != undefined){
        $editor = options.editor;
    }

    //关闭商品选择页
    close = function () {
        $('#' + id).remove();
    };


    //开启商品选择页
    this.show = function () {
        close();

        $('body').append('<div id="' + id + '"><div class="back"><span>返回</span></div>' +
            '<div class="search-btns">' +
            '<input type="text" class="goodName" placeholder="商品名称" />' +
            '<input type="text" class="goodsCountry" placeholder="所属国家" />' +
            '<input type="text" class="goodsBrand" placeholder="品牌名" />' +
            '<input type="text" class="goodsClass" placeholder="类别" />' +
            '<input type="button" class="goodsQueryBtn" value="查询" /></div>' +
            '<div class="data-show"><table cellpadding="0" cellspacing="0"><thead>' +
            '<tr><th>商品编号</th><th>商品图</th><th>商品名</th><th>参考价格</th><th>所属国家</th><th>品牌名</th><th>类别</th><th>推荐度</th><th>&nbsp;</th></tr>' +
            '</thead><tbody></tbody></table><div class="tcdPageCode"></div></div></div>');

        //关闭按钮
        $('#' + id + ' .back span').unbind();
        $('#' + id + ' .back span').click(function () {
            close();
            if (onCancelSelectCallback != undefined && $.isFunction(onCancelSelectCallback)) {
                onCancelSelectCallback();
            }
        });

        //查询按钮
        $('#' + id + ' .goodsQueryBtn').unbind();
        $('#' + id + ' .goodsQueryBtn').click(function () {
            //从第一页开始查询
            initGoodsSelector(1);
        });

        //初始化数据
        initGoodsSelector(1);
    };

    //初始化数据
    function initGoodsSelector(page) {

        if(page == undefined){
            page = 1;
        }

        //加载数据
        var params = {
            comodityClass: $('#'+id+' .goodsClass').val(),
            comodityBrand: $('#'+id+' .goodsBrand').val(),
            comodityCountry: $('#'+id+' .goodsCountry').val(),
            comodityName: $('#'+id+' .goodName').val(),
            sortType:0,
            page: page,
            num: num
        };

        $.ajax({
            url: goodsLoadUrl,
            type: 'get',
            dataType: 'json',
            data: params,
            success: function (data) {
                if (data.code == 0) {

                    //填充数据
                    fillData(data.data.pageData);

                    //创建分页
                    $("#" + id + ' .tcdPageCode').createPage({
                        pageCount:parseInt(data.data.totalPageNum),
                        current:parseInt(data.data.currnetPageNum),
                        backFn:initGoodsSelector
                    });

                    //选中按钮
                    $('#' + id + ' .data-show table  input.select-btn').unbind();
                    $('#' + id + ' .data-show table  input.select-btn').click(function () {
                        close();
                        //如果需要回调
                        if (onSelectedCallback != undefined && $.isFunction(onSelectedCallback)) {
                            var backdata = new Object();
                            backdata.comodityId = $(this).parent().siblings('.comodityId').text();
                            backdata.photo = $(this).parent().siblings('.photo').children('img').attr('src');
                            backdata.comodityName = $(this).parent().siblings('.comodityName').text();
                            backdata.refPrice = $(this).parent().siblings('.refPrice').text();
                            backdata.recommendation = Math.round(parseFloat($(this).parent().siblings('.recommendation').text()));

                            onSelectedCallback($editor,backdata);
                        }
                    });


                } else {
                    alert(data.data.error);
                }
            }
        });


    }

    function fillData(list) {
        //清空数据
        $('#' + id + ' tbody').empty();
        //初始化数据
        for (var i = 0; i < list.length; i++) {
            $('#' + id + ' tbody').append('<tr><td class="comodityId">' +
                list[i].comodityId + '</td>' +
                '<td class="photo"><img src="' +
                list[i].photo + '" /> </td><td class="comodityName">' +
                list[i].comodityName + '</td><td class="refPrice">' +
                list[i].refPrice + '</td><td>' +
                list[i].comodityCountry + '</td><td>' +
                list[i].comodityBrand + '</td><td>' +
                list[i].comodityClass + '</td><td class="recommendation">' +
                list[i].recommendation + '</td><td><input type="button" class="select-btn" value="选中" /></td></tr>');
        }
    }
}
