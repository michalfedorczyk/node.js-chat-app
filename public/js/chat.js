const socket = io();

// Selectors for form
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("#submit-message-form");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Template with innerHTML
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("HH:MM dddd"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  console.log(url);

  const html = Mustache.render(locationTemplate, {
    url,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (message) => {
    $messageFormButton.removeAttribute("disabled", "disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    console.log("Message was delivered. " + message);
  });
  e.value = "";
});

$locationButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (!navigator.geolocation) {
    return alert("Geolocation is not supported");
  }

  $locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const location = "https://google.com/maps?q=" + latitude + "," + longitude;

    $locationButton.removeAttribute("disabled", "disabled");

    socket.emit("sendLocation", location, (message) => {
      console.log("Location delivered! " + message);
    });
  });
});
