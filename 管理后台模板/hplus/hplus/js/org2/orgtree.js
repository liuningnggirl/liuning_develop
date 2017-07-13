function getURL(){
    return encodeURIComponent(window.location.href);
}

var setting = {
    async: {
        enable: true,
        url: basePath + "v1/orgTree",
        autoParam:["id=pid", "name=n", "level=lv"],
        type:"get",
        dataType:'jsonp',
        dataFilter: filter
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    //check: {
    //    enable: true,
    //    chkboxType: { "Y": "s", "N": "s" }
    //},
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeClick: beforeClick,
        onCheck: onCheck,
        onClick: zTreeOnClick,
        onAsyncSuccess: zTreeOnAsyncSuccess,
        onExpand:zTreeOnExpand
    }
};

function zTreeOnClick(event, treeId, treeNode) {
    settingPostForm(treeNode);
}

function settingPostForm(node){
    hiddenOption(node.isParent);
    if(node.isParent){
        var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
        var parentNode = treeObj.getNodeByParam("id", node.pid, null);

        $('#parentOrgId').val(  parentNode.id);
        $('#parentOrgName').val(parentNode.name);
        $('#currentOrgId').val( node.id);
        $('#currentOrgName').val(node.name);
        $('#childOrgName').val( "");
    }else{
        //$('#empId').val(        "修改");
        $('#realname').val(     node.name);
        $('#employeeno').val(   node.employee.e0127);
        $('#mobile').val(       node.employee.c0104);
        $('#officeemail').val(  node.employee.h01um);
        $('#cardno').val(       "");
        $('#level').val(        node.employee.e01a1);
        $('#postId').val(       node.employee.E01A1_0);
        $('#entrytime').val(    new Date(node.employee.sDate).format('yyyy-MM-dd hh:mm:ss') );
        $('#emporgid').val(     node.pid);
        $('#emporgname').val(   node.employee.e01a1);
    }
}

function hiddenOption(isParent){
    if(isParent){
        //form
        $('#employeeform').hide();
        $('#orgform').show();
        //button
        $("#AddPostBtn").css("visibility","visible");
        $("#ChgPostBtn").css("visibility","visible");
        $("#DelPostBtn").css("visibility","visible");
        $("#fullpathdiv").css("visibility","hidden");
    }else{
        //form
        $('#employeeform').show();
        $('#orgform').hide();
        //button
        $("#AddPostBtn").css("visibility","hidden");
        $("#ChgPostBtn").css("visibility","visible");
        $("#DelPostBtn").css("visibility","visible");
        $("#fullpathdiv").css("visibility","visible");
    }

}


function zTreeOnExpand(event, treeId, treeNode) {
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    nowOrg.selectNode(treeNode);
    expandNowPath("nowOrg");
}

var changedNodes = new Map();
function onCheck(event, treeId, treeNode, clickFlag) {
    var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
    if(treeNode.checked){
        changedNodes.put(treeNode.id, treeNode);
    }else{
        changedNodes.remove(treeNode.id);
    }


    if(!isNull(treeNode.children)){
        onCheckNodes(treeNode.children ,treeNode.checked );
    }
}

function onCheckNodes(nodes,b) {
    var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
    for (var i=0, l=nodes.length; i < l; i++) {
        //树得选中方法
        treeObj.setChkDisabled(nodes[i], b, false, false);
        treeObj.checkNode(nodes[i], b, false , false);
        nodes[i].checkedOld = nodes[i].checked;
        if(!isNull(nodes[i].children)){
            onCheckNodes(nodes[i].children,b);
        }
    }
}

var treeNodes = new Map();
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    if(isNull(treeNode)) {
        var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
        var nodes = treeObj.getNodes();
        loadCheckNodes(nodes,false);
    }else{
        var b = (!isNull(treeNode) && treeNode.checked == true) ? true : false;
        var nodes = treeNode.children;
        loadCheckNodes(nodes,b);
    }
    if(!isNull(NowExpand)){
        expandNowPath("nowOrg", NowExpand);
    }
};

//选中节点
function loadCheckNodes(nodes,b) {
    var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
    for (var i=0, l=nodes.length; i < l; i++) {
        //是否存在反选权限
        var status;//findPermissionByNode(nodes[i]);

        if(null != status){
            treeObj.setChkDisabled(nodes[i], false, false, false);
            treeObj.checkNode(nodes[i], status, false , false);
        }else{
            //树得选中方法
            treeObj.checkNode(nodes[i], b, false , false);
            treeObj.setChkDisabled(nodes[i], b, false, false);
        }
        nodes[i].checkedOld = nodes[i].checked;
        if(!isNull(nodes[i].children)){
            loadCheckNodes(nodes[i].children,b);
        }
    }
}



var log, className = "dark";
function beforeClick(treeId, treeNode, clickFlag) {
    className = (className === "dark" ? "":"dark");
    return (treeNode.click != false);
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

var log, className = "dark";
function beforeClick(treeId, treeNode, clickFlag) {
    className = (className === "dark" ? "":"dark");
    return (treeNode.click != false);
}


function refreshTree(){
    initTree();
}


function refreshNowTree(){
    $("#nowOrg").html("");
    $.fn.zTree.init($("#nowOrg"), setting);
}

function fetchOrgIds(temp, type){
    var result = "";
    for(var i=0;i<temp.length;i++){
        var node = temp[i];
        if(type == "org" && node.isParent){
            result += node.id;
            if(i != temp.length-1){
                result += ","
            }
        }else if (type == "employee" && !node.isParent){
            result += node.id;
            if(i != temp.length-1){
                result += ","
            }
        }else{
        }
    }
    return result;
}

function initTree(){
    $("#nowOrg").html("");
    changedNodes = new Map();
    $.fn.zTree.init($("#nowOrg"), setting);
}


$(document).ready(function(){
    initTree();
    initSelect();
});
