function create(pid, name){
    $.ajax({
        type : "GET",
        url         : basePath + "post/create?pid="+ pid +"&name=" + name,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert("新增成功!");
                refreshTree();
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function update(id, name){
    $.ajax({
        type : "GET",
        url         : basePath + "post/update?id="+ id +"&name=" + name,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert("修改成功!");
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var nodes   = nowOrg.getSelectedNodes();
                var node    = nodes[0];
                node.name   = name;
                nowOrg.updateNode(node);
                //refreshTree();
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function deletePost(id){


    $.ajax({
        type : "GET",
        url         : basePath + "post/delete?id="+ id,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert("删除成功!");
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var node   = nowOrg.getSelectedNodes();
                nowOrg.removeNode(node[0]);

                //refreshTree();
            }
        },
        error : function(data){
            alert("error")
        }
    });
}
