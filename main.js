// ==UserScript==
// @name        Worksense seat reservator
// @namespace   Violentmonkey Scripts
// @description Adds button to reserve a seat for one week.
// @match       https://worksense.optimaze.net/floors/4949
// @grant       none
// @version     1.0
// @author      swamppe
// @downloadURL https://raw.githubusercontent.com/Swamppe/worksense-reservation-userscript/main/main.js
// @homepageURL https://github.com/Swamppe/worksense-reservation-userscript
// @description 2/24/2023, 10:07:49 AM
// @run-at      document-idle
// ==/UserScript==


const cookieFormId = "identity";
const seatFormId = "seat";
const reserveBtnId = "reserve";
const idCookieKey = "idCookie";
const seatIdKey = "seatId";

var storedId = window.localStorage.getItem(idCookieKey);
var idCookie = "";

// set stored values as input form defaults
if (storedId) idCookie = storedId;

// find and modify header; seems to load after document, so repeat until it is loaded.
let header;
if (!header) {
    let interval = setInterval(() => {
        header = document.getElementsByClassName("collapse navbar-collapse")[0];
        if (!header) return;

        // remove interval
        clearInterval(interval);
        
        // inject cookie form into header
        const cookieForm = document.createElement('div');
        cookieForm.setAttribute('class', 'd-flex');
        cookieForm.innerHTML = `<form> <label for="identity">Identity cookie:</label> <br> <input type="text" id="${cookieFormId}" name="${cookieFormId}" value=${idCookie}>`;
        header.setAttribute('idCookie', cookieForm);

        header.insertBefore(cookieForm, header.childNodes[1])
    }, 500)
}

// watch for reservation modal opening in document's body
let ms =  new MutationObserver(OnBodyChanged);
ms.observe(document.body, {childList: true});

// adds reservation functionality to modal upon detecting it has been opened.
function OnBodyChanged(e){

    if (e[0].removedNodes.length == 1) {
        return;
    }

    // create and inject one week reservation button into modal
    let container = document.getElementById('capacity-object-content');
    let reserveDiv = document.createElement('div');
    reserveDiv.setAttribute("class", "col-md-4 instant-book-wrapper ng-star-inserted");
    
    let resBtn = document.createElement('button');
    resBtn.setAttribute("class", "btn btn-block btn-instant-book btn-round btn-outline-primary");
    resBtn.innerHTML = "One week";
    reserveDiv.appendChild(resBtn);

    container.parentNode.insertBefore(reserveDiv, container);

    // add reservation function to button
    resBtn.addEventListener(
        "click", ReserveClick, false
    );
}

function ReserveClick(e) {
    // save currently set id cookie to local storage
    idCookie = document.getElementById(cookieFormId).value;
    window.localStorage.setItem(idCookieKey, idCookie);

    // there should be just one highlighted seat after clicking
    let seat = document.getElementsByClassName("seat-highlight")[0];
    // highlighted seat element id also contains seat's api id
    seatId = seat.getAttribute("id").split('-').pop();

    // prebuild request data
    let data =
    {
        "floorId": 4949,
        "capacityObjectId": seatId,
        "isPrivate": false
    };

    for (let index = 0; index < 8; index++) {

        // todo fix up date handling, its fugged when the month changes. (thanks date api)
        let start = new Date(Date.now());
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() + index);

        let end = new Date(Date.now());
        end.setDate(end.getDate() + index + 1);
        end.setHours(0, 0, 0, 0);

        data.startTime = start.toISOString();
        data.endTime = end.toISOString();

        // post reservation
        try {
            (async () => {
                await fetch('https://worksense.optimaze.net/api/v1/workstationreservations', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'cookie': idCookie
                    },
                    body: JSON.stringify(data)
                });
            })();
        } catch (error) {
            console.log(error);
        }
    };
}