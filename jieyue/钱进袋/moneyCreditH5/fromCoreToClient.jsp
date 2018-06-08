<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page isELIgnored="false" %>
<!DOCTYPE html">
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>加载中...</title>
</head>
<body>
    <input type="hidden" class="text" id="type" name="type" value="${type}" />
    <input type="hidden" class="text" id="resultCode" name="resultCode" value="${resultCode}" />
    <input type="hidden" class="text" id="message" name="message" value="${message}" />
</body>
<script src="/moneyCreditH5/js/jquery-1.7.2.min.js"></script>
<script src="/moneyCreditH5/js/fromCoreToClient.js"></script>
<script src="/moneyCreditH5/js/UmengAndroid.js"></script>
<script src="/moneyCreditH5/js/UmengiOS.js"></script>
</html>