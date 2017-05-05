/**
 * Created by forest on 16/8/22.
 */

function WorkSelector(options) {

    var workLoadUrl = '/nggirl-web/web/admin/work/listWorks/V1.4.1';

    if (options.workLoadUrl != undefined && options.workLoadUrl != null) {
        workLoadUrl = options.workLoadUrl;
    }

    var id = 'article_editor_work_selector';
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

        $('body').append('<div id="' + id + '">' +
            '<div class="back"><span>返回</span></div>' +
            '<div class="search-btns">' +
            '<input type="text" class="dresserName" placeholder="化妆师姓名">' +
            '<input type="text" class="workId" placeholder="作品编号">' +
            '<label>作品发布时间：</label><input class="startPublishTime" type="text" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})">' +
            ' <label>至 </label><input class="endPublishTime" type="text" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"><br/>' +
            '<label>原价：</label><input type="text" value="" placeholder="不低于" class="startOrigionPrice" /> 至 <input class="endOrigionPrice" type="text" value="" placeholder="不高于" />' +
            '<label>折后价：</label><input class="startDiscountedPrice" type="text" value="" placeholder="不低于" /> 至 <input class="endDiscountedPrice" type="text" value="" placeholder="不高于" /><br/>' +
            '<label>妆束类型：</label>' +
            '<select class="workType">' +
            '<option value="">请选择妆束类型</option>' +
            '<option value="职业妆">职业妆</option>' +
            '<option value="约会妆">约会妆</option>' +
            '<option value="年会妆">年会妆</option>' +
            '<option value="Party妆">Party妆</option>' +
            '<option value="特殊造型">特殊造型</option>' +
            '<option value="VIP妆">VIP妆</option>' +
            '<option value="晚妆">晚妆</option>' +
            '<option value="大片写真">大片写真</option>' +
            '<option value="新娘妆">新娘妆</option>' +
            '<option value="亲子摄影">亲子摄影</option>' +
            '</select>' +
            '<label>审核状态：</label>' +
            '<select class="auditStatus">' +
            '<option value="1" selected>已上线</option>' +
            '<option value="0">审核中</option>' +
            '</select>' +
            '<input class="goodsQueryBtn" type="button" value="搜索" />' +
            '</div>' +
            '<div class="data-show">' +
            '<table cellpadding="0" cellspacing="0">' +
            '<thead>' +
            '<tr>' +
            '<th>作品编号</th><th>发布时间</th><th>化妆师姓名</th><th>联系电话</th>' +
            '<th>作品图片</th><th>妆束名称</th><th>妆束类型</th><th>作品描述</th><th>原价</th><th>折后价格</th><th>折扣信息</th>' +
            '<th>审核状态</th><th>&nbsp;</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody></tbody>' +
            '</table>' +
            '</div>' +
            '<div class="tcdPageCode"></div>' +
            '</div>');

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
            initWorkSelector(1);
        });

        //初始化数据
        initWorkSelector(1);
    };

    //初始化数据
    function initWorkSelector(page) {

        if (page == undefined) {
            page = 1;
        }

        var startPublishTime = '';
        if($('#'+id+' .search-btns input.startPublishTime').val() != undefined
            && $('#'+id+' .search-btns input.startPublishTime').val() != null
            && $.trim($('#'+id+' .search-btns input.startPublishTime').val()).length > 0){
            startPublishTime = $.trim($('#'+id+' .search-btns input.startPublishTime').val()).replace(/-/g,'');
        }
        var endPublishTime = '';
        if($('#'+id+' .search-btns input.endPublishTime').val() != undefined
            && $('#'+id+' .search-btns input.endPublishTime').val() != null
            && $.trim($('#'+id+' .search-btns input.endPublishTime').val()).length > 0){
            endPublishTime = $.trim($('#'+id+' .search-btns input.endPublishTime').val()).replace(/-/g,'');
        }

        //加载数据
        var params = {
            workId: $('#'+id+' .search-btns input.workId').val(),
            dresserName: $('#'+id+' .search-btns input.dresserName').val(),
            phoneNum: '',
            workType: $('#'+id+' .search-btns select.workType').val(),
            auditStatus: $('#'+id+' .search-btns select.auditStatus').val(),
            startOrigionPrice: $('#'+id+' .search-btns input.startOrigionPrice').val(),
            endOrigionPrice: $('#'+id+' .search-btns input.endOrigionPrice').val(),
            startDiscountedPrice: $('#'+id+' .search-btns input.startDiscountedPrice').val(),
            endDiscountedPrice: $('#'+id+' .search-btns input.endDiscountedPrice').val(),
            orderByPublishTime: 2,
            startPublishTime: startPublishTime,
            endPublishTime: endPublishTime,
            page: page,
            num: num
        };

        $.ajax({
            url: workLoadUrl,
            type: 'post',
            dataType: 'json',
            data: params,
            success: function (data) {
                if (data.code == 0) {

                    //填充数据
                    fillData(data.data.pageData);

                    //创建分页
                    $("#" + id + ' .tcdPageCode').createPage({
                        pageCount: parseInt(data.data.totalPageNum),
                        current: parseInt(data.data.currnetPageNum),
                        backFn: initWorkSelector
                    });

                    //选中按钮
                    $('#' + id + ' .data-show table  input.select-btn').unbind();
                    $('#' + id + ' .data-show table  input.select-btn').click(function () {

                        var backdata = new Object();
                        backdata.workId = $(this).parent().siblings('.workId').text();
                        backdata.cover = $(this).parent().siblings('.cover').children('img').attr('src');
                        backdata.workName = $(this).parent().siblings('.workName').text();
                        backdata.cost = $(this).parent().siblings('.cost').text();

                        close();

                        //如果需要回调
                        if (onSelectedCallback != undefined && $.isFunction(onSelectedCallback)) {
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
            var str = '审核中';
            if(list[i].auditStatus == 1){
                str = '已上线';
            }
            $('#' + id + ' tbody').append('<tr><td class="workId">' +
                list[i].workId + '</td><td>' +
                list[i].publishTime + '</td><td>' +
                list[i].dresserName + '</td><td>' +
                list[i].phoneNum + '</td>' +
                '<td class="cover"><img src="' +
                list[i].cover + '"></td>' +
                '<td class="workName">' +
                list[i].workName + '</td><td>' +
                list[i].workType + '</td><td>' +
                list[i].desc + '</td><td class="cost">' +
                list[i].cost + '</td><td>' +
                list[i].discountedCost + '</td><td>' +
                list[i].discountName + '</td><td>' +
                str + '</td>' +
                '<td><input type="button" class="select-btn" value="选中" /></td>' +
                '</tr>');
        }
    }

}
