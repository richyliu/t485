// redirect to event pages if no event id
if (getQuery("event") === null || getQuery("event") === "") {
    window.location.href = "/resources/event-pages.html";
}



// get event pages data from firebase
// encodeURIComponent to prevent code injection when querying
firebase.database().ref('/events/' + encodeURIComponent(getQuery("event"))).once('value').then(snapshot => {
    let data = snapshot.val();
    
    
    // error if no data
    if (data === null || data === 0) {
        $("#event-title").html("Error 404: Event Not Found");
        $("#event-description").html("The specified event <b>" + getQuery("event") +
            "</b> was not found. If you typed in a link to view this page, try going to the <a href='resources/event-pages.html'>event pages list</a> and clicking a link from there.");
        $(".event-title").html("Error 404: Event Not Found");
        $(".event-description").html("The specified event <b>" + getQuery("event") +
            "</b> was not found. If you typed in a link to view this page, try going to the <a href='resources/event-pages.html'>event pages list</a> and clicking a link from there.");
    } else {
        $("#event-title").html(data.title);
        $("#event-description").html(data.description);
        
        
        // enable edit/archiving privilage if key is correct
        if (data.key == getQuery('key')) {
            if (data.archived) {
                $('#archived-alert-box').show();
                $('#restore').show();
            } else {
                $('#edit-alert-box').show();
            }
        } else {
            if (data.archived) {
                $('#archived-alert-box').show();
            }
        }
        
        
        // archive the event page
        $("#delete").click(() => {
            firebase.database().ref('/events/' + getQuery("event") + "/archived/").set(true).then(() => {
                alert('Event page successfully archived! You may unarchive the event page at any time.');
                window.location.reload();
            }).catch(error => {
                console.error(error);
            });
        });
        
        // restore the event page
        $("#restore").click(() => {
            firebase.database().ref('/events/' + getQuery("event") + "/archived/").set(false).then(() => {
                alert('Event page successfully restored! You may now edit this page.');
                window.location.reload();
            }).catch(error => {
                console.error(error);
            });
        });

        // edit the event page
        $("#edit").click(() => {
            // prompt user before leaving page
            $(window).on("beforeunload", () => {
                return 'Changes you made may not be saved';
            });
            // show editing options
            $("#edit-alert").show();
            $('#options').hide();
            
            // reload page when user wants to only view event page
            $("#view").click(() => {
                window.location.reload();
            });

            // edit title
            tinymce.init({
                selector: "#event-title", //'h2.editable',
                inline: true,
                plugins: [
                    "textcolor colorpicker link"
                ],
                toolbar: "undo redo | forecolor backcolor | link | save",
                menubar: false,
                setup: editor => {
                    editor.addButton("save", {
                        text: "Save Changes",
                        icon: false,
                        onclick: () => {
                            firebase.database().ref("/events/" + getQuery("event") + "/" + editor.id.replace("event-", "") + "/").set(editor.getContent());
                        }
                    });
                }
            });

            // edit content
            tinymce.init({
                selector: "#event-description", //'div.editable',
                inline: true,
                //urlconverter_callback: 'modalURLConverter',
                plugins: [
                    "advlist autolink lists link image charmap print preview",
                    "searchreplace visualblocks fullscreen textcolor colorpicker",
                    "insertdatetime media table contextmenu paste imagetools"
                ],
                link_assume_external_targets: true,
                removed_menuitems: "newdocument",
                setup: editor => {
                    editor.addButton("save", {
                        text: "Save Changes",
                        icon: false,
                        onclick: () => {
                            firebase.database().ref("/events/" + getQuery("event") + "/" + editor.id.replace("event-", "") + "/").set(editor.getContent());
                        }
                    });
                },
                toolbar: "insertfile undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | save"
            });
        });
    }
});
