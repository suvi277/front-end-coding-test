$(document).ready(function() {
	retriveImageListComponent();
});

function retriveImageListComponent() {
	$.getJSON('./templates/content/data.json', renderDataVisualsTemplate);
}

function renderDataVisualsTemplate(data) {
	getTemplateAjax('./templates/imageGallery.hbs', function(template) {
		$('#image-list-container').html(template({ data }));
	});
}

function getTemplateAjax(path, callback) {
	var source, template;
	$.ajax({
		url: path,
		success: function(data) {
			source = data;
			template = Handlebars.compile(source);
			if (callback) callback(template);
		}
	});
}
