function createOrg(node){
    var parentId    = node.id;
    var childOrgName   = $('#childOrgName').val();

    if(isNull(childOrgName)){
        $('#childOrgName').show();
        //$('#childOrgName').attr("disabled",false);
        //$('#currentOrgName').attr("disabled",false);
        //$('#parentOrgName').attr("disabled",false);
        return;
    }else{

    }
    $.ajax({
        type : "GET",
        url         : basePath + "org/create?pid="+ parentId + "&orgName=" + childOrgName,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert("创建成功!");
                //var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                //var node   = nowOrg.getSelectedNodes();
                //nowOrg.removeNode(node[0]);
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function updateOrg(node){
    var nodeId      = node.id;
    var nodeName    = $('#currentOrgName').val();
    $.ajax({
        type : "GET",
        url         : basePath + "org/update?orgId="+ nodeId + "&orgName=" + nodeName,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert("修改成功!");
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var nodes   = nowOrg.getSelectedNodes();
                var node    = nodes[0];
                node.name   = nodeName;
                nowOrg.updateNode(node);
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function deleteOrg(node){
    $.ajax({
        type : "GET",
        url         : basePath + "org/delete?orgId="+ node.id,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert("删除成功!");
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var node   = nowOrg.getSelectedNodes();
                nowOrg.removeNode(node[0]);
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function createEmployee(pid, name){
}

function updateEmployee(node){
    var realname    = $('#realname').val();
    var empNo       = $('#employeeno').val();
    var mobile      = $('#mobile').val();
    var officemail  = $('#officeemail').val();
    //var cardno      = $('#empId').val();
    var postId      = $('#postId').val();
    //var birthday    = $('#empId').val();
    var entryTime   = $('#entrytime').val();
    var orgId       = node.pid;
    //var sex         = $('#empId').val();
    $.ajax({
        type : "GET",
        url         : basePath + "hr/update",
        dataType : "jsonp",
        data : {
            realname    :realname,
            empNo       :empNo,
            mobile      :mobile,
            officemail  :officemail,
            //cardno    :cardno,
            postId      :postId,
            //birthday  :birthday,
            entryTime   :new Date(entryTime).getTime(),
            orgId       :orgId
            //sex       :'',
        },
        success : function(data) {
            if(data.status == 200){
                alert("修改成功!");
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var nodes   = nowOrg.getSelectedNodes();
                var node    = nodes[0];
                node.name   = realname;
                nowOrg.updateNode(node);
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function deleteEmployee(pid, name){
}


function create(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        createOrg(node);
    }else{

    }

}

function update(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        updateOrg(node);
    }else{
        updateEmployee(node);
    }
}

function deleteBtn(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        deleteOrg(node)
    }else{

    }
}
