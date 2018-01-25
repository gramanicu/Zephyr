var socket = io.connect();

var messages = 0;

socket.on('serverMessage', function (data) {
    if (messages == 0) {
        messages++;
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 200,
            height: 200
        });

        function makeCode() {
                qrcode.makeCode(data);
        }
        makeCode();

        var qrButton = document.getElementById("qrButton");
        qrButton.href = data;

        socket.disconnect()
    }
});