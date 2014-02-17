$(function()
{
	$('<div id="modal-dialog" style="display:none"><p id="modal-dialog-msg"></p><p style="margin-top:12px"><input type="text" size="20" style="width:100%" /></p></div>').appendTo ($("body"));
	$("#modal-dialog").dialog ({
		modal: true,
		height: 175,
		width: 360,
		autoOpen: false,
		closeOnEscape: false,
		open: function ( event, ui )
		{
			$(".ui-dialog-titlebar-close", ui.dialog).hide();
		}
	});
	
	$("#modal-dialog input[type=text]").keydown (function(e)
	{
		if ( e.keyCode == '13' )
		{
			$("#modal-dialog").parent().find (".ui-dialog-buttonset button").click();
		}
	});
});

function myalert ( title, msg )
{
	$("#modal-dialog-msg").html (msg);
	$("#modal-dialog input").val ("").hide();
	$("#modal-dialog")
		.dialog ({
			"title": title,
			buttons: [{
				text: "OK",
				click: function() { $(this).dialog ("close"); }
			}]
		})
		.dialog ("open");
}

function myprompt ( title, msg, fn )
{
	$("#modal-dialog input").show();
	$("#modal-dialog-msg").html (msg);
	$("#modal-dialog input").val ("").show();
	$("#modal-dialog")
		.dialog ({
			"title": title,
			buttons: [{
				text: "OK",
				click: function()
				{
					var entry = $("#modal-dialog input").val();
					if ( entry != "" )
					{
						fn (entry)
						$(this).dialog ("close");
					}
				}
			}]
		})
		.dialog ("open");
}



