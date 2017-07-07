// 原 input.js文件
  var str = '';
  var arr = ['[ok]','[大哭]','[对不起]','[飞吻]','[愤怒]','[敷面膜]','[黑脸]','[流泪]','[撇嘴]','[凄凉]','[生气]','[调皮]','[吐舌]','[晚安]','[心碎]','[疑问]','[长草]'];
  var myInput = (function() {
    var mi = function() {
        this.maxLength = 500, this.currentLength = 0
      }
    mi.prototype = {
      listen: function(thi, evt) {
        var that = this;
        if ("/:del" == evt.value) {
          thi = evt.srcElement;
		  var arrStart = getImg(thi.value).split(',');
		  //console.log(getImg(thi.value).split(','));
		  //console.log(arr);
		  var strLast = arrStart[arrStart.length-1];
		  //console.log('strLast'+arrStart[arrStart.length-1]);
		  if(arr.indexOf(strLast) >= 0){
			  arrStart.pop();
			  var endStr = '';
			  for(var x = 0; x < arrStart.length; x ++){
				  if(arrStart[x] != ''){
					  endStr += arrStart[x];
				  };
			  }
			  $('.form-control').val(endStr);
			  $(".form-control").focus();
		  }else{
			  var charStr = '';
			  arrStart.pop();
			  strLast = strLast.substring(0,strLast.length -1);
			  arrStart.push(strLast);
			  for(var x = 0; x < arrStart.length; x ++){
				 if(arrStart[x] != ''){
					charStr += arrStart[x];	 
			     };
			  }
			  $('.form-control').val(charStr);
			  $(".form-control").focus();
		  }		  
          return
        }
        if (evt.keyCode && -10 == evt.keyCode) {
          if (evt.value.length > (that.maxLength - that.currentLength)) {
            return that
          }
          thi = evt.srcElement;
          var img = new Image();
		  str+=evt.value;
		  var t = $('.form-control').val();
		  $('.form-control').val('').focus().val(t + evt.value).focus().focus();
		  //$('.form-control').val($('.form-control').val() + evt.value);
		  //$(".form-control").val("").focus().val($('.form-control').val() + evt.value); 
        }
      }
    }
    return new mi()
  })();
  var iTemplate = (function() {
    var a = function() {};
    a.prototype = {
      makeList: function(e, j, i) {
        var g = [],
          h = [],
          c = /{(.+?)}/g,
          d = {},
          f = 0;
        for (var b in j) {
          if (typeof i === "function") {
            d = i.call(this, b, j[b], f++) || {}
          }
          g.push(e.replace(c, function(k, l) {
            return (l in d) ? d[l] : (undefined === j[b][l] ? j[b] : j[b][l])
          }))
        }
        return g.join("")
      }
    };
    return new a()
  })();
// 原index.html文件内部js
  $().ready(function() {
    form_emotion.rend();
    myInput.maxLength = 500
  });
  var form_emotion = (function() {
    var fe = function() {
        this.values = ["[黑脸]", "[敷面膜]", "[撇嘴]", "[流泪]", "[凄凉]", "[生气]", "[飞吻]", "[长草]", "[晚安]", "[调皮]", "[心碎]", "[大哭]", "[疑问]", "[对不起]", "[吐舌]", "[ok]", "[愤怒]"];
        this.spearate = 17
      }
    fe.prototype = {
      rend: function() {
        var that = this;
        var TPL = '{seprateDiv}<dd><span data-key="{k}_{page}_{v}" style="background-position:{xPos}px 0;"></span></dd>{delHTML}';
        var res = iTemplate.makeList(TPL, that.values, function(k, v) {
          return {
            k: k,
            v: v,
            page: Math.floor(k / that.spearate),
            xPos: -40 * k,
            seprateDiv: (0 == k % that.spearate && 0 != k && k != that.values.length) ? "</div><div>" : "",
            delHTML: (19 == k % that.spearate || k == (that.values.length - 1)) ? '<dd><span data-key="-1_-1_/:del" class="del"></span></dd>' : ''
          }
        });
        $("#list_emotion").html('<div style="width: 100%;padding: 10px;box-sizing: border-box;overflow: hidden;">' + res + '</div>');
        var nav_span = new Array(Math.ceil(that.values.length / that.spearate));
        $("#nav_emotion").html('<span class="on">' + nav_span.join("</span><span>") + '</span>');
        that.bind();
        return that
      },
      bind: function() {
        $("#list_emotion").on("click", function(evt) {
          if ("SPAN" == evt.target.tagName) {
            var val = evt.target.getAttribute("data-key").split('_');
            myInput.listen(this, {
              keyCode: -10,
              srcElement: document.getElementById("textarea"),
              value: val[2],
              /*imgUrl: 'images/listImg/' + val[0] + ".png"*/
            });
            this.focus();
			$('.form-control').focus();	
          }
        })
      }
    }
    return new fe()
  })();
  
  function getImg(s){
    var res = s.replace(/\[/g,",[").replace(/\]/g,"],").replace(/\],,\[/,"],[");
	var arr = res.split(',');
	var str = '';
	for(var x = 0; x < arr.length; x++){
		if(arr[x] != ''){
			str += arr[x]+',';	
		}
	}
	str = str.substring(0,str.length -1);
	return str;
}
