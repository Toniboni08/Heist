const startBtn = document.querySelector('#start');
const answerBtn = document.querySelector('#answer');
const body = document.querySelector("body");

const servers = {
    iceServers: [
        {
            "urls": ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
        }
    ],
    "iceCandidatePoolSize": 10
};

const peer = new RTCPeerConnection(servers);

startBtn.onclick = async () => {
    const localStream = await navigator.mediaDevices.getDisplayMedia();
    let remoteStream = new MediaStream();

    const videoElement = document.createElement("video");
    videoElement.srcObject = remoteStream;
    body.appendChild(videoElement);

    localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
    });

    peer.ontrack = evt => {
        evt.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    }

    const copyOfferDescriptionBtn = document.createElement("button");
    body.appendChild(copyOfferDescriptionBtn);
    copyOfferDescriptionBtn.innerHTML = "copy Offer Description";
    copyOfferDescriptionBtn.onclick = async () => {
        let candidates = [];

        peer.onicecandidate = evt => {
            if (evt.candidate != null) candidates.push(JSON.stringify(evt.candidate.toJSON()));
        };

        const offerDescription = await peer.createOffer();
        peer.setLocalDescription(offerDescription);

        navigator.clipboard.writeText(JSON.stringify({"sdp": offerDescription.sdp, "type": offerDescription.type}));


        const copyIceCandidatesBtn = document.createElement("button");
        body.appendChild(copyIceCandidatesBtn);
        copyIceCandidatesBtn.innerHTML = "copy ICE Candidates";
        copyIceCandidatesBtn.onclick = () => {
            navigator.clipboard.writeText(candidates.join("[EOL]"));

            const answerDescriptionInput = document.createElement("input");
            body.appendChild(answerDescriptionInput);
            answerDescriptionInput.placeholder = "Answer Description";

            const createCallBtn = document.createElement("button");
            body.appendChild(createCallBtn);
            createCallBtn.innerHTML = "create Call";
            createCallBtn.onclick = () => {
                if (answerDescriptionInput.value == "") return;

                peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(answerDescriptionInput.value)));
            };
        }
    }
}

answerBtn.onclick = async () => {
    const localStream = await navigator.mediaDevices.getDisplayMedia();
    let remoteStream = new MediaStream();

    const videoElement = document.createElement("video");
    body.appendChild(videoElement);
    videoElement.srcObject = remoteStream;

    localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
    });

    peer.ontrack = evt => {
        evt.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    }

    const offerDescriptionInput = document.createElement("input");
    body.appendChild(offerDescriptionInput);
    offerDescriptionInput.placeholder = "Offer Description";

    const offerIceCandidates = document.createElement("input");
    body.appendChild(offerIceCandidates);
    offerIceCandidates.placeholder = "Offer Ice Candidates";

    const createCallBtn = document.createElement("button");
    body.appendChild(createCallBtn);
    createCallBtn.innerHTML = "create Call";
    createCallBtn.onclick = async () => {
        if (offerDescriptionInput == "") return;
        if (offerIceCandidates == "") return;

        peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(offerDescriptionInput.value)));

        const answerDescription = await peer.createAnswer();
        peer.setLocalDescription(answerDescription);
        const answer = {
            "sdp": answerDescription.sdp,
            "type": answerDescription.type
        };

        let candidates = offerIceCandidates.value;
        candidates = candidates.split("[EOL]");
        console.log(candidates.length);
        candidates.forEach(candidate => {
            console.log(candidate);
            peer.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
        });


        const copyAnswerDescriptionBtn = document.createElement("button");
        body.appendChild(copyAnswerDescriptionBtn);
        copyAnswerDescriptionBtn.innerHTML = "copy Answer Description";
        copyAnswerDescriptionBtn.onclick = () => {
            navigator.clipboard.writeText(JSON.stringify(answer));
        }
    };
};