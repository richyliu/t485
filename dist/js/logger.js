//handles logging and the feedback button
$("#feedback-btn").click(function() {
	$("#feedback-modal").modal("show")
});
$("#issueType").change(function(){
	let val = $(this).val();
	console.log(val);
	$(".feedback-section:not(.feedback-" + val + ")").collapse("hide");
	$(".feedback-" + val).collapse("show");
	$(".feedback-" + val + "-hide").addClass("hidden");

});
$("#affected-pages").val(window.location.href);

$(".custom-file-input").on('change',function(){
	//get the file name
	var fileName = $(this).val();
	fileName = fileName.substring(fileName.lastIndexOf("\\") + 1)
	//replace the "Choose a file" label
	$(this).next('.custom-file-label').css("white-space: nowrap;overflow:hidden;");
	$(this).next('.custom-file-label').html(fileName);
});

var Logger = {};
