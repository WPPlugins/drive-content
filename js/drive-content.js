var thumbUrl = 'http://36375700-9bf7-11e2-9e96-0800200c9a66-content-processed.s3.amazonaws.com/0_tn_';
var apiUrl = 'https://yantranetapi.autonettv.com/ynt/app/v0.3/site_ui/';
var driveContentTemplate = twig({
    id: "driveContent",
    href: drive_content.driveContentTemplateUrl,
    async: false
});
var driveLoginTemplate = twig({
    id: "driveLogin",
    href: drive_content.driveLoginTemplateUrl,
    async: false
});

jQuery(document).ready(function(){
    jQuery(document).on('submit','#drive-content-authentication',function(e){
        e.preventDefault();
        jQuery('#drive-content-modal .modal-footer').html('<img src="'+drive_content.spinnerUrl+'" >');
        getDriveContent(false, jQuery(this).serialize());
    });
    jQuery(document).on('click','.insert-drive-content-shortcode',function(e){
        e.preventDefault();
        if(!jQuery('input[name="drive-content-block"]:checked').val().length){
            alert('You must select a block to use');
            return;
        }
        var shortCode = '[driveContent url="'+jQuery('input[name="drive-content-block"]:checked').val()+'" ';

        if(jQuery(this).data('width') && jQuery(this).data('height')){
            shortCode = shortCode + 'width="'+jQuery(this).data('width')+'" height="'+jQuery(this).data('height')+'"]';
            insertShortCode(shortCode);
            jQuery('#drive-content-modal').modal('hide');
        }
        else if(jQuery('input[name="frame-height"]').val() != '' && jQuery('input[name="frame-width"]').val() != ''){
            shortCode = shortCode + 'width="'+jQuery('input[name="frame-width"]').val()+'" height="'+jQuery('input[name="frame-height"]').val()+'"]';
            insertShortCode(shortCode);
            jQuery('#drive-content-modal').modal('hide');
        }
        else{
            alert('To use a custom size both the width and the height need to be filled out');
        }

    });

    jQuery(document).on('click','#insert-drive-content',function(e){
        if(drive_content.ws_access_id === "false"){
            jQuery('#drive-content-modal .modal-content').html(driveLoginTemplate.render({}));
        }
        else{
            jQuery('#drive-content-modal .modal-content').html('<div class="modal-header"><h4 class="modal-title">Drive Content Blocks</h4></div><div class="modal-body text-center"><img src="'+drive_content.spinnerUrl+'" alt="" /></div> ');
            jQuery('#drive-content-modal').modal('show');
            getDriveContent(drive_content.ws_access_id);
        }
    });

    function insertShortCode(shortCode)
    {
        if(typeof tinyMCE.activeEditor !== 'undefined' && tinyMCE.activeEditor != null){
            tinyMCE.activeEditor.execCommand('mceInsertContent', false, shortCode);
        }
        else{
            jQuery('#content').append(shortCode);
        }
    }

    function showLoginModal(msg)
    {
        jQuery('#drive-content-modal .modal-content').html(driveLoginTemplate.render({message:msg, imgUrl: drive_content.registerImgUrl}));
        jQuery('#drive-content-modal').modal('show');
    }

    function showContentModal(data)
    {
        jQuery('#drive-content-modal .modal-content').html(twig({ref:"driveContent"}).render(data));
        jQuery('#drive-content-modal').modal('show');
    }

    function getDriveContent(accessToken, paramString){
        if(accessToken){
            var queryString = 'ws_access_id='+accessToken;
        }
        else{
            var queryString = paramString;
        }
        jQuery.get(
            apiUrl+'authenticate?'+queryString,
            function(xmlResponse){
                var data = jQuery.xml2json(xmlResponse);

                if(typeof data.error_msg !== 'undefined'){
                    showLoginModal(data.error_msg);
                }
                else{
                    showContentModal({
                        entries:data.users.user.laser_shark_entries.laser_shark_entry,
                        thumbUrl: thumbUrl
                    });
                    var postData= {
                        action: 'save_access_id',
                        ws_access_id: data.users.user.ws_access_id
                    };
                    jQuery.post(ajaxurl, postData, function(response) {
                        //no need to do anything here
                    });
                }
            },
            'xml'
        )
    }
});
