/**
 * Read selected files locally (HTML5 File API)
 */


/**
 * Form submit
 */

function handleFormSubmit(event) {
    event.preventDefault();

    var form = this,
        formData = new FormData(form); // This will take all the data from current form and turn then into FormData

    // Prevent multiple submisions
    if ($(form).data('loading') === true) {
        return;
    }
    $(form).data('loading', true);

    // Add selected files to FormData which will be sent
    if (filesToUpload) {
        $.each(filesToUpload, function(index, file) {
            formData.append('cover[]', file);
        });
    }

    $.ajax({
        type: "POST",
        url: $('form').attr('action'),
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            // handle response
        },
        complete: function() {
            // Allow form to be submited again
            $(form).data('loading', false);
        },
        dataType: 'json'
    });
}

/**
 * Register events
 */
$('form').on('submit', handleFormSubmit);