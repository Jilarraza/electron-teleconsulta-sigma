const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const display_content = document.querySelector('#display-content');

ipcRenderer.on('room_data', (event, data) => {
    display_content.innerHTML = generateDisplayContent();
    let params = new URLSearchParams(new URL(data).search);
    let room_id = params.get('room_id');
    let user_name = params.get('user_name');
    let user_email = params.get('user_email');
    let audio = params.get('audio');
    let video = params.get('video');
    const domain = 'meet.jit.si';
    const options = {
        roomName: room_id,
        width: '100%',
        height: '100%',
        userInfo: {
            email: user_email,
            displayName: user_name
        },
        interfaceConfigOverwrite : {
            APP_NAME: 'SD TeleConsulta',
            NATIVE_APP_NAME: 'SD TeleConsulta',
            PROVIDER_NAME: 'SD TeleConsulta',
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'recording', 'etherpad', 'sharedvideo', 'raisehand',
                'videoquality','tileview', 'download', 'mute-everyone'
            ],
            SHOW_JITSI_WATERMARK : false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            LANG_DETECTION: false,
            DEFAULT_BACKGROUND: '#ffffff'
        },
        configOverwrite : { defaultLanguage: 'es' },
        parentNode: document.querySelector('#videos-container')
    };
    changeView("room", "home");
    const api = new JitsiMeetExternalAPI(domain, options);
    if(audio == 'false'){
        api.executeCommand('toggleAudio');
    }
    if(video == 'false'){
        api.executeCommand('toggleVideo');
    }
    api.on('readyToClose', () => {
        changeView("exit", "room");
        let pregunta = 'Por favor califica nuestro servicio'
        Swal.fire({
            customClass: {
                container: 'container-class',
                popup: 'popup-class2',
                input: 'input-class',
                actions: 'actions-class',
                confirmButton: 'confirm-button-class',
                cancelButton: 'cancel-button-class'
            },
            showClass: {
                popup: 'animated fadeInDown faster'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster'
            },
            allowOutsideClick: false ,
            title: '',
            text: "You won't be able to revert this!",
            icon: '',
            html:
            `
            <div class="d-flex align-items-center flex-column">
                <p class="m-0">${pregunta}<p>
                <div class="rate">
                    <input type="radio" id="star5" name="rate" value="5" />
                    <label for="star5" title="5"></label>
                    <input type="radio" id="star4" name="rate" value="4" />
                    <label for="star4" title="4"></label>
                    <input type="radio" id="star3" name="rate" value="3" />
                    <label for="star3" title="3"></label>
                    <input type="radio" id="star2" name="rate" value="2" />
                    <label for="star2" title="2"></label>
                    <input type="radio" id="star1" name="rate" value="1" />
                    <label for="star1" title="1"></label>
                </div>
                <span class="btn btn-verde mt-3" onclick="getRates()">Califícanos </span>
            <div>
            `,
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false
        });
    });
});

ipcRenderer.on('stand_alone_run', (event, data) => {
    display_content.innerHTML = generateDisplayContent();
    changeView("home", "");
});

const getRates = () => {
    let rate_answer = 0;
    let rates = document.querySelectorAll("input[name='rate']");
    for(let i = 0; i < rates.length; i++) {
        let rate = document.querySelector(`#${rates[i].id}`);
        if(rate.checked == true){
            rate_answer = rate.value;
        }
    }
    Swal.close();
}

const changeView = (view, last) => {
    if(view == "home" && last == ""){
        let div_show = document.querySelector('#home_div');
        div_show.classList.remove('d-none');
        div_show.classList.remove('animate__animated', 'animate__fadeInRight', 'animate__faster');
        div_show.classList.add('animate__animated', 'animate__fadeInRight', 'animate__faster');
        document.body.classList.add('tapiz');
    }else if(view == "room" && last == "home"){
        let div_hide = document.querySelector('#home_div');
        div_hide.classList.add('d-none');
        let div_show = document.querySelector('#room_div');
        div_show.classList.remove('d-none');
        div_show.classList.remove('animate__animated', 'animate__fadeInRight', 'animate__faster');
        div_show.classList.add('animate__animated', 'animate__fadeInRight', 'animate__faster');
        document.body.classList.add('tapiz');
    }else if(view == "exit" && last == "room"){
        let div_hide = document.querySelector('#room_div');
        div_hide.classList.add('d-none');
        let div_show = document.querySelector('#exit_div');
        div_show.classList.remove('d-none');
        div_show.classList.remove('animate__animated', 'animate__fadeInRight', 'animate__faster');
        div_show.classList.add('animate__animated', 'animate__fadeInRight', 'animate__faster');
        document.body.classList.remove('tapiz');
        document.body.classList.add('salida');
    }
}

const generateDisplayContent = () => {
    let innerHTML = /*html*/`
        <div class="row mt-2">
            <div class="col-12" id="home_div">
                <section class="despedida">
                    <h1 class="animated fadeInDown pl-4 mx-auto" style="color: #fff !important;">Gracias por preferirnos</h1>
                </section>
            </div>
            <div class="col-12 d-none" id="room_div">
                <div id="videos-container" class="h-100"></div>
            </div>
            <div class="col-12 d-none" id="exit_div">
                <section class="despedida">
                    <h1 class="animated fadeInDown pl-4 mx-auto">Gracias por preferirnos</h1>
                </section>
            </div>
        </div>
    `;
    return innerHTML;
}