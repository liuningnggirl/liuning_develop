/**
 * Created by zhanghaiwei on 16/8/10.
 */
// 创建一个闭包
;
(function ($) {

    var localUploadUrl = 'https://photos.nggirl.com.cn/uploadserver/app/image/uploadsCompress/3.0.0';
    var webUploadUrl = 'https://photos.nggirl.com.cn/uploadserver/app/image/uploads/saveWebImage/3.0.0';
    var id = 'article_image_edit';

    $.showImageUploadBox = function (onOkCallback, onCancelCallback) {
        $.closeImageUploadBox();
        var str = '<div class="' + id + '"><div class="alertBox"><h3>插入图片</h3>' +
            '<div class="file_img">本地上传</div>' +
            '<input type="file" class="file_input_img" multiple data-url="' + localUploadUrl + '"/><br/>' +
            '<div class="web_upload"><span>网络图片</span><input type="text" class="file_web_image" /></div>' +
            '<div class="oper-btns"><input type="button" class="ab_cancle_btn" value="取消">' +
            '<input type="button" class="ab_ok_btn" value="确定">' +
            '</div></div></div>';
        $('body').append(str);
        $('.' + id).show();

        //点击确定

        $('.' + id + ' .ab_ok_btn').click(function () {
            //web图片地址
            var webOriginImageUrl = $('.' + id + ' .file_web_image').val();
            var localOriginImageUrl = $('.file_web_image').val();

            //上传web图片
            if (webOriginImageUrl != undefined && webOriginImageUrl != null && $.trim(webOriginImageUrl).length > 0) {
                //微信图片域名
                var regWeiXin = new RegExp('^http:\\/\\/mmbiz.qpic.cn.*');
                if (regWeiXin.test(webOriginImageUrl) && webOriginImageUrl.indexOf('?') > -1) {
                    webOriginImageUrl = webOriginImageUrl.substring(0,webOriginImageUrl.lastIndexOf('?'));
                }
                
                $.ajax({
                    url: webUploadUrl,
                    type: 'post',
                    dataType: 'json',
                    data: {webImageUrl: webOriginImageUrl},
                    success: function (data) {
                        $.closeImageUploadBox();
                        if (onOkCallback != undefined && $.isFunction(onOkCallback)) {
                            onOkCallback(data);
                        }
                    }
                });

            }
            //上传本地图片
            else if (localOriginImageUrl != undefined && localOriginImageUrl != null && $.trim(localOriginImageUrl).length > 0) {
                $.ajax({
                    url: localUploadUrl,
                    type: 'post',
                    dataType: 'json',
                    data: {file: localOriginImageUrl},
                    success: function (data) {
						//console.log(data);
                        $.closeImageUploadBox();
                        if (onOkCallback != undefined && $.isFunction(onOkCallback)) {
                            onOkCallback(data);
                        }
                    }
                });
            } else {
                $.closeImageUploadBox();
            }

        });


        //点击取消
        $('.' + id + ' .ab_cancle_btn').click(function () {
            $.closeImageUploadBox();
            if (onCancelCallback != undefined && $.isFunction(onCancelCallback)) {
                onCancelCallback();
            }
        });

        //上传操作
        $('.' + id + ' .file_input_img').fileupload({
            dataType: 'json',
            done: function (e, data) {
                $.closeImageUploadBox();
                if (onOkCallback != undefined && $.isFunction(onOkCallback)) {
					if(data.result.data.width>1500.0 ||data.result.data.height>1500.0 ){
						alert("图片长宽不能超过1500像素");
					}else{
                   		onOkCallback(data.result);
					}
                }
            }
        });


        //点击上传本地图片
        $('.' + id + ' .file_img').on('click', function () {
            $('.file_input_img').click();
        });

    };

    $.closeImageUploadBox = function () {
        $('.' + id).remove();
    };



    // 闭包结束
})(jQuery);