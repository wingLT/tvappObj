/*
*fileDataList:图片的blob对象数组
 *uploadImg:上传图片的方法  */
var fileDataList = [];

const uploadImg = function (e,typeString,size,num){
	//e : type = file的元素名称
	//typeString : 上传图片的类型 jpg,jpeg,gif,png,
	//size : 上传图片的大小
	//num : 上传图片的个数
	var delParent;
	//限制类型
    typeString = typeString.split(",");
	var defaults = {
		// "png", "bmp","GIF"
		fileType:typeString, // 上传文件的类型
		fileSize: 1024 * 1024 * Number(size) // 上传文件的大小 10M
	};
	/*点击图片的文本框*/
	$("."+e).change(function() {
		var idFile = $(this).attr("id");
		var file = document.getElementById(idFile);
		var imgContainer = $(this).parents(".z_photo"); //存放图片的父亲元素
		var fileList = file.files; //获取的图片文件
		//		console.log(fileList+"======filelist=====");
		var input = $(this).parent(); //文本框的父亲元素
		var imgArr = [];
		//遍历得到的图片文件
		var numUp = imgContainer.find(".up-section").length;
		var totalNum = numUp + fileList.length; //总的数量
		if(fileList.length > num || totalNum > num) {
			alert("上传图片数目不可以超过"+ num +"个，请重新选择");
		} else if(numUp <= num) {
			fileList = validateUp(fileList);

			for(var i = 0; i < fileList.length; i++) {
				var imgUrl = window.URL.createObjectURL(fileList[i]);
				imgArr.push(imgUrl);
				var $section = $("<section class='up-section fl loading'>");
				imgContainer.prepend($section);
				var $span = $("<span class='up-span'>");
				$span.appendTo($section);

				var $img0 = $("<img class='close-upimg' data-name='" + fileList[i].name + "'>").on("click", function(event) {
					event.preventDefault();
					event.stopPropagation();
					delParent = $(this).parent();
					delParent.remove();
					var img_name = $(this).attr("data-name");
					for(var i = 0; i < fileDataList.length; i++) {
						if(fileDataList[i].name == img_name) {
              deleteImgArr(fileDataList, i);
						}
					}
					var num1 = imgContainer.find(".up-section").length;
					if(num1 >= num) {
						$(".z_file").hide();
					} else {
						$(".z_file").show();
					}
				});
				$img0.attr("src", "/static/lib/img/imgclose.png").appendTo($section);
				var $img = $("<img class='up-img up-opcity'>");
				$img.attr("src", imgArr[i]);
				$img.appendTo($section);
				var $p = $("<p class='img-name-p'>");
				$p.html(fileList[i].name).appendTo($section);
				var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
				$input.appendTo($section);
				var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
				$input2.appendTo($section);
				fileDataList.push(fileList[i]);
			}
		}
		setTimeout(function() {
			$(".up-section").removeClass("loading");
			$(".up-img").removeClass("up-opcity");
		}, 450);
		numUp = imgContainer.find(".up-section").length;
		if(numUp >= num) {
			$(this).parent().hide();
		} else {
			$(this).parent().show();
		}

		//input内容清空
		$(this).val("");
	});

	$(".z_photo").delegate(".close-upimg", "click", function() {
		$(".works-mask").show();
		delParent = $(this).parent();
	});

	$(".wsdel-ok").click(function() {
		$(".works-mask").hide();
		var numUp = delParent.siblings().length;
		if(numUp < num) {
			delParent.parent().find(".z_file").show();
		}
		delParent.remove();

	});

	$(".wsdel-no").click(function() {
		$(".works-mask").hide();
	});

	function validateUp(files) {
		var arrFiles = []; //替换的文件数组
		for(var i = 0, file; file = files[i]; i++) {
			//获取文件上传的后缀名
			var newStr = file.name.split("").reverse().join("");
			if(newStr.split(".")[0] != null) {
				var type = newStr.split(".")[0].split("").reverse().join("");
				//						console.log(type+"===type===");
				if(jQuery.inArray(type, defaults.fileType) > -1) {
					// 类型符合，可以上传
					if(file.size >= defaults.fileSize) {
						//								alert(file.size);
						alert('选择"' + file.name + '"文件大小过大');
					} else {
						// 在这里需要判断当前所有文件中
						arrFiles.push(file);
					}
				} else {
					alert('选择"' + file.name + '"上传类型不符合');
				}
			} else {
				alert('选择"' + file.name + '"没有类型, 无法识别');
			}
		}
		return arrFiles;
	}
};
//数组按位置删除
var deleteImgArr = function(arr,index){
	if(index > -1) {
		arr.splice(index, 1);
	}
};
export default {
    fileDataList,
    uploadImg
}
