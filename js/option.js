// popup.js

$(document).ready(function() {
    $('.btnSave').click(function() {
        var id = $('#id').val();
        var pw = $('#pw').val();
        var imap_server = $('#imap_server').val();
        var imap_port = $('#imap_port').val();
        var imap_tls = $('#imap_tls').val();
        var mail_url = $('#mail_url').val();

        // 비밀번호 암호화해서 저장.
        var crypt = new JSEncrypt();
        $.get('./rsa_1024_pub', function(data) {
            crypt.setKey(data);
            var encPw = '';
            try {
                encPw = crypt.encrypt(pw);
            } catch (e) {
                console.log(e);
            }

            var savedObject = {
                'id': id,
                'imap_server': imap_server,
                'imap_port': imap_port,
                'imap_tls': imap_tls,
                'mail_url': mail_url
            };
            // 비밀번호는 입력한 경우에만 저장.
            if (pw != '') {
                savedObject['pw'] = encPw;
            }
            chrome.storage.local.set(savedObject, function() {
                console.log('save!');
                alert('save!');
                chrome.extension.getBackgroundPage().login();
            });
        });
    });
    chrome.storage.local.get(['id', 'imap_server', 'imap_port', 'imap_tls', 'mail_url'], function(result) {
        console.log(result);
        $('#id').val(result.id);
        $('#imap_server').val(result.imap_server);
        if (result.hasOwnProperty('imap_port')) {
            $('#imap_port').val(result.imap_port);
        }
        if (result.imap_tls) {
            $('#imap_tls').val(result.imap_tls);
        }
        $('#mail_url').val(result.mail_url);

    });
});
