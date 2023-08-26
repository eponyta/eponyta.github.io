function open_event_pkmn_details(event, row) 
{
    let parentLink = event.target.closest('a');
    if (parentLink) {
        return;
    }

    const container = document.getElementsByTagName("main")[0];
    const template = document.getElementById("pkmn-details");
    const dialogFragment = template.content.cloneNode(true);
    const dialog = dialogFragment.firstElementChild;
    container.appendChild(dialogFragment);

    _event_populate_details_dialog(dialog, row);

    dialog.addEventListener("cancel", (event) => {
        dialog.remove();
    });
    dialog.showModal();

    dialog.addEventListener('click', function(event) {
        var rect = dialog.getBoundingClientRect();
        var clickedDialog = (
            rect.top <= event.clientY 
            && event.clientY <= rect.top + rect.height 
            && rect.left <= event.clientX 
            && event.clientX <= rect.left + rect.width
        );

        if (!clickedDialog) {
            _event_close_dialog(dialog);
        }
    });
}

function close_event_pkmn_details(event) {
    let dialog = event.target.closest('dialog');
    _event_close_dialog(dialog);
}

function _event_close_dialog(dialog) {
    dialog.classList.add("dismissed");

    dialog.addEventListener("animationend", (event) => {
        dialog.close();
    });

    dialog.addEventListener("animationcancel", (event) => {
        dialog.close();
    });
}

function _event_populate_details_dialog(dialog, row) {
    dialog.dataset.pkmnInfo = row.dataset.pkmnInfo;

    let jsonBytes = Uint8Array.from(atob(row.dataset['pkmn-info']), (m) => m.codePointAt(0));
    let decoder = new TextDecoder();
    let info = JSON.parse(decoder.decode(jsonBytes));

    var all_elements = dialog.getElementsByTagName('*');
    for (var i = 0; i < all_elements.length; i++) {
        let element = all_elements[i];
        
        if (element.dataset.contentField) {
            element.innerHTML = info[element.dataset.contentField];
        }

        if (element.dataset.srcField) {
            element.setAttribute('src', info[element.dataset.srcField]);
        }

        if (element.dataset.hrefField) {
            element.setAttribute('href', info[element.dataset.hrefField]);
        }

        if (element.dataset.classField) {
            element.className = info[element.dataset.classField];
        }

        if (element.dataset.visibleField) {
            if (element.dataset.hideBehavior == "1") {
                if (info[element.dataset.visibleField]) {
                    element.style.visibility = 'visible';
                } else {
                    element.style.visibility = 'hidden';
                }
            } else {
                if (info[element.dataset.visibleField]) {
                    element.style.display = '';
                } else {
                    element.style.display = 'none';
                }
            }
        }

        if (element.dataset.datetimeField) {
            const dateString = info[element.dataset.datetimeField];
            element.setAttribute('datetime', dateString);
        }
    }
}

function copy_event_r3_info(event) {
    let dialog = event.target.closest('dialog');
    let jsonBytes = Uint8Array.from(atob(dialog.dataset['pkmn-info']), (m) => m.codePointAt(0));
    let decoder = new TextDecoder();
    let info = JSON.parse(decoder.decode(jsonBytes));

    let rule3_info = info['species'];

    navigator.clipboard.writeText(rule3_info).then(function() {
      console.log('Copied successfully');
    }, function(e) {
        console.log('Failed to copy: ', e);
    });
}
