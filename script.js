
function submitData() {
    let nameInput = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let subject = document.getElementById('inputSubject').value;
    let text = document.getElementById('inputText').value;

    console.info(nameInput);
    console.info(email);
    console.info(subject);
    console.info(text);


    let emailSend = 'ra66it1214@gmail.com'
    let a = document.createElement('a')

    a.href = `mailto: ${emailSend}?subject=${subject}&body=Assalamualikum, Hallo saya ${nameInput} pesan ${text}`
   
    a.click();

    let grup = {
        name: nameInput,
        email: email,
        subject: subject,
        text: text,
      }
      console.log(grup)
}


let scrollPrev = windows.pageYOffset;
  windows.onscroll = function() {
    var scrollPos = windows.pageYOffset;
      if(scrollPrev > scrollPos) {
        document.getElementById("demoscrollNav").style.top="0";

    } else {
        document.getElementById("demoscrollNav").style.top="-50px";
    }
    scrollPrev = scrollPos;
}