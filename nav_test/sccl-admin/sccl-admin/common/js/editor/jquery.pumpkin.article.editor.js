// 创建一个闭包
;
(function ($) {


    $.fn.ArticleEditor = function (options) {
        var $parent = $(this);
        //全局变量
        var opts = $.extend({}, $.fn.ArticleEditor.defaults, options);

        var $editor = $parent.children('.article_editor');
        //编辑器对象
        if (opts.create == true) {
            $editor = createArticleEditor($parent, opts);
        }
        return $editor;
    };

    // 插件的defaults
    $.fn.ArticleEditor.defaults = {
        create: false,//默认不再创建插件
        elements: ['paragraph', 'title', 'note', 'image', 'goods', 'work','downloadImages', 'preview', 'fullScreen'],//编辑器中所包含该的元素,以逗号分隔
        shouldKeepImage: function (uploadedUrl, width, height) {
            return true;
        },
        data: [{type: 2, content: ''}],//初始化数据
        defaultData: [{type: 2, content: ''}]//编辑器为空时,默认的元素
    };

    //初始化编辑器数据
    $.fn.initArticleEditor = function (data) {
        var $parent = $(this);
        var $editor = $parent.children('.article_editor');
        return initArticleEditor($editor, data);
    };

    //初始化编辑器
    function initArticleEditor($editor, data) {
        $editor.empty();
        for (var i = 0; i < data.length; i++) {
            if (data[i].type == 1) {
                appendEditorTitle($editor,data[i].content)
            } else if (data[i].type == 2) {
                appendEditorParagraph($editor,data[i].content);
            } else if (data[i].type == 3) {
                appendEditorImage($editor,data[i].content, 'true', data[i].extend);
            } else if (data[i].type == 4) {
                appendEditorNote($editor,data[i].content)
            } else if (data[i].type == 5) {
                appendEditorGoods($editor,data[i].comodity.comodityId, data[i].comodity.photo, data[i].comodity.comodityName,
                    data[i].comodity.refPrice, data[i].comodity.recommendation);
            } else if (data[i].type == 6) {
                appendEditorWork($editor,data[i].work.workId, data[i].work.workName, data[i].work.cover, data[i].work.cost);
            }
        }
        return $editor;
    }

    function getEditorOriginalData($children) {
        var data = new Array();
        for (var i = 0; i < $children.length; i++) {
            var $child = $($children[i]);
            var elem = new Object();
            if ($child.is('p.title')) {
                elem.type = 1;
                elem.content = clearReturnWords($child.text());//去除换行符
                elem.extend = '';
                elem.descrip = '';
               /* if (elem.content.length > 600) {
                    return '长度过长,已超过600个字!' + elem.content;
                }*/
            } else if ($child.is('p.paragraph')) {
                elem.type = 2;
                elem.content = clearReturnWords($child.text());//去除换行符
                elem.extend = '';
                elem.descrip = '';
               /* if (elem.content.length > 600) {
                    return '长度过长,已超过600个字!' + elem.content;
                }*/
            } else if ($child.is('img.image')) {
                if ($child.attr('src') == null || $child.attr('src') == undefined || $.trim($child.attr('src')).length == 0) {
                    return '存在上传失败的图片!';
                }
                if ($child.attr('isUploaded') == 'true') {//已经上传到我们的服务器
                    elem.type = 3;
                    elem.content = $child.attr('src');
                    elem.extend = $child.attr('width_height');
                    elem.descrip = '';
                } else {
                    return '存在图片未上传!';
                }

            } else if ($child.is('p.note')) {
                elem.type = 4;
                elem.content = $child.text();
                elem.extend = '';
                elem.descrip = '';
            } else if ($child.is('div.goodsComodity')) {
                elem.type = 5;
                elem.content = $child.children().attr('currentid');
                elem.extend = '';
                elem.descrip = '';
            } else if ($child.is('div.work')) {
                elem.type = 6;
                elem.content = $child.attr('workId');
                elem.extend = '';
                elem.descrip = '';
            }

            data.push(elem);
        }
        return data;
    }

    //获取编辑器中的数据
    $.fn.getArticleEditorData = function () {
        var $parent = $(this);
        var $editor = $parent.children('.article_editor');
        var data = getEditorOriginalData($editor.children());
        return data;
    };

    //创建编辑器对象
    $.fn.createArticleEditor = function (options) {
        var $parent = $(this);
        //全局变量
        var opts = $.extend({}, $.fn.ArticleEditor.defaults, options);
        var $editor = createArticleEditor($parent, opts);
        return $editor;
    };

    //初始化页面
    function createArticleEditor($parent, opts) {
        //清空原有的编辑器组件
        $parent.empty();
        //搭建编辑器组件
        $parent.append('<div class="articlebox"></div><div class="article_editor"  contenteditable="true"></div>');

        //添加功能按钮
        if (needHasEditorTitle(opts.elements)) {
            $parent.children('.articlebox').append('<input type="button" class="btn-title" value="标题"/>');
        }
        if (needHasEditorParagraph(opts.elements)) {
            $parent.children('.articlebox').append('<input type="button" class="btn-paragraph" value="段落"/>');
        }
        if (needHasEditorImage(opts.elements)) {
            $parent.children('.articlebox').append(' <input type="button" class="btn-image" value="图片"/>');
        }
        if (needHasEditorNote(opts.elements)) {
            $parent.children('.articlebox').append('<input type="button" class="btn-note" value="备注"/>');
        }
        if (needHasEditorGoods(opts.elements)) {
            $parent.children('.articlebox').append('<input type="button" class="btn-goods" value="商品">');
        }
        if (needHasEditorWork(opts.elements)) {
            $parent.children('.articlebox').append('<input type="button" class="btn-work" value="作品">');
        }
        if(needHasDownloadImages(opts.elements)){
            $parent.children('.articlebox').append('<input type="button" class="btn-downloadImages" value="导出图片">');
        }
        if (needHasEditorPreview(opts.elements)) {
            //添加预览按钮
            $parent.children('.articlebox').append('<input type="button" class="btn-preview" value="预览">');
        }
        if (needHasEditorFullScreen(opts.elements)) {
            //添加全屏按钮
            $parent.children('.articlebox').append('<input type="button" class="btn-fullScreen" value="全屏">');
        }


        //获取编辑器对象
        var $editor = $parent.children('.article_editor');
        //初始化内容
        if (opts.data == undefined || opts.data.length == 0) {
            if (opts.defaultData != undefined && opts.defaultData.length > 0) {
                initArticleEditor($editor, opts.defaultData);
            }
        } else {
            initArticleEditor($editor, opts.data);
        }

        //选中第一个元素
        setFocuseNode($editor,'');

        //解除所有的事件绑定
        $editor.unbind();
        $editor.die();

        //点击或者获取焦点后,记录当前焦点所在节点位置
        $editor.on('focus keyup mouseup', onFocusRecordFocusNode);
        $editor.on('focus keyup mouseup', 'img', onClickImage);
        $parent.find('div.goodsComodity').live('click', onClickGoods);
        $parent.find('div.work').live('click', onClickWork);

        //粘贴事件
        $editor.bind('paste', onPasteEditor);

        //绑定事件
        $parent.find('.articlebox .btn-title').click(clickBtnTitle);
        $parent.find('.articlebox .btn-paragraph').click(clickBtnParagraph);
        $parent.find('.articlebox .btn-image').click(clickBtnImage);
        $parent.find('.articlebox .btn-note').click(clickBtnNote);
        $parent.find('.articlebox .btn-goods').click(clickBtnGoods);
        $parent.find('.articlebox .btn-work').click(clickBtnWork);
        $parent.find('.articlebox .btn-downloadImages').click(clickBtnDownloadImages);

        //全屏
        $parent.find('.articlebox .btn-fullScreen').click(onClickFullScreen);

        //预览
        $parent.find(".articlebox .btn-preview").click(onClickPreview);

        //添加判断是否需要保留图片的函数
        $editor.data('shouldKeepImage', opts.shouldKeepImage);
        //添加编辑器默认元素集
        $editor.data('defaultData', opts.defaultData);

        //清理编辑器中的不和规则的元素
        cleanEditor($editor);

        //改变顶部按钮状态
        changeBtnStatus($editor);

        return $editor;
    }


    //粘贴事件,粘贴后,清理编辑器中的不规则元素
    function onPasteEditor() {
        var $editor = $(this);
        //0.1秒后清理
        setTimeout(function(){
            cleanEditor($editor);
        }, 100);
    }


    //点击预览
    function onClickPreview() {
        var $editor = $(this).parent().siblings('.article_editor');
        $('.article_preview').remove();
        $('body').append('<div class="article_preview"><div class="preEffect" ><select class="selectSize">' +
            '<option value ="414_736">iPhone 6Plus(宽414px,高736px)</option>' +
            '<option value ="375_667">iPhone 6(宽375px,高667px)</option>' +
            '<option value="320_568">iPhone 5(宽320px,高568px)</option>' +
            '<option value="360_640">Galaxy S5(宽360px,高640px)</option>' +
            '</select><div class="exit-preview">点击退出预览</div>' +
            '<div class="preResult"></div></div></div>');

        $('.preResult').html($editor.html());
        $('.preResult p').attr('contenteditable', false);

        $('body').addClass('no-scroll');

        //改变预览窗口大小
        changePreviewSize();

        //选择不同尺寸预览
        $('.article_preview .selectSize').change(changePreviewSize);

        //隐藏预览
        $('.article_preview .exit-preview').unbind();
        $('.article_preview .exit-preview').click('click', function () {
            $('body').removeClass('no-scroll');
            $('.article_preview').remove();
        });
    }

    //改变预览窗口大小
    function changePreviewSize() {
        var width_height = $('.selectSize').val();
        var width = width_height.substring(0, width_height.indexOf('_'));
        var height = width_height.substring(width_height.indexOf('_') + 1, width_height.length);

        $('.preEffect').css({
            'margin-left': (0 - width / 2) + 'px',
            'width': width + 'px',
            'height': height + 'px'
        });

        $('.article_preview .preResult img').css({
            'max-width': width + 'px'
        });
    }

    //点击全屏
    function onClickFullScreen() {
        var $parent = $(this).parent().parent();
        //当前处于全屏状态
        if ($parent.hasClass('fullscreen')) {
            $parent.removeClass('fullscreen');
            $('.btn-fullScreen').val('全屏');
        }
        //非全屏状态
        else {
            $parent.addClass('fullscreen');
            $('.btn-fullScreen').val('退出');
            $('.editor_content.fullscreen,.goods_box.fullscreen').unbind();
            $('.editor_content.fullscreen,.goods_box.fullscreen').scroll(function () {
                if ($(this).scrollTop() > $('.articlebox').height() && !$('.articlebox').hasClass('articlebox_scroll')) {
                    $('.articlebox').addClass('articlebox_scroll');
                }
                if ($(this).scrollTop() <= $('.articlebox').height()) {
                    $('.articlebox').removeClass('articlebox_scroll');
                }
            });
        }

    }


    //点击图片
    function onClickImage() {
        var $editor = $(this).parents('.article_editor');
        $(this).blur();

        //点击商品图片
        if (nodeIsGoodsImg(this)) {
            var goodIndex = $editor.find('div.goodsComodity').index($(this).parent().parent().parent());
            setFocuseNode($editor,'div.goodsComodity:eq(' + goodIndex + ')');
        } else if (nodeIsWorkImg(this)) {
            var workIndex = $editor.find('div.work').index($(this).parent().parent());
            setFocuseNode($editor,'div.work:eq(' + workIndex + ')');
        }
        //点击了正规的图片
        else {
            //记录点击的图片
            var index = $editor.find('img').index(this);
            $editor.attr('index', index);
            setFocuseNode($editor,'img:eq(' + index + ')');

            //图片上传
            $.showImageUploadBox(function (data) {
                if (data.code == 0 && data.data.width > 0 && data.data.height) {
                    //先判断是否应该保留图片,默认保留
                    var shouldKeepImage = $editor.data('shouldKeepImage');
                    if ($.isFunction(shouldKeepImage) && shouldKeepImage(data.data.url, data.data.width, data.data.height)) {
                        replaceEditorImage(getFocuseNode($editor), data.data.url, 'true', data.data.width + '_' + data.data.height);
                    } else if (!$.isFunction(shouldKeepImage)) {
                        replaceEditorImage(getFocuseNode($editor), data.data.url, 'true', data.data.width + '_' + data.data.height);
                    }
                } else {
                    alert('上传图片失败!');
                }
            });
        }
    }

    //点击商品
    function onClickGoods() {
        var $editor = $(this).parents('.article_editor');
        var str = 'div.goodsComodity:eq(' + $editor.find('div.goodsComodity').index(this) + ')';
        setFocuseNode($editor,str);
        changeBtnStatus($editor);
    }

    //点击作品
    function onClickWork() {
        var $editor = $(this).parents('.article_editor');
        var str = 'div.work:eq(' + $editor.find('div.work').index(this) + ')';
        setFocuseNode($editor,str);
        changeBtnStatus($editor);
    }

//改变各个按钮状态
    function changeBtnStatus($editor) {
        var $parent = $editor.parent();
        $parent.find('.articlebox input').removeClass('pointelement');
        var node = getFocuseNode($editor);
        if (node != undefined) {
            if (isEditorTitle(node)) {
                $parent.find('.btn-title').addClass('pointelement');
            } else if (isEditorParagraph(node)) {
                $parent.find('.btn-paragraph').addClass('pointelement');
            } else if (isEditorImage(node)) {
                $parent.find('.btn-image').addClass('pointelement');
            } else if (isEditorNote(node)) {
                $parent.find('.btn-note').addClass('pointelement');
            } else if (isEditorGoods(node)) {
                $parent.find('.btn-goods').addClass('pointelement');
            } else if (isEditorWork(node)) {
                $parent.find('.btn-work').addClass('pointelement');
            }
        }
    }

//提前判断是否需要清理编辑器
    function isNeedClean($editor) {
        var children = $editor.children();
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            //直接子节点都是标准的编辑器节点
            if (!isEditorNormalChild(node)) {
                return true;
            }
            //p标签下没有子节点
            if (isEditorTitle(node)
                || isEditorParagraph(node)
                || isEditorNote(node)) {
                if (nodeHasChildren(node) && !childrenAreBr(node)) {
                    return true;
                }
            }
        }
        return false;
    }

//所有子节点都是br元素
    function childrenAreBr(node) {
        return $(node).children().length == $(node).children('br').length;
    }

    //清理编辑器
    function cleanEditor($editor) {
        //不需要清理就不清理
        if (!isNeedClean($editor)) {
            return;
        }
        var children = $editor.children();
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            //如果不是标准元素
            if (!isEditorNormalChild(node)) {
                //如果该元素的子元素中不存在标准元素
                if(!hasEditorChild(node)){
                    $(node).replaceWith(getRangedHtml(node))
                }
                //如果该元素的子元素中存在标准元素
                else{
                    var nodeChildren = $(node).children();
                    var nodestr = '';
                    for(var n=0;n<nodeChildren.length;n++){
                        var nchild = nodeChildren[n];
                        if(isEditorNormalChild(nchild)){
                            nodestr += $(nchild).context.outerHTML;
                        }else{
                            nodestr += getRangedHtml(nchild);
                        }
                    }
                    $(node).replaceWith(nodestr)
                }
            }
            //该元素是标准元素
            else{
                //p标签下没有子节点
                if (isEditorTitle(node)
                    || isEditorParagraph(node)
                    || isEditorNote(node)) {
                    if (nodeHasChildren(node) && !childrenAreBr(node)) {
                        $(node).replaceWith(getRangedHtml(node))
                    }
                }
            }

        }
    }


    //是否有编辑器子元素
    function hasEditorChild(node){
        var $children = $(node).children();
        //没有子元素
        if($children == undefined || $children.length <= 0){
            return false;
        }
        //本身是编辑器子元素
        if(isEditorNormalChild(node)){
            return false;
        }
        //查找编辑器子元素
        if($(node).find('p.title,p.paragraph,p.note,img.image,div.goodsComodity,div.work').length > 0){
            return true;
        }else{
            return false;
        }

    }

    //是否是编辑器正规的子元素
    function isEditorNormalChild(child) {
        if (isEditorImage(child) || isEditorTitle(child)
            || isEditorParagraph(child) || isEditorNote(child)
            || isEditorGoods(child)
            || isEditorWork(child)) {
            return true;
        }
        return false;
    }


    function getEditorTitleHtml(text) {
        return '<p class="title" contenteditable="true">' + text + '</p>';
    }

    function getEditorParagraphHtml(text) {
        return '<p class="paragraph" contenteditable="true">' + text + '</p>';
    }

    function getEditorNoteHtml(text) {
        return '<p class="note" contenteditable="true">' + text + '</p>';
    }

    function getEditorImageHtml(src, isUploaded, width_height) {
        if (isUploaded == undefined || isUploaded == null) {
            isUploaded = '';
        }
        if (width_height == undefined || width_height == null) {
            width_height = '';
        }
        return '<img class="image" src="' + src + '" isUploaded="' + isUploaded + '" width_height="' + width_height + '"   />';
    }


    function getEditorGoodsHtml(comodityId, photo, comodityName, refPrice, recommendation) {
        recommendation = Math.round(parseFloat(recommendation));
        var recommendations = '';
        for (var i = 0; i < 5; i++) {
            if (i < parseInt(recommendation / 2)) {

                recommendations += '<img src="../common/images/Star1.png" class="xingXing">'
            } else if (recommendation % 2 == 1 && parseInt(recommendation / 2) == i) {
                recommendations += '<img src="../common/images/Star3.png" class="xingXing">'
            } else {
                recommendations += '<img src="../common/images/Star2.png" class="xingXing">'
            }
        }
        ;
        return '<div class="goodsComodity" contentEditable="false"><div class="postShop postShopa goods clearfix" currentId="' +
            comodityId + '"><div class="shopLeft goods"><img src="' +
            photo + '" class="goodsPhoto goods"></div><div class="shopCenter goods"><p class="goodsName goods">' +
            comodityName + '</p><p class="productprize goods">参考价：<span>¥ <b class="goodsPrize goods">' +
            refPrice + '</b></span></p><p class="recommendation">推荐度：'
            + recommendations + '</p></div><div class="shopRight goods"><p class="zhongcao zhongcao1 goods">长草</p><p class="zhongcaonum goods"><span>0</span>人已采集</p></div></div></div>';
    }

    function getEditorWorkHtml(workId, workName, cover, cost) {
        return '<div class="work clearfix" workId="' + workId + '" contentEditable="false" >' +
            '<div class="work-cover"><image src="' + cover + '" /></div>' +
            '<div class="work-detail">' +
            '<div class="workName">' + workName + '</div>' +
            '<div class="cost">￥' + cost + '</div>' +
            '</div><div class="workCollection"><p class="collection">收藏</p><p class="zhongcaonum"><span>0</span>人已收藏</p></div>' +
            '</div>';
    }


    function nodeIsImg(node) {
        if (node == null || node == undefined || $(node).length == 0) {
            return false;
        }
        return $(node).is('img');
    }

    //图片是商品图片
    function nodeIsGoodsImg(node) {
        if (!$(node).is('img')) {
            return false;
        }

        //商品封面
        if ($(node).parent() != undefined
            && $(node).parent().parent() != undefined
            && $(node).parent().parent().parent() != undefined
            && $(node).parent().parent().parent().is('.article_editor  div.goodsComodity')) {
            return true;
        }

        //商品推荐度
        if ($(node).is('.xingXing')
            && $(node).parent() != undefined
            && $(node).parent().parent() != undefined
            && $(node).parent().parent().parent() != undefined
            && $(node).parent().parent().parent().parent().is('.article_editor  div.goodsComodity')) {
            return true;
        }
        return false;
    }

    function nodeIsWorkImg(node) {
        if (!$(node).is('img')) {
            return false;
        }

        if ($(node).parent().is('.work-cover')
            && $(node).parent().parent().is('div.work')) {
            return true;
        }
        return false;
    }


    function nodeIsHead(node) {
        if (node == null || node == undefined || $(node).length == 0) {
            return false;
        }
        return $(node).is('h1,h2,h3,h4,h5');
    }


    function cleanEditorText($editor) {
        $editor.contents().filter(function () {
            return this.nodeType === 3;
        }).remove();
    }


    //该节点是否存在子节点
    function nodeHasChildren(node) {
        return $(node).children().length > 0;
    }

    //上传粘贴的网络图片
    function uploadWebImage(imgOldUrl) {
        var subUrl = imgOldUrl;
        //微信图片域名
        var regWeiXin = new RegExp('^http:\\/\\/mmbiz.qpic.cn.*');
        if (regWeiXin.test(imgOldUrl) && imgOldUrl.indexOf('?') > -1) {
            subUrl = imgOldUrl.substring(0,imgOldUrl.lastIndexOf('?'));
        }
        /*if (imgOldUrl.indexOf('?') >= 0) {
            subUrl = imgOldUrl.substr(0, imgOldUrl.indexOf('?'));
        }*/
        $.ajax({
            url: 'https://photos.nggirl.com.cn/uploadserver/app/image/uploads/saveWebImage/3.0.0',
            type: 'post',
            dataType: 'json',
            data: {webImageUrl: subUrl},
            success: function (data) {
                if (data.code == 0 && data.data.width > 0 && data.data.height > 0) {
                    var url = data.data.url;
                    var selector = "img[src='" + imgOldUrl + "']";
                    var width_height = data.data.width + '_' + data.data.height;

                    var $editor = $(selector).parents('.article_editor');
                    //先判断是否应该保留图片,默认保留
                    var shouldKeepImage = $editor.data('shouldKeepImage');
                    if ($.isFunction(shouldKeepImage) && shouldKeepImage(data.data.url, data.data.width, data.data.height)) {
                        replaceEditorImage($(selector)[0], url, 'true', width_height);
                    } else if (!$.isFunction(shouldKeepImage)) {
                        replaceEditorImage($(selector)[0], url, 'true', width_height);
                    }
                }
                else {
                    alert('上传图片失败,原图:' + imgOldUrl);
                }
            }
        });
    }

    //上传本地路径下图片
    function uploadLocalImage() {
        var localUrl = $('.file_web_image').val();
        $.ajax({
            url: 'https://photos.nggirl.com.cn/uploadserver/app/image/uploads/3.0.0',
            type: 'post',
            dataType: 'json',
            data: {file: localUrl},
            success: function (data) {
                if (data.code == 0 && data.data.width > 0 && data.data.height > 0) {
                    var index = $('.article_editor').attr('index');
                    if (index != null && index != undefined && parseInt(index) >= 0) {
                        replaceEditorImage($('.article_editor  img:eq(' + index + ')')[0], data.data.url, 'true', data.data.width + '_' + data.data.height);
                    } else {
                        replaceEditorImage(getFocuseNode($editor), data.data.url, 'true', data.data.width + '_' + data.data.height);
                    }
                    $('.article_image_edit').hide();
                    $('.article_editor').attr('index', '-1');
                } else {
                    alert('上传图片失败');
                }
            }
        });
    }


    //整理不规范的元素
    function getRangedHtml(node) {
        //如果当前节点是h节点,就直接转换为标题
        if (nodeIsHead(node)) {
            return getEditorTitleHtml(htmlToText($(node).html()));
        }

        //如果当前节点是img,并且不是商品图片,直接转换图片
        if ((nodeIsImg(node) || isEditorImage(node) //是图片
                && !nodeIsGoodsImg(node) //并且不是商品图片
                && !nodeIsWorkImg(node)
            )) {
            //取得图片的url，并上传到自己的服务器
            if ($(node).attr('isUploaded') != 'true') {
                var url = $(node).attr('src');
                uploadWebImage(url);
            }
            return getEditorImageHtml($(node).attr('src'), $(node).attr('isUploaded'), $(node).attr('width_height'));
        }

        //单一节点,没有子节点
        if (!nodeHasChildren(node)) {
            if (isEditorTitle(node)) {
                return getEditorTitleHtml(htmlToText($(node).html()));
            } else if (isEditorParagraph(node)) {
                return getEditorParagraphHtml(htmlToText($(node).html()));
            } else if (isEditorNote(node)) {
                return getEditorNoteHtml(htmlToText($(node).html()));
            }
            //不是编辑器标准节点,就转换为段落
            else {
                return getEditorParagraphHtml(htmlToText($(node).html()));
            }
        } else {
            //如果是编辑器节点中的商品,直接返回
            if (isEditorGoods(node)) {
                return $(node).html();
            } else if (isEditorWork(node)) {
                return $(node).html();
            }
            //找不到特殊子节点,就返回段落
            if ($(node).find('img,h1,h2,h3,h4,h5,p.title,p.paragraph,p.note').length == 0) {
                return getEditorParagraphHtml(htmlToText($(node).html()));
            }
            var children = $(node).children();
            var str = '';
            for (var i = 0; i < children.length; i++) {
                str += getRangedHtml(children[i]);
            }
            return str;
        }
    }

    function clickBtnTitle() {
        var $editor = $(this).parent().siblings('.article_editor');
        //编辑器内无任何元素
        if (isEditorEmpty($editor)) {
            appendEditorTitle($editor,'');
            $editor.find('p.title:last').focus();
            setFocuseNode($editor,'p.title:last');
        } else {
            //当前焦点不在任何节点上
            if (getFocuseNode($editor) == undefined) {
                appendEditorTitle($editor,'');
                $editor.find('p.title:last').focus();
                setFocuseNode($editor,'p.title:last');
            }
            else {
                var focuseNode = getFocuseNode($editor);
                //当前节点是标准节点
                if (isEditorNormalChild(focuseNode)) {

                    if ((nodeIsImg(focuseNode) || isEditorImage(focuseNode)) && !nodeIsGoodsImg(focuseNode) && !nodeIsWorkImg(focuseNode)) {
                        $(getEditorTitleHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'img:eq(' + $editor.find('img').index(focuseNode) + ') + p.title');
                    } else if (isEditorGoods(focuseNode)) {
                        $(getEditorTitleHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'div.goodsComodity:eq(' + $editor.find('div.goodsComodity').index(focuseNode) + ') + p.title');
                    } else if (isEditorWork(focuseNode)) {
                        $(getEditorTitleHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'div.work:eq(' + $editor.find('div.work').index(focuseNode) + ') + p.title');
                    }
                    else if (isEditorTitle(focuseNode)) {

                    }
                    //当前节点不是图片/商品/标题
                    else {
                        var index = $editor.find('p').index(focuseNode);
                        var str = htmlToText($(focuseNode).html());
                        replaceEditorTitle($editor.find('p:eq(' + index + ')')[0], str);
                        setFocuseNode($editor,'p:eq(' + index + ')');
                        $editor.find('p:eq(' + index + ')').focus();
                    }
                }
                //当前节点不是标准节点
                else {
                    cleanEditor($editor);
                }
            }
        }
        changeBtnStatus($editor);
    }

    function setFocuseNode($editor,attr) {
        $editor.attr('data-focus-node', attr);
    }

    //获取焦点元素
    function getFocuseNode($editor) {
        var attr = $editor.attr('data-focus-node');
        if (attr == null || attr == undefined || $.trim(attr).length == 0) {
            return undefined;
        }
        var fn = $editor.find(attr);
        if (fn.length == 0) {
            return undefined;
        }
        return fn[0];
    }

    function clickBtnParagraph() {
        var $editor = $(this).parent().siblings('.article_editor');
        //编辑器内无任何元素
        if (isEditorEmpty($editor)) {
            appendEditorParagraph($editor,'');
            $editor.find('p.paragraph:last').focus();
            setFocuseNode($editor,'p.paragraph:last');
        } else {
            //当前焦点不在任何节点上
            if (getFocuseNode($editor) == undefined) {
                appendEditorParagraph($editor,'');
                setFocuseNode($editor,'p.paragraph:last');
                $editor.find('p.paragraph:last').focus();
            }
            else {
                var focuseNode = getFocuseNode($editor);
                //当前节点是标准节点
                if (isEditorNormalChild(focuseNode)) {
                    if ((nodeIsImg(focuseNode) || isEditorImage(focuseNode)) && !nodeIsGoodsImg(focuseNode) && !nodeIsWorkImg(focuseNode)) {
                        $(getEditorParagraphHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'img:eq(' + $editor.find('img').index(focuseNode) + ') + p.paragraph');
                    } else if (isEditorGoods(focuseNode)) {
                        $(getEditorParagraphHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'div.goodsComodity:eq(' + $editor.find('div.goodsComodity').index(focuseNode) + ') + p.paragraph');
                    } else if (isEditorWork(focuseNode)) {
                        $(getEditorParagraphHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'div.work:eq(' + $editor.find('div.work').index(focuseNode) + ') + p.paragraph');
                    }
                    else if (isEditorParagraph(focuseNode)) {

                    }
                    //当前节点不是图片和段落
                    else {
                        var index = $editor.find('p').index(focuseNode);
                        var str = htmlToText($(focuseNode).html());
                        replaceEditorParagraph($editor.find('p:eq(' + index + ')')[0], str);
                        setFocuseNode($editor,'p:eq(' + index + ')');
                        $editor.find('p:eq(' + index + ')').focus();
                    }
                }
                //当前节点不是标准节点
                else {
                    cleanEditor($editor);
                }
            }
        }
        changeBtnStatus($editor);
    }

    function clickBtnImage() {
        var $editor = $(this).parent().siblings('.article_editor');
        $.showImageUploadBox(function (data) {
            if (data.code == 0 && data.data.width > 0 && data.data.height) {
                //先判断是否应该保留图片,默认保留
                var shouldKeepImage = $editor.data('shouldKeepImage');
                if (!$.isFunction(shouldKeepImage)
                    || ($.isFunction(shouldKeepImage) && shouldKeepImage(data.data.url, data.data.width, data.data.height))) {
                    if (getFocuseNode($editor) == undefined) {
                        appendEditorImage($editor,data.data.url, 'true', data.data.width + '_' + data.data.height);
                    } else if ($(getFocuseNode($editor)).html().length == 0) {
                        replaceEditorImage(getFocuseNode($editor), data.data.url, 'true', data.data.width + '_' + data.data.height);
                    } else {
                        $(getEditorImageHtml(data.data.url, 'true', data.data.width + '_' + data.data.height)).insertAfter(getFocuseNode($editor));
                    }
                }
            } else {
                alert('上传图片失败!');
            }
        });
    }

    //点击备注按钮
    function clickBtnNote() {
        var $editor = $(this).parent().siblings('.article_editor');
        //编辑器内无任何元素
        if (isEditorEmpty($editor)) {
            appendEditorNote($editor,'');
            setFocuseNode($editor,'p.note:last');
            $editor.find('p.note:last').focus();
        } else {
            //当前焦点不在任何节点上
            if (getFocuseNode($editor) == undefined) {
                appendEditorNote($editor,'');
                setFocuseNode($editor,'p.note:last');
                $editor.find('p.note:last').focus();
            }
            else {
                var focuseNode = getFocuseNode($editor);
                //当前节点是标准节点
                if (isEditorNormalChild(focuseNode)) {

                    if ((nodeIsImg(focuseNode) || isEditorImage(focuseNode)) && !nodeIsGoodsImg(focuseNode) && !nodeIsWorkImg(focuseNode)) {
                        $(getEditorNoteHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'img:eq(' + $editor.find('img').index(focuseNode) + ') + p.note');
                    } else if (isEditorGoods(focuseNode)) {
                        $(getEditorNoteHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'div.goodsComodity:eq(' + $editor.find('div.goodsComodity').index(focuseNode) + ') + p.note');
                    } else if (isEditorWork(focuseNode)) {
                        $(getEditorNoteHtml('')).insertAfter($(focuseNode));
                        setFocuseNode($editor,'div.work:eq(' + $editor.find('div.work').index(focuseNode) + ') + p.note');
                    }
                    else if (isEditorNote(focuseNode)) {

                    }
                    //当前节点不是图片/备注/商品
                    else {
                        var index = $editor.find('p').index(focuseNode);
                        var str = htmlToText($(focuseNode).html());
                        replaceEditorNote($editor.find('p:eq(' + index + ')')[0], str);
                        setFocuseNode($editor,'p:eq(' + index + ')');
                        $editor.find('p:eq(' + index + ')').focus();
                    }
                }
                //当前节点不是标准节点
                else {
                    cleanEditor($editor);
                }
            }
        }
        changeBtnStatus($editor);
    }

    function clickBtnGoods() {
        var $editor = $(this).parent().siblings('.article_editor');
        new GoodsSelector(
            {
                goodsLoadUrl: '/nggirl-web/web/admin/comodity/list/2.5.0',
                onSelectedCallback: insertGoods,
                editor:$editor
            }
        ).show();
    }

    function clickBtnWork() {
        var $editor = $(this).parent().siblings('.article_editor');
        new WorkSelector({
            workLoadUrl: '/nggirl-web/web/admin/work/listWorks/V1.4.1',
            onSelectedCallback: insertWork,
            editor:$editor
        }).show();
    }

    function clickBtnDownloadImages(){
        var $editor = $(this).parent().siblings('.article_editor');
        var imageNodes = $editor.children('img.image');
        var imageUrls = new Array();
        for(var i=0;i<imageNodes.length;i++){
            imageUrls.push($(imageNodes[i]).attr('src'))
        }
        if(imageUrls.length <= 0){
            alert('没有可以导出的图片');
        }else{
            downloadImage(imageUrls);
        }
    }

    function downloadImage(imageUrls) {
        for(var i=0;i<imageUrls.length;i++){
            var a = $('<a class="imagesForDownload" download="'+imageUrls[i]+'" index="'+i+'" href="'+imageUrls[i]+'"></a>').appendTo("body");
            $('.imagesForDownload[index='+i+']')[0].click();
        }
        $('.imagesForDownload').remove();
    }

    //插入商品
    function insertGoods($editor,data) {
        var focuseNode = getFocuseNode($editor);
        var str = getEditorGoodsHtml(data.comodityId, data.photo, data.comodityName, data.refPrice, data.recommendation);
        //没有选中任何节点
        if (focuseNode == undefined || $(focuseNode).length == 0) {
            appendEditorGoods($editor,data.comodityId, data.photo, data.comodityName, data.refPrice, data.recommendation);
            setFocuseNode($editor,'div.goodsComodity:last')
        }
        //编辑器是空的
        else if (isEditorEmpty()) {
            appendEditorGoods($editor,data.comodityId, data.photo, data.comodityName, data.refPrice, data.recommendation);
            setFocuseNode($editor,'div.goodsComodity:last')
        }
        //当前节点是图片
        else if (isEditorImage(focuseNode)) {
            setFocuseNode($editor,'img.image:eq(' + $editor.find('img.image').index(focuseNode) + ') + div.goodsComodity');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是商品
        else if (isEditorGoods(focuseNode)) {
            setFocuseNode($editor,'div.goodsComodity:eq(' + ($editor.find('div.goodsComodity').index(focuseNode) + 1) + ')');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是作品
        else if (isEditorWork(focuseNode)) {
            setFocuseNode($editor,'div.work:eq(' + ($editor.find('div.work').index(focuseNode)) + ') + div.goodsComodity');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是标题/段落/备注,且有内容
        else if (
            (isEditorTitle(focuseNode) || isEditorParagraph(focuseNode) || isEditorNote(focuseNode))
            && $.trim(htmlToText($(focuseNode).html())).length != 0) {
            setFocuseNode($editor,'p:eq(' + $editor.find('p').index(focuseNode) + ') + div.goodsComodity');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是标题/段落/备注,且没有内容
        else if (isEditorTitle(focuseNode) || isEditorParagraph(focuseNode) || isEditorNote(focuseNode)) {
            setFocuseNode($editor,'');
            $(focuseNode).replaceWith(str);
        }
    }

    //插入作品
    function insertWork($editor,data) {
        var focuseNode = getFocuseNode($editor);
        var str = getEditorWorkHtml(data.workId, data.workName, data.cover, data.cost);
        //没有选中任何节点
        if (focuseNode == undefined || $(focuseNode).length == 0) {
            appendEditorWork($editor,data.workId, data.workName, data.cover, data.cost);
            setFocuseNode($editor,'div.work:last')
        }
        //编辑器是空的
        else if (isEditorEmpty()) {
            appendEditorWork($editor,data.workId, data.workName, data.cover, data.cost);
            setFocuseNode($editor,'div.work:last')
        }
        //当前节点是图片
        else if (isEditorImage(focuseNode)) {
            setFocuseNode($editor,'img.image:eq(' + $editor.find('img.image').index(focuseNode) + ') + div.work');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是商品
        else if (isEditorGoods(focuseNode)) {
            setFocuseNode($editor,'div.goodsComodity:eq(' + ($editor.find('div.goodsComodity').index(focuseNode)) + ') + div.work');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是作品
        else if (isEditorWork(focuseNode)) {
            setFocuseNode($editor,'div.work:eq(' + ($editor.find('div.work').index(focuseNode) + 1) + ')');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是标题/段落/备注,且有内容
        else if (
            (isEditorTitle(focuseNode) || isEditorParagraph(focuseNode) || isEditorNote(focuseNode))
            && $.trim(htmlToText($(focuseNode).html())).length != 0) {
            setFocuseNode($editor,'p:eq(' + $editor.find('p').index(focuseNode) + ') + div.work');
            $(str).insertAfter($(focuseNode));
        }
        //当前节点是标题/段落/备注,且没有内容
        else if (isEditorTitle(focuseNode) || isEditorParagraph(focuseNode) || isEditorNote(focuseNode)) {
            setFocuseNode($editor,'');
            $(focuseNode).replaceWith(str);
        }
    }


    //点击或者获取焦点后,记录当前焦点所在节点位置
    function onFocusRecordFocusNode(e) {

        var $parent = $(this).parent();
        var $editor = $parent.children('.article_editor');
        //编辑器内不能为空
        if (!e) {
            e = window.event;
        }
        //删除键
        if ((e.keyCode || e.which) == 8         //退格删除
            || (e.keyCode || e.which) == 46     //delete删除
        ) {
            var focuseNode = getFocuseNode($editor);

            //如果编辑器是空的则初始化一个段落
            if (isEditorEmpty($editor)) {
                var defaultData = $editor.data('defaultData');
                if ($.isArray(defaultData)) {
                    initArticleEditor($editor, defaultData);
                }
                setFocuseNode($editor,':first');
                $editor.find(':first').focus();
            }

            //选中商品/作品点击删除,则删除商品/作品
            if (focuseNode != undefined && (isEditorGoods(focuseNode) || isEditorWork(focuseNode))) {
                $(getFocuseNode($editor)).remove();
            }

        }
        //esc键
        else if ((e.keyCode || e.which) == 27) {
            $parent.removeClass('fullscreen');
            $('.btn-fullScreen').val('全屏');
        }


        //记录编辑器内光标所在节点位置
        var offset = $editor.caret('offset');
        var position = $editor.caret('position');
        if (offset != undefined && offset != null && offset.left != undefined) {
            var pointer = document.elementFromPoint(offset.left - $(document).scrollLeft(),
                offset.top - $(document).scrollTop());

            if (isEditorNormalChild(pointer)) {
                var str = '';
                if (isEditorTitle(pointer)) {
                    str = 'p.title:eq(' + $editor.find('p.title').index(pointer) + ')';
                } else if (isEditorParagraph(pointer)) {
                    str = 'p.paragraph:eq(' + $editor.find('p.paragraph').index(pointer) + ')';
                } else if (isEditorNote(pointer)) {
                    str = 'p.note:eq(' + $editor.find('p.note').index(pointer) + ')';
                } else if (isEditorImage(pointer)) {
                    str = 'img.image:eq(' + $editor.find('img.image').index(pointer) + ')';
                } else if (isEditorGoods(pointer)) {
                    str = 'div.goodsComodity:eq(' + $editor.find('div.goodsComodity').index(pointer) + ')';
                } else if (isEditorWork(pointer)) {
                    str = 'div.work:eq(' + $editor.find('div.work').index(pointer) + ')';
                } else {
                    str = '';
                }
                if ($.trim(str).length > 0) {
                    setFocuseNode($editor,str);
                }
            }
        }

        if ((e.keyCode || e.which) > 0) {
            cleanEditorText($editor);
            cleanEditorGoods($editor);
        }

        cleanEditor($editor);

        changeBtnStatus($editor);
    }

    //清理商品信息
    function cleanEditorGoods($editor) {
        $editor.find('div.goodsComodity').each(function () {
            $(this).attr('contenteditable', false);
        });
    }

    function replaceEditorTitle(node, str) {
        if (str == undefined || str == null || $.trim(str).length == 0) {
            str = '';
        }
        $(node).replaceWith('<p class="title"  contenteditable="true">' + str + '</p>');
    }

    function replaceEditorParagraph(node, str) {
        if (str == undefined || str == null || $.trim(str).length == 0) {
            str = '';
        }
        $(node).replaceWith('<p class="paragraph"  contenteditable="true">' + str + '</p>');
    }

    function replaceEditorNote(node, str) {
        if (str == undefined || str == null || $.trim(str).length == 0) {
            str = '';
        }
        $(node).replaceWith('<p class="note"  contenteditable="true">' + str + '</p>');
    }

    function replaceEditorImage(node, src, isUploaded, width_height) {
        if (isUploaded == undefined || isUploaded == null) {
            isUploaded = '';
        }
        if (width_height == undefined || width_height == null) {
            width_height = '';
        }
        $(node).replaceWith('<img class="image" src="' + src + '" isUploaded="' + isUploaded + '" width_height="' + width_height + '"  />');
    }

    function replaceEditorGoods(node, comodityId, photo, comodityName, refPrice, recommendation) {
        var descrip = getEditorGoodsHtml(comodityId, photo, comodityName, refPrice, recommendation);
        $(node).replaceWith(descrip);
    }

    function replaceEditorWork(node, workId, workName, cover, cost) {
        var descrip = getEditorWorkHtml(workId, workName, cover, cost);
        $(node).replaceWith(descrip);
    }


    function appendEditorTitle($editor,str) {
        if (str == undefined || str == null || $.trim(str).length == 0) {
            str = '';
        }
        $editor.append('<p class="title"  contenteditable="true">' + str + '</p>');
    }


    function appendEditorParagraph($editor,str) {
        if (str == undefined || str == null || $.trim(str).length == 0) {
            str = '';
        }
        $editor.append('<p class="paragraph"  contenteditable="true">' + str + '</p>');
    }

    function appendEditorNote($editor,str) {
        if (str == undefined || str == null || $.trim(str).length == 0) {
            str = '';
        }
        $editor.append('<p class="note"  contenteditable="true">' + str + '</p>');
    }


    function appendEditorImage($editor,src, isUploaded, width_height) {
        if (isUploaded == undefined || isUploaded == null) {
            isUploaded = '';
        }
        if (width_height == undefined || width_height == null) {
            width_height = '';
        }
        $editor.append('<img class="image" src="' + src + '" isUploaded="' + isUploaded + '" width_height="' + width_height + '"   />');
    }

    function appendEditorGoods($editor,comodityId, photo, comodityName, refPrice, recommendation) {
        var descrip = getEditorGoodsHtml(comodityId, photo, comodityName, refPrice, recommendation);
        $editor.append(descrip);
    }

    function appendEditorWork($editor,workId, workName, cover, cost) {
        var str = getEditorWorkHtml(workId, workName, cover, cost);
        $editor.append(str);
    }


    function isEditorEmpty() {
        return $.trim($('.article_editor').html()).length == 0;
    }

    function isEditorImage(node) {
        return $(node).is('.article_editor  img.image');
    }

    function isEditorTitle(node) {
        return $(node).is('.article_editor  p.title');
    }

    function isEditorParagraph(node) {
        return $(node).is('.article_editor  p.paragraph');
    }

    function isEditorNote(node) {
        return $(node).is('.article_editor  p.note');
    }

    function isEditorGoods(node) {
        return $(node).is('.article_editor  div.goodsComodity');
    }

    function isEditorWork(node) {
        return $(node).is('.article_editor  div.work');
    }


    function needHasEditorParagraph(elements) {
        return arrayContainsStr(elements, 'paragraph');
    }

    function needHasEditorTitle(elements) {
        return arrayContainsStr(elements, 'title');
    }

    function needHasEditorNote(elements) {
        return arrayContainsStr(elements, 'note');
    }

    function needHasEditorImage(elements) {
        return arrayContainsStr(elements, 'image');
    }

    function needHasEditorGoods(elements) {
        return arrayContainsStr(elements, 'goods');
    }

    function needHasEditorWork(elements) {
        return arrayContainsStr(elements, 'work');
    }

    function needHasDownloadImages(elements){
        return arrayContainsStr(elements, 'downloadImages');
    }

    function needHasEditorPreview(elements) {
        return arrayContainsStr(elements, 'preview');
    }

    function needHasEditorFullScreen(elements) {
        return arrayContainsStr(elements, 'fullScreen');
    }

    //数组中是否有指定字符串
    function arrayContainsStr(array, str) {
        if (array == undefined || array == null ||
            $.type(array) != 'array' || array.length == 0) {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] == str) {
                return true;
            }
        }
        return false;
    }

    //字符串是否为空
    function strIsEmpty(str) {
        if (str == null || str == undefined ||
            $.type(str) != 'string' || str.length == 0) {
            return true;
        }
        return false;
    }

    function clearReturnWords(str) {
        if (str == null || str == undefined) {
            return '';
        }
        return str.replace(/[\n]/ig, '');
    }

    //将html转换为纯文本字符串
    function htmlToText(html) {
        if (strIsEmpty(html)) {
            return '';
        }
        return html.replace(/<[^>]+>/g, "");
    }


    // 闭包结束
})(jQuery);